/* Prevent browser restoring mid-page scroll position on mobile */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ════════════════════════════════════════
   COVER DOOR — open on "View Invitation"
════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  const coverPage = document.getElementById("coverPage");
  const viewBtn   = document.getElementById("viewInvitationBtn");
  const doorCta   = document.getElementById("doorCta");
  if (!coverPage || !viewBtn) return;

  viewBtn.addEventListener("click", () => {
    if (doorCta) doorCta.classList.add("hidden");
    coverPage.classList.add("door-open");
    setTimeout(() => {
      coverPage.remove();
      document.body.classList.remove("cover-active");
      window.scrollTo(0, 0);
    }, 1700);
  });
});

/* ════════════════════════════════════════
   COUNTDOWN TIMER — with flip animation
════════════════════════════════════════ */
const weddingDate = new Date("Dec 25, 2026 19:00:00").getTime();
const pad = n => String(n).padStart(2, "0");

function setFlip(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  const newVal = pad(val);
  if (el.innerText !== newVal) {
    el.classList.remove("flip-anim");
    void el.offsetWidth;          /* force reflow so animation restarts */
    el.innerText = newVal;
    el.classList.add("flip-anim");
  }
}

function updateCountdown() {
  const gap = weddingDate - Date.now();
  if (gap <= 0) {
    ["days","hours","minutes","seconds"].forEach(id => {
      document.getElementById(id).innerText = "00";
    });
    return;
  }
  setFlip("days",    Math.floor(gap / 864e5));
  setFlip("hours",   Math.floor((gap % 864e5) / 36e5));
  setFlip("minutes", Math.floor((gap % 36e5) / 6e4));
  setFlip("seconds", Math.floor((gap % 6e4) / 1e3));
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ════════════════════════════════════════
   AOS INIT
════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  AOS.init({
    duration: 900,
    easing: "ease-out-cubic",
    once: true,
    offset: 80,
  });
});

/* ════════════════════════════════════════
   FLOATING FLOWER PETALS (tsParticles)
════════════════════════════════════════ */
tsParticles.load("tsparticles", {
  fullScreen: { enable: true, zIndex: 0 },
  particles: {
    number: { value: 30, density: { enable: true, area: 900 } },
    color: { value: ["#e8b84b", "#d4857a", "#f5d49a", "#fff"] },
    shape: {
      type: "char",
      character: [
        { value: "✿", font: "Verdana", style: "", weight: "400" },
        { value: "❀", font: "Verdana", style: "", weight: "400" },
        { value: "✾", font: "Verdana", style: "", weight: "400" },
        { value: "🌸", font: "Verdana", style: "", weight: "400" },
      ],
    },
    opacity: { value: { min: 0.3, max: 0.75 }, animation: { enable: true, speed: 0.6, minimumValue: 0.2 } },
    size:    { value: { min: 10, max: 22 } },
    move: {
      enable: true,
      speed: { min: 0.6, max: 1.8 },
      direction: "bottom",
      random: true,
      straight: false,
      outModes: { default: "out", bottom: "destroy", top: "none" },
    },
    rotate: {
      value: { min: 0, max: 360 },
      direction: "random",
      animation: { enable: true, speed: 5 },
    },
    wobble: { enable: true, distance: 12, speed: { min: -3, max: 3 } },
  },
  emitters: {
    position: { x: 50, y: -10 },
    rate: { delay: 0.2, quantity: 1 },
    size: { width: 120, height: 0 },
  },
  interactivity: {
    events: { onHover: { enable: true, mode: "repulse" } },
    modes:  { repulse: { distance: 80, duration: 0.4 } },
  },
});

/* ════════════════════════════════════════
   BACKGROUND MUSIC — with error detection
════════════════════════════════════════ */
const musicBtn   = document.getElementById("musicBtn");
const musicWrap  = document.getElementById("musicWrap");
const musicTip   = document.getElementById("musicTip");
const bgMusic    = document.getElementById("bgMusic");
const musicToast = document.getElementById("musicToast");
const toastMsg   = document.getElementById("musicToastMsg");
let   playing    = false;
let   audioOk    = true; /* flips false if file missing */

function showToast(msg, isError) {
  toastMsg.innerHTML = msg;
  musicToast.className = "music-toast show" + (isError ? " toast-error" : " toast-ok");
  clearTimeout(musicToast._t);
  musicToast._t = setTimeout(() => musicToast.classList.remove("show"), 5000);
}

function setPlaying(state) {
  playing = state;
  if (state) {
    musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
    musicBtn.classList.remove("paused");
    musicTip.textContent = "Pause music";
    musicWrap.classList.add("playing");
  } else {
    musicBtn.innerHTML = '<i class="fas fa-music"></i>';
    musicBtn.classList.add("paused");
    musicTip.textContent = "Play music";
    musicWrap.classList.remove("playing");
  }
}

function tryPlay() {
  if (!audioOk) {
    showToast('No audio file found — add <code>bismillah.mp3</code> to the <code>assets/</code> folder', true);
    return;
  }
  bgMusic.play()
    .then(() => {
      setPlaying(true);
      showToast('<i class="fas fa-music"></i> Music is playing — enjoy!', false);
    })
    .catch(err => {
      console.warn("Audio play error:", err);
      showToast('Browser blocked autoplay — click the <i class="fas fa-music"></i> button to start music', true);
    });
}

/* Detect missing / broken audio file */
bgMusic.addEventListener("error", () => {
  audioOk = false;
  musicBtn.classList.add("no-audio");
  musicTip.textContent = "No audio file";
}, true);

bgMusic.addEventListener("canplay", () => {
  audioOk = true;
  musicBtn.classList.remove("no-audio");
});

/* Music button click */
musicBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!audioOk) {
    showToast('No audio file — add <code>bismillah.mp3</code> to your <code>assets/</code> folder', true);
    return;
  }
  if (playing) {
    bgMusic.pause();
    setPlaying(false);
  } else {
    tryPlay();
  }
});

/* Show pulsing hint after 1.5 s so user notices the button */
setTimeout(() => {
  if (!playing) musicWrap.classList.add("hint");
  /* Remove hint after 3 pulses */
  setTimeout(() => musicWrap.classList.remove("hint"), 4500);
}, 1500);

/* Auto-play on very first interaction anywhere on page */
document.addEventListener("click", function autoPlay() {
  if (!playing) tryPlay();
  document.removeEventListener("click", autoPlay);
}, { once: true, capture: false });

/* ════════════════════════════════════════
   GALLERY LIGHTBOX — swipe + arrow nav
════════════════════════════════════════ */
const lightbox  = document.getElementById("lightbox");
const lbImg     = document.getElementById("lbImg");
const lbClose   = document.getElementById("lbClose");
const lbPrev    = document.getElementById("lbPrev");
const lbNext    = document.getElementById("lbNext");
const lbCounter = document.getElementById("lbCounter");

const galleryItems = [...document.querySelectorAll(".gallery-item")];
let currentIndex = 0;
let lbHistoryPushed = false;

function openLightbox(index) {
  currentIndex = index;
  lightbox.classList.remove("going-prev");
  lbImg.src = galleryItems[currentIndex].querySelector("img").src;
  lbCounter.textContent = (currentIndex + 1) + " / " + galleryItems.length;
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
  /* Push a history state so the back button closes the lightbox */
  history.pushState({ lightbox: true }, "");
  lbHistoryPushed = true;
}

function showImage(index, direction) {
  if (index < 0) index = galleryItems.length - 1;
  if (index >= galleryItems.length) index = 0;
  currentIndex = index;
  lightbox.classList.toggle("going-prev", direction === "prev");
  lbImg.style.animation = "none";
  void lbImg.offsetWidth;
  lbImg.style.animation = "";
  lbImg.src = galleryItems[currentIndex].querySelector("img").src;
  lbCounter.textContent = (currentIndex + 1) + " / " + galleryItems.length;
}

galleryItems.forEach((item, i) => {
  item.addEventListener("click", () => openLightbox(i));
});

function closeLightbox() {
  if (!lightbox.classList.contains("active")) return;
  lightbox.classList.remove("active", "going-prev");
  document.body.style.overflow = "";
  lbImg.src = "";
  /* Go back only if we pushed the state ourselves (not if back button triggered this) */
  if (lbHistoryPushed) {
    lbHistoryPushed = false;
    history.back();
  }
}

/* Back button on mobile: close lightbox instead of leaving the page */
window.addEventListener("popstate", () => {
  if (lightbox.classList.contains("active")) {
    lbHistoryPushed = false;
    lightbox.classList.remove("active", "going-prev");
    document.body.style.overflow = "";
    lbImg.src = "";
  }
});

lbClose.addEventListener("click", closeLightbox);
lbPrev.addEventListener("click", e => { e.stopPropagation(); showImage(currentIndex - 1, "prev"); });
lbNext.addEventListener("click", e => { e.stopPropagation(); showImage(currentIndex + 1, "next"); });
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });

/* Keyboard navigation */
document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("active")) return;
  if (e.key === "Escape")      closeLightbox();
  if (e.key === "ArrowRight")  showImage(currentIndex + 1, "next");
  if (e.key === "ArrowLeft")   showImage(currentIndex - 1, "prev");
});

/* Touch swipe */
let touchStartX = 0, touchStartY = 0;
lightbox.addEventListener("touchstart", e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });
lightbox.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
    if (dx < 0) showImage(currentIndex + 1, "next");
    else         showImage(currentIndex - 1, "prev");
  }
}, { passive: true });

/* ════════════════════════════════════════
   NAVBAR — scroll shrink + mobile toggle + active link
════════════════════════════════════════ */
const navbar    = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navMenu   = document.getElementById("navLinks");
const navAnchors = document.querySelectorAll(".nav-link");

/* Shrink on scroll */
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
});

/* Mobile hamburger */
navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("open");
  navMenu.classList.toggle("open");
});

/* Close menu on link click */
navAnchors.forEach(a => {
  a.addEventListener("click", () => {
    navToggle.classList.remove("open");
    navMenu.classList.remove("open");
  });
});

/* Active link highlight on scroll */
const sections = document.querySelectorAll("section[id]");

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
      });
    }
  });
}, { threshold: 0.35, rootMargin: "-60px 0px 0px 0px" });

sections.forEach(s => sectionObserver.observe(s));

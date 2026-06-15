/* ════════════════════════════════════════
   COUNTDOWN TIMER
════════════════════════════════════════ */
const weddingDate = new Date("Dec 25, 2026 19:00:00").getTime();

function updateCountdown() {
  const now  = Date.now();
  const gap  = weddingDate - now;

  if (gap <= 0) {
    document.getElementById("days").innerText    = "00";
    document.getElementById("hours").innerText   = "00";
    document.getElementById("minutes").innerText = "00";
    document.getElementById("seconds").innerText = "00";
    return;
  }

  const pad = n => String(n).padStart(2, "0");

  document.getElementById("days").innerText    = pad(Math.floor(gap / 864e5));
  document.getElementById("hours").innerText   = pad(Math.floor((gap % 864e5) / 36e5));
  document.getElementById("minutes").innerText = pad(Math.floor((gap % 36e5) / 6e4));
  document.getElementById("seconds").innerText = pad(Math.floor((gap % 6e4) / 1e3));
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
   BACKGROUND MUSIC TOGGLE
════════════════════════════════════════ */
const musicBtn = document.getElementById("musicBtn");
const bgMusic  = document.getElementById("bgMusic");
let   playing  = false;

musicBtn.addEventListener("click", () => {
  if (playing) {
    bgMusic.pause();
    musicBtn.innerHTML = '<i class="fas fa-music"></i>';
    musicBtn.classList.add("paused");
    playing = false;
  } else {
    bgMusic.play().catch(() => {});
    musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
    musicBtn.classList.remove("paused");
    playing = true;
  }
});

/* Auto-play on first user interaction */
document.addEventListener("click", function autoPlay() {
  if (!playing) {
    bgMusic.play().catch(() => {});
    musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
    musicBtn.classList.remove("paused");
    playing = true;
  }
  document.removeEventListener("click", autoPlay);
}, { once: true });

/* ════════════════════════════════════════
   GALLERY LIGHTBOX
════════════════════════════════════════ */
const lightbox = document.getElementById("lightbox");
const lbImg    = document.getElementById("lbImg");
const lbClose  = document.getElementById("lbClose");

document.querySelectorAll(".gallery-item").forEach(item => {
  item.addEventListener("click", () => {
    const src = item.querySelector("img").src;
    lbImg.src = src;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
  lbImg.src = "";
}

lbClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

/* ════════════════════════════════════════
   SMOOTH NAV HIGHLIGHT (optional)
════════════════════════════════════════ */
const sections  = document.querySelectorAll("section[id]");
const navLinks  = document.querySelectorAll("a[href^='#']");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

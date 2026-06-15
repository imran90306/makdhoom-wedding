const weddingDate =
new Date("Dec 25, 2026 19:00:00").getTime();

setInterval(() => {

let now = new Date().getTime();

let gap = weddingDate - now;

let days = Math.floor(gap/(1000*60*60*24));

let hours = Math.floor(
(gap%(1000*60*60*24))
/
(1000*60*60)
);

let minutes = Math.floor(
(gap%(1000*60*60))
/
(1000*60)
);

let seconds = Math.floor(
(gap%(1000*60))
/
1000
);

document.getElementById("days").innerText=days;
document.getElementById("hours").innerText=hours;
document.getElementById("minutes").innerText=minutes;
document.getElementById("seconds").innerText=seconds;

},1000);

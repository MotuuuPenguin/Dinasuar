/* ================================================================
   PIN ENTRY
================================================================ */

let enteredPin = "";
const correctPin = "1711";

function updateDisplay() {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById("dot-" + i);
    if (dot) {
      dot.classList.toggle("filled", i < enteredPin.length);
    }
  }
}

function addNumber(num) {
  if (enteredPin.length < 4) {
    enteredPin += num;
    updateDisplay();

    // Auto-check when 4 digits entered
    if (enteredPin.length === 4) {
      setTimeout(checkPin, 200);
    }
  }
}

function clearPin() {
  enteredPin = enteredPin.slice(0, -1);
  updateDisplay();
  document.getElementById("error-msg").innerText = "";
}

function checkPin() {
  if (enteredPin === correctPin) {
    unlockSite();
  } else {
    // Shake animation
    const lockContent = document.querySelector(".lock-content");
    lockContent.classList.add("shake");
    lockContent.addEventListener("animationend", () => {
      lockContent.classList.remove("shake");
    }, { once: true });

    // Error message
    document.getElementById("error-msg").innerText = "Wrong PIN 💔";

    // Flash dots red
    for (let i = 0; i < 4; i++) {
      const dot = document.getElementById("dot-" + i);
      if (dot) {
        dot.style.background = "#ff2d78";
        dot.style.borderColor = "#ff2d78";
        dot.style.boxShadow = "0 0 10px rgba(255,45,120,0.8)";
      }
    }

    setTimeout(() => {
      enteredPin = "";
      updateDisplay();
      document.getElementById("error-msg").innerText = "";
      for (let i = 0; i < 4; i++) {
        const dot = document.getElementById("dot-" + i);
        if (dot) {
          dot.style.background = "";
          dot.style.borderColor = "";
          dot.style.boxShadow = "";
        }
      }
    }, 800);
  }
}

function unlockSite() {
  const lockScreen = document.getElementById("lock-screen");

  // Glow effect on correct
  const glow = document.querySelector(".lock-glow-ring");
  if (glow) {
    glow.style.boxShadow = "0 0 0 24px rgba(255,45,120,0)";
    glow.style.background = "radial-gradient(circle, rgba(255,45,120,0.5), transparent)";
    glow.style.borderColor = "rgba(255,45,120,0.8)";
  }

  // Animate out
  lockScreen.classList.add("unlocking");
  setTimeout(() => {
    lockScreen.style.display = "none";
    document.body.classList.remove("locked");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, 750);
}

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") addNumber(e.key);
  if (e.key === "Backspace") clearPin();
  if (e.key === "Enter") checkPin();
});

// Init
updateDisplay();

/* ================================================================
   COUNTDOWN TIMER
================================================================ */

function updateCountdown() {
  const birthday = new Date("June 16, 2026 00:00:00").getTime();
  const now = new Date().getTime();
  const distance = birthday - now;

  if (distance <= 0) {
    document.getElementById("days").innerText    = "00";
    document.getElementById("hours").innerText   = "00";
    document.getElementById("minutes").innerText = "00";
    document.getElementById("seconds").innerText = "00";
    return;
  }

  const days    = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const pad = (n) => String(n).padStart(2, "0");

  document.getElementById("days").innerText    = pad(days);
  document.getElementById("hours").innerText   = pad(hours);
  document.getElementById("minutes").innerText = pad(minutes);
  document.getElementById("seconds").innerText = pad(seconds);

  // Pulse seconds
  const secEl = document.getElementById("seconds");
  secEl.style.transform = "scale(1.1)";
  setTimeout(() => { secEl.style.transform = "scale(1)"; }, 120);
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ================================================================
   CUSTOM CURSOR
================================================================ */

const cursor = document.querySelector(".cursor-heart");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top  = e.clientY + "px";
});

document.addEventListener("mousedown", () => {
  cursor.style.transform = "translate(-50%, -50%) scale(0.75)";
});

document.addEventListener("mouseup", () => {
  cursor.style.transform = "translate(-50%, -50%) scale(1)";
});

/* ================================================================
   PARTICLE CANVAS — floating hearts
================================================================ */

(function () {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let particles = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x      = Math.random() * canvas.width;
      this.y      = initial ? Math.random() * canvas.height : canvas.height + 20;
      this.size   = Math.random() * 12 + 6;
      this.speedY = Math.random() * 0.5 + 0.2;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.opacity = Math.random() * 0.25 + 0.05;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.015 + 0.005;
    }

    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobble) * 0.3;
      this.y -= this.speedY;
      if (this.y < -30) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = "#ff2d78";
      ctx.font = `${this.size}px serif`;
      ctx.textAlign = "center";
      ctx.fillText("♡", this.x, this.y);
      ctx.restore();
    }
  }

  // Create particles
  for (let i = 0; i < 28; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
})();

/* ================================================================
   SCROLL REVEAL — fade in sections as they enter viewport
================================================================ */

(function () {
  const targets = document.querySelectorAll(
    ".scrap-card, .timeline-content, .memory-card, .box, .movie-hero, .story-image, .story-text"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity    = "1";
          entry.target.style.transform  = entry.target.style.transform.replace("translateY(30px)", "translateY(0)");
          entry.target.style.transition = "opacity 0.7s ease, transform 0.7s ease";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => {
    el.style.opacity   = "0";
    const base = el.style.transform || "";
    el.style.transform = base + " translateY(30px)";
    observer.observe(el);
  });
})();

/* ================================================================
   NAV — scroll opacity tweak
================================================================ */

window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  if (!nav) return;
  if (window.scrollY > 60) {
    nav.style.padding = "0.75rem 4.5rem";
    nav.style.background = "rgba(6,3,9,0.85)";
  } else {
    nav.style.padding = "1.2rem 4.5rem";
    nav.style.background = "rgba(6,3,9,0.6)";
  }
});

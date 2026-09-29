const intro = document.getElementById("intro");
window.addEventListener("load", () => {
  requestAnimationFrame(() => intro.classList.add("open"));
});

const canvas = document.getElementById("dust");
const ctx = canvas.getContext("2d");
const motes = [];

function sizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
sizeCanvas();
window.addEventListener("resize", sizeCanvas);

for (let i = 0; i < 70; i++) {
  motes.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.6 + 0.3,
    s: Math.random() * 0.35 + 0.05,
    a: Math.random() * 0.55 + 0.15,
    tw: Math.random() * Math.PI * 2,
  });
}

let pointer = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.3 };
window.addEventListener("pointermove", (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
});

function frame(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 220);
  glow.addColorStop(0, "rgba(168, 85, 247, 0.16)");
  glow.addColorStop(1, "rgba(168, 85, 247, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  motes.forEach((mote) => {
    mote.y -= mote.s;
    mote.tw += 0.02;
    if (mote.y < -4) {
      mote.y = canvas.height + 4;
      mote.x = Math.random() * canvas.width;
    }
    const alpha = mote.a * (0.65 + Math.sin(mote.tw) * 0.35);
    ctx.save();
    ctx.translate(mote.x, mote.y);
    ctx.rotate(mote.tw);
    ctx.fillStyle = `rgba(226, 210, 255, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(0, -mote.r * 2.2);
    ctx.lineTo(mote.r, 0);
    ctx.lineTo(0, mote.r * 2.2);
    ctx.lineTo(-mote.r, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
  requestAnimationFrame(frame);
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  requestAnimationFrame(frame);
}

const reveal = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        reveal.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);
document.querySelectorAll("[data-reveal]").forEach((node) => reveal.observe(node));

const caButton = document.querySelector(".ca");
if (caButton) {
  caButton.addEventListener("click", async () => {
    const address = caButton.getAttribute("data-ca");
    try {
      await navigator.clipboard.writeText(address);
    } catch (error) {
      const field = document.createElement("textarea");
      field.value = address;
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    const label = caButton.querySelector("em");
    label.textContent = "Copied";
    caButton.classList.add("copied");
    window.setTimeout(() => {
      label.textContent = "Copy";
      caButton.classList.remove("copied");
    }, 1600);
  });
}

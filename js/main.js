// Reveal on scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// Custom cursor ("grow on hover") — mouse devices only, respects reduced motion
(() => {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const root = document.documentElement;
  const HOVER_TARGETS = "a, button";
  const EASE = 0.15; // ring moves 15% toward the mouse each frame

  let dot = null;
  let ring = null;
  let frameId = null;
  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  const place = (el, x, y) => {
    el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  };

  const onMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!root.classList.contains("cursor-visible")) {
      // First move (or re-entering the window): snap the ring to the mouse
      ringX = mouseX;
      ringY = mouseY;
      root.classList.add("cursor-visible");
    }
    place(dot, mouseX, mouseY);
  };

  const onOver = (e) => {
    ring.classList.toggle("is-hovering", !!e.target.closest(HOVER_TARGETS));
  };

  const onOut = (e) => {
    // relatedTarget is null when the mouse leaves the window
    if (!e.relatedTarget) root.classList.remove("cursor-visible");
  };

  const tick = () => {
    ringX += (mouseX - ringX) * EASE;
    ringY += (mouseY - ringY) * EASE;
    place(ring, ringX, ringY);
    frameId = requestAnimationFrame(tick);
  };

  const makeEl = (className) => {
    const el = document.createElement("div");
    el.className = className;
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
    return el;
  };

  const enable = () => {
    if (dot) return;
    dot = makeEl("cursor-dot");
    ring = makeEl("cursor-ring");
    root.classList.add("has-custom-cursor");
    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    frameId = requestAnimationFrame(tick);
  };

  const disable = () => {
    if (!dot) return;
    cancelAnimationFrame(frameId);
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseover", onOver);
    document.removeEventListener("mouseout", onOut);
    dot.remove();
    ring.remove();
    dot = ring = null;
    root.classList.remove("has-custom-cursor", "cursor-visible");
  };

  const update = () =>
    finePointer.matches && !reducedMotion.matches ? enable() : disable();

  finePointer.addEventListener("change", update);
  reducedMotion.addEventListener("change", update);
  update();
})();

// Navbar color switch — black over light sections, white over dark sections
const navEl = document.querySelector('header nav');
const workSection = document.getElementById('work');

if (navEl && workSection) {
  window.addEventListener('scroll', () => {
    const workTop = workSection.getBoundingClientRect().top;
    if (workTop <= 80) {
      navEl.classList.add('nav-dark');
    } else {
      navEl.classList.remove('nav-dark');
    }
  }, { passive: true });
}

// Mobile menu toggle
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });
}
// Each skill releases its "signature line" of code on hover
const skillLines = {
  "JavaScript": 'console.log("hello");',
  "Python": "def main():",
  "Java": "public static void main(String[] args) {",
  "SQL": "SELECT * FROM shifts;",
  "HTML": "<!doctype html>",
  "CSS": "body { margin: 0; }",
  "Tailwind CSS": 'class="flex gap-4"',
  "Node.js": "node server.js",
  "Express": 'app.get("/", (req, res) => {',
  "PostgreSQL": "CREATE TABLE shifts (",
  "Git": 'git commit -m "first"',
  "GitHub Actions": "on: push",
  "Playwright": 'await page.click("Log shift");',
};

const canHover = matchMedia("(hover: hover)").matches;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canHover && !reduceMotion) {
  document.querySelectorAll(".skill-tag").forEach((tag) => {
    const line = skillLines[tag.textContent.trim()];
    if (!line) return;
    tag.addEventListener("mouseenter", () => {
      const ghost = document.createElement("span");
      ghost.className = "code-ghost";
      ghost.setAttribute("aria-hidden", "true");
      ghost.textContent = line;
      tag.appendChild(ghost);
      ghost.addEventListener("animationend", () => ghost.remove());
    });
  });
}

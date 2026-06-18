/* ============================================================
   CATÁLOGO DE EQUÍVOCOS CELESTES — script.js
   1) Fundo estrelado animado em <canvas> (estilo "gif" contínuo)
   2) Filtro de categorias dos cartões
   3) Flip por toque, para telas sem mouse
   ============================================================ */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------------------------------------
     1) FUNDO ESTRELADO
  --------------------------------------------------------- */

  const canvas = document.getElementById("stars-canvas");
  const ctx = canvas.getContext("2d");

  let width, height, dpr;
  let stars = [];
  let shootingStars = [];

  const LAYERS = [
    { count: 90, speed: 0.012, sizeRange: [0.4, 1.0], alphaRange: [0.2, 0.55] },
    { count: 55, speed: 0.03, sizeRange: [0.7, 1.6], alphaRange: [0.35, 0.8] },
    { count: 30, speed: 0.06, sizeRange: [1.1, 2.2], alphaRange: [0.5, 1] }
  ];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildStars();
  }

  function buildStars() {
    stars = [];
    LAYERS.forEach((layer, layerIndex) => {
      for (let i = 0; i < layer.count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r:
            layer.sizeRange[0] +
            Math.random() * (layer.sizeRange[1] - layer.sizeRange[0]),
          baseAlpha:
            layer.alphaRange[0] +
            Math.random() * (layer.alphaRange[1] - layer.alphaRange[0]),
          twinkleSpeed: 0.4 + Math.random() * 1.2,
          twinklePhase: Math.random() * Math.PI * 2,
          driftSpeed: layer.speed,
          layer: layerIndex
        });
      }
    });
  }

  function maybeSpawnShootingStar() {
    if (prefersReducedMotion) return;
    if (Math.random() < 0.004 && shootingStars.length < 2) {
      const startX = Math.random() * width * 0.7 + width * 0.15;
      const startY = Math.random() * height * 0.35;
      const angle = Math.PI / 5 + Math.random() * 0.3;
      shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * 9,
        vy: Math.sin(angle) * 9,
        life: 0,
        maxLife: 38 + Math.random() * 20
      });
    }
  }

  let t = 0;

  function draw() {
    t += 1;
    ctx.clearRect(0, 0, width, height);

    // estrelas
    for (const s of stars) {
      let alpha = s.baseAlpha;
      if (!prefersReducedMotion) {
        alpha =
          s.baseAlpha *
          (0.65 + 0.35 * Math.sin(t * 0.02 * s.twinkleSpeed + s.twinklePhase));

        s.y += s.driftSpeed;
        if (s.y > height + 4) {
          s.y = -4;
          s.x = Math.random() * width;
        }
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(243, 239, 228, ${Math.max(alpha, 0)})`;
      ctx.fill();
    }

    // estrelas cadentes
    maybeSpawnShootingStar();
    shootingStars = shootingStars.filter((star) => star.life < star.maxLife);

    for (const star of shootingStars) {
      const progress = star.life / star.maxLife;
      const fade = progress < 0.7 ? 1 : 1 - (progress - 0.7) / 0.3;
      const tailX = star.x - star.vx * 4;
      const tailY = star.y - star.vy * 4;

      const grad = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
      grad.addColorStop(0, `rgba(228, 204, 151, ${0.9 * fade})`);
      grad.addColorStop(1, "rgba(228, 204, 151, 0)");

      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.moveTo(star.x, star.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      star.x += star.vx;
      star.y += star.vy;
      star.life += 1;
    }

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(draw);

  /* ---------------------------------------------------------
     2) FILTRO DE CATEGORIAS
  --------------------------------------------------------- */

  const filterButtons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        const matches = filter === "todos" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !matches);
      });
    });
  });

  /* ---------------------------------------------------------
     3) FLIP POR TOQUE (dispositivos sem hover, ex: celular)
  --------------------------------------------------------- */

  const hasHover = window.matchMedia("(hover: hover)").matches;

  if (!hasHover) {
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        card.classList.toggle("is-flipped");
      });
    });
  }
})();

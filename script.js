/* =========================================================
   MITOS & FATOS DO COSMOS — comportamento
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  buildStarfield();
  startShootingStars();
  drawConstellations();
  enableTouchFlip();
});

/* ---------------------------------------------------------
   1) Campo de estrelas cintilantes (efeito "gif" de fundo)
   --------------------------------------------------------- */
function buildStarfield() {
  const field = document.getElementById('starfield');
  if (!field) return;

  const TOTAL_STARS = 150;
  const frag = document.createDocumentFragment();

  for (let i = 0; i < TOTAL_STARS; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    const size = (Math.random() * 1.6 + 0.6).toFixed(2); // 0.6px a 2.2px
    const top = (Math.random() * 100).toFixed(2);
    const left = (Math.random() * 100).toFixed(2);
    const duration = (Math.random() * 3 + 2).toFixed(2); // 2s a 5s
    const delay = (Math.random() * 5).toFixed(2);

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${top}%`;
    star.style.left = `${left}%`;
    star.style.animationDuration = `${duration}s`;
    star.style.animationDelay = `${delay}s`;

    if (Math.random() < 0.12) star.classList.add('bright');

    frag.appendChild(star);
  }

  field.appendChild(frag);
}

/* ---------------------------------------------------------
   2) Estrelas cadentes ocasionais
   --------------------------------------------------------- */
function startShootingStars() {
  const spawn = () => {
    const star = document.createElement('div');
    star.className = 'shooting-star';

    const startTop = Math.random() * 50; // parte superior da tela
    const startLeft = Math.random() * 70 + 10;
    const dx = -(Math.random() * 30 + 20); // viaja para a esquerda/baixo
    const dy = Math.random() * 20 + 15;

    star.style.top = `${startTop}%`;
    star.style.left = `${startLeft}%`;
    star.style.setProperty('--dx', `${dx}vw`);
    star.style.setProperty('--dy', `${dy}vh`);

    document.body.appendChild(star);
    star.addEventListener('animationend', () => star.remove());
  };

  // primeira estrela cadente logo no início, depois em intervalos aleatórios
  setTimeout(spawn, 1200);
  setInterval(() => {
    if (Math.random() < 0.7) spawn();
  }, 4500);
}

/* ---------------------------------------------------------
   3) Mini-constelações decorativas em cada carta (frente)
   --------------------------------------------------------- */
function drawConstellations() {
  const svgs = document.querySelectorAll('.constellation');

  svgs.forEach((svg) => {
    const POINTS = Math.floor(Math.random() * 3) + 5; // 5 a 7 pontos
    const points = [];

    for (let i = 0; i < POINTS; i++) {
      points.push({
        x: Math.random() * 150 + 5,
        y: Math.random() * 80 + 5
      });
    }

    // linhas conectando os pontos em sequência
    for (let i = 0; i < points.length - 1; i++) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', points[i].x);
      line.setAttribute('y1', points[i].y);
      line.setAttribute('x2', points[i + 1].x);
      line.setAttribute('y2', points[i + 1].y);
      svg.appendChild(line);
    }

    // pontos (estrelas da constelação)
    points.forEach((p) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', p.x);
      circle.setAttribute('cy', p.y);
      circle.setAttribute('r', (Math.random() * 1 + 1).toFixed(2));
      svg.appendChild(circle);
    });
  });
}

/* ---------------------------------------------------------
   4) Suporte a toque: dispositivos sem hover usam clique
   --------------------------------------------------------- */
function enableTouchFlip() {
  const hasHover = window.matchMedia('(hover: hover)').matches;
  if (hasHover) return; // desktop já usa :hover via CSS

  document.querySelectorAll('.card').forEach((card) => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
}

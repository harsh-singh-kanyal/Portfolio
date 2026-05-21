// ===== THEME INITIALIZATION =====
const savedTheme = localStorage.getItem('theme');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', initialTheme);

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
  highlightNav();
});

function highlightNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinksEl.classList.toggle('open'));
navLinks.forEach(l => l.addEventListener('click', () => navLinksEl.classList.remove('open')));

// ===== ROLE FADE ANIMATION =====
const roles = ['AI Developer', 'ML Engineer', 'LLM Specialist', 'Computer Vision Dev', 'Agentic AI Builder'];
let roleIdx = 0;
const roleEl = document.getElementById('role-text');

// Add a quick fade transition style
roleEl.style.transition = "opacity 0.4s ease";

function cycleRole() {
  roleEl.style.opacity = 0; // fade out
  setTimeout(() => {
    roleIdx = (roleIdx + 1) % roles.length;
    roleEl.textContent = roles[roleIdx];
    roleEl.style.opacity = 1; // fade in
  }, 400); // wait for fade out to complete
}

// Initial set
roleEl.textContent = roles[0];
setInterval(cycleRole, 2500);

// ===== INTERSECTION OBSERVER - SKILL BARS =====
const profFills = document.querySelectorAll('.prof-fill');
const skillsSection = document.getElementById('skills');
let barsAnimated = false;

const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !barsAnimated) {
      barsAnimated = true;
      profFills.forEach(fill => {
        const w = fill.getAttribute('data-width');
        fill.style.width = w + '%';
      });
    }
  });
}, { threshold: 0.3 });

if (skillsSection) skillObserver.observe(skillsSection);

// ===== FADE-IN ON SCROLL =====
const fadeEls = document.querySelectorAll('.glass-card, .section-header, .hero-content, .timeline-item');

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  fadeObserver.observe(el);
});

// ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== CURSOR GLOW EFFECT =====
const glow = document.createElement('div');
glow.style.cssText = `position:fixed;pointer-events:none;z-index:9999;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(99,102,241,0.06),transparent 70%);transform:translate(-50%,-50%);transition:left 0.1s,top 0.1s;`;
document.body.appendChild(glow);
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

// ===== COUNTER ANIMATION =====
function animateCount(el, target, suffix = '') {
  let start = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target + suffix; clearInterval(timer); return; }
    el.textContent = (Number.isInteger(target) ? Math.floor(start) : start.toFixed(1)) + suffix;
  }, 25);
}

const heroSection = document.getElementById('home');
let countersRun = false;
const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersRun) {
      countersRun = true;
      const statNums = document.querySelectorAll('.stat-num');
      const vals = [2, 5, 8.3];
      const suffixes = ['+', '+', ''];
      statNums.forEach((el, i) => animateCount(el, vals[i], suffixes[i]));
    }
  });
}, { threshold: 0.5 });
if (heroSection) heroObserver.observe(heroSection);

// ===== YEAR =====
const yearEls = document.querySelectorAll('.year');
yearEls.forEach(el => el.textContent = new Date().getFullYear());

// ===== SKILLS PIE CHART =====
let chartInstance = null;
function initOrUpdateChart(theme) {
  const textColor = theme === 'dark' ? '#f1f5f9' : '#1e1b4b';
  const tooltipBg = theme === 'dark' ? 'rgba(21, 27, 45, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const container = document.getElementById('skillsPieChart');
  if (!container) return;
  
  if (chartInstance && chartInstance.update) {
    chartInstance.update({
      tooltip: {
        backgroundColor: tooltipBg,
        style: {
          color: textColor
        }
      },
      legend: {
        itemStyle: {
          color: textColor
        }
      }
    });
  } else {
    chartInstance = Highcharts.chart('skillsPieChart', {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 55,
          beta: 0
        },
        backgroundColor: 'transparent'
      },
      title: {
        text: null
      },
      tooltip: {
        backgroundColor: tooltipBg,
        borderColor: 'rgba(99,102,241,0.2)',
        borderRadius: 8,
        style: {
          color: textColor,
          fontFamily: "'Inter', sans-serif",
          fontSize: '14px',
          fontWeight: 'bold'
        },
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 45,
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      legend: {
        itemStyle: {
          color: textColor,
          fontFamily: "'Inter', sans-serif",
          fontSize: '14px'
        },
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
      colors: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
      series: [{
        type: 'pie',
        name: 'Proficiency',
        data: [
          ['Python', 95],
          ['Machine Learning', 88],
          ['NLP & LLMs', 85],
          ['Computer Vision', 80],
          ['Deployment & MLOps', 75]
        ]
      }],
      credits: {
        enabled: false
      }
    });
  }
}

// ===== DOM CONTENT LOADED (Theme Switcher Setup & Chart Init) =====
document.addEventListener("DOMContentLoaded", () => {
  // Initialize dynamic chart
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  initOrUpdateChart(currentTheme);
});

// ===== NEURAL NETWORK CANVAS BACKGROUND =====
(function() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], mouse = { x: -999, y: -999 };
  const NODE_COUNT = 80, MAX_DIST = 160, NODE_RADIUS = 2.5;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * NODE_RADIUS + 1.5,
        hue: Math.random() > 0.5 ? 245 : 270 // indigo or violet
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Move nodes
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;

      // Mouse repulsion
      const dx = n.x - mouse.x, dy = n.y - mouse.y;
      const md = Math.sqrt(dx * dx + dy * dy);
      if (md < 100) {
        n.x += (dx / md) * 1.5;
        n.y += (dy / md) * 1.5;
      }
    });

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 2.5);
      grad.addColorStop(0, `hsla(${n.hue},80%,65%,0.9)`);
      grad.addColorStop(1, `hsla(${n.hue},80%,65%,0)`);
      ctx.fillStyle = grad;
      ctx.arc(n.x, n.y, n.r * 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createNodes(); });
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  resize();
  createNodes();
  draw();
})();



// ===== CLICK RIPPLE EFFECT =====
document.addEventListener('click', e => {
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position:fixed; left:${e.clientX}px; top:${e.clientY}px;
    width:0; height:0; border-radius:50%;
    border:2px solid rgba(99,102,241,0.6);
    transform:translate(-50%,-50%);
    pointer-events:none; z-index:9999;
    animation:ripple-expand 0.6s ease-out forwards;
  `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
});

// Inject ripple keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-expand {
    0%   { width:0;     height:0;     opacity:1; }
    100% { width:120px; height:120px; opacity:0; }
  }
  .glass-card, .project-card, .achieve-card { will-change: transform; }
`;
document.head.appendChild(style);

// ===== PARTICLE BACKGROUND =====
class ParticleCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.connections = [];
    this.mouse = { x: null, y: null };
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    this.init();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    const count = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 15000));
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? 'rgba(0,255,136,' : 'rgba(0,180,255,',
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color + p.alpha + ')';
      this.ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = 'rgba(0,255,136,' + (0.08 * (1 - dist / 120)) + ')';
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }

      // Mouse interaction
      if (this.mouse.x !== null) {
        const mDist = Math.hypot(p.x - this.mouse.x, p.y - this.mouse.y);
        if (mDist < 150) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = 'rgba(0,180,255,' + (0.15 * (1 - mDist / 150)) + ')';
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    });
    requestAnimationFrame(() => this.animate());
  }
}

// ===== TYPING EFFECT =====
class TypeWriter {
  constructor(element, texts, speed = 80, pause = 2000) {
    this.element = element;
    this.texts = texts;
    this.speed = speed;
    this.pause = pause;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.type();
  }

  type() {
    const currentText = this.texts[this.textIndex];
    if (this.isDeleting) {
      this.charIndex--;
    } else {
      this.charIndex++;
    }
    this.element.innerHTML = currentText.substring(0, this.charIndex) + '<span class="cursor"></span>';
    let delay = this.isDeleting ? 40 : this.speed;
    if (!this.isDeleting && this.charIndex === currentText.length) {
      delay = this.pause;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      delay = 500;
    }
    setTimeout(() => this.type(), delay);
  }
}

// ===== ROUTER =====
function navigateTo(page) {
  window.location.hash = page;
}

function handleRoute() {
  const hash = window.location.hash.slice(1) || 'home';
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + hash);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Trigger reveal animations
    setTimeout(() => triggerReveals(), 100);
    // Trigger skill bar animations on about page
    if (hash === 'about') {
      setTimeout(() => animateSkillBars(), 300);
    }
  }
  // Update nav active state
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + hash);
  });
  // Close mobile nav
  document.querySelector('.nav-links')?.classList.remove('open');
}

// ===== SKILL BAR ANIMATION =====
function animateSkillBars() {
  document.querySelectorAll('.bar-fill').forEach(bar => {
    const target = bar.getAttribute('data-level');
    bar.style.width = target + '%';
  });
}

// ===== REVEAL ON SCROLL =====
function triggerReveals() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, i * 100);
  });
}

// ===== RESUME MODAL =====
function openResume() {
  document.getElementById('resume-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeResume() {
  document.getElementById('resume-modal').classList.remove('active');
  document.body.style.overflow = '';
}

function downloadResume() {
  const link = document.createElement('a');
  link.href = 'RESUME.png';
  link.download = 'Bhuvan_Resume.png';
  link.click();
}

// ===== CERTIFICATE MODAL =====
function viewCertificate(name) {
  alert('Certificate image for "' + name + '" will be available soon!\nBhuvan will add the certificate files shortly.');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Particles
  const canvas = document.getElementById('particle-canvas');
  if (canvas) new ParticleCanvas(canvas);

  // Typing effect
  const typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    new TypeWriter(typingEl, [
      '> Focused on Optical Physics & Medical Diagnostics',
      '> Skilled in MATLAB, LabVIEW, Python',
      '> NIMHANS Research Intern',
      '> Raman Spectroscopy Researcher',
      '> Building the Future of Healthcare'
    ]);
  }

  // Routing
  window.addEventListener('hashchange', handleRoute);
  handleRoute();

  // Hamburger
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      document.querySelector('.nav-links').classList.toggle('open');
    });
  }

  // Resume modal close on overlay click
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeResume();
    });
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeResume();
  });

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

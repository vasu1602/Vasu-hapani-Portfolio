/**
 * Vasu Hapani - Portfolio JavaScript
 * Modern Linear/Vercel Dark Luxe Aesthetic with Interactive Skills Physics Arena
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initTerminalTypewriter();
  initSkillsArenaAndFilter();
  initProjectModals();
  initResumeModal();
  initCopyButtons();
  initContactForm();
  initToastDemoButtons();
  initCardSpotlight();
  init3DCardTilt();
  initGlobalBackground();
  initVisitorCounter();
});

/* ==========================================================================
   1. Theme Management (Multi-Theme Preset Engine)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlRoot = document.documentElement;
  
  const themeList = [
    { id: 'tokyo', name: 'Cyberpunk Neo-Tokyo 🌌' },
    { id: 'emerald', name: 'Emerald Matrix 💎' },
    { id: 'sunset', name: 'Cosmic Sunset Rose 🔥' },
    { id: 'dark', name: 'Midnight Obsidian ⚡' },
    { id: 'light', name: 'Frosted Alpine Light ☀️' }
  ];

  const savedTheme = localStorage.getItem('vasu_portfolio_theme') || 'tokyo';
  htmlRoot.setAttribute('data-theme', savedTheme);

  themeToggleBtn?.addEventListener('click', () => {
    const currentTheme = htmlRoot.getAttribute('data-theme') || 'tokyo';
    const currentIndex = themeList.findIndex(t => t.id === currentTheme);
    const nextIndex = (currentIndex + 1) % themeList.length;
    const nextTheme = themeList[nextIndex];
    
    htmlRoot.setAttribute('data-theme', nextTheme.id);
    localStorage.setItem('vasu_portfolio_theme', nextTheme.id);
  });
}

/* ==========================================================================
   2. Navigation & Mobile Menu & Active Spy & Scroll Control
   ========================================================================== */
function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Disable browser automatic scroll restoration to previous stale hash (e.g. #contact)
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Ensure fresh page visits and reloads start at the top Hero section
  const currentHash = window.location.hash;
  if (!currentHash || currentHash === '#contact' || currentHash === '#hero') {
    window.scrollTo(0, 0);
    if (currentHash === '#contact' || currentHash === '#hero') {
      history.replaceState(null, document.title, window.location.pathname + window.location.search);
    }
  }

  window.addEventListener('load', () => {
    if (!window.location.hash || window.location.hash === '#contact' || window.location.hash === '#hero') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  });

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // Smooth scroll for all internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, '', targetId);
      }
    });
  });

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   3. Card Spotlight Flashlight Effect (Linear/Vercel Style)
   ========================================================================== */
function initCardSpotlight() {
  const cards = document.querySelectorAll('.card-spotlight, .about-card, .highlight-card, .skill-card, .project-card, .timeline-card, .contact-card, .contact-form-panel, .terminal-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   4. Interactive 3D Card Tilt on Hover
   ========================================================================== */
function init3DCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const tiltCards = document.querySelectorAll('.project-card, .terminal-card, .highlight-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ==========================================================================
   5. Interactive Skills Physics Arena & Category Filtering & View Switcher
   ========================================================================== */
function initSkillsArenaAndFilter() {
  const canvas = document.getElementById('skillsArenaCanvas');
  const arenaContainer = document.getElementById('skillsArenaContainer');
  const skillsGrid = document.getElementById('skillsGrid');
  const viewArenaBtn = document.getElementById('viewArenaBtn');
  const viewGridBtn = document.getElementById('viewGridBtn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const gridCards = document.querySelectorAll('.skill-card');

  if (!canvas || !arenaContainer) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let activeFilter = 'all';

  function resizeArena() {
    width = canvas.width = arenaContainer.clientWidth;
    height = canvas.height = arenaContainer.clientHeight;
  }
  resizeArena();
  window.addEventListener('resize', resizeArena);

  // Preload Official Vector SVG Logos for Razor-Sharp Canvas Rendering
  const svgIcons = {
    react: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 115.3 100"><ellipse cx="57.65" cy="50" rx="14" ry="46.5" transform="rotate(30 57.65 50)" fill="none" stroke="%2361DAFB" stroke-width="6"/><ellipse cx="57.65" cy="50" rx="14" ry="46.5" transform="rotate(90 57.65 50)" fill="none" stroke="%2361DAFB" stroke-width="6"/><ellipse cx="57.65" cy="50" rx="14" ry="46.5" transform="rotate(150 57.65 50)" fill="none" stroke="%2361DAFB" stroke-width="6"/><circle cx="57.65" cy="50" r="8" fill="%2361DAFB"/></svg>`,
    nextjs: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><circle cx="90" cy="90" r="90" fill="%23000000"/><path fill="%23FFFFFF" d="M149.5 149.5L78.8 54H54v72h14.4V72.2l62.4 78.5c5.9-4 11.3-8.8 16-14.2z"/><path fill="%23FFFFFF" d="M115.2 54h14.4v72h-14.4z"/></svg>`,
    typescript: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="3" fill="%233178C6"/><path d="M13.5 10.5h-3v9h-2.2v-9h-3V8.8h8.2v1.7zm7.5 3.3c-.2-.7-.7-1.2-1.3-1.6-.6-.4-1.4-.6-2.4-.6-.7 0-1.3.1-1.8.4-.5.3-.7.8-.7 1.3 0 .4.2.8.6 1 .4.3 1 .5 1.7.8l1.1.4c1.2.4 2.1 1 2.7 1.6.5.7.8 1.5.8 2.5 0 1.4-.5 2.4-1.5 3.1-1 .7-2.3 1-3.9 1-1.5 0-2.8-.4-3.8-1-1-.7-1.7-1.6-2.1-2.8l2.2-1.2c.3.8.7 1.4 1.4 1.8.6.4 1.5.6 2.4.6.8 0 1.5-.2 2-.6.5-.4.8-.9.8-1.5 0-.5-.2-.9-.6-1.1-.4-.3-1-.5-1.8-.8l-1.1-.4c-1.2-.4-2.1-1-2.6-1.6-.6-.6-.8-1.5-.8-2.4 0-1.2.5-2.2 1.5-2.9 1-.7 2.2-1.1 3.7-1.1 1.3 0 2.4.3 3.3.9 1 .6 1.6 1.4 2 2.4l-2.2 1.2z" fill="%23ffffff"/></svg>`,
    javascript: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="3" fill="%23F7DF1E"/><path d="M12.5 17.5c.5.8 1.2 1.3 2.3 1.3 1.2 0 1.9-.6 1.9-1.5 0-1-.8-1.4-2.2-2l-.7-.3c-2.1-.9-3.5-2-3.5-4.4 0-2.2 1.7-3.9 4.3-3.9 1.9 0 3.2.7 4.1 2.3l-2 1.3c-.5-.8-1-1.2-2.1-1.2-.9 0-1.6.6-1.6 1.3 0 .8.6 1.2 1.9 1.8l.7.3c2.4 1 3.9 2.2 3.9 4.7 0 2.7-2.1 4.2-4.7 4.2-2.6 0-4.3-1.3-5-2.9l2.3-1.2zm-6.6.2c.4.7.8 1.2 1.7 1.2.8 0 1.4-.3 1.4-1.7V6.9h2.8v10.4c0 2.8-1.7 4-4 4-2.2 0-3.6-1.1-4.3-2.6l2.4-1z" fill="%23000000"/></svg>`,
    html5: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23E34F26" d="M1.5 0h21l-1.9 21.3L12 24l-8.6-2.7z"/><path fill="%23EF652A" d="M12 22.1l7.1-2.2 1.6-18H12z"/><path fill="%23ECECEC" d="M12 9.5H8.3l-.2-2.7H12V4.3H5.3l.8 8.1H12zm0 7.3l-3.9-1-.3-3.2H5.3l.5 5.8 6.2 1.7z"/><path fill="%23FFFFFF" d="M12 9.5h3.7l-.3 3.9-3.4.9v2.9l6.2-1.7.5-5.9H12zm0-5.2v2.5h6.4l.2-2.5z"/></svg>`,
    css3: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%231572B6" d="M1.5 0h21l-1.9 21.3L12 24l-8.6-2.7z"/><path fill="%2333A9DC" d="M12 22.1l7.1-2.2 1.6-18H12z"/><path fill="%23ECECEC" d="M12 9.5H8.3l-.2-2.7H12V4.3H5.3l.8 8.1H12zm0 7.3l-3.9-1-.3-3.2H5.3l.5 5.8 6.2 1.7z"/><path fill="%23FFFFFF" d="M12 9.5h3.7l-.3 3.9-3.4.9v2.9l6.2-1.7.5-5.9H12zm0-5.2v2.5h6.4l.2-2.5z"/></svg>`,
    bootstrap: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%237952B3" d="M3.6 0h16.8C22.4 0 24 1.6 24 3.6v16.8c0 2-1.6 3.6-3.6 3.6H3.6C1.6 24 0 22.4 0 20.4V3.6C0 1.6 1.6 0 3.6 0z"/><path fill="%23FFFFFF" d="M15.4 12.3c.8-.6 1.3-1.5 1.3-2.6 0-2.2-1.8-3.7-4.4-3.7H7.5v12h5.3c2.7 0 4.7-1.6 4.7-3.9 0-1.4-.8-2.5-2.1-3.1v-.1zm-4.7-4c1.1 0 1.9.7 1.9 1.8s-.8 1.8-1.9 1.8h-2.1V8.3h2.1zm.4 7.4h-2.5v-3.7h2.5c1.3 0 2.2.8 2.2 2s-.9 1.7-2.2 1.7z"/></svg>`,
    tailwind: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%2306B6D4" d="M12 6c-2.4 0-3.9 1.2-4.5 3.6 1-.8 2.1-1.1 3.3-.8.7.2 1.2.7 1.7 1.3C13.4 11.2 14.8 13 18 13c2.4 0 3.9-1.2 4.5-3.6-1 .8-2.1 1.1-3.3.8-.7-.2-1.2-.7-1.7-1.3C16.6 7.8 15.2 6 12 6zm-6 7c-2.4 0-3.9 1.2-4.5 3.6 1-.8 2.1-1.1 3.3-.8.7.2 1.2.7 1.7 1.3 1 1.1 2.4 2.9 5.5 2.9 2.4 0 3.9-1.2 4.5-3.6-1 .8-2.1 1.1-3.3.8-.7-.2-1.2-.7-1.7-1.3-1-1.1-2.4-2.9-5.5-2.9z"/></svg>`,
    git: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23F05032" d="M23.5 10.7L13.3.5c-.7-.7-1.8-.7-2.5 0L8.5 2.8 11 5.3c.7-.2 1.6 0 2.2.6.6.6.8 1.4.6 2.2l2.4 2.4c.8-.2 1.6 0 2.2.6 1 1 1 2.5 0 3.5-.9 1-2.5 1-3.5 0-.7-.7-.9-1.6-.7-2.4L11.8 9.8v5.5c.2.2.3.4.4.7 1 1 1 2.5 0 3.5-1 1-2.5 1-3.5 0-1-1-1-2.5 0-3.5.3-.3.8-.5 1.3-.6V9.6c-.5-.1-1-.3-1.3-.6-.7-.7-.9-1.6-.7-2.4L5.6 4.2.5 9.3c-.7.7-.7 1.8 0 2.5l10.2 10.2c.7.7 1.8.7 2.5 0l10.3-10.3c.7-.7.7-1.8 0-2.5z"/></svg>`
  };

  const loadedImages = {};
  Object.keys(svgIcons).forEach(key => {
    const img = new Image();
    img.src = svgIcons[key];
    loadedImages[key] = img;
  });

  // Curated 9 Modern Frontend Skills
  const skillsList = [
    { label: 'React.js', iconKey: 'react', category: 'react', color: '#61DAFB', glow: 'rgba(97, 218, 251, 0.5)' },
    { label: 'Next.js', iconKey: 'nextjs', category: 'react', color: '#FFFFFF', glow: 'rgba(255, 255, 255, 0.5)' },
    { label: 'TypeScript', iconKey: 'typescript', category: 'languages', color: '#3178C6', glow: 'rgba(49, 120, 198, 0.5)' },
    { label: 'JavaScript', iconKey: 'javascript', category: 'languages', color: '#F7DF1E', glow: 'rgba(247, 223, 30, 0.5)' },
    { label: 'HTML5', iconKey: 'html5', category: 'languages styling', color: '#E34F26', glow: 'rgba(227, 79, 38, 0.5)' },
    { label: 'CSS3', iconKey: 'css3', category: 'styling', color: '#1572B6', glow: 'rgba(21, 114, 182, 0.5)' },
    { label: 'Tailwind CSS', iconKey: 'tailwind', category: 'styling', color: '#06B6D4', glow: 'rgba(6, 182, 212, 0.5)' },
    { label: 'Bootstrap', iconKey: 'bootstrap', category: 'styling', color: '#7952B3', glow: 'rgba(121, 82, 179, 0.5)' },
    { label: 'Git & GitHub', iconKey: 'git', category: 'styling', color: '#F05032', glow: 'rgba(240, 80, 50, 0.5)' }
  ];

  class ArenaSkillBubble {
    constructor(def, index, total) {
      this.label = def.label;
      this.iconKey = def.iconKey;
      this.category = def.category;
      this.color = def.color;
      this.glow = def.glow;
      
      this.width = Math.min(165, Math.max(130, def.label.length * 9 + 52));
      this.height = 44;
      this.radius = 22;

      // Distribute across full screen width
      const cols = 5;
      const col = index % cols;
      const row = Math.floor(index / cols);
      this.x = (width * 0.06) + (col * (width * 0.19)) + (Math.random() - 0.5) * 60;
      this.y = (height * 0.18) + (row * (height * 0.32)) + (Math.random() - 0.5) * 50;

      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.driftSpeed = Math.random() * 0.35 + 0.55; // Smooth continuous rightward drift
      this.time = Math.random() * 1000;
    }

    update(mouseInside, mouseX, mouseY) {
      this.time += 0.02;

      // Horizontal movement: velocity + smooth continuous rightward drift
      this.x += this.vx + this.driftSpeed;

      // Vertical movement: velocity + buoyant floating wave
      this.y += this.vy + Math.sin(this.time * 0.8) * 0.35;

      // Velocity damping (smooth fluid momentum)
      this.vx *= 0.985;
      this.vy *= 0.985;

      // Seamless Horizontal Screen Looping (Exit Right -> Enter from Left!)
      if (this.x > width + 25) {
        this.x = -this.width - 20;
        this.y = Math.random() * (height - this.height - 40) + 20;
      } else if (this.x < -this.width - 30) {
        this.x = width + 20;
        this.y = Math.random() * (height - this.height - 40) + 20;
      }

      // Vertical Bouncing (Contained strictly within Top & Bottom Borders)
      const margin = 14;
      if (this.y < margin) {
        this.y = margin;
        this.vy = Math.abs(this.vy) * 0.85 + 0.2;
      } else if (this.y + this.height > height - margin) {
        this.y = height - margin - this.height;
        this.vy = -Math.abs(this.vy) * 0.85 - 0.2;
      }

      // Responsive Interactive Mouse Repulsion Push
      if (mouseInside) {
        const cX = this.x + this.width / 2;
        const cY = this.y + this.height / 2;
        const dx = cX - mouseX;
        const dy = cY - mouseY;
        const dist = Math.hypot(dx, dy);

        if (dist < 180 && dist > 1) {
          const force = (1 - dist / 180) * 5.0;
          const angle = Math.atan2(dy, dx);
          this.vx += Math.cos(angle) * force;
          this.vy += Math.sin(angle) * force;
        }
      }
    }

    draw(isLight) {
      const isMatch = activeFilter === 'all' || this.category.includes(activeFilter);
      ctx.save();

      const x = this.x;
      const y = this.y;
      const w = this.width;
      const h = this.height;
      const r = this.radius;

      ctx.globalAlpha = isMatch ? 1.0 : 0.25;

      // Rounded Capsule Path
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();

      // Capsule Glass Fill
      ctx.fillStyle = isLight 
        ? (isMatch ? 'rgba(255, 255, 255, 0.94)' : 'rgba(255, 255, 255, 0.4)')
        : (isMatch ? 'rgba(15, 23, 42, 0.88)' : 'rgba(15, 23, 42, 0.35)');
      ctx.fill();

      // Glowing Border
      ctx.strokeStyle = isMatch ? this.glow : 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = isMatch ? 1.8 : 1.0;
      ctx.stroke();

      // Draw Official Vector SVG Logo Icon
      const iconImg = loadedImages[this.iconKey];
      const iconSize = 22;
      const iconX = x + 12;
      const iconY = y + (h - iconSize) / 2;

      if (iconImg && iconImg.complete) {
        ctx.drawImage(iconImg, iconX, iconY, iconSize, iconSize);
      }

      // Draw Skill Label
      ctx.font = '600 13.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isLight ? '#0f172a' : '#F8FAFC';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.label, iconX + iconSize + 9, y + h / 2 + 1);

      ctx.restore();
    }
  }

  let arenaBubbles = skillsList.map((def, idx) => new ArenaSkillBubble(def, idx, skillsList.length));

  // Local Arena Mouse State
  const arenaMouse = {
    x: -9999,
    y: -9999,
    isInside: false
  };

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    arenaMouse.x = e.clientX - rect.left;
    arenaMouse.y = e.clientY - rect.top;
    arenaMouse.isInside = true;
  });

  canvas.addEventListener('mouseleave', () => {
    arenaMouse.isInside = false;
    arenaMouse.x = -9999;
    arenaMouse.y = -9999;
  });

  // Touch Support for Arena
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      arenaMouse.x = e.touches[0].clientX - rect.left;
      arenaMouse.y = e.touches[0].clientY - rect.top;
      arenaMouse.isInside = true;
    }
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    arenaMouse.isInside = false;
  });

  // Click scatter inside Arena
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    arenaBubbles.forEach(b => {
      const cX = b.x + b.width / 2;
      const cY = b.y + b.height / 2;
      const dx = cX - clickX;
      const dy = cY - clickY;
      const dist = Math.hypot(dx, dy);

      if (dist < 220 && dist > 1) {
        const force = (1 - dist / 220) * 6.5;
        const angle = Math.atan2(dy, dx);
        b.vx += Math.cos(angle) * force;
        b.vy += Math.sin(angle) * force;
      }
    });
  });

  // Category Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeFilter = btn.getAttribute('data-filter');

      // Update grid cards visibility if in Grid View
      gridCards.forEach(card => {
        const categories = card.getAttribute('data-category');
        if (activeFilter === 'all' || categories.includes(activeFilter)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease';
            card.style.opacity = '1';
          }, 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // View Switcher (Arena vs Grid)
  viewArenaBtn?.addEventListener('click', () => {
    viewArenaBtn.classList.add('active');
    viewGridBtn.classList.remove('active');
    arenaContainer.style.display = 'block';
    skillsGrid.style.display = 'none';
    resizeArena();
  });

  viewGridBtn?.addEventListener('click', () => {
    viewGridBtn.classList.add('active');
    viewArenaBtn.classList.remove('active');
    arenaContainer.style.display = 'none';
    skillsGrid.style.display = 'grid';
  });

  // Animation Loop for Skills Arena
  let isArenaActive = true;
  function animateArena() {
    if (!isArenaActive) return;

    if (arenaContainer.style.display !== 'none') {
      ctx.clearRect(0, 0, width, height);
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';

      // Soft bubble collision
      const len = arenaBubbles.length;
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          const b1 = arenaBubbles[i];
          const b2 = arenaBubbles[j];
          const c1X = b1.x + b1.width / 2;
          const c1Y = b1.y + b1.height / 2;
          const c2X = b2.x + b2.width / 2;
          const c2Y = b2.y + b2.height / 2;

          const dx = c2X - c1X;
          const dy = c2Y - c1Y;
          const dist = Math.hypot(dx, dy);
          const minDist = 95;

          if (dist < minDist && dist > 1) {
            const overlap = (minDist - dist) * 0.03;
            const angle = Math.atan2(dy, dx);
            b1.vx -= Math.cos(angle) * overlap;
            b1.vy -= Math.sin(angle) * overlap;
            b2.vx += Math.cos(angle) * overlap;
            b2.vy += Math.sin(angle) * overlap;
          }
        }
      }

      arenaBubbles.forEach(b => {
        b.update(arenaMouse.isInside, arenaMouse.x, arenaMouse.y);
        b.draw(isLight);
      });
    }

    requestAnimationFrame(animateArena);
  }

  requestAnimationFrame(animateArena);
}

/* ==========================================================================
   6. Project Deep Dive Modal System with 4-Photo Carousel
   ========================================================================== */
const projectData = {
  'apex-tournament': {
    title: 'Apex Velocity — Grand Prix Auction 2026',
    badge: 'Real-Time Telemetry & 60FPS Canvas Engine',
    images: [
      {
        src: 'assets/images/apex-slide-1.png',
        title: 'Live Auction Arena & Driver Pool (Tier S–D Bidding)'
      },
      {
        src: 'assets/images/apex-slide-2.png',
        title: 'Qualifiers — Championship Matches & Live Standings'
      },
      {
        src: 'assets/images/apex-slide-3.png',
        title: 'Head-to-Head Draw Slots & Real-Time Fixtures'
      },
      {
        src: 'assets/images/apex-slide-4.png',
        title: 'Racing Teams & Purse Budget Balances'
      }
    ],
    github: 'https://github.com/vasu1602/apex-tournament',
    overview: 'High-octane real-time racing tournament auction platform featuring dynamic team purse budgeting, live driver auction gavel, role delegation, multi-window telemetry sync via BroadcastChannel API, and an animated 60+ FPS speedway canvas background.',
    techStack: ['JavaScript (ES6+)', 'HTML5 Canvas (60FPS)', 'BroadcastChannel API', 'CSS3 Animations', 'State Machines', 'Vercel Serverless'],
    architecture: 'Decoupled event-driven client state machine synchronized across browser windows in real-time with BroadcastChannel and Vercel serverless persistence.',
    features: [
      'Engineered a live auctioneer & spectator bidding arena with real-time gavel hammer-down validation.',
      'Implemented Multi-Window Telemetry Sync using the BroadcastChannel API for zero-latency cross-tab coordination between judges, auctioneers, and spectator screens.',
      'Constructed dynamic team purse management with hard-limit overdraft prevention and Tier S/A/B/C/D driver classifications.',
      'Built a high-performance 60+ FPS HTML5 Canvas racetrack background featuring animated sports cars, nitro flame bursts, and glowing neon light trails.',
      'Created Race Control Admin Panel for managing live rosters, modifying starting budgets, and controlling tournament stages.'
    ]
  }
};

function initProjectModals() {
  const projectModal = document.getElementById('projectModal');
  const modalProjectTitle = document.getElementById('modalProjectTitle');
  const modalProjectBody = document.getElementById('modalProjectBody');
  const closeBtn = document.getElementById('closeProjectModalBtn');
  const triggerBtns = document.querySelectorAll('.btn-project-detail');

  let activeCarouselImages = [];
  let currentSlideIndex = 0;

  function updateCarouselSlide(index) {
    if (!activeCarouselImages.length) return;
    if (index < 0) index = activeCarouselImages.length - 1;
    if (index >= activeCarouselImages.length) index = 0;
    currentSlideIndex = index;

    const slides = modalProjectBody.querySelectorAll('.modal-carousel-slide');
    const dots = modalProjectBody.querySelectorAll('.modal-dot');
    const caption = modalProjectBody.querySelector('#carouselCaption');

    slides.forEach((s, idx) => s.classList.toggle('active', idx === currentSlideIndex));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === currentSlideIndex));
    if (caption) {
      caption.textContent = `${currentSlideIndex + 1}/${activeCarouselImages.length}: ${activeCarouselImages[currentSlideIndex].title}`;
    }
  }

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      const project = projectData[projectId];

      if (!project) return;

      activeCarouselImages = project.images || [{ src: project.image, title: project.title }];
      currentSlideIndex = 0;

      modalProjectTitle.textContent = project.title;
      modalProjectBody.innerHTML = `
        <div class="modal-carousel" id="modalCarousel">
          <div class="modal-carousel-track">
            ${activeCarouselImages.map((img, idx) => `
              <div class="modal-carousel-slide ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                <img src="${img.src}" alt="${img.title}" class="modal-carousel-img">
              </div>
            `).join('')}
            <button class="modal-carousel-btn modal-carousel-prev" id="carouselPrevBtn" aria-label="Previous Slide">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button class="modal-carousel-btn modal-carousel-next" id="carouselNextBtn" aria-label="Next Slide">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
          <div class="modal-carousel-footer">
            <span class="modal-carousel-caption" id="carouselCaption">1/${activeCarouselImages.length}: ${activeCarouselImages[0].title}</span>
            <div class="modal-carousel-dots" id="carouselDots">
              ${activeCarouselImages.map((_, idx) => `
                <button class="modal-dot ${idx === 0 ? 'active' : ''}" data-slide="${idx}" aria-label="Slide ${idx + 1}"></button>
              `).join('')}
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
          ${project.techStack.map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>
        
        <p style="font-size: 1rem; color: var(--text-secondary); line-height: 1.65; margin-bottom: 1.25rem;">
          ${project.overview}
        </p>

        <div class="modal-spec-grid">
          <div class="modal-spec-box">
            <div class="modal-spec-title">Project Type</div>
            <div class="modal-spec-value">${project.badge}</div>
          </div>
          <div class="modal-spec-box">
            <div class="modal-spec-title">Architecture</div>
            <div class="modal-spec-value">${project.architecture}</div>
          </div>
        </div>

        <h4 class="modal-section-heading">Key Technical Highlights & Implementation</h4>
        <ul class="modal-bullet-list">
          ${project.features.map(f => `<li>${f}</li>`).join('')}
        </ul>

        <div style="margin-top: 1.75rem; display: flex; gap: 0.75rem; justify-content: flex-end; flex-wrap: wrap;">
          <button class="btn btn-secondary btn-sm" id="closeModalInnerBtn">Close Specs</button>
          ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 0.4rem;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> GitHub Repo</a>` : ''}
          <a href="#contact" class="btn btn-primary btn-sm" id="discussProjectBtn">Discuss with Vasu</a>
        </div>
      `;

      // Carousel controls setup
      const prevBtn = modalProjectBody.querySelector('#carouselPrevBtn');
      const nextBtn = modalProjectBody.querySelector('#carouselNextBtn');
      const dotBtns = modalProjectBody.querySelectorAll('.modal-dot');

      prevBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        updateCarouselSlide(currentSlideIndex - 1);
      });

      nextBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        updateCarouselSlide(currentSlideIndex + 1);
      });

      dotBtns.forEach(d => {
        d.addEventListener('click', (e) => {
          e.stopPropagation();
          const target = parseInt(d.getAttribute('data-slide'), 10);
          updateCarouselSlide(target);
        });
      });

      document.getElementById('closeModalInnerBtn')?.addEventListener('click', closeProjectModal);
      document.getElementById('discussProjectBtn')?.addEventListener('click', () => {
        closeProjectModal();
      });

      projectModal.classList.add('open');
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
      const aura = document.getElementById('cursorGlowAura');
      const dot = document.getElementById('cursorDot');
      if (aura) aura.style.opacity = '0';
      if (dot) dot.style.opacity = '0';
    });
  });

  function closeProjectModal() {
    projectModal.classList.remove('open');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeProjectModal);

  projectModal?.addEventListener('click', (e) => {
    if (e.target === projectModal) {
      closeProjectModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (projectModal.classList.contains('open')) {
      if (e.key === 'Escape') {
        closeProjectModal();
      } else if (e.key === 'ArrowLeft') {
        updateCarouselSlide(currentSlideIndex - 1);
      } else if (e.key === 'ArrowRight') {
        updateCarouselSlide(currentSlideIndex + 1);
      }
    }
  });
}

/* ==========================================================================
   7. Resume Modal & Print Handler
   ========================================================================== */
function initResumeModal() {
  const resumeModal = document.getElementById('resumeModal');
  const openNavBtn = document.getElementById('openResumeNavBtn');
  const openHeroBtn = document.getElementById('heroResumeBtn');
  const closeBtn = document.getElementById('closeResumeModalBtn');
  const printBtn = document.getElementById('printResumeBtn');

  function openResume() {
    resumeModal.classList.add('open');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    const aura = document.getElementById('cursorGlowAura');
    const dot = document.getElementById('cursorDot');
    if (aura) aura.style.opacity = '0';
    if (dot) dot.style.opacity = '0';
  }

  function closeResume() {
    resumeModal.classList.remove('open');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  openNavBtn?.addEventListener('click', openResume);
  openHeroBtn?.addEventListener('click', openResume);
  closeBtn?.addEventListener('click', closeResume);

  printBtn?.addEventListener('click', () => {
    window.print();
  });

  resumeModal?.addEventListener('click', (e) => {
    if (e.target === resumeModal) {
      closeResume();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal.classList.contains('open')) {
      closeResume();
    }
  });
}

/* ==========================================================================
   8. Copy-to-Clipboard Functionality
   ========================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.contact-copy-btn[data-copy]');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      const originalHTML = btn.innerHTML;
      try {
        await navigator.clipboard.writeText(textToCopy);
        btn.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-secondary);"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        btn.classList.add('copied');

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.classList.remove('copied');
        }, 2200);
      } catch (err) {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    });
  });
}

/* ==========================================================================
   9. Contact Form Handler & Feedback
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('senderName');
    const emailInput = document.getElementById('senderEmail');
    const subjectInput = document.getElementById('senderSubject');
    const messageInput = document.getElementById('senderMessage');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Please fill out all fields before sending.', 'warning');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'warning');
      emailInput.focus();
      return;
    }

    const sendBtn = document.getElementById('sendMsgBtn');
    const originalBtnContent = sendBtn.innerHTML;
    sendBtn.disabled = true;
    sendBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
      Sending message...
    `;

    setTimeout(() => {
      sendBtn.disabled = false;
      sendBtn.innerHTML = originalBtnContent;
      contactForm.reset();

      showToast(`Thank you ${name}! Opening mail client to send to vasuhapani2005@gmail.com...`);
      
      const mailtoLink = `mailto:vasuhapani2005@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
      window.location.href = mailtoLink;
    }, 900);
  });
}

/* ==========================================================================
   10. Live Preview Toast Triggers
   ========================================================================== */
function initToastDemoButtons() {
  const demoButtons = document.querySelectorAll('.btn-demo-toast');
  demoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      showToast(`Previewing ${name} specifications. Click 'View Technical Deep Dive' for architecture details!`);
    });
  });
}

/* ==========================================================================
   11. Toast Notification System
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  container.innerHTML = ''; // Prevent toast stacking

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  const iconSvg = type === 'warning' 
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (container.contains(toast)) {
        container.removeChild(toast);
      }
    }, 300);
  }, 3500);
}

/* ==========================================================================
   12. Cybernetic Fluid Wave Ribbons & Bioluminescent Embers Background
   ========================================================================== */
function initGlobalBackground() {
  const canvas = document.getElementById('bgCanvas');
  const aura = document.getElementById('cursorGlowAura');
  const dot = document.getElementById('cursorDot');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const mouse = {
    x: width / 2,
    y: height / 2,
    targetX: width / 2,
    targetY: height / 2,
    speed: 0,
    lastX: width / 2,
    lastY: height / 2,
    isActive: false
  };

  function handleResize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initWaves();
  }
  window.addEventListener('resize', handleResize);

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.isActive = true;

    if (aura) {
      aura.style.opacity = '1';
      aura.style.transform = `translate(${mouse.targetX}px, ${mouse.targetY}px)`;
    }
    if (dot) {
      dot.style.opacity = '1';
      dot.style.transform = `translate(${mouse.targetX}px, ${mouse.targetY}px)`;
    }
  });

  window.addEventListener('mouseleave', () => {
    mouse.isActive = false;
    mouse.targetX = width / 2;
    mouse.targetY = height / 2;
    if (aura) aura.style.opacity = '0';
    if (dot) dot.style.opacity = '0';
  });

  // Touch Support
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.targetX = e.touches[0].clientX;
      mouse.targetY = e.touches[0].clientY;
      mouse.isActive = true;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse.isActive = false;
  });

  // Click shockwave pulse
  const pulses = [];
  window.addEventListener('click', (e) => {
    pulses.push({
      x: e.clientX,
      y: e.clientY,
      radius: 10,
      maxRadius: 220,
      alpha: 0.6
    });
  });

  // Wave Ribbon Configurations
  let waves = [];
  function initWaves() {
    waves = [
      {
        baseY: height * 0.32,
        amplitude: 55,
        frequency: 0.0018,
        speed: 0.008,
        colorStart: 'rgba(99, 102, 241, 0.35)',
        colorMid: 'rgba(6, 182, 212, 0.45)',
        colorEnd: 'rgba(168, 85, 247, 0.25)',
        lineWidth: 2.2,
        phase: 0
      },
      {
        baseY: height * 0.48,
        amplitude: 75,
        frequency: 0.0014,
        speed: -0.006,
        colorStart: 'rgba(6, 182, 212, 0.4)',
        colorMid: 'rgba(56, 189, 248, 0.5)',
        colorEnd: 'rgba(99, 102, 241, 0.3)',
        lineWidth: 2.6,
        phase: Math.PI * 0.5
      },
      {
        baseY: height * 0.65,
        amplitude: 65,
        frequency: 0.002,
        speed: 0.007,
        colorStart: 'rgba(168, 85, 247, 0.35)',
        colorMid: 'rgba(244, 63, 94, 0.38)',
        colorEnd: 'rgba(6, 182, 212, 0.25)',
        lineWidth: 2.0,
        phase: Math.PI
      },
      {
        baseY: height * 0.82,
        amplitude: 50,
        frequency: 0.0016,
        speed: -0.005,
        colorStart: 'rgba(99, 102, 241, 0.25)',
        colorMid: 'rgba(168, 85, 247, 0.35)',
        colorEnd: 'rgba(56, 189, 248, 0.2)',
        lineWidth: 1.8,
        phase: Math.PI * 1.5
      }
    ];
  }
  initWaves();

  // Glowing Flowing Embers
  const emberCount = 38;
  const embers = [];
  for (let i = 0; i < emberCount; i++) {
    embers.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.random() * 0.8 + 0.3,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2.2 + 1.2,
      color: Math.random() > 0.5 ? '#38bdf8' : (Math.random() > 0.5 ? '#a855f7' : '#818cf8'),
      baseAlpha: Math.random() * 0.5 + 0.3,
      pulse: Math.random() * 10
    });
  }

  let isRunning = true;
  document.addEventListener('visibilitychange', () => {
    isRunning = !document.hidden;
    if (isRunning) requestAnimationFrame(animate);
  });

  let time = 0;

  function animate() {
    if (!isRunning) return;

    time += 1;
    ctx.clearRect(0, 0, width, height);
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    // Mouse spring interpolation and velocity calculation
    const dx = mouse.targetX - mouse.x;
    const dy = mouse.targetY - mouse.y;
    mouse.x += dx * 0.1;
    mouse.y += dy * 0.1;
    mouse.speed = Math.hypot(dx, dy);

    // Draw Expanding Click Pulses
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.radius += 4;
      p.alpha *= 0.95;

      ctx.save();
      ctx.strokeStyle = isLight ? `rgba(79, 70, 229, ${p.alpha})` : `rgba(6, 182, 212, ${p.alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      if (p.alpha < 0.02 || p.radius > p.maxRadius) {
        pulses.splice(i, 1);
      }
    }

    // Render Topological Wave Ribbons
    waves.forEach((w, waveIdx) => {
      w.phase += w.speed;
      const step = 20;
      const points = [];

      for (let x = 0; x <= width + step; x += step) {
        // Multi-frequency harmonic wave
        let y = w.baseY + 
          Math.sin(x * w.frequency + w.phase) * w.amplitude +
          Math.cos(x * w.frequency * 0.6 + w.phase * 1.3) * (w.amplitude * 0.35);

        // Interactive Cursor Fluid Wake & Displacement
        if (mouse.isActive) {
          const mDist = Math.hypot(x - mouse.x, y - mouse.y);
          if (mDist < 200) {
            const push = (1 - mDist / 200) * 45 * Math.sin(time * 0.05 + waveIdx);
            y += push;
          }
        }

        points.push({ x, y });
      }

      // Draw Smooth Spline Ribbon Curve
      ctx.save();
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, w.colorStart);
      grad.addColorStop(0.5, w.colorMid);
      grad.addColorStop(1, w.colorEnd);

      ctx.strokeStyle = grad;
      ctx.lineWidth = isLight ? w.lineWidth * 0.8 : w.lineWidth;
      ctx.shadowColor = w.colorMid;
      ctx.shadowBlur = isLight ? 4 : 12;

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.stroke();
      ctx.restore();
    });

    // Draw and Update Flowing Embers
    embers.forEach(e => {
      e.pulse += 0.03;
      e.x += e.vx;
      e.y += e.vy + Math.sin(e.pulse) * 0.3;

      // Wrap around edges
      if (e.x > width + 20) {
        e.x = -20;
        e.y = Math.random() * height;
      }
      if (e.y < -20) e.y = height + 20;
      if (e.y > height + 20) e.y = -20;

      // Mouse gentle repulsion
      if (mouse.isActive) {
        const mdx = e.x - mouse.x;
        const mdy = e.y - mouse.y;
        const mDist = Math.hypot(mdx, mdy);
        if (mDist < 140 && mDist > 1) {
          const force = (1 - mDist / 140) * 1.8;
          e.x += (mdx / mDist) * force;
          e.y += (mdy / mDist) * force;
        }
      }

      const alpha = e.baseAlpha + Math.sin(e.pulse) * 0.25;
      ctx.save();
      ctx.fillStyle = e.color;
      ctx.globalAlpha = Math.max(0.1, alpha);
      ctx.shadowColor = e.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/* ==========================================================================
   13. Interactive Terminal Code Typewriter Animation
   ========================================================================== */
function initTerminalTypewriter() {
  const terminalBody = document.getElementById('terminalCodeBody');
  const replayBtn = document.getElementById('replayTypewriterBtn');
  if (!terminalBody) return;

  const linesData = [
    [
      { text: "const ", cls: "code-keyword" },
      { text: "engineer", cls: "code-prop" },
      { text: " = {" }
    ],
    [
      { text: "  name", cls: "code-prop" },
      { text: ': ' },
      { text: '"Hapani Vasu"', cls: "code-str" },
      { text: ',' }
    ],
    [
      { text: "  role", cls: "code-prop" },
      { text: ': ' },
      { text: '"Frontend Engineer"', cls: "code-str" },
      { text: ',' }
    ],
    [
      { text: "  internship", cls: "code-prop" },
      { text: ': ' },
      { text: '"6Origin (15 Wk Web Dev)"', cls: "code-str" },
      { text: ',' }
    ],
    [
      { text: "  coreStack", cls: "code-prop" },
      { text: ': [' }
    ],
    [
      { text: '    ' },
      { text: '"React.js"', cls: "code-str" },
      { text: ', ' },
      { text: '"Next.js"', cls: "code-str" },
      { text: ', ' },
      { text: '"TypeScript"', cls: "code-str" },
      { text: ',' }
    ],
    [
      { text: '    ' },
      { text: '"Tailwind CSS"', cls: "code-str" },
      { text: ', ' },
      { text: '"JavaScript (ES6+)"', cls: "code-str" }
    ],
    [
      { text: '  ],' }
    ],
    [
      { text: "  location", cls: "code-prop" },
      { text: ': ' },
      { text: '"Vadodara, Gujarat (Parul Univ)"', cls: "code-str" },
      { text: ',' }
    ],
    [
      { text: "  passion", cls: "code-prop" },
      { text: ': ' },
      { text: '"Building high-performance UI/UX"', cls: "code-str" },
      { text: ',' }
    ],
    [
      { text: "  readyToJoin", cls: "code-prop" },
      { text: ': ' },
      { text: 'true', cls: "code-num" }
    ],
    [
      { text: '};' }
    ]
  ];

  let isTyping = false;
  let typingTimeoutId = null;

  function runTypewriter() {
    if (isTyping) return;
    isTyping = true;
    clearTimeout(typingTimeoutId);
    terminalBody.innerHTML = '';

    let lineIndex = 0;
    let tokenIndex = 0;
    let charIndex = 0;

    let currentLineEl = document.createElement('span');
    currentLineEl.className = 'code-line';
    terminalBody.appendChild(currentLineEl);

    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    currentLineEl.appendChild(cursor);

    let currentTokenSpan = null;

    function typeNextChar() {
      if (lineIndex >= linesData.length) {
        isTyping = false;
        return;
      }

      const line = linesData[lineIndex];

      if (tokenIndex >= line.length) {
        lineIndex++;
        tokenIndex = 0;
        charIndex = 0;
        currentTokenSpan = null;

        if (lineIndex < linesData.length) {
          currentLineEl = document.createElement('span');
          currentLineEl.className = 'code-line';
          terminalBody.appendChild(currentLineEl);
          currentLineEl.appendChild(cursor);
          typingTimeoutId = setTimeout(typeNextChar, 50);
        } else {
          isTyping = false;
        }
        return;
      }

      const token = line[tokenIndex];

      if (!currentTokenSpan) {
        currentTokenSpan = document.createElement('span');
        if (token.cls) currentTokenSpan.className = token.cls;
        currentLineEl.insertBefore(currentTokenSpan, cursor);
      }

      if (charIndex < token.text.length) {
        currentTokenSpan.textContent += token.text[charIndex];
        charIndex++;
        const char = token.text[charIndex - 1];
        const delay = (char === ',' || char === ':') ? 35 : (char === ' ' ? 8 : 14);
        typingTimeoutId = setTimeout(typeNextChar, delay);
      } else {
        tokenIndex++;
        charIndex = 0;
        currentTokenSpan = null;
        typingTimeoutId = setTimeout(typeNextChar, 6);
      }
    }

    typingTimeoutId = setTimeout(typeNextChar, 250);
  }

  // Run on page load
  runTypewriter();

  // Replay button support
  replayBtn?.addEventListener('click', () => {
    isTyping = false;
    clearTimeout(typingTimeoutId);
    runTypewriter();
  });
}

/* ==========================================================================
   14. Live Viewer / Visitor Counter Dashboard
   ========================================================================== */
function initVisitorCounter() {
  const visitorCountEl = document.getElementById('visitorCount');
  if (!visitorCountEl) return;

  const BASE_COUNT = 1078;
  const STORAGE_KEY = 'vasu_portfolio_visitors';
  const SESSION_KEY = 'vasu_portfolio_session_visited';

  let currentCount = parseInt(localStorage.getItem(STORAGE_KEY), 10);
  if (isNaN(currentCount) || currentCount < BASE_COUNT) {
    currentCount = BASE_COUNT;
  }

  // Increment on new user session
  if (!sessionStorage.getItem(SESSION_KEY)) {
    currentCount += 1;
    localStorage.setItem(STORAGE_KEY, currentCount.toString());
    sessionStorage.setItem(SESSION_KEY, 'true');
  }

  // Try optional live cloud hit API for multi-device sync
  try {
    fetch('https://api.counterapi.dev/v1/vasu-hapani-portfolio/visits/up')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.count === 'number') {
          const apiCount = BASE_COUNT + data.count;
          if (apiCount > currentCount) {
            currentCount = apiCount;
            localStorage.setItem(STORAGE_KEY, currentCount.toString());
            animateCounter(currentCount);
          }
        }
      })
      .catch(() => {
        // Safe graceful fallback to local persistent counter
      });
  } catch (err) {
    // Ignore fetch issues
  }

  // Smooth count-up animation
  function animateCounter(target) {
    const start = Math.max(BASE_COUNT - 60, target - 45);
    const duration = 850;
    const startTime = performance.now();

    function update(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const count = Math.floor(start + (target - start) * easeOut);
      visitorCountEl.textContent = count.toLocaleString('en-US');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        visitorCountEl.textContent = target.toLocaleString('en-US');
      }
    }

    requestAnimationFrame(update);
  }

  animateCounter(currentCount);
}

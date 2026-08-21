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
    liveDemo: 'https://apex-tournament-ten.vercel.app/',
    overview: 'High-octane real-time racing tournament auction platform featuring dynamic team purse budgeting, live driver auction gavel, role delegation, multi-window telemetry sync via BroadcastChannel API, and an animated 60+ FPS speedway canvas background.',
    techStack: ['JavaScript', 'HTML', 'CSS', 'Realtime', 'Vercel'],
    architecture: 'Decoupled event-driven client state machine synchronized across browser windows in real-time with BroadcastChannel and Vercel serverless persistence.',
    features: [
      'Engineered a live auctioneer & spectator bidding arena with real-time gavel hammer-down validation.',
      'Implemented Multi-Window Telemetry Sync using the BroadcastChannel API for zero-latency cross-tab coordination between judges, auctioneers, and spectator screens.',
      'Constructed dynamic team purse management with hard-limit overdraft prevention and Tier S/A/B/C/D driver classifications.',
      'Built a high-performance 60+ FPS HTML5 Canvas racetrack background featuring animated sports cars, nitro flame bursts, and glowing neon light trails.',
      'Created Race Control Admin Panel for managing live rosters, modifying starting budgets, and controlling tournament stages.'
    ]
  },
  'get-your-drive': {
    title: 'Get Your Drive — Luxury Car Rental & Fleet Platform',
    badge: 'Full-Stack • Firebase Realtime Database',
    images: [
      {
        src: 'assets/images/get-your-drive-slide-1.png',
        title: 'Fleet Discovery, Category Filters & Dynamic Search'
      },
      {
        src: 'assets/images/get-your-drive-slide-2.png',
        title: '3-Step 6-Digit OTP Email Verification Flow'
      },
      {
        src: 'assets/images/get-your-drive-slide-3.png',
        title: 'Secure Account Creation & Password Setup'
      },
      {
        src: 'assets/images/get-your-drive-slide-4.png',
        title: 'Dynamic Vehicle Listing & Built-in HTML5 Photo Cropper'
      }
    ],
    github: 'https://github.com/vasu1602/Get-your-Drive',
    liveDemo: 'https://get-your-drive.netlify.app',
    overview: 'A modern full-stack luxury car rental web application featuring rich glassmorphism design, real-time Firebase Realtime Database cloud synchronization, 6-digit OTP email verification via Resend.com / Gmail SMTP, interactive HTML5 Canvas photo cropping, dynamic fleet management, and instant booking vouchers.',
    techStack: ['JavaScript', 'Node.js', 'Firebase', 'Netlify', 'HTML5 Canvas', 'REST APIs'],
    architecture: 'Client-server architecture combining Netlify/Express serverless functions with Firebase Realtime Database bidirectional cloud sync and JWT session persistence.',
    features: [
      'Engineered a 3-step OTP verification and account security flow with Resend API / Gmail SMTP and bcrypt password hashing.',
      'Built bidirectional live cloud synchronization with Firebase Realtime Database for users, vehicle specs, reservations, and audit activity logs.',
      'Implemented dynamic fleet catalog with category filtering (Sedans, SUVs, EVs, Sports, Luxury), live search, and dynamic date-based price calculation.',
      'Constructed an interactive HTML5 Canvas photo cropper with drag-to-pan, 1x–3x zoom slider, 90° rotation, and client-side compression for user avatars and fleet uploads.',
      'Deployed production-ready full-stack application on Netlify with serverless API functions and instant booking confirmation vouchers.'
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
          ${project.liveDemo ? `<a href="${project.liveDemo}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 0.4rem;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> Live Demo</a>` : ''}
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
   12. Quantum Cyber-Synapse & Hyper-Dimensional Gravitational Flux Field
   ========================================================================== */
function initGlobalBackground() {
  const canvas = document.getElementById('bgCanvas');
  const aura = document.getElementById('cursorGlowAura');
  const dot = document.getElementById('cursorDot');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const focalLength = 650;
  const cx = () => width / 2;
  const cy = () => height / 2;

  const mouse = {
    x: width / 2,
    y: height / 2,
    targetX: width / 2,
    targetY: height / 2,
    vx: 0,
    vy: 0,
    speed: 0,
    lastX: width / 2,
    lastY: height / 2,
    isActive: false,
    radius: 260
  };

  function handleResize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    init3DElements();
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

  // Supernova Chromatic Blast on Click
  const supernovas = [];
  window.addEventListener('click', (e) => {
    supernovas.push({
      x: e.clientX,
      y: e.clientY,
      radius: 5,
      maxRadius: 280,
      alpha: 0.85,
      growthSpeed: 8,
      chromaOffset: 0
    });

    // Kinetic impulse to 3D crystals and quantum particles
    quantumNodes.forEach(n => {
      const p = project3D(n.x, n.y, n.z);
      const dx = p.x2d - e.clientX;
      const dy = p.y2d - e.clientY;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < 320) {
        const force = (1 - dist / 320) * 35;
        n.vx += (dx / dist) * force;
        n.vy += (dy / dist) * force;
        n.vz += (Math.random() - 0.5) * force * 1.5;
      }
    });

    crystals.forEach(c => {
      const p = project3D(c.x, c.y, c.z);
      const dx = p.x2d - e.clientX;
      const dy = p.y2d - e.clientY;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < 360) {
        const force = (1 - dist / 360) * 25;
        c.vx += (dx / dist) * force;
        c.vy += (dy / dist) * force;
        c.rotSpeedX += (Math.random() - 0.5) * 0.08;
        c.rotSpeedY += (Math.random() - 0.5) * 0.08;
      }
    });
  });

  // 3D Matrix Utilities
  function rotate3D(v, rx, ry, rz) {
    let y1 = v.y * Math.cos(rx) - v.z * Math.sin(rx);
    let z1 = v.y * Math.sin(rx) + v.z * Math.cos(rx);
    let x2 = v.x * Math.cos(ry) + z1 * Math.sin(ry);
    let z2 = -v.x * Math.sin(ry) + z1 * Math.cos(ry);
    let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
    let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);
    return { x: x3, y: y3, z: z2 };
  }

  function project3D(x, y, z) {
    const scale = focalLength / Math.max(focalLength + z, 80);
    return {
      x2d: cx() + x * scale,
      y2d: cy() + y * scale,
      scale: scale,
      z: z
    };
  }

  // 3D Octahedron & Hexagon Quantum Crystals
  let crystals = [];
  let quantumNodes = [];
  let photonSparks = [];

  function init3DElements() {
    crystals = [];
    quantumNodes = [];
    photonSparks = [];

    // 7 Floating 3D Cyber Crystalline Polyhedra
    const crystalCount = width > 768 ? 7 : 4;
    for (let i = 0; i < crystalCount; i++) {
      const size = Math.random() * 26 + 32;
      crystals.push({
        x: (Math.random() - 0.5) * (width * 0.85),
        y: (Math.random() - 0.5) * (height * 0.85),
        z: Math.random() * 400 - 150,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.3,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI,
        rotSpeedX: (Math.random() - 0.5) * 0.018 + 0.008,
        rotSpeedY: (Math.random() - 0.5) * 0.018 + 0.008,
        rotSpeedZ: (Math.random() - 0.5) * 0.015,
        size: size,
        vertices: [
          { x: size, y: 0, z: 0 },
          { x: -size, y: 0, z: 0 },
          { x: 0, y: size, z: 0 },
          { x: 0, y: -size, z: 0 },
          { x: 0, y: 0, z: size },
          { x: 0, y: 0, z: -size }
        ],
        edges: [
          [0, 2], [0, 3], [0, 4], [0, 5],
          [1, 2], [1, 3], [1, 4], [1, 5],
          [2, 4], [4, 3], [3, 5], [5, 2]
        ],
        colorHue: Math.random() > 0.5 ? 190 : (Math.random() > 0.5 ? 275 : 330)
      });
    }

    // 52 Hyper-Dimensional Quantum Nodes with Orbit & Velocity
    const nodeCount = width > 768 ? 54 : 32;
    for (let i = 0; i < nodeCount; i++) {
      quantumNodes.push({
        x: (Math.random() - 0.5) * (width * 1.1),
        y: (Math.random() - 0.5) * (height * 1.1),
        z: Math.random() * 600 - 250,
        baseX: (Math.random() - 0.5) * (width * 1.1),
        baseY: (Math.random() - 0.5) * (height * 1.1),
        baseZ: Math.random() * 600 - 250,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        vz: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2.6 + 1.6,
        orbitAngle: Math.random() * Math.PI * 2,
        orbitSpeed: (Math.random() - 0.5) * 0.015,
        orbitRadius: Math.random() * 60 + 20,
        colorType: Math.random() > 0.6 ? '#06b6d4' : (Math.random() > 0.5 ? '#8b5cf6' : '#ec4899'),
        pulse: Math.random() * 10
      });
    }
  }

  init3DElements();

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

    // Smooth Mouse Velocity & Singularity Tracking
    const mouseDx = mouse.targetX - mouse.x;
    const mouseDy = mouse.targetY - mouse.y;
    mouse.x += mouseDx * 0.08;
    mouse.y += mouseDy * 0.08;
    mouse.speed = Math.hypot(mouseDx, mouseDy);

    // Dynamic Atmospheric Quantum Ambient Glow
    if (mouse.isActive) {
      const ambientGrad = ctx.createRadialGradient(
        mouse.x, mouse.y, 10,
        mouse.x, mouse.y, mouse.radius * 1.3
      );
      if (isLight) {
        ambientGrad.addColorStop(0, 'rgba(56, 189, 248, 0.14)');
        ambientGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.07)');
        ambientGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      } else {
        ambientGrad.addColorStop(0, 'rgba(6, 182, 212, 0.16)');
        ambientGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.08)');
        ambientGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = ambientGrad;
      ctx.fillRect(0, 0, width, height);
    }

    // 1. Draw Supernova Chromatic Shockwave Rings
    for (let i = supernovas.length - 1; i >= 0; i--) {
      const sn = supernovas[i];
      sn.radius += sn.growthSpeed;
      sn.alpha *= 0.94;
      sn.chromaOffset += 1.2;

      ctx.save();
      // Chromatic RGB Aberration Rings
      const ringColors = isLight
        ? [`rgba(2, 132, 199, ${sn.alpha})`, `rgba(124, 58, 237, ${sn.alpha * 0.8})`, `rgba(225, 29, 72, ${sn.alpha * 0.6})`]
        : [`rgba(6, 182, 212, ${sn.alpha})`, `rgba(168, 85, 247, ${sn.alpha * 0.85})`, `rgba(244, 63, 94, ${sn.alpha * 0.7})`];

      ringColors.forEach((color, idx) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(1, 3.5 - idx);
        ctx.beginPath();
        ctx.arc(sn.x, sn.y, sn.radius + idx * sn.chromaOffset * 0.4, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.restore();

      if (sn.alpha < 0.015 || sn.radius > sn.maxRadius) {
        supernovas.splice(i, 1);
      }
    }

    // 2. Update and Draw 3D Quantum Nodes & Gravitational Vortex
    const projectedNodes = [];
    quantumNodes.forEach(node => {
      node.pulse += 0.03;
      node.orbitAngle += node.orbitSpeed;

      // Natural 3D drifting
      node.x += node.vx + Math.cos(node.orbitAngle) * 0.25;
      node.y += node.vy + Math.sin(node.orbitAngle) * 0.25;
      node.z += node.vz;

      // Soft 3D bounds wrapping
      const xBound = width * 0.65;
      const yBound = height * 0.65;
      if (node.x < -xBound) node.x = xBound;
      if (node.x > xBound) node.x = -xBound;
      if (node.y < -yBound) node.y = yBound;
      if (node.y > yBound) node.y = -yBound;
      if (node.z < -280) node.z = 400;
      if (node.z > 450) node.z = -250;

      // Projected 2D Position
      const proj = project3D(node.x, node.y, node.z);

      // Interactive Singularity Gravity Vortex
      if (mouse.isActive) {
        const dx = proj.x2d - mouse.x;
        const dy = proj.y2d - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius && dist > 2) {
          const force = (1 - dist / mouse.radius);
          // Radial pull
          node.vx -= (dx / dist) * force * 0.45;
          node.vy -= (dy / dist) * force * 0.45;
          // Tangent Swirl Vortex Motion
          const angle = Math.atan2(dy, dx);
          node.vx += Math.cos(angle + Math.PI / 2) * force * 0.65;
          node.vy += Math.sin(angle + Math.PI / 2) * force * 0.65;
        }
      }

      // Velocity damping
      node.vx *= 0.96;
      node.vy *= 0.96;
      node.vz *= 0.96;

      projectedNodes.push({
        x: proj.x2d,
        y: proj.y2d,
        scale: proj.scale,
        z: proj.z,
        radius: node.radius * proj.scale,
        color: node.colorType,
        pulse: node.pulse
      });
    });

    // 3. Draw Synaptic Laser Lightning Filaments & Traveling Photons
    const nodeLen = projectedNodes.length;
    const connectThreshold = 125;

    for (let i = 0; i < nodeLen; i++) {
      const p1 = projectedNodes[i];
      for (let j = i + 1; j < nodeLen; j++) {
        const p2 = projectedNodes[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

        if (dist < connectThreshold) {
          const alpha = (1 - dist / connectThreshold) * 0.45 * Math.min(p1.scale, p2.scale);
          ctx.save();
          const filamentGrad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          filamentGrad.addColorStop(0, isLight ? `rgba(14, 165, 233, ${alpha})` : `rgba(6, 182, 212, ${alpha})`);
          filamentGrad.addColorStop(1, isLight ? `rgba(99, 102, 241, ${alpha * 0.8})` : `rgba(168, 85, 247, ${alpha * 0.8})`);

          ctx.strokeStyle = filamentGrad;
          ctx.lineWidth = Math.max(0.6, 1.6 * ((p1.scale + p2.scale) / 2));
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          // Traveling Laser Photon Sparks
          if (Math.random() < 0.008) {
            photonSparks.push({
              x1: p1.x, y1: p1.y,
              x2: p2.x, y2: p2.y,
              progress: 0,
              speed: Math.random() * 0.04 + 0.02,
              color: p1.color
            });
          }
          ctx.restore();
        }
      }

      // Cursor Lightning Beams to Nearest Nodes
      if (mouse.isActive) {
        const mDist = Math.hypot(p1.x - mouse.x, p1.y - mouse.y);
        if (mDist < 190) {
          const mAlpha = (1 - mDist / 190) * 0.55 * p1.scale;
          ctx.save();
          ctx.strokeStyle = isLight ? `rgba(2, 132, 199, ${mAlpha})` : `rgba(56, 189, 248, ${mAlpha})`;
          ctx.lineWidth = 1.4 * p1.scale;
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // Render Laser Photon Sparks
    for (let i = photonSparks.length - 1; i >= 0; i--) {
      const spark = photonSparks[i];
      spark.progress += spark.speed;
      const curX = spark.x1 + (spark.x2 - spark.x1) * spark.progress;
      const curY = spark.y1 + (spark.y2 - spark.y1) * spark.progress;

      ctx.save();
      ctx.fillStyle = spark.color;
      ctx.shadowColor = spark.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(curX, curY, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (spark.progress >= 1) {
        photonSparks.splice(i, 1);
      }
    }

    // Render 3D Quantum Nodes
    projectedNodes.forEach(p => {
      const glow = Math.sin(p.pulse) * 0.3 + 0.7;
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.min(1, Math.max(0.15, p.scale * glow));
      ctx.shadowColor = p.color;
      ctx.shadowBlur = isLight ? 4 : 10 * p.scale;

      ctx.beginPath();
      // Fast cursor warp stretch
      if (mouse.isActive && mouse.speed > 8) {
        const angle = Math.atan2(mouseDy, mouseDx);
        ctx.ellipse(p.x, p.y, p.radius * 2.2, p.radius * 0.8, angle, 0, Math.PI * 2);
      } else {
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.restore();
    });

    // 4. Update and Render 3D Floating Crystalline Polyhedra (Wireframe & Prismatic Faces)
    crystals.forEach(c => {
      c.rx += c.rotSpeedX;
      c.ry += c.rotSpeedY;
      c.rz += c.rotSpeedZ;

      c.x += c.vx;
      c.y += c.vy;
      c.z += c.vz;

      // Soft 3D bounds
      const xBound = width * 0.55;
      const yBound = height * 0.55;
      if (c.x < -xBound) c.x = xBound;
      if (c.x > xBound) c.x = -xBound;
      if (c.y < -yBound) c.y = yBound;
      if (c.y > yBound) c.y = -yBound;
      if (c.z < -160) c.z = 380;
      if (c.z > 420) c.z = -140;

      // Mouse Gravitational Attraction & Spin Acceleration
      if (mouse.isActive) {
        const projCenter = project3D(c.x, c.y, c.z);
        const dx = projCenter.x2d - mouse.x;
        const dy = projCenter.y2d - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius * 1.2 && dist > 10) {
          const pull = (1 - dist / (mouse.radius * 1.2)) * 0.22;
          c.vx -= (dx / dist) * pull;
          c.vy -= (dy / dist) * pull;
          c.rotSpeedX += (Math.random() - 0.5) * 0.002;
          c.rotSpeedY += (Math.random() - 0.5) * 0.002;
        }
      }

      c.vx *= 0.97;
      c.vy *= 0.97;
      c.vz *= 0.97;

      // Transform and Project Vertices
      const projectedVerts = c.vertices.map(v => {
        const rotated = rotate3D(v, c.rx, c.ry, c.rz);
        return project3D(c.x + rotated.x, c.y + rotated.y, c.z + rotated.z);
      });

      // Draw Translucent Prismatic Faces
      const faces = [
        [0, 2, 4], [0, 4, 3], [0, 3, 5], [0, 5, 2],
        [1, 2, 4], [1, 4, 3], [1, 3, 5], [1, 5, 2]
      ];

      faces.forEach(f => {
        const v1 = projectedVerts[f[0]];
        const v2 = projectedVerts[f[1]];
        const v3 = projectedVerts[f[2]];

        ctx.save();
        const faceAlpha = isLight ? 0.06 : 0.12;
        ctx.fillStyle = isLight ? `hsla(${c.colorHue}, 85%, 55%, ${faceAlpha})` : `hsla(${c.colorHue}, 95%, 65%, ${faceAlpha})`;
        ctx.beginPath();
        ctx.moveTo(v1.x2d, v1.y2d);
        ctx.lineTo(v2.x2d, v2.y2d);
        ctx.lineTo(v3.x2d, v3.y2d);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      // Draw Glowing Wireframe Edges
      ctx.save();
      const avgScale = (projectedVerts[0].scale + projectedVerts[1].scale) / 2;
      ctx.strokeStyle = isLight ? `hsla(${c.colorHue}, 80%, 45%, 0.45)` : `hsla(${c.colorHue}, 90%, 65%, 0.65)`;
      ctx.lineWidth = Math.max(0.8, 1.8 * avgScale);
      ctx.shadowColor = `hsl(${c.colorHue}, 90%, 60%)`;
      ctx.shadowBlur = isLight ? 3 : 12;

      c.edges.forEach(e => {
        const v1 = projectedVerts[e[0]];
        const v2 = projectedVerts[e[1]];
        ctx.beginPath();
        ctx.moveTo(v1.x2d, v1.y2d);
        ctx.lineTo(v2.x2d, v2.y2d);
        ctx.stroke();
      });

      // Draw Glowing Vertex Joint Spheres
      projectedVerts.forEach(v => {
        ctx.fillStyle = isLight ? '#0284c7' : '#ffffff';
        ctx.beginPath();
        ctx.arc(v.x2d, v.y2d, 2.2 * v.scale, 0, Math.PI * 2);
        ctx.fill();
      });
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

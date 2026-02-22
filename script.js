document.getElementById('year').textContent = new Date().getFullYear();

const themeKey = 'portfolio-theme';
const dataKey = 'portfolio-data-v1';
const adminCredentialsKey = 'portfolio-admin-credentials-v1';
const legacyAdminPasswordKey = 'portfolio-admin-password-v1';
const adminSessionKey = 'portfolio-admin-session-v1';
const themes = ['theme-neon', 'theme-nvidia', 'theme-royal'];
const themeOptions = document.querySelectorAll('.theme-option');
const filterButtons = document.querySelectorAll('.filter-btn');
const progressBar = document.getElementById('scroll-progress');
const backToTopButton = document.getElementById('back-to-top');
const projectsList = document.getElementById('projects-list');
const experienceList = document.getElementById('experience-list');
const skillsList = document.getElementById('skills-list');
const heroMetrics = document.getElementById('hero-metrics');
const focusList = document.getElementById('focus-list');
const adminLoginButton = document.getElementById('admin-login-btn');
const adminOpenButton = document.getElementById('admin-open-btn');
const adminUsernameInput = document.getElementById('admin-username');
const adminPasswordInput = document.getElementById('admin-password');
const adminAuthMessage = document.getElementById('admin-auth-msg');
const adminAuthSubmit = document.getElementById('admin-auth-submit');
const adminJsonEditor = document.getElementById('admin-json-editor');
const adminSaveButton = document.getElementById('admin-save-btn');
const adminResetButton = document.getElementById('admin-reset-btn');
const adminLogoutButton = document.getElementById('admin-logout-btn');
const adminSaveMessage = document.getElementById('admin-save-msg');
let primaryRgb = { r: 0, g: 212, b: 255 };
let activeFilter = 'all';
let isAdmin = sessionStorage.getItem(adminSessionKey) === 'true';

const defaultPortfolioData = {
  hero: {
    eyebrow: 'Electrical Engineer • IIT Bombay • VLSI Specialist',
    title: 'Building <span class="accent">silicon-grade systems</span> from architecture to test.',
    subtitle: 'Master’s in VLSI from IIT Bombay. Currently a DFT Engineer in onsemi Research, focused on robust, high-performance, and power-aware digital design flows.',
    metrics: [
      { value: '8+', label: 'Flagship Projects' },
      { value: 'VLSI', label: 'Core Specialization' },
      { value: 'onsemi', label: 'Research Branch' }
    ],
    focus: [
      'Scan architecture and test planning',
      'Coverage and power-aware test strategy',
      'Design quality, reliability and manufacturability'
    ]
  },
  about: {
    p1: 'I am an Electrical Engineer with a Master’s in VLSI from IIT Bombay. My work blends architecture thinking, implementation depth, and practical test engineering.',
    p2: 'I enjoy building systems that are not only fast, but also testable, power-efficient, and production-ready.'
  },
  skills: [
    'VLSI Design',
    'CPU Architecture',
    'DFT Engineering',
    'Power Reduction',
    'Compiler Strategy',
    'Digital Logic',
    'Verification Mindset',
    'Semiconductor R&D',
    'Physical Design',
    'STA'
  ],
  projects: [
    {
      title: 'Low-Power VLSI Test Method (Master’s Thesis)',
      description: 'Designed a test-cube compaction approach with weighted switching activity control, keeping post-compaction test power under threshold for reliable VLSI testing.',
      tags: ['DFT', 'Low Power Testing'],
      filters: ['dft'],
      visibility: 'public'
    },
    {
      title: '16-bit 6-Stage Pipelined RISC Processor',
      description: 'Built a custom-ISA processor with hazard detection, data forwarding, and branch prediction; implemented in Verilog and validated in ModelSim.',
      tags: ['Processor Design', 'Verilog'],
      filters: ['processor'],
      visibility: 'public'
    },
    {
      title: 'RISC-V Compiler Study (GCC vs LLVM)',
      description: 'Conducted benchmark-oriented analysis of GCC and LLVM for RISC-V-based architectures, identifying performance trade-offs for architecture-aware toolchain selection.',
      tags: ['Compiler', 'RISC-V'],
      filters: ['compiler'],
      visibility: 'public'
    },
    {
      title: 'Asynchronous FIFO with CDC Synchronizer',
      description: 'Designed robust cross-clock data transfer using 2FF synchronization and Gray-coded pointers, reducing metastability risks in multi-clock digital systems.',
      tags: ['CDC', 'Reliability'],
      filters: ['dft'],
      visibility: 'public'
    },
    {
      title: 'High-Speed 32-bit MAC (Dadda + Brent-Kung)',
      description: 'Implemented a 32-bit MAC using Dadda reduction and Brent-Kung adder, improving arithmetic speed path efficiency for compute-intensive datapaths.',
      tags: ['VHDL', 'High Speed Arithmetic'],
      filters: ['processor'],
      visibility: 'public'
    },
    {
      title: 'Rank Order Filter + STA + OpenLane Layout',
      description: 'Designed and verified an image-noise filtering RTL, performed static timing analysis, and generated physical layout using OpenLane with Sky130 PDK flow.',
      tags: ['Physical Design', 'STA'],
      filters: ['physical'],
      visibility: 'public'
    },
    {
      title: '8-bit Interrupt Controller',
      description: 'Developed a priority-encoder-based interrupt arbitration controller in Verilog, enabling deterministic interrupt handling in multi-source environments.',
      tags: ['Controller Design', 'Digital Logic'],
      filters: ['processor'],
      visibility: 'public'
    },
    {
      title: 'C-based Algorithm Validation for DFT Power Model',
      description: 'Implemented low-power test algorithm blocks in C to validate compaction logic, enabling repeatable experimentation against benchmark circuits.',
      tags: ['C Programming', 'Validation'],
      filters: ['dft'],
      visibility: 'public'
    }
  ],
  experience: [
    {
      title: 'DFT Engineer — onsemi (Research Branch)',
      description: 'Designing test-centric methodologies with focus on coverage, quality, power-aware test optimization, and silicon reliability for advanced semiconductor systems.',
      visibility: 'public'
    },
    {
      title: 'Physics Educator — BYJU\'S (JEE/NEET) | Jun 2021 – Aug 2022',
      description: 'Created high-quality Physics learning content for JEE and NEET aspirants, supporting preparation for two of the most competitive entrance exams in the world, and contributed to better access for 5,000+ students.',
      visibility: 'public'
    },
    {
      title: 'Electrical Head — Team Aveon Racing | Sep 2019 – Jul 2021',
      description: 'Led 20+ members on electric race car systems; team secured 3rd position among 40+ teams in e-Baja.',
      visibility: 'public'
    }
  ],
  contact: {
    email: 'viplawmehta0802@gmail.com',
    phone: '+919113320314',
    linkedin: 'https://www.linkedin.com/in/viplawkumar0802/'
  }
};

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadPortfolioData() {
  const saved = localStorage.getItem(dataKey);
  if (!saved) return deepClone(defaultPortfolioData);

  try {
    const parsed = JSON.parse(saved);
    return {
      ...deepClone(defaultPortfolioData),
      ...parsed,
      hero: { ...deepClone(defaultPortfolioData.hero), ...(parsed.hero || {}) },
      about: { ...deepClone(defaultPortfolioData.about), ...(parsed.about || {}) },
      contact: { ...deepClone(defaultPortfolioData.contact), ...(parsed.contact || {}) },
      skills: Array.isArray(parsed.skills) ? parsed.skills : deepClone(defaultPortfolioData.skills),
      projects: Array.isArray(parsed.projects) ? parsed.projects : deepClone(defaultPortfolioData.projects),
      experience: Array.isArray(parsed.experience) ? parsed.experience : deepClone(defaultPortfolioData.experience)
    };
  } catch {
    return deepClone(defaultPortfolioData);
  }
}

let portfolioData = loadPortfolioData();

function setMessage(element, text, isError = false) {
  if (!element) return;
  element.textContent = text;
  element.classList.toggle('text-danger', isError);
  element.classList.toggle('text-success', !isError && text.length > 0);
}

function renderHero() {
  const eyebrow = document.getElementById('hero-eyebrow');
  const title = document.getElementById('hero-title');
  const subtitle = document.getElementById('hero-subtitle');

  if (eyebrow) eyebrow.textContent = portfolioData.hero.eyebrow || '';
  if (title) title.innerHTML = portfolioData.hero.title || '';
  if (subtitle) subtitle.textContent = portfolioData.hero.subtitle || '';

  if (heroMetrics) {
    heroMetrics.innerHTML = '';
    (portfolioData.hero.metrics || []).forEach((metric) => {
      const item = document.createElement('div');
      item.innerHTML = `<h3>${metric.value || ''}</h3><p>${metric.label || ''}</p>`;
      heroMetrics.appendChild(item);
    });
  }

  if (focusList) {
    focusList.innerHTML = '';
    (portfolioData.hero.focus || []).forEach((focus) => {
      const li = document.createElement('li');
      li.textContent = `• ${focus}`;
      focusList.appendChild(li);
    });
  }
}

function renderAbout() {
  const aboutP1 = document.getElementById('about-p1');
  const aboutP2 = document.getElementById('about-p2');
  if (aboutP1) aboutP1.textContent = portfolioData.about.p1 || '';
  if (aboutP2) aboutP2.textContent = portfolioData.about.p2 || '';

  if (skillsList) {
    skillsList.innerHTML = '';
    (portfolioData.skills || []).forEach((skill) => {
      const span = document.createElement('span');
      span.className = 'skill-pill';
      span.textContent = skill;
      skillsList.appendChild(span);
    });
  }
}

function shouldShowItem(item) {
  const visibility = item.visibility || 'public';
  return isAdmin || visibility === 'public';
}

function renderProjects() {
  if (!projectsList) return;
  projectsList.innerHTML = '';

  const visibleProjects = (portfolioData.projects || []).filter(shouldShowItem);

  visibleProjects.forEach((project) => {
    const col = document.createElement('div');
    const filters = Array.isArray(project.filters) ? project.filters.join(' ') : '';
    col.className = 'col-md-6 col-xl-4 project-item';
    col.dataset.tags = filters;

    const tagsMarkup = (project.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join('');
    const privateBadge = isAdmin && (project.visibility || 'public') === 'private' ? '<span class="tag private-badge">Private</span>' : '';

    col.innerHTML = `
      <article class="project-card h-100">
        <h5>${project.title || ''}</h5>
        <p>${project.description || ''}</p>
        ${tagsMarkup}${privateBadge}
      </article>
    `;

    projectsList.appendChild(col);
  });

  if (visibleProjects.length === 0) {
    projectsList.innerHTML = '<div class="col-12"><article class="project-card"><p class="mb-0">No projects available in current visibility mode.</p></article></div>';
  }

  applyProjectFilter(activeFilter);
}

function renderExperience() {
  if (!experienceList) return;
  experienceList.innerHTML = '';

  const visibleExperience = (portfolioData.experience || []).filter(shouldShowItem);
  visibleExperience.forEach((item, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = `timeline-item ${index > 0 ? 'mt-3' : ''}`;

    const privateBadge = isAdmin && (item.visibility || 'public') === 'private' ? ' <span class="badge bg-warning text-dark">Private</span>' : '';

    wrapper.innerHTML = `
      <div class="dot"></div>
      <div>
        <h5 class="mb-1">${item.title || ''}${privateBadge}</h5>
        <p class="text-light-emphasis mb-0">${item.description || ''}</p>
      </div>
    `;

    experienceList.appendChild(wrapper);
  });
}

function renderContact() {
  const emailButton = document.getElementById('contact-email-btn');
  const phoneButton = document.getElementById('contact-phone-btn');
  const linkedinButton = document.getElementById('contact-linkedin-btn');

  if (emailButton) emailButton.href = `mailto:${portfolioData.contact.email || ''}`;
  if (phoneButton) phoneButton.href = `tel:${portfolioData.contact.phone || ''}`;
  if (linkedinButton) linkedinButton.href = portfolioData.contact.linkedin || '#';
}

function renderAdminState() {
  if (adminOpenButton) {
    adminOpenButton.classList.toggle('d-none', !isAdmin);
  }

  if (adminLoginButton) {
    adminLoginButton.textContent = isAdmin ? 'Admin Active' : 'Admin Login';
  }

  if (isAdmin && adminJsonEditor) {
    adminJsonEditor.value = JSON.stringify(portfolioData, null, 2);
  }
}

function renderAll() {
  renderHero();
  renderAbout();
  renderProjects();
  renderExperience();
  renderContact();
  renderAdminState();
}

function applyProjectFilter(filter) {
  activeFilter = filter;

  filterButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.filter === filter);
  });

  document.querySelectorAll('.project-item').forEach((item) => {
    if (filter === 'all') {
      item.classList.remove('project-hidden');
      return;
    }

    const tags = item.dataset.tags || '';
    const isMatch = tags.includes(filter);
    item.classList.toggle('project-hidden', !isMatch);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => applyProjectFilter(button.dataset.filter));
});

function hashPassword(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return String(hash);
}

function getStoredCredentials() {
  const raw = localStorage.getItem(adminCredentialsKey);
  if (!raw) {
    const legacyPasswordHash = localStorage.getItem(legacyAdminPasswordKey);
    if (!legacyPasswordHash) return null;

    const migrated = { username: 'admin', passwordHash: legacyPasswordHash };
    localStorage.setItem(adminCredentialsKey, JSON.stringify(migrated));
    return migrated;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if (!parsed.username || !parsed.passwordHash) return null;
    return parsed;
  } catch {
    return null;
  }
}

if (adminAuthSubmit) {
  adminAuthSubmit.addEventListener('click', () => {
    const username = (adminUsernameInput?.value || '').trim();
    const password = (adminPasswordInput?.value || '').trim();
    if (!username || !password) {
      setMessage(adminAuthMessage, 'Please enter both admin ID and password.', true);
      return;
    }

    const savedCredentials = getStoredCredentials();
    const inputHash = hashPassword(password);

    if (!savedCredentials) {
      const newCredentials = { username, passwordHash: inputHash };
      localStorage.setItem(adminCredentialsKey, JSON.stringify(newCredentials));
      isAdmin = true;
      sessionStorage.setItem(adminSessionKey, 'true');
      setMessage(adminAuthMessage, 'Admin ID and password created. Admin mode enabled.');
    } else if (savedCredentials.username === username && savedCredentials.passwordHash === inputHash) {
      isAdmin = true;
      sessionStorage.setItem(adminSessionKey, 'true');
      setMessage(adminAuthMessage, 'Login successful.');
    } else {
      setMessage(adminAuthMessage, 'Invalid admin ID or password.', true);
      return;
    }

    renderAll();

    const authModal = bootstrap.Modal.getInstance(document.getElementById('adminAuthModal'));
    if (authModal) authModal.hide();
    if (adminUsernameInput) adminUsernameInput.value = '';
    if (adminPasswordInput) adminPasswordInput.value = '';
  });
}

if (adminSaveButton) {
  adminSaveButton.addEventListener('click', () => {
    if (!isAdmin) {
      setMessage(adminSaveMessage, 'Admin login required.', true);
      return;
    }

    try {
      const parsed = JSON.parse(adminJsonEditor.value);
      if (!parsed || typeof parsed !== 'object') {
        setMessage(adminSaveMessage, 'Invalid JSON structure.', true);
        return;
      }

      portfolioData = {
        ...deepClone(defaultPortfolioData),
        ...parsed,
        hero: { ...deepClone(defaultPortfolioData.hero), ...(parsed.hero || {}) },
        about: { ...deepClone(defaultPortfolioData.about), ...(parsed.about || {}) },
        contact: { ...deepClone(defaultPortfolioData.contact), ...(parsed.contact || {}) },
        skills: Array.isArray(parsed.skills) ? parsed.skills : deepClone(defaultPortfolioData.skills),
        projects: Array.isArray(parsed.projects) ? parsed.projects : deepClone(defaultPortfolioData.projects),
        experience: Array.isArray(parsed.experience) ? parsed.experience : deepClone(defaultPortfolioData.experience)
      };

      localStorage.setItem(dataKey, JSON.stringify(portfolioData));
      renderAll();
      setMessage(adminSaveMessage, 'Portfolio content saved successfully.');
    } catch {
      setMessage(adminSaveMessage, 'JSON parse error. Please check formatting.', true);
    }
  });
}

if (adminResetButton) {
  adminResetButton.addEventListener('click', () => {
    if (!isAdmin) {
      setMessage(adminSaveMessage, 'Admin login required.', true);
      return;
    }

    portfolioData = deepClone(defaultPortfolioData);
    localStorage.setItem(dataKey, JSON.stringify(portfolioData));
    renderAll();
    setMessage(adminSaveMessage, 'Reset to default content complete.');
  });
}

if (adminLogoutButton) {
  adminLogoutButton.addEventListener('click', () => {
    isAdmin = false;
    sessionStorage.removeItem(adminSessionKey);
    renderAll();
    setMessage(adminSaveMessage, 'Admin logged out.');

    const panel = bootstrap.Offcanvas.getInstance(document.getElementById('adminPanel'));
    if (panel) panel.hide();
  });
}

function hexToRgb(hexValue) {
  const hex = hexValue.replace('#', '').trim();
  if (hex.length !== 6) return null;

  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);

  if ([r, g, b].some((value) => Number.isNaN(value))) return null;
  return { r, g, b };
}

function updateCanvasColorFromTheme() {
  const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary');
  const parsed = hexToRgb(primaryColor);
  primaryRgb = parsed || { r: 0, g: 212, b: 255 };
}

function applyTheme(themeName) {
  if (!themes.includes(themeName)) return;

  document.body.classList.remove(...themes);
  document.body.classList.add(themeName);

  themeOptions.forEach((option) => {
    option.classList.toggle('active', option.dataset.theme === themeName);
  });

  localStorage.setItem(themeKey, themeName);
  updateCanvasColorFromTheme();
}

const savedTheme = localStorage.getItem(themeKey);
if (savedTheme && themes.includes(savedTheme)) {
  applyTheme(savedTheme);
} else {
  applyTheme('theme-neon');
}

themeOptions.forEach((option) => {
  option.addEventListener('click', () => applyTheme(option.dataset.theme));
});

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section, header');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  },
  { rootMargin: '-35% 0px -50% 0px', threshold: 0.01 }
);

sections.forEach((section) => observer.observe(section));

const canvas = document.getElementById('chip-grid');
const ctx = canvas.getContext('2d');
let animationFrameId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawChipGrid(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const spacing = 42;
  const pulse = Math.sin(time * 0.0015) * 0.25 + 0.75;

  for (let x = 0; x < canvas.width; x += spacing) {
    for (let y = 0; y < canvas.height; y += spacing) {
      const offset = Math.sin((x + y) * 0.02 + time * 0.001) * 4;
      const alpha = 0.06 + ((x + y) % (spacing * 3)) / (spacing * 100) * pulse;
      ctx.strokeStyle = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${alpha})`;
      ctx.strokeRect(x + offset, y + offset, spacing - 8, spacing - 8);
    }
  }

  animationFrameId = requestAnimationFrame(drawChipGrid);
}

function handleScroll() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }

  if (backToTopButton) {
    backToTopButton.classList.toggle('show', scrollTop > 420);
  }
}

if (backToTopButton) {
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

renderAll();
resizeCanvas();
updateCanvasColorFromTheme();
drawChipGrid(0);
handleScroll();

window.addEventListener('resize', resizeCanvas);
window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('beforeunload', () => cancelAnimationFrame(animationFrameId));
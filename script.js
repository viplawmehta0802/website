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
const adminSaveButton = document.getElementById('admin-save-btn');
const adminResetButton = document.getElementById('admin-reset-btn');
const adminLogoutButton = document.getElementById('admin-logout-btn');
const adminSaveMessage = document.getElementById('admin-save-msg');

/* Hardcoded admin credentials */
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Khanna';
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

  if (isAdmin) {
    renderAdminForms();
  }
}

/* ===== ADMIN FORM-BASED UI ===== */

function renderAdminForms() {
  renderAdminHeroForm();
  renderAdminAboutForm();
  renderAdminSkillsForm();
  renderAdminProjectsForm();
  renderAdminExperienceForm();
  renderAdminContactForm();
}

function renderAdminHeroForm() {
  const container = document.getElementById('admin-hero-form');
  if (!container) return;
  const h = portfolioData.hero;
  container.innerHTML = `
    <div class="admin-form-group">
      <label class="admin-label">Eyebrow Text</label>
      <input type="text" class="form-control admin-input" id="adm-hero-eyebrow" value="${escAttr(h.eyebrow || '')}" />
    </div>
    <div class="admin-form-group">
      <label class="admin-label">Title (HTML allowed)</label>
      <textarea class="form-control admin-input" id="adm-hero-title" rows="2">${escHTML(h.title || '')}</textarea>
    </div>
    <div class="admin-form-group">
      <label class="admin-label">Subtitle</label>
      <textarea class="form-control admin-input" id="adm-hero-subtitle" rows="2">${escHTML(h.subtitle || '')}</textarea>
    </div>
    <div class="admin-form-group">
      <label class="admin-label">Hero Metrics</label>
      <div id="adm-hero-metrics-list"></div>
      <button type="button" class="btn btn-outline-info btn-sm mt-2" id="adm-hero-metric-add">+ Add Metric</button>
    </div>
    <div class="admin-form-group">
      <label class="admin-label">Current Focus Items</label>
      <div id="adm-hero-focus-list"></div>
      <button type="button" class="btn btn-outline-info btn-sm mt-2" id="adm-hero-focus-add">+ Add Focus</button>
    </div>
  `;

  const metricsList = document.getElementById('adm-hero-metrics-list');
  (h.metrics || []).forEach((m, i) => {
    metricsList.appendChild(createMetricRow(m, i));
  });

  document.getElementById('adm-hero-metric-add').addEventListener('click', () => {
    portfolioData.hero.metrics = portfolioData.hero.metrics || [];
    portfolioData.hero.metrics.push({ value: '', label: '' });
    renderAdminHeroForm();
  });

  const focusList = document.getElementById('adm-hero-focus-list');
  (h.focus || []).forEach((f, i) => {
    focusList.appendChild(createFocusRow(f, i));
  });

  document.getElementById('adm-hero-focus-add').addEventListener('click', () => {
    portfolioData.hero.focus = portfolioData.hero.focus || [];
    portfolioData.hero.focus.push('');
    renderAdminHeroForm();
  });
}

function createMetricRow(metric, index) {
  const row = document.createElement('div');
  row.className = 'admin-inline-row';
  row.innerHTML = `
    <input type="text" class="form-control admin-input admin-input-sm" placeholder="Value" value="${escAttr(metric.value || '')}" data-field="hero-metric-value" data-index="${index}" />
    <input type="text" class="form-control admin-input admin-input-sm" placeholder="Label" value="${escAttr(metric.label || '')}" data-field="hero-metric-label" data-index="${index}" />
    <button type="button" class="btn btn-outline-danger btn-sm admin-delete-btn" data-action="delete-metric" data-index="${index}">✕</button>
  `;
  row.querySelector('[data-action="delete-metric"]').addEventListener('click', () => {
    portfolioData.hero.metrics.splice(index, 1);
    renderAdminHeroForm();
  });
  return row;
}

function createFocusRow(focus, index) {
  const row = document.createElement('div');
  row.className = 'admin-inline-row';
  row.innerHTML = `
    <input type="text" class="form-control admin-input admin-input-sm" placeholder="Focus item" value="${escAttr(focus)}" data-field="hero-focus" data-index="${index}" />
    <button type="button" class="btn btn-outline-danger btn-sm admin-delete-btn" data-action="delete-focus" data-index="${index}">✕</button>
  `;
  row.querySelector('[data-action="delete-focus"]').addEventListener('click', () => {
    portfolioData.hero.focus.splice(index, 1);
    renderAdminHeroForm();
  });
  return row;
}

function renderAdminAboutForm() {
  const container = document.getElementById('admin-about-form');
  if (!container) return;
  const a = portfolioData.about;
  container.innerHTML = `
    <div class="admin-form-group">
      <label class="admin-label">About Paragraph 1</label>
      <textarea class="form-control admin-input" id="adm-about-p1" rows="3">${escHTML(a.p1 || '')}</textarea>
    </div>
    <div class="admin-form-group">
      <label class="admin-label">About Paragraph 2</label>
      <textarea class="form-control admin-input" id="adm-about-p2" rows="3">${escHTML(a.p2 || '')}</textarea>
    </div>
  `;
}

function renderAdminSkillsForm() {
  const container = document.getElementById('admin-skills-form');
  if (!container) return;
  const skills = portfolioData.skills || [];
  container.innerHTML = `
    <div class="admin-form-group">
      <label class="admin-label">Skills (click ✕ to remove)</label>
      <div class="admin-skills-list" id="adm-skills-list"></div>
      <div class="admin-inline-row mt-2">
        <input type="text" class="form-control admin-input admin-input-sm" id="adm-new-skill" placeholder="New skill name" />
        <button type="button" class="btn btn-outline-info btn-sm" id="adm-skill-add">+ Add</button>
      </div>
    </div>
  `;

  const list = document.getElementById('adm-skills-list');
  skills.forEach((skill, i) => {
    const pill = document.createElement('span');
    pill.className = 'admin-skill-tag';
    pill.innerHTML = `${escHTML(skill)} <button type="button" class="admin-tag-delete" data-index="${i}">✕</button>`;
    pill.querySelector('.admin-tag-delete').addEventListener('click', () => {
      portfolioData.skills.splice(i, 1);
      renderAdminSkillsForm();
    });
    list.appendChild(pill);
  });

  document.getElementById('adm-skill-add').addEventListener('click', () => {
    const input = document.getElementById('adm-new-skill');
    const val = input.value.trim();
    if (!val) return;
    portfolioData.skills.push(val);
    input.value = '';
    renderAdminSkillsForm();
  });

  document.getElementById('adm-new-skill').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('adm-skill-add').click();
    }
  });
}

function renderAdminProjectsForm() {
  const container = document.getElementById('admin-projects-form');
  if (!container) return;
  const projects = portfolioData.projects || [];

  let html = `<div class="admin-form-group">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <label class="admin-label mb-0">Projects (${projects.length})</label>
      <button type="button" class="btn btn-outline-info btn-sm" id="adm-project-add">+ Add Project</button>
    </div>
    <div id="adm-projects-list" class="admin-items-list"></div>
  </div>`;

  container.innerHTML = html;

  const list = document.getElementById('adm-projects-list');
  projects.forEach((proj, i) => {
    list.appendChild(createProjectCard(proj, i));
  });

  document.getElementById('adm-project-add').addEventListener('click', () => {
    portfolioData.projects.push({
      title: 'New Project',
      description: '',
      tags: [],
      filters: [],
      visibility: 'public'
    });
    renderAdminProjectsForm();
    // Scroll to the new item
    const items = document.querySelectorAll('#adm-projects-list .admin-item-card');
    items[items.length - 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

function createProjectCard(proj, index) {
  const card = document.createElement('div');
  card.className = 'admin-item-card';
  const isCollapsed = proj._collapsed !== false;

  card.innerHTML = `
    <div class="admin-item-header" data-toggle-item="${index}">
      <div class="admin-item-title">
        <span class="admin-item-number">#${index + 1}</span>
        <span>${escHTML(proj.title || 'Untitled')}</span>
        ${proj.visibility === 'private' ? '<span class="badge bg-warning text-dark ms-2">Private</span>' : ''}
      </div>
      <div class="admin-item-actions">
        <button type="button" class="btn btn-outline-danger btn-sm admin-delete-btn" data-action="delete-project" data-index="${index}">Delete</button>
        <span class="admin-chevron ${isCollapsed ? '' : 'open'}">▸</span>
      </div>
    </div>
    <div class="admin-item-body ${isCollapsed ? 'collapsed' : ''}">
      <div class="admin-form-group">
        <label class="admin-label-sm">Title</label>
        <input type="text" class="form-control admin-input admin-input-sm" value="${escAttr(proj.title || '')}" data-field="project-title" data-index="${index}" />
      </div>
      <div class="admin-form-group">
        <label class="admin-label-sm">Description</label>
        <textarea class="form-control admin-input admin-input-sm" rows="2" data-field="project-desc" data-index="${index}">${escHTML(proj.description || '')}</textarea>
      </div>
      <div class="admin-form-group">
        <label class="admin-label-sm">Tags (comma-separated)</label>
        <input type="text" class="form-control admin-input admin-input-sm" value="${escAttr((proj.tags || []).join(', '))}" data-field="project-tags" data-index="${index}" />
      </div>
      <div class="admin-form-group">
        <label class="admin-label-sm">Filters (comma-separated: dft, processor, physical, compiler)</label>
        <input type="text" class="form-control admin-input admin-input-sm" value="${escAttr((proj.filters || []).join(', '))}" data-field="project-filters" data-index="${index}" />
      </div>
      <div class="admin-form-group">
        <label class="admin-label-sm">Visibility</label>
        <select class="form-select admin-input admin-input-sm" data-field="project-visibility" data-index="${index}">
          <option value="public" ${proj.visibility === 'public' ? 'selected' : ''}>Public</option>
          <option value="private" ${proj.visibility === 'private' ? 'selected' : ''}>Private</option>
        </select>
      </div>
    </div>
  `;

  // Toggle collapse
  card.querySelector('[data-toggle-item]').addEventListener('click', (e) => {
    if (e.target.closest('[data-action]')) return;
    const body = card.querySelector('.admin-item-body');
    const chevron = card.querySelector('.admin-chevron');
    body.classList.toggle('collapsed');
    chevron.classList.toggle('open');
  });

  // Delete
  card.querySelector('[data-action="delete-project"]').addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm('Delete this project?')) {
      portfolioData.projects.splice(index, 1);
      renderAdminProjectsForm();
    }
  });

  return card;
}

function renderAdminExperienceForm() {
  const container = document.getElementById('admin-experience-form');
  if (!container) return;
  const experience = portfolioData.experience || [];

  container.innerHTML = `<div class="admin-form-group">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <label class="admin-label mb-0">Experience (${experience.length})</label>
      <button type="button" class="btn btn-outline-info btn-sm" id="adm-exp-add">+ Add Experience</button>
    </div>
    <div id="adm-experience-list" class="admin-items-list"></div>
  </div>`;

  const list = document.getElementById('adm-experience-list');
  experience.forEach((item, i) => {
    list.appendChild(createExperienceCard(item, i));
  });

  document.getElementById('adm-exp-add').addEventListener('click', () => {
    portfolioData.experience.push({
      title: 'New Position',
      description: '',
      visibility: 'public'
    });
    renderAdminExperienceForm();
    const items = document.querySelectorAll('#adm-experience-list .admin-item-card');
    items[items.length - 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

function createExperienceCard(item, index) {
  const card = document.createElement('div');
  card.className = 'admin-item-card';
  const isCollapsed = item._collapsed !== false;

  card.innerHTML = `
    <div class="admin-item-header" data-toggle-item="${index}">
      <div class="admin-item-title">
        <span class="admin-item-number">#${index + 1}</span>
        <span>${escHTML(item.title || 'Untitled')}</span>
        ${item.visibility === 'private' ? '<span class="badge bg-warning text-dark ms-2">Private</span>' : ''}
      </div>
      <div class="admin-item-actions">
        <button type="button" class="btn btn-outline-danger btn-sm admin-delete-btn" data-action="delete-exp" data-index="${index}">Delete</button>
        <span class="admin-chevron ${isCollapsed ? '' : 'open'}">▸</span>
      </div>
    </div>
    <div class="admin-item-body ${isCollapsed ? 'collapsed' : ''}">
      <div class="admin-form-group">
        <label class="admin-label-sm">Title</label>
        <input type="text" class="form-control admin-input admin-input-sm" value="${escAttr(item.title || '')}" data-field="exp-title" data-index="${index}" />
      </div>
      <div class="admin-form-group">
        <label class="admin-label-sm">Description</label>
        <textarea class="form-control admin-input admin-input-sm" rows="2" data-field="exp-desc" data-index="${index}">${escHTML(item.description || '')}</textarea>
      </div>
      <div class="admin-form-group">
        <label class="admin-label-sm">Visibility</label>
        <select class="form-select admin-input admin-input-sm" data-field="exp-visibility" data-index="${index}">
          <option value="public" ${item.visibility === 'public' ? 'selected' : ''}>Public</option>
          <option value="private" ${item.visibility === 'private' ? 'selected' : ''}>Private</option>
        </select>
      </div>
    </div>
  `;

  card.querySelector('[data-toggle-item]').addEventListener('click', (e) => {
    if (e.target.closest('[data-action]')) return;
    const body = card.querySelector('.admin-item-body');
    const chevron = card.querySelector('.admin-chevron');
    body.classList.toggle('collapsed');
    chevron.classList.toggle('open');
  });

  card.querySelector('[data-action="delete-exp"]').addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm('Delete this experience?')) {
      portfolioData.experience.splice(index, 1);
      renderAdminExperienceForm();
    }
  });

  return card;
}

function renderAdminContactForm() {
  const container = document.getElementById('admin-contact-form');
  if (!container) return;
  const c = portfolioData.contact;
  container.innerHTML = `
    <div class="admin-form-group">
      <label class="admin-label">Email</label>
      <input type="email" class="form-control admin-input" id="adm-contact-email" value="${escAttr(c.email || '')}" />
    </div>
    <div class="admin-form-group">
      <label class="admin-label">Phone</label>
      <input type="tel" class="form-control admin-input" id="adm-contact-phone" value="${escAttr(c.phone || '')}" />
    </div>
    <div class="admin-form-group">
      <label class="admin-label">LinkedIn URL</label>
      <input type="url" class="form-control admin-input" id="adm-contact-linkedin" value="${escAttr(c.linkedin || '')}" />
    </div>
  `;
}

/* Helpers for safe HTML rendering in admin forms */
function escAttr(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escHTML(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* Collect all form values before saving */
function collectAdminFormData() {
  // Hero
  const heroEyebrow = document.getElementById('adm-hero-eyebrow');
  const heroTitle = document.getElementById('adm-hero-title');
  const heroSubtitle = document.getElementById('adm-hero-subtitle');
  if (heroEyebrow) portfolioData.hero.eyebrow = heroEyebrow.value;
  if (heroTitle) portfolioData.hero.title = heroTitle.value;
  if (heroSubtitle) portfolioData.hero.subtitle = heroSubtitle.value;

  // Hero metrics
  document.querySelectorAll('[data-field="hero-metric-value"]').forEach((el) => {
    const i = parseInt(el.dataset.index);
    if (portfolioData.hero.metrics[i]) portfolioData.hero.metrics[i].value = el.value;
  });
  document.querySelectorAll('[data-field="hero-metric-label"]').forEach((el) => {
    const i = parseInt(el.dataset.index);
    if (portfolioData.hero.metrics[i]) portfolioData.hero.metrics[i].label = el.value;
  });

  // Hero focus
  document.querySelectorAll('[data-field="hero-focus"]').forEach((el) => {
    const i = parseInt(el.dataset.index);
    if (portfolioData.hero.focus) portfolioData.hero.focus[i] = el.value;
  });

  // About
  const aboutP1 = document.getElementById('adm-about-p1');
  const aboutP2 = document.getElementById('adm-about-p2');
  if (aboutP1) portfolioData.about.p1 = aboutP1.value;
  if (aboutP2) portfolioData.about.p2 = aboutP2.value;

  // Skills already managed inline

  // Projects
  document.querySelectorAll('[data-field="project-title"]').forEach((el) => {
    const i = parseInt(el.dataset.index);
    if (portfolioData.projects[i]) portfolioData.projects[i].title = el.value;
  });
  document.querySelectorAll('[data-field="project-desc"]').forEach((el) => {
    const i = parseInt(el.dataset.index);
    if (portfolioData.projects[i]) portfolioData.projects[i].description = el.value;
  });
  document.querySelectorAll('[data-field="project-tags"]').forEach((el) => {
    const i = parseInt(el.dataset.index);
    if (portfolioData.projects[i]) portfolioData.projects[i].tags = el.value.split(',').map(s => s.trim()).filter(Boolean);
  });
  document.querySelectorAll('[data-field="project-filters"]').forEach((el) => {
    const i = parseInt(el.dataset.index);
    if (portfolioData.projects[i]) portfolioData.projects[i].filters = el.value.split(',').map(s => s.trim()).filter(Boolean);
  });
  document.querySelectorAll('[data-field="project-visibility"]').forEach((el) => {
    const i = parseInt(el.dataset.index);
    if (portfolioData.projects[i]) portfolioData.projects[i].visibility = el.value;
  });

  // Experience
  document.querySelectorAll('[data-field="exp-title"]').forEach((el) => {
    const i = parseInt(el.dataset.index);
    if (portfolioData.experience[i]) portfolioData.experience[i].title = el.value;
  });
  document.querySelectorAll('[data-field="exp-desc"]').forEach((el) => {
    const i = parseInt(el.dataset.index);
    if (portfolioData.experience[i]) portfolioData.experience[i].description = el.value;
  });
  document.querySelectorAll('[data-field="exp-visibility"]').forEach((el) => {
    const i = parseInt(el.dataset.index);
    if (portfolioData.experience[i]) portfolioData.experience[i].visibility = el.value;
  });

  // Contact
  const contactEmail = document.getElementById('adm-contact-email');
  const contactPhone = document.getElementById('adm-contact-phone');
  const contactLinkedin = document.getElementById('adm-contact-linkedin');
  if (contactEmail) portfolioData.contact.email = contactEmail.value;
  if (contactPhone) portfolioData.contact.phone = contactPhone.value;
  if (contactLinkedin) portfolioData.contact.linkedin = contactLinkedin.value;
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

if (adminAuthSubmit) {
  adminAuthSubmit.addEventListener('click', () => {
    const username = (adminUsernameInput?.value || '').trim();
    const password = (adminPasswordInput?.value || '').trim();
    if (!username || !password) {
      setMessage(adminAuthMessage, 'Please enter both admin ID and password.', true);
      return;
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
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

    collectAdminFormData();
    localStorage.setItem(dataKey, JSON.stringify(portfolioData));
    renderAll();
    setMessage(adminSaveMessage, 'Portfolio content saved successfully.');
  });
}

if (adminResetButton) {
  adminResetButton.addEventListener('click', () => {
    if (!isAdmin) {
      setMessage(adminSaveMessage, 'Admin login required.', true);
      return;
    }

    if (!confirm('Reset all content to default? This cannot be undone.')) return;

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

    const panel = bootstrap.Modal.getInstance(document.getElementById('adminPanel'));
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

/* ===== INTERACTIVE ENHANCEMENTS ===== */

/* ---------- 1. TYPEWRITER EFFECT for hero title ---------- */
(function initTypewriter() {
  const titleEl = document.getElementById('hero-title');
  if (!titleEl) return;

  const fullHTML = titleEl.innerHTML;
  const plainText = titleEl.textContent;
  titleEl.innerHTML = '';
  titleEl.style.minHeight = '3.2em';

  let charIndex = 0;
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  cursor.textContent = '|';
  titleEl.appendChild(cursor);

  function type() {
    if (charIndex < plainText.length) {
      // Restore full HTML once done typing plain chars
      if (charIndex === plainText.length - 1) {
        titleEl.innerHTML = fullHTML;
        titleEl.appendChild(cursor);
        charIndex++;
        setTimeout(() => { cursor.classList.add('blink'); }, 400);
        return;
      }
      const span = document.createElement('span');
      span.textContent = plainText[charIndex];
      titleEl.insertBefore(span, cursor);
      charIndex++;
      setTimeout(type, 38 + Math.random() * 30);
    } else {
      cursor.classList.add('blink');
    }
  }

  setTimeout(type, 600);
})();

/* ---------- 2. ANIMATED NUMBER COUNTERS (Impact section) ---------- */
(function initCounters() {
  const counterEls = document.querySelectorAll('#impact .project-card h3');
  if (!counterEls.length) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.counted) return;
      el.dataset.counted = 'true';
      animateCounter(el);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counterEls.forEach((el) => counterObserver.observe(el));

  function animateCounter(el) {
    const raw = el.textContent.trim();
    // Extract leading number
    const match = raw.match(/^([\d,.]+)(\+?)(.*)$/);
    if (!match) return;

    const targetNum = parseFloat(match[1].replace(/,/g, ''));
    const suffix = (match[2] || '') + (match[3] || '');
    const hasDecimal = match[1].includes('.');
    const duration = 1600;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * targetNum;

      if (hasDecimal) {
        el.textContent = current.toFixed(2) + suffix;
      } else {
        el.textContent = Math.floor(current).toLocaleString() + suffix;
      }

      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }
})();

/* ---------- 3. SCROLL-REVEAL ANIMATIONS ---------- */
(function initScrollReveal() {
  const revealTargets = document.querySelectorAll(
    '.section-title, .project-card, .timeline-item, .chip-card, .profile-shell, .skill-pill, .hero-metrics, #hero-eyebrow, #hero-subtitle, .hero .btn'
  );

  revealTargets.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  // Stagger children for grids
  document.querySelectorAll('.skills-grid .skill-pill, #projects-list .project-item').forEach((el, i) => {
    el.style.transitionDelay = `${i * 60}ms`;
  });

  revealTargets.forEach((el) => revealObserver.observe(el));

  // Re-apply after dynamic renders
  const origRenderProjects = window.renderProjects || renderProjects;
  // Patch project render to add reveal
  const projectObserver = new MutationObserver(() => {
    document.querySelectorAll('#projects-list .project-card').forEach((el, i) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 80}ms`;
        revealObserver.observe(el);
      }
    });
  });

  if (projectsList) {
    projectObserver.observe(projectsList, { childList: true, subtree: true });
  }
})();

/* ---------- 4. 3D TILT EFFECT on cards ---------- */
(function initTilt() {
  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.project-card, .chip-card');
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 400) {
        const tiltX = (dy / 400) * -6;
        const tiltY = (dx / 400) * 6;
        const glow = 1 - dist / 400;
        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-2px)`;
        card.style.boxShadow = `0 12px 28px rgba(0,0,0,0.28), 0 0 ${20 + glow * 20}px var(--glow-cyan), 0 0 ${30 + glow * 24}px var(--glow-purple)`;
      } else {
        card.style.transform = '';
        card.style.boxShadow = '';
      }
    });
  });

  document.addEventListener('mouseleave', () => {
    document.querySelectorAll('.project-card, .chip-card').forEach((card) => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
})();

/* ---------- 5. CLICK PARTICLE BURST ---------- */
(function initClickParticles() {
  document.addEventListener('click', (e) => {
    const count = 12;
    const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#00d4ff';
    const secondaryColor = getComputedStyle(document.body).getPropertyValue('--secondary').trim() || '#7c4dff';

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'click-particle';
      const angle = (2 * Math.PI * i) / count;
      const distance = 40 + Math.random() * 60;
      const size = 4 + Math.random() * 4;
      const color = Math.random() > 0.5 ? primaryColor : secondaryColor;

      particle.style.cssText = `
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        --dx: ${Math.cos(angle) * distance}px;
        --dy: ${Math.sin(angle) * distance}px;
      `;

      document.body.appendChild(particle);
      particle.addEventListener('animationend', () => particle.remove());
    }
  });
})();

/* ---------- 6. TOAST NOTIFICATION SYSTEM ---------- */
const Toast = {
  container: null,

  init() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  },

  show(message, type = 'info', duration = 3000) {
    this.init();
    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    const icons = { success: '✓', error: '✗', info: 'ℹ', warning: '⚠' };
    toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ'}</span><span class="toast-msg">${message}</span>`;
    this.container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('toast-show'));

    setTimeout(() => {
      toast.classList.remove('toast-show');
      toast.classList.add('toast-hide');
      toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
  }
};

// Override the plain-text setMessage to also fire a toast
const originalSetMessage = setMessage;
window.setMessage = function (element, text, isError = false) {
  originalSetMessage(element, text, isError);
  if (text) {
    Toast.show(text, isError ? 'error' : 'success');
  }
};

/* ---------- 7. KEYBOARD SHORTCUTS ---------- */
(function initKeyboardShortcuts() {
  const shortcuts = {
    '1': '#home',
    '2': '#about',
    '3': '#education',
    '4': '#projects',
    '5': '#experience',
    '6': '#contact'
  };

  let overlayVisible = false;
  const overlay = document.createElement('div');
  overlay.className = 'shortcuts-overlay';
  overlay.innerHTML = `
    <div class="shortcuts-panel">
      <h4>Keyboard Shortcuts</h4>
      <div class="shortcut-grid">
        <div class="shortcut-item"><kbd>?</kbd><span>Toggle this help</span></div>
        <div class="shortcut-item"><kbd>1</kbd><span>Go to Home</span></div>
        <div class="shortcut-item"><kbd>2</kbd><span>Go to About</span></div>
        <div class="shortcut-item"><kbd>3</kbd><span>Go to Education</span></div>
        <div class="shortcut-item"><kbd>4</kbd><span>Go to Projects</span></div>
        <div class="shortcut-item"><kbd>5</kbd><span>Go to Experience</span></div>
        <div class="shortcut-item"><kbd>6</kbd><span>Go to Contact</span></div>
        <div class="shortcut-item"><kbd>T</kbd><span>Cycle theme</span></div>
        <div class="shortcut-item"><kbd>↑</kbd><span>Back to top</span></div>
        <div class="shortcut-item"><kbd>Esc</kbd><span>Close overlay</span></div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  function toggleOverlay() {
    overlayVisible = !overlayVisible;
    overlay.classList.toggle('active', overlayVisible);
  }

  document.addEventListener('keydown', (e) => {
    // Don't intercept if typing in an input/textarea
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

    if (e.key === '?') {
      toggleOverlay();
      return;
    }

    if (e.key === 'Escape' && overlayVisible) {
      toggleOverlay();
      return;
    }

    // Section navigation
    if (shortcuts[e.key]) {
      const target = document.querySelector(shortcuts[e.key]);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Theme cycle
    if (e.key.toLowerCase() === 't') {
      const currentClass = themes.find((t) => document.body.classList.contains(t));
      const currentIndex = themes.indexOf(currentClass);
      const nextTheme = themes[(currentIndex + 1) % themes.length];
      applyTheme(nextTheme);
      Toast.show(`Theme: ${nextTheme.replace('theme-', '').replace('-', ' ')}`, 'info', 1800);
      return;
    }

    // Back to top with up arrow
    if (e.key === 'ArrowUp' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      // Only if near top already or pressing from body context
    }
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) toggleOverlay();
  });
})();

/* ---------- 8. SMOOTH PAGE LOAD ENTRANCE ---------- */
(function initPageEntrance() {
  document.body.classList.add('page-loaded');
})();

/* ---------- 9. MAGNETIC BUTTONS ---------- */
(function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-tech, .btn-outline-light, .btn-outline-info');

  buttons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

/* ---------- 10. DYNAMIC CURSOR GLOW ---------- */
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;
    requestAnimationFrame(animateGlow);
  }

  animateGlow();
})();

/* ---------- 11. NAVBAR SHRINK ON SCROLL ---------- */
(function initNavShrink() {
  const nav = document.querySelector('.glass-nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 80;
    nav.classList.toggle('nav-scrolled', scrolled);
  }, { passive: true });
})();

/* ---------- 12. SKILL PILL HOVER RIPPLE ---------- */
(function initSkillRipple() {
  document.addEventListener('click', (e) => {
    const pill = e.target.closest('.skill-pill');
    if (!pill) return;

    const ripple = document.createElement('span');
    ripple.className = 'skill-ripple';
    const rect = pill.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    pill.style.position = 'relative';
    pill.style.overflow = 'hidden';
    pill.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
})();

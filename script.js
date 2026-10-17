/**
 * ============================================================================
 * SWATHI SHETTY — PERSONAL DEVELOPER PORTFOLIO
 * Vanilla JavaScript Logic:
 * - Theme Management (Light / Dark mode persistence)
 * - Mobile Drawer Navigation & Accessibility Focus Management
 * - Active ScrollSpy & Sticky Header Behavior
 * - Skill & Project Interactive Category Filtering
 * - Interactive Resume Modal & Native Print Trigger
 * - Clipboard Copy with Custom Toast Feedback
 * - Accessible Contact Form Validation & Direct Mailto Dispatcher
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Theme Management (Light by default, with Dark Mode toggle)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;
  const THEME_STORAGE_KEY = 'swathi_theme_preference';

  const applyTheme = (theme) => {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', theme === 'dark' ? '#090d16' : '#4f46e5');
    }
  };

  // Determine initial theme: saved preference -> default to 'light'
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
    });
  }

  // --------------------------------------------------------------------------
  // 2. Mobile Drawer Navigation
  // --------------------------------------------------------------------------
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (mobileToggleBtn) {
      mobileToggleBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden'; // prevent background scrolling
    mobileDrawerClose?.focus();
  };

  const closeDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (mobileToggleBtn) {
      mobileToggleBtn.setAttribute('aria-expanded', 'false');
      mobileToggleBtn.focus();
    }
    document.body.style.overflow = '';
  };

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', openDrawer);
  }

  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', closeDrawer);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // --------------------------------------------------------------------------
  // 3. Active Navigation ScrollSpy & Sticky Header
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const onScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // --------------------------------------------------------------------------
  // 4. Skills Category Filtering
  // --------------------------------------------------------------------------
  const skillFilterTabs = document.querySelectorAll('[data-skill-filter]');
  const skillCards = document.querySelectorAll('.skill-item-card');

  skillFilterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const selectedFilter = tab.getAttribute('data-skill-filter');

      // Update active tab styles & aria
      skillFilterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Filter cards
      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (selectedFilter === 'all' || category === selectedFilter) {
          card.classList.remove('hidden');
          card.style.opacity = '1';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 5. Projects Filtering
  // --------------------------------------------------------------------------
  const projectFilterTabs = document.querySelectorAll('[data-proj-filter]');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-proj-filter');

      projectFilterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-proj-cat') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 6. Interactive Resume Modal
  // --------------------------------------------------------------------------
  const resumeModal = document.getElementById('resume-modal');
  const resumeOpenBtns = [
    document.getElementById('resume-open-btn'),
    document.getElementById('hero-resume-trigger'),
    document.getElementById('mobile-resume-btn')
  ];
  const resumeCloseBtn = document.getElementById('resume-modal-close');
  const resumeCloseBottomBtn = document.getElementById('resume-modal-close-bottom');
  const resumeBackdrop = document.getElementById('resume-modal-backdrop');
  const resumePrintBtn = document.getElementById('resume-print-btn');
  let lastActiveElement = null;

  const openResumeModal = () => {
    if (!resumeModal) return;
    lastActiveElement = document.activeElement;
    closeDrawer(); // close mobile drawer if opened
    resumeModal.classList.add('open');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    resumeCloseBtn?.focus();
  };

  const closeResumeModal = () => {
    if (!resumeModal) return;
    resumeModal.classList.remove('open');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveElement) {
      lastActiveElement.focus();
    }
  };

  resumeOpenBtns.forEach(btn => {
    btn?.addEventListener('click', openResumeModal);
  });

  resumeCloseBtn?.addEventListener('click', closeResumeModal);
  resumeCloseBottomBtn?.addEventListener('click', closeResumeModal);
  resumeBackdrop?.addEventListener('click', closeResumeModal);

  if (resumePrintBtn) {
    resumePrintBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Global ESC key listener for modals & drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (resumeModal && resumeModal.classList.contains('open')) {
        closeResumeModal();
      } else if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      }
    }
  });

  // --------------------------------------------------------------------------
  // 7. Toast Notification & Copy-to-Clipboard
  // --------------------------------------------------------------------------
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  let toastTimeout = null;

  const showToast = (message) => {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    toast.setAttribute('aria-hidden', 'false');

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
      toast.setAttribute('aria-hidden', 'true');
    }, 3200);
  };

  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Copied: ${textToCopy}`);
      } catch (err) {
        // Fallback for older browsers
        const tempInput = document.createElement('input');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast(`Copied: ${textToCopy}`);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 8. Contact Form Validation & Mailto Dispatcher
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Reset errors
      nameError.textContent = '';
      emailError.textContent = '';
      subjectError.textContent = '';
      messageError.textContent = '';

      // Validate Name
      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please provide your full name.';
        isValid = false;
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        emailError.textContent = 'Please enter your email address.';
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        subjectError.textContent = 'Please enter a subject.';
        isValid = false;
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageError.textContent = 'Please type a message before sending.';
        isValid = false;
      }

      if (!isValid) return;

      // Build Mailto link
      const recipient = 'swathishettyswathi49@gmail.com';
      const subject = encodeURIComponent(`[Portfolio Contact] ${subjectInput.value.trim()}`);
      const body = encodeURIComponent(
        `Hello Swathi,\n\n${messageInput.value.trim()}\n\nBest regards,\n${nameInput.value.trim()}\n(${emailInput.value.trim()})`
      );

      const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;
      
      showToast('Opening your default email client...');
      window.location.href = mailtoUrl;

      contactForm.reset();
    });
  }

  // --------------------------------------------------------------------------
  // 9. Back to Top Button
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. Dynamic Copyright Year
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});

(function initPageLoad() {
  if (window.__pageLoadInit) return;
  window.__pageLoadInit = true;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    document.documentElement.classList.remove("page-loading");
    document.body.classList.remove("page-loading");
    document.getElementById("page-loader")?.remove();
    return;
  }

  const MIN_MS = 800;
  const MAX_MS = 1500;
  const start = performance.now();
  let done = false;
  let resourcesReady = false;

  function finish() {
    if (done) return;
    done = true;

    const root = document.documentElement;
    const body = document.body;
    const loader = document.getElementById("page-loader");

    root.classList.remove("page-loading");
    body.classList.remove("page-loading");
    body.classList.add("page-ready");

    if (!loader) return;

    loader.classList.add("page-loader--hide");
    const removeLoader = () => loader.remove();
    loader.addEventListener("transitionend", removeLoader, { once: true });
    setTimeout(removeLoader, 400);
  }

  function tryFinish() {
    if (done) return;
    const elapsed = performance.now() - start;
    if (!resourcesReady && elapsed < MAX_MS) return;

    const delay = Math.max(0, MIN_MS - elapsed);
    setTimeout(finish, delay);
  }

  window.addEventListener("load", () => {
    resourcesReady = true;
    tryFinish();
  }, { once: true });

  setTimeout(() => {
    resourcesReady = true;
    tryFinish();
  }, MAX_MS);
})();

(function initThemeToggle() {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-toggle-icon");

  function applyTheme(isDark) {
    root.classList.toggle("dark", isDark);
    if (icon) icon.textContent = isDark ? "☀️" : "🌙";
    if (toggle) {
      toggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );
    }
  }

  applyTheme(false);

  toggle?.addEventListener("click", () => {
    root.classList.add("theme-transitioning");
    applyTheme(!root.classList.contains("dark"));
    setTimeout(() => root.classList.remove("theme-transitioning"), 300);
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  const VALID_TABS = new Set([
    "overview",
    "info",
    "features",
    "reviews",
    "contact",
  ]);
  const VALID_DOC_SECTIONS = new Set(["overview", "api", "getting-started"]);
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const MAX_NAME_LEN = 100;
  const MAX_EMAIL_LEN = 254;
  const MAX_MESSAGE_LEN = 2000;

  const tabs = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-content");
  const indicator = document.getElementById("tab-indicator");
  const contentCard = document.getElementById("content-card");

  const TAB_TRANSITION_MS = 320;
  const TOAST_ICON_BASE =
    "feedback-toast-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold";

  let resizeRaf = null;
  let formSubmitting = false;
  let trialSubmitting = false;

  function isValidEmail(value) {
    if (!value || value.length > MAX_EMAIL_LEN) return false;
    return EMAIL_PATTERN.test(value);
  }

  function truncate(value, maxLen) {
    return typeof value === "string" ? value.slice(0, maxLen) : "";
  }

  function moveIndicator(activeTab) {
    if (!indicator || !activeTab) return;
    indicator.style.width = `${activeTab.offsetWidth}px`;
    indicator.style.height = `${activeTab.offsetHeight}px`;
    indicator.style.transform = `translate(${activeTab.offsetLeft}px, ${activeTab.offsetTop}px)`;
  }

  function getPanelForTab(tabName) {
    if (!tabName || !VALID_TABS.has(tabName)) return null;
    return document.querySelector(`[data-content="${CSS.escape(tabName)}"]`);
  }

  function activateTab(clickedTab, { animate = true } = {}) {
    if (!clickedTab) return;

    const target = clickedTab.dataset.tab;
    if (!target || !VALID_TABS.has(target)) return;

    tabs.forEach((tab) => {
      tab.classList.remove("active");
      tab.setAttribute("aria-selected", "false");
    });

    panels.forEach((panel) => {
      panel.classList.remove("active", "tab-enter", "tab-enter-active");
      panel.hidden = true;
    });

    clickedTab.classList.add("active");
    clickedTab.setAttribute("aria-selected", "true");

    const activePanel = getPanelForTab(target);
    if (activePanel) {
      activePanel.hidden = false;

      if (animate) {
        activePanel.classList.add("tab-enter");
        requestAnimationFrame(() => {
          activePanel.classList.add("active", "tab-enter-active");
          requestAnimationFrame(() => {
            activePanel.classList.remove("tab-enter");
          });
        });
      } else {
        activePanel.classList.add("active");
      }
    }

    moveIndicator(clickedTab);
  }

  function switchToTab(tabName) {
    if (!tabName || !VALID_TABS.has(tabName)) return Promise.resolve(false);

    const tab = document.querySelector(
      `.tab-btn[data-tab="${CSS.escape(tabName)}"]`
    );
    if (!tab) return Promise.resolve(false);

    const isAlreadyActive = tab.classList.contains("active");
    if (!isAlreadyActive) {
      activateTab(tab, { animate: true });
    }

    return new Promise((resolve) => {
      setTimeout(() => resolve(true), isAlreadyActive ? 0 : TAB_TRANSITION_MS);
    });
  }

  function scrollToElement(el, { offset = 24 } = {}) {
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top - offset;

    window.scrollTo({ top: scrollTop, behavior: "smooth" });
  }

  function pulseHighlight(el, duration = 1800) {
    if (!el) return;
    el.classList.remove("ux-highlight");
    void el.offsetWidth;
    el.classList.add("ux-highlight");
    setTimeout(() => el.classList.remove("ux-highlight"), duration);
  }

  function revealElement(el) {
    if (!el) return;
    el.classList.remove("hidden");
    el.classList.add("is-visible");
  }

  function staggerAnimate(items, className, delayMs = 120) {
    items.forEach((item, index) => {
      item.classList.remove(className);
      setTimeout(() => {
        item.classList.add(className);
      }, index * delayMs);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (tab.classList.contains("active")) return;
      activateTab(tab);
    });
  });

  const initialTab = document.querySelector(".tab-btn.active");
  if (initialTab) {
    moveIndicator(initialTab);
  }

  window.addEventListener("resize", () => {
    if (resizeRaf !== null) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      resizeRaf = null;
      const current = document.querySelector(".tab-btn.active");
      if (current) moveIndicator(current);
    });
  });

  /* ── Documentation Drawer ── */
  const docOverlay = document.getElementById("doc-drawer-overlay");
  const docDrawer = document.getElementById("doc-drawer");
  const docCloseBtn = document.getElementById("doc-drawer-close");
  const docNavBtns = document.querySelectorAll(".doc-nav-btn");
  const docSections = document.querySelectorAll(".doc-section");

  function openDocDrawer() {
    if (!docOverlay || !docDrawer) return;
    docOverlay.classList.remove("hidden");
    docOverlay.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => {
      docOverlay.classList.add("is-open");
      docDrawer.classList.add("is-open");
    });
    document.body.style.overflow = "hidden";
  }

  function closeDocDrawer() {
    if (!docOverlay || !docDrawer) return;
    docOverlay.classList.remove("is-open");
    docDrawer.classList.remove("is-open");
    docOverlay.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      docOverlay.classList.add("hidden");
      document.body.style.overflow = "";
    }, 350);
  }

  function switchDocSection(sectionName) {
    if (!sectionName || !VALID_DOC_SECTIONS.has(sectionName)) return;

    docNavBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.docSection === sectionName);
    });

    docSections.forEach((section) => {
      const isActive = section.id === `doc-section-${sectionName}`;
      section.hidden = !isActive;
      section.classList.toggle("active", isActive);
    });
  }

  docCloseBtn?.addEventListener("click", closeDocDrawer);
  docOverlay?.addEventListener("click", (e) => {
    if (e.target === docOverlay) closeDocDrawer();
  });

  docNavBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.dataset.docSection;
      if (section) switchDocSection(section);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && docOverlay?.classList.contains("is-open")) {
      closeDocDrawer();
    }
  });

  /* ── Action Buttons ── */
  const signupCta = document.getElementById("signup-cta");
  const contactForm = document.getElementById("contact-form");
  const contactNameInput = document.getElementById("contact-name");

  document.querySelector('[data-action="get-started"]')?.addEventListener("click", async () => {
    await switchToTab("contact");
    revealElement(signupCta);
    scrollToElement(signupCta);
    setTimeout(() => pulseHighlight(signupCta), TAB_TRANSITION_MS + 100);
  });

  document.querySelector('[data-action="view-docs"]')?.addEventListener("click", () => {
    switchDocSection("overview");
    openDocDrawer();
  });

  document.querySelector('[data-action="explore-features"]')?.addEventListener("click", async () => {
    await switchToTab("info");
    scrollToElement(contentCard);
    const statCards = document.querySelectorAll(".info-stat-card");
    staggerAnimate(statCards, "info-animate");
    setTimeout(() => {
      statCards.forEach((card) => pulseHighlight(card));
    }, statCards.length * 120 + 100);
  });

  document.querySelector('[data-action="read-reviews"]')?.addEventListener("click", async () => {
    await switchToTab("reviews");
    const reviewsSection = document.getElementById("reviews-section");
    scrollToElement(reviewsSection);
    const reviewCards = document.querySelectorAll(".review-card");
    staggerAnimate(reviewCards, "review-animate");
    setTimeout(() => pulseHighlight(reviewsSection), reviewCards.length * 120 + 100);
  });

  document.querySelector('[data-action="send-message"]')?.addEventListener("click", async () => {
    await switchToTab("contact");
    revealElement(contactForm);
    scrollToElement(contactForm);
    setTimeout(() => {
      pulseHighlight(contactForm);
      contactNameInput?.focus({ preventScroll: true });
    }, TAB_TRANSITION_MS + 150);
  });

  /* ── Feedback Toast ── */
  const feedbackToast = document.getElementById("feedback-toast");
  const feedbackToastMessage = document.getElementById("feedback-toast-message");
  const feedbackToastIcon = document.getElementById("feedback-toast-icon");
  const contactEmailInput = document.getElementById("contact-email");
  const contactMessageInput = document.getElementById("contact-message");

  let toastShowTimer = null;
  let toastHideTimer = null;

  function showToast(message, type = "success") {
    if (!feedbackToast || !feedbackToastMessage || !feedbackToastIcon) return;

    clearTimeout(toastShowTimer);
    clearTimeout(toastHideTimer);

    feedbackToastMessage.textContent = message;
    feedbackToastIcon.textContent = type === "success" ? "✓" : "!";
    feedbackToastIcon.className =
      TOAST_ICON_BASE +
      (type === "success"
        ? " feedback-toast-icon--success"
        : " feedback-toast-icon--error");

    feedbackToast.hidden = false;
    feedbackToast.classList.remove("is-hiding", "is-visible");

    requestAnimationFrame(() => {
      feedbackToast.classList.add("is-visible");
    });

    toastShowTimer = setTimeout(() => {
      feedbackToast.classList.remove("is-visible");
      feedbackToast.classList.add("is-hiding");
      toastHideTimer = setTimeout(() => {
        feedbackToast.hidden = true;
        feedbackToast.classList.remove("is-hiding");
      }, 250);
    }, 2500);
  }

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (formSubmitting) return;

    const name = truncate(contactNameInput?.value.trim() ?? "", MAX_NAME_LEN);
    const email = truncate(contactEmailInput?.value.trim() ?? "", MAX_EMAIL_LEN);
    const message = truncate(
      contactMessageInput?.value.trim() ?? "",
      MAX_MESSAGE_LEN
    );

    if (!name || !email || !message) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    formSubmitting = true;
    showToast("Message sent successfully!", "success");
    setTimeout(() => {
      formSubmitting = false;
    }, 600);
  });

  signupCta?.querySelector("button")?.addEventListener("click", () => {
    if (trialSubmitting) return;

    const emailInput = signupCta.querySelector('input[type="email"]');
    const email = truncate(emailInput?.value.trim() ?? "", MAX_EMAIL_LEN);

    if (!email) {
      showToast("Please enter required details to start trial", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    trialSubmitting = true;
    showToast("Your free trial has started!", "success");
    setTimeout(() => {
      trialSubmitting = false;
    }, 600);
  });
});

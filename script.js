document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-content");
  const indicator = document.getElementById("tab-indicator");
  const contentCard = document.getElementById("content-card");

  const TAB_TRANSITION_MS = 320;

  function moveIndicator(activeTab) {
    indicator.style.width = `${activeTab.offsetWidth}px`;
    indicator.style.height = `${activeTab.offsetHeight}px`;
    indicator.style.transform = `translate(${activeTab.offsetLeft}px, ${activeTab.offsetTop}px)`;
  }

  function activateTab(clickedTab, { animate = true } = {}) {
    const target = clickedTab.dataset.tab;

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

    const activePanel = document.querySelector(`[data-content="${target}"]`);
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
    const tab = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
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
    tab.addEventListener("click", () => activateTab(tab));
  });

  const initialTab = document.querySelector(".tab-btn.active");
  if (initialTab) {
    moveIndicator(initialTab);
  }

  window.addEventListener("resize", () => {
    const current = document.querySelector(".tab-btn.active");
    if (current) moveIndicator(current);
  });

  /* ── Documentation Drawer ── */
  const docOverlay = document.getElementById("doc-drawer-overlay");
  const docDrawer = document.getElementById("doc-drawer");
  const docCloseBtn = document.getElementById("doc-drawer-close");
  const docNavBtns = document.querySelectorAll(".doc-nav-btn");
  const docSections = document.querySelectorAll(".doc-section");

  function openDocDrawer() {
    docOverlay.classList.remove("hidden");
    docOverlay.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => {
      docOverlay.classList.add("is-open");
      docDrawer.classList.add("is-open");
    });
    document.body.style.overflow = "hidden";
  }

  function closeDocDrawer() {
    docOverlay.classList.remove("is-open");
    docDrawer.classList.remove("is-open");
    docOverlay.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      docOverlay.classList.add("hidden");
      document.body.style.overflow = "";
    }, 350);
  }

  function switchDocSection(sectionName) {
    docNavBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.docSection === sectionName);
    });

    docSections.forEach((section) => {
      const isActive = section.id === `doc-section-${sectionName}`;
      section.hidden = !isActive;
      section.classList.toggle("active", isActive);
    });
  }

  docCloseBtn.addEventListener("click", closeDocDrawer);
  docOverlay.addEventListener("click", (e) => {
    if (e.target === docOverlay) closeDocDrawer();
  });

  docNavBtns.forEach((btn) => {
    btn.addEventListener("click", () => switchDocSection(btn.dataset.docSection));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && docOverlay.classList.contains("is-open")) {
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

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    pulseHighlight(contactForm);
  });
});

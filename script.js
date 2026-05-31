document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-content");
  const indicator = document.getElementById("tab-indicator");

  function moveIndicator(activeTab) {
    indicator.style.width = `${activeTab.offsetWidth}px`;
    indicator.style.height = `${activeTab.offsetHeight}px`;
    indicator.style.transform = `translate(${activeTab.offsetLeft}px, ${activeTab.offsetTop}px)`;
  }

  function activateTab(clickedTab) {
    const target = clickedTab.dataset.tab;

    tabs.forEach((tab) => {
      tab.classList.remove("active");
      tab.setAttribute("aria-selected", "false");
    });

    panels.forEach((panel) => {
      panel.classList.remove("active");
      panel.hidden = true;
    });

    clickedTab.classList.add("active");
    clickedTab.setAttribute("aria-selected", "true");

    const activePanel = document.querySelector(`[data-content="${target}"]`);
    if (activePanel) {
      activePanel.hidden = false;

      requestAnimationFrame(() => {
        activePanel.classList.add("active");
      });
    }

    moveIndicator(clickedTab);
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
});

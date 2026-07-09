/* =========================================================
   GraphRAG Pipeline — Interactions
   ========================================================= */

(function () {
  "use strict";

  /* --- Sidebar Toggle --- */
  var sidebar = document.getElementById("sidebar");
  var sidebarToggle = document.getElementById("sidebarToggle");

  if (sidebar && sidebarToggle) {
    sidebarToggle.addEventListener("click", function () {
      sidebar.classList.toggle("collapsed");
    });
  }

  /* --- Sidebar mobile toggle --- */
  var sidebarLinks = document.querySelectorAll(".sidebar-link");

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function closeSidebarMobile() {
    if (isMobile() && sidebar) {
      sidebar.classList.remove("open");
    }
  }

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", function (e) {
      if (isMobile()) {
        e.stopPropagation();
        sidebar.classList.toggle("open");
      }
    });
  }

  document.addEventListener("click", function (e) {
    if (isMobile() && sidebar && sidebar.classList.contains("open")) {
      if (!sidebar.contains(e.target)) {
        closeSidebarMobile();
      }
    }
  });

  if (sidebarLinks) {
    sidebarLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        closeSidebarMobile();
      });
    });
  }

  /* --- Active Section Tracking (IntersectionObserver) --- */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".sidebar-link");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (link) {
              link.classList.remove("active");
              if (link.getAttribute("href") === "#" + entry.target.id) {
                link.classList.add("active");
              }
            });
          }
        });
      },
      {
        rootMargin: "-72px 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* --- Other Works Popover --- */
  var otherWorksBtn = document.getElementById("otherWorksBtn");
  var otherWorksPopover = document.getElementById("otherWorksPopover");

  if (otherWorksBtn && otherWorksPopover) {
    otherWorksBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = otherWorksPopover.classList.contains("visible");
      otherWorksPopover.classList.toggle("visible");
      otherWorksBtn.setAttribute("aria-expanded", !isOpen);
    });

    document.addEventListener("click", function (e) {
      if (
        otherWorksPopover.classList.contains("visible") &&
        !otherWorksBtn.contains(e.target) &&
        !otherWorksPopover.contains(e.target)
      ) {
        otherWorksPopover.classList.remove("visible");
        otherWorksBtn.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (
        e.key === "Escape" &&
        otherWorksPopover.classList.contains("visible")
      ) {
        otherWorksPopover.classList.remove("visible");
        otherWorksBtn.setAttribute("aria-expanded", "false");
        otherWorksBtn.focus();
      }
    });

    otherWorksBtn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        var items = otherWorksPopover.querySelectorAll('[role="menuitem"]');
        if (items.length) {
          otherWorksPopover.classList.add("visible");
          otherWorksBtn.setAttribute("aria-expanded", "true");
          items[0].focus();
        }
      }
    });
  }
})();

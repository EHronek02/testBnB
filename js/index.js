// Current year for copyright
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile Navigation & Scroll Handling
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const closeMenuBtn = document.getElementById("closeMenuBtn");
  const mainNav = document.getElementById("mainNav");
  const navLinks = document.querySelectorAll("nav ul li a");
  const header = document.getElementById("header");

  // Toggle mobile menu
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener("click", () => {
      mainNav.classList.toggle("active");
      mobileMenuBtn.innerHTML = mainNav.classList.contains("active")
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
      document.body.style.overflow = mainNav.classList.contains("active") ? "hidden" : "";
    });
  }

  // Close menu via close button
  if (closeMenuBtn && mainNav) {
    closeMenuBtn.addEventListener("click", () => {
      mainNav.classList.remove("active");
      mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      document.body.style.overflow = "";
    });
  }

  // Close menu when clicking nav link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (mainNav) mainNav.classList.remove("active");
      mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      document.body.style.overflow = "";
    });
  });

  // Header scroll effect
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 90, // Offset for fixed header
          behavior: "smooth",
        });

        // Close mobile menu after click
        if (mainNav && mainNav.classList.contains("active")) {
          mainNav.classList.remove("active");
          mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
          document.body.style.overflow = "";
        }
      }
    });
  });

  // Active link highlighting
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll("nav ul li a");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navAnchors.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // Fade-in animations
  const fadeElements = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  fadeElements.forEach((element) => {
    element.style.opacity = 0;
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(element);
  });
});

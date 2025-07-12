// Current year for copyright
document.getElementById("year").textContent = new Date().getFullYear();

// Main DOMContentLoaded handler
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu elements
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

  // Close mobile menu via button
  if (closeMenuBtn && mainNav) {
    closeMenuBtn.addEventListener("click", () => {
      mainNav.classList.remove("active");
      mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      document.body.style.overflow = "";
    });
  }

  // Close menu when clicking nav links
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
          top: targetElement.offsetTop - 90,
          behavior: "smooth",
        });
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

  // === Image Modal & Gallery Functionality ===
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const captionText = document.querySelector(".caption");
  const prevArrow = document.querySelector(".nav-arrow.prev");
  const nextArrow = document.querySelector(".nav-arrow.next");
  const thumbnailContainer = document.getElementById("thumbnailContainer");

  let currentGallery = [];
  let currentAlts = [];
  let currentImageIndex = 0;

  // Open modal with specific image
  function openModal(imageSrc, altText, imagesArray = [], altsArray = []) {
    if (!modal || !modalImg || !captionText) return;

    modal.style.display = "block";
    modalImg.src = imageSrc;
    captionText.innerHTML = altText;
    document.body.style.overflow = "hidden";

    if (imagesArray.length > 0) {
      currentGallery = imagesArray;
      currentAlts = altsArray;
      currentImageIndex = imagesArray.indexOf(imageSrc);

      if (prevArrow && nextArrow) {
        prevArrow.style.display = currentGallery.length > 1 ? "flex" : "none";
        nextArrow.style.display = currentGallery.length > 1 ? "flex" : "none";
      }

      if (thumbnailContainer) {
        createThumbnails();
      }
    } else {
      currentGallery = [];
      if (prevArrow && nextArrow) {
        prevArrow.style.display = "none";
        nextArrow.style.display = "none";
      }
      if (thumbnailContainer) {
        thumbnailContainer.innerHTML = "";
      }
    }
  }

  // Create thumbnails
  function createThumbnails() {
    if (!thumbnailContainer) return;
    thumbnailContainer.innerHTML = "";
    currentGallery.forEach((img, index) => {
      const thumb = document.createElement("img");
      thumb.src = img;
      thumb.className = "thumbnail" + (index === currentImageIndex ? " active" : "");
      thumb.addEventListener("click", () => showModal(index));
      thumbnailContainer.appendChild(thumb);
    });
  }

  // Change image in modal
  function showModal(index) {
    currentImageIndex = index;
    modalImg.src = currentGallery[index];
    captionText.innerHTML = currentAlts[index];

    document.querySelectorAll(".thumbnail").forEach((thumb, i) => {
      thumb.classList.remove("active");
      if (i === index) thumb.classList.add("active");
    });
  }

  // Click event for room images
  document.querySelectorAll(".room-img img").forEach((img) => {
    img.addEventListener("click", function () {
      openModal(this.src, this.alt);
    });
  });

  // Click event for "See More Photos" buttons
  document.querySelectorAll(".see-more-photos").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const images = JSON.parse(this.getAttribute("data-images") || "[]");
      const alts = JSON.parse(this.getAttribute("data-alts") || "[]");
      if (images.length > 0) {
        openModal(images[0], alts[0] || "", images, alts);
      }
    });
  });

  // Close modal when clicking the X
  const closeModal = document.querySelector(".close-modal");
  if (closeModal) {
    closeModal.addEventListener("click", function () {
      modal.style.display = "none";
      document.body.style.overflow = "";
    });
  }

  // Close modal when clicking outside the image
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }
  });

  // Navigation arrows
  if (prevArrow && nextArrow) {
    prevArrow.addEventListener("click", function () {
      if (currentGallery.length <= 1) return;
      currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
      showModal(currentImageIndex);
    });

    nextArrow.addEventListener("click", function () {
      if (currentGallery.length <= 1) return;
      currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
      showModal(currentImageIndex);
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (modal.style.display !== "block") return;

    if (e.key === "Escape") {
      modal.style.display = "none";
      document.body.style.overflow = "";
    } else if (e.key === "ArrowLeft" && currentGallery.length > 1) {
      currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
      showModal(currentImageIndex);
    } else if (e.key === "ArrowRight" && currentGallery.length > 1) {
      currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
      showModal(currentImageIndex);
    }
  });

  // Touch swipe navigation
  let touchStartX = 0;
  let touchEndX = 0;

  modal.addEventListener("touchstart", function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  modal.addEventListener("touchend", function (e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);

  function handleSwipe() {
    const threshold = 50;
    if (touchStartX - touchEndX > threshold && currentGallery.length > 1) {
      currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
      showModal(currentImageIndex);
    } else if (touchEndX - touchStartX > threshold && currentGallery.length > 1) {
      currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
      showModal(currentImageIndex);
    }
  }
});

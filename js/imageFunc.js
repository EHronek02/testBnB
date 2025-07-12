// Image Modal Functionality
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("imageModal");
  if (!modal) return;

  const modalImg = document.getElementById("modalImage");
  const captionText = document.querySelector(".caption");
  const closeModal = document.querySelector(".close-modal");
  const prevArrow = document.querySelector(".nav-arrow.prev");
  const nextArrow = document.querySelector(".nav-arrow.next");
  const thumbnailContainer = document.getElementById("thumbnailContainer");

  let currentImages = [];
  let currentAlts = [];
  let currentIndex = 0;

  // Open modal with specific image
  function openModal(imageSrc, altText, imagesArray = [], altsArray = []) {
    if (!modal || !modalImg || !captionText) return;

    modal.style.display = "block";
    modalImg.src = imageSrc;
    captionText.innerHTML = altText;
    document.body.style.overflow = "hidden";

    if (imagesArray.length > 0) {
      currentImages = imagesArray;
      currentAlts = altsArray;
      currentIndex = imagesArray.indexOf(imageSrc);

      if (prevArrow && nextArrow) {
        prevArrow.style.display = "flex";
        nextArrow.style.display = "flex";
      }

      if (thumbnailContainer) {
        createThumbnails();
      }
    } else {
      currentImages = [];
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
    thumbnailContainer.innerHTML = "";
    currentImages.forEach((img, index) => {
      const thumb = document.createElement("img");
      thumb.src = img;
      thumb.className = "thumbnail" + (index === currentIndex ? " active" : "");
      thumb.addEventListener("click", () => showModal(index));
      thumbnailContainer.appendChild(thumb);
    });
  }

  // Change image
  function showModal(index) {
    currentIndex = index;
    modalImg.src = currentImages[index];
    captionText.textContent = currentAlts[index];

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
  if (prevArrow) {
    prevArrow.addEventListener("click", function () {
      if (currentImages.length <= 1) return;
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      showModal(currentIndex);
    });
  }

  if (nextArrow) {
    nextArrow.addEventListener("click", function () {
      if (currentImages.length <= 1) return;
      currentIndex = (currentIndex + 1) % currentImages.length;
      showModal(currentIndex);
    });
  });

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (modal.style.display !== "block") return;

    if (e.key === "Escape") {
      modal.style.display = "none";
      document.body.style.overflow = "";
    } else if (e.key === "ArrowLeft" && currentImages.length > 1) {
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      showModal(currentIndex);
    } else if (e.key === "ArrowRight" && currentImages.length > 1) {
      currentIndex = (currentIndex + 1) % currentImages.length;
      showModal(currentIndex);
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
    if (touchStartX - touchEndX > threshold) {
      // Swipe left - next image
      currentIndex = (currentIndex + 1) % currentImages.length;
      showModal(currentIndex);
    } else if (touchEndX - touchStartX > threshold) {
      // Swipe right - previous image
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      showModal(currentIndex);
    }
  }
});

// Image Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const modal = document.getElementById('imageModal');
    if (!modal) return;
    
    const modalImg = document.getElementById('modalImage');
    const captionText = document.querySelector('.caption');
    const closeModal = document.querySelector('.close-modal');
    const prevArrow = document.querySelector('.nav-arrow.prev');
    const nextArrow = document.querySelector('.nav-arrow.next');
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    
    // Gallery variables
    let currentImageIndex = 0;
    let currentGallery = [];
    let currentAlts = [];

    // Function to open modal with specific image
    function openModal(imageSrc, altText, imagesArray = [], altsArray = []) {
        if (!modal || !modalImg || !captionText) return;
        
        modal.style.display = "block";
        modalImg.src = imageSrc;
        captionText.innerHTML = altText;
        document.body.style.overflow = 'hidden';
        
        if (imagesArray.length > 0) {
            currentGallery = imagesArray;
            currentAlts = altsArray;
            currentImageIndex = imagesArray.indexOf(imageSrc);
            
            // Show navigation arrows if they exist
            if (prevArrow && nextArrow) {
                prevArrow.style.display = 'flex';
                nextArrow.style.display = 'flex';
            }
            
            // Create thumbnails if container exists
            if (thumbnailContainer) {
                createThumbnails();
            }
        } else {
            currentGallery = [];
            if (prevArrow && nextArrow) {
                prevArrow.style.display = 'none';
                nextArrow.style.display = 'none';
            }
            if (thumbnailContainer) {
                thumbnailContainer.innerHTML = '';
            }
        }
    }

    // Function to create thumbnails
    function createThumbnails() {
        thumbnailContainer.innerHTML = '';
        currentGallery.forEach((img, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = img;
            thumbnail.className = 'thumbnail';
            if (index === currentImageIndex) {
                thumbnail.classList.add('active');
            }
            thumbnail.addEventListener('click', () => {
                changeImage(index);
            });
            thumbnailContainer.appendChild(thumbnail);
        });
    }

    // Function to change image in modal
    function changeImage(index) {
        currentImageIndex = index;
        if (modalImg) modalImg.src = currentGallery[index];
        if (captionText) captionText.innerHTML = currentAlts[index];
        
        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            if (i === index) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    // Click event for room images
    document.querySelectorAll('.room-img img').forEach(img => {
        img.addEventListener('click', function() {
            openModal(this.src, this.alt);
        });
    });

    // Click event for "See More Photos" buttons
    document.querySelectorAll('.see-more-photos').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const images = JSON.parse(this.getAttribute('data-images') || '[]');
            const alts = JSON.parse(this.getAttribute('data-alts') || '[]');
            openModal(images[0], alts[0], images, alts);
        });
    });

    // Close modal when clicking the X
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = "none";
            document.body.style.overflow = '';
        });
    }

    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = '';
        }
    });

    // Navigation arrows
    if (prevArrow) {
        prevArrow.addEventListener('click', function() {
            if (currentGallery.length <= 1) return;
            let newIndex = currentImageIndex - 1;
            if (newIndex < 0) newIndex = currentGallery.length - 1;
            changeImage(newIndex);
        });
    }

    if (nextArrow) {
        nextArrow.addEventListener('click', function() {
            if (currentGallery.length <= 1) return;
            let newIndex = currentImageIndex + 1;
            if (newIndex >= currentGallery.length) newIndex = 0;
            changeImage(newIndex);
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.style.display !== "block") return;
        
        if (e.key === "Escape") {
            modal.style.display = "none";
            document.body.style.overflow = '';
        } else if (e.key === "ArrowLeft" && currentGallery.length > 1) {
            let newIndex = currentImageIndex - 1;
            if (newIndex < 0) newIndex = currentGallery.length - 1;
            changeImage(newIndex);
        } else if (e.key === "ArrowRight" && currentGallery.length > 1) {
            let newIndex = currentImageIndex + 1;
            if (newIndex >= currentGallery.length) newIndex = 0;
            changeImage(newIndex);
        }
    });

    // Touch events for mobile swipe navigation
    let touchStartX = 0;
    let touchEndX = 0;

    modal.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    modal.addEventListener('touchend', function(e) {
        if (currentGallery.length <= 1) return;
        
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const threshold = 50;
        
        if (touchStartX - touchEndX > threshold) {
            // Swipe left - next image
            let newIndex = currentImageIndex + 1;
            if (newIndex >= currentGallery.length) newIndex = 0;
            changeImage(newIndex);
        } else if (touchEndX - touchStartX > threshold) {
            // Swipe right - previous image
            let newIndex = currentImageIndex - 1;
            if (newIndex < 0) newIndex = currentGallery.length - 1;
            changeImage(newIndex);
        }
    }
});

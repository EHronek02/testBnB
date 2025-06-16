// Image Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.querySelector('.caption');
    const closeModal = document.querySelector('.close-modal');
    const prevArrow = document.querySelector('.prev');
    const nextArrow = document.querySelector('.next');
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    
    // Gallery variables
    let currentImageIndex = 0;
    let currentGallery = [];
    let currentAlts = [];

    // Function to open modal with specific image
    function openModal(imageSrc, altText, imagesArray = [], altsArray = []) {
        modal.style.display = "block";
        modalImg.src = imageSrc;
        captionText.innerHTML = altText;
        document.body.style.overflow = 'hidden';
        
        // If we have a gallery, set it up
        if (imagesArray.length > 0) {
            currentGallery = imagesArray;
            currentAlts = altsArray;
            currentImageIndex = imagesArray.indexOf(imageSrc);
            
            // Show navigation arrows if multiple images
            prevArrow.style.display = currentGallery.length > 1 ? 'block' : 'none';
            nextArrow.style.display = currentGallery.length > 1 ? 'block' : 'none';
            
            // Create thumbnails
            createThumbnails();
        } else {
            currentGallery = [];
            prevArrow.style.display = 'none';
            nextArrow.style.display = 'none';
            thumbnailContainer.innerHTML = '';
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
        modalImg.src = currentGallery[index];
        captionText.innerHTML = currentAlts[index];
        
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
            const images = JSON.parse(this.getAttribute('data-images'));
            const alts = JSON.parse(this.getAttribute('data-alts'));
            openModal(images[0], alts[0], images, alts);
        });
    });

    // Close modal when clicking the X
    closeModal.addEventListener('click', function() {
        modal.style.display = "none";
        document.body.style.overflow = '';
    });

    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = '';
        }
    });

    // Navigation arrows
    prevArrow.addEventListener('click', function() {
        let newIndex = currentImageIndex - 1;
        if (newIndex < 0) newIndex = currentGallery.length - 1;
        changeImage(newIndex);
    });

    nextArrow.addEventListener('click', function() {
        let newIndex = currentImageIndex + 1;
        if (newIndex >= currentGallery.length) newIndex = 0;
        changeImage(newIndex);
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.style.display !== "block") return;
        
        if (e.key === "Escape") {
            modal.style.display = "none";
            document.body.style.overflow = '';
        } else if (e.key === "ArrowLeft") {
            let newIndex = currentImageIndex - 1;
            if (newIndex < 0) newIndex = currentGallery.length - 1;
            changeImage(newIndex);
        } else if (e.key === "ArrowRight") {
            let newIndex = currentImageIndex + 1;
            if (newIndex >= currentGallery.length) newIndex = 0;
            changeImage(newIndex);
        }
    });
});
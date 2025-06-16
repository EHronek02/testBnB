// Current year for copyright
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile Navigation Functionality
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('nav ul li a');

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close mobile menu
    closeMenuBtn.addEventListener('click', () => {
        mainNav.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Header scroll effect (keep only one instance)
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Fixed Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Make sure mainNav is available in this scope
            if (mainNav) mainNav.classList.remove('active');
            
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') { // Check for valid selector
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Enhanced Image Modal Functionality with Navigation Arrows
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.querySelector('.caption');
    const closeModal = document.querySelector('.close-modal');
    const prevArrow = document.querySelector('.nav-arrow.prev');
    const nextArrow = document.querySelector('.nav-arrow.next');
    
    // Gallery variables
    let currentImageIndex = 0;
    let currentGallery = [];
    let currentAlts = [];

    function openModal(imageSrc, altText, imagesArray = [], altsArray = []) {
        modal.style.display = "block";
        modalImg.src = imageSrc;
        captionText.innerHTML = altText;
        document.body.style.overflow = 'hidden';
        
        if (imagesArray.length > 0) {
            currentGallery = imagesArray;
            currentAlts = altsArray;
            currentImageIndex = imagesArray.indexOf(imageSrc);
            
            // Show navigation arrows if multiple images
            if (prevArrow && nextArrow) {
                prevArrow.style.display = currentGallery.length > 1 ? 'flex' : 'none';
                nextArrow.style.display = currentGallery.length > 1 ? 'flex' : 'none';
            }
        } else {
            currentGallery = [];
            if (prevArrow && nextArrow) {
                prevArrow.style.display = 'none';
                nextArrow.style.display = 'none';
            }
        }
    }

    // Click event for room images
    document.querySelectorAll('.room-img img').forEach(img => {
        img.addEventListener('click', function() {
            openModal(this.src, this.alt);
        });
    });

    // Navigation arrows functionality
    if (prevArrow && nextArrow) {
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
    }

    function changeImage(index) {
        currentImageIndex = index;
        modalImg.src = currentGallery[index];
        captionText.innerHTML = currentAlts[index];
    }

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

    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape" && modal.style.display === "block") {
            modal.style.display = "none";
            document.body.style.overflow = '';
        }
    });
});
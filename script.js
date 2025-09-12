// GangLord Catalog JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initProductInteractions();
    initAnimations();
    initFormHandling();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });
}

// Scroll effects and animations
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.product-card, .showcase-item, .stat, .contact-method');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-element');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Product interactions
function initProductInteractions() {
    const productCards = document.querySelectorAll('.product-card');

    // Product card hover effects
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        // Quick view button
        const quickViewBtn = card.querySelector('.btn-quick-view');
        if (quickViewBtn) {
            quickViewBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showProductModal(card);
            });
        }
    });

}


// Animation effects
function initAnimations() {
    // Staggered animation for product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const titleLines = heroTitle.querySelectorAll('.title-line');
        titleLines.forEach((line, index) => {
            line.style.animationDelay = `${0.5 + (index * 0.2)}s`;
        });
    }

    // Floating animation for hero elements
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 2}s`;
    });

    // Counter animation for stats
    const stats = document.querySelectorAll('.stat h3');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Video controls
    initVideoControls();
}

// Video controls functionality
function initVideoControls() {
    const heroVideo = document.querySelector('.hero-video');
    const playButton = document.querySelector('.play-button');
    
    if (heroVideo && playButton) {
        // Play/pause on button click
        playButton.addEventListener('click', function() {
            if (heroVideo.paused) {
                heroVideo.play();
                this.style.display = 'none';
            } else {
                heroVideo.pause();
                this.style.display = 'flex';
            }
        });

        // Show play button when video is paused
        heroVideo.addEventListener('pause', function() {
            playButton.style.display = 'flex';
        });

        // Hide play button when video is playing
        heroVideo.addEventListener('play', function() {
            playButton.style.display = 'none';
        });

        // Handle video loading
        heroVideo.addEventListener('loadeddata', function() {
            // Video is ready to play
            console.log('Video loaded successfully');
        });

        // Handle video errors
        heroVideo.addEventListener('error', function() {
            console.log('Video failed to load');
            // You can add fallback content here
        });
    }
}

// Counter animation
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const suffix = element.textContent.replace(/\d/g, '');
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 30);
}

// Form handling
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Por favor, completa todos los campos', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Por favor, ingresa un email válido', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('¡Mensaje enviado! Te contactaremos pronto.', 'success');
            this.reset();
        });
    }
}

// Utility functions
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Variables globales para la galería
let currentImageIndex = 0;
let productImages = [];

function showProductModal(productCard) {
    // Get product data
    const productName = productCard.querySelector('.product-name').textContent;
    const productDescription = productCard.querySelector('.product-description').textContent;
    const productPrice = productCard.querySelector('.price').textContent;
    const oldPrice = productCard.querySelector('.old-price');
    const productImage = productCard.querySelector('.product-img').src;
    const productBadge = productCard.querySelector('.product-badge');
    
    // Get multiple images from data attribute
    const imagesData = productCard.getAttribute('data-images');
    if (imagesData) {
        productImages = JSON.parse(imagesData);
        console.log('Imágenes cargadas:', productImages);
    } else {
        productImages = [productImage]; // Fallback to single image
        console.log('Imagen única:', productImages);
    }
    currentImageIndex = 0;
    
    // Populate modal with product data
    document.getElementById('modalProductName').textContent = productName;
    document.getElementById('modalProductDescription').textContent = productDescription;
    document.getElementById('modalProductImage').src = productImages[0];
    document.getElementById('modalPrice').textContent = productPrice;
    
    // Setup gallery
    setupImageGallery();
    
    // Handle old price
    const modalOldPrice = document.getElementById('modalOldPrice');
    if (oldPrice) {
        modalOldPrice.textContent = oldPrice.textContent;
        modalOldPrice.style.display = 'inline';
    } else {
        modalOldPrice.style.display = 'none';
    }
    
    // Handle badge
    const modalBadge = document.getElementById('modalBadge');
    if (productBadge) {
        modalBadge.textContent = productBadge.textContent;
        modalBadge.className = `modal-badge ${productBadge.classList.contains('bestseller') ? 'bestseller' : ''}`;
        modalBadge.style.display = 'block';
    } else {
        modalBadge.style.display = 'none';
    }
    
    
    // Show modal
    document.getElementById('quickViewModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add event listeners for modal buttons
    const addToCartBtn = document.querySelector('.modal-add-cart');
    const viewDetailsBtn = document.querySelector('.modal-view-details');
    
    if (addToCartBtn) {
        addToCartBtn.onclick = function() {
            showNotification(`${productName} agregado al carrito!`, 'success');
            closeQuickView();
        };
    }
    
    if (viewDetailsBtn) {
        viewDetailsBtn.onclick = function() {
            showNotification('Redirigiendo a página de detalles...', 'info');
            closeQuickView();
        };
    }
}

function closeQuickView() {
    document.getElementById('quickViewModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Funciones para la galería de imágenes
function setupImageGallery() {
    const galleryDots = document.getElementById('galleryDots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    console.log('Configurando galería con', productImages.length, 'imágenes');
    
    // Limpiar dots existentes
    galleryDots.innerHTML = '';
    
    // Solo mostrar controles si hay más de una imagen
    if (productImages.length > 1) {
        // Crear dots para cada imagen
        productImages.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `gallery-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToImage(index));
            galleryDots.appendChild(dot);
        });
        
        // Mostrar botones de navegación
        if (prevBtn) prevBtn.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'flex';
    } else {
        // Ocultar controles si solo hay una imagen
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    }
    
    // Actualizar botones
    updateGalleryButtons();
}

function changeImage(direction) {
    currentImageIndex += direction;
    
    // Circular navigation
    if (currentImageIndex >= productImages.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = productImages.length - 1;
    }
    
    updateImage();
    updateGalleryButtons();
    updateGalleryDots();
}

function goToImage(index) {
    currentImageIndex = index;
    updateImage();
    updateGalleryButtons();
    updateGalleryDots();
}

function updateImage() {
    const modalImage = document.getElementById('modalProductImage');
    modalImage.src = productImages[currentImageIndex];
    
    // Efecto de transición
    modalImage.style.opacity = '0';
    setTimeout(() => {
        modalImage.style.opacity = '1';
    }, 150);
}

function updateGalleryButtons() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // Solo mostrar botones si hay más de una imagen
    if (productImages.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
    }
}

function updateGalleryDots() {
    const dots = document.querySelectorAll('.gallery-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentImageIndex);
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff6b35' : '#333'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .product-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 3000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal-content {
        background: var(--secondary-bg);
        padding: 2rem;
        border-radius: 15px;
        border: 1px solid var(--border-color);
        text-align: center;
        position: relative;
        max-width: 400px;
        width: 90%;
    }
    
    .modal-close {
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        color: var(--text-primary);
        font-size: 2rem;
        cursor: pointer;
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
const optimizedScrollHandler = debounce(function() {
    // Scroll-based animations and effects
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Preload critical images
function preloadImages() {
    const imageUrls = [
        // Add your product image URLs here
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Initialize preloading
preloadImages();

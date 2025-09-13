// GangLord Catalog JavaScript - VERSIÓN FUNCIONAL
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 GangLord JavaScript iniciado');
    
    // Inicializar todo
    initNavigation();
    initScrollEffects();
    updateCartCount(); // Inicializar contador del carrito
    updateShippingInfo(); // Inicializar actualización de envío
    initProductInteractions();
    initAnimations();
    initFormHandling();
    initBootstrapAnimations();
    
    // Configurar vista rápida
    setupQuickView();
});

// ===== VISTA RÁPIDA =====
function setupQuickView() {
    console.log('🔧 Configurando vista rápida...');
    
    // Buscar botones de vista rápida
    const quickViewBtns = document.querySelectorAll('.btn-quick-view');
    console.log('📱 Botones encontrados:', quickViewBtns.length);
    
    quickViewBtns.forEach((btn, index) => {
        console.log(`⚙️ Configurando botón ${index + 1}`);
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 Botón clickeado!');
            
            const productCard = this.closest('.product-card');
            if (productCard) {
                console.log('✅ Tarjeta encontrada');
                showProductModal(productCard);
            } else {
                console.error('❌ No se encontró la tarjeta');
            }
        });
    });
    
    // Los botones de vista rápida ahora están debajo del precio, no en overlay
    
    // Configurar navegación de imágenes
    setupImageNavigation();
    
    console.log('✅ Vista rápida configurada');
}

// ===== SISTEMA DE CARRITO =====
let cart = [];
let cartTotal = 0;

// Productos disponibles
const products = {
    1: {
        id: 1,
        name: "Doberman Squad",
        price: 130000,
        image: "assets/dogfrente.jpeg",
        description: "Camiseta básica premium en algodón 100%"
    },
    2: {
        id: 2,
        name: "Dark In Mi Own Way",
        price: 150000,
        image: "assets/darkfrente.jpeg",
        description: "Elegancia atemporal en blanco puro"
    },
    3: {
        id: 3,
        name: "I Shine More Than My Chains",
        price: 140000,
        image: "assets/shinefrente.jpeg",
        description: "Edición limitada con acabados premium"
    },
    4: {
        id: 4,
        name: "Turnal",
        price: 130000,
        image: "assets/dogfrente.jpeg",
        description: "Edición limitada con acabados premium"
    }
};

// Agregar producto al carrito
function addToCart(productId) {
    const product = products[productId];
    if (!product) {
        console.error('Producto no encontrado:', productId);
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    updateCartCount();
    console.log('Producto agregado al carrito:', product.name);
}

// Actualizar contador del carrito
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    
    if (totalItems > 0) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = 'flex';
    } else {
        cartCountElement.textContent = '';
        cartCountElement.style.display = 'none';
    }
    
    // También actualizar el contador móvil
    updateMobileCartCount();
}

// Actualizar display del carrito
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartShipping = document.getElementById('cartShipping');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <h4>Tu carrito está vacío</h4>
                <p>Agrega algunos productos increíbles para comenzar tu compra</p>
                <button class="btn btn-primary" onclick="closeCartModal()">
                    <i class="fas fa-shopping-bag me-2"></i>Explorar Productos
                </button>
            </div>
        `;
        cartSubtotal.textContent = '$0';
        cartShipping.textContent = 'Dependiendo ubicación';
        cartTotal.textContent = '$0';
        return;
    }
    
    let html = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        html += `
            <div class="cart-item">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p class="item-price">$${item.price.toLocaleString()}</p>
                    <div class="quantity-controls">
                        <button type="button" onclick="updateQuantity(${item.id}, -1)" style="background: #007bff; color: white; border: 2px solid #007bff; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.2rem; font-weight: bold;">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button type="button" onclick="updateQuantity(${item.id}, 1)" style="background: #007bff; color: white; border: 2px solid #007bff; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.2rem; font-weight: bold;">+</button>
                    </div>
                </div>
                <div class="item-total">
                    <span>$${itemTotal.toLocaleString()}</span>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartSubtotal.textContent = `$${subtotal.toLocaleString()}`;
    
    // Mostrar información de envío por defecto
    cartShipping.innerHTML = '<span style="color: #6c757d;">Dependiendo ubicación</span><br><small style="color: #6c757d;">Se calculará al ingresar dirección</small>';
    cartTotal.textContent = `$${subtotal.toLocaleString()}`;
}

// Actualizar cantidad de producto
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartDisplay();
        updateCartCount();
    }
}

// Remover producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    updateCartCount();
}

// Abrir modal del carrito
function openCartModal() {
    document.getElementById('cartModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Cerrar modal del carrito
function closeCartModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('cartModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Proceder al checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío. Agrega productos para continuar.', 'warning');
        return;
    }
    
    closeCartModal();
    document.getElementById('checkoutModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Cerrar modal de checkout
function closeCheckoutModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('checkoutModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Procesar pago
function processPayment() {
    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);
    
    // Validar formulario
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Generar número de pedido único
    const orderNumber = generateOrderNumber();
    
    // Recopilar datos
    const customerData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        cedula: formData.get('cedula'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        notes: formData.get('notes') || '',
        orderNumber: orderNumber
    };
    
    // Determinar información de envío basada en la dirección
    const shippingInfo = getShippingInfo(customerData.address);
    
    // Crear mensaje para WhatsApp
    const whatsappMessage = createWhatsAppMessage(customerData, shippingInfo);
    const whatsappUrl = `https://wa.me/573017886283?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Limpiar carrito y cerrar modales
    cart = [];
    updateCartDisplay();
    updateCartCount();
    form.reset();
    closeCheckoutModal();
    
    // Mostrar notificación personalizada con número de pedido
    showNotification(`¡Pedido #${orderNumber} enviado! Te contactaremos pronto por WhatsApp.`, 'success');
}

// Generar número de pedido único
function generateOrderNumber() {
    // Números de pedido predefinidos para GangLord
    const orderNumbers = [
        'GL2025001', 'GL2025002', 'GL2025003', 'GL2025004', 'GL2025005',
        'GL2025006', 'GL2025007', 'GL2025008', 'GL2025009', 'GL2025010',
        'GL2025011', 'GL2025012', 'GL2025013', 'GL2025014', 'GL2025015',
        'GL2025016', 'GL2025017', 'GL2025018', 'GL2025019', 'GL2025020',
        'GL2025021', 'GL2025022', 'GL2025023', 'GL2025024', 'GL2025025',
        'GL2025026', 'GL2025027', 'GL2025028', 'GL2025029', 'GL2025030',
        'GL2025031', 'GL2025032', 'GL2025033', 'GL2025034', 'GL2025035',
        'GL2025036', 'GL2025037', 'GL2025038', 'GL2025039', 'GL2025040',
        'GL2025041', 'GL2025042', 'GL2025043', 'GL2025044', 'GL2025045',
        'GL2025046', 'GL2025047', 'GL2025048', 'GL2025049', 'GL2025050'
    ];
    
    // Seleccionar un número aleatorio de la lista
    const randomIndex = Math.floor(Math.random() * orderNumbers.length);
    return orderNumbers[randomIndex];
}

// Determinar información de envío basada en la dirección
function getShippingInfo(address) {
    const addressLower = address.toLowerCase();
    
    // Ciudades principales con envío gratis
    const freeShippingCities = [
        'bogotá', 'bogota', 'medellín', 'medellin', 'cali', 'barranquilla', 
        'cartagena', 'bucaramanga', 'pereira', 'santa marta', 'ibagué', 'ibague',
        'pasto', 'manizales', 'neiva', 'villavicencio', 'armenia', 'valledupar'
    ];
    
    // Ciudades con envío económico
    const economicShippingCities = [
        'tunja', 'popayán', 'popayan', 'montería', 'monteria', 'sincelejo',
        'florencia', 'yopal', 'arauca', 'mocoa', 'leticia', 'san josé del guaviare',
        'mitú', 'puerto carreño', 'inírida', 'inirida'
    ];
    
    // Verificar si es envío gratis
    for (let city of freeShippingCities) {
        if (addressLower.includes(city)) {
        return {
            type: 'gratis',
            cost: 0,
            days: '1-2 días',
            description: 'Envío GRATIS (ciudades principales)'
        };
        }
    }
    
    // Verificar si es envío económico
    for (let city of economicShippingCities) {
        if (addressLower.includes(city)) {
            return {
                type: 'económico',
                cost: 15000,
                days: '2-3 días',
                description: 'Envío económico (ciudades intermedias)'
            };
        }
    }
    
    // Envío estándar para otras ubicaciones
    return {
        type: 'estándar',
        cost: 25000,
        days: '3-5 días',
        description: 'Envío estándar (costo puede variar según ubicación exacta)'
    };
}

// Crear mensaje para WhatsApp
function createWhatsAppMessage(customerData, shippingInfo) {
    let message = `🛍️ *NUEVO PEDIDO - GANGLORD*\n\n`;
    message += `📋 *NÚMERO DE PEDIDO: #${customerData.orderNumber}*\n\n`;
    message += `👤 *DATOS DEL CLIENTE:*\n`;
    message += `Nombre: ${customerData.firstName} ${customerData.lastName}\n`;
    message += `Cédula: ${customerData.cedula}\n`;
    message += `Teléfono: ${customerData.phone}\n`;
    message += `Dirección: ${customerData.address}\n`;
    
    if (customerData.notes) {
        message += `Notas: ${customerData.notes}\n`;
    }
    
    message += `\n🛒 *PRODUCTOS:*\n`;
    
    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        message += `• ${item.name} x${item.quantity} - $${itemTotal.toLocaleString()}\n`;
    });
    
    message += `\n📦 *INFORMACIÓN DE ENVÍO:*\n`;
    message += `Tipo: ${shippingInfo.description}\n`;
    message += `Tiempo: Dependiendo Ubicación o Ciudad\n`;
    message += `Costo: Dependiendo de tu ubicación\n`;
    message += `*El costo de envío se confirmará según tu dirección exacta*\n`;
    
    message += `\n💰 *RESUMEN DE PAGO:*\n`;
    message += `Subtotal: $${subtotal.toLocaleString()}\n`;
    message += `Envío: Dependiendo de tu ubicación\n`;
    message += `*TOTAL: $${subtotal.toLocaleString()} + envío*\n\n`;
    message += `¡Gracias por tu compra! 🎉`;
    
    return message;
}

// Actualizar información de envío en tiempo real
function updateShippingInfo() {
    const addressInput = document.getElementById('address');
    const cartShipping = document.getElementById('cartShipping');
    
    if (addressInput && cartShipping) {
        addressInput.addEventListener('input', function() {
            const address = this.value;
            if (address.length > 10) { // Solo actualizar si hay suficiente texto
                const shippingInfo = getShippingInfo(address);
                
                if (shippingInfo.cost === 0) {
                    cartShipping.innerHTML = '<span style="color: #28a745;">Gratis</span><br><small style="color: #6c757d;">' + shippingInfo.description + '</small>';
                } else {
                    cartShipping.innerHTML = '<span style="color: #ffc107;">$' + shippingInfo.cost.toLocaleString() + '</span><br><small style="color: #6c757d;">' + shippingInfo.description + '</small>';
                }
            }
        });
    }
}

// Funciones para el menú móvil
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const navToggle = document.querySelector('.nav-toggle');
    
    mobileMenu.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Prevenir scroll del body cuando el menú está abierto
    if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const navToggle = document.querySelector('.nav-toggle');
    
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
}

// Actualizar contador del carrito en menú móvil
function updateMobileCartCount() {
    const mobileCartCount = document.getElementById('mobileCartCount');
    if (mobileCartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        mobileCartCount.textContent = totalItems;
        if (totalItems === 0) {
            mobileCartCount.style.display = 'none';
        } else {
            mobileCartCount.style.display = 'flex';
        }
    }
}

// ===== SISTEMA DE NOTIFICACIONES =====
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const icon = notification.querySelector('.notification-icon i');
    const title = notification.querySelector('.notification-text h4');
    const text = notification.querySelector('.notification-text p');
    
    // Configurar el tipo de notificación
    notification.className = `notification ${type}`;
    
    // Configurar ícono según el tipo
    switch(type) {
        case 'success':
            icon.className = 'fas fa-check-circle';
            title.textContent = '¡Éxito!';
            break;
        case 'error':
            icon.className = 'fas fa-exclamation-circle';
            title.textContent = 'Error';
            break;
        case 'warning':
            icon.className = 'fas fa-exclamation-triangle';
            title.textContent = 'Advertencia';
            break;
        case 'info':
            icon.className = 'fas fa-info-circle';
            title.textContent = 'Información';
            break;
    }
    
    // Configurar mensaje
    text.textContent = message;
    
    // Mostrar notificación
    notification.classList.add('show');
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        closeNotification();
    }, 5000);
}

function closeNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('show');
}

// ===== NAVEGACIÓN DE IMÁGENES =====
function setupImageNavigation() {
    console.log('🖼️ Configurando navegación de imágenes...');
    
    // Configurar indicadores clickeables
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            if (productCard) {
                const images = JSON.parse(productCard.getAttribute('data-images'));
                if (images && images.length > 1) {
                    changeToImage(productCard, index);
                }
            }
        });
    });
    
    console.log('✅ Navegación de imágenes configurada');
}

function changeProductImage(button, direction) {
    console.log('🔄 Cambiando imagen:', direction);
    
    const productCard = button.closest('.product-card');
    if (!productCard) return;
    
    const images = JSON.parse(productCard.getAttribute('data-images'));
    if (!images || images.length <= 1) return;
    
    const currentImg = productCard.querySelector('.product-img');
    const indicators = productCard.querySelectorAll('.indicator');
    
    // Encontrar índice actual
    let currentIndex = 0;
    indicators.forEach((indicator, index) => {
        if (indicator.classList.contains('active')) {
            currentIndex = index;
        }
    });
    
    // Calcular nuevo índice
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = images.length - 1;
    if (newIndex >= images.length) newIndex = 0;
    
    // Cambiar imagen
    changeToImage(productCard, newIndex);
}

function changeToImage(productCard, imageIndex) {
    console.log('🎯 Cambiando a imagen:', imageIndex);
    
    const images = JSON.parse(productCard.getAttribute('data-images'));
    if (!images || !images[imageIndex]) return;
    
    const currentImg = productCard.querySelector('.product-img');
    const indicators = productCard.querySelectorAll('.indicator');
    
    // Cambiar imagen con efecto de transición
    currentImg.style.opacity = '0';
    
    setTimeout(() => {
        currentImg.src = images[imageIndex];
        currentImg.style.opacity = '1';
        
        // Actualizar indicadores
        indicators.forEach((indicator, index) => {
            if (index === imageIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }, 150);
}

function showProductModal(productCard) {
    console.log('🎉 === ABRIENDO MODAL ===');
    
    try {
        // Obtener datos
        const productName = productCard.querySelector('.product-name').textContent;
        const productDescription = productCard.querySelector('.product-description').textContent;
        const productPrice = productCard.querySelector('.price').textContent;
        const oldPrice = productCard.querySelector('.old-price');
        const productImage = productCard.querySelector('.product-img').src;
        const productBadge = productCard.querySelector('.product-badge');
        
        console.log('📦 Datos:', { productName, productDescription, productPrice });
        
        // Llenar modal
        document.getElementById('modalProductName').textContent = productName;
        document.getElementById('modalProductDescription').textContent = productDescription;
        document.getElementById('modalProductImage').src = productImage;
        document.getElementById('modalPrice').textContent = productPrice;
        
        // Precio anterior
        const modalOldPrice = document.getElementById('modalOldPrice');
        if (oldPrice && oldPrice.textContent) {
            modalOldPrice.textContent = oldPrice.textContent;
            modalOldPrice.style.display = 'inline';
        } else {
            modalOldPrice.style.display = 'none';
        }
        
        // Badge
        const modalBadge = document.getElementById('modalBadge');
        if (productBadge && productBadge.textContent) {
            modalBadge.textContent = productBadge.textContent;
            modalBadge.style.display = 'block';
        } else {
            modalBadge.style.display = 'none';
        }
        
        // Mostrar modal
        const modal = document.getElementById('quickViewModal');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        console.log('✅ Modal mostrado correctamente');
        
    } catch (error) {
        console.error('❌ Error al abrir modal:', error);
    }
}

function closeQuickView() {
    console.log('❌ Cerrando modal');
    document.getElementById('quickViewModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function addToCartFromModal() {
    const productName = document.getElementById('modalProductName').textContent;
    console.log('🛒 Añadiendo al carrito:', productName);
    
    // Buscar el ID del producto por nombre
    let productId = null;
    for (let id in products) {
        if (products[id].name === productName) {
            productId = parseInt(id);
            break;
        }
    }
    
    if (productId) {
        addToCart(productId);
        showNotification(`${productName} agregado al carrito!`, 'success');
        closeQuickView();
    } else {
        console.error('No se pudo encontrar el producto:', productName);
        alert('Error al agregar el producto al carrito');
    }
}

function closeModal(event) {
    if (event.target.id === 'quickViewModal') {
        closeQuickView();
    }
}

// ===== NAVEGACIÓN =====
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

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
                
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });
}

// ===== EFECTOS DE SCROLL =====
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

    const animateElements = document.querySelectorAll('.product-card, .showcase-item, .stat, .contact-method');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-element');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ===== INTERACCIONES DE PRODUCTOS =====
function initProductInteractions() {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ===== ANIMACIONES =====
function initAnimations() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const titleLines = heroTitle.querySelectorAll('.title-line');
        titleLines.forEach((line, index) => {
            line.style.animationDelay = `${0.5 + (index * 0.2)}s`;
        });
    }

    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 2}s`;
    });

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
}

// ===== CONTROLES DE VIDEO =====
function initVideoControls() {
    const heroVideo = document.querySelector('.hero-video');
    const playButton = document.querySelector('.play-button');
    
    if (heroVideo && playButton) {
        playButton.addEventListener('click', function() {
            if (heroVideo.paused) {
                heroVideo.play();
                this.style.display = 'none';
            } else {
                heroVideo.pause();
                this.style.display = 'flex';
            }
        });

        heroVideo.addEventListener('pause', function() {
            playButton.style.display = 'flex';
        });

        heroVideo.addEventListener('play', function() {
            playButton.style.display = 'none';
        });
    }
}

// ===== ANIMACIÓN DE CONTADORES =====
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

// ===== MANEJO DE FORMULARIOS =====
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            if (!name || !email || !message) {
                showNotification('Por favor, completa todos los campos', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Por favor, ingresa un email válido', 'error');
                return;
            }
            
            showNotification('¡Mensaje enviado! Te contactaremos pronto.', 'success');
            this.reset();
        });
    }
}

// ===== ANIMACIONES BOOTSTRAP =====
function initBootstrapAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });
}

// ===== FUNCIONES UTILITARIAS =====
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff6b35' : '#333'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 10000;
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

// ===== CSS ANIMATIONS =====
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

console.log('🎉 GangLord JavaScript cargado completamente');
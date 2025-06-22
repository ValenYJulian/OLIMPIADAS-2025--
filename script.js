document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');
    const searchBtn = document.getElementById('search-btn');
    const mobileSearch = document.getElementById('mobile-search');
    const cartBtn = document.getElementById('cart-btn');
    const cartDropdown = document.getElementById('cart-dropdown');
    const closeCart = document.getElementById('close-cart');
    const addToCartButtons = document.querySelectorAll('.agregar-carrito');
    const cartCount = document.querySelector('.cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    // Variables del carrito
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Menú hamburguesa
    menuToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navbar.classList.toggle('active');
    });
    
    // Barra de búsqueda móvil
    searchBtn.addEventListener('click', function() {
        mobileSearch.classList.toggle('active');
    });
    
    // Carrito desplegable
    cartBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        cartDropdown.classList.toggle('active');
    });
    
    closeCart.addEventListener('click', function() {
        cartDropdown.classList.remove('active');
    });
    
    // Cerrar carrito al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!cartDropdown.contains(e.target) && e.target !== cartBtn) {
            cartDropdown.classList.remove('active');
        }
    });
    
    // Añadir al carrito
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const card = this.closest('.oferta-card');
            const title = card.querySelector('h3').textContent;
            const priceText = card.querySelector('.new-price').textContent;
            const price = parseFloat(priceText.replace('$', '').replace('.', '').replace(',', '.'));
            const image = card.querySelector('img').src;
            
            // Verificar si el item ya está en el carrito
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ 
                    id, 
                    title, 
                    price, 
                    image,
                    quantity: 1
                });
            }
            
            total += price;
            
            // Actualizar carrito
            updateCart();
            
            // Mostrar notificación
            showNotification(${title} añadido al carrito);
            
            // Guardar en localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
        });
    });
    
    // Actualizar carrito
    function updateCart() {
        // Actualizar contador
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = itemCount;
        
        // Actualizar items
        cartItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p class="cart-item-price">$${(item.price * item.quantity).toLocaleString('es-AR')}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}">Eliminar</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Actualizar total
        cartTotalPrice.textContent = $${total.toLocaleString('es-AR')};
        
        // Añadir event listeners a los nuevos botones
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const action = this.getAttribute('data-action');
                updateQuantity(id, action);
            });
        });
        
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                removeItem(id);
            });
        });
    }
    
    // Actualizar cantidad de un item
    function updateQuantity(id, action) {
        const item = cart.find(item => item.id === id);
        
        if (action === 'increase') {
            item.quantity += 1;
            total += item.price;
        } else if (action === 'decrease' && item.quantity > 1) {
            item.quantity -= 1;
            total -= item.price;
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }
    
    // Eliminar item del carrito
    function removeItem(id) {
        const itemIndex = cart.findIndex(item => item.id === id);
        
        if (itemIndex !== -1) {
            total -= cart[itemIndex].price * cart[itemIndex].quantity;
            cart.splice(itemIndex, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        }
    }
    
    // Mostrar notificación
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            document.querySelector('.header').classList.add('scrolled');
        } else {
            document.querySelector('.header').classList.remove('scrolled');
        }
    });
    
    // Inicializar carrito
    updateCart();
    
    // Inicializar sliders (usando Swiper.js)
    if (typeof Swiper !== 'undefined') {
        new Swiper('.ofertas-slider', {
            slidesPerView: 'auto',
            spaceBetween: 20,
            freeMode: true,
            grabCursor: true,
            breakpoints: {
                768: {
                    spaceBetween: 30
                }
            }
        });
        
        new Swiper('.testimonios-slider', {
            slidesPerView: 'auto',
            spaceBetween: 20,
            freeMode: true,
            grabCursor: true
        });
    }
    
    // Lazy loading para imágenes
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Cargar polyfill para lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/loading-attribute-polyfill@2.0.1/dist/loading-attribute-polyfill.min.js';
        document.body.appendChild(script);
    }
    
    // Mejorar accesibilidad del menú
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('focus', function() {
            if (window.innerWidth < 768) {
                navbar.scrollTop = this.offsetTop - 20;
            }
        });
    });
});

        document.addEventListener('DOMContentLoaded', function() {
            // Slider de ofertas
            new Swiper('.ofertas-slider', {
                slidesPerView: 'auto',
                spaceBetween: 20,
                freeMode: true,
                grabCursor: true,
                breakpoints: {
                    768: {
                        spaceBetween: 30
                    }
                }
            });
            
            // Slider de testimonios
            new Swiper('.testimonios-slider', {
                slidesPerView: 'auto',
                spaceBetween: 20,
                freeMode: true,
                grabCursor: true
            });
        });

        document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');
    const searchBtn = document.getElementById('search-btn');
    const mobileSearch = document.getElementById('mobile-search');
    const cartBtn = document.getElementById('cart-btn');
    const cartDropdown = document.getElementById('cart-dropdown');
    const closeCart = document.getElementById('close-cart');
    const addToCartButtons = document.querySelectorAll('.agregar-carrito');
    const cartCount = document.querySelector('.cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const destinoInput = document.getElementById('destino-input');
    const destinoSuggestions = document.getElementById('destino-suggestions');
    const userBtn = document.getElementById('user-btn');
    
    // Datos de paquetes (simulando una base de datos)
    const paquetes = [
        { id: 1, nombre: "Cataratas del Iguazú", precio: 25999, imagen: "imagenes/cataratas-del-iguazu.jpg", categoria: "naturaleza" },
        { id: 2, nombre: "San Carlos de Bariloche", precio: 35999, imagen: "imagenes/bariloche.jpg", categoria: "montaña" },
        { id: 3, nombre: "Ushuaia", precio: 42999, imagen: "imagenes/ushuaia.jpg", categoria: "aventura" },
        { id: 4, nombre: "Mendoza", precio: 28999, imagen: "imagenes/mendoza.jpg", categoria: "vino" },
        { id: 5, nombre: "Fin del Mundo en Ushuaia", precio: 30099, precioOriginal: 42999, imagen: "imagenes/oferta-ushuaia.jpg", categoria: "oferta" },
        { id: 6, nombre: "Bariloche Premium", precio: 38249, precioOriginal: 50999, imagen: "imagenes/oferta-bariloche.jpg", categoria: "oferta" },
        { id: 7, nombre: "Mendoza Todo Incluido", precio: 23199, precioOriginal: 28999, imagen: "imagenes/oferta-mendoza.jpg", categoria: "oferta" }
    ];

    // Datos de sugerencias de destinos
    const destinos = [
        { nombre: "Buenos Aires", tipo: "Ciudad" },
        { nombre: "Cataratas del Iguazú", tipo: "Naturaleza" },
        { nombre: "Bariloche", tipo: "Montaña" },
        { nombre: "Mendoza", tipo: "Vino" },
        { nombre: "Ushuaia", tipo: "Aventura" },
        { nombre: "Salta", tipo: "Cultura" },
        { nombre: "Córdoba", tipo: "Sierras" },
        { nombre: "Mar del Plata", tipo: "Playa" },
        { nombre: "El Calafate", tipo: "Glaciares" },
        { nombre: "Puerto Madryn", tipo: "Fauna" }
    ];
    
    // Variables del carrito
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    // Inicializar la aplicación
    init();
    
    function init() {
        updateCartUI();
        setupEventListeners();
    }
    
    function setupEventListeners() {
        // Menú hamburguesa
        menuToggle.addEventListener('click', toggleMenu);
        
        // Barra de búsqueda móvil
        searchBtn.addEventListener('click', toggleSearch);
        
        // Carrito desplegable
        cartBtn.addEventListener('click', toggleCart);
        closeCart.addEventListener('click', closeCartDropdown);
        
        // Cerrar carrito al hacer clic fuera
        document.addEventListener('click', closeCartOnClickOutside);
        
        // Autocompletado de destinos
        if (destinoInput) {
            destinoInput.addEventListener('input', handleDestinoInput);
            document.addEventListener('click', closeSuggestionsOnClickOutside);
        }
        
        // Botón de usuario
        userBtn.addEventListener('click', handleUserClick);
        
        // Añadir al carrito
        addToCartButtons.forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }
    
    function toggleMenu() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navbar.classList.toggle('active');
        
        // Cerrar otros elementos abiertos
        if (!isExpanded) {
            mobileSearch.classList.remove('active');
            cartDropdown.classList.remove('active');
        }
    }
    
    function toggleSearch() {
        mobileSearch.classList.toggle('active');
        
        // Cerrar otros elementos abiertos
        navbar.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        cartDropdown.classList.remove('active');
    }
    
    function toggleCart(e) {
        e.stopPropagation();
        cartDropdown.classList.toggle('active');
        
        // Cerrar otros elementos abiertos
        navbar.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileSearch.classList.remove('active');
    }
    
    function closeCartDropdown() {
        cartDropdown.classList.remove('active');
    }
    
    function closeCartOnClickOutside(e) {
        if (!cartDropdown.contains(e.target) && e.target !== cartBtn) {
            cartDropdown.classList.remove('active');
        }
    }
    
    function handleDestinoInput() {
        const inputValue = this.value.toLowerCase();
        if (inputValue.length > 1) {
            const filteredDestinos = destinos.filter(destino => 
                destino.nombre.toLowerCase().includes(inputValue))
                .slice(0, 5);
            
            destinoSuggestions.innerHTML = '';
            
            if (filteredDestinos.length > 0) {
                filteredDestinos.forEach(destino => {
                    const suggestion = document.createElement('div');
                    suggestion.textContent = destino.nombre;
                    suggestion.addEventListener('click', () => {
                        destinoInput.value = destino.nombre;
                        destinoSuggestions.classList.remove('active');
                    });
                    destinoSuggestions.appendChild(suggestion);
                });
                destinoSuggestions.classList.add('active');
            } else {
                destinoSuggestions.classList.remove('active');
            }
        } else {
            destinoSuggestions.classList.remove('active');
        }
    }
    
    function closeSuggestionsOnClickOutside(e) {
        if (e.target !== destinoInput) {
            destinoSuggestions.classList.remove('active');
        }
    }
    
    function addToCart() {
        const id = parseInt(this.getAttribute('data-id'));
        const paquete = paquetes.find(p => p.id === id);
        
        if (!paquete) return;
        
        // Verificar si el item ya está en el carrito
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.cantidad += 1;
        } else {
            cart.push({ 
                id: paquete.id,
                nombre: paquete.nombre,
                precio: paquete.precio,
                imagen: paquete.imagen,
                cantidad: 1
            });
        }
        
        total += paquete.precio;
        
        // Actualizar UI y localStorage
        updateCartUI();
        saveCartToLocalStorage();
        
        // Mostrar notificación
        showNotification(${paquete.nombre} añadido al carrito);
    }
    
    function updateCartUI() {
        // Actualizar contador
        const itemCount = cart.reduce((sum, item) => sum + item.cantidad, 0);
        cartCount.textContent = itemCount;
        
        // Actualizar items del carrito
        renderCartItems();
        
        // Actualizar total
        cartTotalPrice.textContent = $${total.toLocaleString('es-AR')};
    }
    
    function renderCartItems() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Tu carrito está vacío</p>
                    <a href="paquetes.html" class="btn btn-outline">Ver paquetes</a>
                </div>
            `;
            return;
        }
        
        cartItemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="cart-item-info">
                    <h4>${item.nombre}</h4>
                    <p class="cart-item-price">$${(item.precio * item.cantidad).toLocaleString('es-AR')}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                        <span>${item.cantidad}</span>
                        <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}">Eliminar</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Añadir event listeners a los nuevos botones
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', updateQuantity);
        });
        
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', removeItem);
        });
    }
    
    function updateQuantity() {
        const id = parseInt(this.getAttribute('data-id'));
        const action = this.getAttribute('data-action');
        const item = cart.find(item => item.id === id);
        
        if (!item) return;
        
        if (action === 'increase') {
            item.cantidad += 1;
            total += item.precio;
        } else if (action === 'decrease' && item.cantidad > 1) {
            item.cantidad -= 1;
            total -= item.precio;
        }
        
        saveCartToLocalStorage();
        updateCartUI();
    }
    
    function removeItem() {
        const id = parseInt(this.getAttribute('data-id'));
        const itemIndex = cart.findIndex(item => item.id === id);
        
        if (itemIndex === -1) return;
        
        total -= cart[itemIndex].precio * cart[itemIndex].cantidad;
        cart.splice(itemIndex, 1);
        
        saveCartToLocalStorage();
        updateCartUI();
    }
    
    function saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            document.querySelector('.header').classList.add('scrolled');
        } else {
            document.querySelector('.header').classList.remove('scrolled');
        }
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const agregarBtns = document.querySelectorAll(".agregar-carrito");
    const cartDropdown = document.getElementById("cart-dropdown");
    const cartCount = document.querySelector(".cart-count");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total-price");
    const closeCartBtn = document.getElementById("close-cart");
    const cartBtn = document.getElementById("cart-btn");

    let carrito = [];

    // Abrir el carrito
    cartBtn.addEventListener("click", () => {
        cartDropdown.classList.toggle("active");
    });

    // Cerrar el carrito
    closeCartBtn.addEventListener("click", () => {
        cartDropdown.classList.remove("active");
    });

    // Agregar al carrito
    agregarBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const card = btn.closest(".destino-card, .oferta-card");
            const titulo = card.querySelector("h3").innerText;
            const precioTexto = card.querySelector(".destino-price strong, .oferta-price .new-price");
            const precio = parseFloat(precioTexto.innerText.replace("$", "").replace(".", ""));

            // Verificar si ya está
            const existente = carrito.find(item => item.id === id);
            if (!existente) {
                carrito.push({ id, titulo, precio });
                actualizarCarrito();
            }
        });
    });

    // Actualizar visual del carrito
    function actualizarCarrito() {
        // Contador
        cartCount.innerText = carrito.length;

        // Total
        const total = carrito.reduce((sum, item) => sum + item.precio, 0);
        cartTotal.innerText = $${total.toLocaleString("es-AR")};

        // Mostrar ítems
        if (carrito.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Tu carrito está vacío</p>
                    <a href="paquetes.html" class="btn btn-outline">Ver paquetes</a>
                </div>
            `;
        } else {
            cartItems.innerHTML = carrito.map(item => `
                <div class="cart-item">
                    <span>${item.titulo}</span>
                    <strong>$${item.precio.toLocaleString("es-AR")}</strong>
                </div>
            `).join("");
        }
    }
});

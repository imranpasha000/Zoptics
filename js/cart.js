/**
 * Cart Management System
 * Handles add to cart, remove from cart, update quantities, and localStorage persistence
 */

class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        this.updateCartUI();
        this.bindEvents();
    }

    // Load cart from localStorage
    loadCart() {
        try {
            const cartData = localStorage.getItem('zoptics_cart');
            return cartData ? JSON.parse(cartData) : [];
        } catch (e) {
            console.error('Error loading cart:', e);
            return [];
        }
    }

    // Save cart to localStorage
    saveCart() {
        try {
            localStorage.setItem('zoptics_cart', JSON.stringify(this.cart));
            this.updateCartUI();
        } catch (e) {
            console.error('Error saving cart:', e);
        }
    }

    // Add product to cart
    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: product.image,
                quantity: product.quantity || 1
            });
        }
        
        this.saveCart();
        this.showNotification('Product added to cart!', 'success');
        return this.cart;
    }

    // Remove product from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.showNotification('Product removed from cart!', 'info');
        return this.cart;
    }

    // Update product quantity
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                return this.removeFromCart(productId);
            }
            item.quantity = parseInt(quantity);
            this.saveCart();
        }
        return this.cart;
    }

    // Get cart total
    getTotal() {
        return this.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    // Get cart count
    getCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.showNotification('Cart cleared!', 'info');
    }

    // Update cart UI (counters, totals)
    updateCartUI() {
        const count = this.getCount();
        const total = this.getTotal();

        // Update cart count in header
        const cartCounters = document.querySelectorAll('.cart-count, #cart-count');
        cartCounters.forEach(counter => {
            counter.textContent = count;
            counter.style.display = count > 0 ? 'inline' : 'none';
        });

        // Update cart total
        const cartTotals = document.querySelectorAll('.cart-total, #cart-total');
        cartTotals.forEach(totalEl => {
            totalEl.textContent = `$${total.toFixed(2)}`;
        });

        // Update cart icon badge
        const cartBadges = document.querySelectorAll('.cart-badge');
        cartBadges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });

        // Trigger custom event for other components
        document.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: { cart: this.cart, count, total }
        }));
    }

    // Bind event listeners
    bindEvents() {
        // Handle add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-cart, .add-to-cart')) {
                e.preventDefault();
                const button = e.target.closest('.add-cart, .add-to-cart');
                const productCard = button.closest('.product__item, .product-card, [data-product-id]');
                
                if (productCard) {
                    const product = this.extractProductData(productCard);
                    if (product) {
                        this.addToCart(product);
                    }
                }
            }
        });

        // Handle remove from cart
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-cart, .cart__close')) {
                e.preventDefault();
                const button = e.target.closest('.remove-cart, .cart__close');
                const productId = button.dataset.productId || 
                                 button.closest('[data-product-id]')?.dataset.productId;
                
                if (productId) {
                    this.removeFromCart(productId);
                    // If on cart page, reload cart display
                    if (window.location.pathname.includes('shopping-cart')) {
                        this.renderCartPage();
                    }
                }
            }
        });

        // Handle quantity updates
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('cart-quantity')) {
                const productId = e.target.dataset.productId;
                const quantity = parseInt(e.target.value) || 1;
                this.updateQuantity(productId, quantity);
                
                if (window.location.pathname.includes('shopping-cart')) {
                    this.renderCartPage();
                }
            }
        });
    }

    // Extract product data from DOM element
    extractProductData(element) {
        try {
            const productId = element.dataset.productId || 
                            element.querySelector('[data-product-id]')?.dataset.productId ||
                            `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            const name = element.querySelector('h6, .product-name, h3')?.textContent?.trim() || 
                        element.dataset.productName || 'Product';
            
            const priceText = element.querySelector('h5, .product-price, .price')?.textContent || 
                             element.dataset.productPrice || '0';
            const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
            
            const image = element.querySelector('img')?.src || 
                        element.dataset.productImage || 
                        'img/product/product-1.jpg';
            
            return { id: productId, name, price, image, quantity: 1 };
        } catch (e) {
            console.error('Error extracting product data:', e);
            return null;
        }
    }

    // Render cart page
    renderCartPage() {
        const cartTableBody = document.querySelector('.shopping__cart__table tbody');
        const cartTotalEl = document.querySelector('.cart__total ul');
        
        if (!cartTableBody) return;

        if (this.cart.length === 0) {
            cartTableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-12">
                        <p class="text-gray-500 text-lg mb-4">Your cart is empty</p>
                        <a href="shop.html" class="primary-btn">Continue Shopping</a>
                    </td>
                </tr>
            `;
            
            if (cartTotalEl) {
                cartTotalEl.innerHTML = `
                    <li>Subtotal <span>$0.00</span></li>
                    <li>Total <span>$0.00</span></li>
                `;
            }
            return;
        }

        // Render cart items
        cartTableBody.innerHTML = this.cart.map(item => `
            <tr data-product-id="${item.id}">
                <td class="product__cart__item">
                    <div class="product__cart__item__pic">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="product__cart__item__text">
                        <h6>${item.name}</h6>
                        <h5>$${item.price.toFixed(2)}</h5>
                    </div>
                </td>
                <td class="quantity__item">
                    <div class="quantity">
                        <div class="pro-qty-2">
                            <input type="number" 
                                   class="cart-quantity" 
                                   data-product-id="${item.id}"
                                   value="${item.quantity}" 
                                   min="1"
                                   style="width: 60px; text-align: center; border: 1px solid #ddd; padding: 5px;">
                        </div>
                    </div>
                </td>
                <td class="cart__price">$${(item.price * item.quantity).toFixed(2)}</td>
                <td class="cart__close">
                    <i class="fa fa-close remove-cart" data-product-id="${item.id}" style="cursor: pointer;"></i>
                </td>
            </tr>
        `).join('');

        // Update totals
        const subtotal = this.getTotal();
        if (cartTotalEl) {
            cartTotalEl.innerHTML = `
                <li>Subtotal <span>$${subtotal.toFixed(2)}</span></li>
                <li>Total <span>$${subtotal.toFixed(2)}</span></li>
            `;
        }
    }

    // Show notification
    showNotification(message, type = 'success') {
        // Remove existing notification
        const existing = document.querySelector('.cart-notification');
        if (existing) existing.remove();

        // Create notification
        const notification = document.createElement('div');
        notification.className = `cart-notification fixed top-20 right-4 bg-${type === 'success' ? 'green' : 'blue'}-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300`;
        notification.textContent = message;
        notification.style.transform = 'translateX(400px)';
        
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize cart manager
const cartManager = new CartManager();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartManager;
}


/**
 * Wishlist Management System
 * Handles add to wishlist, remove from wishlist, and localStorage persistence
 */

class WishlistManager {
    constructor() {
        this.wishlist = this.loadWishlist();
        this.init();
    }

    init() {
        this.updateWishlistUI();
        this.bindEvents();
    }

    // Load wishlist from localStorage
    loadWishlist() {
        try {
            const wishlistData = localStorage.getItem('zoptics_wishlist');
            return wishlistData ? JSON.parse(wishlistData) : [];
        } catch (e) {
            console.error('Error loading wishlist:', e);
            return [];
        }
    }

    // Save wishlist to localStorage
    saveWishlist() {
        try {
            localStorage.setItem('zoptics_wishlist', JSON.stringify(this.wishlist));
            this.updateWishlistUI();
        } catch (e) {
            console.error('Error saving wishlist:', e);
        }
    }

    // Add product to wishlist
    addToWishlist(product) {
        const existingItem = this.wishlist.find(item => item.id === product.id);
        
        if (existingItem) {
            this.showNotification('Product already in wishlist!', 'info');
            return this.wishlist;
        }
        
        this.wishlist.push({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            image: product.image
        });
        
        this.saveWishlist();
        this.showNotification('Product added to wishlist!', 'success');
        return this.wishlist;
    }

    // Remove product from wishlist
    removeFromWishlist(productId) {
        this.wishlist = this.wishlist.filter(item => item.id !== productId);
        this.saveWishlist();
        this.showNotification('Product removed from wishlist!', 'info');
        return this.wishlist;
    }

    // Check if product is in wishlist
    isInWishlist(productId) {
        return this.wishlist.some(item => item.id === productId);
    }

    // Get wishlist count
    getCount() {
        return this.wishlist.length;
    }

    // Clear wishlist
    clearWishlist() {
        this.wishlist = [];
        this.saveWishlist();
        this.showNotification('Wishlist cleared!', 'info');
    }

    // Update wishlist UI (counters, heart icons)
    updateWishlistUI() {
        const count = this.getCount();

        // Update wishlist count in header
        const wishlistCounters = document.querySelectorAll('.wishlist-count, #wishlist-count');
        wishlistCounters.forEach(counter => {
            counter.textContent = count;
            counter.style.display = count > 0 ? 'inline' : 'none';
        });

        // Update heart icons based on wishlist status
        document.querySelectorAll('[data-product-id]').forEach(element => {
            const productId = element.dataset.productId;
            const heartIcon = element.querySelector('.wishlist-btn, .heart-icon, [data-wishlist-btn]');
            
            if (heartIcon) {
                if (this.isInWishlist(productId)) {
                    heartIcon.classList.add('active', 'text-red-500');
                    heartIcon.classList.remove('text-gray-400');
                    if (heartIcon.querySelector('i')) {
                        heartIcon.querySelector('i').classList.remove('fa-heart-o');
                        heartIcon.querySelector('i').classList.add('fa-heart');
                    }
                } else {
                    heartIcon.classList.remove('active', 'text-red-500');
                    heartIcon.classList.add('text-gray-400');
                    if (heartIcon.querySelector('i')) {
                        heartIcon.querySelector('i').classList.remove('fa-heart');
                        heartIcon.querySelector('i').classList.add('fa-heart-o');
                    }
                }
            }
        });

        // Update wishlist badge
        const wishlistBadges = document.querySelectorAll('.wishlist-badge');
        wishlistBadges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });

        // Trigger custom event
        document.dispatchEvent(new CustomEvent('wishlistUpdated', {
            detail: { wishlist: this.wishlist, count }
        }));
    }

    // Bind event listeners
    bindEvents() {
        // Handle wishlist button clicks
        document.addEventListener('click', (e) => {
            const wishlistBtn = e.target.closest('.wishlist-btn, .heart-icon, [data-wishlist-btn]');
            if (wishlistBtn) {
                e.preventDefault();
                const productCard = wishlistBtn.closest('.product__item, .product-card, [data-product-id]');
                
                if (productCard) {
                    const product = this.extractProductData(productCard);
                    if (product) {
                        if (this.isInWishlist(product.id)) {
                            this.removeFromWishlist(product.id);
                        } else {
                            this.addToWishlist(product);
                        }
                        
                        // Update UI immediately
                        this.updateWishlistUI();
                        
                        // If on wishlist page, reload
                        if (window.location.pathname.includes('wishlist')) {
                            this.renderWishlistPage();
                        }
                    }
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
            
            return { id: productId, name, price, image };
        } catch (e) {
            console.error('Error extracting product data:', e);
            return null;
        }
    }

    // Render wishlist page
    renderWishlistPage() {
        const wishlistContainer = document.querySelector('.wishlist-container, .wishlist-items');
        
        if (!wishlistContainer) return;

        if (this.wishlist.length === 0) {
            wishlistContainer.innerHTML = `
                <div class="text-center py-16">
                    <i class="fa fa-heart-o text-6xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500 text-lg mb-4">Your wishlist is empty</p>
                    <a href="shop.html" class="primary-btn">Continue Shopping</a>
                </div>
            `;
            return;
        }

        // Render wishlist items
        wishlistContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                ${this.wishlist.map(item => `
                    <div class="product__item" data-product-id="${item.id}">
                        <div class="product__item__pic set-bg" style="background-image: url('${item.image}')">
                            <ul class="product__hover">
                                <li>
                                    <a href="#" class="wishlist-btn active text-red-500" data-wishlist-btn>
                                        <i class="fa fa-heart"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" class="add-cart">
                                        <img src="img/icon/cart.png" alt="">
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="product__item__text">
                            <h6>${item.name}</h6>
                            <a href="#" class="add-cart">+ Add To Cart</a>
                            <h5>$${item.price.toFixed(2)}</h5>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Show notification
    showNotification(message, type = 'success') {
        const existing = document.querySelector('.wishlist-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `wishlist-notification fixed top-20 right-4 bg-${type === 'success' ? 'green' : 'blue'}-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300`;
        notification.textContent = message;
        notification.style.transform = 'translateX(400px)';
        
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize wishlist manager
const wishlistManager = new WishlistManager();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WishlistManager;
}


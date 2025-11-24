/**
 * Shared Utilities for Cart and Wishlist
 * Provides helper functions to initialize cart/wishlist across all pages
 */

// Initialize cart and wishlist on page load
document.addEventListener('DOMContentLoaded', function() {
    // Auto-add data attributes to products that don't have them
    function initializeProductData() {
        document.querySelectorAll('.product__item').forEach((item, index) => {
            if (!item.dataset.productId) {
                const name = item.querySelector('h6')?.textContent?.trim() || 
                            item.querySelector('.product-name')?.textContent?.trim() ||
                            `Product ${index + 1}`;
                
                const priceEl = item.querySelector('h5') || 
                               item.querySelector('.product-price') || 
                               item.querySelector('.price');
                const price = priceEl?.textContent?.replace(/[^0-9.]/g, '') || '0';
                
                const imageEl = item.querySelector('img') || 
                               item.querySelector('[data-setbg]');
                const image = imageEl?.src || 
                             imageEl?.dataset?.setbg || 
                             `img/product/product-${(index % 14) + 1}.jpg`;
                
                item.setAttribute('data-product-id', `product-${Date.now()}-${index}`);
                item.setAttribute('data-product-name', name);
                item.setAttribute('data-product-price', price);
                item.setAttribute('data-product-image', image);
            }
            
            // Update wishlist buttons
            const heartLinks = item.querySelectorAll('.product__hover a, .wishlist-btn');
            heartLinks.forEach(link => {
                if (link.href === '#' || link.classList.contains('wishlist-btn')) {
                    link.classList.add('wishlist-btn');
                    link.setAttribute('data-wishlist-btn', '');
                    if (!link.querySelector('i') && !link.querySelector('img')) {
                        link.innerHTML = '<i class="fa fa-heart-o"></i>';
                    }
                }
            });
        });
    }
    
    // Initialize product data
    initializeProductData();
    
    // Update UI after a short delay to ensure scripts are loaded
    setTimeout(() => {
        if (typeof cartManager !== 'undefined') {
            cartManager.updateCartUI();
        }
        if (typeof wishlistManager !== 'undefined') {
            wishlistManager.updateWishlistUI();
        }
    }, 100);
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeProductData };
}


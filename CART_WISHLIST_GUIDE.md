# Cart & Wishlist System - Implementation Guide

## Overview
This project now includes a fully functional cart and wishlist system using localStorage for data persistence. The system works across all pages and automatically syncs cart/wishlist counts in the header.

## Files Created

### JavaScript Files
1. **js/cart.js** - Cart management system
   - Add/remove products
   - Update quantities
   - Calculate totals
   - Persist to localStorage

2. **js/wishlist.js** - Wishlist management system
   - Add/remove products
   - Check if product is in wishlist
   - Persist to localStorage

3. **js/shared-utils.js** - Shared utilities
   - Auto-initialize product data attributes
   - Setup wishlist buttons
   - Update UI counters

### HTML Pages
1. **wishlist.html** - New wishlist page
2. **shopping-cart.html** - Updated to be dynamic

## How to Use

### Adding Cart/Wishlist to Any Page

1. **Include the scripts** (before closing `</body>` tag):
```html
<!-- Cart and Wishlist Management -->
<script src="js/cart.js"></script>
<script src="js/wishlist.js"></script>
<script src="js/shared-utils.js"></script>
```

2. **Add cart/wishlist icons to header**:
```html
<!-- Wishlist Icon -->
<a href="wishlist.html" class="relative p-2 hover:text-gray-700 transition-colors">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
    <span id="wishlist-count" class="cart-badge absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" style="display: none;">0</span>
</a>

<!-- Cart Icon -->
<a href="shopping-cart.html" class="relative p-2 hover:text-gray-700 transition-colors">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    <span id="cart-count" class="cart-badge absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" style="display: none;">0</span>
</a>
```

3. **Product items should have data attributes** (auto-added by shared-utils.js):
```html
<div class="product__item" 
     data-product-id="product-1" 
     data-product-name="Product Name" 
     data-product-price="67.24" 
     data-product-image="img/product/product-1.jpg">
    <!-- Product content -->
    <a href="#" class="add-cart">+ Add To Cart</a>
    <a href="#" class="wishlist-btn" data-wishlist-btn><i class="fa fa-heart-o"></i></a>
</div>
```

## Features

### Cart Features
- ✅ Add products to cart
- ✅ Remove products from cart
- ✅ Update quantities
- ✅ Calculate totals automatically
- ✅ Persist to localStorage
- ✅ Show cart count in header
- ✅ Dynamic cart page
- ✅ Notifications on add/remove

### Wishlist Features
- ✅ Add products to wishlist
- ✅ Remove products from wishlist
- ✅ Heart icon changes color when in wishlist
- ✅ Persist to localStorage
- ✅ Show wishlist count in header
- ✅ Dynamic wishlist page
- ✅ Notifications on add/remove

## CSS Classes

### Required Classes
- `.add-cart` or `.add-to-cart` - Add to cart button
- `.wishlist-btn` - Wishlist button (with `data-wishlist-btn` attribute)
- `.product__item` - Product container (should have data attributes)
- `.cart-count` or `#cart-count` - Cart counter element
- `.wishlist-count` or `#wishlist-count` - Wishlist counter element

### Data Attributes
- `data-product-id` - Unique product identifier
- `data-product-name` - Product name
- `data-product-price` - Product price (number only)
- `data-product-image` - Product image URL
- `data-wishlist-btn` - Marks element as wishlist button

## API Usage

### Cart Manager
```javascript
// Add product to cart
cartManager.addToCart({
    id: 'product-1',
    name: 'Product Name',
    price: 67.24,
    image: 'img/product/product-1.jpg',
    quantity: 1
});

// Remove product
cartManager.removeFromCart('product-1');

// Update quantity
cartManager.updateQuantity('product-1', 2);

// Get cart total
const total = cartManager.getTotal();

// Get cart count
const count = cartManager.getCount();

// Clear cart
cartManager.clearCart();
```

### Wishlist Manager
```javascript
// Add to wishlist
wishlistManager.addToWishlist({
    id: 'product-1',
    name: 'Product Name',
    price: 67.24,
    image: 'img/product/product-1.jpg'
});

// Remove from wishlist
wishlistManager.removeFromWishlist('product-1');

// Check if in wishlist
const isInWishlist = wishlistManager.isInWishlist('product-1');

// Get wishlist count
const count = wishlistManager.getCount();
```

## Events

The system dispatches custom events:
- `cartUpdated` - Fired when cart changes
- `wishlistUpdated` - Fired when wishlist changes

```javascript
document.addEventListener('cartUpdated', (e) => {
    console.log('Cart updated:', e.detail);
    // e.detail.cart - array of cart items
    // e.detail.count - total item count
    // e.detail.total - total price
});
```

## Notes

- All data is stored in localStorage with keys:
  - `zoptics_cart` - Cart data
  - `zoptics_wishlist` - Wishlist data
- The system automatically extracts product data from DOM if data attributes are missing
- Product IDs should be unique
- Prices should be numbers (strings are automatically converted)

## Browser Support

- Modern browsers with localStorage support
- IE11+ (with polyfills if needed)


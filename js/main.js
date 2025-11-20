/*  ---------------------------------------------------
    Template Name: Male Fashion
    Description: Male Fashion - ecommerce teplate
    Author: Colorib
    Author URI: https://www.colorib.com/
    Version: 1.0
    Created: Colorib
---------------------------------------------------------  */

'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");

        /*------------------
            Gallery filter
        --------------------*/
        $('.filter__controls li').on('click', function () {
            $('.filter__controls li').removeClass('active');
            $(this).addClass('active');
        });
        if ($('.product__filter').length > 0) {
            var containerEl = document.querySelector('.product__filter');
            var mixer = mixitup(containerEl);
        }
    });

    /*------------------
        Background Set
    --------------------*/
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });

    //Search Switch
    $('.search-switch').on('click', function () {
        $('.search-model').fadeIn(400);
    });

    $('.search-close-switch').on('click', function () {
        $('.search-model').fadeOut(400, function () {
            $('#search-input').val('');
        });
    });


    document.addEventListener('DOMContentLoaded', function() {
  const searchButton = document.getElementById('searchButton');
  const searchBar = document.getElementById('searchBar');

  searchButton.addEventListener('click', function() {
    searchBar.classList.toggle('hidden'); // Toggles the 'hidden' class
  });
});

    /*------------------
		Navigation
	--------------------*/
    $(".mobile-menu").slicknav({
        prependTo: '#mobile-menu-wrap',
        allowParentLinks: true
    });

    /*------------------
        Accordin Active
    --------------------*/
    $('.collapse').on('shown.bs.collapse', function () {
        $(this).prev().addClass('active');
    });

    $('.collapse').on('hidden.bs.collapse', function () {
        $(this).prev().removeClass('active');
    });

    /*------------------
        Sidebar Accordion Toggle
    --------------------*/
    // Use event delegation for better reliability
    $(document).on('click', '.shop__sidebar__accordion .card-heading a', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        var target = $(this).attr('data-target');
        var $target = $(target);
        var $accordion = $(this).closest('.accordion');
        var isCurrentlyOpen = $target.hasClass('show');
        
        console.log('Accordion clicked:', target, 'Currently open:', isCurrentlyOpen);
        
        // Always close all sections first
        $accordion.find('.collapse').removeClass('show');
        $accordion.find('.card-heading a').removeClass('active');
        
        // If it wasn't open before, open it now
        if (!isCurrentlyOpen) {
            $target.addClass('show');
            $(this).addClass('active');
            console.log('Opening section:', target);
        } else {
            console.log('Closing section:', target);
        }
        // If it was open, it stays closed (already removed 'show' class above)
    });
    
    // Also handle direct clicks on the card-heading div
    $(document).on('click', '.shop__sidebar__accordion .card-heading', function(e) {
        if (e.target.tagName !== 'A') {
            e.stopPropagation();
            $(this).find('a').trigger('click');
        }
    });

    //Canvas Menu
    $(".canvas__open").on('click', function () {
        $(".offcanvas-menu-wrapper").addClass("active");
        $(".offcanvas-menu-overlay").addClass("active");
    });

    $(".offcanvas-menu-overlay").on('click', function () {
        $(".offcanvas-menu-wrapper").removeClass("active");
        $(".offcanvas-menu-overlay").removeClass("active");
    });

    /*-----------------------
        Hero Slider
    ------------------------*/
    $(".hero__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 1,
        dots: false,
        nav: true,
        navText: ["<span class='arrow_left'><span/>", "<span class='arrow_right'><span/>"],
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: false
    });

    /*--------------------------
        Select
    ----------------------------*/
    $("select").niceSelect();

    /*-------------------
		Radio Btn
	--------------------- */
    $(".product__color__select label, .shop__sidebar__size label, .product__details__option__size label").on('click', function () {
        $(".product__color__select label, .shop__sidebar__size label, .product__details__option__size label").removeClass('active');
        $(this).addClass('active');
    });

    /*-------------------
		Scroll
	--------------------- */
    $(".nice-scroll").niceScroll({
        cursorcolor: "#0d0d0d",
        cursorwidth: "5px",
        background: "#e5e5e5",
        cursorborder: "",
        autohidemode: true,
        horizrailenabled: false
    });

    /*------------------
        CountDown
    --------------------*/
    // For demo preview start
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    if(mm == 12) {
        mm = '01';
        yyyy = yyyy + 1;
    } else {
        mm = parseInt(mm) + 1;
        mm = String(mm).padStart(2, '0');
    }
    var timerdate = mm + '/' + dd + '/' + yyyy;
    // For demo preview end


    // Uncomment below and use your date //

    /* var timerdate = "2020/12/30" */

    $("#countdown").countdown(timerdate, function (event) {
        $(this).html(event.strftime("<div class='cd-item'><span>%D</span> <p>Days</p> </div>" + "<div class='cd-item'><span>%H</span> <p>Hours</p> </div>" + "<div class='cd-item'><span>%M</span> <p>Minutes</p> </div>" + "<div class='cd-item'><span>%S</span> <p>Seconds</p> </div>"));
    });

    /*------------------
		Magnific
	--------------------*/
    $('.video-popup').magnificPopup({
        type: 'iframe'
    });

    /*-------------------
		Quantity change
	--------------------- */
    var proQty = $('.pro-qty');
    proQty.prepend('<span class="fa fa-angle-up dec qtybtn"></span>');
    proQty.append('<span class="fa fa-angle-down inc qtybtn"></span>');
    proQty.on('click', '.qtybtn', function () {
        var $button = $(this);
        var oldValue = $button.parent().find('input').val();
        if ($button.hasClass('inc')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        $button.parent().find('input').val(newVal);
    });

    var proQty = $('.pro-qty-2');
    proQty.prepend('<span class="fa fa-angle-left dec qtybtn"></span>');
    proQty.append('<span class="fa fa-angle-right inc qtybtn"></span>');
    proQty.on('click', '.qtybtn', function () {
        var $button = $(this);
        var oldValue = $button.parent().find('input').val();
        if ($button.hasClass('inc')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        $button.parent().find('input').val(newVal);
    });

    /*------------------
        Achieve Counter
    --------------------*/
    $('.cn_num').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 4000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });

})(jQuery);




    /*------------------
        Header
    --------------------*/

        const tabBtns = document.querySelectorAll('.tab-btn');
        const mobileTabBtns = document.querySelectorAll('.mobile-tab-btn');
        const submenu = document.getElementById('submenu');
        const submenuGrid = submenu.querySelector('div');
        const searchButton = document.getElementById('searchButton');
        const searchBar = document.getElementById('searchBar');
        
        const tabData = {
            sunglasses: [
                { img: 'https://randomuser.me/api/portraits/women/1.jpg', name: 'Women', url: 'sunglasses-women.html' },
                { img: 'https://randomuser.me/api/portraits/men/2.jpg', name: 'Men', url: 'sunglasses-men.html' },
                { img: 'https://randomuser.me/api/portraits/women/3.jpg', name: 'Kids', url: 'sunglasses-kids.html' },
                { img: 'https://randomuser.me/api/portraits/men/4.jpg', name: 'Best Sellers', url: 'shop.html' },
            ],
            eyeglasses: [
                { img: 'https://randomuser.me/api/portraits/women/5.jpg', name: 'Women', url: 'eyeglasses-women.html' },
                { img: 'https://randomuser.me/api/portraits/men/6.jpg', name: 'Men', url: 'eyeglasses-men.html' },
                { img: 'https://randomuser.me/api/portraits/women/7.jpg', name: 'Kids', url: 'eyeglasses-kids.html' },
                { img: 'https://randomuser.me/api/portraits/men/8.jpg', name: 'All Eyeglasses', url: 'shop.html' },
            ],
            newarrivals: [
                { img: 'https://randomuser.me/api/portraits/women/9.jpg', name: 'New Women', url: 'sunglasses-women.html' },
                { img: 'https://randomuser.me/api/portraits/men/10.jpg', name: 'New Men', url: 'sunglasses-men.html' },
                { img: 'https://randomuser.me/api/portraits/women/11.jpg', name: 'New Kids', url: 'sunglasses-kids.html' },
                { img: 'https://randomuser.me/api/portraits/men/12.jpg', name: 'All Products', url: 'shop.html' },
            ]
        };
        
        // Desktop tabs
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                const isActive = btn.classList.contains('border-b-2');
                
                // Remove underline from all
                tabBtns.forEach(b => b.classList.remove('border-b-2', 'border-black'));
                
                if (isActive) {
                    submenu.classList.add('hidden');
                } else {
                    btn.classList.add('border-b-2', 'border-black');
                    
                    submenuGrid.innerHTML = tabData[tab]
                        .map(item => `
                            <a href="${item.url}" class="flex flex-col items-center space-y-2 cursor-pointer hover:opacity-75 transition-opacity">
                                <img src="${item.img}" class="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover" alt="${item.name}">
                                <p class="text-sm text-gray-700">${item.name}</p>
                            </a>
                        `).join('');
                    
                    submenu.classList.remove('hidden');
                }
            });
        });
        
        // Mobile tabs
        mobileTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                const mobileSubmenu = document.getElementById(`mobile-submenu-${tab}`);
                const isActive = !mobileSubmenu.classList.contains('hidden');
                
                // Hide all mobile submenus
                document.querySelectorAll('[id^="mobile-submenu-"]').forEach(menu => {
                    menu.classList.add('hidden');
                });
                
                if (!isActive) {
                    const grid = mobileSubmenu.querySelector('div');
                    grid.innerHTML = tabData[tab]
                        .map(item => `
                            <a href="${item.url}" class="flex flex-col items-center space-y-2 cursor-pointer hover:opacity-75 transition-opacity">
                                <img src="${item.img}" class="w-16 h-16 rounded-full object-cover" alt="${item.name}">
                                <p class="text-xs text-gray-700">${item.name}</p>
                            </a>
                        `).join('');
                    
                    mobileSubmenu.classList.remove('hidden');
                }
            });
        });
        
        // Mobile menu toggle
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');
        const closeIcon = document.getElementById('close-icon');
        
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            menuIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
            
            // Close submenu when mobile menu closes
            if (mobileMenu.classList.contains('hidden')) {
                submenu.classList.add('hidden');
                tabBtns.forEach(b => b.classList.remove('border-b-2', 'border-black'));
            }
        });
        
        // Search toggle
        searchButton.addEventListener('click', () => {
            searchBar.classList.toggle('hidden');
        });

        // Backup: Plain JavaScript Accordion Handler
        // This ensures accordion works even if jQuery has issues
        const accordionLinks = document.querySelectorAll('.shop__sidebar__accordion .card-heading a');
        accordionLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = this.getAttribute('data-target');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const isCurrentlyOpen = targetElement.classList.contains('show');
                    
                    // Always close all sections first
                    const accordion = this.closest('.accordion');
                    if (accordion) {
                        accordion.querySelectorAll('.collapse').forEach(collapse => {
                            collapse.classList.remove('show');
                        });
                        accordion.querySelectorAll('.card-heading a').forEach(link => {
                            link.classList.remove('active');
                        });
                    }
                    
                    // If it wasn't open before, open it now
                    if (!isCurrentlyOpen) {
                        targetElement.classList.add('show');
                        this.classList.add('active');
                    }
                    // If it was open, it stays closed (already removed 'show' class above)
                }
            });
        });
        
        // Close menus when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('header')) {
                submenu.classList.add('hidden');
                tabBtns.forEach(b => b.classList.remove('border-b-2', 'border-black'));
            }
        });
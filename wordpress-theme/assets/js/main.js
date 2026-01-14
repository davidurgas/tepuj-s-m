/**
 * Tepovac Rental - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Navigation scroll effect
    const nav = document.getElementById('main-nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // Handle scroll
    function handleScroll() {
        if (window.scrollY > 50) {
            nav.classList.remove('transparent');
            nav.classList.add('scrolled');
        } else {
            nav.classList.add('transparent');
            nav.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = nav.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close other items
            faqItems.forEach(function(otherItem) {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Fade in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.benefit-card, .process-step, .gallery-slider, .pricing-card, .review-card, .faq-item').forEach(function(el) {
        observer.observe(el);
    });
    
    // ===== Before/After Gallery Slider =====
    if (typeof galleryPairs !== 'undefined' && galleryPairs.length > 0) {
        let currentSlide = 0;
        let showAfter = false;
        
        const mainImage = document.getElementById('gallery-main-image');
        const labelEl = document.getElementById('gallery-label');
        const dotsContainer = document.getElementById('gallery-dots');
        const thumbsContainer = document.getElementById('gallery-thumbnails');
        const toggleBtns = document.querySelectorAll('.gallery-toggle-btn');
        const prevBtn = document.querySelector('.gallery-nav-prev');
        const nextBtn = document.querySelector('.gallery-nav-next');
        
        // Generate dots
        galleryPairs.forEach(function(pair, index) {
            const dot = document.createElement('button');
            dot.className = 'gallery-dot' + (index === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Prejsť na obrázok ' + (index + 1));
            dot.addEventListener('click', function() {
                goToSlide(index);
            });
            dotsContainer.appendChild(dot);
        });
        
        // Generate thumbnails
        galleryPairs.forEach(function(pair, index) {
            const thumb = document.createElement('button');
            thumb.className = 'gallery-thumbnail' + (index === 0 ? ' active' : '');
            thumb.innerHTML = '<img src="' + galleryBasePath + pair.before + '" alt="' + pair.label + '">';
            thumb.addEventListener('click', function() {
                goToSlide(index);
            });
            thumbsContainer.appendChild(thumb);
        });
        
        function updateSlide() {
            const pair = galleryPairs[currentSlide];
            const imageSrc = showAfter ? pair.after : pair.before;
            mainImage.src = galleryBasePath + imageSrc;
            labelEl.textContent = pair.label + ' - ' + (showAfter ? 'PO' : 'PRED');
            
            // Update dots
            document.querySelectorAll('.gallery-dot').forEach(function(dot, i) {
                dot.classList.toggle('active', i === currentSlide);
            });
            
            // Update thumbnails
            document.querySelectorAll('.gallery-thumbnail').forEach(function(thumb, i) {
                thumb.classList.toggle('active', i === currentSlide);
            });
            
            // Update toggle buttons
            toggleBtns.forEach(function(btn) {
                const isAfter = btn.dataset.show === 'after';
                btn.classList.toggle('active', isAfter === showAfter);
            });
        }
        
        function goToSlide(index) {
            currentSlide = index;
            showAfter = false;
            updateSlide();
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % galleryPairs.length;
            showAfter = false;
            updateSlide();
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + galleryPairs.length) % galleryPairs.length;
            showAfter = false;
            updateSlide();
        }
        
        // Toggle buttons
        toggleBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                showAfter = btn.dataset.show === 'after';
                updateSlide();
            });
        });
        
        // Navigation
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });
    }
});

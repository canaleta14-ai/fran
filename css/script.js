// Botón scroll arriba mejorado - solo visible al hacer scroll
window.addEventListener('scroll', function() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
        scrollBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Sistema de filtros y búsqueda
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const ageFilter = document.getElementById('ageFilter');
    const formatFilter = document.getElementById('formatFilter');
    const bookCards = document.querySelectorAll('.book-card');
    const bookCountEl = document.getElementById('bookCount');
    
    // Filtros de categoría
    const categoryLinks = document.querySelectorAll('[data-category]');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            filterByCategory(category);
        });
    });
    
    // Búsqueda en tiempo real
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    
    // Filtros de edad y formato
    if (ageFilter) ageFilter.addEventListener('change', applyFilters);
    if (formatFilter) formatFilter.addEventListener('change', applyFilters);
    
    function filterByCategory(category) {
        bookCards.forEach(card => {
            if (category === 'all' || card.dataset.category.includes(category)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        updateBookCount();
    }
    
    function applyFilters() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const ageValue = ageFilter ? ageFilter.value : 'all';
        const formatValue = formatFilter ? formatFilter.value : 'all';
        
        bookCards.forEach(card => {
            const title = card.dataset.title || '';
            const age = card.dataset.age || '';
            const format = card.dataset.format || '';
            
            const matchesSearch = title.includes(searchTerm);
            const matchesAge = ageValue === 'all' || age === ageValue;
            const matchesFormat = formatValue === 'all' || format === formatValue;
            
            if (matchesSearch && matchesAge && matchesFormat) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        updateBookCount();
    }
    
    function updateBookCount() {
        if (bookCountEl) {
            const visibleBooks = document.querySelectorAll('.book-card[style="display: block;"], .book-card:not([style*="none"])').length;
            bookCountEl.textContent = visibleBooks;
        }
    }
});

// Newsletter subscription
function subscribeNewsletter(event) {
    event.preventDefault();
    const emailInput = document.getElementById('newsletterEmail');
    const message = document.getElementById('newsletterMessage');
    const email = emailInput.value;
    
    // Simulación de suscripción (aquí integrarías con tu backend)
    message.innerHTML = '<i class="fas fa-check-circle"></i> Thank you for subscribing! Check your email.';
    message.style.color = '#4CAF50';
    emailInput.value = '';
    
    setTimeout(() => {
        message.innerHTML = '';
    }, 5000);
    
    return false;
}

// Cookie Consent Banner
(function() {
    const cookieConsent = localStorage.getItem('lovehibo_cookie_consent');
    
    if (!cookieConsent) {
        createCookieBanner();
    }
    
    function createCookieBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <p><i class="fas fa-cookie-bite"></i> <strong>Cookies Notice</strong> | We use cookies to improve your experience. By continuing, you accept our <a href="cookies.html" target="_blank">Cookie Policy</a>.</p>
                <div class="cookie-buttons">
                    <button onclick="acceptCookies()" class="cookie-accept">Accept</button>
                    <button onclick="declineCookies()" class="cookie-decline">Decline</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);
    }
})();

window.acceptCookies = function() {
    localStorage.setItem('lovehibo_cookie_consent', 'accepted');
    document.getElementById('cookie-consent-banner').style.display = 'none';
};

window.declineCookies = function() {
    localStorage.setItem('lovehibo_cookie_consent', 'declined');
    document.getElementById('cookie-consent-banner').style.display = 'none';
};

// Image Lightbox
document.addEventListener('DOMContentLoaded', function() {
    // Create lightbox element
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = '<span class="lightbox-close">&times;</span><img src="" alt="Book preview">';
    document.body.appendChild(lightbox);
    
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    
    // Add click event to all book images
    document.querySelectorAll('.book-image').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function() {
            lightboxImg.src = this.src;
            lightboxImg.alt = this.alt;
            lightbox.classList.add('active');
        });
    });
    
    // Close lightbox
    closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });
    
    // ESC key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
        }
    });
});

// Smooth Scroll Enhancement
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Filter Animation with accessibility announcement
const originalFilterCategory = window.filterByCategory;
if (typeof originalFilterCategory === 'function') {
    window.filterByCategory = function(category) {
        const bookGrid = document.querySelector('.book-grid');
        if (bookGrid) {
            bookGrid.classList.add('filtering');
            setTimeout(() => {
                originalFilterCategory(category);
                bookGrid.classList.remove('filtering');
                
                // Announce filter result to screen readers
                const visibleBooks = document.querySelectorAll('.book-card[style="display: block;"], .book-card:not([style*="none"])').length;
                announceToScreenReader(`Showing ${visibleBooks} books`);
            }, 250);
        } else {
            originalFilterCategory(category);
        }
    };
}

// Accessibility: Announce dynamic changes to screen readers
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Keyboard navigation improvements
document.addEventListener('DOMContentLoaded', function() {
    // Trap focus in dropdown menus when open
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.dropdown-btn');
        const content = dropdown.querySelector('.dropdown-content');
        
        btn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Close dropdown on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                btn.setAttribute('aria-expanded', 'false');
                content.style.display = 'none';
            }
        });
    });
    
    // Add keyboard support for book cards
    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const link = this.querySelector('a.buy-button');
                if (link) link.click();
            }
        });
    });
});
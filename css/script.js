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
// LoveHibo Main Script
console.log('Main script loaded');

// Scroll to top
window.addEventListener('scroll',function(){
    const btn=document.getElementById('scrollTopBtn');
    if(btn){btn.style.display=window.scrollY>200?'block':'none'}
});

function scrollToTop(){
    window.scrollTo({top:0,behavior:'smooth'});
}

// Filters and search
document.addEventListener('DOMContentLoaded',function(){
    const searchInput=document.getElementById('searchInput');
    const ageFilter=document.getElementById('ageFilter');
    const formatFilter=document.getElementById('formatFilter');
    const bookCards=document.querySelectorAll('.book-card');
    const bookCountEl=document.getElementById('bookCount');
    
    function filterByCategory(category){
        bookCards.forEach(card=>{
            const cardCategory=card.dataset.category||'';
            if(category==='all'||cardCategory.includes(category)){
                card.style.display='block';
            }else{
                card.style.display='none';
            }
        });
        updateBookCount();
    }
    
    function applyFilters(){
        const searchTerm=searchInput?searchInput.value.toLowerCase():'';
        const ageValue=ageFilter?ageFilter.value:'all';
        const formatValue=formatFilter?formatFilter.value:'all';
        
        bookCards.forEach(card=>{
            const title=card.dataset.title||'';
            const age=card.dataset.age||'';
            const format=card.dataset.format||'';
            
            const matchesSearch=title.includes(searchTerm);
            const matchesAge=ageValue==='all'||age===ageValue;
            const matchesFormat=formatValue==='all'||format===formatValue;
            
            if(matchesSearch&&matchesAge&&matchesFormat){
                card.style.display='block';
            }else{
                card.style.display='none';
            }
        });
        updateBookCount();
    }
    
    function updateBookCount(){
        if(bookCountEl){
            const visible=document.querySelectorAll('.book-card[style="display: block;"], .book-card:not([style*="none"])').length;
            bookCountEl.textContent=visible;
        }
    }
    
    // Solo aplicar el filtro a elementos de navegación/menú, NO a book-cards
    document.querySelectorAll('[data-category]:not(.book-card)').forEach(link=>{
        link.addEventListener('click',function(e){
            e.preventDefault();
            e.stopPropagation();
            const category=this.dataset.category;
            filterByCategory(category);
        });
    });
    
    if(searchInput)searchInput.addEventListener('input',applyFilters);
    if(ageFilter)ageFilter.addEventListener('change',applyFilters);
    if(formatFilter)formatFilter.addEventListener('change',applyFilters);
    
    window.filterByCategory=filterByCategory;
});

// Newsletter
function subscribeNewsletter(event){
    event.preventDefault();
    const emailInput=document.getElementById('newsletterEmail');
    const message=document.getElementById('newsletterMessage');
    message.innerHTML='<i class="fas fa-check-circle"></i> Thank you for subscribing!';
    message.style.color='#4CAF50';
    emailInput.value='';
    setTimeout(()=>{message.innerHTML=''},5000);
    return false;
}

// Cookie consent
(function(){
    const cookieConsent=localStorage.getItem('lovehibo_cookie_consent');
    if(!cookieConsent){
        const banner=document.createElement('div');
        banner.id='cookie-consent-banner';
        banner.innerHTML='<div class="cookie-content"><p><i class="fas fa-cookie-bite"></i> <strong>Cookies Notice</strong></p><div class="cookie-buttons"><button onclick="acceptCookies()">Accept</button><button onclick="declineCookies()">Decline</button></div></div>';
        document.body.appendChild(banner);
    }
})();

window.acceptCookies=function(){
    localStorage.setItem('lovehibo_cookie_consent','accepted');
    document.getElementById('cookie-consent-banner').style.display='none';
};

window.declineCookies=function(){
    localStorage.setItem('lovehibo_cookie_consent','declined');
    document.getElementById('cookie-consent-banner').style.display='none';
};

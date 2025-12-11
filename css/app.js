// Scroll to top button
window.addEventListener('scroll',function(){
    const btn=document.getElementById('scrollTopBtn');
    if(btn){btn.style.display=window.scrollY>200?'block':'none'}
});

function scrollToTop(){
    window.scrollTo({top:0,behavior:'smooth'});
}

// Newsletter
function subscribeNewsletter(event){
    event.preventDefault();
    const emailInput=document.getElementById('newsletterEmail');
    const message=document.getElementById('newsletterMessage');
    message.innerHTML='<i class="fas fa-check-circle"></i> Thank you for subscribing! Check your email.';
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

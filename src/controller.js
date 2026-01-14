document.addEventListener('DOMContentLoaded', function() {
    const entranceBtn = document.getElementById('entrance');
    
    if (entranceBtn) {
        entranceBtn.addEventListener('click', function(e) {
            e.preventDefault();  
            const header = document.querySelector('.header');
            if (header) {
                header.classList.add('fade-out');
            }
            setTimeout(() => {
                window.location.href = "game.html";  
            }, 600);  
        });
    }
});
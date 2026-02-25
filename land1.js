// Mobile menu functionality
document.addEventListener("DOMContentLoaded", function() {
    const mobileHamburger = document.getElementById("mobileHamburger");
    const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
    
    // Toggle mobile menu
    if (mobileHamburger && mobileMenuOverlay) {
        const menuIcon = mobileHamburger.querySelector('img');
        
        function toggleMenu() {
            const isMenuOpen = mobileMenuOverlay.classList.toggle("active");
            if (isMenuOpen) {
                menuIcon.src = 'close.svg';
                menuIcon.style.width = '36px';
                menuIcon.style.height = '36px';
                document.body.style.overflow = "hidden";
            } else {
                menuIcon.src = 'ham.svg';
                menuIcon.style.width = '20px';
                menuIcon.style.height = '20px';
                document.body.style.overflow = "";
            }
        }
        
        mobileHamburger.addEventListener("click", function(e) {
            e.stopPropagation();
            toggleMenu();
        });
        
        // Close menu when clicking on a link
        const mobileLinks = document.querySelectorAll(".mobile-nav-links a");
        mobileLinks.forEach(link => {
            link.addEventListener("click", function() {
                mobileMenuOverlay.classList.remove("active");
                menuIcon.src = 'ham.svg';
                menuIcon.style.width = '20px';
                menuIcon.style.height = '20px';
                document.body.style.overflow = "";
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener("click", function(e) {
            if (mobileMenuOverlay.classList.contains("active") && 
                !mobileMenuOverlay.contains(e.target) && 
                e.target !== mobileHamburger && 
                !mobileHamburger.contains(e.target)) {
                toggleMenu();
            }
        });
    }
});

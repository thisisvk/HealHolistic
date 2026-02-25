// Mobile viewport height fix
function fixMobileViewport() {
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  let vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  // Handle iOS viewport height changes (when address bar hides/shows)
  window.addEventListener('resize', () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });

  // Prevent double-tap zoom
  document.documentElement.addEventListener('touchstart', function (event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, { passive: false });

  // Prevent iOS rubber-band effect
  document.body.addEventListener('touchmove', function(e) {
    if(!e.target.classList.contains('scrollable')) {
      e.preventDefault();
    }
  }, { passive: false });
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', fixMobileViewport);

// Also run on window load
window.addEventListener('load', fixMobileViewport);

// Run on orientation change
window.addEventListener('orientationchange', function() {
  // After orientation change, force a repaint
  setTimeout(fixMobileViewport, 200);
});

// Fix for iOS 15+ viewport bug
if (navigator.platform === 'iPhone' || navigator.platform === 'iPad' || navigator.platform === 'iPod') {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.content = viewport.content + ', maximum-scale=1.0';
  }
}

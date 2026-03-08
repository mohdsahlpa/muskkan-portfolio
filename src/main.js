import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // IntersectionObserver for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { 
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Number count-up animation for Stats using IntersectionObserver
  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalValue = parseInt(target.getAttribute('data-target'), 10);
        const counterEl = target.querySelector('.stat-number');
        
        if (!counterEl || isNaN(finalValue)) return;
        
        let currentVal = 0;
        const duration = 2000; 
        // calculate wait time based on how big the number is. 
        // fallback to default speed if finalValue is small
        const steps = Math.min(finalValue, 100); 
        const stepTime = duration / steps;
        
        const timer = setInterval(() => {
          currentVal += Math.max(1, Math.ceil(finalValue / steps));
          if (currentVal >= finalValue) {
            counterEl.textContent = finalValue;
            clearInterval(timer);
          } else {
            counterEl.textContent = currentVal;
          }
        }, stepTime);
        
        observer.unobserve(target); // Animate only once
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat').forEach(el => statsObserver.observe(el));

  // --- Mobile Menu Logic ---
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const menuIcon = document.querySelector('.menu-icon');
  const closeIcon = document.querySelector('.close-icon');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMenu() {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', !isExpanded);
    mobileNav.classList.toggle('is-open');
    
    if (!isExpanded) {
      menuIcon.style.display = 'none';
      closeIcon.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      menuIcon.style.display = 'block';
      closeIcon.style.display = 'none';
      document.body.style.overflow = ''; // Allow scrolling again
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMenu);
  }

  // Close the menu automatically when a link inside it is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('is-open')) {
        toggleMenu();
      }
    });
  });

  // Handle window resize cleanly returning to desktop view
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 900 && mobileNav.classList.contains('is-open')) {
      // Force close the mobile menu natively
      toggleMenu();
    }
  });

  // --- View More Projects Logic ---
  const viewMoreBtn = document.getElementById('viewMoreWorkBtn');
  const hiddenWorkItems = document.querySelectorAll('.hidden-work');

  if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', () => {
      hiddenWorkItems.forEach(item => {
        item.classList.remove('hidden-work');
        // Manually trigger visible for smooth transition if intersection observer missed it
        item.classList.add('visible');
      });
      // Hide the button after all items are shown
      viewMoreBtn.style.display = 'none';
      
      // Re-initialize any new lucide icons that might be inside (though none currently are in these cases)
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  }

  // --- Dynamic Footer Year ---
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});

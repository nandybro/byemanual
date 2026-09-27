/* ===================================================
   ERP PAGE FILTER — erp.js
   =================================================== */

(function () {
  const filterBtns = document.querySelectorAll('.erp-filter-btn');
  const cards = document.querySelectorAll('.erp-module-card');

  // Navbar scroll effect (reuse from main site)
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // Count cards per category and update button labels
  const counts = {};
  cards.forEach(card => {
    const cat = card.dataset.category;
    counts[cat] = (counts[cat] || 0) + 1;
  });
  counts['all'] = cards.length;

  filterBtns.forEach(btn => {
    const f = btn.dataset.filter;
    const count = counts[f] || 0;
    btn.innerHTML = `${btn.textContent.trim()} <span class="filter-count-pill">${count}</span>`;
  });

  // Filter logic
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/hide cards with animation
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'cardIn 0.35s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Inject card-in animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes cardIn {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // Intersection observer for scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.4s ease ${i * 0.03}s, transform 0.4s ease ${i * 0.03}s`;
    observer.observe(card);
  });

  // ==========================================
  // WhatsApp Popup Widget Logic
  // ==========================================
  const waPopup = document.getElementById('waPopup');
  const waPopupClose = document.getElementById('waPopupClose');
  const waFloat = document.getElementById('wa-float');

  if (waPopup && waPopupClose && waFloat) {
    // Show popup after 4 seconds if not previously dismissed
    if (!sessionStorage.getItem('waPopupDismissed')) {
      setTimeout(() => {
        waPopup.classList.add('show');
      }, 4000);
    }

    // Close button handler
    waPopupClose.addEventListener('click', () => {
      waPopup.classList.remove('show');
      sessionStorage.setItem('waPopupDismissed', 'true');
    });

    // Toggle popup when clicking the float button
    waFloat.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent direct wa.me link click
      waPopup.classList.toggle('show');
    });
  }

})();

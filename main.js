/* =========================================================
   BYEMANUAL.COM — main.js
   ========================================================= */

'use strict';

/* ---- NAVBAR SCROLL EFFECT ---- */
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    mainNav.classList.add('scrolled');
  } else {
    mainNav.classList.remove('scrolled');
  }
}, { passive: true });

/* ---- SMOOTH SCROLL FOR ALL ANCHOR LINKS ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = mainNav.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
    // Close mobile nav if open
    const navCollapse = document.getElementById('navbarNav');
    if (navCollapse && navCollapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
      if (bsCollapse) bsCollapse.hide();
    }
  });
});

/* ---- SCROLL REVEAL ---- */
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => {
        el.classList.add('revealed');
      }, delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));



/* ---- FLOATING PARTICLES ---- */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    const size = Math.random() * 6 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 8}s;
    `;
    container.appendChild(p);
  }
}
createParticles();

/* ---- CONTACT FORM → WHATSAPP ---- */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('form-submit-btn');
const successMsg = document.getElementById('formSuccess');

// WhatsApp number — update this to your real number (no spaces, with country code)
const WA_NUMBER = '919363717887';

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    // Validate required fields
    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('is-invalid');
      const val = field.value.trim();
      if (!val) {
        field.classList.add('is-invalid');
        valid = false;
      } else if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          field.classList.add('is-invalid');
          valid = false;
        }
      }
    });

    if (!valid) return;

    // Build WhatsApp message from form data
    const name = form.name.value.trim();
    const org = form.org.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const orgType = form.orgType.value;
    const problem = form.problem.value.trim();

    const message =
      `Hi ByeManual! \n\n` +
      `*Name:* ${name}\n` +
      `*Organization:* ${org}\n` +
      `*Org Type:* ${orgType}\n` +
      `*Email:* ${email}\n` +
      (phone ? `*Phone:* ${phone}\n` : '') +
      `\n*Problem to solve:*\n${problem}`;

    const waURL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(waURL, '_blank', 'noopener,noreferrer');

    // Reset form and show confirmation
    form.reset();
    successMsg.innerHTML = '<i class="bi bi-whatsapp me-2"></i><strong>Opening WhatsApp!</strong> Your details are pre-filled — just hit Send.';
    successMsg.classList.remove('d-none');
    setTimeout(() => successMsg.classList.add('d-none'), 6000);
  });

  // Clear invalid state on input
  form.querySelectorAll('.bm-input').forEach(input => {
    input.addEventListener('input', () => input.classList.remove('is-invalid'));
  });
}

/* ---- ACTIVE NAV LINK ON SCROLL ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.bm-nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'rgba(232,234,240,1)';
        }
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

/* ---- SERVICE CARD 3D TILT ---- */
document.querySelectorAll('.service-card, .pricing-card, .testimonial-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
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

/**
 * HOTEL SARVIKA MANSAROVER - MAIN APPLICATION LOGIC
 * Booking Calculator, WhatsApp Generator, Lightbox & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Header Scroll State
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  }, { passive: true });

  // 2. Mobile Menu Toggle & Body Scroll Lock
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (menuToggle && navMenu) {
    const toggleMenu = (open) => {
      const state = typeof open === 'boolean' ? open : !navMenu.classList.contains('open');
      navMenu.classList.toggle('open', state);
      menuToggle.classList.toggle('open', state);
      menuToggle.setAttribute('aria-expanded', state);
      document.body.classList.toggle('menu-locked', state);
    };

    menuToggle.addEventListener('click', () => toggleMenu());

    // Close when clicking outside or on a link
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });

    navMenu.querySelectorAll('.nav-link, .nav-drawer-btn').forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  // 3. Default Dates for Reservation Inputs
  const checkinInput = document.getElementById('resCheckin') || document.getElementById('formCheckin');
  const checkoutInput = document.getElementById('resCheckout') || document.getElementById('formCheckout');

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (d) => d.toISOString().split('T')[0];

  if (checkinInput && !checkinInput.value) {
    checkinInput.value = formatDate(today);
    checkinInput.min = formatDate(today);
  }
  if (checkoutInput && !checkoutInput.value) {
    checkoutInput.value = formatDate(tomorrow);
    checkoutInput.min = formatDate(tomorrow);
  }

  if (checkinInput && checkoutInput) {
    checkinInput.addEventListener('change', () => {
      const cin = new Date(checkinInput.value);
      cin.setDate(cin.getDate() + 1);
      checkoutInput.min = formatDate(cin);
      if (new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
        checkoutInput.value = formatDate(cin);
      }
      updateTariffEstimate();
    });

    checkoutInput.addEventListener('change', () => {
      updateTariffEstimate();
    });
  }

  // 4. Tariff & GST Estimator Calculation
  function updateTariffEstimate() {
    const roomSelect = document.getElementById('resRoom') || document.getElementById('formRoom');
    const guestSelect = document.getElementById('resGuests') || document.getElementById('formGuests');
    const priceDisplay = document.getElementById('calculatedPrice');

    if (!roomSelect) return;

    const rate = parseInt(roomSelect.value, 10) || 1500;
    let nights = 1;

    if (checkinInput && checkoutInput && checkinInput.value && checkoutInput.value) {
      const d1 = new Date(checkinInput.value);
      const d2 = new Date(checkoutInput.value);
      const diffTime = d2.getTime() - d1.getTime();
      nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    const subtotal = rate * nights;
    // GST Tier: Hotel rooms under ₹7,500/night are 12% GST
    const gstRate = 0.12;
    const gst = Math.round(subtotal * gstRate);
    const total = subtotal + gst;

    if (priceDisplay) {
      priceDisplay.innerHTML = `
        <span class="calc-total">₹${total.toLocaleString('en-IN')}</span>
        <span class="calc-sub">(${nights} ${nights > 1 ? 'nights' : 'night'} incl. 12% GST ₹${gst.toLocaleString('en-IN')})</span>
      `;
    }
  }

  const roomDropdown = document.getElementById('resRoom') || document.getElementById('formRoom');
  if (roomDropdown) {
    roomDropdown.addEventListener('change', updateTariffEstimate);
    updateTariffEstimate();
  }

  // 5. WhatsApp Direct Reservation Formatter
  window.sendWhatsAppBooking = function (e) {
    if (e) e.preventDefault();

    const roomSelect = document.getElementById('resRoom') || document.getElementById('formRoom');
    const checkin = (checkinInput && checkinInput.value) || 'Today';
    const checkout = (checkoutInput && checkoutInput.value) || 'Tomorrow';
    const guests = document.getElementById('resGuests')?.value || '2 Guests';
    const nameInput = document.getElementById('formName');
    const guestName = nameInput ? nameInput.value.trim() : '';

    const roomText = roomSelect ? roomSelect.options[roomSelect.selectedIndex].text : 'Deluxe Room (₹1,500)';
    const rate = roomSelect ? parseInt(roomSelect.value, 10) : 1500;

    let nights = 1;
    if (checkinInput && checkoutInput && checkinInput.value && checkoutInput.value) {
      const d1 = new Date(checkinInput.value);
      const d2 = new Date(checkoutInput.value);
      nights = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
    }
    const total = (rate * nights * 1.12).toFixed(0);

    let message = `Namaste Hotel Sarvika Mansarover,\n\nI would like to inquire about booking a room:`;
    if (guestName) message += `\n- *Guest Name*: ${guestName}`;
    message += `\n- *Room Category*: ${roomText}`;
    message += `\n- *Check-in*: ${checkin}`;
    message += `\n- *Check-out*: ${checkout} (${nights} night${nights > 1 ? 's' : ''})`;
    message += `\n- *Guests*: ${guests}`;
    message += `\n- *Estimated Tariff*: ₹${Number(total).toLocaleString('en-IN')} (incl. GST)`;
    message += `\n\nPlease confirm availability and payment details. Thank you!`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/918769311980?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  // Wire reservation bar submit
  const resBtn = document.getElementById('btnQuickBook');
  if (resBtn) {
    resBtn.addEventListener('click', window.sendWhatsAppBooking);
  }

  // 6. Interactive Filterable Gallery
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = '';
          item.style.opacity = '0';
          setTimeout(() => { item.style.opacity = '1'; }, 40);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 7. Lightbox Modal Functionality
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightboxModal && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const caption = item.querySelector('h4')?.textContent || 'Hotel Sarvika Mansarover';
        if (img) {
          lightboxImg.src = img.src;
          if (lightboxCaption) lightboxCaption.textContent = caption;
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // 8. Contact & Booking Form Submission
  const bookingForm = document.getElementById('hotelBookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span>Processing Request...</span>`;
      submitBtn.disabled = true;

      setTimeout(() => {
        // Also open WhatsApp with details
        window.sendWhatsAppBooking();
        
        // Form feedback
        bookingForm.innerHTML = `
          <div style="text-align: center; padding: 40px 20px;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: #e8f5e9; color: #2e7d32; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 28px;">✓</div>
            <h3 style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--text-primary); margin-bottom: 12px;">Reservation Request Sent!</h3>
            <p style="color: var(--text-secondary); max-width: 440px; margin: 0 auto 24px; font-size: 0.95rem;">
              Our front desk manager has received your reservation details and will contact you via WhatsApp / Call (+91 8769311980) within minutes to confirm your room.
            </p>
            <div style="background: var(--bg-sand); padding: 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); display: inline-block; font-size: 0.85rem; color: var(--text-muted);">
              GST Invoice Reference: <strong>08AVIPY2486M1ZL</strong>
            </div>
          </div>
        `;
      }, 800);
    });
  }

});

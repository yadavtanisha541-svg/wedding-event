/**
 * DreamDay Events - Luxury Wedding & Event Management
 * Interactive Client Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  // Autoplay hero background video
  const heroVid = document.getElementById('heroVideo');
  if (heroVid) {
    heroVid.muted = true;
    heroVid.play().catch(function() {});
  }

  /* ==========================================================================
     1. Sticky Navbar & Active Section Tracking
     ========================================================================== */
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.querySelector('.back-to-top');

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    // Sticky navbar appearance
    if (scrollY > 60) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }

    // Active navigation link detection for multi-page website
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    let isMultiPage = false;

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#')) {
        isMultiPage = true;
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });

    if (!isMultiPage) {
      let currentSectionId = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          currentSectionId = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Back to top click handler
  backToTopBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ==========================================================================
     2. Mobile Hamburger Menu & Slide-in Drawer
     ========================================================================== */
  const hamburger = document.querySelector('.hamburger');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const drawerBackdrop = document.querySelector('.mobile-drawer-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-close');

  const openMobileMenu = () => {
    hamburger?.classList.add('active');
    mobileDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    hamburger?.classList.remove('active');
    mobileDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger?.addEventListener('click', () => {
    if (mobileDrawer?.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  drawerBackdrop?.addEventListener('click', closeMobileMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  /* ==========================================================================
     3. Storytelling Gallery Filtering & Lightbox Modal
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxTitle = document.querySelector('.lightbox-title');
  const lightboxDesc = document.querySelector('.lightbox-desc');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  let currentCategory = 'all';
  let activeGalleryArray = [];
  let currentImageIndex = 0;

  // Update list of currently visible gallery items
  const updateActiveGalleryList = () => {
    activeGalleryArray = Array.from(galleryItems).filter(item => {
      const itemCategories = (item.getAttribute('data-category') || '').split(' ');
      return currentCategory === 'all' || itemCategories.includes(currentCategory);
    });
  };

  // Filter tabs click handling
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategories = (item.getAttribute('data-category') || '').split(' ');
        if (currentCategory === 'all' || itemCategories.includes(currentCategory)) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });

      updateActiveGalleryList();
    });
  });

  // Open Lightbox
  const openLightbox = (index) => {
    if (!activeGalleryArray[index]) return;
    currentImageIndex = index;
    const item = activeGalleryArray[currentImageIndex];
    const imgEl = item.querySelector('img');
    const titleEl = item.querySelector('.gallery-title');
    const descEl = item.querySelector('.gallery-desc');

    if (lightboxImg && imgEl) {
      lightboxImg.src = imgEl.src;
      lightboxImg.alt = imgEl.alt || 'Wedding Gallery Image';
    }
    if (lightboxTitle && titleEl) {
      lightboxTitle.textContent = titleEl.textContent;
    }
    if (lightboxDesc && descEl) {
      lightboxDesc.textContent = descEl.textContent;
    }

    lightboxModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Close Lightbox
  const closeLightbox = () => {
    lightboxModal?.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Next / Prev in Lightbox
  const showPrevImage = () => {
    if (activeGalleryArray.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + activeGalleryArray.length) % activeGalleryArray.length;
    openLightbox(currentImageIndex);
  };

  const showNextImage = () => {
    if (activeGalleryArray.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % activeGalleryArray.length;
    openLightbox(currentImageIndex);
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      updateActiveGalleryList();
      const index = activeGalleryArray.indexOf(item);
      if (index !== -1) {
        openLightbox(index);
      }
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', (e) => { e.stopPropagation(); showPrevImage(); });
  lightboxNext?.addEventListener('click', (e) => { e.stopPropagation(); showNextImage(); });

  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  /* ==========================================================================
     4. Video Showcase Modal Player
     ========================================================================== */
  const videoCards = document.querySelectorAll('.video-card');
  const videoModal = document.querySelector('.video-modal');
  const videoModalClose = document.querySelector('.video-modal-close');
  const videoPlayerContainer = document.querySelector('.video-player-container');

  // Video embed links (luxury wedding celebration teasers)
  const videoData = [
    {
      title: 'Grand Royal Mandap & Varmala Reveal',
      url: 'https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&rel=0'
    },
    {
      title: 'Electrifying Bollywood Sangeet Night',
      url: 'https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&rel=0'
    },
    {
      title: 'Luxury Palace Reception & Fireworks Finale',
      url: 'https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&rel=0'
    }
  ];

  videoCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      const data = videoData[idx] || videoData[0];
      if (videoPlayerContainer) {
        videoPlayerContainer.innerHTML = `
          <iframe 
            src="${data.url}" 
            title="${data.title}" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        `;
      }
      videoModal?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeVideoModal = () => {
    if (videoPlayerContainer) {
      videoPlayerContainer.innerHTML = '';
    }
    videoModal?.classList.remove('active');
    document.body.style.overflow = '';
  };

  videoModalClose?.addEventListener('click', closeVideoModal);
  videoModal?.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      closeVideoModal();
    }
  });

  /* Keyboard handlers for Modals */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightboxModal?.classList.contains('active')) closeLightbox();
      if (videoModal?.classList.contains('active')) closeVideoModal();
      if (mobileDrawer?.classList.contains('open')) closeMobileMenu();
    } else if (lightboxModal?.classList.contains('active')) {
      if (e.key === 'ArrowLeft') showPrevImage();
      if (e.key === 'ArrowRight') showNextImage();
    }
  });

  /* ==========================================================================
     5. Testimonials Carousel / Slider
     ========================================================================== */
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.carousel-dots');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  let currentSlide = 0;
  const totalSlides = slides.length;
  let autoplayTimer = null;

  // Create pagination dots
  if (dotsContainer && totalSlides > 0) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('data-slide', i);
      dot.addEventListener('click', () => {
        goToSlide(i);
        restartAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  const updateDots = () => {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  };

  const goToSlide = (slideIndex) => {
    currentSlide = (slideIndex + totalSlides) % totalSlides;
    if (track) {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    updateDots();
  };

  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  nextBtn?.addEventListener('click', () => {
    nextSlide();
    restartAutoplay();
  });

  prevBtn?.addEventListener('click', () => {
    prevSlide();
    restartAutoplay();
  });

  // Autoplay
  const startAutoplay = () => {
    if (totalSlides > 1) {
      autoplayTimer = setInterval(nextSlide, 5500);
    }
  };

  const restartAutoplay = () => {
    clearInterval(autoplayTimer);
    startAutoplay();
  };

  // Pause on hover
  track?.parentElement?.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  track?.parentElement?.addEventListener('mouseleave', startAutoplay);

  // Touch Swipe for Mobile Carousel
  let touchStartX = 0;
  let touchEndX = 0;

  track?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      nextSlide();
      restartAutoplay();
    } else if (touchEndX - touchStartX > 50) {
      prevSlide();
      restartAutoplay();
    }
  }, { passive: true });

  startAutoplay();

  /* ==========================================================================
     6. FAQ Accordion with Smooth CSS Height Animation
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');

    header?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other accordions for clean single-view
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.faq-content');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      // Toggle clicked item
      if (isActive) {
        item.classList.remove('active');
        if (content) content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        if (content) content.style.maxHeight = `${content.scrollHeight + 20}px`;
      }
    });
  });

  // Open first FAQ by default
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstContent = firstItem.querySelector('.faq-content');
    firstItem.classList.add('active');
    if (firstContent) firstContent.style.maxHeight = `${firstContent.scrollHeight + 20}px`;
  }

  /* ==========================================================================
     7. Quotation Form & WhatsApp Integration
     ========================================================================== */
  const quoteForm = document.getElementById('quoteForm');
  const toastNotice = document.getElementById('toastNotice');
  const directWhatsAppBtn = document.getElementById('directWhatsAppBtn');

  // Helper to trigger toast
  const showToast = (title, message) => {
    if (!toastNotice) return;
    const titleEl = toastNotice.querySelector('.toast-title');
    const descEl = toastNotice.querySelector('.toast-desc');
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = message;

    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 4500);
  };

  // Build WhatsApp text from form
  const generateWhatsAppMessage = () => {
    const name = document.getElementById('clientName')?.value.trim() || 'Valued Client';
    const phone = document.getElementById('clientPhone')?.value.trim() || 'N/A';
    const eventType = document.getElementById('eventType')?.value || 'Wedding';
    const eventDate = document.getElementById('eventDate')?.value || 'Upcoming Date';
    const eventLocation = document.getElementById('eventLocation')?.value.trim() || 'Not specified';
    const guestCount = document.getElementById('guestCount')?.value || '100-300';
    
    // Checked services
    const checkedServices = [];
    document.querySelectorAll('input[name="services"]:checked').forEach(cb => {
      checkedServices.push(cb.value);
    });

    const servicesStr = checkedServices.length > 0 ? checkedServices.join(', ') : 'Complete Wedding Management';
    const message = document.getElementById('clientMessage')?.value.trim() || 'Looking forward to consultation.';

    const text = `*New Event Inquiry - DreamDay Events*%0A%0A` +
      `*Client Name:* ${encodeURIComponent(name)}%0A` +
      `*Phone:* ${encodeURIComponent(phone)}%0A` +
      `*Event Type:* ${encodeURIComponent(eventType)}%0A` +
      `*Event Date:* ${encodeURIComponent(eventDate)}%0A` +
      `*Location / Venue:* ${encodeURIComponent(eventLocation)}%0A` +
      `*Guests:* ${encodeURIComponent(guestCount)}%0A` +
      `*Services Requested:* ${encodeURIComponent(servicesStr)}%0A` +
      `*Message:* ${encodeURIComponent(message)}`;

    return text;
  };

  // Direct WhatsApp Button click (from form or header)
  directWhatsAppBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const whatsappNumber = '919876543210';
    const prefilledText = generateWhatsAppMessage();
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${prefilledText}`;
    window.open(whatsappUrl, '_blank');
  });

  // Quote form submission
  quoteForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('clientName')?.value.trim();
    const phone = document.getElementById('clientPhone')?.value.trim();

    if (!name || !phone) {
      showToast('Information Missing', 'Please enter your Full Name and Phone Number.');
      return;
    }

    // Show luxury confirmation toast
    showToast(
      'Celebration Inquiry Received!',
      `Thank you, ${name}! Our senior wedding planner will contact you at ${phone} within 2 hours with customized concepts.`
    );

    // Prompt option to also send over WhatsApp
    const sendWhatsApp = confirm(`Thank you ${name}! Would you also like to send this inquiry directly to our planner on WhatsApp for an immediate response?`);
    if (sendWhatsApp) {
      const whatsappNumber = '919876543210';
      const prefilledText = generateWhatsAppMessage();
      window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${prefilledText}`, '_blank');
    }

    quoteForm.reset();
  });

  // Newsletter submission
  const newsletterForm = document.querySelector('.newsletter-form');
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Subscribed to Inspiration!', 'You will now receive our exclusive wedding decor trends and celebration guides!');
    newsletterForm.reset();
  });

  // Initial gallery list population
  updateActiveGalleryList();
});
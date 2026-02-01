document.addEventListener('DOMContentLoaded', () => {
    
    // ========== MOBILE MENU TOGGLE ==========
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('.nav-links a');
    const overlay = document.querySelector('.mobile-menu-overlay');

    if (mobileMenuToggle && nav) {
        const toggleMenu = () => {
            const isActive = nav.classList.contains('active');
            mobileMenuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
            document.body.style.overflow = !isActive ? 'hidden' : '';
        };

        mobileMenuToggle.addEventListener('click', toggleMenu);

        // Close menu when clicking on overlay
        if (overlay) {
            overlay.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                nav.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                nav.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // ========== NAVBAR SCROLL ANIMATION ==========
    const header = document.querySelector('header');
    let lastScroll = 0;
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Clear any existing timeout
        clearTimeout(scrollTimeout);
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
            
            // Hide navbar when scrolling down
            if (currentScroll > lastScroll && currentScroll > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                // Show navbar when scrolling up
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.classList.remove('scrolled');
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // ========== SCROLL ANIMATIONS (Intersection Observer) ==========
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 50); // Daha kısa delay
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Sadece önemli elementlere animasyon ekle (daha az element)
    const animatedElements = document.querySelectorAll('.stat-item, .service-card, .step-item, .about-content, .process-content, .faq-header');
    
    animatedElements.forEach((el) => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // ========== COUNTER ANIMATION (Stats) ==========
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const target = parseInt(entry.target.textContent.replace(/\D/g, ''));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                entry.target.classList.add('counted');
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        entry.target.textContent = Math.floor(current) + (entry.target.textContent.includes('%') ? '%' : '');
                        requestAnimationFrame(updateCounter);
                    } else {
                        entry.target.textContent = target + (entry.target.textContent.includes('%') ? '%' : '');
                    }
                };
                
                updateCounter();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));

    // ========== FAQ ACCORDION ==========
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Tüm FAQ'ları kapat
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Tıklanan FAQ'ı aç
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // ========== FORM SUBMISSION ==========
    const form = document.querySelector('.contact-form-area form');
    const submitBtn = document.querySelector('.btn-send');

    if (form && submitBtn) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Buton animasyonu
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Gönderiliyor...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;

            // Form verilerini al
            const formData = new FormData(form);
            console.log('Form Submitted:', Object.fromEntries(formData));

            // Simüle edilmiş gönderim
            setTimeout(() => {
                submitBtn.innerText = 'Gönderildi! ✓';
                submitBtn.style.backgroundColor = '#28a745';
                submitBtn.style.color = '#fff';
                
                form.reset();

                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.color = '';
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========== PARALLAX EFFECT FOR HERO (Kaldırıldı - layout shift'e neden oluyordu) ==========
    // Parallax efektini kaldırdık

    // ========== SERVICE CARD TILT EFFECT (Daha hafif) ==========
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20; // Daha az tilt
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.01)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ========== LOADING ANIMATION ==========
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // ========== CURSOR FOLLOW EFFECT (Optional) ==========
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid #ff0000;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        display: none;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.display = 'block';
    });

    // Hover efektleri için cursor
    const hoverElements = document.querySelectorAll('a, button, .service-card, .btn-outline');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = '#ff0000';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '#ff0000';
        });
    });
});
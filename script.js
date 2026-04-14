/* ============================================
   LIT LOOP LANDING PAGE — SCRIPTS
   ============================================ */

// ── Navbar scroll effect ─────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Mobile menu toggle ───────────────────
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

mobileToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    const spans = mobileToggle.querySelectorAll('span');
    if (menuOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.remove('open');
        const spans = mobileToggle.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
});

// ── Smooth scroll for anchor links ───────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ── Counter animation ────────────────────
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    counters.forEach(counter => {
        if (counter.dataset.animated) return;
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            counter.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
                counter.dataset.animated = 'true';
            }
        }
        requestAnimationFrame(updateCounter);
    });
}

// ── Scroll reveal animation ──────────────
function setupReveal() {
    // Add .reveal to element groups
    const revealSelectors = [
        '.feature-card',
        '.step-card',
        '.pricing-card',
        '.download-card',
        '.section-header'
    ];

    revealSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.1}s`;
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Trigger counters when hero stats are visible
                if (entry.target.closest('.hero') || entry.target.classList.contains('hero-stats')) {
                    animateCounters();
                }
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Also observe hero stats
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) animateCounters();
            });
        }, { threshold: 0.5 });
        statsObserver.observe(heroStats);
    }
}

// ── Init ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    setupReveal();
    // Trigger counter animation if already in view
    setTimeout(animateCounters, 800);
});

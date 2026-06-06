import { initThreeBackground } from './three-background.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

// 1. Initialize 3D Background as soon as DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initThreeBackground();

    // === TYPING ANIMATION ===
    const typedEl = document.getElementById('typed-text');
    if (typedEl) {
        const phrases = ['Python Developer', 'Frontend Developer', 'Full-Stack Developer', 'Data Analyst', 'AI / ML Enthusiast'];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            if (!typedEl) return;
            const current = phrases[phraseIndex];
            if (isDeleting) {
                typedEl.textContent = current.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typedEl.textContent = current.substring(0, charIndex + 1);
                charIndex++;
            }
            if (!isDeleting && charIndex === current.length) {
                setTimeout(() => { isDeleting = true; }, 1500);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
            const speed = isDeleting ? 60 : 100;
            setTimeout(type, speed);
        }
        type();
    }

    // === PARTICLE TRAIL ===
    const pCanvas = document.getElementById('particle-canvas');
    const pCtx = pCanvas.getContext('2d');
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
        pCanvas.width = window.innerWidth;
        pCanvas.height = window.innerHeight;
    });

    const particles = [];
    document.addEventListener('mousemove', (e) => {
        for (let i = 0; i < 3; i++) {
            particles.push({
                x: e.clientX,
                y: e.clientY,
                size: Math.random() * 5 + 1,
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2,
                life: 1.0,
                color: Math.random() > 0.5 ? '0, 240, 255' : '112, 0, 255'
            });
        }
    });

    function animateParticles() {
        pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.speedX;
            p.y += p.speedY;
            p.life -= 0.03;
            p.size *= 0.95;
            if (p.life <= 0) { particles.splice(i, 1); continue; }
            pCtx.beginPath();
            pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            pCtx.fillStyle = `rgba(${p.color}, ${p.life})`;
            pCtx.fill();
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // === ANIMATED COUNTERS (via ScrollTrigger) ===
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                let current = 0;
                const increment = target / 40;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) { el.textContent = target; clearInterval(timer); }
                    else { el.textContent = Math.floor(current); }
                }, 30);
            }
        });
    });

    // === THEME SWITCHER ===
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const themePanel = document.getElementById('theme-panel');
    const swatches = document.querySelectorAll('.theme-swatch');
    const root = document.documentElement;

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themePanel.classList.toggle('hidden');
    });

    document.addEventListener('click', () => themePanel.classList.add('hidden'));

    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    swatches.forEach(swatch => {
        swatch.addEventListener('click', (e) => {
            e.stopPropagation();
            const cyan = swatch.dataset.cyan;
            const purple = swatch.dataset.purple;

            // Update CSS variables live
            root.style.setProperty('--accent-cyan', cyan);
            root.style.setProperty('--accent-purple', purple);
            root.style.setProperty('--accent-cyan-glow', hexToRgba(cyan, 0.4));
            root.style.setProperty('--accent-purple-glow', hexToRgba(purple, 0.4));

            // Save to localStorage
            localStorage.setItem('theme-cyan', cyan);
            localStorage.setItem('theme-purple', purple);

            themePanel.classList.add('hidden');
        });
    });

    // Restore saved theme on load
    const savedCyan = localStorage.getItem('theme-cyan');
    const savedPurple = localStorage.getItem('theme-purple');
    if (savedCyan && savedPurple) {
        root.style.setProperty('--accent-cyan', savedCyan);
        root.style.setProperty('--accent-purple', savedPurple);
        root.style.setProperty('--accent-cyan-glow', hexToRgba(savedCyan, 0.4));
        root.style.setProperty('--accent-purple-glow', hexToRgba(savedPurple, 0.4));
    }

    // === NAVBAR SCROLL EFFECTS ===
    const nav = document.querySelector('.glass-nav');
    const progressBar = document.getElementById('scroll-progress');
    const navLinks = document.querySelectorAll('.nav-links li a');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;

        // 1. Scroll progress bar width
        if (progressBar) {
            progressBar.style.width = `${(scrollY / docH) * 100}%`;
        }

        // 2. Shrink navbar
        if (nav) {
            nav.classList.toggle('scrolled', scrollY > 60);
        }

        // 3. Active section highlight
        let current = '';
        sections.forEach(section => {
            if (scrollY >= section.offsetTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

});

function removePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
    // Start GSAP entrance animations matching the CSS fade time
    setTimeout(startEntranceAnimations, 300);
}

// Handle Preloader removal robustly
if (document.readyState === 'complete') {
    removePreloader();
} else {
    window.addEventListener('load', removePreloader);
}

function startEntranceAnimations() {
    const tl = gsap.timeline();
    
    tl.from('.glass-nav', {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    })
    .from('.hero .greeting', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out'
    }, '-=0.5')
    .from('.hero .name', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out'
    }, '-=0.3')
    .from('.hero .title', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out'
    }, '-=0.3')
    .from('.hero .summary', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out'
    }, '-=0.3')
    .from('.hero .cta-buttons', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out'
    }, '-=0.3');

    // 3. Scroll Animations for Sections
    const sections = document.querySelectorAll('.section-fade');
    
    // Skip the first section (hero/nav) as it's animated on load
    sections.forEach((section, index) => {
        if(section.classList.contains('hero') || section.classList.contains('glass-nav')) return;

        // Animate section title
        const title = section.querySelector('.section-title');
        if (title) {
            gsap.fromTo(title, 
                { x: -50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    x: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power3.out'
                }
            );
        }

        // Animate glass cards inside section
        const cards = section.querySelectorAll('.glass-card');
        if (cards.length > 0) {
            gsap.fromTo(cards, 
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: 'power3.out'
                }
            );
        }
    });

    // Refresh ScrollTriggers after setup
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);

    // 4. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Custom Cursor Logic
    const cursor = document.getElementById('custom-cursor');
    const cursorTrail = document.getElementById('cursor-trail');
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    // Listen to mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate update for the primary cursor
        if (cursor) {
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        }
    });

    // Smooth animation for the trail
    function animateTrail() {
        trailX += (mouseX - trailX) * 0.15; // smoothness factor
        trailY += (mouseY - trailY) * 0.15;
        
        if (cursorTrail) {
            cursorTrail.style.left = `${trailX}px`;
            cursorTrail.style.top = `${trailY}px`;
        }
        
        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // Hover effects for clickable elements
    const clickables = document.querySelectorAll('a, button, .btn');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor) cursor.classList.add('hovered');
            if (cursorTrail) cursorTrail.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            if (cursor) cursor.classList.remove('hovered');
            if (cursorTrail) cursorTrail.classList.remove('hovered');
        });
    });

    // 6. Flashlight & 3D Tilt effect on Glass Cards
    const glassCards = document.querySelectorAll('.glass-card');
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Flashlight coordinates
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // 3D Tilt Logic
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation (max 10 degrees)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            // Reset tilt and scale
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}

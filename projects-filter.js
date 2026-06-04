/**
 * projects-filter.js
 * Domain filter logic for projects.html
 * Uses GSAP for smooth card animations.
 */

import gsap from 'gsap';

document.addEventListener('DOMContentLoaded', () => {

    const cards      = document.querySelectorAll('.pj-card');
    const domainBtns = document.querySelectorAll('.domain-btn');
    const mobBtns    = document.querySelectorAll('.mob-filter-btn');
    const countEl    = document.getElementById('visible-count');
    const emptyState = document.getElementById('empty-state');

    let activeFilter = 'all';

    // ── Core filter function ──────────────────────────────────
    function applyFilter(filter) {
        activeFilter = filter;

        // Update sidebar buttons
        domainBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        // Update mobile buttons
        mobBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        let visibleCount = 0;

        cards.forEach(card => {
            const domains = card.dataset.domains ? card.dataset.domains.split(' ') : [];
            const isMatch = filter === 'all' || domains.includes(filter);

            if (isMatch) {
                visibleCount++;
                // Show card with GSAP entrance
                gsap.set(card, { display: 'flex' });
                gsap.fromTo(card,
                    { opacity: 0, y: 20, scale: 0.97 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out', delay: visibleCount * 0.06 }
                );
            } else {
                // Fade out then hide
                gsap.to(card, {
                    opacity: 0, y: 10, scale: 0.97, duration: 0.25, ease: 'power2.in',
                    onComplete: () => gsap.set(card, { display: 'none' })
                });
            }
        });

        // Update count chip
        if (countEl) countEl.textContent = visibleCount;

        // Show/hide empty state
        if (emptyState) {
            emptyState.classList.toggle('hidden', visibleCount > 0);
        }
    }

    // ── Sidebar button listeners ──────────────────────────────
    domainBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            applyFilter(btn.dataset.filter);
        });
    });

    // ── Mobile bar button listeners ───────────────────────────
    mobBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            applyFilter(btn.dataset.filter);
        });
    });

    // ── Initial entrance animation (all cards) ────────────────
    gsap.fromTo(cards,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.2 }
    );

    // ── Scroll progress bar (same as main site) ───────────────
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        if (progressBar) {
            const scrollY = window.scrollY;
            const docH = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = `${(scrollY / docH) * 100}%`;
        }
    });

    // ── Navbar shrink on scroll ───────────────────────────────
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
    });

});

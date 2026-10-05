// Shared script for index.html, login.html and registro.html.
// Every block checks that its elements exist, so it never breaks on pages that don't have them.
document.addEventListener('DOMContentLoaded', () => {
    const NAV_BREAKPOINT = 1100; // must match the @media (max-width: 1100px) in style.css

    /* ---------- Mobile menu ---------- */
    const burger = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (burger && navMenu) {
        const setMenu = (open) => {
            navMenu.classList.toggle('is-open', open);
            burger.classList.toggle('is-open', open);
            burger.setAttribute('aria-expanded', String(open));
            burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            document.body.classList.toggle('menu-open', open);
        };

        burger.addEventListener('click', () => setMenu(!navMenu.classList.contains('is-open')));
        navMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
        window.addEventListener('resize', () => {
            if (window.innerWidth > NAV_BREAKPOINT) setMenu(false);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setMenu(false);
        });
    }

    /* ---------- "How it works" switch (For Carriers / For Merchants) ---------- */
    document.querySelectorAll('[data-segmented]').forEach((group) => {
        const buttons = group.querySelectorAll('[data-panel]');
        const panels = document.querySelectorAll(`[data-panel-group="${group.dataset.segmented}"]`);

        buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
                buttons.forEach((b) => {
                    const active = b === btn;
                    b.classList.toggle('is-active', active);
                    b.setAttribute('aria-selected', String(active));
                });
                panels.forEach((panel) => {
                    panel.hidden = panel.dataset.panelId !== btn.dataset.panel;
                });
            });
        });
    });

    /* ---------- Role toggle (login / registro) ---------- */
    document.querySelectorAll('.toggle-container').forEach((container) => {
        const buttons = container.querySelectorAll('.toggle-btn');
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                buttons.forEach((btn) => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    });

    // registro.html?role=merchant → preselect "Merchant"
    const role = new URLSearchParams(window.location.search).get('role');
    if (role === 'merchant') {
        document.getElementById('btn-emprendedor')?.click();
    }

    /* ---------- Language switch (EN | ES) ---------- */
    // Visual state only for now; every switch on the page stays in sync.
    const langOptions = document.querySelectorAll('.lang-switch [data-lang]');
    langOptions.forEach((option) => {
        option.addEventListener('click', () => {
            const lang = option.dataset.lang;
            document.documentElement.lang = lang;
            langOptions.forEach((o) => {
                const on = o.dataset.lang === lang;
                o.classList.toggle('is-active', on);
                o.setAttribute('aria-pressed', String(on));
            });
        });
    });

    /* ---------- Testimonials slider (mobile) ---------- */
    const slider = document.querySelector('[data-slider]');
    const dots = document.querySelectorAll('[data-slider-dot]');

    if (slider && dots.length) {
        const cards = slider.children;
        const step = () => (cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : slider.clientWidth);

        slider.addEventListener('scroll', () => {
            const index = Math.round(slider.scrollLeft / step());
            dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
        }, { passive: true });

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => slider.scrollTo({ left: i * step(), behavior: 'smooth' }));
        });
    }

    /* ---------- Product video ---------- */
    // Add data-video-src="https://www.youtube.com/embed/VIDEO_ID" to .video-box to enable it.
    const videoBox = document.querySelector('.video-box');
    if (videoBox) {
        videoBox.addEventListener('click', () => {
            const src = videoBox.dataset.videoSrc;
            if (!src || videoBox.querySelector('iframe')) return;
            const iframe = document.createElement('iframe');
            iframe.src = `${src}${src.includes('?') ? '&' : '?'}autoplay=1`;
            iframe.title = 'Trazza – About the product';
            iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
            iframe.allowFullscreen = true;
            videoBox.appendChild(iframe);
        });
    }
});
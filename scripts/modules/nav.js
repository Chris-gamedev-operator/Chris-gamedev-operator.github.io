export function initNavigation() {
    const header = document.querySelector("header");
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");
    const currentChapter = document.getElementById("currentChapter");
    const navLinks = Array.from(document.querySelectorAll(".local-link"));

    if( navToggle && navMenu ) {
        navToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if(navMenu?.classList.contains("is-open")) {
                navMenu.classList.remove("is-open");
                navToggle?.setAttribute("aria-expanded", "false");
            }
        });
    });

    const sections = ["about","projects","skills"]
        .map((id) => document.getElementById(id))
        .filter(Boolean);
    
    if(!sections.length) return;

    const updateActiveSection = () => {
        const scrollY = window.scrollY;
        const marker = scrollY + window.innerHeight * 0.35;
        let activeId = sections[0].id;
        
        for(const sec of sections) {
            if( sec.offsetTop <= marker) activeId = sec.id;
        }

        if(window.innerHeight + scrollY >= document.documentElement.scrollHeight - 40) {
            activeId = sections[sections.length -1].id;
        }
        
        navLinks.forEach((link) => {
            const matches = link.getAttribute("href") === `#${activeId}` ;
            link.classList.toggle("is-active", matches);
            if( matches && currentChapter ) {
                currentChapter.textContent = link.dataset.label || link.textContent.trim();
            }
        });

        if (header) {
            if (window.scrollY > 140) header.classList.add("is-scrolled");
            else if (window.scrollY < 40) header.classList.remove("is-scrolled");
        }
    };

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection, { passive: true });
    updateActiveSection();
}
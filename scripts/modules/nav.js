export function initNavigation() {
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
        const marker = window.scrollY + 140;
        let activeId = sections[0].id;
        
        for(const sec of sections) {
            if( sec.offsetTop <= marker) activeId = sec.id;
        }

        navLinks.forEach((link) => {
            const matches = link.getAttribute("href") === `#${activeId}` ;
            link.classList.toggle("is-active", matches);
            if( matches && currentChapter ) {
                currentChapter.textContent = link.dataset.label || link.textContent.trim();
            }
        });

        window.addEventListener("scroll", updateActiveSection, {passive: true});
        updateActiveSection();
    }
}
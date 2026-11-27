/**
Rotating role and personal information.
 */

import { escapeHTML } from "./utils.js";

export function initIdentityRotation(roles, { onSelectSkill }) {
    const roleWheel = document.getElementById("roleWheel");
    const roleText = document.getElementById("roleText");
    const skillDetailBox = document.getElementById("skillDetailBox");

    if( !roleWheel || !roleText || !roles.length ) return;

    let index = 0;
    let paused = false;

    const render = (nextIndex) => {
        index = ((nextIndex % roles.length) + roles.length) % roles.length;
        roleText.textContent = `${roles[index].text}`;
    };

    render(0);

    if( roles.length > 1 ) {
        window.setInterval(() => {
            if( !paused ) render(index +1);
        }, 3200);
    }

    roleWheel.addEventListener("mouseenter", () => { paused = true; });
    roleWheel.addEventListener("mouseleave", () => { paused = false; });
    roleWheel.addEventListener("focus", () => { paused = true; });
    roleWheel.addEventListener("blur", () => { paused = false; });

    roleWheel.addEventListener(
        "wheel",
        (e) => {
            e.preventDefault();
            render(index + (e.deltaY > 0 ? 1 : -1 ));
        },
        { passive: false }
    );

    roleWheel.addEventListener("click", () => {
        const role = roles[index];
        if(!role) return;

        if(role.targetType === "skill" && role.targetId) {
            onSelectSkill(role.targetId, true);
        } else {
            if(skillDetailBox) {
                skillDetailBox.innerHTML = `
                    <div class="detail-title">${escapeHTML(role.text)}</div>
                    <p>${escapeHTML(role.note)}</p>
                `;
            }
            document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
        }
    });
}
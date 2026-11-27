import { escapeAttr, escapeHTML } from "./utils.js";

export function createSkillsController(skillGroups, projects, { onHighlightChange, onJumpToProject }) {
    const container = document.getElementById("skillsContainer");
    const detailBox = document.getElementById("skillDetailBox");
    let activeSkillId = null;

    const findSkill = (id) => {
        for(const group of skillGroups) {
            const found = (group.items || []).find((item) => item.id === id);
            if(found) return found;
        }
        return null;
    };

    const render = () => {
        if( !container ) return;
        container.innerHTML = "" ;

        skillGroups.forEach((group) => {
            const groupEl = document.createElement("div");
            groupEl.className = "skill-group";
            groupEl.innerHTML = `<h3 class="skill-group-title">${escapeHTML(group.category)}</h3>`;

            const chips = document.createElement("div");
            chips.className = "skill-chips";

            (group.items || []).forEach((item) => {
                const btn = document.createElement("button");
                btn.className = `skill-chip ${activeSkillId === item.id ? "is-active" : ""}`;
                btn.textContent = item.label ;
                btn.addEventListener("click" , () => selectSkill(item.id, false));
                chips.appendChild(btn);
            });
            groupEl.appendChild(chips);
            container.appendChild(groupEl);
        });
    };

    const selectSkill = (skillId, shouldScroll = false) => {
        const skill = findSkill(skillId);
        if( !skill ) return ;

        if( activeSkillId === skill.id && !shouldScroll ) {
            activeSkillId = null;
            render();
            onHighlightChange(new Set());
            if( detailBox ) detailBox.innerHTML = "";
            return;
        }
        
        activeSkillId = skill.id;
        render();
        onHighlightChange(new Set(skill.projects || []));

        if(detailBox) {
            const projectButtons = (skill.projects || [])
                .map((pid) => projects.find((p) => p.id === pid))
                .filter(Boolean)
                .map(
                    (p) => `<button type="button" class="inline-project-jump" data-jump="${escapeAttr(p.id)}">${escapeHTML(p.title)}</button>`
                )
                .join(" ");

            detailBox.innerHTML = `
                <div class="detail-title">${escapeHTML(skill.label)}</div>
                <p>${escapeHTML(skill.summary)}</p>
                <div class="detail-projects">
                    <span>Evidence in projects:</span>
                    ${projectButtons || "<span>None listed, yet. Or because it is personal.</span>"}
                </div>
            `;

            detailBox.querySelectorAll("[data-jump]").forEach((btn) => {
                btn.addEventListener("click", () => onJumpToProject(btn.dataset.jump));
            });
        }

        if(shouldScroll) {
            document.getElementById("skills")?.scrollIntoView({ behavior: "smooth"});
        }
    };

    render();
    return { selectSkill };
}
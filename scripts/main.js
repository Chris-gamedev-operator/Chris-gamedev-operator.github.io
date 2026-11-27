/**
 * Entry point for the deployment of module scripts
 */

import { initNavigation } from "./modules/nav.js";
import { initIdentityRotation } from "./modules/rotator.js";
import { createProjectsController } from "./modules/projects.js";
import { createSkillsController } from "./modules/skills.js";

const DATA = window.PORTFOLIO_DATA || {
    identityRoles: [],
    skillGroups: [],
    projects: []
};

initNavigation();

const projectsCtrl = createProjectsController(DATA.projects);

const skillsCtrl = createSkillsController(DATA.skillGroups, DATA.projects, {
    onHighlightChange: (idSet) => projectsCtrl.setHighlightedProjects(idSet),
    onJumpToProject: (projectId) => {
        projectsCtrl.selectProject(projectId, true);
        document.getElementById("projects")?.scrollIntoView({behavior: "smooth"});
    }
});

initIdentityRotation(DATA.identityRoles, {
    onSelectSkill: (skillId, shouldScroll) => skillsCtrl.selectSkill(skillId, shouldScroll)
});
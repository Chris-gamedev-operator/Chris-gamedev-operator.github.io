/**
 * Portfolio Data Schema + Blank Templates
 */

window.PORTFOLIO_DATA = window.PORTFOLIO_DATA || {
    identityRoles: [],
    skillGroups: [],
    projects: []
};

/**
TEMPLATE: Identity Role
{
    text: "",           // e.g. "Game Developer"
    targetType: "",     // "skill" | "personal"
    targetId: "",       // mathing skill item id or personal note id
    note: ""            // short line shown when inspected
}

TEMPLATE: Skill Group + Skill Item
{
    category: "",       // e.g. "Core Systems"
    items: [
        {
            id: "",             // kebab-case unique id, e.g. "state-machines"
            label: "",          // display label, e.g. "Custom State Machine"
            summary: "",        // explanation of how/where it is applied
            projects: []        // array of project ids, e.g. ["towerup", "luzzbiteyear"]
        }
    ]
}

TEMPLATE: Project Entry
{
  id: "",            // kebab-case id matching media/img/<id>/
  title: "",         // display title
  role: "",          // role & ownership context
  hook: "",          // 1-2 sentence hook for the tab display
  repoUrl: "",       // GitHub repository URL
  itchUrl: "",       // optional itch.io URL (omit or leave "" if unused)
  notesFile: "",     // path to ./data/<project>.md
  thumb: "",         // "./media/img/<id>/Thumb.png"
  screenshots: [],   // ["./media/img/<id>/screenshots/<name>_01.png", ...]
  techshots: []      // ["./media/img/<id>/techshots/<name>_01.png", ...]
}
 */
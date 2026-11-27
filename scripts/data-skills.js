/**
 * Capability Matrix + Project Evidence Links
 */

PORTFOLIO_DATA.skillGroups = [
    {
        category: "Core Systems + Architecture",
        items: [
            {
                id: "state-machines",
                label: "Customa State Machine",
                summary: "Modular C# state controllers and state classes for player traversal and enemy behavior loops.",
                projects: ["luzzbiteyear", "towerup", "canary-grave"]
            },

            {
                id: "decoupled-architecture",
                label: "ScriptableObject Events + Pooling",
                summary: "Asset-driven event channels and object pooling to reduce coupling, GC spikes, and runtime stutter",
                projects: ["luzzbiteyear", "canary-grave", "space7"]
            }

            /** INSERT NEXT ITEM ENTRY HERE */
        ]
    },

    {
        category: "Gameplay + Tooling + Collaboration",
        items: [
            {
                id: "editor-tooling",
                label: "Custom Editor & Placement Systems",
                summary: "Blender-inspired editor array tool and real time spatial building placement validation",
                projects: ["space7", "towerup"]
            },

            {
                id: "team-workflow",
                label: "Cross-Discipline + Audio/VFX Hooks",
                summary: "Integrating SFX/VFX triggers, animator state hooks, and shared infrastructure across team repositories",
                projects: ["space7", "luzzbiteyear", "canary-grave"]
            }
        ]
    }

    /** INSERT NEXT CATEGORY ENTRY HERE */
];
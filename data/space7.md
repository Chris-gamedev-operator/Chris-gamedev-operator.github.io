# Space7 — Contribution & Architecture Notes

**Role:** Project Lead & Programming Lead  
**Tech Stack:** Unity, C#  
**Repository:** [Chris-gamedev-operator/SpaceY7](https://github.com/Chris-gamedev-operator/SpaceY7)

> *Note: Earlier commits and script headers in this repository appear under my previous GitHub handle (`Chris-gme-DM`).*

---

## Scope & Ownership
Team of 9 people of different departments, we worked it all out together and split our responsibilites.
Led project direction and core software architecture across the repository, foundational gameplay systems, e.g. [player controls](https://github.com/Chris-gamedev-operator/SpaceY7/blob/main/Assets/Scripts/PlayerControls/PlayerController.cs), [building system](https://github.com/Chris-gamedev-operator/SpaceY7/blob/main/Assets/Scripts/BuildingSystem/BuildingManager.cs) and more.

## Key Systems Built
* **Control Mode Switching (Exploration vs. Building):** Designed and implemented state/input transitions allowing seamless switching between player exploration controls and construction/building controls without conflicting input bindings or camera/interaction states.
* **Real-Time Building & Spatial Placement Validation:** Built the [building placement system](https://github.com/Chris-gamedev-operator/SpaceY7/blob/main/Assets/Scripts/BuildingSystem/BuildingManager.cs)—rendering a live preview of the target structure in world space and evaluating placement validity in real time before instantiation.
* **Core Systems & Shared Infrastructure:** Developed the underlying gameplay utilities, state flow, and shared architecture supporting the [colleagues](https://github.com/cosmicXgoblin)'s feature work.

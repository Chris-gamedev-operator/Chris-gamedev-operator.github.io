# TowerUp — Contribution & Architecture Notes

**Role:** Solo Developer (School Project — expanded beyond baseline requirements)  
**Tech Stack:** Unity 6, C#, Unity Input System, Blender, Adobe Substance Painter  
**Repository:** [Chris-gamedev-operator/TowerUp](https://github.com/Chris-gamedev-operator/TowerUp)

> *Note: Earlier commits and script headers in this repository appear under my previous GitHub handle (`Chris-gme-DM`).*

---

## Scope & Ownership
Designed and built the complete first-person traversal prototype solo—covering player movement physics, custom state-machine architecture, interaction mechanics, custom 3D assets, and Unity Editor tooling.

## Key Systems Built
* **Custom State Machine (`StateController` & Abstract `State` Classes):** Implemented a modular state machine that evaluates player inputs and spatial context each frame to dispatch transitions across movement and traversal states cleanly.
* **Physics-Based First-Person Traversal & Stamina:** Built force-driven `Rigidbody` movement wired to the Unity 6 Input System, supporting angle-dependent **wallrunning** and **wallclimbing** paired with a stamina system that drains during active wall traversal and regenerates in grounded/standard states.
* **Blender-Style `ArrayModifier` Editor Tool:** Created a Unity Editor script to duplicate and arrange modular level prefabs along configurable offsets from a floor origin point, accelerating scene assembly.
* **Interactables & Custom Asset Pipeline:** Built credit-chip collection, switch-to-door unlock logic, and custom 3D models/textures in Blender and Adobe Substance Painter.

## Technical Takeaways
* Simplified an early over-scoped interaction collector into clean `ScriptableObject`-driven interactables, keeping gameplay logic decoupled and reliable within project deadlines.
* Identified improvements for future iterations, including tighter field encapsulation and modular prefab grouping for level hierarchies.
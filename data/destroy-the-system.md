# Destroy the System (Canary Grave) — Contribution & Architecture Notes

**Role:** Systems & AI Programmer (Game Jam Team Project)  
**Tech Stack:** Unity, C#, Object Pooling, Unity Animator 
**Playable Build (itch.io):** [Canary Grave — panpoleon on itch.io](https://panpoleon.itch.io/canarygrave)
**Repository:** [Keradean/Destroy-the-System](https://github.com/Keradean/Destroy-the-System)

> *Note: Earlier commits and script headers in this repository appear under my previous GitHub handle (`Chris-gme-DM`).*

---

## Scope & Ownership
Owned the enemy gameplay architecture, runtime performance pooling, audio trigger integration, and technical coordination for character/model integration under tight game-jam constraints.

## Key Systems Built
* **Enemy State Machine & Behavior Loop:** Designed and implemented enemy AI states (detection, pursuit, attack, and state transitions) to drive responsive combat encounters.
* **Object Pooling System:** Built reusable object pooling for frequently spawned runtime entities/projectiles to avoid instantiation spikes and garbage collection stutter during active combat.
* **SFX Integration & Event Hooks:** Wired sound-effect triggers cleanly into enemy actions, state changes, and gameplay feedback events.
* **Model & Animator Integration Pipeline:** Provided technical direction for rigging/importing character models and configuring Unity Animator controllers/transitions so art assets integrated smoothly with enemy state logic.

## Technical Takeaways
* Keeping enemy behavior states cleanly separated from animation parameters prevented merge conflicts and allowed art and code workflows to progress in parallel during the jam.
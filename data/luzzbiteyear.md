# LuzzBiteyear — Contribution & Architecture Notes

**Role:** Systems & Infrastructure Programmer (Team Project)  
**Tech Stack:** Unity, C#, ScriptableObject Event Architecture, Object Pooling  
**Repository:** [PenguPixel/LuzzBiteyear_Game](https://github.com/PenguPixel/LuzzBiteyear_Game)

> *Note: Earlier commits and script headers in this repository appear under my previous GitHub handle (`Chris-gme-DM`).*

---

## Scope & Ownership
Built the decoupled communication backbone, runtime pooling infrastructure, audio/VFX playback systems, and third-party package/model integration supporting the team's feature development. Built component classes and Enemy AI (classes, StateMachineBehaviours, animations integration). Prepared levellayout with prefabs we integrated from our 3D- and UI- Artists.

## Key Systems Built
* **ScriptableObject Event & Data Architecture:** Implemented asset-based `ScriptableObject` event channels and shared configuration assets so gameplay systems, UI, and audio could react to events without hard scene references or tight coupling.
* **Object Pooling Infrastructure:** Created centralized pooling for recurring gameplay objects and effects to keep frame times stable.
* **Audio & VFX Integration:** Built modular triggers connecting gameplay events to sound effects and visual particle feedback.
* **Package & Asset Integration:** Managed Unity package setup and 3D model integration across the project, keeping scenes and prefabs consistent for teammates.

## Technical Takeaways
* Using `ScriptableObject` event channels eliminated brittle singleton dependencies and allowed multiple team members to hook into gameplay events independently without breaking each other's prefabs.
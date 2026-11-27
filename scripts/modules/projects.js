import { escapeHTML, escapeAttr, renderBasicMarkdown } from "./utils.js";

export function createProjectsController(projects) {
    const tabsEl = document.getElementById("projectTabs");
    const viewerEl = document.getElementById("projectViewer");

    let activeProjectId = projects[0]?.id || null;
    let galleryCategory = "screenshots"; // "screenshots" | "techshots"
    let imageIndex = 0;
    let highlightedIds = new Set();
    let shuffleTimer = null;
    const markdownCache = new Map();

    // Ensure a shared wrapper exists around #projectTabs and #projectViewer for >1600px blade layout
    if (tabsEl && viewerEl && tabsEl.parentElement === viewerEl.parentElement && !tabsEl.parentElement.classList.contains("projects-deck")) {
        const deck = document.createElement("div");
        deck.className = "projects-deck";
        tabsEl.parentNode.insertBefore(deck, tabsEl);
        deck.appendChild(tabsEl);
        deck.appendChild(viewerEl);
    }

    // Create reusable Lightbox modal once
    let lightboxEl = document.getElementById("mediaLightbox");
    if (!lightboxEl) {
        lightboxEl = document.createElement("div");
        lightboxEl.id = "mediaLightbox";
        lightboxEl.className = "media-lightbox";
        lightboxEl.setAttribute("role", "dialog");
        lightboxEl.setAttribute("aria-modal", "true");
        lightboxEl.hidden = true;
        lightboxEl.innerHTML = `
            <div class="lightbox-backdrop" data-close-lightbox></div>
            <div class="lightbox-frame">
                <div class="lightbox-bar">
                    <span class="lightbox-caption" id="lightboxCaption"></span>
                    <div class="lightbox-controls">
                        <button type="button" class="pager-btn" id="lbPrevBtn" aria-label="Previous image">◀</button>
                        <span class="pager-count" id="lbCount"></span>
                        <button type="button" class="pager-btn" id="lbNextBtn" aria-label="Next image">▶</button>
                        <button type="button" class="mode-btn" data-close-lightbox>CLOSE [ESC]</button>
                    </div>
                </div>
                <div class="lightbox-stage">
                    <img id="lightboxImg" src="" alt="Expanded project screenshot" />
                </div>
            </div>
        `;
        document.body.appendChild(lightboxEl);

        lightboxEl.querySelectorAll("[data-close-lightbox]").forEach((el) => {
            el.addEventListener("click", () => closeLightbox());
        });

        document.addEventListener("keydown", (e) => {
            if (lightboxEl.hidden) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") stepLightbox(-1);
            if (e.key === "ArrowRight") stepLightbox(1);
        });

        document.getElementById("lbPrevBtn")?.addEventListener("click", () => stepLightbox(-1));
        document.getElementById("lbNextBtn")?.addEventListener("click", () => stepLightbox(1));
    }

    const getProject = (id) => projects.find((p) => p.id === id) || projects[0] || null;

    const syncLightboxContent = () => {
        const project = getProject(activeProjectId);
        const mediaList = Array.isArray(project?.[galleryCategory]) ? project[galleryCategory] : [];
        const src = mediaList[imageIndex];
        if (!src) return;

        const img = document.getElementById("lightboxImg");
        const cap = document.getElementById("lightboxCaption");
        const cnt = document.getElementById("lbCount");
        if (img) img.src = src;
        if (cap) cap.textContent = src;
        if (cnt) cnt.textContent = `${imageIndex + 1} / ${mediaList.length}`;
    };

    const openLightbox = () => {
        const project = getProject(activeProjectId);
        const mediaList = Array.isArray(project?.[galleryCategory]) ? project[galleryCategory] : [];
        if (!mediaList.length) return;
        syncLightboxContent();
        lightboxEl.hidden = false;
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        lightboxEl.hidden = true;
        document.body.style.overflow = "";
    };

    const stepLightbox = (delta) => {
        const project = getProject(activeProjectId);
        const mediaList = Array.isArray(project?.[galleryCategory]) ? project[galleryCategory] : [];
        if (!mediaList.length) return;
        imageIndex = (imageIndex + delta + mediaList.length) % mediaList.length;
        renderViewer(project);
        syncLightboxContent();
    };

    const renderTabs = () => {
        if (!tabsEl) return;
        tabsEl.innerHTML = "";

        projects.forEach((project, idx) => {
            const isActive = project.id === activeProjectId;
            const isHighlighted = highlightedIds.has(project.id);

            const tab = document.createElement("button");
            tab.type = "button";
            tab.role = "tab";
            tab.className = [
                "project-tab",
                isActive ? "is-active" : "",
                isHighlighted ? "is-highlighted" : ""
            ].filter(Boolean).join(" ");
            tab.setAttribute("aria-selected", String(isActive));

            const slotCode = String(idx + 1).padStart(2, "0");

            tab.innerHTML = `
                <div class="tab-spine" aria-hidden="true">
                    <span class="spine-index">[${slotCode}]</span>
                    <span class="spine-title">${escapeHTML(project.title)}</span>
                    <span class="spine-status">${isActive ? "ACTIVE" : "OPEN"}</span>
                </div>
                <div class="tab-card-body">
                    <div class="tab-thumb-wrap">
                        <img src="${escapeAttr(project.thumb)}" alt="${escapeAttr(project.title)} thumbnail" class="tab-thumb" loading="lazy" />
                        <span class="tab-thumb-fallback">[ NO_THUMB ]</span>
                    </div>
                    <div class="tab-meta">
                        <div class="tab-title">${escapeHTML(project.title)}</div>
                        <div class="tab-role">${escapeHTML(project.role)}</div>
                        <p class="tab-hook">${escapeHTML(project.hook)}</p>
                    </div>
                </div>
            `;

            const img = tab.querySelector("img");
            img?.addEventListener("error", () => {
                tab.querySelector(".tab-thumb-wrap")?.classList.add("is-missing");
                img.remove();
            });

            tab.addEventListener("click", () => selectProject(project.id, true));
            tabsEl.appendChild(tab);
        });
    };

    const loadMarkdown = async (notesFile) => {
        if (!notesFile) return "*No contribution notes file specified.*";
        if (markdownCache.has(notesFile)) return markdownCache.get(notesFile);

        try {
            const res = await fetch(notesFile);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = await res.text();
            markdownCache.set(notesFile, text);
            return text;
        } catch {
            return `> **Note:** Could not fetch \`${notesFile}\` directly in this context (expected over \`file://\`; works via Live Server or GitHub Pages).`;
        }
    };

    const renderViewer = async (project) => {
        if (!viewerEl || !project) return;

        const mediaList = Array.isArray(project[galleryCategory]) ? project[galleryCategory] : [];
        if (imageIndex >= mediaList.length) imageIndex = 0;
        const currentImage = mediaList[imageIndex] || null;

        viewerEl.innerHTML = `
            <div class="viewer-top">
                <div>
                    <div class="viewer-kicker">// ACTIVE_PROJECT_DOSSIER</div>
                    <h3 class="viewer-title">${escapeHTML(project.title)}</h3>
                    <div class="viewer-role">${escapeHTML(project.role)}</div>
                </div>
                <div class="viewer-actions">
                    <a href="${escapeAttr(project.repoUrl)}" target="_blank" rel="noopener" class="viewer-link">GitHub Repo ↗</a>
                    ${project.itchUrl ? `<a href="${escapeAttr(project.itchUrl)}" target="_blank" rel="noopener" class="viewer-link">itch.io Page ↗</a>` : ""}
                    ${project.notesFile ? `<a href="${escapeAttr(project.notesFile)}" target="_blank" rel="noopener" class="viewer-link">Raw .md ↗</a>` : ""}
                </div>
            </div>

            <div class="viewer-grid">
                <div class="gallery-panel">
                    <div class="gallery-controls">
                        <div class="mode-switch" role="group" aria-label="Media category">
                            <button type="button" class="mode-btn ${galleryCategory === "screenshots" ? "is-active" : ""}" data-mode="screenshots">
                                Screenshots (${(project.screenshots || []).length})
                            </button>
                            <button type="button" class="mode-btn ${galleryCategory === "techshots" ? "is-active" : ""}" data-mode="techshots">
                                Techshots (${(project.techshots || []).length})
                            </button>
                        </div>
                        <div class="pager-controls">
                            <button type="button" class="pager-btn" id="expandShotBtn" ${!currentImage ? "disabled" : ""} title="Expand image">EXPAND ⤢</button>
                            <button type="button" class="pager-btn" id="prevShotBtn" ${mediaList.length <= 1 ? "disabled" : ""}>◀</button>
                            <span class="pager-count">${mediaList.length ? `${imageIndex + 1} / ${mediaList.length}` : "0 / 0"}</span>
                            <button type="button" class="pager-btn" id="nextShotBtn" ${mediaList.length <= 1 ? "disabled" : ""}>▶</button>
                        </div>
                    </div>

                    <div class="gallery-stage ${currentImage ? "is-zoomable" : ""}" id="galleryStage">
                        ${
                            currentImage
                                ? `<img src="${escapeAttr(currentImage)}" alt="${escapeAttr(project.title)} ${escapeAttr(galleryCategory)}" class="gallery-img" />`
                                : `<div class="gallery-empty">No ${escapeHTML(galleryCategory)} listed yet for <code>${escapeHTML(project.id)}</code>.</div>`
                        }
                    </div>
                    ${currentImage ? `<div class="gallery-caption"><code>${escapeHTML(currentImage)}</code> — click image to inspect full-size</div>` : ""}
                </div>

                <div class="notes-panel">
                    <div class="notes-header">// CONTRIBUTION_NOTES (${escapeHTML(project.notesFile || "none")})</div>
                    <div class="notes-content" id="notesContent">Loading notes...</div>
                </div>
            </div>
        `;

        const stageImg = viewerEl.querySelector(".gallery-img");
        stageImg?.addEventListener("error", (e) => {
            const box = document.createElement("div");
            box.className = "gallery-empty";
            box.innerHTML = `Could not load <code>${escapeHTML(currentImage)}</code>.`;
            e.target.replaceWith(box);
        });

        stageImg?.addEventListener("click", () => openLightbox());
        document.getElementById("expandShotBtn")?.addEventListener("click", () => openLightbox());

        viewerEl.querySelectorAll(".mode-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                galleryCategory = btn.dataset.mode;
                imageIndex = 0;
                renderViewer(project);
            });
        });

        document.getElementById("prevShotBtn")?.addEventListener("click", () => {
            if (!mediaList.length) return;
            imageIndex = (imageIndex - 1 + mediaList.length) % mediaList.length;
            renderViewer(project);
        });

        document.getElementById("nextShotBtn")?.addEventListener("click", () => {
            if (!mediaList.length) return;
            imageIndex = (imageIndex + 1) % mediaList.length;
            renderViewer(project);
        });

        const notesEl = document.getElementById("notesContent");
        const rawMd = await loadMarkdown(project.notesFile);
        if (notesEl && activeProjectId === project.id) {
            notesEl.innerHTML = renderBasicMarkdown(rawMd);
        }
    };

    const runShuffle = (project) => {
        if (shuffleTimer !== null) window.clearInterval(shuffleTimer);
        const glyphs = "01X#/\\[]<>_";
        const target = project.title;
        let ticks = 0;

        renderViewer(project);
        const titleNode = viewerEl?.querySelector(".viewer-title");

        shuffleTimer = window.setInterval(() => {
            ticks += 1;
            if (titleNode) {
                titleNode.textContent = target
                    .split("")
                    .map((ch, idx) => (ch === " " || idx < ticks ? ch : glyphs[Math.floor(Math.random() * glyphs.length)]))
                    .join("");
            }
            if (ticks >= target.length + 2) {
                window.clearInterval(shuffleTimer);
                shuffleTimer = null;
                if (titleNode) titleNode.textContent = target;
            }
        }, 28);
    };

    const selectProject = (projectId, shuffle = false) => {
        const project = getProject(projectId);
        if (!project) return;
        activeProjectId = project.id;
        imageIndex = 0;
        renderTabs();
        shuffle ? runShuffle(project) : renderViewer(project);
    };

    const setHighlightedProjects = (idSet) => {
        highlightedIds = idSet;
        renderTabs();
    };

    renderTabs();
    if (activeProjectId) renderViewer(getProject(activeProjectId));

    return { selectProject, setHighlightedProjects };
}
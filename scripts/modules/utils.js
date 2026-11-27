export function escapeHTML(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
}

export function escapeAttr(str) {
    return escapeHTML(str).replace(/'/g, "&#39;");
}

function formatInline(text) {
    return escapeHTML(text)
        .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|[^\s)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener">$1</a>'
        )
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>")
        .replace(/`([^`]+)`/g, "<code>$1</code>");
}

export function renderBasicMarkdown(md) {
    const lines = md.replace(/\r\n/g, "\n").split("\n");
    const out = [];
    let inList = false;
    let inQuote = false;

    const closeBlocks = () => {
        if(inList) { out.push("</ul>"); inList = false; }
        if(inQuote) { out.push("</blockquote>"); inQuote = false; }
    };

    for(const rawLine of lines) {
        const line = rawLine.trim();
        if(!line || line === "---") {
            closeBlocks();
            if(line === "---") out.push("<hr />");
            continue;
        }

    if (line.startsWith("### ")) { closeBlocks(); out.push(`<h4>${formatInline(line.slice(4))}</h4>`); }
        else if (line.startsWith("## ")) { closeBlocks(); out.push(`<h3>${formatInline(line.slice(3))}</h3>`); }
        else if (line.startsWith("# ")) { closeBlocks(); out.push(`<h2>${formatInline(line.slice(2))}</h2>`); }
        else if (line.startsWith("> ")) {
        if (!inQuote) { closeBlocks(); out.push("<blockquote>"); inQuote = true; }
        out.push(`<p>${formatInline(line.slice(2))}</p>`);
        } else if (line.startsWith("* ") || line.startsWith("- ")) {
        if (!inList) { closeBlocks(); out.push("<ul>"); inList = true; }
        out.push(`<li>${formatInline(line.slice(2))}</li>`);
        } else {
        closeBlocks();
        out.push(`<p>${formatInline(line)}</p>`);
        }
    }
    closeBlocks();
    return out.join("\n");
}
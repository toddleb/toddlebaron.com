// src/engine/shell.ts
// Interactive console shell — command parser, cwd state, handler registry
// Side effects (xeyes, doom) dispatch CustomEvents to keep this module pure

import { filesystem, type FMFolder, type FMFile } from "../data/filesystem";
import { fortunes } from "../data/fortunes";

let cwd = "/home/todd";

type CommandResult =
  | { type: "output"; html: string }
  | { type: "clear" }
  | { type: "event"; name: string; detail?: unknown };

// Resolve a path (absolute or relative) against cwd
function resolvePath(input: string): string {
  if (input.startsWith("/")) return normalizePath(input);
  const parts = cwd.split("/").filter(Boolean);
  for (const seg of input.split("/")) {
    if (seg === "." || seg === "") continue;
    if (seg === "..") { parts.pop(); continue; }
    parts.push(seg);
  }
  return "/" + parts.join("/");
}

function normalizePath(p: string): string {
  const parts: string[] = [];
  for (const seg of p.split("/")) {
    if (seg === "." || seg === "") continue;
    if (seg === "..") { parts.pop(); continue; }
    parts.push(seg);
  }
  return "/" + parts.join("/");
}

// Navigate the filesystem tree by path
function findNode(path: string): FMFolder | FMFile | null {
  const resolved = resolvePath(path);
  if (resolved === "/home/todd" || resolved === "/home/todd/") return filesystem;

  const rel = resolved.replace("/home/todd/", "").replace("/home/todd", "");
  if (!rel) return filesystem;

  const segments = rel.split("/").filter(Boolean);
  let current: FMFolder = filesystem;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i].toLowerCase();
    const isLast = i === segments.length - 1;

    // Check children (folders)
    const childFolder = current.children?.find(
      (c) => c.label.toLowerCase() === seg || c.id.toLowerCase() === seg
    );
    if (childFolder) {
      if (isLast) return childFolder;
      current = childFolder;
      continue;
    }

    // Check files
    if (isLast) {
      const file = current.files?.find(
        (f) => f.label.toLowerCase() === seg || f.id.toLowerCase() === seg
      );
      if (file) return file;
    }

    return null;
  }
  return current;
}

function isFolder(node: FMFolder | FMFile): node is FMFolder {
  return "children" in node || ("files" in node && !("description" in node));
}

// Escape HTML for safe display
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Command handlers
const commands: Record<string, (args: string) => CommandResult> = {
  help() {
    return {
      type: "output",
      html: `<span style="color:#70D8F0">Available commands:</span>
  help            Show this help
  ls [dir]        List directory contents
  cd &lt;dir&gt;        Change directory
  pwd             Print working directory
  cat &lt;file&gt;      Show file description
  whoami          Print current user
  clear           Clear the console
  echo &lt;text&gt;     Print text
  neofetch        System information
  motd            Show welcome message
  fortune         Random tech quote
  uptime          How long Todd's been building
  man todd        The man page
  make coffee     Brew a fresh cup
  deploy godzilla Attempt kaiju deployment
  mail            Contact info
  sudo &lt;cmd&gt;      Try your luck
  cowsay &lt;msg&gt;    ASCII cow says your message
  xeyes           Launch xeyes (easter egg)
  doom            Launch DOOM (easter egg)
  killall &lt;app&gt;   Kill a running application`,
    };
  },

  ls(args: string) {
    const target = args.trim() || ".";
    const node = findNode(target === "." ? cwd : target);
    if (!node) return { type: "output", html: `<span style="color:#FF6666">ls: cannot access '${esc(target)}': No such file or directory</span>` };
    if (!isFolder(node)) return { type: "output", html: esc((node as FMFile).label) };

    const folder = node as FMFolder;
    const entries: string[] = [];
    if (folder.children) {
      for (const child of folder.children) {
        entries.push(`<span style="color:#70D8F0;font-weight:bold">${esc(child.label)}/</span>`);
      }
    }
    if (folder.files) {
      for (const file of folder.files) {
        entries.push(esc(file.label));
      }
    }
    return { type: "output", html: entries.join("  ") || "<span style='color:#888'>empty</span>" };
  },

  cd(args: string) {
    const target = args.trim() || "/home/todd";
    if (target === "~" || target === "") {
      cwd = "/home/todd";
      return { type: "output", html: "" };
    }
    const resolved = resolvePath(target);
    const node = findNode(target);
    if (!node || !isFolder(node)) {
      return { type: "output", html: `<span style="color:#FF6666">cd: ${esc(target)}: Not a directory</span>` };
    }
    cwd = resolved;
    return { type: "output", html: "" };
  },

  pwd() {
    return { type: "output", html: esc(cwd) };
  },

  cat(args: string) {
    const target = args.trim();
    if (!target) return { type: "output", html: `<span style="color:#FF6666">cat: missing operand</span>` };
    const node = findNode(target);
    if (!node) return { type: "output", html: `<span style="color:#FF6666">cat: ${esc(target)}: No such file or directory</span>` };
    if (isFolder(node)) return { type: "output", html: `<span style="color:#FF6666">cat: ${esc(target)}: Is a directory</span>` };
    const file = node as FMFile;
    let out = `<span style="color:#70D8F0">${esc(file.label)}</span>`;
    if (file.description) out += `\n${esc(file.description)}`;
    if (file.date) out += `\n<span style="color:#888">Date: ${esc(file.date)}</span>`;
    if (file.size) out += `\n<span style="color:#888">Type: ${esc(file.size)}</span>`;
    if (file.url) out += `\n<span style="color:#888">URL: </span><a href="${esc(file.url)}" target="_blank" style="color:#E8891E">${esc(file.url)}</a>`;
    return { type: "output", html: out };
  },

  whoami() {
    return { type: "output", html: "todd" };
  },

  clear() {
    return { type: "clear" };
  },

  echo(args: string) {
    return { type: "output", html: esc(args) };
  },

  neofetch() {
    return {
      type: "output",
      html: `<span style="color:#3BB8D0">        ___
       /   \\
      / SGI \\
     /       \\
    /_________\\</span>
  <span style="color:#E8891E">OS:</span> IRIX 6.5.30
  <span style="color:#E8891E">Host:</span> SGI Indigo2 IMPACT
  <span style="color:#E8891E">Kernel:</span> IRIX64 6.5
  <span style="color:#E8891E">Shell:</span> csh 6.17
  <span style="color:#E8891E">Resolution:</span> 1280x1024
  <span style="color:#E8891E">WM:</span> 4Dwm (Indigo Magic)
  <span style="color:#E8891E">CPU:</span> MIPS R10000 @ 195MHz
  <span style="color:#E8891E">GPU:</span> IMPACT (Max IMPACT)
  <span style="color:#E8891E">Memory:</span> 512KB / 256MB`,
    };
  },

  motd() {
    return {
      type: "output",
      html: `<span style="color:#70D8F0">Welcome to toddlebaron.com — IRIX 6.5 on Indigo2 IMPACT</span>

Type 'help' for commands, or double-click a desktop icon to explore.
Try: neofetch, fortune, ls, cat resume.pdf`,
    };
  },

  fortune() {
    const quote = fortunes[Math.floor(Math.random() * fortunes.length)];
    return { type: "output", html: `<span style="color:#E8891E">${esc(quote)}</span>` };
  },

  cowsay(args: string) {
    const text = args.trim() || "Moo!";
    const line = "_".repeat(text.length + 2);
    return {
      type: "output",
      html: ` ${line}
&lt; ${esc(text)} &gt;
 ${"-".repeat(text.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`,
    };
  },

  xeyes() {
    return { type: "event", name: "shell:xeyes-spawn" };
  },

  doom() {
    return { type: "event", name: "shell:doom-dialog" };
  },

  quake() {
    return { type: "event", name: "shell:doom-dialog" };
  },

  killall(args: string) {
    const target = args.trim();
    if (target === "xeyes") {
      return { type: "event", name: "shell:xeyes-kill" };
    }
    return { type: "output", html: `<span style="color:#FF6666">killall: no process '${esc(target)}'</span>` };
  },

  // ── NeXTSTEP-specific commands ──────────────────

  uptime() {
    const careerStart = new Date("1994-06-01");
    const now = new Date();
    const years = now.getFullYear() - careerStart.getFullYear();
    const days = Math.floor((now.getTime() - careerStart.getTime()) / (1000 * 60 * 60 * 24));
    return {
      type: "output",
      html: ` up ${days} days (${years} years), load average: caffeine/high, ambition/maximum, regrets/zero`,
    };
  },

  "make"(args: string) {
    if (args.trim() === "coffee") {
      return {
        type: "output",
        html: `<span style="color:#ccaa44">Brewing...</span>

    ( (
     ) )
  .______.
  |      |]
  \\      /
   \`----'

<span style="color:#6aee6a">☕ Done. Black, no sugar. Like production deploys.</span>`,
      };
    }
    return { type: "output", html: `<span style="color:#FF6666">make: *** No rule to make target '${esc(args.trim() || "(nothing)")}'. Stop.</span>` };
  },

  deploy(args: string) {
    if (args.trim().toLowerCase() === "godzilla") {
      return {
        type: "output",
        html: `<span style="color:#cc4444">⚠ WARNING: Kaiju deployment not authorized in production.</span>
<span style="color:#ccaa44">Reason: Last deployment resulted in $4.7B in infrastructure damage.</span>
<span style="color:#999999">See: INCIDENT-1954-TOKYO, INCIDENT-2014-SANFRANCISCO</span>
<span style="color:#cc4444">Deployment blocked by kaiju-prevention-policy.yaml</span>`,
      };
    }
    return { type: "output", html: `<span style="color:#FF6666">deploy: unknown target '${esc(args.trim() || "(nothing)")}'</span>` };
  },

  man(args: string) {
    if (args.trim().toLowerCase() === "todd" || args.trim().toLowerCase() === "lebaron") {
      return {
        type: "output",
        html: `<span style="color:#6aafee">TODD(1)                   User Commands                   TODD(1)</span>

<span style="color:#e0e0e0;font-weight:bold">NAME</span>
       todd - builder of things that matter since 1994

<span style="color:#e0e0e0;font-weight:bold">SYNOPSIS</span>
       todd [--coffee] [--focus] &lt;impossible-problem&gt;

<span style="color:#e0e0e0;font-weight:bold">DESCRIPTION</span>
       Full-stack architect and AI platform engineer. Former Navy
       nuclear electronics technician (CVN-68). Built enterprise AI
       governance platforms, military decision-support systems, and
       the occasional retro desktop theme for fun.

       Specializes in taking "that can't be done" and shipping it.

<span style="color:#e0e0e0;font-weight:bold">OPTIONS</span>
       --coffee      Required. System will not boot without it.
       --focus       Enables deep work mode. Disables Slack.
       --metal       Background music: Tool, Mastodon, Iron Maiden.
       --kaiju       Enables Godzilla references in all outputs.

<span style="color:#e0e0e0;font-weight:bold">ENVIRONMENT</span>
       CAFFEINE_LEVEL    Must be &gt; 0 at all times
       CURRENT_STACK     TypeScript, Python, Astro, React, AI/ML
       HOBBY_MODE        Fractals, Warhammer 40K, Godzilla

<span style="color:#e0e0e0;font-weight:bold">BUGS</span>
       Occasionally mass-produces side projects. Known to over-engineer
       personal websites. Refuses to write code without dark mode.

<span style="color:#6aafee">toddlebaron.com              2026                         TODD(1)</span>`,
      };
    }
    return { type: "output", html: `<span style="color:#FF6666">No manual entry for ${esc(args.trim() || "(nothing)")}</span>` };
  },

  sudo(args: string) {
    const trimmed = args.trim().toLowerCase();
    if (trimmed === "rm -rf /" || trimmed === "rm -rf / --no-preserve-root") {
      return {
        type: "output",
        html: `<span style="color:#cc4444">Nice try. Access denied. This isn't your first rodeo.</span>
<span style="color:#999999">(But I appreciate the audacity.)</span>`,
      };
    }
    return {
      type: "output",
      html: `<span style="color:#ccaa44">todd is not in the sudoers file. This incident will be reported.</span>`,
    };
  },

  mail() {
    return {
      type: "output",
      html: `<span style="color:#6aafee">Opening contact form...</span>
<span style="color:#999999">Reach me at: todd@toddlebaron.com</span>
<span style="color:#999999">Or find me on GitHub, LinkedIn — links in the shelf.</span>`,
    };
  },
};

export function executeCommand(input: string): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { type: "output", html: "" };

  const spaceIdx = trimmed.indexOf(" ");
  const cmd = spaceIdx === -1 ? trimmed.toLowerCase() : trimmed.slice(0, spaceIdx).toLowerCase();
  const args = spaceIdx === -1 ? "" : trimmed.slice(spaceIdx + 1);

  const handler = commands[cmd];
  if (!handler) {
    return {
      type: "output",
      html: `<span style="color:#FF6666">${esc(cmd)}: command not found. Type 'help' for available commands.</span>`,
    };
  }

  return handler(args);
}

export function getPromptHTML(): string {
  const shortPath = cwd === "/home/todd" ? "~" : cwd.replace("/home/todd", "~");
  return `<span style="color:#3BB8D0">todd</span><span style="color:#888">@</span><span style="color:#E8891E">indigo</span><span style="color:#888">:</span><span style="color:#7B52AE">${esc(shortPath)}</span><span style="color:#888">$ </span>`;
}

// src/themes/sgi-irix/fm-icons.ts
// SGI IRIX style file manager icons — 24x24, metallic gradients, no shelf

export const fmIcons: Record<string, string> = {

  folder: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fm-folder-back" x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0%" stop-color="#50C0D8"/>
        <stop offset="50%" stop-color="#3090B0"/>
        <stop offset="100%" stop-color="#1C6880"/>
      </linearGradient>
      <linearGradient id="fm-folder-front" x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0%" stop-color="#70D8F0"/>
        <stop offset="50%" stop-color="#40A8C8"/>
        <stop offset="100%" stop-color="#2878A0"/>
      </linearGradient>
    </defs>
    <rect x="2" y="7" width="7" height="2.5" rx="1" fill="url(#fm-folder-back)" stroke="#1C6880" stroke-width="0.5"/>
    <rect x="2" y="9" width="20" height="12" rx="1.5" fill="url(#fm-folder-back)" stroke="#1C6880" stroke-width="0.6"/>
    <rect x="3" y="10.5" width="18" height="10" rx="1" fill="url(#fm-folder-front)" stroke="#1878A0" stroke-width="0.4"/>
    <line x1="3.3" y1="11" x2="3.3" y2="20" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/>
    <line x1="3.5" y1="10.8" x2="20.5" y2="10.8" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/>
  </svg>`,

  home: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fm-home-roof" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stop-color="#C04040"/>
        <stop offset="100%" stop-color="#801818"/>
      </linearGradient>
      <linearGradient id="fm-home-wall" x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0%" stop-color="#E8E0C8"/>
        <stop offset="100%" stop-color="#C0B890"/>
      </linearGradient>
    </defs>
    <!-- roof -->
    <polygon points="12,3 2,11 22,11" fill="url(#fm-home-roof)" stroke="#601010" stroke-width="0.6"/>
    <!-- wall -->
    <rect x="4" y="11" width="16" height="10" rx="0.5" fill="url(#fm-home-wall)" stroke="#907040" stroke-width="0.6"/>
    <!-- door -->
    <rect x="9.5" y="15" width="5" height="6" rx="0.5" fill="#8060A0" stroke="#604080" stroke-width="0.4"/>
    <!-- window left -->
    <rect x="5" y="13" width="3.5" height="3" rx="0.3" fill="#80B8E0" stroke="#4078A8" stroke-width="0.4"/>
    <!-- window right -->
    <rect x="15.5" y="13" width="3.5" height="3" rx="0.3" fill="#80B8E0" stroke="#4078A8" stroke-width="0.4"/>
    <!-- roof highlight -->
    <line x1="3.5" y1="10.5" x2="12" y2="4" stroke="rgba(255,255,255,0.3)" stroke-width="0.6"/>
  </svg>`,

  globe: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fm-globe-body" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#60B8E8"/>
        <stop offset="50%" stop-color="#2880C0"/>
        <stop offset="100%" stop-color="#104880"/>
      </linearGradient>
      <linearGradient id="fm-globe-land" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#60B860"/>
        <stop offset="100%" stop-color="#287828"/>
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="9.5" fill="url(#fm-globe-body)" stroke="#0A3060" stroke-width="0.7"/>
    <ellipse cx="9" cy="10" rx="3" ry="3.5" fill="url(#fm-globe-land)" opacity="0.85"/>
    <ellipse cx="15" cy="14" rx="3.5" ry="2.5" fill="url(#fm-globe-land)" opacity="0.85"/>
    <ellipse cx="12" cy="12" rx="9.5" ry="3" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
    <line x1="12" y1="2.5" x2="12" y2="21.5" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
    <ellipse cx="9" cy="9" rx="2" ry="1.2" fill="rgba(255,255,255,0.2)"/>
  </svg>`,

  building: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fm-bldg-wall" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stop-color="#9898C8"/>
        <stop offset="50%" stop-color="#6868A8"/>
        <stop offset="100%" stop-color="#404080"/>
      </linearGradient>
      <linearGradient id="fm-bldg-win" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#203060"/>
        <stop offset="100%" stop-color="#102040"/>
      </linearGradient>
    </defs>
    <!-- main tower -->
    <rect x="5" y="5" width="14" height="17" fill="url(#fm-bldg-wall)" stroke="#303070" stroke-width="0.7"/>
    <!-- windows (3 rows x 3 cols) -->
    <rect x="7" y="7" width="3" height="2.5" rx="0.3" fill="url(#fm-bldg-win)"/>
    <rect x="11.5" y="7" width="3" height="2.5" rx="0.3" fill="url(#fm-bldg-win)"/>
    <rect x="7" y="11" width="3" height="2.5" rx="0.3" fill="url(#fm-bldg-win)"/>
    <rect x="11.5" y="11" width="3" height="2.5" rx="0.3" fill="url(#fm-bldg-win)"/>
    <rect x="7" y="15" width="3" height="2.5" rx="0.3" fill="url(#fm-bldg-win)"/>
    <rect x="11.5" y="15" width="3" height="2.5" rx="0.3" fill="url(#fm-bldg-win)"/>
    <!-- window glows -->
    <rect x="7.3" y="7.3" width="1" height="0.8" fill="rgba(80,180,255,0.3)"/>
    <rect x="11.8" y="7.3" width="1" height="0.8" fill="rgba(80,180,255,0.3)"/>
    <!-- door -->
    <rect x="10" y="18" width="4" height="4" rx="0.3" fill="#282848" stroke="#202040" stroke-width="0.4"/>
    <!-- building highlight -->
    <line x1="5.4" y1="5.5" x2="5.4" y2="21" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/>
    <line x1="5.5" y1="5.4" x2="18.5" y2="5.4" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/>
  </svg>`,

  gem: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fm-gem-top" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#E0A0FF"/>
        <stop offset="100%" stop-color="#A040D8"/>
      </linearGradient>
      <linearGradient id="fm-gem-left" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#C060F0"/>
        <stop offset="100%" stop-color="#7020B0"/>
      </linearGradient>
      <linearGradient id="fm-gem-right" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#D080FF"/>
        <stop offset="100%" stop-color="#8030C0"/>
      </linearGradient>
      <linearGradient id="fm-gem-bot" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#9030C0"/>
        <stop offset="100%" stop-color="#500890"/>
      </linearGradient>
    </defs>
    <!-- gem top crown -->
    <polygon points="12,3 18,8 12,9 6,8" fill="url(#fm-gem-top)" stroke="#5010A0" stroke-width="0.5"/>
    <!-- gem left facet -->
    <polygon points="6,8 12,9 12,21" fill="url(#fm-gem-left)" stroke="#5010A0" stroke-width="0.5"/>
    <!-- gem right facet -->
    <polygon points="18,8 12,9 12,21" fill="url(#fm-gem-right)" stroke="#5010A0" stroke-width="0.5"/>
    <!-- gem bottom point -->
    <polygon points="6,8 12,21 4,14" fill="url(#fm-gem-bot)" stroke="#5010A0" stroke-width="0.5"/>
    <polygon points="18,8 12,21 20,14" fill="url(#fm-gem-bot)" stroke="#5010A0" stroke-width="0.5"/>
    <!-- sparkle -->
    <line x1="19" y1="4" x2="19" y2="7" stroke="#E0C0FF" stroke-width="0.8" opacity="0.8"/>
    <line x1="17.5" y1="5.5" x2="20.5" y2="5.5" stroke="#E0C0FF" stroke-width="0.8" opacity="0.8"/>
    <!-- top highlight -->
    <polygon points="12,3.5 16,7.5 12,8.5 8,7.5" fill="rgba(255,255,255,0.2)"/>
  </svg>`,

  robot: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fm-robot-head" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stop-color="#A0C8E8"/>
        <stop offset="100%" stop-color="#405888"/>
      </linearGradient>
      <linearGradient id="fm-robot-eye" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#80F0FF"/>
        <stop offset="100%" stop-color="#20A8D0"/>
      </linearGradient>
    </defs>
    <!-- antenna -->
    <line x1="12" y1="1.5" x2="12" y2="4" stroke="#6080A8" stroke-width="0.9"/>
    <circle cx="12" cy="1.5" r="0.9" fill="#80C0FF"/>
    <!-- head -->
    <rect x="5" y="4" width="14" height="10" rx="2" fill="url(#fm-robot-head)" stroke="#304878" stroke-width="0.7"/>
    <!-- eyes -->
    <ellipse cx="9.5" cy="8.5" rx="2" ry="2" fill="url(#fm-robot-eye)" stroke="#106888" stroke-width="0.4"/>
    <ellipse cx="14.5" cy="8.5" rx="2" ry="2" fill="url(#fm-robot-eye)" stroke="#106888" stroke-width="0.4"/>
    <ellipse cx="9" cy="8" rx="0.6" ry="0.5" fill="rgba(255,255,255,0.7)"/>
    <ellipse cx="14" cy="8" rx="0.6" ry="0.5" fill="rgba(255,255,255,0.7)"/>
    <!-- mouth grill -->
    <rect x="8" y="11.5" width="8" height="1.2" rx="0.6" fill="#203050" opacity="0.7"/>
    <!-- body -->
    <rect x="6" y="14" width="12" height="8" rx="1.5" fill="url(#fm-robot-head)" stroke="#304878" stroke-width="0.7"/>
    <!-- chest lights -->
    <circle cx="10" cy="17.5" r="1" fill="#60B0FF" opacity="0.9"/>
    <circle cx="12" cy="17.5" r="1" fill="#60FFCC" opacity="0.9"/>
    <circle cx="14" cy="17.5" r="1" fill="#FF6080" opacity="0.9"/>
    <!-- arms -->
    <rect x="2" y="15" width="4" height="2.5" rx="1.2" fill="url(#fm-robot-head)" stroke="#304878" stroke-width="0.5"/>
    <rect x="18" y="15" width="4" height="2.5" rx="1.2" fill="url(#fm-robot-head)" stroke="#304878" stroke-width="0.5"/>
    <!-- head highlight -->
    <rect x="5.5" y="4.5" width="5" height="2" rx="0.8" fill="rgba(255,255,255,0.2)"/>
  </svg>`,

  branch: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fm-branch-line" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#80C080"/>
        <stop offset="100%" stop-color="#408040"/>
      </linearGradient>
      <linearGradient id="fm-branch-dot" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#A0E0A0"/>
        <stop offset="100%" stop-color="#50A050"/>
      </linearGradient>
    </defs>
    <!-- main branch line -->
    <line x1="8" y1="4" x2="8" y2="20" stroke="url(#fm-branch-line)" stroke-width="2" stroke-linecap="round"/>
    <!-- branch off -->
    <path d="M8 10 Q8 7 14 7 L16 7" fill="none" stroke="url(#fm-branch-line)" stroke-width="2" stroke-linecap="round"/>
    <!-- merge line -->
    <path d="M16 17 Q16 14 8 14" fill="none" stroke="url(#fm-branch-line)" stroke-width="2" stroke-linecap="round" stroke-dasharray="2,1.5"/>
    <!-- dots: top commit -->
    <circle cx="8" cy="4" r="2.5" fill="url(#fm-branch-dot)" stroke="#306030" stroke-width="0.5"/>
    <!-- branch commit -->
    <circle cx="16" cy="7" r="2.5" fill="url(#fm-branch-dot)" stroke="#306030" stroke-width="0.5"/>
    <!-- mid commit -->
    <circle cx="8" cy="14" r="2.5" fill="url(#fm-branch-dot)" stroke="#306030" stroke-width="0.5"/>
    <!-- end commit -->
    <circle cx="8" cy="20" r="2.5" fill="url(#fm-branch-dot)" stroke="#306030" stroke-width="0.5"/>
    <!-- highlights -->
    <circle cx="7.2" cy="3.2" r="0.7" fill="rgba(255,255,255,0.6)"/>
    <circle cx="15.2" cy="6.2" r="0.7" fill="rgba(255,255,255,0.6)"/>
  </svg>`,

  pencil: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fm-pencil-body" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#F0C840"/>
        <stop offset="100%" stop-color="#C89820"/>
      </linearGradient>
      <linearGradient id="fm-pencil-tip" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#E8C860"/>
        <stop offset="100%" stop-color="#B08020"/>
      </linearGradient>
    </defs>
    <g transform="rotate(-40 12 12)">
      <!-- pencil body -->
      <rect x="10" y="4" width="4" height="14" rx="0.5" fill="url(#fm-pencil-body)" stroke="#A07818" stroke-width="0.5"/>
      <!-- highlight stripe -->
      <rect x="10.4" y="5" width="1" height="12" rx="0.3" fill="rgba(255,255,255,0.35)"/>
      <!-- ferrule (metal band) -->
      <rect x="10" y="4" width="4" height="2" rx="0.3" fill="#B8B8B8" stroke="#888" stroke-width="0.4"/>
      <!-- eraser -->
      <rect x="10.2" y="2.3" width="3.6" height="1.8" rx="0.7" fill="#F0A0A0" stroke="#C07070" stroke-width="0.3"/>
      <!-- pencil tip taper -->
      <path d="M10 18 L12 22 L14 18 Z" fill="url(#fm-pencil-tip)" stroke="#A07818" stroke-width="0.4"/>
      <!-- graphite point -->
      <path d="M11.3 20.5 L12 22 L12.7 20.5 Z" fill="#404040"/>
    </g>
  </svg>`,

  document: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fm-doc-page" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stop-color="#F0EEF8"/>
        <stop offset="100%" stop-color="#C8C4E0"/>
      </linearGradient>
      <linearGradient id="fm-doc-fold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#9080C0"/>
        <stop offset="100%" stop-color="#7060A8"/>
      </linearGradient>
    </defs>
    <rect x="5" y="2" width="14" height="20" rx="1.5" fill="url(#fm-doc-page)" stroke="#9080B0" stroke-width="0.7"/>
    <!-- dog-ear -->
    <path d="M14 2 L19 2 L19 7 Z" fill="url(#fm-doc-fold)"/>
    <path d="M14 2 L19 7 L14 7 Z" fill="#E0DCF0"/>
    <!-- text lines -->
    <rect x="7.5" y="10" width="7" height="1.1" rx="0.55" fill="#8070A8" opacity="0.7"/>
    <rect x="7.5" y="12.5" width="9" height="1" rx="0.5" fill="#A090C0" opacity="0.5"/>
    <rect x="7.5" y="14.8" width="8" height="1" rx="0.5" fill="#A090C0" opacity="0.5"/>
    <rect x="7.5" y="17.1" width="9" height="1" rx="0.5" fill="#A090C0" opacity="0.45"/>
    <!-- doc edge highlight -->
    <line x1="5.4" y1="3" x2="5.4" y2="21" stroke="rgba(255,255,255,0.45)" stroke-width="0.6"/>
    <line x1="5.5" y1="2.5" x2="14" y2="2.5" stroke="rgba(255,255,255,0.45)" stroke-width="0.6"/>
  </svg>`,

  briefcase: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fm-brief-body" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stop-color="#9090C0"/>
        <stop offset="50%" stop-color="#606090"/>
        <stop offset="100%" stop-color="#383860"/>
      </linearGradient>
      <linearGradient id="fm-brief-handle" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#C8C8D8"/>
        <stop offset="100%" stop-color="#808098"/>
      </linearGradient>
    </defs>
    <!-- handle -->
    <path d="M9 8 L9 6 Q9 4 12 4 Q15 4 15 6 L15 8" fill="none" stroke="url(#fm-brief-handle)" stroke-width="1.8" stroke-linecap="round"/>
    <!-- case body -->
    <rect x="3" y="8" width="18" height="13" rx="1.5" fill="url(#fm-brief-body)" stroke="#282848" stroke-width="0.7"/>
    <!-- lid divider -->
    <line x1="3" y1="13" x2="21" y2="13" stroke="#202040" stroke-width="0.8"/>
    <!-- center latch -->
    <rect x="10.5" y="11" width="3" height="4" rx="0.5" fill="#C0B820" stroke="#908010" stroke-width="0.4"/>
    <rect x="11.2" y="12.5" width="1.6" height="1" rx="0.3" fill="#E0D040"/>
    <!-- body highlight -->
    <line x1="3.4" y1="8.5" x2="3.4" y2="20" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/>
    <line x1="3.5" y1="8.4" x2="20.5" y2="8.4" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/>
    <!-- strap details -->
    <line x1="6" y1="8" x2="6" y2="21" stroke="rgba(0,0,0,0.15)" stroke-width="0.5"/>
    <line x1="18" y1="8" x2="18" y2="21" stroke="rgba(0,0,0,0.15)" stroke-width="0.5"/>
  </svg>`,

};

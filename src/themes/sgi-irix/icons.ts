// src/themes/sgi-irix/icons.ts
// SGI IRIX Indigo Magic style desktop icons
// Each icon is a 48x48 SVG with metallic gradients and a 3D shelf/platform

export const sgiIcons: Record<string, string> = {

  about: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shelf-about" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#B8B8B8"/>
        <stop offset="40%" stop-color="#909090"/>
        <stop offset="100%" stop-color="#585858"/>
      </linearGradient>
      <linearGradient id="body-about" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#C080E0"/>
        <stop offset="50%" stop-color="#8050B8"/>
        <stop offset="100%" stop-color="#5030A0"/>
      </linearGradient>
      <linearGradient id="head-about" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#F0C880"/>
        <stop offset="100%" stop-color="#C89040"/>
      </linearGradient>
      <radialGradient id="highlight-about" cx="35%" cy="30%" r="50%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.5)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
      </radialGradient>
    </defs>
    <!-- shelf platform -->
    <rect x="3" y="39" width="42" height="7" rx="1" fill="url(#shelf-about)" stroke="#444" stroke-width="0.5"/>
    <!-- shelf top edge highlight -->
    <rect x="3" y="39" width="42" height="2" rx="1" fill="#D0D0D0" opacity="0.6"/>
    <!-- shelf shadow -->
    <ellipse cx="24" cy="41" rx="16" ry="2.5" fill="rgba(0,0,0,0.25)"/>
    <!-- body / torso -->
    <path d="M16 32 Q16 27 24 27 Q32 27 32 32 L32 38 Q24 39.5 16 38 Z" fill="url(#body-about)" stroke="#3020608" stroke-width="0.5"/>
    <!-- body highlight -->
    <path d="M18 29 Q20 27.5 24 27.5 Q27 27.5 29 29 Q26 28 24 28 Q21 28 18 29 Z" fill="rgba(255,255,255,0.3)"/>
    <!-- neck -->
    <rect x="21" y="21" width="6" height="7" rx="1" fill="url(#head-about)" stroke="#A07030" stroke-width="0.5"/>
    <!-- head -->
    <ellipse cx="24" cy="18" rx="7" ry="7.5" fill="url(#head-about)" stroke="#A07030" stroke-width="0.5"/>
    <!-- head highlight -->
    <ellipse cx="21" cy="15" rx="3" ry="2.5" fill="rgba(255,255,255,0.35)"/>
    <!-- eyes -->
    <ellipse cx="21.5" cy="17" rx="1.2" ry="1.4" fill="#3A2010"/>
    <ellipse cx="26.5" cy="17" rx="1.2" ry="1.4" fill="#3A2010"/>
    <!-- eye gleam -->
    <ellipse cx="22" cy="16.5" rx="0.4" ry="0.4" fill="rgba(255,255,255,0.7)"/>
    <ellipse cx="27" cy="16.5" rx="0.4" ry="0.4" fill="rgba(255,255,255,0.7)"/>
  </svg>`,

  resume: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shelf-resume" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#B8B8B8"/>
        <stop offset="40%" stop-color="#909090"/>
        <stop offset="100%" stop-color="#585858"/>
      </linearGradient>
      <linearGradient id="doc-resume" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stop-color="#F0EEF8"/>
        <stop offset="100%" stop-color="#C8C4E0"/>
      </linearGradient>
      <linearGradient id="fold-resume" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#9080C0"/>
        <stop offset="100%" stop-color="#7060A8"/>
      </linearGradient>
    </defs>
    <!-- shelf platform -->
    <rect x="3" y="39" width="42" height="7" rx="1" fill="url(#shelf-resume)" stroke="#444" stroke-width="0.5"/>
    <rect x="3" y="39" width="42" height="2" rx="1" fill="#D0D0D0" opacity="0.6"/>
    <ellipse cx="24" cy="41" rx="14" ry="2" fill="rgba(0,0,0,0.25)"/>
    <!-- document body -->
    <rect x="11" y="8" width="22" height="31" rx="1.5" fill="url(#doc-resume)" stroke="#9080B0" stroke-width="0.8"/>
    <!-- dog-ear fold -->
    <path d="M27 8 L33 8 L33 14 Z" fill="url(#fold-resume)"/>
    <path d="M27 8 L33 14 L27 14 Z" fill="#E0DCF0"/>
    <!-- text lines -->
    <rect x="14" y="17" width="14" height="1.5" rx="0.75" fill="#8070A8" opacity="0.7"/>
    <rect x="14" y="21" width="17" height="1.2" rx="0.6" fill="#A090C0" opacity="0.5"/>
    <rect x="14" y="24" width="15" height="1.2" rx="0.6" fill="#A090C0" opacity="0.5"/>
    <rect x="14" y="27" width="17" height="1.2" rx="0.6" fill="#A090C0" opacity="0.5"/>
    <rect x="14" y="30" width="12" height="1.2" rx="0.6" fill="#A090C0" opacity="0.5"/>
    <rect x="14" y="33" width="16" height="1.2" rx="0.6" fill="#A090C0" opacity="0.4"/>
    <!-- header accent bar -->
    <rect x="11" y="8" width="22" height="7" rx="1.5" fill="none"/>
    <rect x="11" y="8" width="22" height="6" rx="1" fill="#9880CC" opacity="0.25"/>
    <!-- doc edge highlight -->
    <line x1="11.5" y1="9" x2="11.5" y2="37" stroke="rgba(255,255,255,0.5)" stroke-width="0.8"/>
    <line x1="11" y1="8.5" x2="27" y2="8.5" stroke="rgba(255,255,255,0.5)" stroke-width="0.8"/>
  </svg>`,

  "computing-history": `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shelf-ch" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#B8B8B8"/>
        <stop offset="40%" stop-color="#909090"/>
        <stop offset="100%" stop-color="#585858"/>
      </linearGradient>
      <linearGradient id="crt-body-ch" x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0%" stop-color="#9898C8"/>
        <stop offset="50%" stop-color="#6868A8"/>
        <stop offset="100%" stop-color="#404080"/>
      </linearGradient>
      <linearGradient id="screen-ch" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#203060"/>
        <stop offset="100%" stop-color="#102040"/>
      </linearGradient>
      <linearGradient id="screen-glow-ch" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="rgba(80,200,120,0.8)"/>
        <stop offset="100%" stop-color="rgba(40,140,80,0.3)"/>
      </linearGradient>
    </defs>
    <!-- shelf platform -->
    <rect x="3" y="39" width="42" height="7" rx="1" fill="url(#shelf-ch)" stroke="#444" stroke-width="0.5"/>
    <rect x="3" y="39" width="42" height="2" rx="1" fill="#D0D0D0" opacity="0.6"/>
    <ellipse cx="24" cy="41" rx="15" ry="2" fill="rgba(0,0,0,0.3)"/>
    <!-- monitor base/stand -->
    <rect x="19" y="35" width="10" height="4" rx="1" fill="#5858A0" stroke="#404080" stroke-width="0.5"/>
    <rect x="16" y="37" width="16" height="2.5" rx="1" fill="#404888" stroke="#303070" stroke-width="0.5"/>
    <!-- CRT body -->
    <rect x="9" y="11" width="30" height="26" rx="3" fill="url(#crt-body-ch)" stroke="#404080" stroke-width="0.8"/>
    <!-- CRT bezel depth -->
    <rect x="11" y="13" width="26" height="20" rx="2" fill="#303070" stroke="#252560" stroke-width="0.5"/>
    <!-- screen -->
    <rect x="13" y="15" width="22" height="16" rx="1" fill="url(#screen-ch)"/>
    <!-- phosphor glow content -->
    <rect x="14" y="16" width="20" height="14" rx="0.5" fill="url(#screen-glow-ch)" opacity="0.2"/>
    <!-- terminal text lines -->
    <rect x="15" y="18" width="11" height="1.2" rx="0.6" fill="#50E880" opacity="0.85"/>
    <rect x="15" y="21" width="16" height="1.2" rx="0.6" fill="#50E880" opacity="0.7"/>
    <rect x="15" y="24" width="9" height="1.2" rx="0.6" fill="#50E880" opacity="0.8"/>
    <!-- cursor blink -->
    <rect x="15" y="27" width="5" height="1.5" rx="0.3" fill="#70FF90" opacity="0.9"/>
    <!-- screen bezel highlight -->
    <line x1="13" y1="15.5" x2="35" y2="15.5" stroke="rgba(255,255,255,0.15)" stroke-width="0.8"/>
    <line x1="13.5" y1="15" x2="13.5" y2="31" stroke="rgba(255,255,255,0.15)" stroke-width="0.8"/>
    <!-- body highlight -->
    <line x1="9.5" y1="12" x2="9.5" y2="36" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
    <line x1="10" y1="11.5" x2="38" y2="11.5" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
    <!-- power LED -->
    <circle cx="36" cy="34" r="1.2" fill="#40FF60" opacity="0.9"/>
    <circle cx="36" cy="34" r="0.6" fill="#80FFA0"/>
  </svg>`,

  contact: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shelf-contact" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#B8B8B8"/>
        <stop offset="40%" stop-color="#909090"/>
        <stop offset="100%" stop-color="#585858"/>
      </linearGradient>
      <linearGradient id="envelope-contact" x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0%" stop-color="#E8D870"/>
        <stop offset="50%" stop-color="#C8A830"/>
        <stop offset="100%" stop-color="#A88020"/>
      </linearGradient>
      <linearGradient id="flap-contact" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#F0E888"/>
        <stop offset="100%" stop-color="#D4B840"/>
      </linearGradient>
      <linearGradient id="inside-contact" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFF8E0"/>
        <stop offset="100%" stop-color="#EEE0A0"/>
      </linearGradient>
    </defs>
    <!-- shelf platform -->
    <rect x="3" y="39" width="42" height="7" rx="1" fill="url(#shelf-contact)" stroke="#444" stroke-width="0.5"/>
    <rect x="3" y="39" width="42" height="2" rx="1" fill="#D0D0D0" opacity="0.6"/>
    <ellipse cx="24" cy="41" rx="14" ry="2" fill="rgba(0,0,0,0.25)"/>
    <!-- envelope body -->
    <rect x="7" y="16" width="34" height="23" rx="2" fill="url(#envelope-contact)" stroke="#906820" stroke-width="0.8"/>
    <!-- envelope inside (visible at top flap) -->
    <rect x="8" y="17" width="32" height="10" rx="1" fill="url(#inside-contact)" opacity="0.6"/>
    <!-- flap -->
    <path d="M7 16 L24 27 L41 16 Z" fill="url(#flap-contact)" stroke="#906820" stroke-width="0.6"/>
    <!-- flap center fold line -->
    <path d="M7 16 L24 26" stroke="#C09028" stroke-width="0.5" opacity="0.5"/>
    <path d="M41 16 L24 26" stroke="#C09028" stroke-width="0.5" opacity="0.5"/>
    <!-- bottom V fold -->
    <path d="M7 39 L24 28 L41 39" fill="none" stroke="#906820" stroke-width="0.6"/>
    <!-- highlight on flap -->
    <path d="M10 16 L24 25 L28 22 L16 16 Z" fill="rgba(255,255,255,0.2)"/>
    <!-- envelope edge highlight -->
    <line x1="7.5" y1="17" x2="7.5" y2="38" stroke="rgba(255,255,255,0.35)" stroke-width="0.8"/>
    <line x1="8" y1="16.5" x2="40" y2="16.5" stroke="rgba(255,255,255,0.35)" stroke-width="0.8"/>
    <!-- postage stamp hint -->
    <rect x="32" y="20" width="6" height="5" rx="0.5" fill="#8850D0" stroke="#6040B0" stroke-width="0.5"/>
    <rect x="33" y="21" width="4" height="3" rx="0.3" fill="#A870F0" opacity="0.7"/>
  </svg>`,

  projects: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shelf-projects" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#B8B8B8"/>
        <stop offset="40%" stop-color="#909090"/>
        <stop offset="100%" stop-color="#585858"/>
      </linearGradient>
      <linearGradient id="folder-back-projects" x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0%" stop-color="#50C0D8"/>
        <stop offset="50%" stop-color="#3090B0"/>
        <stop offset="100%" stop-color="#1C6880"/>
      </linearGradient>
      <linearGradient id="folder-front-projects" x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0%" stop-color="#70D8F0"/>
        <stop offset="50%" stop-color="#40A8C8"/>
        <stop offset="100%" stop-color="#2878A0"/>
      </linearGradient>
      <linearGradient id="gear-projects" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#D8D8E8"/>
        <stop offset="50%" stop-color="#A8A8C0"/>
        <stop offset="100%" stop-color="#787898"/>
      </linearGradient>
    </defs>
    <!-- shelf platform -->
    <rect x="3" y="39" width="42" height="7" rx="1" fill="url(#shelf-projects)" stroke="#444" stroke-width="0.5"/>
    <rect x="3" y="39" width="42" height="2" rx="1" fill="#D0D0D0" opacity="0.6"/>
    <ellipse cx="24" cy="41" rx="15" ry="2" fill="rgba(0,0,0,0.3)"/>
    <!-- folder tab -->
    <rect x="8" y="14" width="14" height="4" rx="1.5" fill="url(#folder-back-projects)" stroke="#1C6880" stroke-width="0.5"/>
    <!-- folder body back -->
    <rect x="7" y="17" width="34" height="22" rx="2" fill="url(#folder-back-projects)" stroke="#1C6880" stroke-width="0.8"/>
    <!-- folder body front highlight -->
    <rect x="7" y="17" width="34" height="4" rx="1" fill="rgba(255,255,255,0.2)"/>
    <!-- folder front face (slight offset for 3D) -->
    <rect x="8" y="19" width="32" height="19" rx="1.5" fill="url(#folder-front-projects)" stroke="#1878A0" stroke-width="0.5"/>
    <!-- folder front highlight -->
    <line x1="8.5" y1="20" x2="8.5" y2="37" stroke="rgba(255,255,255,0.35)" stroke-width="0.8"/>
    <line x1="9" y1="19.5" x2="39" y2="19.5" stroke="rgba(255,255,255,0.35)" stroke-width="0.8"/>
    <!-- gear: outer ring -->
    <circle cx="26" cy="29" r="7.5" fill="url(#gear-projects)" stroke="#606080" stroke-width="0.6"/>
    <!-- gear teeth (simplified 8-tooth) -->
    <rect x="24.5" y="20" width="3" height="3" rx="0.5" fill="url(#gear-projects)" stroke="#606080" stroke-width="0.4"/>
    <rect x="24.5" y="35" width="3" height="3" rx="0.5" fill="url(#gear-projects)" stroke="#606080" stroke-width="0.4"/>
    <rect x="18.5" y="27.5" width="3" height="3" rx="0.5" fill="url(#gear-projects)" stroke="#606080" stroke-width="0.4"/>
    <rect x="30.5" y="27.5" width="3" height="3" rx="0.5" fill="url(#gear-projects)" stroke="#606080" stroke-width="0.4"/>
    <rect x="20" y="22" width="2.5" height="2.5" rx="0.5" transform="rotate(45 21.25 23.25)" fill="url(#gear-projects)" stroke="#606080" stroke-width="0.4"/>
    <rect x="30" y="22" width="2.5" height="2.5" rx="0.5" transform="rotate(45 31.25 23.25)" fill="url(#gear-projects)" stroke="#606080" stroke-width="0.4"/>
    <rect x="20" y="33" width="2.5" height="2.5" rx="0.5" transform="rotate(45 21.25 34.25)" fill="url(#gear-projects)" stroke="#606080" stroke-width="0.4"/>
    <rect x="30" y="33" width="2.5" height="2.5" rx="0.5" transform="rotate(45 31.25 34.25)" fill="url(#gear-projects)" stroke="#606080" stroke-width="0.4"/>
    <!-- gear inner circle -->
    <circle cx="26" cy="29" r="4" fill="#8090B8" stroke="#505878" stroke-width="0.5"/>
    <circle cx="26" cy="29" r="2" fill="#A0B0D0"/>
    <!-- gear highlight -->
    <ellipse cx="23.5" cy="26.5" rx="2" ry="1.5" fill="rgba(255,255,255,0.3)"/>
  </svg>`,

  blog: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shelf-blog" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#B8B8B8"/>
        <stop offset="40%" stop-color="#909090"/>
        <stop offset="100%" stop-color="#585858"/>
      </linearGradient>
      <linearGradient id="pad-blog" x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0%" stop-color="#F4F0E8"/>
        <stop offset="100%" stop-color="#D8D0C0"/>
      </linearGradient>
      <linearGradient id="binding-blog" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#C04040"/>
        <stop offset="50%" stop-color="#902020"/>
        <stop offset="100%" stop-color="#701818"/>
      </linearGradient>
      <linearGradient id="pencil-blog" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#F0C840"/>
        <stop offset="100%" stop-color="#C89820"/>
      </linearGradient>
    </defs>
    <!-- shelf platform -->
    <rect x="3" y="39" width="42" height="7" rx="1" fill="url(#shelf-blog)" stroke="#444" stroke-width="0.5"/>
    <rect x="3" y="39" width="42" height="2" rx="1" fill="#D0D0D0" opacity="0.6"/>
    <ellipse cx="24" cy="41" rx="14" ry="2" fill="rgba(0,0,0,0.25)"/>
    <!-- notepad body -->
    <rect x="9" y="11" width="26" height="28" rx="2" fill="url(#pad-blog)" stroke="#B0A890" stroke-width="0.8"/>
    <!-- spiral binding -->
    <rect x="9" y="11" width="5" height="28" rx="1" fill="url(#binding-blog)" stroke="#601010" stroke-width="0.5"/>
    <!-- spiral holes/coils -->
    <circle cx="11.5" cy="15" r="2" fill="#F4F0E8" stroke="#802020" stroke-width="0.6"/>
    <circle cx="11.5" cy="21" r="2" fill="#F4F0E8" stroke="#802020" stroke-width="0.6"/>
    <circle cx="11.5" cy="27" r="2" fill="#F4F0E8" stroke="#802020" stroke-width="0.6"/>
    <circle cx="11.5" cy="33" r="2" fill="#F4F0E8" stroke="#802020" stroke-width="0.6"/>
    <!-- ruled lines on page -->
    <line x1="17" y1="17" x2="32" y2="17" stroke="#B0C8E0" stroke-width="0.8"/>
    <line x1="17" y1="20" x2="32" y2="20" stroke="#B0C8E0" stroke-width="0.8"/>
    <line x1="17" y1="23" x2="32" y2="23" stroke="#B0C8E0" stroke-width="0.8"/>
    <line x1="17" y1="26" x2="32" y2="26" stroke="#B0C8E0" stroke-width="0.8"/>
    <line x1="17" y1="29" x2="32" y2="29" stroke="#B0C8E0" stroke-width="0.8"/>
    <line x1="17" y1="32" x2="32" y2="32" stroke="#B0C8E0" stroke-width="0.8"/>
    <!-- margin line -->
    <line x1="19" y1="13" x2="19" y2="37" stroke="#E0A0A0" stroke-width="0.6"/>
    <!-- written text hints -->
    <rect x="21" y="16" width="9" height="1.2" rx="0.6" fill="#5060A0" opacity="0.5"/>
    <rect x="20" y="19" width="11" height="1.2" rx="0.6" fill="#5060A0" opacity="0.4"/>
    <rect x="20" y="22" width="8" height="1.2" rx="0.6" fill="#5060A0" opacity="0.45"/>
    <!-- pencil (diagonal, resting on notepad) -->
    <g transform="rotate(-35 30 20)">
      <!-- pencil body -->
      <rect x="28" y="8" width="4.5" height="16" rx="0.5" fill="url(#pencil-blog)" stroke="#A07818" stroke-width="0.5"/>
      <!-- pencil highlight -->
      <rect x="28.5" y="9" width="1.2" height="14" rx="0.4" fill="rgba(255,255,255,0.35)"/>
      <!-- eraser ferrule -->
      <rect x="28" y="8" width="4.5" height="2.5" rx="0.3" fill="#B8B8B8" stroke="#888" stroke-width="0.4"/>
      <!-- eraser -->
      <rect x="28.2" y="6" width="4.1" height="2" rx="0.8" fill="#F0A0A0" stroke="#C07070" stroke-width="0.4"/>
      <!-- pencil tip -->
      <path d="M28 24 L30.25 29 L32.5 24 Z" fill="#D4A040" stroke="#A07818" stroke-width="0.4"/>
      <!-- graphite tip -->
      <path d="M29.5 27 L30.25 29 L31 27 Z" fill="#404040"/>
    </g>
    <!-- pad edge highlight -->
    <line x1="9.5" y1="12" x2="9.5" y2="38" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
  </svg>`,

};

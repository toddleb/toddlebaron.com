// src/themes/sgi-irix/catalog-icons.ts
// SGI IRIX style catalog icons — 32x32, metallic gradients, no shelf platform

export const catalogIcons: Record<string, string> = {

  "Web Development": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cat-webdev-globe" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#60B8E8"/>
        <stop offset="50%" stop-color="#2880C0"/>
        <stop offset="100%" stop-color="#104880"/>
      </linearGradient>
      <linearGradient id="cat-webdev-land" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#70C870"/>
        <stop offset="100%" stop-color="#308840"/>
      </linearGradient>
      <radialGradient id="cat-webdev-hi" cx="35%" cy="30%" r="45%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.45)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
      </radialGradient>
    </defs>
    <!-- globe sphere -->
    <circle cx="16" cy="16" r="13" fill="url(#cat-webdev-globe)" stroke="#0A3060" stroke-width="0.8"/>
    <!-- land masses -->
    <ellipse cx="12" cy="13" rx="4" ry="5" fill="url(#cat-webdev-land)" opacity="0.85"/>
    <ellipse cx="20" cy="18" rx="5" ry="3.5" fill="url(#cat-webdev-land)" opacity="0.85"/>
    <ellipse cx="10" cy="21" rx="2.5" ry="2" fill="url(#cat-webdev-land)" opacity="0.7"/>
    <!-- latitude lines -->
    <ellipse cx="16" cy="16" rx="13" ry="4" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.6"/>
    <ellipse cx="16" cy="16" rx="13" ry="9" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
    <!-- meridian line -->
    <line x1="16" y1="3" x2="16" y2="29" stroke="rgba(255,255,255,0.2)" stroke-width="0.6"/>
    <!-- sphere highlight -->
    <circle cx="16" cy="16" r="13" fill="url(#cat-webdev-hi)"/>
    <!-- rim -->
    <circle cx="16" cy="16" r="13" fill="none" stroke="#0A3060" stroke-width="0.8"/>
  </svg>`,

  "Mobile": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cat-mobile-body" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stop-color="#B0B8D0"/>
        <stop offset="50%" stop-color="#7880A8"/>
        <stop offset="100%" stop-color="#484E70"/>
      </linearGradient>
      <linearGradient id="cat-mobile-screen" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stop-color="#1828A0"/>
        <stop offset="100%" stop-color="#080E50"/>
      </linearGradient>
      <linearGradient id="cat-mobile-hi" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stop-color="rgba(255,255,255,0.4)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
      </linearGradient>
    </defs>
    <!-- phone body -->
    <rect x="9" y="3" width="14" height="26" rx="2.5" fill="url(#cat-mobile-body)" stroke="#303050" stroke-width="0.8"/>
    <!-- body highlight -->
    <rect x="9" y="3" width="14" height="26" rx="2.5" fill="url(#cat-mobile-hi)" opacity="0.5"/>
    <!-- screen bezel -->
    <rect x="10.5" y="7" width="11" height="17" rx="1" fill="#101828" stroke="#202840" stroke-width="0.5"/>
    <!-- screen -->
    <rect x="11.5" y="8" width="9" height="15" rx="0.5" fill="url(#cat-mobile-screen)"/>
    <!-- screen glow -->
    <rect x="12" y="8.5" width="4" height="6" rx="0.3" fill="rgba(80,140,255,0.3)"/>
    <!-- home button -->
    <circle cx="16" cy="27.5" r="1.2" fill="#585E80" stroke="#404060" stroke-width="0.5"/>
    <!-- speaker -->
    <rect x="14" y="5" width="4" height="1" rx="0.5" fill="#404060"/>
    <!-- edge highlight -->
    <line x1="9.5" y1="4" x2="9.5" y2="28" stroke="rgba(255,255,255,0.35)" stroke-width="0.7"/>
  </svg>`,

  "CLI Tools": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cat-cli-term" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stop-color="#484858"/>
        <stop offset="100%" stop-color="#202028"/>
      </linearGradient>
      <linearGradient id="cat-cli-wrench" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#C8C8D8"/>
        <stop offset="50%" stop-color="#9898B0"/>
        <stop offset="100%" stop-color="#606080"/>
      </linearGradient>
    </defs>
    <!-- terminal window -->
    <rect x="3" y="5" width="26" height="20" rx="2" fill="url(#cat-cli-term)" stroke="#181820" stroke-width="0.8"/>
    <!-- title bar -->
    <rect x="3" y="5" width="26" height="4.5" rx="2" fill="#383848" stroke="#181820" stroke-width="0.5"/>
    <!-- title bar dots -->
    <circle cx="7" cy="7.25" r="1.1" fill="#C04040"/>
    <circle cx="10.5" cy="7.25" r="1.1" fill="#C0A020"/>
    <circle cx="14" cy="7.25" r="1.1" fill="#40A040"/>
    <!-- green terminal text -->
    <rect x="6" y="12" width="8" height="1.2" rx="0.6" fill="#40E860" opacity="0.85"/>
    <rect x="6" y="15" width="14" height="1.2" rx="0.6" fill="#40E860" opacity="0.7"/>
    <rect x="6" y="18" width="6" height="1.2" rx="0.6" fill="#40E860" opacity="0.8"/>
    <!-- cursor -->
    <rect x="6" y="21" width="4" height="1.4" rx="0.3" fill="#60FF80" opacity="0.9"/>
    <!-- prompt symbol -->
    <path d="M6 12 L8.5 13.2 L6 14.4" fill="none" stroke="#80FFA0" stroke-width="0.8" opacity="0.7"/>
    <!-- wrench overlay -->
    <g transform="translate(18, 18) rotate(-30)">
      <rect x="-2" y="-7" width="4" height="10" rx="1" fill="url(#cat-cli-wrench)" stroke="#505060" stroke-width="0.5"/>
      <circle cx="0" cy="-7" r="3" fill="url(#cat-cli-wrench)" stroke="#505060" stroke-width="0.5"/>
      <circle cx="0" cy="-7" r="1.5" fill="#404050"/>
      <rect x="-2" y="3" width="4" height="4" rx="1" fill="url(#cat-cli-wrench)" stroke="#505060" stroke-width="0.5"/>
    </g>
  </svg>`,

  "Databases": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cat-db-cyl" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stop-color="#70B8E0"/>
        <stop offset="50%" stop-color="#3878B0"/>
        <stop offset="100%" stop-color="#1848780"/>
      </linearGradient>
      <linearGradient id="cat-db-top" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#90D0F0"/>
        <stop offset="100%" stop-color="#5098C8"/>
      </linearGradient>
      <linearGradient id="cat-db-stripe" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(255,255,255,0.15)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
      </linearGradient>
    </defs>
    <!-- cylinder body -->
    <rect x="6" y="10" width="20" height="18" rx="0.5" fill="url(#cat-db-cyl)" stroke="#1848780" stroke-width="0.8"/>
    <!-- highlight stripe -->
    <rect x="7" y="10" width="5" height="18" fill="url(#cat-db-stripe)"/>
    <!-- bottom ellipse -->
    <ellipse cx="16" cy="28" rx="10" ry="3" fill="#2868A0" stroke="#1848780" stroke-width="0.6"/>
    <!-- top ellipse -->
    <ellipse cx="16" cy="10" rx="10" ry="3" fill="url(#cat-db-top)" stroke="#1848780" stroke-width="0.6"/>
    <!-- mid divider lines (stacked disks) -->
    <ellipse cx="16" cy="16" rx="10" ry="2.5" fill="none" stroke="#1060980" stroke-width="0.7" opacity="0.6"/>
    <ellipse cx="16" cy="22" rx="10" ry="2.5" fill="none" stroke="#1060980" stroke-width="0.7" opacity="0.6"/>
    <!-- connector dots -->
    <circle cx="16" cy="10" r="1.5" fill="#C0E8FF" opacity="0.7"/>
  </svg>`,

  "AI Agents": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cat-ai-head" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stop-color="#A0C8E8"/>
        <stop offset="50%" stop-color="#6090C0"/>
        <stop offset="100%" stop-color="#304878"/>
      </linearGradient>
      <linearGradient id="cat-ai-body" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stop-color="#8098C0"/>
        <stop offset="100%" stop-color="#405080"/>
      </linearGradient>
      <linearGradient id="cat-ai-eye" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#80F0FF"/>
        <stop offset="100%" stop-color="#20A8D0"/>
      </linearGradient>
    </defs>
    <!-- antenna -->
    <line x1="16" y1="2" x2="16" y2="6" stroke="#6080A8" stroke-width="1.2"/>
    <circle cx="16" cy="2" r="1.2" fill="#80C0FF"/>
    <!-- head -->
    <rect x="8" y="6" width="16" height="12" rx="2.5" fill="url(#cat-ai-head)" stroke="#304878" stroke-width="0.8"/>
    <!-- eyes -->
    <ellipse cx="12.5" cy="11" rx="2.5" ry="2.5" fill="url(#cat-ai-eye)" stroke="#106888" stroke-width="0.5"/>
    <ellipse cx="19.5" cy="11" rx="2.5" ry="2.5" fill="url(#cat-ai-eye)" stroke="#106888" stroke-width="0.5"/>
    <!-- eye gleam -->
    <ellipse cx="11.8" cy="10.2" rx="0.8" ry="0.7" fill="rgba(255,255,255,0.7)"/>
    <ellipse cx="18.8" cy="10.2" rx="0.8" ry="0.7" fill="rgba(255,255,255,0.7)"/>
    <!-- mouth / speaker grill -->
    <rect x="11" y="15" width="10" height="1.5" rx="0.75" fill="#203050" opacity="0.7"/>
    <!-- body -->
    <rect x="9" y="18" width="14" height="10" rx="2" fill="url(#cat-ai-body)" stroke="#304878" stroke-width="0.8"/>
    <!-- chest panel -->
    <rect x="11" y="20" width="10" height="6" rx="1" fill="#283850" opacity="0.6"/>
    <!-- circuit dots on chest -->
    <circle cx="13" cy="22" r="0.8" fill="#60B0FF" opacity="0.8"/>
    <circle cx="16" cy="22" r="0.8" fill="#60B0FF" opacity="0.8"/>
    <circle cx="19" cy="22" r="0.8" fill="#60B0FF" opacity="0.8"/>
    <line x1="13" y1="22" x2="19" y2="22" stroke="#4080C0" stroke-width="0.5" opacity="0.6"/>
    <circle cx="14.5" cy="24.5" r="0.8" fill="#40D0FF" opacity="0.7"/>
    <circle cx="17.5" cy="24.5" r="0.8" fill="#40D0FF" opacity="0.7"/>
    <!-- arms -->
    <rect x="4" y="19" width="5" height="3" rx="1.5" fill="url(#cat-ai-body)" stroke="#304878" stroke-width="0.6"/>
    <rect x="23" y="19" width="5" height="3" rx="1.5" fill="url(#cat-ai-body)" stroke="#304878" stroke-width="0.6"/>
    <!-- head highlight -->
    <rect x="8.5" y="6.5" width="7" height="3" rx="1" fill="rgba(255,255,255,0.2)"/>
  </svg>`,

  "RAG Systems": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cat-rag-brain" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stop-color="#D090E0"/>
        <stop offset="50%" stop-color="#9050B8"/>
        <stop offset="100%" stop-color="#582880"/>
      </linearGradient>
      <linearGradient id="cat-rag-search" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#E0E0E8"/>
        <stop offset="100%" stop-color="#9090A8"/>
      </linearGradient>
    </defs>
    <!-- brain left lobe -->
    <path d="M6 16 Q5 10 10 8 Q13 7 15 10 Q15 14 15 18 Q13 21 10 20 Q6 19 6 16 Z" fill="url(#cat-rag-brain)" stroke="#401860" stroke-width="0.7"/>
    <!-- brain right lobe -->
    <path d="M17 10 Q19 7 22 8 Q27 10 26 16 Q26 19 22 20 Q19 21 17 18 Q17 14 17 10 Z" fill="url(#cat-rag-brain)" stroke="#401860" stroke-width="0.7"/>
    <!-- brain center divot -->
    <line x1="16" y1="9" x2="16" y2="20" stroke="#401860" stroke-width="0.8"/>
    <!-- fold lines left -->
    <path d="M8 12 Q10 11 12 13" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
    <path d="M7 17 Q9 15 12 17" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="0.7"/>
    <!-- fold lines right -->
    <path d="M20 12 Q22 11 24 13" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
    <path d="M20 17 Q22 15 24 17" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="0.7"/>
    <!-- magnifying glass -->
    <circle cx="22" cy="24" r="5" fill="none" stroke="url(#cat-rag-search)" stroke-width="2"/>
    <circle cx="22" cy="24" r="3.5" fill="rgba(160,180,220,0.2)"/>
    <line x1="26" y1="28" x2="29" y2="31" stroke="url(#cat-rag-search)" stroke-width="2" stroke-linecap="round"/>
    <!-- brain highlight -->
    <ellipse cx="11" cy="10" rx="2.5" ry="1.5" fill="rgba(255,255,255,0.25)"/>
  </svg>`,

  "ML Pipelines": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cat-ml-bar1" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stop-color="#2868B0"/>
        <stop offset="100%" stop-color="#60A8E0"/>
      </linearGradient>
      <linearGradient id="cat-ml-bar2" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stop-color="#186820"/>
        <stop offset="100%" stop-color="#50C060"/>
      </linearGradient>
      <linearGradient id="cat-ml-bar3" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stop-color="#804010"/>
        <stop offset="100%" stop-color="#E08040"/>
      </linearGradient>
      <linearGradient id="cat-ml-line" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#A0B8E0"/>
        <stop offset="100%" stop-color="#6080C0"/>
      </linearGradient>
    </defs>
    <!-- chart axes -->
    <line x1="5" y1="4" x2="5" y2="26" stroke="#6878A0" stroke-width="1"/>
    <line x1="5" y1="26" x2="29" y2="26" stroke="#6878A0" stroke-width="1"/>
    <!-- bars -->
    <rect x="7" y="16" width="5" height="10" fill="url(#cat-ml-bar1)" stroke="#184880" stroke-width="0.5"/>
    <rect x="14" y="10" width="5" height="16" fill="url(#cat-ml-bar2)" stroke="#0F4818" stroke-width="0.5"/>
    <rect x="21" y="13" width="5" height="13" fill="url(#cat-ml-bar3)" stroke="#602810" stroke-width="0.5"/>
    <!-- bar tops highlight -->
    <rect x="7" y="16" width="5" height="2" fill="rgba(255,255,255,0.25)"/>
    <rect x="14" y="10" width="5" height="2" fill="rgba(255,255,255,0.25)"/>
    <rect x="21" y="13" width="5" height="2" fill="rgba(255,255,255,0.25)"/>
    <!-- trend line -->
    <polyline points="9.5,23 16.5,18 23.5,15" fill="none" stroke="url(#cat-ml-line)" stroke-width="1.5" stroke-dasharray="2,1.5"/>
    <!-- data points -->
    <circle cx="9.5" cy="23" r="1.5" fill="#A0C8FF" stroke="#3060A0" stroke-width="0.5"/>
    <circle cx="16.5" cy="18" r="1.5" fill="#A0C8FF" stroke="#3060A0" stroke-width="0.5"/>
    <circle cx="23.5" cy="15" r="1.5" fill="#A0C8FF" stroke="#3060A0" stroke-width="0.5"/>
  </svg>`,

  "Cloud & DevOps": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cat-cloud-body" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stop-color="#D0E0F0"/>
        <stop offset="60%" stop-color="#A0B8D8"/>
        <stop offset="100%" stop-color="#7090B8"/>
      </linearGradient>
      <linearGradient id="cat-cloud-gear" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#C8C8D8"/>
        <stop offset="100%" stop-color="#7878A0"/>
      </linearGradient>
    </defs>
    <!-- cloud shape -->
    <path d="M6 20 Q4 20 4 17 Q4 14 7 14 Q7 10 11 10 Q13 7 17 8 Q21 7 23 10 Q27 10 27 14 Q29 15 28 18 Q28 20 26 20 Z" fill="url(#cat-cloud-body)" stroke="#5070A0" stroke-width="0.7"/>
    <!-- cloud highlight -->
    <path d="M8 14 Q10 12 13 12 Q15 11 17 12" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
    <!-- small gear -->
    <circle cx="14" cy="25" r="4.5" fill="url(#cat-cloud-gear)" stroke="#505070" stroke-width="0.6"/>
    <rect x="13" y="19.5" width="2" height="2.5" rx="0.4" fill="url(#cat-cloud-gear)" stroke="#505070" stroke-width="0.4"/>
    <rect x="13" y="28" width="2" height="2.5" rx="0.4" fill="url(#cat-cloud-gear)" stroke="#505070" stroke-width="0.4"/>
    <rect x="8.5" y="24" width="2.5" height="2" rx="0.4" fill="url(#cat-cloud-gear)" stroke="#505070" stroke-width="0.4"/>
    <rect x="17" y="24" width="2.5" height="2" rx="0.4" fill="url(#cat-cloud-gear)" stroke="#505070" stroke-width="0.4"/>
    <circle cx="14" cy="25" r="2" fill="#7880A0" stroke="#404060" stroke-width="0.5"/>
    <circle cx="14" cy="25" r="0.9" fill="#A0A8C0"/>
    <!-- pipe / arrow -->
    <path d="M20 21 L20 28 L24 28" fill="none" stroke="#4060A8" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M23 26.5 L25 28 L23 29.5" fill="none" stroke="#4060A8" stroke-width="1.2" stroke-linecap="round"/>
  </svg>`,

  "Containers": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cat-cont-box" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stop-color="#70C8E8"/>
        <stop offset="50%" stop-color="#2888C0"/>
        <stop offset="100%" stop-color="#105080"/>
      </linearGradient>
      <linearGradient id="cat-cont-top" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#A0D8F0"/>
        <stop offset="100%" stop-color="#4098C8"/>
      </linearGradient>
      <linearGradient id="cat-cont-side" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1868A0"/>
        <stop offset="100%" stop-color="#0A3860"/>
      </linearGradient>
    </defs>
    <!-- box front face -->
    <rect x="6" y="14" width="18" height="14" fill="url(#cat-cont-box)" stroke="#104878" stroke-width="0.7"/>
    <!-- box top face -->
    <polygon points="6,14 14,8 30,8 24,14" fill="url(#cat-cont-top)" stroke="#104878" stroke-width="0.7"/>
    <!-- box right face -->
    <polygon points="24,14 30,8 30,22 24,28" fill="url(#cat-cont-side)" stroke="#104878" stroke-width="0.7"/>
    <!-- front panel lines (cargo markings) -->
    <line x1="6" y1="21" x2="24" y2="21" stroke="rgba(255,255,255,0.25)" stroke-width="0.7"/>
    <line x1="15" y1="14" x2="15" y2="28" stroke="rgba(255,255,255,0.2)" stroke-width="0.7"/>
    <!-- top panel lines -->
    <line x1="10" y1="8" x2="10.5" y2="14" stroke="rgba(255,255,255,0.2)" stroke-width="0.5" transform="skewX(-10)"/>
    <!-- whale fin hint (Docker nod) -->
    <path d="M8 17 Q10 14 12 17" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="0.5"/>
    <!-- front highlight -->
    <line x1="6.5" y1="15" x2="6.5" y2="27" stroke="rgba(255,255,255,0.35)" stroke-width="0.6"/>
    <line x1="7" y1="14.5" x2="23" y2="14.5" stroke="rgba(255,255,255,0.35)" stroke-width="0.6"/>
  </svg>`,

  "Security": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cat-sec-shield" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stop-color="#A0B8D8"/>
        <stop offset="50%" stop-color="#607898"/>
        <stop offset="100%" stop-color="#304060"/>
      </linearGradient>
      <linearGradient id="cat-sec-lock" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stop-color="#E8D060"/>
        <stop offset="50%" stop-color="#C0A020"/>
        <stop offset="100%" stop-color="#907010"/>
      </linearGradient>
    </defs>
    <!-- shield body -->
    <path d="M16 3 L28 7 L28 18 Q28 26 16 30 Q4 26 4 18 L4 7 Z" fill="url(#cat-sec-shield)" stroke="#203050" stroke-width="0.8"/>
    <!-- shield highlight -->
    <path d="M16 4.5 L26.5 8 L26.5 10" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
    <!-- shield inner edge -->
    <path d="M16 6 L25 9.5 L25 18 Q25 24 16 27.5 Q7 24 7 18 L7 9.5 Z" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.6"/>
    <!-- lock body -->
    <rect x="11" y="16" width="10" height="9" rx="1.5" fill="url(#cat-sec-lock)" stroke="#806010" stroke-width="0.6"/>
    <!-- lock shackle -->
    <path d="M13.5 16 L13.5 13 Q13.5 10 16 10 Q18.5 10 18.5 13 L18.5 16" fill="none" stroke="url(#cat-sec-lock)" stroke-width="2" stroke-linecap="round"/>
    <!-- keyhole -->
    <circle cx="16" cy="20.5" r="1.8" fill="#604808" stroke="#402800" stroke-width="0.4"/>
    <rect x="15.3" y="21" width="1.4" height="2.5" rx="0.5" fill="#604808"/>
    <!-- lock highlight -->
    <rect x="11.5" y="16.5" width="3.5" height="2" rx="0.5" fill="rgba(255,255,255,0.25)"/>
  </svg>`,

  "Turborepo": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cat-turbo-bolt" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#FFF080"/>
        <stop offset="50%" stop-color="#F0C020"/>
        <stop offset="100%" stop-color="#C08010"/>
      </linearGradient>
      <radialGradient id="cat-turbo-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgba(255,220,40,0.4)"/>
        <stop offset="100%" stop-color="rgba(255,220,40,0)"/>
      </radialGradient>
      <linearGradient id="cat-turbo-circle" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stop-color="#484858"/>
        <stop offset="100%" stop-color="#202028"/>
      </linearGradient>
    </defs>
    <!-- dark circle bg -->
    <circle cx="16" cy="16" r="13" fill="url(#cat-turbo-circle)" stroke="#101018" stroke-width="0.8"/>
    <!-- glow -->
    <circle cx="16" cy="16" r="11" fill="url(#cat-turbo-glow)"/>
    <!-- speed lines -->
    <line x1="4" y1="14" x2="12" y2="14" stroke="#806010" stroke-width="0.8" opacity="0.6"/>
    <line x1="3" y1="17" x2="11" y2="17" stroke="#806010" stroke-width="0.8" opacity="0.5"/>
    <line x1="4" y1="20" x2="12" y2="20" stroke="#806010" stroke-width="0.8" opacity="0.4"/>
    <!-- lightning bolt -->
    <polygon points="19,4 12,17 17,17 13,28 22,15 17,15" fill="url(#cat-turbo-bolt)" stroke="#A07010" stroke-width="0.6"/>
    <!-- bolt highlight -->
    <line x1="18" y1="5.5" x2="14" y2="14" stroke="rgba(255,255,255,0.4)" stroke-width="0.8"/>
  </svg>`,

  "Documentation": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cat-doc-page" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stop-color="#F0EEF8"/>
        <stop offset="100%" stop-color="#C8C4E0"/>
      </linearGradient>
      <linearGradient id="cat-doc-fold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#9080C0"/>
        <stop offset="100%" stop-color="#7060A8"/>
      </linearGradient>
      <linearGradient id="cat-doc-pen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#F0C840"/>
        <stop offset="100%" stop-color="#C09820"/>
      </linearGradient>
    </defs>
    <!-- document shadow -->
    <rect x="10" y="5" width="17" height="22" rx="1.5" fill="rgba(0,0,0,0.15)" transform="translate(1.5,1.5)"/>
    <!-- document body -->
    <rect x="8" y="4" width="17" height="22" rx="1.5" fill="url(#cat-doc-page)" stroke="#9080B0" stroke-width="0.7"/>
    <!-- dog-ear -->
    <path d="M20 4 L25 4 L25 9 Z" fill="url(#cat-doc-fold)"/>
    <path d="M20 4 L25 9 L20 9 Z" fill="#E0DCF0"/>
    <!-- text lines -->
    <rect x="11" y="12" width="10" height="1.2" rx="0.6" fill="#8070A8" opacity="0.7"/>
    <rect x="11" y="15" width="12" height="1.1" rx="0.55" fill="#A090C0" opacity="0.5"/>
    <rect x="11" y="17.5" width="11" height="1.1" rx="0.55" fill="#A090C0" opacity="0.5"/>
    <rect x="11" y="20" width="12" height="1.1" rx="0.55" fill="#A090C0" opacity="0.45"/>
    <rect x="11" y="22.5" width="9" height="1.1" rx="0.55" fill="#A090C0" opacity="0.4"/>
    <!-- pen / stylus -->
    <g transform="rotate(-40 24 22)">
      <rect x="23" y="18" width="3" height="10" rx="0.5" fill="url(#cat-doc-pen)" stroke="#A07818" stroke-width="0.4"/>
      <rect x="23.3" y="19" width="0.9" height="8" rx="0.3" fill="rgba(255,255,255,0.3)"/>
      <rect x="23" y="18" width="3" height="1.8" rx="0.3" fill="#B0B0B0" stroke="#888" stroke-width="0.3"/>
      <path d="M23 28 L24.5 31 L26 28 Z" fill="#D4A040" stroke="#A07818" stroke-width="0.3"/>
      <path d="M24 30 L24.5 31 L25 30 Z" fill="#404040"/>
    </g>
    <!-- doc highlight -->
    <line x1="8.5" y1="5" x2="8.5" y2="25" stroke="rgba(255,255,255,0.45)" stroke-width="0.7"/>
  </svg>`,

  "Design Systems": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cat-ds-palette" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stop-color="#F0EAD0"/>
        <stop offset="100%" stop-color="#C8BEA0"/>
      </linearGradient>
      <linearGradient id="cat-ds-brush" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#C8C8D8"/>
        <stop offset="100%" stop-color="#808098"/>
      </linearGradient>
    </defs>
    <!-- palette body -->
    <path d="M5 16 Q4 8 11 5 Q18 3 23 7 Q28 11 27 17 Q26 22 21 24 Q18 25 17 22 Q16 20 14 21 Q10 22 8 20 Q5 18 5 16 Z" fill="url(#cat-ds-palette)" stroke="#907848" stroke-width="0.7"/>
    <!-- palette thumb hole -->
    <ellipse cx="20" cy="20" rx="3" ry="3.5" fill="rgba(0,0,0,0)" stroke="#907848" stroke-width="0.8"/>
    <ellipse cx="20" cy="20" rx="3" ry="3.5" fill="rgba(140,110,60,0.15)"/>
    <!-- paint daubs -->
    <circle cx="10" cy="9" r="2.5" fill="#C04040" stroke="#801818" stroke-width="0.5"/>
    <circle cx="16" cy="7" r="2.5" fill="#F0C020" stroke="#A07808" stroke-width="0.5"/>
    <circle cx="22" cy="9" r="2.5" fill="#3880D8" stroke="#1848A0" stroke-width="0.5"/>
    <circle cx="10" cy="16" r="2.5" fill="#40A848" stroke="#186018" stroke-width="0.5"/>
    <circle cx="25" cy="14" r="2" fill="#9040C8" stroke="#602090" stroke-width="0.5"/>
    <!-- brush -->
    <g transform="rotate(30 24 24)">
      <rect x="22" y="14" width="2.5" height="12" rx="0.5" fill="url(#cat-ds-brush)" stroke="#505060" stroke-width="0.4"/>
      <rect x="22.3" y="15" width="0.8" height="10" rx="0.3" fill="rgba(255,255,255,0.3)"/>
      <!-- ferrule -->
      <rect x="22" y="22" width="2.5" height="2" fill="#909090" stroke="#606060" stroke-width="0.3"/>
      <!-- bristles -->
      <path d="M22 24 Q23.25 28 24.5 24 Z" fill="#604020" stroke="#402010" stroke-width="0.3"/>
    </g>
    <!-- palette highlight -->
    <path d="M8 12 Q10 9 14 8" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.8"/>
  </svg>`,

};

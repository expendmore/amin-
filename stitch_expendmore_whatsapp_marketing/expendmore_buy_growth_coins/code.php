<?php
require_once __DIR__ . '/../auth_core/middleware.php';
checkAuth();
?>
<!DOCTYPE html><html class="dark" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>ExpendMore | Purchase Growth Coins</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@600;700;800&amp;family=Inter:wght@400&amp;family=Geist:wght@500;600&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "primary-fixed-dim": "#3de273",
                    "tertiary-container": "#63c9b9",
                    "secondary-fixed": "#9cf0ff",
                    "on-error": "#690005",
                    "surface-container-lowest": "#0e0e0e",
                    "on-primary-fixed": "#002109",
                    "tertiary": "#80e5d5",
                    "error": "#ffb4ab",
                    "secondary-fixed-dim": "#00daf3",
                    "on-tertiary-container": "#005249",
                    "surface-bright": "#3a3939",
                    "primary": "#4ff07f",
                    "surface-variant": "#353534",
                    "tertiary-fixed": "#8ff4e3",
                    "surface-container-high": "#2a2a2a",
                    "on-secondary-container": "#00616d",
                    "primary-container": "#25d366",
                    "on-secondary-fixed": "#001f24",
                    "on-surface-variant": "#bbcbb9",
                    "inverse-primary": "#006d2f",
                    "secondary-container": "#00e3fd",
                    "surface-container": "#201f1f",
                    "on-secondary-fixed-variant": "#004f58",
                    "surface-container-low": "#1c1b1b",
                    "error-container": "#93000a",
                    "inverse-surface": "#e5e2e1",
                    "on-tertiary-fixed-variant": "#005047",
                    "on-primary": "#003915",
                    "tertiary-fixed-dim": "#72d8c8",
                    "on-surface": "#e5e2e1",
                    "on-secondary": "#00363d",
                    "on-primary-container": "#005523",
                    "background": "#131313",
                    "on-background": "#e5e2e1",
                    "on-tertiary-fixed": "#00201c",
                    "outline-variant": "#3c4a3d",
                    "secondary": "#bdf4ff",
                    "inverse-on-surface": "#313030",
                    "on-error-container": "#ffdad6",
                    "on-primary-fixed-variant": "#005322",
                    "surface-tint": "#3de273",
                    "surface-container-highest": "#353534",
                    "primary-fixed": "#66ff8e",
                    "outline": "#869584",
                    "surface": "#131313",
                    "on-tertiary": "#003731",
                    "surface-dim": "#131313"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "margin-desktop": "40px",
                    "lg": "48px",
                    "xs": "4px",
                    "margin-mobile": "16px",
                    "gutter": "24px",
                    "base": "8px",
                    "md": "24px",
                    "xl": "80px",
                    "sm": "12px"
            },
            "fontFamily": {
                    "headline-lg-mobile": ["Hanken Grotesk"],
                    "label-xs": ["Geist"],
                    "label-sm": ["Geist"],
                    "body-lg": ["Inter"],
                    "headline-md": ["Hanken Grotesk"],
                    "display": ["Hanken Grotesk"],
                    "headline-lg": ["Hanken Grotesk"],
                    "body-md": ["Inter"]
            },
            "fontSize": {
                    "headline-lg-mobile": ["24px", {"lineHeight": "32px", "fontWeight": "700"}],
                    "label-xs": ["10px", {"lineHeight": "14px", "letterSpacing": "0.1em", "fontWeight": "600"}],
                    "label-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                    "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                    "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                    "display": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "800"}],
                    "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "700"}],
                    "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}]
            }
          },
        },
      }
    </script>
<style>
        .glass-card {
            background: rgba(22, 22, 22, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(42, 42, 42, 1);
        }
        .whatsapp-gradient {
            background: linear-gradient(135deg, #25d366 0%, #3de273 100%);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #131313;
        }
        ::-webkit-scrollbar-thumb {
            background: #353534;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #4ff07f;
        }
    </style>
</head>
<body class="bg-background text-on-background font-body-md selection:bg-primary/30 min-h-screen flex overflow-hidden">
<!-- SideNavBar -->
<aside class="fixed left-0 top-0 h-full w-[280px] bg-surface-container-low border-r border-outline-variant z-50 flex flex-col py-lg px-md hidden md:flex">
<div class="mb-xl px-sm flex items-center gap-base"><div class="flex items-center gap-base"><div class="w-48 h-16 overflow-hidden"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNONUUBYsiqqiAnMJ867m3LCPooK2ogPibWfPt7AEiDFRUSFDXD3cIZ7ydJaBmnOZ5R0uA9cCfJ4JyHyGN0qelUP3cn9j4wBoYXw845dOoD3dNfc0kh96zAnTTBa5dwp8bHe-KaX1VXJAyPIgQTCnJ5VMBYn_1h8j9ZLXnPVvLCGGZDGzrkP3qAzy9siDHp_tgaTm1OI1vEX-3Snf1kGDDGTRnwRJUzp88LzgEtJqTnEfi0siL7NbAVZmENp82b1Gf" alt="ExpendMore Logo" class="max-w-full h-auto"></div><div><h2 class="text-headline-md font-headline-md text-primary tracking-tight">ExpendMore</h2><p class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest">Marketing API</p></div></div></div>
<nav class="flex-1 space-y-xs">
<a class="flex items-center gap-sm px-md py-sm text-on-surface-variant hover:bg-surface-variant/50 transition-all duration-300 rounded-lg group" href="../expendmore_dashboard/code.php">
<span class="material-symbols-outlined group-hover:text-primary transition-colors">dashboard</span>
<span class="text-body-md font-body-md">Dashboard</span>
</a>
<a class="flex items-center gap-sm px-md py-sm text-on-surface-variant hover:bg-surface-variant/50 transition-all duration-300 rounded-lg group" href="../expendmore_campaign_manager/code.php">
<span class="material-symbols-outlined group-hover:text-primary transition-colors">campaign</span>
<span class="text-body-md font-body-md">Campaigns</span>
</a>
<a class="flex items-center gap-sm px-md py-sm bg-primary-container/10 text-primary-fixed-dim border-r-4 border-primary-fixed-dim transition-all duration-300 rounded-l-lg group translate-x-1" href="../expendmore_buy_growth_coins/code.php">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">monetization_on</span>
<span class="text-body-md font-body-md font-bold">Coins</span>
</a>
<a class="flex items-center gap-sm px-md py-sm text-on-surface-variant hover:bg-surface-variant/50 transition-all duration-300 rounded-lg group" href="#">
<span class="material-symbols-outlined group-hover:text-primary transition-colors">settings</span>
<span class="text-body-md font-body-md">Settings</span>
</a>
</nav>
<button class="whatsapp-gradient text-on-primary-container font-bold py-sm rounded-xl mb-xl hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-xs shadow-lg shadow-primary/20">
<span class="material-symbols-outlined">add_circle</span>
            Start Campaign
        </button>
<div class="mt-auto space-y-xs pt-md border-t border-outline-variant">
<a class="flex items-center gap-sm px-md py-sm text-on-surface-variant hover:text-secondary-fixed transition-colors text-label-sm" href="#">
<span class="material-symbols-outlined">help</span>
                Help Center
            </a>
<a class="flex items-center gap-sm px-md py-sm text-on-surface-variant hover:text-error transition-colors text-label-sm" href="../auth_core/logout.php">
<span class="material-symbols-outlined">logout</span>
                Logout
            </a>
</div>
</aside>
<!-- Main Content -->
<main class="flex-1 md:ml-[280px] h-screen overflow-y-auto flex flex-col relative">
<!-- Animated Background Shader (Ambient Growth Energy) -->
<div class="absolute inset-0 pointer-events-none z-0 opacity-40">

</div>
<!-- TopAppBar -->
<header class="flex justify-between items-center w-full px-margin-desktop h-16 sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant">
<div class="flex items-center gap-lg">
<div class="w-48 h-16 md:hidden overflow-hidden"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiNs4WUCmz5RrgwR1zEpmFihOWKynW17RdoJR6eBMobVXlT-ByeCG6b4h3ykZ5fi7QVgvrXKvgiQ9pkudhWv3vmNkCuYv1I0toa86OW1ERikOERTXjOzTqJUlec-sJ1e0SW-5F2N44yighXuaY0b8fuB9-csSnixcyeKM0Y4vDvAdK7MetIhePd0DRW2ckWDn7zK1U5Qi34UzXfT4xaheeLPHfrBS2nDxu-26nJrFMuhBsffAgn3KMDz_YpeyIm3xT" alt="ExpendMore Logo" class="max-w-full h-auto"></div>
<nav class="hidden lg:flex items-center gap-md">
<a class="text-on-surface-variant font-medium hover:text-primary-fixed-dim transition-colors duration-200 text-label-sm" href="#">Automation</a>
<a class="text-on-surface-variant font-medium hover:text-primary-fixed-dim transition-colors duration-200 text-label-sm" href="#">Engagement</a>
<a class="text-on-surface-variant font-medium hover:text-primary-fixed-dim transition-colors duration-200 text-label-sm" href="#">Expansion</a>
<a class="text-primary font-bold border-b-2 border-primary pb-1 text-label-sm" href="#">Pricing</a>
</nav>
</div>
<div class="flex items-center gap-md">
<div class="hidden sm:flex flex-col items-end">
<span class="text-label-sm font-label-sm text-on-surface-variant">Balance: 1,250</span>
</div>
<div class="flex items-center gap-sm">
<button class="p-xs text-on-surface-variant hover:text-primary transition-colors"><span class="material-symbols-outlined">notifications</span></button>
<button class="p-xs text-on-surface-variant hover:text-primary transition-colors"><span class="material-symbols-outlined">settings</span></button>
<div class="h-8 w-8 rounded-full overflow-hidden border border-outline ml-base">
<img class="w-full h-full object-cover" data-alt="Close up profile shot of a professional marketing manager in a modern studio with teal and green atmospheric lighting. High quality photography with soft bokeh effect on a dark background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh30xZ-lkpPQg-A8RasV8FD6FGBh1n7xa8QMNQYBFbv6J85rVufgNZM2l2BiI6enJO3flD8YWfWmpeE_xLZBo3F8Jn_YV5Ivqe0uKpDrmmjitI6dbEhmL9IQsNFjU9oFpZnx5fGFSxXmICm4W73jRafFVr1MJQcwRiCsrse0L47bjEiA2noEI7d5gS1yccs5i3lE_DABmspHGpMiPsE07kl4WG9s0lghQqS29dSxzosQCrn3hcyZg">
</div>
</div>
</div>
</header>
<!-- Page Content -->
<section class="relative z-10 px-margin-mobile md:px-margin-desktop py-xl">
<div class="max-w-6xl mx-auto">
<div class="mb-xl">
<h2 class="text-display font-display text-primary-fixed-dim mb-base">Fuel Your Growth</h2>
<p class="text-body-lg text-on-surface-variant max-w-2xl">Acquire Growth Coins to scale your automated WhatsApp workflows, engage more customers, and expand your business footprint across the global market.</p>
</div>
<!-- Bento Grid Pricing Tiers -->
<div class="grid grid-cols-1 md:grid-cols-12 gap-gutter">
<!-- Starter Tier -->
<div class="md:col-span-4 glass-card rounded-xl p-md flex flex-col hover:border-primary/50 transition-all duration-300 group">
<div class="flex justify-between items-start mb-md">
<div>
<span class="text-label-sm font-label-sm text-primary uppercase tracking-widest mb-xs block">Level 01</span>
<h3 class="text-headline-lg font-headline-lg">Starter</h3>
</div>
<span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">eco</span>
</div>
<div class="mb-lg">
<span class="text-display font-display text-primary-fixed-dim">1,000</span>
<span class="text-label-sm text-on-surface-variant block mt-xs">Growth Coins</span>
</div>
<ul class="space-y-sm mb-xl flex-1">
<li class="flex items-center gap-xs text-body-md text-on-surface-variant">
<span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                                Up to 500 Messages
                            </li>
<li class="flex items-center gap-xs text-body-md text-on-surface-variant">
<span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                                Basic Flow Automation
                            </li>
<li class="flex items-center gap-xs text-body-md text-on-surface-variant">
<span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                                Standard Support
                            </li>
</ul>
<div class="pt-md border-t border-outline-variant flex items-center justify-between mt-auto">
<span class="text-headline-md font-headline-md">$49</span>
<button class="whatsapp-gradient text-on-primary-container px-md py-sm rounded-lg font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95">Buy Now</button>
</div>
</div>
<!-- Pro Tier (Popular) -->
<div class="md:col-span-4 relative group">
<div class="absolute -top-4 left-1/2 -translate-x-1/2 z-20 bg-primary px-sm py-xs rounded-full text-on-primary text-label-xs font-bold uppercase tracking-widest flex items-center gap-xs shadow-xl">
<span class="material-symbols-outlined text-[14px]">stars</span> Most Popular
                        </div>
<div class="h-full glass-card border-primary/40 rounded-xl p-md flex flex-col hover:border-primary transition-all duration-500 scale-[1.02] shadow-2xl shadow-primary/10 relative overflow-hidden">
<!-- Inset Gradient Glow -->
<div class="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full"></div>
<div class="flex justify-between items-start mb-md relative z-10">
<div>
<span class="text-label-sm font-label-sm text-primary uppercase tracking-widest mb-xs block">Level 02</span>
<h3 class="text-headline-lg font-headline-lg">Pro</h3>
</div>
<span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">rocket_launch</span>
</div>
<div class="mb-lg relative z-10">
<span class="text-display font-display text-primary">5,000</span>
<span class="text-label-sm text-on-surface-variant block mt-xs">Growth Coins</span>
</div>
<ul class="space-y-sm mb-xl flex-1 relative z-10">
<li class="flex items-center gap-xs text-body-md text-on-surface">
<span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                                    Up to 3,000 Messages
                                </li>
<li class="flex items-center gap-xs text-body-md text-on-surface">
<span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                                    Advanced Logic Nodes
                                </li>
<li class="flex items-center gap-xs text-body-md text-on-surface">
<span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                                    Priority API Access
                                </li>
<li class="flex items-center gap-xs text-body-md text-on-surface">
<span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                                    Team Collaboration
                                </li>
</ul>
<div class="pt-md border-t border-outline-variant flex items-center justify-between mt-auto relative z-10">
<div class="flex flex-col">
<span class="text-label-xs line-through text-on-surface-variant opacity-50">$245</span>
<span class="text-headline-md font-headline-md">$199</span>
</div>
<button class="whatsapp-gradient text-on-primary-container px-lg py-sm rounded-lg font-bold hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-90 scale-105">Buy Now</button>
</div>
</div>
</div>
<!-- Enterprise Tier -->
<div class="md:col-span-4 glass-card rounded-xl p-md flex flex-col hover:border-secondary-fixed/50 transition-all duration-300 group">
<div class="flex justify-between items-start mb-md">
<div>
<span class="text-label-sm font-label-sm text-secondary-fixed uppercase tracking-widest mb-xs block">Level 03</span>
<h3 class="text-headline-lg font-headline-lg">Enterprise</h3>
</div>
<span class="material-symbols-outlined text-on-surface-variant group-hover:text-secondary-fixed transition-colors">corporate_fare</span>
</div>
<div class="mb-lg">
<span class="text-display font-display text-secondary-fixed-dim">20,000</span>
<span class="text-label-sm text-on-surface-variant block mt-xs">Growth Coins</span>
</div>
<ul class="space-y-sm mb-xl flex-1">
<li class="flex items-center gap-xs text-body-md text-on-surface-variant">
<span class="material-symbols-outlined text-secondary-fixed text-[18px]">check_circle</span>
                                Unlimited Messages
                            </li>
<li class="flex items-center gap-xs text-body-md text-on-surface-variant">
<span class="material-symbols-outlined text-secondary-fixed text-[18px]">check_circle</span>
                                Custom Integrations
                            </li>
<li class="flex items-center gap-xs text-body-md text-on-surface-variant">
<span class="material-symbols-outlined text-secondary-fixed text-[18px]">check_circle</span>
                                Dedicated Success Manager
                            </li>
</ul>
<div class="pt-md border-t border-outline-variant flex items-center justify-between mt-auto">
<span class="text-headline-md font-headline-md">$699</span>
<button class="bg-secondary-container text-on-secondary-container px-md py-sm rounded-lg font-bold hover:shadow-lg hover:shadow-secondary/30 transition-all active:scale-95">Buy Now</button>
</div>
</div>
</div>
<!-- Secondary Info Section (Trust & Scalability) -->
<div class="mt-xl grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
<div class="glass-card rounded-xl p-lg relative overflow-hidden">
<div class="absolute top-0 right-0 p-md opacity-20 group-hover:opacity-100 transition-opacity">
<span class="material-symbols-outlined text-[120px] text-primary">analytics</span>
</div>
<h4 class="text-headline-md font-headline-md text-primary-fixed mb-sm">Why Growth Coins?</h4>
<p class="text-body-md text-on-surface-variant mb-md leading-relaxed">Our unified currency allows you to scale flexibly across different modules—whether it's AI-driven chatbots, bulk marketing campaigns, or automated customer support sessions. No complex monthly commitments, just pay for what you grow.</p>
<div class="flex gap-md">
<div class="flex flex-col">
<span class="text-headline-md font-headline-md text-on-surface">99.9%</span>
<span class="text-label-sm text-on-surface-variant uppercase">Uptime</span>
</div>
<div class="flex flex-col">
<span class="text-headline-md font-headline-md text-on-surface">2.4M</span>
<span class="text-label-sm text-on-surface-variant uppercase">Msgs/Day</span>
</div>
</div>
</div>
<div class="rounded-xl overflow-hidden aspect-video relative group">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" data-alt="Futuristic high-tech dashboard displaying global communication network data visualizations. Cinematic lighting with neon green and cyan accents. Sharp 8k digital art style, minimalist business interface aesthetic, dark mode background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0Im7_Y3yG5xdiNIE--JPpeoBozotaCQAuUyt9YDp2zkhcdE_jpFEIn0vpq-Y-V_nKVuH1wbykMDASNgsUM-TUmVVGMkHgXlEt5pz3ouY8fFbXKB72x1xfiy6dNYovBqyc1ihQZBf3pBjwhnWV9TrWOxapJa09jN-FgpBT-MadkJWkBUW_W4pX_jwrtxvn1hYr9IZy5sjvc6Jh0Uyck-IC31YlG5G7_Tge458Pt_EEDwEs0jy1hOA">
<div class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
<div class="absolute bottom-md left-md">
<p class="text-label-sm font-label-sm text-primary uppercase tracking-widest mb-xs">Scale without borders</p>
<h4 class="text-headline-md font-headline-md text-on-surface">Global API Access</h4>
</div>
</div>
</div>
</div>
</section>
<!-- Footer -->
<footer class="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-md w-full mt-auto bg-surface-container-lowest border-t border-outline-variant z-50">
<div class="flex flex-col md:flex-row items-center gap-md mb-md md:mb-0">
<div class="w-48 h-16 opacity-80 hover:opacity-100 transition-opacity overflow-hidden"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDneflSNYds4-kCuGT8ulPlZQOxJMu1O0g-fvPEtrYWfv1i6P03cen59PdXRDPMbgFqHHuXeL6mi19OALx_f_dYyOanIFoOtGFDxpTruT8QxHxViaEDINmwuo-CPDpoAs1bse2DTY0-gliMF5HCJH8OhkaMYN-ZzPWZZUALNz17oTycJvAB8RMslRRF6NajnqSvOCWLnl-kA0C6XTZ2FpPdDA73auKp-IP881Xp9F9Zulj0wScuyQfqupQkoUWgbWqU" alt="ExpendMore Logo" class="max-w-full h-auto grayscale opacity-50"></div>
<p class="text-label-sm font-label-sm text-on-surface-variant">© 2024 ExpendMore. All rights reserved.</p>
</div>
<div class="flex items-center gap-lg">
<a class="text-label-sm font-label-sm text-on-surface-variant hover:text-secondary-fixed transition-colors" href="#">Terms</a>
<a class="text-label-sm font-label-sm text-on-surface-variant hover:text-secondary-fixed transition-colors" href="#">Privacy</a>
<a class="text-label-sm font-label-sm text-on-surface-variant hover:text-secondary-fixed transition-colors" href="#">API Docs</a>
<a class="flex items-center gap-xs text-label-sm font-label-sm text-primary-fixed-dim" href="#">
<span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Status
                </a>
</div>
</footer>
</main>
<!-- Mobile Bottom Navigation -->
<nav class="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-low border-t border-outline-variant flex justify-around py-md z-50">
<a class="flex flex-col items-center text-on-surface-variant hover:text-primary" href="../expendmore_dashboard/code.php">
<span class="material-symbols-outlined">dashboard</span>
<span class="text-[10px] font-bold mt-xs">HOME</span>
</a>
<a class="flex flex-col items-center text-on-surface-variant hover:text-primary" href="../expendmore_campaign_manager/code.php">
<span class="material-symbols-outlined">campaign</span>
<span class="text-[10px] font-bold mt-xs">CAMPAIGN</span>
</a>
<a class="flex flex-col items-center text-primary" href="../expendmore_buy_growth_coins/code.php">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">payments</span>
<span class="text-[10px] font-bold mt-xs">COINS</span>
</a>
<a class="flex flex-col items-center text-on-surface-variant hover:text-primary" href="#">
<span class="material-symbols-outlined">person</span>
<span class="text-[10px] font-bold mt-xs">PROFILE</span>
</a>
</nav>
<!-- Interactive Layer: Ripple Effect Script -->
<script>
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', function(e) {
                let ripple = document.createElement('span');
                ripple.classList.add('ripple');
                this.appendChild(ripple);
                let x = e.clientX - e.target.offsetLeft;
                let y = e.clientY - e.target.offsetTop;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    </script>
<style>
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    </style>
</body></html>

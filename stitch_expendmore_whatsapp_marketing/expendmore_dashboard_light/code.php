<?php
require_once __DIR__ . '/../auth_core/middleware.php';
checkAuth();
?>
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>ExpendMore | User Dashboard</title>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&amp;family=Inter:wght@400;500;600&amp;family=Geist:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
  tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        "colors": {
                "on-primary-fixed-variant": "#005322",
                "surface-container-low": "#f6f3f2",
                "surface-container-lowest": "#ffffff",
                "on-error-container": "#93000a",
                "surface-container-high": "#ebe7e7",
                "on-tertiary-fixed-variant": "#004c69",
                "on-primary": "#ffffff",
                "on-secondary-fixed": "#00201c",
                "tertiary-fixed-dim": "#7cd0ff",
                "tertiary-container": "#48c4ff",
                "inverse-surface": "#313030",
                "on-surface-variant": "#3c4a3d",
                "background": "#ffffff",
                "on-tertiary": "#ffffff",
                "secondary-fixed-dim": "#72d8c8",
                "primary-fixed-dim": "#3de273",
                "primary-fixed": "#66ff8e",
                "secondary-fixed": "#8ff4e3",
                "error-container": "#ffdad6",
                "secondary": "#006b5f",
                "surface": "#fcf9f8",
                "on-primary-container": "#005523",
                "error": "#ba1a1a",
                "surface-dim": "#dcd9d9",
                "surface-tint": "#006d2f",
                "inverse-primary": "#3de273",
                "outline-variant": "#bbcbb9",
                "surface-container-highest": "#e5e2e1",
                "tertiary-fixed": "#c4e7ff",
                "on-secondary": "#ffffff",
                "on-secondary-container": "#006f64",
                "surface-container": "#f0edec",
                "primary": "#25d366",
                "primary-container": "#25d366",
                "on-error": "#ffffff",
                "on-primary-fixed": "#002109",
                "on-tertiary-fixed": "#001e2c",
                "on-secondary-fixed-variant": "#005047",
                "inverse-on-surface": "#f3f0ef",
                "on-tertiary-container": "#004f6c",
                "secondary-container": "#8cf1e1",
                "outline": "#6c7b6b",
                "on-surface": "#1c1b1b",
                "surface-bright": "#fcf9f8",
                "surface-variant": "#e5e2e1",
                "on-background": "#1c1b1b"
        },
        "borderRadius": {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
        },
        "spacing": {
                "xl": "64px",
                "sm": "12px",
                "md": "24px",
                "xs": "4px",
                "gutter": "24px",
                "margin-mobile": "16px",
                "lg": "40px",
                "margin-desktop": "48px",
                "base": "8px"
        },
        "fontFamily": {
                "display-lg": [
                        "Hanken Grotesk"
                ],
                "label-md": [
                        "Hanken Grotesk"
                ],
                "headline-lg-mobile": [
                        "Hanken Grotesk"
                ],
                "body-lg": [
                        "Hanken Grotesk"
                ],
                "headline-lg": [
                        "Hanken Grotesk"
                ],
                "body-md": [
                        "Hanken Grotesk"
                ],
                "label-sm": [
                        "Hanken Grotesk"
                ],
                "headline-md": [
                        "Hanken Grotesk"
                ]
        },
        "fontSize": {
                "display-lg": [
                        "48px",
                        {
                                "lineHeight": "56px",
                                "letterSpacing": "-0.02em",
                                "fontWeight": "700"
                        }
                ],
                "label-md": [
                        "14px",
                        {
                                "lineHeight": "20px",
                                "letterSpacing": "0.01em",
                                "fontWeight": "500"
                        }
                ],
                "headline-lg-mobile": [
                        "24px",
                        {
                                "lineHeight": "32px",
                                "fontWeight": "600"
                        }
                ],
                "body-lg": [
                        "18px",
                        {
                                "lineHeight": "28px",
                                "fontWeight": "400"
                        }
                ],
                "headline-lg": [
                        "32px",
                        {
                                "lineHeight": "40px",
                                "letterSpacing": "-0.01em",
                                "fontWeight": "600"
                        }
                ],
                "body-md": [
                        "16px",
                        {
                                "lineHeight": "24px",
                                "fontWeight": "400"
                        }
                ],
                "label-sm": [
                        "12px",
                        {
                                "lineHeight": "16px",
                                "fontWeight": "600"
                        }
                ],
                "headline-md": [
                        "24px",
                        {
                                "lineHeight": "32px",
                                "fontWeight": "600"
                        }
                ]
        }
    }
},
    },
  }
</script>
<style>
        body {
            background-color: #ffffff;
            color: #1c1b1b;
            font-family: 'Hanken Grotesk', sans-serif;
        }

        .glass-card {
            background: #ffffff;
            border: 1px solid #ebe7e7;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
        }

        .glass-card:hover {
            border-color: #25d366;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }

        .gradient-button {
            background: #25d366;
            transition: all 0.3s ease;
        }

        .gradient-button:hover {
            filter: brightness(1.05);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
        }

        .sidebar-active {
            background: rgba(37, 211, 102, 0.1);
            color: #25d366;
            border-right: 4px solid #25d366;
        }

        .status-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    </style>
</head>
<body class="flex min-h-screen">
<!-- SideNavBar Section -->
<aside class="fixed left-0 top-0 h-full w-[280px] bg-surface-container-low border-r border-outline-variant flex flex-col py-lg px-md z-40 hidden md:flex">
<div class="mb-xl flex items-center gap-sm">
<div class="w-10 h-10 rounded-lg flex items-center justify-center gradient-button shadow-md"><img alt="ExpendMore Logo" class="w-8 h-8 object-contain brightness-0 invert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuALduj4I4pNNrANAHJlOttMzuAfOUXhnKRvo79rz9kO6TTAxYDvM55ukJT1y3m8UEJGJdDCn6EunkfUd0SbwbG0qzcTkattso5MjfmpQCatN9EbqBiLZalUu-JCbynmWPl2DnNHZpx8B2iB6l6EMtSHHSKY-K4JmxTVgEjyWLyUvOaMwzzL8HXWpVOPO7LQ_IW_gaztMnvplTtwIDoxbhf7O5B7mcOEcEc5bWdzK3-QnDa6zcECB_AWmnztYt5Eh61P"/></div>
<div>
<h1 class="text-headline-md font-bold text-primary leading-none">ExpendMore</h1>
<p class="text-label-sm font-medium text-on-surface-variant opacity-70">Marketing API</p>
</div>
</div>
<nav class="flex-grow space-y-base">
<a class="sidebar-active flex items-center gap-sm px-md py-sm rounded-r-none transition-all duration-300 translate-x-1" href="../expendmore_dashboard_light/code.php">
<span class="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span class="text-body-md font-semibold">Dashboard</span>
</a>
<a class="text-on-surface-variant hover:bg-surface-variant/20 flex items-center gap-sm px-md py-sm transition-all duration-300" href="../expendmore_campaign_manager_light/code.php">
<span class="material-symbols-outlined" data-icon="campaign">campaign</span>
<span class="text-body-md">Campaigns</span>
</a>
<a class="text-on-surface-variant hover:bg-surface-variant/20 flex items-center gap-sm px-md py-sm transition-all duration-300" href="../expendmore_buy_growth_coins_light/code.php">
<span class="material-symbols-outlined" data-icon="monetization_on">monetization_on</span>
<span class="text-body-md">Coins</span>
</a>
<a class="text-on-surface-variant hover:bg-surface-variant/20 flex items-center gap-sm px-md py-sm transition-all duration-300" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span class="text-body-md">Settings</span>
</a>
</nav>
<div class="mt-auto space-y-base">
<button class="w-full gradient-button text-white font-bold py-md rounded-xl flex items-center justify-center gap-xs mb-md">
<span class="material-symbols-outlined text-sm">rocket_launch</span>
<span class="">Start Campaign</span>
</button>
<a class="text-on-surface-variant hover:bg-surface-variant/20 flex items-center gap-sm px-md py-sm transition-all duration-300" href="#">
<span class="material-symbols-outlined" data-icon="help">help</span>
<span class="text-label-sm">Help Center</span>
</a>
<a class="text-on-surface-variant hover:bg-surface-variant/20 flex items-center gap-sm px-md py-sm transition-all duration-300" href="../auth_core/logout.php">
<span class="material-symbols-outlined" data-icon="logout">logout</span>
<span class="text-label-sm">Logout</span>
</a>
</div>
</aside>
<!-- Main Content Canvas -->
<main class="flex-grow md:ml-[280px] min-h-screen flex flex-col bg-background">
<!-- TopAppBar Section -->
<header class="flex justify-between items-center w-full px-margin-desktop h-16 sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-outline-variant">
<div class="flex items-center gap-gutter">
<div class="relative hidden lg:block">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
<input class="bg-surface-container-low border border-outline-variant rounded-full pl-10 pr-6 py-2 text-label-sm focus:ring-2 focus:ring-primary/20 focus:border-primary w-64 text-on-surface transition-all" placeholder="Search automation..." type="text"/>
</div>
</div>
<div class="flex items-center gap-md">
<div class="hidden sm:flex items-center gap-xs px-md py-1.5 bg-surface-container-high rounded-full border border-outline-variant">
<span class="material-symbols-outlined text-primary text-sm" style="font-variation-settings: 'FILL' 1;">monetization_on</span>
<span class="text-label-sm font-bold text-primary">Balance: 1,250</span>
</div>
<div class="flex items-center gap-sm">
<button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
</button>
</div>
<div class="h-8 w-px bg-outline-variant mx-xs"></div>
<div class="flex items-center gap-sm">
<div class="text-right hidden sm:block">
<p class="text-label-sm font-bold leading-tight text-on-surface">Alex Rivera</p>
<p class="text-[10px] text-on-surface-variant font-medium">Pro Account</p>
</div>
<div class="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
<img alt="Alex Rivera Profile" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8AeFsOPK2D951BPybQrlBCGuU7zbpK8TOmvyXEudSh_FcYQTvuLNrHTWrneq4n9agmW09jBZGDHiivxAlY1FA_aFtHj0-duVRRCULa6ZaAiErlls0BZyzJ83ruS9CHv3eSGmAKxRA7VY3G-q8KyC3NkxkTOEO8o0400okAtCs36hz_Si5Tr-mRtB3awrpRldyOZlgQu4LS2cGvFECRunc8IKFg_knDxbyLBQV-rr4zjwotqPPPog"/>
</div>
</div>
</div>
</header>
<!-- Dashboard Canvas -->
<div class="p-margin-desktop space-y-gutter">
<!-- Hero Grid: Balance & Quick Stats -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
<!-- Coins Balance (Focus Card) -->
<div class="lg:col-span-8 glass-card rounded-2xl p-lg relative overflow-hidden flex flex-col justify-between min-h-[240px]">
<div class="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 blur-[80px] rounded-full"></div>
<div class="z-10">
<p class="text-label-sm font-bold text-on-surface-variant uppercase tracking-widest mb-xs">Available Growth Coins</p>
<h2 class="text-[48px] font-extrabold text-on-surface flex items-baseline gap-xs">
                            1,250
                            <span class="text-headline-md font-semibold text-primary">GC</span>
</h2>
</div>
<div class="z-10 flex flex-wrap gap-md mt-md">
<div class="flex items-center gap-xs px-md py-2 bg-primary/10 border border-primary/20 rounded-xl">
<span class="material-symbols-outlined text-primary text-sm">trending_up</span>
<span class="text-label-sm font-bold text-primary">+12% this week</span>
</div>
<button class="gradient-button px-lg py-2 rounded-xl text-white font-bold text-label-sm">
                            Top Up Coins
                        </button>
</div>
</div>
<!-- Active Campaigns Summary Card -->
<div class="lg:col-span-4 glass-card rounded-2xl p-md flex flex-col justify-between">
<div class="flex justify-between items-start">
<h3 class="text-body-lg font-bold text-on-surface">Active Campaigns</h3>
<span class="material-symbols-outlined text-on-surface-variant">bolt</span>
</div>
<div class="space-y-md my-md">
<div class="flex items-center justify-between">
<div class="flex flex-col">
<span class="text-label-sm text-on-surface-variant">Delivered</span>
<span class="font-bold text-on-surface">42.8k</span>
</div>
<div class="w-32 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
<div class="bg-primary h-full" style="width: 75%"></div>
</div>
</div>
<div class="flex items-center justify-between">
<div class="flex flex-col">
<span class="text-label-sm text-on-surface-variant">Open Rate</span>
<span class="font-bold text-on-surface">18.4%</span>
</div>
<div class="w-32 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
<div class="bg-tertiary-container h-full" style="width: 45%"></div>
</div>
</div>
</div>
<button class="w-full py-2 bg-surface-container-high hover:bg-surface-container-highest transition-colors rounded-xl text-label-sm font-bold border border-outline-variant text-on-surface">
                        View Analytics
                    </button>
</div>
</div>
<!-- Main Sections Grid -->
<div class="grid grid-cols-1 xl:grid-cols-3 gap-gutter">
<!-- Connected WhatsApp Numbers -->
<div class="xl:col-span-2 space-y-md">
<div class="flex justify-between items-center">
<h3 class="text-headline-md font-bold text-on-surface">Connected Numbers</h3>
<button class="text-primary hover:text-primary/80 font-bold flex items-center gap-xs transition-colors group">
<span class="material-symbols-outlined group-hover:rotate-90 transition-transform">add_circle</span>
<span class="text-label-sm">Add Number</span>
</button>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-md">
<!-- Number Card 1 -->
<div class="glass-card rounded-xl p-md border-l-4 border-l-primary">
<div class="flex justify-between items-start mb-md">
<div class="flex items-center gap-sm">
<div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
<span class="material-symbols-outlined text-primary">chat</span>
</div>
<div>
<p class="font-bold text-on-surface">+1 (555) 012-3456</p>
<p class="text-label-sm text-on-surface-variant">Marketing Desk 01</p>
</div>
</div>
<div class="flex items-center gap-xs px-2 py-1 bg-primary/10 rounded-full border border-primary/20">
<div class="w-2 h-2 rounded-full bg-primary status-pulse"></div>
<span class="text-[10px] text-primary font-bold uppercase">Online</span>
</div>
</div>
<div class="flex justify-between text-label-xs text-on-surface-variant font-medium">
<span class="">API Version: v18.0</span>
<span class="">2.4k messages/day</span>
</div>
</div>
<!-- Number Card 2 -->
<div class="glass-card rounded-xl p-md border-l-4 border-l-tertiary-container">
<div class="flex justify-between items-start mb-md">
<div class="flex items-center gap-sm">
<div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
<span class="material-symbols-outlined text-tertiary-container">support_agent</span>
</div>
<div>
<p class="font-bold text-on-surface">+44 20 7946 0958</p>
<p class="text-label-sm text-on-surface-variant">Support Channel</p>
</div>
</div>
<div class="flex items-center gap-xs px-2 py-1 bg-surface-container-high rounded-full border border-outline-variant">
<div class="w-2 h-2 rounded-full bg-on-surface-variant"></div>
<span class="text-[10px] text-on-surface-variant font-bold uppercase">Idle</span>
</div>
</div>
<div class="flex justify-between text-label-xs text-on-surface-variant font-medium">
<span class="">API Version: v18.0</span>
<span class="">856 messages/day</span>
</div>
</div>
</div>
</div>
<!-- Recent Activity/Campaign Timeline -->
<div class="xl:col-span-1 space-y-md">
<h3 class="text-headline-md font-bold text-on-surface">Recent Events</h3>
<div class="glass-card rounded-2xl p-md space-y-gutter relative overflow-hidden">
<!-- Activity Item -->
<div class="flex gap-md">
<div class="flex flex-col items-center">
<div class="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center z-10">
<span class="material-symbols-outlined text-primary text-sm">rocket</span>
</div>
<div class="w-px h-full bg-outline-variant my-xs"></div>
</div>
<div class="pb-md">
<p class="text-body-md font-bold text-on-surface">Campaign "Summer Sale" Launched</p>
<p class="text-label-sm text-on-surface-variant">Targets: 12,500 contacts</p>
<p class="text-[10px] text-on-surface-variant font-medium mt-xs uppercase">2 minutes ago</p>
</div>
</div>
<!-- Activity Item -->
<div class="flex gap-md">
<div class="flex flex-col items-center">
<div class="w-8 h-8 rounded-full bg-tertiary-container/10 border border-tertiary-container/20 flex items-center justify-center z-10">
<span class="material-symbols-outlined text-tertiary-container text-sm">payments</span>
</div>
<div class="w-px h-full bg-outline-variant my-xs"></div>
</div>
<div class="pb-md">
<p class="text-body-md font-bold text-on-surface">Auto-Top Up Success</p>
<p class="text-label-sm text-on-surface-variant">+500 Growth Coins added</p>
<p class="text-[10px] text-on-surface-variant font-medium mt-xs uppercase">1 hour ago</p>
</div>
</div>
<!-- Activity Item -->
<div class="flex gap-md">
<div class="flex flex-col items-center">
<div class="w-8 h-8 rounded-full bg-on-surface-variant/10 border border-outline-variant flex items-center justify-center z-10">
<span class="material-symbols-outlined text-on-surface-variant text-sm">settings</span>
</div>
</div>
<div>
<p class="text-body-md font-bold text-on-surface">API Key Rotated</p>
<p class="text-label-sm text-on-surface-variant">Security update completed</p>
<p class="text-[10px] text-on-surface-variant font-medium mt-xs uppercase">Yesterday</p>
</div>
</div>
</div>
</div>
</div>
<!-- Asymmetric Bento-style Features -->
<div class="grid grid-cols-1 md:grid-cols-4 gap-gutter pb-xl">
<div class="md:col-span-2 glass-card rounded-2xl p-lg flex flex-col gap-md">
<h4 class="text-headline-md font-bold text-on-surface">Automation Health</h4>
<div class="flex-grow flex items-center justify-center py-md">
<!-- Data Visualization Placeholder -->
<div class="w-full h-32 relative">
<div class="absolute bottom-0 w-full flex items-end gap-xs h-full">
<div class="flex-grow bg-primary/10 h-[60%] rounded-t-md"></div>
<div class="flex-grow bg-primary/10 h-[85%] rounded-t-md"></div>
<div class="flex-grow bg-primary/20 h-[70%] rounded-t-md border-t-2 border-primary"></div>
<div class="flex-grow bg-primary/40 h-[95%] rounded-t-md border-t-2 border-primary"></div>
<div class="flex-grow bg-primary/20 h-[80%] rounded-t-md border-t-2 border-primary"></div>
<div class="flex-grow bg-primary/60 h-[100%] rounded-t-md border-t-2 border-primary"></div>
</div>
</div>
</div>
<div class="flex justify-between items-center">
<span class="text-label-sm text-on-surface-variant font-medium">Last 24 Hours Performance</span>
<span class="text-label-sm text-primary font-extrabold">99.8% Success Rate</span>
</div>
</div>
<div class="md:col-span-1 glass-card rounded-2xl p-lg flex flex-col justify-between">
<span class="material-symbols-outlined text-4xl text-tertiary-container">group_add</span>
<div>
<h4 class="font-bold text-lg text-on-surface">Expansion</h4>
<p class="text-label-sm text-on-surface-variant">Unlock multi-country routing for your campaigns.</p>
</div>
<a class="text-primary text-label-sm font-bold flex items-center gap-xs group" href="#">Explore Nodes <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span></a>
</div>
<div class="md:col-span-1 glass-card rounded-2xl p-lg flex flex-col justify-between bg-primary/5">
<span class="material-symbols-outlined text-4xl text-primary">psychology</span>
<div>
<h4 class="font-bold text-lg text-on-surface">AI Assistant</h4>
<p class="text-label-sm text-on-surface-variant">Automate responses using our LLM integration.</p>
</div>
<a class="text-primary text-label-sm font-bold flex items-center gap-xs group" href="#">Configure AI <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span></a>
</div>
</div>
</div>
<!-- Footer Section -->
<footer class="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-md w-full mt-auto bg-surface-container-lowest border-t border-outline-variant gap-md">
<div class="flex items-center gap-md">
<img alt="ExpendMore Logo" class="h-6 object-contain grayscale opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt4TkdvZ6b7p9zUMSYR6G68tX7xq6MggUEuZoA7KW39Bf1eX87vLo3BGOSqxxUJaZ_8VZ2xms_QFgnVOW3PMpJIcPLk-EZvqMOO03SPc48VzT6ajhBZaEy8cM8R5AXEIGQeN25gvGkchY_dAkzOYgc6ipGFMyaNj2myB4de4ljeqvUscw2rMRraLGljCPmoJv1UzhS76a2OMH2UQcDhXq0y-DQGAp8oYYRJuhTBhdR05CY5TuQuHgyQDlIbII3yN-G"/>
<p class="text-label-sm font-medium text-on-surface-variant">© 2024 ExpendMore. All rights reserved.</p>
</div>
<div class="flex gap-lg">
<a class="text-label-sm font-bold text-on-surface-variant hover:text-primary transition-colors" href="#">Terms</a>
<a class="text-label-sm font-bold text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy</a>
<a class="text-label-sm font-bold text-on-surface-variant hover:text-primary transition-colors" href="#">API Docs</a>
<a class="text-label-sm font-bold text-on-surface-variant hover:text-primary transition-colors" href="#">Status</a>
</div>
</footer>
</main>
<!-- Mobile Navigation (BottomNavBar) -->
<nav class="fixed bottom-0 left-0 w-full h-16 bg-white/90 backdrop-blur-xl border-t border-outline-variant flex items-center justify-around px-md md:hidden z-50">
<button class="flex flex-col items-center gap-xs text-primary">
<span class="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span class="text-[10px] font-bold">Dashboard</span>
</button>
<button class="flex flex-col items-center gap-xs text-on-surface-variant">
<span class="material-symbols-outlined" data-icon="campaign">campaign</span>
<span class="text-[10px] font-bold">Campaigns</span>
</button>
<div class="w-12 h-12 -translate-y-4 rounded-full gradient-button flex items-center justify-center shadow-lg border-4 border-white">
<span class="material-symbols-outlined text-white font-bold">add</span>
</div>
<button class="flex flex-col items-center gap-xs text-on-surface-variant">
<span class="material-symbols-outlined" data-icon="monetization_on">monetization_on</span>
<span class="text-[10px] font-bold">Coins</span>
</button>
<button class="flex flex-col items-center gap-xs text-on-surface-variant">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span class="text-[10px] font-bold">Settings</span>
</button>
</nav>
<script>
        // Micro-interaction for hover states and card movement
        document.querySelectorAll('.glass-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });

        // Search Bar Focus Effect
        const searchInput = document.querySelector('input[type="text"]');
        searchInput.addEventListener('focus', () => {
            searchInput.classList.add('w-80', 'bg-white');
        });
        searchInput.addEventListener('blur', () => {
            if (searchInput.value === '') {
                searchInput.classList.remove('w-80', 'bg-white');
            }
        });
    </script>
</body></html>

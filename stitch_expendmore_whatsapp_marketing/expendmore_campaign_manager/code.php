<?php
require_once __DIR__ . '/../auth_core/middleware.php';
checkAuth();
?>
<!DOCTYPE html><html class="dark" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>ExpendMore | Create Campaign</title>
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
        .glass-panel {
            background: rgba(22, 22, 22, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid #2a2a2a;
        }
        .whatsapp-gradient {
            background: linear-gradient(135deg, #25d366 0%, #00daf3 100%);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        input:focus, select:focus {
            box-shadow: 0 0 0 2px rgba(0, 218, 243, 0.2);
            outline: none;
        }
        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #353534; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #4ff07f; }
    </style>
</head>
<body class="bg-background text-on-background font-body-md overflow-hidden h-screen flex">
<!-- SideNavBar Anchor -->
<aside class="fixed left-0 top-0 h-full w-[280px] bg-surface-container-low border-r border-outline-variant flex flex-col py-lg px-md z-40 hidden md:flex">
<div class="flex items-center gap-sm mb-xl px-xs">
<div class="w-10 h-10 rounded-lg flex items-center justify-center text-on-primary-container"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTZCz8S-cy00FSMBmorkK5N6C738EOsawOjKFS77jRQY37EAkhrNcvvtq3ba4F5601zAUf3_2hhbkwNP8uUPO_AlBXhzITL_R5vkJepmcIzI-4mdh541_ubp3bTbGkXemEOA4H3zrQhXTy3B0bHM-VbwX3HzhiRRBl36uEOlKKNGoZa97LgQMEJkMu6FJnus7Q5KvfQVDn4cuyhL4qd4X2AUB7w0HNp6Li97HLXQZHxX37n8q7_OYEdoyGLcO_clq4" alt="ExpendMore Logo" class="w-full h-full object-contain"></div>
<div>
<h1 class="text-headline-md font-headline-md text-primary leading-tight">ExpendMore</h1>
<p class="text-label-sm font-label-sm text-on-surface-variant">Marketing API</p>
</div>
</div>
<nav class="flex-1 space-y-2">
<a class="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-all duration-300" href="../expendmore_dashboard/code.php">
<span class="material-symbols-outlined">dashboard</span>
<span class="font-medium">Dashboard</span>
</a>
<a class="flex items-center gap-md px-md py-sm rounded-lg bg-primary-container/10 text-primary-fixed-dim border-r-4 border-primary-fixed-dim translate-x-1 transition-transform" href="../expendmore_campaign_manager/code.php">
<span class="material-symbols-outlined">campaign</span>
<span class="font-medium">Campaigns</span>
</a>
<a class="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-all duration-300" href="../expendmore_buy_growth_coins/code.php">
<span class="material-symbols-outlined">monetization_on</span>
<span class="font-medium">Coins</span>
</a>
<a class="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-all duration-300" href="#">
<span class="material-symbols-outlined">settings</span>
<span class="font-medium">Settings</span>
</a>
</nav>
<div class="mt-auto space-y-2 pt-lg">
<button class="w-full whatsapp-gradient text-on-primary font-bold py-md rounded-xl shadow-lg active:scale-95 transition-transform">
                Start Campaign
            </button>
<div class="border-t border-outline-variant my-md"></div>
<a class="flex items-center gap-md px-md py-sm text-label-sm font-label-sm text-on-surface-variant hover:text-secondary-fixed transition-colors" href="#">
<span class="material-symbols-outlined">help</span>
<span class="">Help Center</span>
</a>
<a class="flex items-center gap-md px-md py-sm text-label-sm font-label-sm text-on-surface-variant hover:text-error transition-colors" href="../auth_core/logout.php">
<span class="material-symbols-outlined">logout</span>
<span class="">Logout</span>
</a>
</div>
</aside>
<!-- Main Content Canvas -->
<main class="flex-1 ml-0 md:ml-[280px] overflow-y-auto h-screen relative bg-background">
<!-- TopAppBar Anchor -->
<header class="flex justify-between items-center w-full px-margin-desktop h-16 sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant">
<div class="flex items-center gap-md">
<button class="md:hidden text-primary">
<span class="material-symbols-outlined">menu</span>
</button>
<div class="hidden lg:flex items-center bg-surface-container-high rounded-full px-md py-xs border border-outline-variant">
<span class="material-symbols-outlined text-on-surface-variant text-[20px] mr-xs">search</span>
<input class="bg-transparent border-none text-label-sm text-on-surface focus:ring-0 w-48" placeholder="Search templates..." type="text">
</div>
</div>
<div class="flex items-center gap-md">
<div class="hidden sm:flex items-center gap-xs text-secondary-fixed-dim bg-secondary-container/10 px-md py-xs rounded-full border border-secondary-container/20">
<span class="material-symbols-outlined text-[18px]">payments</span>
<span class="text-label-sm font-bold">Balance: 1,250</span>
</div>
<button class="text-primary hover:text-primary-fixed-dim transition-colors scale-95 active:scale-90 flex items-center gap-xs">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="text-primary hover:text-primary-fixed-dim transition-colors scale-95 active:scale-90">
<span class="material-symbols-outlined">settings</span>
</button>
<div class="w-8 h-8 rounded-full overflow-hidden border border-primary-container/30">
<img class="w-full h-full object-cover" data-alt="A professional headshot of a modern tech executive with neutral studio lighting and a clean dark background. The subject is wearing a sleek charcoal gray blazer, representing the premium and authoritative brand identity of ExpendMore. The overall aesthetic is minimalist, sharp, and business-focused with a high-end corporate feel." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxs8P7k12osMBJdAKPbPzsb7KymXGBilTNeXayz4AXjOwiX6feh60hbQeB7QnjmtLKAzRfDDXGwykcCeLk0h0FK8BsbioULq7hOMro3qC7J-l7E6c8UA3maAKiSL9-CUGkAA2ot7A57Za4lM7QPQ1HiW91wN5lmhqLi8ez87SYEwmdHQLG-7HuPo6JNEXzOEjV0yaCYYNg2rKabn_NIRJsYAeSrKOE1tAonp10UXyLd4kZ_HJpnXA">
</div>
</div>
</header>
<section class="px-margin-desktop py-lg max-w-7xl mx-auto">
<div class="flex flex-col lg:flex-row gap-gutter">
<!-- Left Column: Create Campaign Form -->
<div class="lg:col-span-7 flex-1 space-y-gutter">
<div class="flex items-center justify-between">
<div>
<h2 class="text-headline-lg font-headline-lg text-primary leading-tight">Create Campaign</h2>
<p class="text-on-surface-variant">Automate your business communication in minutes.</p>
</div>
</div>
<div class="glass-panel p-md lg:p-lg rounded-xl shadow-2xl relative overflow-hidden" style="--mouse-x: 34.475806451612904%; --mouse-y: 26.38888888888889%;">
<!-- Atmospheric effect -->
<div class="absolute -top-24 -right-24 w-48 h-48 bg-primary-container/5 rounded-full blur-3xl"></div>
<form class="space-y-md relative z-10">
<div class="space-y-xs">
<label class="text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Campaign Name</label>
<input class="w-full bg-surface-container-low border border-outline-variant rounded-lg p-md text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary-fixed-dim transition-all" placeholder="e.g., Summer Expansion 2024" type="text">
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-md">
<div class="space-y-xs">
<label class="text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Select WhatsApp Number</label>
<div class="relative">
<select class="w-full bg-surface-container-low border border-outline-variant rounded-lg p-md text-on-surface appearance-none focus:border-primary-fixed-dim transition-all">
<option>+1 (555) 234-5678 - Marketing</option>
<option>+1 (555) 987-6543 - Support</option>
<option>+44 20 7946 0958 - International</option>
</select>
<span class="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
</div>
</div>
<div class="space-y-xs">
<label class="text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Message Template</label>
<div class="relative">
<select class="w-full bg-surface-container-low border border-outline-variant rounded-lg p-md text-on-surface appearance-none focus:border-primary-fixed-dim transition-all">
<option>Welcome Onboarding Flow</option>
<option>Product Update Broadcast</option>
<option>Retargeting Coupon Template</option>
</select>
<span class="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
</div>
</div>
</div>
<div class="space-y-xs">
<label class="text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Campaign Schedule</label>
<div class="flex gap-md">
<label class="flex-1 cursor-pointer">
<input checked="" class="hidden peer" name="schedule" type="radio">
<div class="p-md border border-outline-variant rounded-lg flex items-center justify-center gap-sm bg-surface-container-low peer-checked:border-primary peer-checked:bg-primary-container/5 transition-all">
<span class="material-symbols-outlined text-primary">send</span>
<span class="text-label-sm font-bold">Send Now</span>
</div>
</label>
<label class="flex-1 cursor-pointer">
<input class="hidden peer" name="schedule" type="radio">
<div class="p-md border border-outline-variant rounded-lg flex items-center justify-center gap-sm bg-surface-container-low peer-checked:border-primary peer-checked:bg-primary-container/5 transition-all">
<span class="material-symbols-outlined text-secondary-fixed-dim">schedule</span>
<span class="text-label-sm font-bold">Schedule</span>
</div>
</label>
</div>
</div>
<div class="pt-md">
<button class="w-full py-md rounded-xl whatsapp-gradient text-on-primary font-bold text-lg shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] transition-all active:scale-95 flex items-center justify-center gap-md" type="submit">
                                    Launch Campaign
                                    <span class="material-symbols-outlined">rocket_launch</span>
</button>
</div>
</form>
</div>
</div>
<!-- Right Column: Recent Campaigns & Stats -->
<div class="lg:w-[400px] space-y-gutter">
<div class="flex items-center justify-between">
<h3 class="text-headline-md font-headline-md text-primary">Recent Campaigns</h3>
<a class="text-label-sm text-secondary-fixed hover:underline transition-all" href="#">View All</a>
</div>
<div class="space-y-md">
<!-- Campaign Item 1 -->
<div class="glass-panel p-md rounded-xl hover:border-primary/40 transition-colors group">
<div class="flex justify-between items-start mb-sm">
<div class="flex items-center gap-sm">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
<span class="material-symbols-outlined text-primary-fixed-dim" style="font-variation-settings: 'FILL' 1;">done_all</span>
</div>
<div>
<h4 class="font-bold text-on-surface">Flash Sale Blast</h4>
<p class="text-label-sm text-on-surface-variant">12,450 Recipient</p>
</div>
</div>
<span class="bg-primary/10 text-primary-fixed-dim text-label-xs px-sm py-xs rounded-full font-bold uppercase">Sent</span>
</div>
<div class="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
<div class="w-full h-full whatsapp-gradient"></div>
</div>
</div>
<!-- Campaign Item 2 -->
<div class="glass-panel p-md rounded-xl hover:border-secondary-fixed/40 transition-colors group">
<div class="flex justify-between items-start mb-sm">
<div class="flex items-center gap-sm">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
<span class="material-symbols-outlined text-secondary-fixed-dim" style="font-variation-settings: 'FILL' 1;">pending</span>
</div>
<div>
<h4 class="font-bold text-on-surface">Weekly Newsletter</h4>
<p class="text-label-sm text-on-surface-variant">Scheduled for 10:00 PM</p>
</div>
</div>
<span class="bg-secondary-fixed/10 text-secondary-fixed-dim text-label-xs px-sm py-xs rounded-full font-bold uppercase">Pending</span>
</div>
<div class="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
<div class="w-1/2 h-full bg-secondary-fixed-dim"></div>
</div>
</div>
<!-- Campaign Item 3 -->
<div class="glass-panel p-md rounded-xl hover:border-error/40 transition-colors group">
<div class="flex justify-between items-start mb-sm">
<div class="flex items-center gap-sm">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
<span class="material-symbols-outlined text-error" style="font-variation-settings: 'FILL' 1;">error</span>
</div>
<div>
<h4 class="font-bold text-on-surface">Feedback Loop</h4>
<p class="text-label-sm text-on-surface-variant">API Connection Timeout</p>
</div>
</div>
<span class="bg-error/10 text-error text-label-xs px-sm py-xs rounded-full font-bold uppercase">Failed</span>
</div>
<div class="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
<div class="w-0 h-full bg-error"></div>
</div>
</div>
</div>
<!-- Visual Ad Card -->
<div class="relative h-48 rounded-xl overflow-hidden group cursor-pointer">
<div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
<img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="A futuristic data visualization dashboard glowing with neon teal and green lines on a deep black background. Digital waves and interconnected nodes represent global communication expansion. The visual style is highly technological, abstract, and energetic, conveying the automated momentum of the ExpendMore marketing API." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4V35U9MOUKksCsH-N1McSXZ2kCUaZCtxtF7MkYAu7cKS7Cd1aZkBdAIfVjhnQAlIOiU7QmPBmI3FebrmTcND00PAbGgTa8THY4drgeu1Oi264-3dIZTDB6wnuevLYQ8V5SJDmp1m90qMTwRA_6N39AXP1mrxF4ueQ0QDqZEwIVfjdfHR0-noLUqhq7RcZX4LoJBOVw0hlZRkOWWkR2z1VZ5ZSbnNpNHkgDxXasnPEY6mOP53SeNQ">
<div class="absolute bottom-md left-md z-20">
<h5 class="text-on-surface font-bold">Scaling Internationally?</h5>
<p class="text-label-sm text-on-surface-variant mb-sm">Get 20% off Coin packs this month.</p>
<button class="text-label-sm font-bold text-primary flex items-center gap-xs">
                                Buy Coins <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</div>
</div>
</div>
</div>
</section>
<!-- Footer Anchor -->
<footer class="flex justify-between items-center px-margin-desktop py-md w-full border-t border-outline-variant bg-surface-container-lowest mt-12">
<div class="flex items-center gap-md">
<span class="text-label-sm text-on-surface-variant">© 2024 ExpendMore. All rights reserved.</span>
</div>
<div class="flex gap-lg">
<a class="text-label-sm text-on-surface-variant hover:text-secondary-fixed transition-colors" href="#">Terms</a>
<a class="text-label-sm text-on-surface-variant hover:text-secondary-fixed transition-colors" href="#">Privacy</a>
<a class="text-label-sm text-on-surface-variant hover:text-secondary-fixed transition-colors" href="#">API Docs</a>
<a class="text-label-sm text-on-surface-variant hover:text-secondary-fixed transition-colors" href="#">Status</a>
</div>
</footer>
</main>
<!-- Mobile Bottom Navigation -->
<nav class="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-low border-t border-outline-variant flex justify-around py-md z-50">
<a class="flex flex-col items-center text-on-surface-variant hover:text-primary" href="../expendmore_dashboard/code.php">
<span class="material-symbols-outlined">dashboard</span>
<span class="text-[10px] font-bold mt-xs">HOME</span>
</a>
<a class="flex flex-col items-center text-primary" href="../expendmore_campaign_manager/code.php">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">campaign</span>
<span class="text-[10px] font-bold mt-xs">CAMPAIGN</span>
</a>
<a class="flex flex-col items-center text-on-surface-variant hover:text-primary" href="../expendmore_buy_growth_coins/code.php">
<span class="material-symbols-outlined">payments</span>
<span class="text-[10px] font-bold mt-xs">COINS</span>
</a>
<a class="flex flex-col items-center text-on-surface-variant hover:text-primary" href="#">
<span class="material-symbols-outlined">person</span>
<span class="text-[10px] font-bold mt-xs">PROFILE</span>
</a>
</nav>
<script>
        // Micro-interactions and atmospheric effects
        document.addEventListener('DOMContentLoaded', () => {
            const panels = document.querySelectorAll('.glass-panel');
            
            panels.forEach(panel => {
                panel.addEventListener('mousemove', (e) => {
                    const { left, top, width, height } = panel.getBoundingClientRect();
                    const x = (e.clientX - left) / width;
                    const y = (e.clientY - top) / height;
                    
                    panel.style.setProperty('--mouse-x', `${x * 100}%`);
                    panel.style.setProperty('--mouse-y', `${y * 100}%`);
                });
            });
            
            // JQuery contains crash fix
            const logoutElements = Array.from(document.querySelectorAll('a')).filter(el => {
                const text = el.textContent || '';
                return text.includes('Logout') || el.querySelector('.material-symbols-outlined')?.textContent.includes('logout');
            });
            logoutElements.forEach(el => {
                el.setAttribute('href', '../auth_core/logout.php');
            });
        });
    </script>
</body></html>

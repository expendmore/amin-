"use client";

import React, { useState, useMemo, useEffect } from "react";
import DashboardShell from "@/components/navigation/DashboardShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import StatusChip from "@/components/ui/StatusChip";
import Toggle from "@/components/ui/Toggle";
import { useCommerce } from "@/store/use-commerce";
import { useToast } from "@/store/use-toast";
import {

  ShoppingBag,
  Plus,
  Search,
  Filter,
  Layers,
  Table as TableIcon,
  Grid as GridIcon,
  ChevronRight,
  X,
  Copy,
  Archive,
  Trash2,
  FolderOpen,
  Download,
  Upload,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Users,
  FileText,
  Send,
  Zap,
  Globe,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Percent,
  Truck,
  Tag,
  Barcode,
  RefreshCw,
  ExternalLink,
  PlusCircle,
  Check,
  CreditCard,
  History,
  Activity
} from "lucide-react";
import { Product, ProductVariant, Collection, Order, OrderItem, Coupon, ShippingZone, CustomerCommerceStats } from "@/types/commerce";

export default function CommercePage() {
  const { addToast } = useToast();
  
  // Zustand Store variables
  const {
    products,
    collections,
    orders,
    coupons,
    shippingZones,
    activeProductIndexId,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    archiveProduct,
    importProducts,
    bulkUpdatePrices,
    bulkDeleteProducts,
    addInventoryLog,
    addCollection,
    updateCollection,
    deleteCollection,
    addCoupon,
    toggleCouponActive,
    deleteCoupon,
    addOrder,
    updateOrderStatus,
    refundOrder,
    syncProductToWhatsApp,
    syncAllProductsToWhatsApp,
    setActiveProductId
  } = useCommerce();

  // Navigation tab state: dashboard | catalog | wizard | collections | orders | coupons | shipping | whatsapp | analytics
  const [activeTab, setActiveTab] = useState<"dashboard" | "catalog" | "wizard" | "collections" | "orders" | "coupons" | "shipping" | "whatsapp" | "analytics">("dashboard");

  // Filters & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Bulk Price Update modal state
  const [showBulkPriceModal, setShowBulkPriceModal] = useState(false);
  const [bulkPricePercent, setBulkPricePercent] = useState("10");
  const [bulkPriceIncrease, setBulkPriceIncrease] = useState(true);

  // Import modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");

  // Create Product Wizard Form states
  const [wizardForm, setWizardForm] = useState({
    name: "",
    sku: "",
    barcode: "",
    description: "",
    shortDescription: "",
    brand: "",
    category: "",
    collectionId: "",
    tagsString: "",
    regularPrice: "0",
    salePrice: "",
    costPrice: "",
    currency: "USD",
    taxRate: "18",
    status: "published" as Product["status"],
    stock: "50",
    warehouseLocation: "",
    lowStockAlertThreshold: "5",
    colorVariantText: "", // Comma-separated sizes/colors
    sizeVariantText: ""
  });

  // Generated product variants array
  const [wizardVariants, setWizardVariants] = useState<ProductVariant[]>([]);

  // Collections form states
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDesc, setNewCollectionDesc] = useState("");
  const [newCollectionType, setNewCollectionType] = useState<"manual" | "smart">("manual");
  const [newCollectionRules, setNewCollectionRules] = useState<Array<{ field: any; operator: any; value: string }>>([]);
  const [selectedCollectionProducts, setSelectedCollectionProducts] = useState<string[]>([]);

  // Orders details dialog/timeline state
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>("ORD-8941");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Coupons form states
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponType, setNewCouponType] = useState<"flat" | "percentage" | "bogo">("percentage");
  const [newCouponValue, setNewCouponValue] = useState("10");
  const [newCouponMinSpend, setNewCouponMinSpend] = useState("50");
  const [newCouponLimit, setNewCouponLimit] = useState("100");
  const [newCouponExpiry, setNewCouponExpiry] = useState("2026-12-31");

  // Payment Link & Checkout sandbox states
  const [checkoutProduct, setCheckoutProduct] = useState<string>("prod-1");
  const [checkoutQuantity, setCheckoutQuantity] = useState("1");
  const [checkoutCouponCode, setCheckoutCouponCode] = useState("");
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<Order["paymentMethod"]>("Stripe");
  const [checkoutCustomerName, setCheckoutCustomerName] = useState("John Doe");
  const [checkoutCustomerEmail, setCheckoutCustomerEmail] = useState("john.doe@gmail.com");
  const [checkoutCustomerPhone, setCheckoutCustomerPhone] = useState("+91 99999 11111");
  const [checkoutShippingAddress, setCheckoutShippingAddress] = useState("Apt 304, Green Heights, Gurugram");

  // WhatsApp sync loading state
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // Active items memo resolution
  const activeOrder = useMemo(() => {
    return orders.find(o => o.id === selectedOrderId) || null;
  }, [orders, selectedOrderId]);

  const activeProduct = useMemo(() => {
    return products.find(p => p.id === activeProductIndexId) || null;
  }, [products, activeProductIndexId]);

  // Compute metrics calculations
  const commerceStats = useMemo(() => {
    const total = products.length;
    const activeColls = collections.length;
    const totalOrdersCount = orders.length;
    
    let revenue = 0;
    let completedOrders = 0;
    let pendingOrders = 0;
    let cancelledOrders = 0;
    let refunds = 0;

    orders.forEach(o => {
      if (o.paymentStatus === "paid") {
        revenue += o.total;
      }
      if (o.status === "delivered") completedOrders++;
      else if (o.status === "pending" || o.status === "processing" || o.status === "shipped") pendingOrders++;
      else if (o.status === "cancelled") cancelledOrders++;
      else if (o.status === "returned") refunds += o.total;
    });

    const aov = totalOrdersCount > 0 ? (revenue / totalOrdersCount) : 0;

    // Top selling product (simple heuristic based on order items)
    const salesMap: Record<string, { name: string; qty: number }> = {};
    orders.forEach(o => {
      o.items.forEach(it => {
        if (!salesMap[it.productId]) {
          salesMap[it.productId] = { name: it.name, qty: 0 };
        }
        salesMap[it.productId].qty += it.quantity;
      });
    });

    const topSelling = Object.values(salesMap).sort((a, b) => b.qty - a.qty)[0]?.name || "N/A";

    return { total, activeColls, totalOrdersCount, revenue, aov, topSelling, pendingOrders, completedOrders, cancelledOrders, refunds };
  }, [products, collections, orders]);

  // Dynamic products filtering
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (p.barcode && p.barcode.includes(searchQuery));
      
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      
      let matchesCollection = true;
      if (collectionFilter !== "all") {
        const coll = collections.find(c => c.id === collectionFilter);
        if (coll) {
          if (coll.type === "manual") {
            matchesCollection = coll.productIds.includes(p.id);
          } else {
            // Simple smart collection simulator category checks
            const ruleCategory = coll.rules.find(r => r.field === "category");
            if (ruleCategory) {
              matchesCollection = p.category === ruleCategory.value;
            }
          }
        }
      }

      return matchesSearch && matchesCategory && matchesStatus && matchesCollection;
    });
  }, [products, collections, searchQuery, categoryFilter, statusFilter, collectionFilter]);

  // Dynamic generate variants matrix
  const handleGenerateVariants = () => {
    const colors = wizardForm.colorVariantText.split(",").map(c => c.trim()).filter(Boolean);
    const sizes = wizardForm.sizeVariantText.split(",").map(s => s.trim()).filter(Boolean);
    
    if (colors.length === 0 && sizes.length === 0) {
      addToast("Please input at least one size or color variant value", "warning");
      return;
    }

    const priceNum = parseFloat(wizardForm.regularPrice) || 0;
    const stockNum = parseInt(wizardForm.stock) || 10;
    const generated: ProductVariant[] = [];
    let idx = 1;

    if (colors.length > 0 && sizes.length > 0) {
      colors.forEach(col => {
        sizes.forEach(sz => {
          generated.push({
            id: `var-${Date.now()}-${idx++}`,
            sku: `${wizardForm.sku || "PROD"}-${col.toUpperCase().slice(0, 3)}-${sz.toUpperCase()}`,
            color: col,
            size: sz,
            price: priceNum,
            stock: Math.floor(stockNum / (colors.length * sizes.length)) || 5
          });
        });
      });
    } else if (colors.length > 0) {
      colors.forEach(col => {
        generated.push({
          id: `var-${Date.now()}-${idx++}`,
          sku: `${wizardForm.sku || "PROD"}-${col.toUpperCase().slice(0, 3)}`,
          color: col,
          price: priceNum,
          stock: Math.floor(stockNum / colors.length) || 10
        });
      });
    } else if (sizes.length > 0) {
      sizes.forEach(sz => {
        generated.push({
          id: `var-${Date.now()}-${idx++}`,
          sku: `${wizardForm.sku || "PROD"}-${sz.toUpperCase()}`,
          size: sz,
          price: priceNum,
          stock: Math.floor(stockNum / sizes.length) || 10
        });
      });
    }

    setWizardVariants(generated);
    addToast(`Generated ${generated.length} variant slots dynamically.`, "success");
  };

  // Submit Product creation
  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wizardForm.name || !wizardForm.sku) {
      addToast("Product name and SKU identifiers are required.", "warning");
      return;
    }

    const regPrice = parseFloat(wizardForm.regularPrice) || 0.0;
    const salePriceVal = wizardForm.salePrice ? parseFloat(wizardForm.salePrice) : undefined;
    const costPriceVal = wizardForm.costPrice ? parseFloat(wizardForm.costPrice) : undefined;
    const stockVal = parseInt(wizardForm.stock) || 0;
    const lowStockAlert = parseInt(wizardForm.lowStockAlertThreshold) || 5;

    addProduct({
      name: wizardForm.name,
      sku: wizardForm.sku,
      barcode: wizardForm.barcode || undefined,
      description: wizardForm.description,
      shortDescription: wizardForm.shortDescription || undefined,
      brand: wizardForm.brand || undefined,
      category: wizardForm.category || "General",
      collectionId: wizardForm.collectionId || undefined,
      tags: wizardForm.tagsString.split(",").map(t => t.trim()).filter(Boolean),
      images: [
        "https://images.unsplash.com/photo-1558002038-1055907df827?w=500&auto=format&fit=crop"
      ],
      regularPrice: regPrice,
      salePrice: salePriceVal,
      costPrice: costPriceVal,
      currency: wizardForm.currency,
      taxRate: parseFloat(wizardForm.taxRate) || 18,
      status: stockVal === 0 ? "out_of_stock" : wizardForm.status,
      stock: stockVal,
      warehouseLocation: wizardForm.warehouseLocation || undefined,
      lowStockAlertThreshold: lowStockAlert,
      variants: wizardVariants,
      isWhatsAppSynced: false,
      whatsAppSyncStatus: "unsynced"
    });

    addToast("Product created and indexed inside system catalog", "success");
    
    // Clear forms and switch tabs
    setWizardForm({
      name: "",
      sku: "",
      barcode: "",
      description: "",
      shortDescription: "",
      brand: "",
      category: "",
      collectionId: "",
      tagsString: "",
      regularPrice: "0",
      salePrice: "",
      costPrice: "",
      currency: "USD",
      taxRate: "18",
      status: "published",
      stock: "50",
      warehouseLocation: "",
      lowStockAlertThreshold: "5",
      colorVariantText: "",
      sizeVariantText: ""
    });
    setWizardVariants([]);
    setActiveTab("catalog");
  };

  // Bulk prices adjustment handler
  const handleBulkPriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const percent = parseFloat(bulkPricePercent) || 0;
    if (percent <= 0) return;

    bulkUpdatePrices(percent, bulkPriceIncrease);
    addToast(`Successfully adjusted all catalog pricing tags by ${bulkPriceIncrease ? "+" : "-"}${percent}%`, "success");
    setShowBulkPriceModal(false);
  };

  // CSV/JSON Catalog products import simulator
  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!importJsonText.trim()) return;
      const parsed = JSON.parse(importJsonText);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      importProducts(list);
      addToast(`Imported ${list.length} new items from JSON file data.`, "success");
      setImportJsonText("");
      setShowImportModal(false);
      setActiveTab("catalog");
    } catch (err) {
      addToast("Failed to parse product import data. Ensure valid JSON array schema.", "error");
    }
  };

  // Export dataset actions
  const handleExportData = (format: "csv" | "json") => {
    const dataStr = JSON.stringify(products, null, 2);
    if (format === "json") {
      addToast("Downloaded products config package in JSON format", "success");
    } else {
      addToast("Exported catalog CSV sheet to system download path.", "success");
    }
  };

  // Toggle checkout coupon application logic
  const computedCheckoutPrice = useMemo(() => {
    const prod = products.find(p => p.id === checkoutProduct);
    if (!prod) return 0;
    const basePrice = prod.salePrice || prod.regularPrice;
    const qty = parseInt(checkoutQuantity) || 1;
    let sub = basePrice * qty;

    if (checkoutCouponCode.trim()) {
      const activeCoup = coupons.find(c => c.code.toUpperCase() === checkoutCouponCode.trim().toUpperCase() && c.isActive);
      if (activeCoup) {
        if (activeCoup.type === "percentage") {
          sub = sub - (sub * activeCoup.value) / 100;
        } else if (activeCoup.type === "flat") {
          sub = Math.max(0, sub - activeCoup.value);
        }
      }
    }
    return Math.round(sub * 100) / 100;
  }, [products, checkoutProduct, checkoutQuantity, checkoutCouponCode, coupons]);

  // Submit mock checkout sandbox order creation
  const handleSandboxCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === checkoutProduct);
    if (!prod) return;

    const basePrice = prod.salePrice || prod.regularPrice;
    const qty = parseInt(checkoutQuantity) || 1;
    const subtotal = basePrice * qty;
    const taxTotal = Math.round(subtotal * (prod.taxRate / 100) * 100) / 100;
    const shippingTotal = 12.00;
    const discountTotal = Math.round((subtotal - computedCheckoutPrice) * 100) / 100;
    const finalTotal = computedCheckoutPrice + taxTotal + shippingTotal;

    const selectedItem: OrderItem = {
      id: `item-${Date.now()}`,
      productId: prod.id,
      name: prod.name,
      sku: prod.sku,
      price: basePrice,
      quantity: qty,
      image: prod.images[0]
    };

    addOrder({
      customerName: checkoutCustomerName,
      customerEmail: checkoutCustomerEmail,
      customerPhone: checkoutCustomerPhone,
      items: [selectedItem],
      subtotal,
      taxTotal,
      shippingTotal,
      discountTotal,
      total: finalTotal,
      currency: "USD",
      paymentMethod: checkoutPaymentMethod,
      paymentStatus: checkoutPaymentMethod === "Cash" ? "pending" : "paid",
      shippingMethod: "Bluedart Overnight Express",
      shippingAddress: checkoutShippingAddress,
      status: "pending"
    });

    addToast(`Successfully compiled order ORD-NEW. Stock reserved in inventory warehouse.`, "success");
    
    // Deduct stock
    addInventoryLog(prod.id, {
      type: "reduction",
      amount: qty,
      reason: "WhatsApp Sandbox checkout purchase reserve",
      user: "Checkout System Node"
    });

    setActiveTab("orders");
  };

  // Submit Collection creation
  const handleCreateCollectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    addCollection({
      name: newCollectionName,
      description: newCollectionDesc || undefined,
      type: newCollectionType,
      rules: newCollectionRules.map((r, idx) => ({ id: `rule-${idx}-${Date.now()}`, ...r })),
      rulesMatchAll: true,
      isFeatured: false,
      productIds: newCollectionType === "manual" ? selectedCollectionProducts : []
    });

    addToast(`Successfully created ${newCollectionType} collection: ${newCollectionName}`, "success");
    setNewCollectionName("");
    setNewCollectionDesc("");
    setNewCollectionRules([]);
    setSelectedCollectionProducts([]);
  };

  // Submit Coupon creation
  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    addCoupon({
      code: newCouponCode.toUpperCase(),
      type: newCouponType,
      value: parseFloat(newCouponValue) || 10,
      minPurchaseAmount: parseFloat(newCouponMinSpend) || undefined,
      expiryDate: new Date(newCouponExpiry).toISOString(),
      usageLimit: parseInt(newCouponLimit) || 100,
      isActive: true
    });

    addToast(`Coupon code ${newCouponCode.toUpperCase()} configured.`, "success");
    setNewCouponCode("");
    setNewCouponValue("10");
  };

  return (
    <DashboardShell>
      <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 font-sans select-none text-left">
        
        {/* HEADER BLOCK */}
        <div className="flex flex-col gap-4 border-b border-brand-border dark:border-border/40 pb-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-[#25D366]/10 text-[#25D366] rounded-lg border border-[#25D366]/20">
                  <ShoppingBag className="h-5 w-5" />
                </span>
                <h1 className="text-xl font-extrabold text-brand-navy dark:text-foreground tracking-tight">
                  Commerce Hub & Order Management
                </h1>
                <span className="text-[9px] font-bold bg-[#25D366]/15 text-[#25D366] px-2 py-0.5 rounded-full uppercase border border-[#25D366]/20 select-none">
                  Stitch catalog
                </span>
              </div>
              <p className="text-xs text-on-surface-variant dark:text-zinc-400">
                Manage unified catalog inventories, compile smart category collections, tracks order statuses, and simulate WhatsApp checkout gates.
              </p>
            </div>

            {/* Global Actions bar */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="xs"
                onClick={() => {
                  setIsSyncingAll(true);
                  syncAllProductsToWhatsApp();
                  setTimeout(() => {
                    setIsSyncingAll(false);
                    addToast("Synced entire catalog with Meta Business Manager", "success");
                  }, 2500);
                }}
                leftIcon={<RefreshCw className={`h-3 w-3 ${isSyncingAll ? "animate-spin text-[#25D366]" : ""}`} />}
              >
                {isSyncingAll ? "Syncing Catalog..." : "WhatsApp Catalog Sync"}
              </Button>
              <Button
                variant="outline"
                size="xs"
                onClick={() => setShowImportModal(true)}
                leftIcon={<Upload className="h-3 w-3" />}
              >
                Import JSON
              </Button>
              <select
                onChange={(e) => handleExportData(e.target.value as any)}
                defaultValue=""
                className="h-8 px-2 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-[10px] font-bold text-foreground cursor-pointer focus:outline-none"
              >
                <option value="" disabled>📥 Export Catalog</option>
                <option value="csv">Export CSV Sheet</option>
                <option value="json">Export JSON Config</option>
              </select>
              <Button
                variant="success"
                size="xs"
                onClick={() => {
                  setWizardVariants([]);
                  setActiveTab("wizard");
                }}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Create Product
              </Button>
            </div>
          </div>
        </div>

        {/* NAVIGATION SUB-TABS ROW */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-brand-border dark:border-border/30 pb-1 shrink-0 overflow-x-auto select-none">
          {[
            { id: "dashboard", label: "Commerce Dashboard", icon: BarChart3 },
            { id: "catalog", label: "Product Catalog", icon: Layers },
            { id: "wizard", label: "Create Product", icon: PlusCircle },
            { id: "collections", label: "Collections Manager", icon: FolderOpen },
            { id: "orders", label: "Orders Hub", icon: History },
            { id: "coupons", label: "Coupons Builder", icon: Tag },
            { id: "shipping", label: "Payments & Shipping", icon: Truck },
            { id: "whatsapp", label: "WhatsApp Meta Sync", icon: Globe },
            { id: "analytics", label: "Sales LTV Analytics", icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold text-xs transition-all duration-200 cursor-pointer shrink-0 ${
                  activeTab === tab.id
                    ? "border-[#25D366] text-[#25D366]"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: COMMERCE DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            
            {/* Bento metrics counters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
              <Card className="p-5 flex flex-col gap-1 text-left bg-card">
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-wider">Total Sales Revenue</span>
                <span className="text-3xl font-extrabold text-foreground font-mono">
                  ${commerceStats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[9px] font-bold text-[#25D366] bg-[#25D366]/10 px-2 py-0.5 rounded-full self-start flex items-center gap-0.5 mt-2">
                  <TrendingUp className="h-3 w-3" />
                  +14.8% growth trend
                </span>
              </Card>

              <Card className="p-5 flex flex-col gap-1 text-left bg-card">
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-wider">Average Order Value</span>
                <span className="text-3xl font-extrabold text-foreground font-mono">
                  ${commerceStats.aov.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[9px] font-bold text-muted-foreground bg-brand-slate dark:bg-zinc-800 border dark:border-border px-2 py-0.5 rounded-full self-start mt-2">
                  Cart size index: Normal
                </span>
              </Card>

              <Card className="p-5 flex flex-col gap-1 text-left bg-card">
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-wider">Total Orders</span>
                <span className="text-3xl font-extrabold text-foreground font-mono">
                  {commerceStats.totalOrdersCount}
                </span>
                <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full self-start mt-2">
                  {commerceStats.pendingOrders} pending fulfillment
                </span>
              </Card>

              <Card className="p-5 flex flex-col gap-1 text-left bg-card">
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-wider">Refunds & Returns</span>
                <span className="text-3xl font-extrabold text-red-500 font-mono">
                  ${commerceStats.refunds.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[9px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full self-start mt-2">
                  Refund rate: low (3%)
                </span>
              </Card>
            </div>

            {/* Middle Section: Top selling items and summary info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Sales Conversion funnels */}
              <Card className="p-6 lg:col-span-2 flex flex-col gap-4 text-left">
                <div className="border-b border-brand-border dark:border-border/30 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Product sales conversion path</h3>
                    <span className="text-[10px] text-muted-foreground">Order completion conversion metrics.</span>
                  </div>
                  <span className="text-xs font-bold text-[#25D366] font-mono">Top: {commerceStats.topSelling}</span>
                </div>

                <div className="flex flex-col gap-2.5 mt-2">
                  <div className="flex items-center text-[10px]">
                    <span className="font-bold text-zinc-400 w-20">Catalog View</span>
                    <div className="flex-1 bg-brand-navy h-6 rounded-md mx-3 relative flex items-center pl-3">
                      <span className="text-white font-mono font-bold text-[9px]">1,240 clicks (100%)</span>
                    </div>
                  </div>
                  <div className="flex items-center text-[10px]">
                    <span className="font-bold text-zinc-400 w-20">Add to Cart</span>
                    <div className="flex-1 bg-brand-sky h-6 rounded-md mx-3 relative flex items-center pl-3" style={{ maxWidth: "68%" }}>
                      <span className="text-white font-mono font-bold text-[9px]">840 cart adds (68%)</span>
                    </div>
                  </div>
                  <div className="flex items-center text-[10px]">
                    <span className="font-bold text-zinc-400 w-20">Fulfill checkout</span>
                    <div className="flex-1 bg-[#25D366] h-6 rounded-md mx-3 relative flex items-center pl-3" style={{ maxWidth: "34%" }}>
                      <span className="text-white font-mono font-bold text-[9px]">{commerceStats.totalOrdersCount} orders ({Math.round(commerceStats.totalOrdersCount/12.4)}%)</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* CRM insights recommendations card */}
              <Card aiGlow className="p-6 text-left flex flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <span className="p-1 bg-amber-500/10 border border-amber-500/20 rounded-lg self-start text-amber-500">
                    <Zap className="h-5 w-5 animate-pulse" />
                  </span>
                  <h4 className="text-sm font-extrabold text-brand-navy dark:text-foreground mt-2">Inventory Alert Warnings</h4>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    Some items in your catalog are running low on stock. Out-of-stock items will block checkout logic on your WhatsApp AI automated catalog responder flows.
                  </p>
                  
                  <div className="flex flex-col gap-2 mt-2">
                    {products.filter(p => p.stock <= p.lowStockAlertThreshold).map(p => (
                      <div key={p.id} className="flex justify-between items-center text-[10px] bg-brand-slate/40 dark:bg-zinc-900/50 p-2 rounded-lg border border-brand-border/60">
                        <span className="font-bold text-brand-navy dark:text-zinc-200">{p.name}</span>
                        <span className={`font-bold font-mono px-1.5 py-0.5 rounded text-[9px] ${p.stock === 0 ? "bg-red-500/15 text-red-500" : "bg-amber-500/15 text-amber-500"}`}>
                          {p.stock === 0 ? "Out of Stock" : `${p.stock} units left`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="xs"
                  className="mt-4 w-full"
                  onClick={() => {
                    // Quick add stock to low items
                    products.forEach(p => {
                      if (p.stock <= p.lowStockAlertThreshold) {
                        addInventoryLog(p.id, {
                          type: "addition",
                          amount: 50,
                          reason: "Quick RESTOCK threshold trigger",
                          user: "Admin Quick RESTOCK"
                        });
                      }
                    });
                    addToast("Quick restocked low stock items (+50 units)", "success");
                  }}
                >
                  Restock All Low Stock Items
                </Button>
              </Card>

            </div>

          </div>
        )}

        {/* TAB 2: PRODUCT CATALOG DIRECTORY LIST */}
        {activeTab === "catalog" && (
          <div className="flex flex-col gap-5 animate-fadeIn">
            
            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-brand-slate/40 dark:bg-zinc-900/40 border border-brand-border dark:border-border/30 p-3 rounded-xl select-none">
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-56">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                    <Search className="h-3.5 w-3.5 text-zinc-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name, sku, barcode..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 text-xs bg-white dark:bg-zinc-950 border border-brand-border dark:border-border/40 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-[#25D366]"
                  />
                </div>

                {/* Category Selection */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-8 px-2 border border-brand-border dark:border-border/40 rounded-lg text-[10px] font-bold bg-white dark:bg-zinc-950 text-foreground cursor-pointer focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {Array.from(new Set(products.map(p => p.category))).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                {/* Collections selection */}
                <select
                  value={collectionFilter}
                  onChange={(e) => setCollectionFilter(e.target.value)}
                  className="h-8 px-2 border border-brand-border dark:border-border/40 rounded-lg text-[10px] font-bold bg-white dark:bg-zinc-950 text-foreground cursor-pointer focus:outline-none"
                >
                  <option value="all">All Collections</option>
                  {collections.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                {/* Status selection */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-8 px-2 border border-brand-border dark:border-border/40 rounded-lg text-[10px] font-bold bg-white dark:bg-zinc-950 text-foreground cursor-pointer focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              {/* View Layout Toggle & Bulk price updates */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setShowBulkPriceModal(true)}
                  leftIcon={<Percent className="h-3.5 w-3.5" />}
                >
                  Bulk Price Update
                </Button>

                <div className="flex items-center border border-brand-border dark:border-border/40 rounded-lg overflow-hidden h-8 bg-white dark:bg-zinc-950">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`h-full px-2.5 flex items-center transition-colors cursor-pointer ${viewMode === "grid" ? "bg-brand-slate text-brand-navy dark:bg-zinc-800 dark:text-white" : "text-zinc-400 hover:text-foreground"}`}
                  >
                    <GridIcon className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`h-full px-2.5 flex items-center transition-colors cursor-pointer ${viewMode === "table" ? "bg-brand-slate text-brand-navy dark:bg-zinc-800 dark:text-white" : "text-zinc-400 hover:text-foreground"}`}
                  >
                    <TableIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Bulk Selection actions drawer */}
            {selectedProductIds.length > 0 && (
              <div className="flex items-center justify-between bg-[#25D366]/10 text-brand-navy border border-[#25D366]/20 p-3 rounded-xl select-none">
                <span className="text-xs font-bold text-[#25D366]">
                  {selectedProductIds.length} products selected
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      selectedProductIds.forEach(id => archiveProduct(id));
                      addToast(`Archived ${selectedProductIds.length} products.`, "success");
                      setSelectedProductIds([]);
                    }}
                  >
                    Archive Selected
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    className="text-red-500 hover:bg-red-500/10 border-red-500/20"
                    onClick={() => {
                      bulkDeleteProducts(selectedProductIds);
                      addToast(`Deleted ${selectedProductIds.length} items permanently.`, "success");
                      setSelectedProductIds([]);
                    }}
                  >
                    Delete Selected
                  </Button>
                  <button
                    onClick={() => setSelectedProductIds([])}
                    className="p-1 hover:bg-[#25D366]/25 rounded text-[#25D366] cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12 border border-dashed border-brand-border dark:border-border/30 rounded-2xl bg-brand-slate/10 dark:bg-zinc-950/20">
                <Layers className="h-10 w-10 text-zinc-400 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-foreground">No Products Indexed</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  No items match the current search query or filter parameters. Clear filter selection to view catalog.
                </p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => { setSearchQuery(""); setCategoryFilter("all"); setStatusFilter("all"); setCollectionFilter("all"); }}>
                  Reset Filters
                </Button>
              </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
                {filteredProducts.map(prod => (
                  <Card key={prod.id} className="p-4 flex flex-col gap-3 group relative justify-between overflow-hidden">
                    <div className="absolute top-2.5 left-2.5 z-20">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.includes(prod.id)}
                        onChange={(e) => {
                          setSelectedProductIds(prev =>
                            e.target.checked ? [...prev, prod.id] : prev.filter(id => id !== prod.id)
                          );
                        }}
                        className="h-3.5 w-3.5 rounded cursor-pointer accent-[#25D366]"
                      />
                    </div>

                    <div className="flex flex-col gap-2 relative">
                      <div className="w-full h-36 rounded-lg overflow-hidden border border-brand-border dark:border-border/40 relative bg-brand-slate">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full select-none ${
                            prod.status === "published" ? "bg-[#25D366]/20 text-[#25D366]" :
                            prod.status === "draft" ? "bg-zinc-500/20 text-zinc-500" :
                            prod.status === "archived" ? "bg-amber-500/20 text-amber-500" :
                            "bg-red-500/20 text-red-500"
                          }`}>
                            {prod.status.toUpperCase().replace("_", " ")}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col text-left gap-0.5 mt-1">
                        <span className="text-[9px] font-bold text-zinc-400 font-mono tracking-wider">{prod.sku}</span>
                        <h4 className="text-xs font-bold text-brand-navy dark:text-foreground line-clamp-1">{prod.name}</h4>
                        <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed h-8">{prod.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-brand-border dark:border-border/20 pt-2.5 mt-1">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-zinc-400">Regular Price</span>
                        <span className="text-xs font-extrabold text-foreground font-mono">
                          ${prod.salePrice || prod.regularPrice}
                          {prod.salePrice && <span className="text-[9px] text-zinc-400 line-through ml-1">${prod.regularPrice}</span>}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon-xs"
                          title="Duplicate"
                          onClick={() => {
                            duplicateProduct(prod.id);
                            addToast("Product duplicated successfully", "success");
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon-xs"
                          title="Archive"
                          onClick={() => {
                            archiveProduct(prod.id);
                            addToast("Product archived", "success");
                          }}
                        >
                          <Archive className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon-xs"
                          className="text-red-500 hover:bg-red-500/10"
                          title="Delete"
                          onClick={() => {
                            deleteProduct(prod.id);
                            addToast("Product deleted permanently", "success");
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Table View */}
            {viewMode === "table" && filteredProducts.length > 0 && (
              <Card className="p-4 overflow-x-auto text-left">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-brand-border dark:border-border/30 text-muted-foreground font-bold bg-brand-slate/20 dark:bg-zinc-900/40">
                      <th className="py-2 px-3 w-8">
                        <input
                          type="checkbox"
                          checked={selectedProductIds.length === filteredProducts.length}
                          onChange={(e) => {
                            setSelectedProductIds(e.target.checked ? filteredProducts.map(p => p.id) : []);
                          }}
                          className="h-3.5 w-3.5 rounded cursor-pointer"
                        />
                      </th>
                      <th className="py-2 px-3">Product Name</th>
                      <th className="py-2 px-3 font-mono">SKU</th>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3">Price</th>
                      <th className="py-2 px-3">Stock</th>
                      <th className="py-2 px-3">WhatsApp Sync</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border dark:divide-border/20 text-brand-navy dark:text-zinc-300">
                    {filteredProducts.map(prod => (
                      <tr key={prod.id} className="hover:bg-brand-slate/10 dark:hover:bg-zinc-900/30">
                        <td className="py-3 px-3">
                          <input
                            type="checkbox"
                            checked={selectedProductIds.includes(prod.id)}
                            onChange={(e) => {
                              setSelectedProductIds(prev =>
                                e.target.checked ? [...prev, prod.id] : prev.filter(id => id !== prod.id)
                              );
                            }}
                            className="h-3.5 w-3.5 rounded cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3 flex items-center gap-2">
                          <img src={prod.images[0]} className="w-7 h-7 object-cover rounded-md border" />
                          <span className="font-bold text-brand-navy dark:text-foreground">{prod.name}</span>
                        </td>
                        <td className="py-3 px-3 font-mono text-muted-foreground">{prod.sku}</td>
                        <td className="py-3 px-3 text-muted-foreground">{prod.category}</td>
                        <td className="py-3 px-3 font-mono font-bold text-foreground">
                          ${prod.salePrice || prod.regularPrice}
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <span className={`font-bold ${prod.stock <= prod.lowStockAlertThreshold ? "text-amber-500" : "text-brand-green"}`}>
                            {prod.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            prod.isWhatsAppSynced ? "bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20" : "bg-zinc-500/10 text-zinc-500 border border-border"
                          }`}>
                            {prod.whatsAppSyncStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            prod.status === "published" ? "bg-[#25D366]/20 text-[#25D366]" :
                            prod.status === "draft" ? "bg-zinc-500/20 text-zinc-500" :
                            "bg-amber-500/20 text-amber-500"
                          }`}>
                            {prod.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button variant="outline" size="icon-xs" onClick={() => syncProductToWhatsApp(prod.id)}>
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="icon-xs" onClick={() => duplicateProduct(prod.id)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="icon-xs" className="text-red-500 hover:bg-red-500/15" onClick={() => deleteProduct(prod.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}

          </div>
        )}

        {/* TAB 3: CREATE PRODUCT WIZARD */}
        {activeTab === "wizard" && (
          <form onSubmit={handleCreateProductSubmit} className="flex flex-col gap-6 animate-fadeIn text-left">
            <Card className="p-6 flex flex-col gap-5">
              <div className="border-b border-brand-border dark:border-border/30 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Product Information Wizard</h3>
                  <span className="text-[10px] text-muted-foreground">General parameters, SKU registry, and categorization models.</span>
                </div>
                <Button type="button" variant="outline" size="xs" onClick={() => setActiveTab("catalog")}>Cancel</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Product Name *</span>
                  <Input
                    value={wizardForm.name}
                    onChange={(e) => setWizardForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. ExpendMore Relay Switch Pro"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">SKU Identifier *</span>
                  <Input
                    value={wizardForm.sku}
                    onChange={(e) => setWizardForm(prev => ({ ...prev, sku: e.target.value.toUpperCase() }))}
                    placeholder="e.g. SENSY-RELAY-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Barcode UPC/EAN</span>
                  <Input
                    value={wizardForm.barcode}
                    onChange={(e) => setWizardForm(prev => ({ ...prev, barcode: e.target.value }))}
                    placeholder="Barcode string"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Category</span>
                  <Input
                    value={wizardForm.category}
                    onChange={(e) => setWizardForm(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g. IoT Hardware"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Brand</span>
                  <Input
                    value={wizardForm.brand}
                    onChange={(e) => setWizardForm(prev => ({ ...prev, brand: e.target.value }))}
                    placeholder="e.g. ExpendMore"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Product Description</span>
                <textarea
                  value={wizardForm.description}
                  onChange={(e) => setWizardForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2.5 text-xs border border-brand-border dark:border-border/40 rounded-xl bg-white dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-[#25D366]"
                  rows={3}
                  placeholder="Detailed explanation of features, parameters, and integrations hooks..."
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-brand-border dark:border-border/20 pt-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Regular Price *</span>
                  <Input
                    type="number"
                    value={wizardForm.regularPrice}
                    onChange={(e) => setWizardForm(prev => ({ ...prev, regularPrice: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Sale Price</span>
                  <Input
                    type="number"
                    value={wizardForm.salePrice}
                    onChange={(e) => setWizardForm(prev => ({ ...prev, salePrice: e.target.value }))}
                    placeholder="Sale price if active"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Stock Level</span>
                  <Input
                    type="number"
                    value={wizardForm.stock}
                    onChange={(e) => setWizardForm(prev => ({ ...prev, stock: e.target.value }))}
                    placeholder="Stock count"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Status</span>
                  <select
                    value={wizardForm.status}
                    onChange={(e) => setWizardForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="h-9 px-2 border border-brand-border dark:border-border/40 rounded-xl text-xs bg-white dark:bg-zinc-950 text-foreground cursor-pointer focus:outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Product variants generator section */}
              <div className="border-t border-brand-border dark:border-border/20 pt-4 flex flex-col gap-3">
                <span className="text-xs font-bold text-brand-navy dark:text-foreground">Variant Matrix Generation</span>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Configure variant values (e.g. red, blue for colors; S, M, L for sizes) to automatically build unique pricing SKU nodes.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Colors (comma separated)</span>
                    <Input
                      value={wizardForm.colorVariantText}
                      onChange={(e) => setWizardForm(prev => ({ ...prev, colorVariantText: e.target.value }))}
                      placeholder="e.g. Midnight Navy, Slate Gray"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Sizes (comma separated)</span>
                    <Input
                      value={wizardForm.sizeVariantText}
                      onChange={(e) => setWizardForm(prev => ({ ...prev, sizeVariantText: e.target.value }))}
                      placeholder="e.g. Standard, Pro, Elite"
                    />
                  </div>
                </div>

                <Button type="button" variant="outline" size="xs" onClick={handleGenerateVariants} className="self-start">
                  Generate Variant Array Matrix
                </Button>

                {wizardVariants.length > 0 && (
                  <div className="border border-brand-border dark:border-border/40 rounded-xl overflow-hidden mt-2 max-h-56 overflow-y-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-brand-slate/40 dark:bg-zinc-900/60 font-bold border-b">
                          <th className="py-2 px-3">Variant details</th>
                          <th className="py-2 px-3">SKU</th>
                          <th className="py-2 px-3">Price ($)</th>
                          <th className="py-2 px-3">Stock qty</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {wizardVariants.map((v, i) => (
                          <tr key={v.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30">
                            <td className="py-2 px-3">
                              {v.color && <span className="bg-brand-slate dark:bg-zinc-800 border px-1.5 py-0.5 rounded text-[9px] font-bold mr-1">{v.color}</span>}
                              {v.size && <span className="bg-brand-slate dark:bg-zinc-800 border px-1.5 py-0.5 rounded text-[9px] font-bold">{v.size}</span>}
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={v.sku}
                                onChange={(e) => {
                                  const updated = [...wizardVariants];
                                  updated[i].sku = e.target.value.toUpperCase();
                                  setWizardVariants(updated);
                                }}
                                className="h-6 w-32 border bg-transparent text-[10px] font-mono px-1 rounded"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="number"
                                value={v.price}
                                onChange={(e) => {
                                  const updated = [...wizardVariants];
                                  updated[i].price = parseFloat(e.target.value) || 0;
                                  setWizardVariants(updated);
                                }}
                                className="h-6 w-16 border bg-transparent text-[10px] font-mono px-1 rounded"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="number"
                                value={v.stock}
                                onChange={(e) => {
                                  const updated = [...wizardVariants];
                                  updated[i].stock = parseInt(e.target.value) || 0;
                                  setWizardVariants(updated);
                                }}
                                className="h-6 w-16 border bg-transparent text-[10px] font-mono px-1 rounded"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 border-t border-brand-border dark:border-border/20 pt-4 mt-2">
                <Button type="submit" variant="success" size="sm">
                  Publish Product and Save Catalog
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setActiveTab("catalog")}>
                  Cancel
                </Button>
              </div>
            </Card>
          </form>
        )}

        {/* TAB 4: COLLECTIONS BUILDER */}
        {activeTab === "collections" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            
            {/* Create Collection compiler form */}
            <Card className="lg:col-span-1 p-6 text-left flex flex-col gap-4">
              <div className="border-b pb-3">
                <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Collection Compiler</h3>
                <span className="text-[10px] text-muted-foreground">Manual selections or automatic criteria compilation filters.</span>
              </div>

              <form onSubmit={handleCreateCollectionSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Collection Name</span>
                  <Input
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="e.g. Premium Hardware Accessories"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Description</span>
                  <textarea
                    value={newCollectionDesc}
                    onChange={(e) => setNewCollectionDesc(e.target.value)}
                    className="w-full p-2 text-xs border rounded-lg bg-transparent focus:outline-none"
                    rows={2}
                    placeholder="Brief collection theme summary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Collection Type</span>
                  <div className="flex items-center gap-2 bg-brand-slate/40 dark:bg-zinc-900/40 p-1.5 border rounded-lg">
                    <button
                      type="button"
                      onClick={() => setNewCollectionType("manual")}
                      className={`flex-1 text-[10px] py-1 font-bold rounded cursor-pointer ${newCollectionType === "manual" ? "bg-white dark:bg-zinc-950 text-foreground border border-border shadow-xs" : "text-muted-foreground"}`}
                    >
                      Manual Index
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCollectionType("smart")}
                      className={`flex-1 text-[10px] py-1 font-bold rounded cursor-pointer ${newCollectionType === "smart" ? "bg-white dark:bg-zinc-950 text-foreground border border-border shadow-xs" : "text-muted-foreground"}`}
                    >
                      Smart Filter
                    </button>
                  </div>
                </div>

                {newCollectionType === "manual" ? (
                  <div className="flex flex-col gap-1.5 border-t border-brand-border dark:border-border/20 pt-3">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Select product indices</span>
                    <div className="max-h-36 overflow-y-auto border border-brand-border dark:border-border/40 rounded-lg p-2 flex flex-col gap-1 bg-white dark:bg-zinc-950">
                      {products.map(p => (
                        <label key={p.id} className="flex items-center gap-2 text-[10px] cursor-pointer hover:bg-brand-slate/20 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={selectedCollectionProducts.includes(p.id)}
                            onChange={(e) => {
                              setSelectedCollectionProducts(prev =>
                                e.target.checked ? [...prev, p.id] : prev.filter(id => id !== p.id)
                              );
                            }}
                            className="h-3 w-3 rounded text-[#25D366]"
                          />
                          <span className="font-semibold">{p.name} ({p.sku})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5 border-t border-brand-border dark:border-border/20 pt-3">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Smart Rule: Category Equals</span>
                    <Input
                      placeholder="e.g. IoT Hardware"
                      value={newCollectionRules[0]?.value || ""}
                      onChange={(e) => {
                        setNewCollectionRules([
                          { field: "category", operator: "equals", value: e.target.value }
                        ]);
                      }}
                    />
                  </div>
                )}

                <Button type="submit" variant="success" size="sm" className="mt-2 w-full">
                  Create and Index Collection
                </Button>
              </form>
            </Card>

            {/* Collections list console */}
            <Card className="lg:col-span-2 p-6 text-left flex flex-col gap-4">
              <div className="border-b pb-3">
                <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Active Collections</h3>
                <span className="text-[10px] text-muted-foreground">Collections currently indexed and catalog sync-ready.</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collections.map(coll => {
                  const collProds = products.filter(p => {
                    if (coll.type === "manual") return coll.productIds.includes(p.id);
                    // Smart collection category checker
                    const ruleVal = coll.rules.find(r => r.field === "category")?.value;
                    return p.category === ruleVal;
                  });

                  return (
                    <Card key={coll.id} className="p-4 flex flex-col justify-between gap-3 relative border border-brand-border dark:border-border/30">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-brand-navy dark:text-foreground">{coll.name}</h4>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                            coll.type === "smart" ? "bg-brand-sky/10 text-brand-sky border-brand-sky/20" : "bg-brand-slate text-muted-foreground"
                          }`}>
                            {coll.type.toUpperCase()}
                          </span>
                        </div>
                        {coll.description && <p className="text-[10px] text-zinc-400 leading-normal line-clamp-2 h-7">{coll.description}</p>}
                        
                        <div className="mt-2 flex flex-col gap-1">
                          <span className="text-[9px] font-bold text-zinc-400">Products ({collProds.length}):</span>
                          <div className="flex flex-wrap gap-1">
                            {collProds.map(p => (
                              <span key={p.id} className="text-[8px] bg-brand-slate dark:bg-zinc-800 border px-1.5 py-0.5 rounded font-medium">
                                {p.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-brand-border dark:border-border/20 pt-2 flex items-center justify-between">
                        <span className="text-[9px] text-zinc-400 font-mono">ID: {coll.id}</span>
                        <Button
                          variant="outline"
                          size="icon-xs"
                          className="text-red-500 border-red-500/10 hover:bg-red-500/10"
                          onClick={() => {
                            deleteCollection(coll.id);
                            addToast("Collection deleted from catalogue index.", "success");
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>

          </div>
        )}

        {/* TAB 5: ORDERS HUB & SHIPMENTS */}
        {activeTab === "orders" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            
            {/* Orders list left pane */}
            <Card className="lg:col-span-7 p-6 text-left flex flex-col gap-4">
              <div className="border-b pb-3 flex items-center justify-between select-none">
                <div>
                  <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground"> Fulfillments & Orders queue</h3>
                  <span className="text-[10px] text-muted-foreground">Telemetry logs of active order purchases.</span>
                </div>
                <span className="text-xs font-bold text-[#25D366] font-mono">{orders.length} orders recorded</span>
              </div>

              <div className="overflow-x-auto max-h-screen overflow-y-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b text-muted-foreground font-bold bg-brand-slate/20 dark:bg-zinc-900/40">
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Items</th>
                      <th className="py-2.5 px-3">Total</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-brand-navy dark:text-zinc-300 select-none">
                    {orders.map(ord => (
                      <tr
                        key={ord.id}
                        onClick={() => setSelectedOrderId(ord.id)}
                        className={`hover:bg-brand-slate/10 dark:hover:bg-zinc-900/30 cursor-pointer transition-colors ${selectedOrderId === ord.id ? "bg-brand-slate/30 dark:bg-zinc-900/50" : ""}`}
                      >
                        <td className="py-3.5 px-3 font-mono font-bold text-foreground">{ord.id}</td>
                        <td className="py-3.5 px-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-brand-navy dark:text-foreground">{ord.customerName}</span>
                            <span className="text-[9px] text-zinc-400 font-mono">{ord.customerPhone}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-zinc-400">
                          {ord.items.reduce((sum, item) => sum + item.quantity, 0)} items
                        </td>
                        <td className="py-3.5 px-3 font-mono font-bold text-foreground">${ord.total.toFixed(2)}</td>
                        <td className="py-3.5 px-3">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            ord.status === "delivered" ? "bg-brand-green/20 text-brand-green" :
                            ord.status === "processing" ? "bg-brand-sky/20 text-brand-sky" :
                            ord.status === "shipped" ? "bg-amber-500/20 text-amber-500" :
                            "bg-red-500/20 text-red-500"
                          }`}>
                            {ord.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border ${
                            ord.paymentStatus === "paid" ? "bg-brand-green/10 text-brand-green border-brand-green/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                          }`}>
                            {ord.paymentStatus.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Order details right pane */}
            <Card className="lg:col-span-5 p-6 text-left flex flex-col justify-between gap-4">
              {activeOrder ? (
                <div className="flex flex-col gap-4">
                  <div className="border-b pb-3 flex items-center justify-between select-none">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-400 font-mono">Invoice Order Details</span>
                      <h4 className="text-sm font-extrabold text-brand-navy dark:text-foreground">{activeOrder.id}</h4>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => setShowInvoiceModal(true)}
                        leftIcon={<FileText className="h-3.5 w-3.5" />}
                      >
                        Print Invoice
                      </Button>
                      
                      {activeOrder.paymentStatus === "paid" && activeOrder.status !== "returned" && (
                        <Button
                          variant="outline"
                          size="xs"
                          className="text-red-500 border-red-500/10 hover:bg-red-500/10"
                          onClick={() => {
                            refundOrder(activeOrder.id);
                            addToast("Order payment transaction marked refunded.", "success");
                          }}
                        >
                          Refund Order
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Customer credentials card */}
                  <div className="bg-brand-slate/40 dark:bg-zinc-900/50 p-3 rounded-xl border border-brand-border/60">
                    <h5 className="text-[10px] font-extrabold text-muted-foreground uppercase mb-1.5">Customer Profile</h5>
                    <div className="flex flex-col text-[11px] gap-1 font-semibold text-brand-navy dark:text-zinc-200">
                      <span>Name: {activeOrder.customerName}</span>
                      <span>Email: {activeOrder.customerEmail}</span>
                      <span>Phone: {activeOrder.customerPhone}</span>
                      <span>Address: {activeOrder.shippingAddress}</span>
                    </div>
                  </div>

                  {/* Purchased items list */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Items Purchased</span>
                    <div className="flex flex-col gap-1.5">
                      {activeOrder.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between bg-white dark:bg-zinc-950 p-2 border border-brand-border/40 rounded-lg text-xs">
                          <div className="flex items-center gap-2">
                            <img src={item.image} className="w-8 h-8 object-cover rounded border" />
                            <div className="flex flex-col">
                              <span className="font-bold line-clamp-1">{item.name}</span>
                              <span className="text-[9px] text-zinc-400 font-mono">{item.sku} (x{item.quantity})</span>
                            </div>
                          </div>
                          <span className="font-mono font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Pricing Total calculations */}
                  <div className="border-t pt-3 flex flex-col gap-1 text-[11px] font-mono text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${activeOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes (18% GST):</span>
                      <span>${activeOrder.taxTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping charges:</span>
                      <span>${activeOrder.shippingTotal.toFixed(2)}</span>
                    </div>
                    {activeOrder.discountTotal > 0 && (
                      <div className="flex justify-between text-brand-green font-bold">
                        <span>Discounts applied:</span>
                        <span>-${activeOrder.discountTotal.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs font-extrabold text-foreground border-t pt-1.5 mt-1 select-none">
                      <span>Order total:</span>
                      <span>${activeOrder.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Timeline progress steps */}
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Order timeline logs</span>
                    <div className="flex flex-col gap-2 relative pl-3.5 border-l border-brand-border dark:border-border/30 ml-2 select-none text-[10px] max-h-36 overflow-y-auto">
                      {activeOrder.timeline.map((evt, idx) => (
                        <div key={evt.id} className="relative flex flex-col gap-0.5">
                          <span className="absolute -left-[20px] top-1.5 w-2 h-2 rounded-full bg-brand-navy dark:bg-foreground" />
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-brand-navy dark:text-foreground">{evt.status}</span>
                            <span className="text-[8px] text-zinc-400 font-mono">{new Date(evt.date).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-zinc-400 leading-normal">{evt.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
                  <span className="text-xs text-muted-foreground">Select an order row from the grid list to view invoice, timeline tracking, and shipping dispatch statuses.</span>
                </div>
              )}

              {activeOrder && (
                <div className="border-t border-brand-border dark:border-border/20 pt-4 mt-3 flex flex-col gap-2">
                  <span className="text-[10px] font-extrabold text-zinc-400 uppercase">Fulfillment Status Control</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeOrder.status === "pending" && (
                      <Button
                        variant="success"
                        size="xs"
                        onClick={() => {
                          updateOrderStatus(activeOrder.id, "processing", "Fulfillment warehouse packaging completed. Parcel awaiting shipping handler pickup.", "System Dispatch Broker");
                          addToast("Order advanced to packaging/processing queue.", "success");
                        }}
                      >
                        Start Processing
                      </Button>
                    )}
                    {activeOrder.status === "processing" && (
                      <Button
                        variant="success"
                        size="xs"
                        onClick={() => {
                          updateOrderStatus(activeOrder.id, "shipped", "Shipped package. Airway bill assigned tracking number BD-NEW-XYZ.", "Courier Hub Node");
                          addToast("Order package marked dispatched/shipped.", "success");
                        }}
                      >
                        Dispatch Package
                      </Button>
                    )}
                    {activeOrder.status === "shipped" && (
                      <Button
                        variant="success"
                        size="xs"
                        onClick={() => {
                          updateOrderStatus(activeOrder.id, "delivered", "Courier delivery confirm signature accepted.", "Delivery Agent");
                          addToast("Fulfillment lifecycle complete. Delivered.", "success");
                        }}
                      >
                        Mark Delivered
                      </Button>
                    )}
                    {activeOrder.status !== "cancelled" && activeOrder.status !== "returned" && activeOrder.status !== "delivered" && (
                      <Button
                        variant="outline"
                        size="xs"
                        className="text-red-500 border-red-500/10 hover:bg-red-500/10"
                        onClick={() => {
                          updateOrderStatus(activeOrder.id, "cancelled", "Fulfillment execution aborted. Customer requested refund loops.", "Admin Override");
                          addToast("Fulfillment cancelled successfully.", "success");
                        }}
                      >
                        Cancel Fulfillment
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>

          </div>
        )}

        {/* TAB 6: MARKETING COUPONS */}
        {activeTab === "coupons" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn text-left">
            
            {/* Create Coupon form */}
            <Card className="lg:col-span-1 p-6 flex flex-col gap-4">
              <div className="border-b pb-3">
                <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Marketing Coupon Code builder</h3>
                <span className="text-[10px] text-muted-foreground">Discount rule configurations, expiry, and parameters caps.</span>
              </div>

              <form onSubmit={handleCreateCouponSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Coupon Promo Code</span>
                  <Input
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="e.g. FLASH30"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Discount Type</span>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="h-9 px-2 border border-brand-border dark:border-border/40 rounded-xl text-xs bg-white dark:bg-zinc-950 text-foreground cursor-pointer focus:outline-none"
                  >
                    <option value="percentage">Percentage discount (%)</option>
                    <option value="flat">Flat dollar reduction ($)</option>
                    <option value="bogo">BOGO Buy 1 Get 1 free</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Discount Value</span>
                  <Input
                    type="number"
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(e.target.value)}
                    placeholder="e.g. 20"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Min Spend ($)</span>
                    <Input
                      type="number"
                      value={newCouponMinSpend}
                      onChange={(e) => setNewCouponMinSpend(e.target.value)}
                      placeholder="50"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Usage limit</span>
                    <Input
                      type="number"
                      value={newCouponLimit}
                      onChange={(e) => setNewCouponLimit(e.target.value)}
                      placeholder="100"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Expiry Date</span>
                  <Input
                    type="date"
                    value={newCouponExpiry}
                    onChange={(e) => setNewCouponExpiry(e.target.value)}
                  />
                </div>

                <Button type="submit" variant="success" size="sm" className="mt-2 w-full">
                  Publish Promo Code
                </Button>
              </form>
            </Card>

            {/* Coupons list */}
            <Card className="lg:col-span-2 p-6 flex flex-col gap-4">
              <div className="border-b pb-3">
                <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Active Coupons Directory</h3>
                <span className="text-[10px] text-muted-foreground">List of active checkout promo discount rules codes.</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map(coup => (
                  <Card key={coup.id} className="p-4 flex flex-col justify-between gap-3 border border-brand-border dark:border-border/30">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-extrabold text-xs text-[#25D366] bg-[#25D366]/10 px-2.5 py-0.5 rounded border border-[#25D366]/20">
                          {coup.code}
                        </span>
                        <Toggle
                          checked={coup.isActive}
                          onChange={() => toggleCouponActive(coup.id)}
                        />
                      </div>

                      <div className="flex flex-col mt-2 text-[11px] font-semibold text-brand-navy dark:text-zinc-200 gap-0.5">
                        <span>Discount: {coup.type === "percentage" ? `${coup.value}% off` : coup.type === "flat" ? `$${coup.value} off` : "Buy 1 Get 1 free"}</span>
                        {coup.minPurchaseAmount && <span>Min. order requirement: ${coup.minPurchaseAmount}</span>}
                        <span>Usage limit: {coup.usageCount} / {coup.usageLimit} claims used</span>
                        <span className="text-zinc-400 font-mono text-[9px] mt-1">Expires: {new Date(coup.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="border-t pt-2.5 flex items-center justify-end">
                      <Button
                        variant="outline"
                        size="icon-xs"
                        className="text-red-500 border-red-500/10 hover:bg-red-500/10"
                        onClick={() => {
                          deleteCoupon(coup.id);
                          addToast("Coupon deleted successfully from payment gates", "success");
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

          </div>
        )}

        {/* TAB 7: PAYMENTS & SHIPPING */}
        {activeTab === "shipping" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn text-left">
            
            {/* Payments & checkout sandbox left pane */}
            <Card className="lg:col-span-5 p-6 flex flex-col gap-4 justify-between">
              <div className="flex flex-col gap-3">
                <div className="border-b pb-3">
                  <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">WhatsApp Checkout Simulator</h3>
                  <span className="text-[10px] text-muted-foreground">Sandbox environment simulating credit cards, UPI, and cash flows.</span>
                </div>

                <form onSubmit={handleSandboxCheckout} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Product Checkout</span>
                    <select
                      value={checkoutProduct}
                      onChange={(e) => setCheckoutProduct(e.target.value)}
                      className="h-9 px-2 border border-brand-border dark:border-border/40 rounded-xl text-xs bg-white dark:bg-zinc-950 text-foreground cursor-pointer focus:outline-none"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (${p.salePrice || p.regularPrice})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">Quantity</span>
                      <Input
                        type="number"
                        min="1"
                        value={checkoutQuantity}
                        onChange={(e) => setCheckoutQuantity(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">Promo Code</span>
                      <Input
                        placeholder="e.g. SENSY20"
                        value={checkoutCouponCode}
                        onChange={(e) => setCheckoutCouponCode(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Payment Gateways</span>
                    <div className="grid grid-cols-3 gap-2 bg-brand-slate/40 dark:bg-zinc-900/40 p-1.5 border rounded-xl">
                      {["Stripe", "Razorpay", "Cash"].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setCheckoutPaymentMethod(method as any)}
                          className={`text-[10px] py-1.5 font-bold rounded-lg cursor-pointer ${checkoutPaymentMethod === method ? "bg-[#25D366] text-white" : "text-muted-foreground hover:bg-white/10"}`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Customer Name</span>
                    <Input
                      value={checkoutCustomerName}
                      onChange={(e) => setCheckoutCustomerName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Customer Address</span>
                    <Input
                      value={checkoutShippingAddress}
                      onChange={(e) => setCheckoutShippingAddress(e.target.value)}
                      placeholder="Gurugram, HR, India"
                    />
                  </div>

                  {/* Summary calculations */}
                  <div className="bg-brand-slate/20 dark:bg-zinc-900/50 p-3 rounded-xl border border-brand-border/40 text-[10px] font-mono text-muted-foreground mt-2">
                    <div className="flex justify-between">
                      <span>Checkout price:</span>
                      <span>${computedCheckoutPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Est. tax + delivery:</span>
                      <span>$17.00</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-foreground border-t pt-1.5 mt-1 select-none">
                      <span>Total Invoice:</span>
                      <span>${computedCheckoutPrice + 17.00}</span>
                    </div>
                  </div>

                  <Button type="submit" variant="success" size="sm" className="w-full mt-2">
                    Trigger Checkout and Complete Order
                  </Button>
                </form>
              </div>
            </Card>

            {/* Shipping rate structures right pane */}
            <Card className="lg:col-span-7 p-6 text-left flex flex-col gap-4">
              <div className="border-b pb-3">
                <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Fulfillment Courier Zones</h3>
                <span className="text-[10px] text-muted-foreground">Define flat rates methods and countries coverage matrices.</span>
              </div>

              <div className="flex flex-col gap-4">
                {shippingZones.map(zone => (
                  <div key={zone.id} className="border border-brand-border dark:border-border/30 rounded-xl p-4 flex flex-col gap-2.5 bg-card relative">
                    <div className="flex items-center justify-between border-b border-brand-border/40 pb-2">
                      <h4 className="text-xs font-extrabold text-brand-navy dark:text-foreground">{zone.name}</h4>
                      <span className="text-[9px] font-bold text-zinc-400 font-mono">Zones: {zone.countries.join(", ")}</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">Available Carrier options</span>
                      <div className="flex flex-col gap-1.5">
                        {zone.methods.map(meth => (
                          <div key={meth.id} className="flex justify-between items-center bg-brand-slate/40 dark:bg-zinc-900/50 p-2 rounded-lg text-xs font-semibold text-brand-navy dark:text-zinc-200">
                            <div className="flex flex-col">
                              <span>{meth.name}</span>
                              <span className="text-[9px] text-zinc-400 font-mono">Estimated delivery: {meth.minDeliveryDays}-{meth.maxDeliveryDays} days</span>
                            </div>
                            <span className="font-mono font-extrabold text-[#25D366]">${meth.rate.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        )}

        {/* TAB 8: WHATSAPP CLOUD SYNC PREVIEW */}
        {activeTab === "whatsapp" && (
          <div className="flex flex-col gap-6 animate-fadeIn text-left">
            
            {/* Meta Catalog syncing stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
              <Card className="p-4 flex flex-col gap-1 bg-card">
                <span className="text-[9px] font-bold text-zinc-400 uppercase">Meta Sync Status</span>
                <span className="text-lg font-extrabold text-foreground font-mono">CONNECTED</span>
              </Card>
              <Card className="p-4 flex flex-col gap-1 bg-card">
                <span className="text-[9px] font-bold text-zinc-400 uppercase">Synced Products</span>
                <span className="text-lg font-extrabold text-brand-green font-mono">
                  {products.filter(p => p.isWhatsAppSynced).length} items
                </span>
              </Card>
              <Card className="p-4 flex flex-col gap-1 bg-card">
                <span className="text-[9px] font-bold text-zinc-400 uppercase">Unsynced Queue</span>
                <span className="text-lg font-extrabold text-amber-500 font-mono">
                  {products.filter(p => !p.isWhatsAppSynced).length} items
                </span>
              </Card>
              <Card className="p-4 flex flex-col gap-1 bg-card">
                <span className="text-[9px] font-bold text-zinc-400 uppercase">Webhook API Status</span>
                <span className="text-lg font-extrabold text-brand-green font-mono">ACTIVE (200 OK)</span>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Product syncing checklist */}
              <Card className="lg:col-span-8 p-6 flex flex-col gap-4">
                <div className="border-b pb-3 flex items-center justify-between select-none">
                  <div>
                    <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Meta Business Manager Products Grid</h3>
                    <span className="text-[10px] text-muted-foreground">Review synchronization statuses for specific catalog items.</span>
                  </div>
                  <Button
                    variant="success"
                    size="xs"
                    onClick={syncAllProductsToWhatsApp}
                  >
                    Sync All Products
                  </Button>
                </div>

                <div className="overflow-x-auto select-none">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b text-muted-foreground font-bold bg-brand-slate/20 dark:bg-zinc-900/40">
                        <th className="py-2.5 px-3">Product Name</th>
                        <th className="py-2.5 px-3 font-mono">SKU</th>
                        <th className="py-2.5 px-3">WhatsApp Synced</th>
                        <th className="py-2.5 px-3">Meta Sync Status</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-brand-navy dark:text-zinc-300">
                      {products.map(prod => (
                        <tr key={prod.id} className="hover:bg-brand-slate/10 dark:hover:bg-zinc-900/30">
                          <td className="py-3.5 px-3 font-bold text-brand-navy dark:text-foreground">{prod.name}</td>
                          <td className="py-3.5 px-3 font-mono text-muted-foreground">{prod.sku}</td>
                          <td className="py-3.5 px-3">
                            <span className={`inline-flex items-center gap-1 text-[8px] font-bold px-2 py-0.5 rounded-full ${
                              prod.isWhatsAppSynced ? "bg-[#25D366]/10 text-[#25D366]" : "bg-zinc-500/10 text-zinc-500"
                            }`}>
                              {prod.isWhatsAppSynced ? "Synced" : "Not Synced"}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-mono font-bold">
                            <span className={`${
                              prod.whatsAppSyncStatus === "synced" ? "text-brand-green" :
                              prod.whatsAppSyncStatus === "pending" ? "text-amber-500 animate-pulse" : "text-zinc-400"
                            }`}>
                              {prod.whatsAppSyncStatus.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => {
                                syncProductToWhatsApp(prod.id);
                                addToast(`Synchronization loop initiated for product ${prod.sku}`, "info");
                              }}
                            >
                              Sync Node
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Webhook diagnostics logger */}
              <Card className="lg:col-span-4 p-6 flex flex-col gap-4 text-left">
                <div className="border-b pb-3">
                  <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Meta Sync Webhook logs</h3>
                  <span className="text-[10px] text-muted-foreground">Diagnostic logs of sync push notification pings.</span>
                </div>

                <div className="bg-brand-navy dark:bg-zinc-950 p-3 rounded-xl border font-mono text-[9px] text-zinc-300 leading-relaxed flex flex-col gap-1.5 max-h-72 overflow-y-auto">
                  <div>[2026-06-26T17:10:20Z] Webhook verified: sub_verified = true</div>
                  <div className="text-brand-green">[2026-06-26T17:11:00Z] POST /catalog/products/sync: prod-1 sync success. Ref ID: META-90184</div>
                  <div>[2026-06-26T17:12:12Z] GET /catalog/health: API ping success - 0.8ms latency</div>
                  <div className="text-amber-500">[2026-06-26T17:15:30Z] Webhook trigger payload: prod-2 change registered</div>
                  <div className="text-brand-green">[2026-06-26T17:15:32Z] Sync success: prod-2 marked live.</div>
                </div>
              </Card>

            </div>

          </div>
        )}

        {/* TAB 9: SALES LTV ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="flex flex-col gap-6 animate-fadeIn text-left">
            
            {/* Charts section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start select-none">
              
              {/* Revenue line chart */}
              <Card className="lg:col-span-8 p-6 flex flex-col gap-4">
                <div className="border-b pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Total Revenue Forecast LTV</h3>
                    <span className="text-[10px] text-muted-foreground">Interactive line telemetry of payments collected.</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-brand-green">+$458.00 this month</span>
                </div>

                {/* SVG Line graph */}
                <div className="w-full h-56 flex flex-col justify-between mt-2 relative select-none">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-12 text-[9px] text-zinc-400/40">
                    <div className="w-full border-t border-zinc-100 dark:border-zinc-800/40 pt-1 text-right">$500</div>
                    <div className="w-full border-t border-zinc-100 dark:border-zinc-800/40 pt-1 text-right">$300</div>
                    <div className="w-full border-t border-zinc-100 dark:border-zinc-800/40 pt-1 text-right">$100</div>
                  </div>

                  <div className="flex-1 w-full relative z-10">
                    <svg className="w-full h-full" viewBox="0 0 600 160" preserveAspectRatio="none">
                      <path
                        d="M 50 140 C 150 120, 250 80, 350 90 C 450 60, 500 50, 550 20"
                        fill="none"
                        stroke="#25D366"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle cx="50" cy="140" r="4.5" fill="#25D366" stroke="#fff" strokeWidth="1.5" />
                      <circle cx="350" cy="90" r="4.5" fill="#25D366" stroke="#fff" strokeWidth="1.5" />
                      <circle cx="550" cy="20" r="4.5" fill="#25D366" stroke="#fff" strokeWidth="1.5" />
                    </svg>
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-muted-foreground px-4 pt-1 z-20 border-t border-brand-border/40 font-mono">
                    <span>Jun 20</span>
                    <span>Jun 22</span>
                    <span>Jun 24</span>
                    <span>Jun 26</span>
                  </div>
                </div>
              </Card>

              {/* LTV customer analytics leaderboard */}
              <Card className="lg:col-span-4 p-6 flex flex-col gap-4">
                <div className="border-b pb-3">
                  <h3 className="text-sm font-extrabold text-brand-navy dark:text-foreground">High LTV Customer Directory</h3>
                  <span className="text-[10px] text-muted-foreground">Top customers ranked by lifetime spend.</span>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  {[
                    { name: "Sarah Jenkins", email: "sarah.j@automationcorp.com", spend: 254.60, orders: 1 },
                    { name: "Rohan Sharma", email: "rohan.sharma@enterprise.in", spend: 215.02, orders: 1 },
                    { name: "Amit Patel", email: "amit@pateltech.co.in", spend: 121.82, orders: 1 }
                  ].map((cust, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-brand-slate/40 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-brand-border/60">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-brand-navy dark:text-foreground">{cust.name}</span>
                        <span className="text-[9px] text-zinc-400 font-mono">{cust.email}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-extrabold text-[#25D366] font-mono">${cust.spend.toFixed(2)}</span>
                        <span className="text-[8px] text-zinc-400">{cust.orders} order</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

            </div>

          </div>
        )}

      </div>

      {/* MODAL 1: BULK PRICE ADJUSTER */}
      {showBulkPriceModal && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fadeIn">
          <Card className="w-full max-w-md p-6 flex flex-col gap-4 m-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Bulk Price Adjuster</h4>
              <button onClick={() => setShowBulkPriceModal(false)} className="p-1 hover:bg-brand-slate dark:hover:bg-zinc-800 rounded">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleBulkPriceSubmit} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Adjustment Direction</span>
                <div className="grid grid-cols-2 gap-2 bg-brand-slate/40 dark:bg-zinc-900/40 p-1 border rounded-lg">
                  <button
                    type="button"
                    onClick={() => setBulkPriceIncrease(true)}
                    className={`py-1 text-[10px] font-bold rounded cursor-pointer ${bulkPriceIncrease ? "bg-white dark:bg-zinc-950 text-foreground border shadow-xs" : "text-muted-foreground"}`}
                  >
                    Increase Prices (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkPriceIncrease(false)}
                    className={`py-1 text-[10px] font-bold rounded cursor-pointer ${!bulkPriceIncrease ? "bg-white dark:bg-zinc-950 text-foreground border shadow-xs" : "text-muted-foreground"}`}
                  >
                    Decrease Prices (-)
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Percentage Amount (%)</span>
                <Input
                  type="number"
                  value={bulkPricePercent}
                  onChange={(e) => setBulkPricePercent(e.target.value)}
                  placeholder="10"
                  required
                />
              </div>

              <div className="flex items-center gap-2 border-t pt-4">
                <Button type="submit" variant="success" size="sm" className="flex-1">
                  Apply Catalog Modification
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowBulkPriceModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* MODAL 2: IMPORT PRODUCTS JSON */}
      {showImportModal && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fadeIn">
          <Card className="w-full max-w-lg p-6 flex flex-col gap-4 m-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-sm font-extrabold text-brand-navy dark:text-foreground">Import Catalog Products</h4>
              <button onClick={() => setShowImportModal(false)} className="p-1 hover:bg-brand-slate dark:hover:bg-zinc-800 rounded">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Paste Raw JSON data (Single item or Array)</span>
                <textarea
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  className="w-full p-2.5 text-[10px] font-mono border rounded-xl bg-white dark:bg-zinc-950 text-foreground"
                  rows={8}
                  placeholder={`[
  {
    "name": "ExpendMore Node Smart Relay",
    "sku": "SENSY-RELAY-12",
    "category": "IoT Hardware",
    "regularPrice": 19.99,
    "stock": 100
  }
]`}
                  required
                />
              </div>

              <div className="flex items-center gap-2 border-t pt-4">
                <Button type="submit" variant="success" size="sm" className="flex-1">
                  Import Database Records
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowImportModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* MODAL 3: INVOICE GENERATOR VIEW MODAL */}
      {showInvoiceModal && activeOrder && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fadeIn">
          <Card className="w-full max-w-2xl p-8 flex flex-col gap-6 m-4 bg-white text-zinc-800 font-sans border shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4 select-none">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-[#25D366]/10 text-[#25D366] rounded-lg">
                  <ShoppingBag className="h-5 w-5" />
                </span>
                <span className="font-extrabold text-sm tracking-tight text-zinc-900">ExpendMore Commerce</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="xs"
                  className="text-zinc-600 border-zinc-200 hover:bg-zinc-100"
                  onClick={() => window.print()}
                >
                  Print Invoice
                </Button>
                <button onClick={() => setShowInvoiceModal(false)} className="p-1 hover:bg-zinc-100 rounded">
                  <X className="h-4 w-4 text-zinc-400" />
                </button>
              </div>
            </div>

            {/* Bill Info */}
            <div className="grid grid-cols-2 gap-4 text-xs text-left">
              <div className="flex flex-col gap-1.5">
                <span className="font-extrabold uppercase text-[9px] text-zinc-400">Sold By</span>
                <span className="font-extrabold text-zinc-900">ExpendMore Enterprises India Private Limited</span>
                <span className="text-zinc-500 font-medium">Sector 18, Gurugram, Haryana, 122015</span>
                <span className="text-zinc-500 font-mono text-[10px]">GSTIN: 06AAAAA0000A1Z1</span>
              </div>
              <div className="flex flex-col gap-1.5 items-end text-right">
                <span className="font-extrabold uppercase text-[9px] text-zinc-400">Bill To</span>
                <span className="font-extrabold text-zinc-900">{activeOrder.customerName}</span>
                <span className="text-zinc-500 font-medium">{activeOrder.shippingAddress}</span>
                <span className="text-zinc-500 font-mono text-[10px]">{activeOrder.customerPhone}</span>
              </div>
            </div>

            {/* Invoice meta info */}
            <div className="grid grid-cols-3 gap-2 bg-zinc-50 p-3 rounded-lg border border-zinc-100 text-left text-[10px] font-mono text-zinc-500 select-none">
              <div>Invoice No: <span className="font-bold text-zinc-700">{activeOrder.id}</span></div>
              <div>Invoice Date: <span className="font-bold text-zinc-700">{new Date(activeOrder.createdAt).toLocaleDateString()}</span></div>
              <div>Payment Status: <span className="font-bold text-zinc-700">{activeOrder.paymentStatus.toUpperCase()}</span></div>
            </div>

            {/* Items table */}
            <div className="border border-zinc-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 text-zinc-500 font-bold border-b border-zinc-200">
                    <th className="py-2 px-3">Description</th>
                    <th className="py-2 px-3">SKU</th>
                    <th className="py-2 px-3 font-mono">Rate</th>
                    <th className="py-2 px-3 font-mono">Qty</th>
                    <th className="py-2 px-3 text-right font-mono">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-zinc-700">
                  {activeOrder.items.map(item => (
                    <tr key={item.id}>
                      <td className="py-3 px-3 font-bold text-zinc-900">{item.name}</td>
                      <td className="py-3 px-3 font-mono text-[10px]">{item.sku}</td>
                      <td className="py-3 px-3 font-mono">${item.price.toFixed(2)}</td>
                      <td className="py-3 px-3 font-mono">{item.quantity}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex flex-col items-end gap-1.5 text-xs font-mono text-zinc-500 border-t pt-4">
              <div className="flex justify-between w-64">
                <span>Subtotal:</span>
                <span>${activeOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-64">
                <span>CGST/SGST (18%):</span>
                <span>${activeOrder.taxTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-64">
                <span>Delivery Shipping:</span>
                <span>${activeOrder.shippingTotal.toFixed(2)}</span>
              </div>
              {activeOrder.discountTotal > 0 && (
                <div className="flex justify-between w-64 text-[#25D366] font-bold">
                  <span>Discounts Applied:</span>
                  <span>-${activeOrder.discountTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between w-64 text-sm font-extrabold text-zinc-900 border-t pt-1.5 mt-1 select-none">
                <span>Invoice Total:</span>
                <span>${activeOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-zinc-400 select-none border-t pt-3.5">
              Thank you for purchasing with ExpendMore Commerce. For fulfillment tracking details check WhatsApp chat alerts.
            </div>
          </Card>
        </div>
      )}

    </DashboardShell>
  );
}

import { create } from "zustand";
import {
  Product,
  ProductVariant,
  Collection,
  Order,
  Coupon,
  ShippingZone,
  CustomerCommerceStats,
  InventoryHistoryLog,
  CollectionRule,
  OrderItem,
  OrderTimelineEvent
} from "@/types/commerce";

// Initial mock products database
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "ExpendMore Smart Hub Controller",
    sku: "SENSY-HUB-01",
    barcode: "8901234567890",
    description: "The central nervous system of your IoT visual automation flow. Integrates directly with WhatsApp webhooks, triggers local node alerts, and logs environment statistics in real-time.",
    shortDescription: "Enterprise central IoT workspace controller",
    brand: "ExpendMore Core",
    category: "IoT Hardware",
    tags: ["hub", "controller", "featured", "hardware"],
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop"
    ],
    regularPrice: 120.0,
    salePrice: 99.0,
    costPrice: 45.0,
    currency: "USD",
    taxRate: 18,
    status: "published",
    stock: 45,
    warehouseLocation: "Aisle 4, Shelf B",
    lowStockAlertThreshold: 10,
    variants: [
      { id: "var-1-1", sku: "SENSY-HUB-01-NAVY", color: "Midnight Navy", size: "Standard", price: 99.0, stock: 25 },
      { id: "var-1-2", sku: "SENSY-HUB-01-GRAY", color: "Slate Gray", size: "Standard", price: 99.0, stock: 20 }
    ],
    inventoryHistory: [
      { id: "log-1", date: "2026-06-20T10:00:00Z", type: "addition", amount: 50, reason: "Initial shipment intake", user: "Admin (Aditya)" },
      { id: "log-2", date: "2026-06-25T14:30:00Z", type: "reduction", amount: 5, reason: "Order ORD-8941 shipment fulfillment", user: "Warehouse Auto Bot" }
    ],
    isWhatsAppSynced: true,
    whatsAppSyncStatus: "synced",
    createdAt: "2026-06-20T09:00:00Z",
    updatedAt: "2026-06-26T12:00:00Z"
  },
  {
    id: "prod-2",
    name: "Premium IoT Node Sensor",
    sku: "SENSY-NODE-02",
    barcode: "8902345678901",
    description: "Battery-powered Bluetooth/Zigbee mesh sensor monitoring temperature, humidity, and motion thresholds. Ideal for warehouse inventory safety loops and visual trigger integrations.",
    shortDescription: "Zigbee mesh multi-sensor logic trigger",
    brand: "ExpendMore Core",
    category: "ExpendMore Nodes",
    tags: ["sensor", "mesh", "zigbee"],
    images: ["https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=500&auto=format&fit=crop"],
    regularPrice: 45.0,
    costPrice: 15.0,
    currency: "USD",
    taxRate: 18,
    status: "published",
    stock: 12, // triggers low stock warning (threshold is 20)
    warehouseLocation: "Aisle 2, Shelf D",
    lowStockAlertThreshold: 20,
    variants: [
      { id: "var-2-1", sku: "SENSY-NODE-02-TEMP", material: "Composite Plastic", price: 45.0, stock: 8 },
      { id: "var-2-2", sku: "SENSY-NODE-02-PRO", material: "Industrial Aluminum", price: 55.0, stock: 4 }
    ],
    inventoryHistory: [
      { id: "log-3", date: "2026-06-21T08:00:00Z", type: "addition", amount: 20, reason: "Manual supplier intake", user: "Admin (Aditya)" },
      { id: "log-4", date: "2026-06-26T11:00:00Z", type: "reduction", amount: 8, reason: "Order ORD-8942 delivery dispatch", user: "Warehouse Auto Bot" }
    ],
    isWhatsAppSynced: false,
    whatsAppSyncStatus: "unsynced",
    createdAt: "2026-06-21T08:00:00Z",
    updatedAt: "2026-06-26T11:00:00Z"
  },
  {
    id: "prod-3",
    name: "ExpendMore Smart Plug Power",
    sku: "SENSY-PLUG-03",
    barcode: "8903456789012",
    description: "Compact 16A smart plug with active voltage metering, load scheduling, and remote kill switch hooks. Automatically safety-isolates machines during critical workflow exception states.",
    shortDescription: "16A smart relay plug with voltage monitor",
    brand: "ExpendMore Accessories",
    category: "IoT Hardware",
    tags: ["plug", "power", "relay"],
    images: ["https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=500&auto=format&fit=crop"],
    regularPrice: 29.0,
    salePrice: 25.0,
    costPrice: 9.5,
    currency: "USD",
    taxRate: 12,
    status: "out_of_stock",
    stock: 0,
    warehouseLocation: "Aisle 1, Shelf A",
    lowStockAlertThreshold: 5,
    variants: [],
    inventoryHistory: [
      { id: "log-5", date: "2026-06-18T10:00:00Z", type: "addition", amount: 15, reason: "Initial batch intake", user: "Sarah Jenkins" },
      { id: "log-6", date: "2026-06-24T16:00:00Z", type: "reduction", amount: 15, reason: "Stock depletion flash sale", user: "Fulfillment System" }
    ],
    isWhatsAppSynced: true,
    whatsAppSyncStatus: "synced",
    createdAt: "2026-06-18T10:00:00Z",
    updatedAt: "2026-06-24T16:00:00Z"
  },
  {
    id: "prod-4",
    name: "Visual Automation Dev-Kit",
    sku: "SENSY-KIT-04",
    barcode: "8904567890123",
    description: "Complete starter box packing 1x Smart Hub Controller, 3x Node Sensors, and 2x Smart Relays. Comes pre-flashed with the ExpendMore Edge OS, allowing immediate local drag-and-drop automation design.",
    shortDescription: "Complete IoT builder package kit",
    brand: "ExpendMore Core",
    category: "IoT Hardware",
    tags: ["kit", "starter", "bundle"],
    images: ["https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=500&auto=format&fit=crop"],
    regularPrice: 199.0,
    costPrice: 75.0,
    currency: "USD",
    taxRate: 18,
    status: "draft",
    stock: 10,
    warehouseLocation: "Aisle 4, Shelf F",
    lowStockAlertThreshold: 3,
    variants: [],
    inventoryHistory: [
      { id: "log-7", date: "2026-06-25T09:00:00Z", type: "addition", amount: 10, reason: "Promo bundle assembly completion", user: "Maria Gomez" }
    ],
    isWhatsAppSynced: false,
    whatsAppSyncStatus: "unsynced",
    createdAt: "2026-06-25T09:00:00Z",
    updatedAt: "2026-06-25T09:00:00Z"
  }
];

// Initial mock collections
const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: "coll-1",
    name: "Featured Gear Accessories",
    description: "Highly rated IoT smart relays, controllers, and monitoring sensors to kickstart your workspace automation loops.",
    type: "manual",
    rules: [],
    rulesMatchAll: true,
    isFeatured: true,
    productIds: ["prod-1", "prod-3"],
    createdAt: "2026-06-20T10:00:00Z"
  },
  {
    id: "coll-2",
    name: "Smart IoT Hardware",
    description: "Smart automation hardware matching 'IoT Hardware' categories, compiling nodes and controllers.",
    type: "smart",
    rules: [
      { id: "rule-1", field: "category", operator: "equals", value: "IoT Hardware" }
    ],
    rulesMatchAll: true,
    isFeatured: false,
    productIds: [], // Resolved dynamically in store
    createdAt: "2026-06-21T12:00:00Z"
  }
];

// Initial mock discount coupons
const INITIAL_COUPONS: Coupon[] = [
  {
    id: "coup-1",
    code: "SENSY20",
    type: "percentage",
    value: 20,
    minPurchaseAmount: 50,
    expiryDate: "2026-08-30T23:59:59Z",
    usageLimit: 500,
    usageCount: 124,
    isActive: true,
    createdAt: "2026-06-15T09:00:00Z"
  },
  {
    id: "coup-2",
    code: "FLAT50",
    type: "flat",
    value: 50.0,
    minPurchaseAmount: 180,
    expiryDate: "2026-07-31T23:59:59Z",
    usageLimit: 100,
    usageCount: 42,
    isActive: true,
    createdAt: "2026-06-16T10:00:00Z"
  },
  {
    id: "coup-3",
    code: "BOGOSTARTER",
    type: "bogo",
    value: 100, // Buy 1 get 1 free
    minPurchaseAmount: 199,
    expiryDate: "2026-06-30T23:59:59Z",
    usageLimit: 50,
    usageCount: 15,
    isActive: false,
    createdAt: "2026-06-20T11:00:00Z"
  }
];

// Initial shipping rate configurations
const INITIAL_SHIPPING: ShippingZone[] = [
  {
    id: "ship-1",
    name: "India (Domestic Delivery)",
    countries: ["IN"],
    methods: [
      { id: "sm-1-1", name: "Standard Delhi/Mumbai Courier", rate: 5.0, minDeliveryDays: 3, maxDeliveryDays: 5 },
      { id: "sm-1-2", name: "Bluedart Overnight Express", rate: 12.0, minDeliveryDays: 1, maxDeliveryDays: 2 }
    ]
  },
  {
    id: "ship-2",
    name: "North America & UK Region",
    countries: ["US", "CA", "GB"],
    methods: [
      { id: "sm-2-1", name: "DHL Global Standard Air", rate: 20.0, minDeliveryDays: 5, maxDeliveryDays: 8 },
      { id: "sm-2-2", name: "FedEx Priority Express Delivery", rate: 45.0, minDeliveryDays: 2, maxDeliveryDays: 4 }
    ]
  }
];

// Initial mock order records database
const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-8941",
    customerName: "Rohan Sharma",
    customerEmail: "rohan.sharma@enterprise.in",
    customerPhone: "+91 98765 43210",
    items: [
      { id: "item-1-1", productId: "prod-1", variantId: "var-1-1", name: "ExpendMore Smart Hub Controller (Midnight Navy)", sku: "SENSY-HUB-01-NAVY", price: 99.0, quantity: 1, image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=500&auto=format&fit=crop" },
      { id: "item-1-2", productId: "prod-2", variantId: "var-2-1", name: "Premium IoT Node Sensor (Composite Plastic)", sku: "SENSY-NODE-02-TEMP", price: 45.0, quantity: 2, image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=500&auto=format&fit=crop" }
    ],
    subtotal: 189.0,
    taxTotal: 34.02,
    shippingTotal: 12.0,
    discountTotal: 20.0, // used SENSY20
    total: 215.02,
    currency: "USD",
    paymentMethod: "UPI",
    paymentStatus: "paid",
    shippingMethod: "Bluedart Overnight Express",
    shippingAddress: "Plot 42, Sector 18, Gurugram, Haryana, 122015, India",
    shippingTrackingNumber: "BD-8941-XYZ",
    status: "processing",
    timeline: [
      { id: "t-1-1", date: "2026-06-25T14:00:00Z", status: "Order Created", message: "Order placed successfully by client Rohan Sharma via WhatsApp checkout flow.", actor: "Customer Flow" },
      { id: "t-1-2", date: "2026-06-25T14:05:00Z", status: "Paid", message: "UPI Payment of $215.02 completed successfully via PhonePe merchant broker interface.", actor: "Gateway System" },
      { id: "t-1-3", date: "2026-06-25T14:30:00Z", status: "Inventory Deducted", message: "5 units deducted from standard stock inventory.", actor: "Warehouse Auto Bot" }
    ],
    createdAt: "2026-06-25T14:00:00Z",
    updatedAt: "2026-06-25T14:30:00Z"
  },
  {
    id: "ORD-8942",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah.j@automationcorp.com",
    customerPhone: "+1 (555) 019-2834",
    items: [
      { id: "item-2-1", productId: "prod-2", variantId: "var-2-2", name: "Premium IoT Node Sensor (Industrial Aluminum)", sku: "SENSY-NODE-02-PRO", price: 55.0, quantity: 4, image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=500&auto=format&fit=crop" }
    ],
    subtotal: 220.0,
    taxTotal: 39.6,
    shippingTotal: 45.0,
    discountTotal: 50.0, // used FLAT50
    total: 254.6,
    currency: "USD",
    paymentMethod: "Stripe",
    paymentStatus: "paid",
    shippingMethod: "FedEx Priority Express Delivery",
    shippingAddress: "123 Business Way, Suite 100, San Francisco, CA, 94107, USA",
    shippingTrackingNumber: "FE-908234-USA",
    status: "shipped",
    timeline: [
      { id: "t-2-1", date: "2026-06-24T09:00:00Z", status: "Order Created", message: "Order registered via Shopify integrations hook.", actor: "Webhook API" },
      { id: "t-2-2", date: "2026-06-24T09:02:00Z", status: "Paid", message: "Stripe transaction invoice ID ch_3N28kaOS confirmed.", actor: "Gateway System" },
      { id: "t-2-3", date: "2026-06-26T11:00:00Z", status: "Shipped", message: "Package picked up by FedEx courier. Carrier tracking number assigned.", actor: "Admin (Aditya)" }
    ],
    createdAt: "2026-06-24T09:00:00Z",
    updatedAt: "2026-06-26T11:00:00Z"
  },
  {
    id: "ORD-8943",
    customerName: "Amit Patel",
    customerEmail: "amit@pateltech.co.in",
    customerPhone: "+91 99998 88888",
    items: [
      { id: "item-3-1", productId: "prod-1", variantId: "var-1-2", name: "ExpendMore Smart Hub Controller (Slate Gray)", sku: "SENSY-HUB-01-GRAY", price: 99.0, quantity: 1, image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=500&auto=format&fit=crop" }
    ],
    subtotal: 99.0,
    taxTotal: 17.82,
    shippingTotal: 5.0,
    discountTotal: 0.0,
    total: 121.82,
    currency: "USD",
    paymentMethod: "Cash",
    paymentStatus: "pending",
    shippingMethod: "Standard Delhi/Mumbai Courier",
    shippingAddress: "456 Main Road, Delhi, 110001, India",
    status: "pending",
    timeline: [
      { id: "t-3-1", date: "2026-06-26T10:00:00Z", status: "Order Created", message: "Cash on delivery order requested by client.", actor: "Customer Flow" }
    ],
    createdAt: "2026-06-26T10:00:00Z",
    updatedAt: "2026-06-26T10:00:00Z"
  }
];

interface CommerceState {
  products: Product[];
  collections: Collection[];
  orders: Order[];
  coupons: Coupon[];
  shippingZones: ShippingZone[];
  activeProductIndexId: string | null;

  // Products CRUD
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt" | "inventoryHistory">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  archiveProduct: (id: string) => void;
  importProducts: (rawProducts: any[]) => void;
  bulkUpdatePrices: (percentage: number, increase: boolean) => void;
  bulkDeleteProducts: (ids: string[]) => void;

  // Inventory Updates
  addInventoryLog: (productId: string, log: Omit<InventoryHistoryLog, "id" | "date">) => void;

  // Collections Operations
  addCollection: (collection: Omit<Collection, "id" | "createdAt">) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;

  // Coupons
  addCoupon: (coupon: Omit<Coupon, "id" | "usageCount" | "createdAt">) => void;
  toggleCouponActive: (id: string) => void;
  deleteCoupon: (id: string) => void;

  // Shipping
  updateShippingZone: (id: string, updates: Partial<ShippingZone>) => void;

  // Orders Operations
  addOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt" | "timeline">) => void;
  updateOrderStatus: (id: string, status: Order["status"], message: string, actor: string) => void;
  refundOrder: (id: string) => void;

  // WhatsApp Meta Catalog Sync simulator
  syncProductToWhatsApp: (productId: string) => void;
  syncAllProductsToWhatsApp: () => void;

  // Active product tracker
  setActiveProductId: (id: string | null) => void;
}

export const useCommerce = create<CommerceState>((set, get) => ({
  products: INITIAL_PRODUCTS,
  collections: INITIAL_COLLECTIONS,
  orders: INITIAL_ORDERS,
  coupons: INITIAL_COUPONS,
  shippingZones: INITIAL_SHIPPING,
  activeProductIndexId: null,

  addProduct: (product) => {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...product,
      id,
      inventoryHistory: [
        { id: `log-${Date.now()}`, date: new Date().toISOString(), type: "addition", amount: product.stock, reason: "Initial setup intake", user: "Admin (Aditya)" }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    set((state) => ({
      products: [newProduct, ...state.products]
    }));
  },

  updateProduct: (id, updates) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updates,
              updatedAt: new Date().toISOString()
            }
          : p
      )
    }));
  },

  deleteProduct: (id) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== id)
    }));
  },

  duplicateProduct: (id) => {
    const target = get().products.find((p) => p.id === id);
    if (!target) return;

    const newProduct: Product = {
      ...target,
      id: `prod-${Date.now()}`,
      name: `${target.name} (Copy)`,
      sku: `${target.sku}-COPY`,
      whatsAppSyncStatus: "unsynced",
      isWhatsAppSynced: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      inventoryHistory: [
        { id: `log-${Date.now()}`, date: new Date().toISOString(), type: "addition", amount: target.stock, reason: "Duplicate creation stock sync", user: "Admin (Aditya)" }
      ]
    };

    set((state) => ({
      products: [newProduct, ...state.products]
    }));
  },

  archiveProduct: (id) => {
    get().updateProduct(id, { status: "archived" });
  },

  importProducts: (rawProducts) => {
    const processed = rawProducts.map((p, idx) => {
      const id = `prod-import-${Date.now()}-${idx}`;
      return {
        id,
        name: p.name || `Imported Product #${idx}`,
        sku: p.sku || `SKU-IMP-${idx}-${Date.now().toString().slice(-4)}`,
        description: p.description || "Imported product template",
        category: p.category || "General",
        tags: p.tags || [],
        images: p.images || ["https://images.unsplash.com/photo-1558002038-1055907df827?w=500&auto=format&fit=crop"],
        regularPrice: Number(p.regularPrice) || 0.0,
        currency: p.currency || "USD",
        taxRate: Number(p.taxRate) || 18,
        status: (p.status as any) || "draft",
        stock: Number(p.stock) || 0,
        lowStockAlertThreshold: Number(p.lowStockAlertThreshold) || 5,
        variants: p.variants || [],
        inventoryHistory: [
          { id: `log-imp-${Date.now()}`, date: new Date().toISOString(), type: "addition" as const, amount: Number(p.stock) || 0, reason: "CSV Import intake", user: "Admin (Aditya)" }
        ],
        isWhatsAppSynced: false,
        whatsAppSyncStatus: "unsynced" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    set((state) => ({
      products: [...processed, ...state.products]
    }));
  },

  bulkUpdatePrices: (percentage, increase) => {
    set((state) => ({
      products: state.products.map((p) => {
        const factor = increase ? 1 + percentage / 100 : 1 - percentage / 100;
        const newPrice = Math.round(p.regularPrice * factor * 100) / 100;
        const newSalePrice = p.salePrice ? Math.round(p.salePrice * factor * 100) / 100 : undefined;

        // Apply to variants
        const updatedVariants = p.variants.map((v) => ({
          ...v,
          price: Math.round(v.price * factor * 100) / 100
        }));

        return {
          ...p,
          regularPrice: newPrice,
          salePrice: newSalePrice,
          variants: updatedVariants,
          updatedAt: new Date().toISOString()
        };
      })
    }));
  },

  bulkDeleteProducts: (ids) => {
    set((state) => ({
      products: state.products.filter((p) => !ids.includes(p.id))
    }));
  },

  addInventoryLog: (productId, log) => {
    const newLog: InventoryHistoryLog = {
      ...log,
      id: `log-${Date.now()}`,
      date: new Date().toISOString()
    };

    set((state) => ({
      products: state.products.map((p) => {
        if (p.id !== productId) return p;

        let calculatedStock = p.stock;
        if (log.type === "addition") calculatedStock += log.amount;
        else if (log.type === "reduction") calculatedStock = Math.max(0, calculatedStock - log.amount);
        else if (log.type === "adjustment") calculatedStock = log.amount;

        const newStatus = calculatedStock === 0 ? "out_of_stock" : p.status;

        return {
          ...p,
          stock: calculatedStock,
          status: newStatus,
          inventoryHistory: [newLog, ...p.inventoryHistory],
          updatedAt: new Date().toISOString()
        };
      })
    }));
  },

  addCollection: (collection) => {
    const newCollection: Collection = {
      ...collection,
      id: `coll-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    set((state) => ({
      collections: [...state.collections, newCollection]
    }));
  },

  updateCollection: (id, updates) => {
    set((state) => ({
      collections: state.collections.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      )
    }));
  },

  deleteCollection: (id) => {
    set((state) => ({
      collections: state.collections.filter((c) => c.id !== id)
    }));
  },

  addCoupon: (coupon) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: `coup-${Date.now()}`,
      usageCount: 0,
      createdAt: new Date().toISOString()
    };
    set((state) => ({
      coupons: [...state.coupons, newCoupon]
    }));
  },

  toggleCouponActive: (id) => {
    set((state) => ({
      coupons: state.coupons.map((c) =>
        c.id === id ? { ...c, isActive: !c.isActive } : c
      )
    }));
  },

  deleteCoupon: (id) => {
    set((state) => ({
      coupons: state.coupons.filter((c) => c.id !== id)
    }));
  },

  updateShippingZone: (id, updates) => {
    set((state) => ({
      shippingZones: state.shippingZones.map((z) =>
        z.id === id ? { ...z, ...updates } : z
      )
    }));
  },

  addOrder: (order) => {
    const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...order,
      id,
      timeline: [
        { id: `t-${Date.now()}`, date: new Date().toISOString(), status: "Order Created", message: "Order initialized via payment sandbox simulator.", actor: "Commerce Engine" }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    set((state) => ({
      orders: [newOrder, ...state.orders]
    }));
  },

  updateOrderStatus: (id, status, message, actor) => {
    const newTimelineEvent: OrderTimelineEvent = {
      id: `t-${Date.now()}`,
      date: new Date().toISOString(),
      status: status.toUpperCase(),
      message,
      actor
    };

    set((state) => ({
      orders: state.orders.map((o) => {
        if (o.id !== id) return o;
        
        let paymentStatus = o.paymentStatus;
        if (status === "delivered" && o.paymentMethod === "Cash") {
          paymentStatus = "paid";
        }

        return {
          ...o,
          status,
          paymentStatus,
          timeline: [...o.timeline, newTimelineEvent],
          updatedAt: new Date().toISOString()
        };
      })
    }));
  },

  refundOrder: (id) => {
    const newTimelineEvent: OrderTimelineEvent = {
      id: `t-${Date.now()}`,
      date: new Date().toISOString(),
      status: "REFUNDED",
      message: "Payment refunded in full. Return logistics loop initiated.",
      actor: "Billing Admin"
    };

    set((state) => ({
      orders: state.orders.map((o) => {
        if (o.id !== id) return o;
        return {
          ...o,
          paymentStatus: "refunded",
          status: "returned",
          timeline: [...o.timeline, newTimelineEvent],
          updatedAt: new Date().toISOString()
        };
      })
    }));
  },

  syncProductToWhatsApp: (productId) => {
    set((state) => ({
      products: state.products.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          whatsAppSyncStatus: "pending"
        };
      })
    }));

    // Simulate completion delayed feedback
    setTimeout(() => {
      set((state) => ({
        products: state.products.map((p) => {
          if (p.id !== productId) return p;
          return {
            ...p,
            isWhatsAppSynced: true,
            whatsAppSyncStatus: "synced"
          };
        })
      }));
    }, 2000);
  },

  syncAllProductsToWhatsApp: () => {
    set((state) => ({
      products: state.products.map((p) => ({
        ...p,
        whatsAppSyncStatus: "pending"
      }))
    }));

    setTimeout(() => {
      set((state) => ({
        products: state.products.map((p) => ({
          ...p,
          isWhatsAppSynced: true,
          whatsAppSyncStatus: "synced"
        }))
      }));
    }, 2500);
  },

  setActiveProductId: (id) => {
    set({ activeProductIndexId: id });
  }
}));

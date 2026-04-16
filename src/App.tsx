import { useState, useMemo, useEffect } from "react";
import { 
  ShoppingBasket, 
  MapPin, 
  Phone, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Smartphone, 
  Banknote,
  ChevronRight,
  Menu,
  X,
  ShoppingCart,
  CheckCircle2,
  Clock,
  ArrowRight,
  Star,
  Instagram,
  Facebook,
  Twitter,
  Send,
  Lock,
  User,
  LogOut,
  LayoutDashboard,
  Layers,
  ShoppingBag,
  Check,
  Search,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// --- Types ---
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'chicken' | 'fish' | 'ready-to-eat';
  type: string;
  inStock: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

interface Shop {
  name: string;
  location: string;
  hours: string;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  location: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'completed' | 'delivered';
  createdAt: string;
}

// --- Initial Data ---
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "full-kienyeji",
    name: "Full Kienyeji Chicken",
    description: "Large, organic, free-range kienyeji chicken. Perfect for a traditional meal.",
    price: 1500,
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/b7878201-75e3-424f-8cb7-0dbd0a5744d8/full-kienyeji-chicken-fresh-organic-whole-chicken--ed73a369-1776253301554.webp",
    category: 'chicken',
    type: 'Whole',
    inStock: true
  },
  {
    id: "full-broiler",
    name: "Full Broiler Chicken",
    description: "Freshly dressed, plump broiler chicken. Juicy and tender for roasting.",
    price: 1000,
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/b7878201-75e3-424f-8cb7-0dbd0a5744d8/full-broiler-chicken-fresh-whole-broiler-chicken-w-2efb1602-1776253300781.webp",
    category: 'chicken',
    type: 'Whole',
    inStock: true
  },
  {
    id: "half-kienyeji",
    name: "Half Kienyeji Chicken",
    description: "Half portion of our organic free-range kienyeji chicken. Cleanly cut.",
    price: 800,
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/b7878201-75e3-424f-8cb7-0dbd0a5744d8/half-kienyeji-chicken-half-kienyeji-chicken-cut-ve-cedbe908-1776253300352.webp",
    category: 'chicken',
    type: 'Half',
    inStock: true
  },
  {
    id: "half-broiler",
    name: "Half Broiler Chicken",
    description: "Fresh broiler chicken portion, cut in half for smaller families.",
    price: 550,
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/b7878201-75e3-424f-8cb7-0dbd0a5744d8/half-broiler-chicken-half-broiler-chicken-cut-vert-875ebae1-1776253300063.webp",
    category: 'chicken',
    type: 'Half',
    inStock: true
  },
  {
    id: "quarter-broiler",
    name: "Quarter Broiler Chicken",
    description: "Tender broiler chicken quarter (leg and thigh portion). Ready to cook.",
    price: 300,
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/b7878201-75e3-424f-8cb7-0dbd0a5744d8/quarter-broiler-chicken-quarter-broiler-chicken-po-8d8a7921-1776253302746.webp",
    category: 'chicken',
    type: 'Quarter',
    inStock: true
  },
  {
    id: "chicken-gizzards",
    name: "Chicken Gizzards",
    description: "Cleaned and fresh chicken gizzards, high in protein and flavor.",
    price: 450,
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/b7878201-75e3-424f-8cb7-0dbd0a5744d8/chicken-gizzards-8b67a7b5-1776252728723.webp",
    category: 'chicken',
    type: '500g Pack',
    inStock: true
  },
  {
    id: "chicken-liver",
    name: "Fresh Chicken Liver",
    description: "Rich and tender chicken liver, perfect for sautéing or pâté.",
    price: 400,
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/b7878201-75e3-424f-8cb7-0dbd0a5744d8/chicken-liver-d5e1da71-1776252731512.webp",
    category: 'chicken',
    type: '500g Pack',
    inStock: true
  },
  {
    id: "sushi-platter",
    name: "Gourmet Sushi Platter",
    description: "Premium sushi rolls with fresh fish and avocado, professionally prepared.",
    price: 1500,
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/b7878201-75e3-424f-8cb7-0dbd0a5744d8/sushi-e9496875-1776252729109.webp",
    category: 'ready-to-eat',
    type: 'Platter',
    inStock: true
  },
  {
    id: "fish-fillet",
    name: "Fresh Tilapia Fillet",
    description: "Boneless, skinless tilapia fillets. Fresh and ready for the pan.",
    price: 900,
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/b7878201-75e3-424f-8cb7-0dbd0a5744d8/fish-fillet-52ff45e0-1776252728926.webp",
    category: 'fish',
    type: '1kg Pack',
    inStock: true
  },
  {
    id: "fish-whole",
    name: "Whole Tilapia Fish",
    description: "Freshly harvested from the lake. Scaled and gutted for your convenience.",
    price: 850,
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/b7878201-75e3-424f-8cb7-0dbd0a5744d8/whole-fish-fresh-61ce2ee0-1776252728922.webp",
    category: 'fish',
    type: 'Whole',
    inStock: true
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-001",
    customerName: "Alice Wanjiku",
    customerPhone: "0712345678",
    location: "Nairobi, Kilimani",
    items: [{ name: "Full Kienyeji Chicken", quantity: 2, price: 1500 }],
    total: 3000,
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: "ORD-002",
    customerName: "Peter Maina",
    customerPhone: "0722112233",
    location: "Thika Road, Roysambu",
    items: [{ name: "Whole Tilapia Fish", quantity: 3, price: 850 }],
    total: 2550,
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "ORD-003",
    customerName: "Mary Juma",
    customerPhone: "0799887766",
    location: "Kiambu Town",
    items: [
      { name: "Chicken Gizzards", quantity: 1, price: 450 },
      { name: "Chicken Liver", quantity: 1, price: 400 }
    ],
    total: 850,
    status: 'delivered',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

const SHOPS: Shop[] = [
  { name: "Amara Ngara", location: "Ngara Road, Near Starehe", hours: "8:00 AM - 7:00 PM" },
  { name: "Amara Kiambu", location: "Kiambu Town, Behind the Post Office", hours: "7:30 AM - 6:30 PM" },
  { name: "Amara Utawala", location: "Utawala Complex, Ground Floor", hours: "8:00 AM - 8:00 PM" },
  { name: "Amara Kiharu", location: "Kiharu Estate, Near the Gate", hours: "8:00 AM - 6:00 PM" }
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Wanjiku",
    role: "Regular Customer",
    content: "The chicken gizzards are the freshest I've found in Nairobi. Amara Farms never disappoints!",
    rating: 5,
    avatar: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/b7878201-75e3-424f-8cb7-0dbd0a5744d8/customer-1-56e4d567-1776252729092.webp"
  },
  {
    id: 2,
    name: "David Maina",
    role: "Home Chef",
    content: "Their whole tilapia is always fresh with clear eyes. Best quality fish for my family dinners.",
    rating: 5,
    avatar: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/b7878201-75e3-424f-8cb7-0dbd0a5744d8/customer-4-8cded6c7-1776252732789.webp"
  },
  {
    id: 3,
    name: "Mary Atieno",
    role: "Food Enthusiast",
    content: "The sushi platter was a surprise hit! So fresh and well-presented. Highly recommend it.",
    rating: 5,
    avatar: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/b7878201-75e3-424f-8cb7-0dbd0a5744d8/customer-2-00ca4273-1776252729267.webp"
  },
  {
    id: 4,
    name: "John Kamau",
    role: "Fitness Coach",
    content: "I buy my liver and fillets here every week. High protein, fresh, and delivered on time.",
    rating: 5,
    avatar: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/b7878201-75e3-424f-8cb7-0dbd0a5744d8/customer-3-43b5d0d2-1776252732346.webp"
  },
  {
    id: 5,
    name: "Grace Mutua",
    role: "Mother of Three",
    content: "Great prices and the delivery is super fast. The kids love the chicken fillets!",
    rating: 5,
    avatar: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/b7878201-75e3-424f-8cb7-0dbd0a5744d8/customer-5-81939da2-1776252732526.webp"
  },
  {
    id: 6,
    name: "Mama Njeri",
    role: "Local Resident",
    content: "I've been shopping at the Ngara branch for 2 years. Reliable and always fresh products.",
    rating: 5,
    avatar: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/b7878201-75e3-424f-8cb7-0dbd0a5744d8/customer-6-4d7816ae-1776252732939.webp"
  }
];

// --- Components ---

function App() {
  // Navigation State
  const [view, setView] = useState<'store' | 'admin-login' | 'admin-dashboard'>('store');
  const [activeTab, setActiveTab] = useState<'products' | 'shops'>('products');
  
  // Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mpesa' | 'card' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // M-Pesa State
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [mpesaPin, setMpesaPin] = useState("");

  // Review & Suggestion State
  const [suggestion, setSuggestion] = useState("");
  const [review, setReview] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  // Admin Login State
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);

  // --- Handlers ---

  const addToCart = (product: Product) => {
    if (!product.inStock) {
      toast.error("Sorry, this item is currently out of stock!");
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`Added ${product.name} to cart!`, {
      description: "You can view your items in the cart drawer.",
      position: "bottom-center"
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleMpesaPrompt = () => {
    if (!mpesaNumber || mpesaNumber.length < 10) {
      toast.error("Please enter a valid M-Pesa number");
      return;
    }
    if (!mpesaPin || mpesaPin.length < 4) {
      toast.error("Please enter your M-Pesa PIN");
      return;
    }

    setIsProcessing(true);
    toast.info("Sending M-Pesa Prompt...", {
      description: `Sending request to ${mpesaNumber}...`,
      duration: 3000
    });

    setTimeout(() => {
      setIsProcessing(false);
      const newOrder: Order = {
        id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
        customerName: "Recent Customer",
        customerPhone: mpesaNumber,
        location: "Delivery Address (Pending)",
        items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
        total: cartTotal,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      setOrders(prev => [newOrder, ...prev]);
      
      toast.success("Payment Successful!", {
        description: `KSh ${cartTotal.toLocaleString()} sent to 0799288420. Your order is being prepared!`,
        duration: 5000
      });
      setCart([]);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      setMpesaNumber("");
      setMpesaPin("");
    }, 4000);
  };

  const handleCheckout = () => {
    if (paymentMethod === 'mpesa') {
      handleMpesaPrompt();
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        const newOrder: Order = {
          id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
          customerName: "Recent Customer",
          customerPhone: "Manual Order",
          location: "In-Store Pickup / Cash Delivery",
          items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
          total: cartTotal,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        setOrders(prev => [newOrder, ...prev]);
        
        toast.success("Order Placed Successfully!", {
          description: "Thank you for shopping with Amara Farms.",
        });
        setCart([]);
        setIsCheckoutOpen(false);
        setIsCartOpen(false);
      }, 2000);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername === 'shifter77' && loginPassword === 'amara&hope') {
      setView('admin-dashboard');
      toast.success("Welcome back, Administrator!");
    } else {
      toast.error("Invalid credentials", {
        description: "Please check your username and password."
      });
    }
  };

  const toggleStock = (productId: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, inStock: !p.inStock } : p
    ));
    const product = products.find(p => p.id === productId);
    toast.info(`Updated ${product?.name} status`, {
      description: `Item is now ${!product?.inStock ? 'In Stock' : 'Out of Stock'}`
    });
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status } : o
    ));
    toast.success(`Order ${orderId} updated to ${status}`);
  };

  // --- Render Store View ---
  const renderStore = () => (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800 shadow-lg shadow-emerald-200">
                <ShoppingBasket className="h-6 w-6 text-amber-400" />
              </div>
              <span className="text-xl font-bold tracking-tight text-neutral-900">
                AMARA<span className="text-emerald-800 font-extrabold">FARMS</span>
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => setActiveTab('products')}
                className={`text-sm font-semibold transition-colors ${activeTab === 'products' ? 'text-emerald-800 border-b-2 border-amber-400 pb-1' : 'text-neutral-600 hover:text-emerald-800'}`}
              >
                Products
              </button>
              <button 
                onClick={() => setActiveTab('shops')}
                className={`text-sm font-semibold transition-colors ${activeTab === 'shops' ? 'text-emerald-800 border-b-2 border-amber-400 pb-1' : 'text-neutral-600 hover:text-emerald-800'}`}
              >
                Shops Near Me
              </button>
              <a 
                href="tel:0732373208"
                className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 hover:bg-emerald-100 transition-colors border border-emerald-100"
              >
                <Phone className="h-4 w-4" />
                0732 373 208
              </a>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white shadow-xl hover:bg-emerald-900 transition-all hover:scale-105 active:scale-95"
              >
                <ShoppingCart className="h-4 w-4 text-amber-400" />
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            <div className="md:hidden flex items-center gap-4">
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-neutral-600">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[8px] font-bold text-white ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-neutral-600">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-neutral-100 bg-white">
              <div className="flex flex-col p-4 space-y-4">
                <button onClick={() => { setActiveTab('products'); setIsMenuOpen(false); }} className="flex items-center justify-between text-left font-semibold text-neutral-700">Products<ChevronRight className="h-4 w-4" /></button>
                <button onClick={() => { setActiveTab('shops'); setIsMenuOpen(false); }} className="flex items-center justify-between text-left font-semibold text-neutral-700">Shops Near Me<ChevronRight className="h-4 w-4" /></button>
                <a href="tel:0732373208" className="flex items-center gap-3 rounded-xl bg-emerald-800 p-4 font-bold text-white"><Phone className="h-5 w-5 text-amber-400" />Call for Delivery: 0732 373 208</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center lg:text-left">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-6">
                <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800"><Clock className="mr-1.5 h-3.5 w-3.5" />Fresh Deliveries Daily</motion.span>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">Premium <span className="text-emerald-800 underline decoration-amber-400 decoration-wavy underline-offset-8">Farm-Fresh</span> Poultry & Fish</motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 text-lg text-neutral-600">Amara Farms brings the finest organic chicken and fresh tilapia directly from our farms to your kitchen. Quality you can taste, prices you'll love.</motion.p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button onClick={() => setActiveTab('products')} className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-8 py-4 text-lg font-bold text-white hover:bg-emerald-900 transition-all active:scale-95">Shop Products<ArrowRight className="h-5 w-5 text-amber-400" /></button>
                  <button onClick={() => setActiveTab('shops')} className="flex items-center justify-center gap-2 rounded-xl border-2 border-neutral-200 bg-white px-8 py-4 text-lg font-bold text-neutral-700 hover:bg-neutral-50 active:scale-95">Find a Shop</button>
                </div>
              </div>
              <div className="mt-12 lg:col-span-6 lg:mt-0 flex items-center justify-center">
                <div className="relative w-full max-w-lg rounded-3xl bg-emerald-800/5 p-4 ring-1 ring-neutral-900/10">
                  <img src={products[0].image} alt="Farm Fresh" className="aspect-square w-full rounded-2xl object-cover shadow-2xl" />
                  <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-neutral-900/5 hidden sm:block">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600"><CheckCircle2 className="h-6 w-6" /></div>
                      <div><p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Certified Organic</p><p className="text-sm font-extrabold text-neutral-900">100% Farm Fresh</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 bg-neutral-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center mb-12 text-center">
              <h2 className="text-3xl font-extrabold text-neutral-900 mb-4">{activeTab === 'products' ? 'Our Products Offered' : 'Visit Our Shops'}</h2>
              <div className="h-1.5 w-20 rounded-full bg-amber-500"></div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'products' ? (
                <motion.div key="products" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <div key={product.id} className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-neutral-200 shadow-sm transition-all hover:shadow-xl">
                      <div className="relative aspect-video overflow-hidden">
                        <img src={product.image} alt={product.name} className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${!product.inStock ? 'grayscale opacity-60' : ''}`} />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white ${product.category === 'chicken' ? 'bg-emerald-800' : product.category === 'fish' ? 'bg-blue-600' : 'bg-amber-600'}`}>{product.category}</span>
                          {!product.inStock && <span className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white bg-red-600">Out of Stock</span>}
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-neutral-900">{product.name}</h3>
                          <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">{product.type}</span>
                        </div>
                        <p className="mb-6 text-sm text-neutral-500 line-clamp-2">{product.description}</p>
                        <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-4">
                          <span className="text-2xl font-black text-emerald-800">KSH {product.price.toLocaleString()}</span>
                          <button 
                            onClick={() => addToCart(product)} 
                            disabled={!product.inStock}
                            className={`flex h-10 w-10 items-center justify-center rounded-xl text-amber-400 shadow-lg transition-all active:scale-95 ${product.inStock ? 'bg-emerald-800 shadow-emerald-100 hover:bg-neutral-900 hover:scale-110' : 'bg-neutral-300 cursor-not-allowed shadow-none'}`}
                          >
                            <Plus className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="shops" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid gap-6 sm:grid-cols-2">
                  {SHOPS.map((shop, idx) => (
                    <div key={idx} className="flex items-center gap-6 rounded-2xl bg-white p-6 border border-neutral-200 shadow-sm hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-800 text-amber-400 shadow-lg shadow-emerald-100"><MapPin className="h-8 w-8" /></div>
                      <div><h3 className="text-xl font-bold text-neutral-900">{shop.name}</h3><p className="mt-1 text-neutral-500">{shop.location}</p><div className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-800"><Clock className="h-4 w-4" />{shop.hours}</div></div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16"><h2 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl">What Our Customers Say</h2><p className="mt-4 text-neutral-600">Trusted by thousands of families across the country.</p><div className="mt-4 flex justify-center gap-1">{[...Array(5)].map((_, i) => (<Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />))}</div></div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <Card key={t.id} className="border-neutral-200 hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">{[...Array(t.rating)].map((_, i) => (<Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />))}</div>
                    <p className="text-neutral-700 italic mb-6 leading-relaxed">"{t.content}"</p>
                    <div className="flex items-center gap-4 border-t border-neutral-100 pt-4"><img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full object-cover border-2 border-emerald-100" /><div><h4 className="font-bold text-neutral-900">{t.name}</h4><p className="text-xs text-neutral-500">{t.role}</p></div></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white pt-20 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-4 pb-16 border-b border-neutral-800">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800"><ShoppingBasket className="h-6 w-6 text-amber-400" /></div><span className="text-2xl font-bold tracking-tight">AMARA<span className="text-emerald-500">FARMS</span></span></div>
              <p className="text-neutral-400 mb-6 leading-relaxed">Pioneering sustainable poultry and fish farming in Kenya. Delivering freshness from our gates to your plate since 2018.</p>
              <div className="flex gap-4">
                <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-emerald-800 transition-colors text-white"><Instagram className="h-5 w-5" /></a>
                <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-emerald-800 transition-colors text-white"><Facebook className="h-5 w-5" /></a>
                <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-emerald-800 transition-colors text-white"><Twitter className="h-5 w-5" /></a>
              </div>
            </div>
            <div>
              <h4 className="mb-6 text-lg font-bold text-amber-400">Quick Links</h4>
              <ul className="space-y-4 text-neutral-400 font-medium">
                <li><button onClick={() => setActiveTab('products')} className="hover:text-emerald-500 transition-colors">Products Offered</button></li>
                <li><button onClick={() => setActiveTab('shops')} className="hover:text-emerald-500 transition-colors">Shops Near Me</button></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Delivery Areas</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Our Farm Story</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-6 text-lg font-bold text-amber-400">Suggestion Box</h4>
              <div className="space-y-3"><Input placeholder="Your suggestion..." value={suggestion} onChange={(e) => setSuggestion(e.target.value)} className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:ring-emerald-500" /><Button onClick={() => {toast.success("Suggestion Received!"); setSuggestion("");}} className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold"><Send className="mr-2 h-4 w-4" />Send Suggestion</Button></div>
            </div>
            <div>
              <h4 className="mb-6 text-lg font-bold text-amber-400">Leave a Review</h4>
              <div className="space-y-3"><div className="flex gap-2 mb-2">{[1, 2, 3, 4, 5].map((star) => (<button key={star} onClick={() => setReviewRating(star)}><Star className={`h-5 w-5 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'}`} /></button>))}</div><Textarea placeholder="Experience..." value={review} onChange={(e) => setReview(e.target.value)} className="bg-neutral-800 border-neutral-700 text-white min-h-[80px]" /><Button onClick={() => {toast.success("Review Submitted!"); setReview("");}} className="w-full bg-neutral-100 text-neutral-900 font-bold">Post Review</Button></div>
            </div>
          </div>
          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <a href="tel:0732373208" className="flex items-center gap-2 text-amber-400 font-bold hover:text-amber-300 transition-colors"><Phone className="h-4 w-4" />0732 373 208</a>
              <span className="text-neutral-500">|</span>
              <p className="text-neutral-500 font-medium cursor-pointer hover:text-neutral-300 transition-colors" onClick={() => setView('admin-login')}>
                Made by <span className="text-neutral-300">Teckocraft Industries</span>
              </p>
            </div>
            <div className="text-sm font-medium text-neutral-500">&copy; {new Date().getFullYear()} Amara Farms Kenya.</div>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-neutral-100 p-6"><div className="flex items-center gap-3"><ShoppingCart className="h-6 w-6 text-emerald-800" /><h2 className="text-xl font-bold text-neutral-900">Your Cart ({cartCount})</h2></div><button onClick={() => setIsCartOpen(false)} className="rounded-full p-2 text-neutral-400 hover:bg-neutral-50 transition-colors"><X className="h-6 w-6" /></button></div>
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center"><div className="mb-4 rounded-full bg-neutral-50 p-6"><ShoppingBasket className="h-12 w-12 text-neutral-300" /></div><p className="text-lg font-bold text-neutral-900">Your cart is empty</p><button onClick={() => { setIsCartOpen(false); setActiveTab('products'); }} className="mt-8 rounded-xl bg-emerald-800 px-6 py-3 font-bold text-white">Browse Products</button></div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 border-b border-neutral-100 pb-6">
                        <img src={item.image} className="h-20 w-20 rounded-xl object-cover" alt={item.name} />
                        <div className="flex flex-1 flex-col"><div className="flex justify-between"><h4 className="font-bold text-neutral-900">{item.name}</h4><button onClick={() => removeFromCart(item.id)} className="text-neutral-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button></div><p className="text-sm font-bold text-emerald-800">KSH {item.price.toLocaleString()}</p><div className="mt-3 flex items-center justify-between"><div className="flex items-center gap-3 rounded-lg border border-neutral-200 p-1"><button onClick={() => updateQuantity(item.id, -1)} className="p-1"><Minus className="h-3.5 w-3.5" /></button><span className="w-4 text-center text-sm font-bold">{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} className="p-1"><Plus className="h-3.5 w-3.5" /></button></div><p className="text-sm font-black text-neutral-900">KSH {(item.price * item.quantity).toLocaleString()}</p></div></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <div className="border-t border-neutral-100 p-6 bg-neutral-50/50">
                  <div className="mb-6 space-y-3"><div className="flex justify-between text-neutral-500"><span>Subtotal</span><span>KSH {cartTotal.toLocaleString()}</span></div><div className="flex justify-between border-t border-neutral-200 pt-3 text-xl font-black text-neutral-900"><span>Total</span><span>KSH {cartTotal.toLocaleString()}</span></div></div>
                  <button onClick={() => setIsCheckoutOpen(true)} className="w-full rounded-2xl bg-neutral-900 py-4 text-lg font-bold text-white hover:bg-emerald-900 transition-all">Proceed to Checkout</button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isProcessing && setIsCheckoutOpen(false)} className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
              <div className="border-b border-neutral-100 p-6 text-center bg-emerald-800 text-white"><h2 className="text-2xl font-extrabold">Secure Checkout</h2><p className="mt-1 text-emerald-100">Complete your order with Amara Farms</p></div>
              <div className="p-8">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-neutral-500">Select Payment Method</h3>
                <div className="grid gap-4 grid-cols-3 mb-8">
                  <button onClick={() => setPaymentMethod('mpesa')} className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-4 ${paymentMethod === 'mpesa' ? 'border-emerald-800 bg-emerald-50 text-emerald-800' : 'border-neutral-100 bg-neutral-50'}`}><Smartphone className="h-8 w-8" /><span className="font-bold">M-Pesa</span></button>
                  <button onClick={() => setPaymentMethod('card')} className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-4 ${paymentMethod === 'card' ? 'border-emerald-800 bg-emerald-50 text-emerald-800' : 'border-neutral-100 bg-neutral-50'}`}><CreditCard className="h-8 w-8" /><span className="font-bold">Card</span></button>
                  <button onClick={() => setPaymentMethod('cash')} className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-4 ${paymentMethod === 'cash' ? 'border-emerald-800 bg-emerald-50 text-emerald-800' : 'border-neutral-100 bg-neutral-50'}`}><Banknote className="h-8 w-8" /><span className="font-bold">Cash</span></button>
                </div>
                {paymentMethod === 'mpesa' && (
                  <div className="space-y-4 mb-8 bg-neutral-50 p-6 rounded-2xl border border-emerald-100">
                    <div className="space-y-2"><Label className="font-bold text-neutral-700">M-Pesa Phone Number</Label><Input type="tel" placeholder="e.g. 0712345678" value={mpesaNumber} onChange={(e) => setMpesaNumber(e.target.value)} /></div>
                    <div className="space-y-2"><Label className="font-bold text-neutral-700">M-Pesa PIN (Simulated)</Label><Input type="password" maxLength={4} placeholder="****" value={mpesaPin} onChange={(e) => setMpesaPin(e.target.value)} /><p className="text-[10px] text-neutral-400 italic">Money will be sent to 0799288420.</p></div>
                  </div>
                )}
                <div className="rounded-2xl bg-neutral-900 p-6 text-white flex justify-between items-center"><span className="text-lg font-bold">Total Amount</span><span className="text-3xl font-black text-amber-400">KSH {cartTotal.toLocaleString()}</span></div>
                <div className="mt-8 flex gap-4">
                  <button disabled={isProcessing} onClick={() => setIsCheckoutOpen(false)} className="flex-1 rounded-2xl border border-neutral-200 py-4 font-bold text-neutral-600">Cancel</button>
                  <button disabled={!paymentMethod || isProcessing} onClick={handleCheckout} className="flex-[2] rounded-2xl bg-emerald-800 py-4 text-lg font-black text-white hover:bg-neutral-900 transition-all">{isProcessing ? "Processing..." : "Confirm Order"}</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  // --- Render Admin Login ---
  const renderAdminLogin = () => (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-800 shadow-xl mb-4">
            <ShoppingBasket className="h-10 w-10 text-amber-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">Admin Portal</h1>
          <p className="text-neutral-500 font-medium">Please sign in to continue</p>
        </div>

        <Card className="border-none shadow-2xl overflow-hidden">
          <CardHeader className="bg-neutral-900 text-white pb-8">
            <CardTitle className="text-xl flex items-center gap-2">
              <Lock className="h-5 w-5 text-amber-400" />
              Secure Login
            </CardTitle>
            <CardDescription className="text-neutral-400">Authorized personnel only</CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  <Input 
                    id="username" 
                    placeholder="Enter username" 
                    className="pl-10"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter password" 
                    className="pl-10"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-emerald-800 hover:bg-emerald-900 text-white h-12 text-lg font-bold">
                Access Dashboard
              </Button>
            </form>
            <button 
              onClick={() => setView('store')}
              className="w-full mt-4 text-sm font-semibold text-neutral-500 hover:text-emerald-800 transition-colors"
            >
              ← Back to Amara Farms Store
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // --- Render Admin Dashboard ---
  const renderAdminDashboard = () => (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-neutral-900 text-white shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-neutral-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800">
            <ShoppingBasket className="h-6 w-6 text-amber-400" />
          </div>
          <span className="text-lg font-black tracking-tighter">ADMIN PANEL</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-800/20 text-emerald-400 font-bold">
            <LayoutDashboard className="h-5 w-5" />
            Dashboard Overview
          </div>
          <div className="p-3 text-neutral-500 text-xs font-bold uppercase tracking-widest mt-6">Management</div>
          <div className="flex items-center gap-3 p-3 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer">
            <Layers className="h-5 w-5" />
            Stock Inventory
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer">
            <ShoppingBag className="h-5 w-5" />
            Order History
          </div>
        </nav>
        <div className="p-4 border-t border-neutral-800">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10 gap-3"
            onClick={() => setView('store')}
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-neutral-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:hidden">
            <ShoppingBasket className="h-8 w-8 text-emerald-800" />
            <h1 className="font-bold">Admin Panel</h1>
          </div>
          <div className="hidden lg:block">
            <h2 className="text-lg font-bold text-neutral-900">Welcome back, shifter77</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <Input placeholder="Search orders..." className="pl-10 h-9 w-64 bg-neutral-50" />
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold border-2 border-emerald-200">
              S7
            </div>
            <button className="lg:hidden" onClick={() => setView('store')}>
              <LogOut className="h-6 w-6 text-neutral-500" />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="inventory" className="space-y-6">
            <TabsList className="bg-white border border-neutral-200 p-1 rounded-xl w-full sm:w-auto h-12">
              <TabsTrigger value="inventory" className="rounded-lg h-10 px-6 data-[state=active]:bg-emerald-800 data-[state=active]:text-white">
                <Layers className="h-4 w-4 mr-2" />
                Inventory
              </TabsTrigger>
              <TabsTrigger value="orders" className="rounded-lg h-10 px-6 data-[state=active]:bg-emerald-800 data-[state=active]:text-white">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Orders List
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inventory" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-medium text-neutral-500">Total Products</p><h3 className="text-2xl font-black">{products.length}</h3></div>
                      <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Layers className="h-6 w-6" /></div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-medium text-neutral-500">In Stock</p><h3 className="text-2xl font-black text-emerald-600">{products.filter(p => p.inStock).length}</h3></div>
                      <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><CheckCircle2 className="h-6 w-6" /></div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-medium text-neutral-500">Out of Stock</p><h3 className="text-2xl font-black text-red-600">{products.filter(p => !p.inStock).length}</h3></div>
                      <div className="h-12 w-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center"><AlertCircle className="h-6 w-6" /></div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-neutral-200 shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-neutral-50">
                    <TableRow>
                      <TableHead className="w-[100px]">Image</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price (KSH)</TableHead>
                      <TableHead>Availability</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md object-cover border border-neutral-200" />
                        </TableCell>
                        <TableCell className="font-bold text-neutral-900">{product.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{product.category}</Badge>
                        </TableCell>
                        <TableCell>{product.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={product.inStock ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-red-100 text-red-800 border-red-200"}>
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-3">
                            <span className="text-xs font-semibold text-neutral-500">{product.inStock ? 'Disable' : 'Enable'}</span>
                            <Switch 
                              checked={product.inStock} 
                              onCheckedChange={() => toggleStock(product.id)}
                              className="data-[state=checked]:bg-emerald-800"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-medium text-neutral-500">Pending Orders</p><h3 className="text-2xl font-black text-amber-600">{orders.filter(o => o.status === 'pending').length}</h3></div>
                      <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><Clock className="h-6 w-6" /></div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-medium text-neutral-500">Monthly Revenue</p><h3 className="text-2xl font-black text-neutral-900">KSH {orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}</h3></div>
                      <div className="h-12 w-12 bg-neutral-900 text-amber-400 rounded-xl flex items-center justify-center"><Banknote className="h-6 w-6" /></div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-medium text-neutral-500">Completed Delivery</p><h3 className="text-2xl font-black text-emerald-600">{orders.filter(o => o.status === 'delivered').length}</h3></div>
                      <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><CheckCircle2 className="h-6 w-6" /></div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="border-neutral-200 overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="bg-neutral-50 p-6 flex flex-col justify-center border-b md:border-b-0 md:border-r border-neutral-200 md:w-64 shrink-0">
                        <div className="flex items-center justify-between mb-4">
                          <Badge className={
                            order.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                            order.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                            'bg-emerald-100 text-emerald-800'
                          }>
                            {order.status.toUpperCase()}
                          </Badge>
                          <span className="text-xs font-bold text-neutral-400">{order.id}</span>
                        </div>
                        <h4 className="font-black text-neutral-900 text-lg">{order.customerName}</h4>
                        <div className="mt-2 flex items-center gap-2 text-sm text-neutral-600">
                          <Phone className="h-3 w-3" />
                          {order.customerPhone}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-neutral-600">
                          <MapPin className="h-3 w-3" />
                          {order.location}
                        </div>
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Ordered Items</span>
                          <span className="text-xs font-medium text-neutral-400">{new Date(order.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="space-y-2 mb-6">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-neutral-50/50 p-2 rounded-lg">
                              <span className="font-medium text-neutral-800">{item.name} <span className="text-neutral-400">×{item.quantity}</span></span>
                              <span className="font-bold">KSH {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-100 pt-4">
                          <div className="text-xl font-black text-emerald-800">
                            Total: KSH {order.total.toLocaleString()}
                          </div>
                          <div className="flex gap-2">
                            {order.status === 'pending' && (
                              <Button size="sm" onClick={() => updateOrderStatus(order.id, 'completed')} className="bg-blue-600 hover:bg-blue-700">
                                <Check className="mr-2 h-4 w-4" /> Complete Payment
                              </Button>
                            )}
                            {order.status === 'completed' && (
                              <Button size="sm" onClick={() => updateOrderStatus(order.id, 'delivered')} className="bg-emerald-800 hover:bg-emerald-900">
                                <MapPin className="mr-2 h-4 w-4" /> Mark Delivered
                              </Button>
                            )}
                            <Button size="sm" variant="outline" className="text-neutral-500">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Toaster position="top-right" richColors closeButton />
      
      {view === 'store' && renderStore()}
      {view === 'admin-login' && renderAdminLogin()}
      {view === 'admin-dashboard' && renderAdminDashboard()}
    </div>
  );
}

export default App;
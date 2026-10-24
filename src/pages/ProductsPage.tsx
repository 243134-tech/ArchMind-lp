import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  Filter,
  ExternalLink,
  Plus,
  Check,
  Heart,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  Bookmark,
  CheckCircle2,
  DollarSign,
  Tag,
  Eye,
} from 'lucide-react';
import { archMindStore } from '../services/store';
import { Product, ProductCategory } from '../types';
import { formatINR } from '../utils/formatters';

interface ProductsPageProps {
  onNavigate: (route: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onNavigate }) => {
  const [, setTick] = useState(0);
  useEffect(() => {
    return archMindStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const activeProject = archMindStore.getActiveProject();
  const allProducts = archMindStore.getProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [selectedRoom, setSelectedRoom] = useState<string>('Living Room');
  const [selectedStyle, setSelectedStyle] = useState<string>('All Styles');
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const categories: ProductCategory[] = [
    'All',
    'Furniture',
    'Lighting',
    'Finishes',
    'Flooring',
    'Wall Materials',
    'Kitchen & Bath',
    'Decor',
    'Outdoor',
  ];

  const filteredProducts = allProducts.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q) && !p.material.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleAddToBudget = (product: Product) => {
    archMindStore.addProductToBudget(product.id, 1, activeProject?.id);
    setAddedToast(`Added "${product.name}" ($${product.priceMin.toLocaleString()}) to ${activeProject?.name} Budget!`);
    setTimeout(() => setAddedToast(null), 3500);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => onNavigate(`/app/projects/${activeProject?.id}`)}
            className="flex items-center gap-1.5 text-xs text-[#006B7B] font-medium hover:underline mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Project</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171C2C] tracking-tight">
            Products & Materials
          </h1>
          <p className="text-xs text-[#667085] mt-1">
            Source furniture, lighting, and materials that match your design vision.
          </p>
        </div>

        {/* Global Search & Filters */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, materials, or brands..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#E6E9ED] rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#006B7B]"
            />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E6E9ED] rounded-xl text-xs font-medium text-gray-700 shadow-2xs cursor-pointer">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <span>Filters</span>
          </div>
        </div>
      </div>

      {/* Added Toast */}
      {addedToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{addedToast}</span>
          </div>
          <button
            onClick={() => onNavigate('/app/budget')}
            className="text-xs font-bold text-[#006B7B] hover:underline ml-4"
          >
            Open Budget →
          </button>
        </div>
      )}

      {/* Category Pills Header */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#006B7B] text-white font-semibold shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-[#E6E9ED]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Dropdowns Bar */}
      <div className="flex flex-wrap items-center gap-3 text-xs bg-white p-3 rounded-2xl border border-[#E6E9ED]">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">Style:</span>
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-gray-800 font-medium"
          >
            <option>All Styles</option>
            <option>Modern</option>
            <option>Scandinavian</option>
            <option>Japandi</option>
            <option>Minimalist</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">Room:</span>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-gray-800 font-medium"
          >
            <option>Living Room</option>
            <option>Bedroom</option>
            <option>Kitchen</option>
            <option>Dining Room</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">Price Range:</span>
          <select className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-gray-800 font-medium">
            <option>Any Price</option>
            <option>Under ₹10,000</option>
            <option>₹10,000 - ₹50,000</option>
            <option>₹50,000+</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSearchQuery('');
            setSelectedCategory('All');
            setSelectedStyle('All Styles');
            setSelectedRoom('Living Room');
          }}
          className="text-xs text-[#006B7B] font-medium hover:underline ml-auto"
        >
          Clear All
        </button>
      </div>

      {/* Main Grid: Products (8 cols) + Right Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================= */}
        {/* PRODUCTS CARDS GRID (8 cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Recommended for Your Design</h2>
              <p className="text-[11px] text-gray-500">
                Curated products matching your selected palette, space dimensions, and budget.
              </p>
            </div>
            <span className="text-xs text-gray-400">{filteredProducts.length} results</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="p-3 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image with Match Badge */}
                  <div className="relative rounded-xl overflow-hidden aspect-4/3 mb-2.5 bg-gray-100">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Match Badge */}
                    <span
                      className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold shadow-2xs ${
                        product.matchType === 'Exact Match'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {product.matchType === 'Exact Match' ? '✓ Exact Match' : '★ Similar Alternative'}
                    </span>

                    {/* Favorite Heart Button */}
                    <button
                      onClick={() => archMindStore.toggleProductSave(product.id)}
                      className={`absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-xs hover:bg-white text-gray-600 transition-colors shadow-2xs ${
                        product.isSavedToProject ? 'text-rose-500 fill-rose-500' : ''
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${product.isSavedToProject ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Brand & Title */}
                  <div className="text-[10px] text-gray-400 font-semibold uppercase">{product.brand}</div>
                  <h3 className="font-bold text-gray-900 text-xs truncate" title={product.name}>
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="text-xs font-bold text-gray-900 mt-1">
                    {formatINR(product.priceMin)}
                    {product.priceMax > product.priceMin && ` – ${formatINR(product.priceMax)}`}
                    {product.unit && <span className="text-[10px] font-normal text-gray-500"> / {product.unit}</span>}
                  </div>

                  {/* Material specs */}
                  <div className="text-[10px] text-gray-500 mt-0.5 truncate">{product.material}</div>

                  {/* Swatches */}
                  <div className="flex items-center gap-1 mt-2">
                    {product.colors.map((c, idx) => (
                      <span
                        key={idx}
                        style={{ backgroundColor: c }}
                        className="w-2.5 h-2.5 rounded-full border border-black/10"
                      />
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-gray-100 mt-3 space-y-1.5">
                  <button
                    onClick={() => handleAddToBudget(product)}
                    className="w-full py-1.5 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add to Budget</span>
                  </button>

                  <div className="flex items-center justify-between text-[10px] text-gray-500 px-1 pt-0.5">
                    <button
                      onClick={() => alert(`Specifications for ${product.name}: ${product.description}`)}
                      className="hover:text-gray-900 flex items-center gap-0.5"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Details</span>
                    </button>
                    <a
                      href={product.vendorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#006B7B] flex items-center gap-0.5 font-medium"
                    >
                      <span>Vendor</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* ========================================================= */}
        {/* RIGHT SIDEBAR: DESIGN CONCEPT & ALIGNMENT (4 cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 space-y-5 sticky top-24">
          
          {/* Card 1: Linked Design Concept */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Linked to Design Concept</span>
              <span className="text-[10px] bg-teal-50 text-[#006B7B] font-semibold px-2 py-0.5 rounded-full border border-teal-200">
                Active Concept
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <img
                src={activeProject?.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=120&q=80'}
                alt="Concept"
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <h3 className="font-bold text-gray-900 text-xs">{activeProject?.name}</h3>
                <div className="text-[11px] text-gray-500">{activeProject?.location}</div>
                <button
                  onClick={() => onNavigate('/app/designs/des_modern_living')}
                  className="text-[11px] text-[#006B7B] font-medium hover:underline flex items-center gap-0.5 mt-0.5"
                >
                  <span>View Full Concept</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <p className="text-[11px] text-gray-600 leading-relaxed pt-1">
              A warm, modern living space with natural materials, clean lines, and a neutral palette.
            </p>
          </div>

          {/* Card 2: Design Alignment Gauge */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs flex items-center gap-4">
            <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#E6E9ED" strokeWidth="3.5" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#006B7B"
                  strokeWidth="3.5"
                  strokeDasharray="88"
                  strokeDashoffset="7"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-xs font-bold text-gray-900">92%</span>
            </div>
            <div>
              <div className="font-bold text-gray-900 text-xs">Great match!</div>
              <div className="text-[11px] text-gray-500 leading-snug mt-0.5">
                These products align with your design style, palette and budget limits.
              </div>
            </div>
          </div>

          {/* Card 3: Design Palette & Materials */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
            <h3 className="font-bold text-gray-900 text-xs">Design Palette & Materials</h3>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
              <div>
                <div className="w-full h-8 rounded-lg bg-[#EBE5DC] border border-black/10 mb-1"></div>
                <span className="text-gray-600">Warm Neutral</span>
              </div>
              <div>
                <div className="w-full h-8 rounded-lg bg-[#D7B48D] border border-black/10 mb-1"></div>
                <span className="text-gray-600">Natural Wood</span>
              </div>
              <div>
                <div className="w-full h-8 rounded-lg bg-[#FAF9F6] border border-black/10 mb-1"></div>
                <span className="text-gray-600">Stone Quartz</span>
              </div>
              <div>
                <div className="w-full h-8 rounded-lg bg-[#637357] border border-black/10 mb-1"></div>
                <span className="text-gray-600">Olive Green</span>
              </div>
            </div>
          </div>

          {/* Card 4: Manage Budget for this Room CTA */}
          <div className="p-5 bg-gradient-to-br from-[#004F5C] to-[#006B7B] rounded-2xl text-white shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-teal-200" />
              <h3 className="font-bold text-xs">Manage Budget for This Room</h3>
            </div>
            <p className="text-xs text-teal-100/90 leading-relaxed">
              Every product added from this catalog is automatically accounted for in your project budget breakdown.
            </p>
            <button
              onClick={() => onNavigate('/app/budget')}
              className="w-full py-2.5 bg-white text-[#006B7B] hover:bg-teal-50 rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Open Budget Planner
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

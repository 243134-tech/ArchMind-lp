import React, { useState } from 'react';
import {
  Search,
  Filter,
  Heart,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Sparkles,
  ChevronRight,
  Plus,
  ArrowRight,
  Phone,
  MessageSquare,
  Calendar,
  Calculator,
  ShieldCheck,
  Building,
  Compass,
  Car,
  CheckCircle,
  ExternalLink,
  Layers,
  Map,
  Grid,
  X,
  Check,
  Share2,
  TrendingUp,
} from 'lucide-react';
import { archMindStore } from '../services/store';
import { Property } from '../types';
import { formatINR } from '../utils/formatters';

interface PropertiesPageProps {
  onNavigate: (route: string) => void;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({ onNavigate }) => {
  const properties = archMindStore.getProperties();
  const activeProject = archMindStore.getActiveProject();

  // Filters state
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedBhk, setSelectedBhk] = useState('All');
  const [selectedBudgetRange, setSelectedBudgetRange] = useState('All');
  const [selectedPossession, setSelectedPossession] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedMapPropId, setSelectedMapPropId] = useState<string>('prop_kl_terrace');

  // Interactive Modals
  const [emiModalProp, setEmiModalProp] = useState<Property | null>(null);
  const [contactModalProp, setContactModalProp] = useState<Property | null>(null);
  const [visitBookedToast, setVisitBookedToast] = useState<string | null>(null);

  // EMI Calculator State inside modal
  const [emiLoanAmount, setEmiLoanAmount] = useState<number>(11600000);
  const [emiInterestRate, setEmiInterestRate] = useState<number>(8.4);
  const [emiTenureYears, setEmiTenureYears] = useState<number>(20);

  // Site Visit Form State
  const [visitDate, setVisitDate] = useState('2025-05-18');
  const [visitTimeSlot, setVisitTimeSlot] = useState('11:00 AM');
  const [visitType, setVisitType] = useState<'In-Person Site Visit' | 'Live Video Tour'>('In-Person Site Visit');
  const [visitorName, setVisitorName] = useState('Sarah Chen');
  const [visitorPhone, setVisitorPhone] = useState('+91 98201 45890');

  // Filter Logic
  const filtered = properties.filter((p) => {
    if (locationSearch) {
      const q = locationSearch.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        (p.developerName && p.developerName.toLowerCase().includes(q)) ||
        (p.reraId && p.reraId.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (selectedCity !== 'All' && !p.city.toLowerCase().includes(selectedCity.toLowerCase())) {
      return false;
    }

    if (selectedBhk !== 'All') {
      const bhkNum = parseInt(selectedBhk);
      if (bhkNum && p.bedrooms !== bhkNum) return false;
    }

    if (selectedPossession !== 'All' && p.possessionStatus !== selectedPossession) {
      return false;
    }

    if (selectedBudgetRange !== 'All') {
      if (selectedBudgetRange === 'Under ₹2 Cr' && p.price >= 20000000) return false;
      if (selectedBudgetRange === '₹2 Cr – ₹3.5 Cr' && (p.price < 20000000 || p.price > 35000000)) return false;
      if (selectedBudgetRange === '₹3.5 Cr – ₹5 Cr' && (p.price < 35000000 || p.price > 50000000)) return false;
      if (selectedBudgetRange === 'Above ₹5 Cr' && p.price <= 50000000) return false;
    }

    return true;
  });

  // Calculate dynamic EMI
  const calculateEmi = (principal: number, ratePercent: number, tenureYrs: number) => {
    const monthlyRate = ratePercent / (12 * 100);
    const months = tenureYrs * 12;
    if (monthlyRate === 0) return Math.round(principal / months);
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  const openEmiCalculator = (p: Property) => {
    const principal = Math.round(p.price * 0.8); // 80% loan default
    setEmiLoanAmount(principal);
    setEmiInterestRate(p.loanDetails?.indicativeInterestRate || 8.4);
    setEmiTenureYears(20);
    setEmiModalProp(p);
  };

  const openContactAgent = (p: Property) => {
    setContactModalProp(p);
  };

  const handleBookVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactModalProp) return;
    setVisitBookedToast(`Site visit confirmed for ${contactModalProp.title} on ${visitDate} at ${visitTimeSlot}!`);
    setContactModalProp(null);
    setTimeout(() => setVisitBookedToast(null), 5000);
  };

  const selectedMapProperty = properties.find((p) => p.id === selectedMapPropId) || properties[0];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Toast Notification */}
      {visitBookedToast && (
        <div className="fixed top-5 right-5 z-50 p-4 bg-emerald-900 text-white rounded-2xl shadow-2xl border border-emerald-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div className="text-xs font-medium">{visitBookedToast}</div>
          <button onClick={() => setVisitBookedToast(null)} className="ml-2 text-emerald-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Market Ticker */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200/80 rounded-full text-xs font-semibold text-[#006B7B] mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% RERA Registered Luxury Real Estate</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171C2C] tracking-tight">
              Explore Properties &amp; Land Assets
            </h1>
            <p className="text-xs sm:text-sm text-[#667085] mt-1">
              Curated prime residences across India with architectural potential, direct builder contacts, and live loan rates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex bg-white p-1 rounded-2xl border border-[#E6E9ED] shadow-2xs text-xs font-medium">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                  viewMode === 'grid' ? 'bg-[#006B7B] text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                  viewMode === 'map' ? 'bg-[#006B7B] text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Map View</span>
              </button>
            </div>

            <button
              onClick={() => onNavigate('/app/design-studio')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Redesign in Studio</span>
            </button>
          </div>
        </div>

        {/* Real Estate Market Intelligence Ticker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-white rounded-2xl border border-[#E6E9ED] shadow-2xs">
            <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Average Price/sqft</div>
            <div className="text-base font-bold text-gray-900 mt-0.5">₹8,450 / sqft</div>
            <div className="text-[10px] text-emerald-600 flex items-center gap-1 mt-0.5 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+7.2% annual appreciation</span>
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-[#E6E9ED] shadow-2xs">
            <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Home Loan Rates</div>
            <div className="text-base font-bold text-gray-900 mt-0.5">From 8.35% p.a.</div>
            <div className="text-[10px] text-teal-700 mt-0.5">HDFC, SBI &amp; ICICI pre-approved</div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-[#E6E9ED] shadow-2xs">
            <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Possession Status</div>
            <div className="text-base font-bold text-gray-900 mt-0.5">80% Ready to Move</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Instant handover &amp; registry</div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-[#E6E9ED] shadow-2xs">
            <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Brokerage &amp; Legal</div>
            <div className="text-base font-bold text-emerald-700 mt-0.5">Zero Brokerage</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Verified RERA title deeds</div>
          </div>
        </div>
      </div>

      {/* Advanced Real Estate Search & Filters Bar */}
      <div className="p-4 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Main Search Input */}
          <div className="flex-1 min-w-[260px] relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              placeholder="Search by builder, locality (Indiranagar, Worli, Whitefield), or RERA ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#006B7B]"
            />
          </div>

          {/* City Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-gray-800 font-medium"
            >
              <option value="All">All Cities (India)</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi NCR">Delhi NCR / Gurgaon</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
            </select>
          </div>

          {/* BHK Configuration */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">BHK:</span>
            <select
              value={selectedBhk}
              onChange={(e) => setSelectedBhk(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-gray-800 font-medium"
            >
              <option value="All">All BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4 BHK</option>
              <option value="5">5+ BHK Villa / Penthouse</option>
            </select>
          </div>

          {/* Budget Range */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Budget:</span>
            <select
              value={selectedBudgetRange}
              onChange={(e) => setSelectedBudgetRange(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-gray-800 font-medium"
            >
              <option value="All">All Budgets</option>
              <option value="Under ₹2 Cr">Under ₹2 Cr</option>
              <option value="₹2 Cr – ₹3.5 Cr">₹2 Cr – ₹3.5 Cr</option>
              <option value="₹3.5 Cr – ₹5 Cr">₹3.5 Cr – ₹5 Cr</option>
              <option value="Above ₹5 Cr">Above ₹5 Cr</option>
            </select>
          </div>

          {/* Possession Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Possession:</span>
            <select
              value={selectedPossession}
              onChange={(e) => setSelectedPossession(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-gray-800 font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Ready to Move">Ready to Move</option>
              <option value="Under Construction">Under Construction</option>
            </select>
          </div>

          {(locationSearch || selectedCity !== 'All' || selectedBhk !== 'All' || selectedBudgetRange !== 'All' || selectedPossession !== 'All') && (
            <button
              onClick={() => {
                setLocationSearch('');
                setSelectedCity('All');
                setSelectedBhk('All');
                setSelectedBudgetRange('All');
                setSelectedPossession('All');
              }}
              className="text-xs text-[#006B7B] font-semibold hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW MODE 1: SPLIT INTERACTIVE MAP VIEW */}
      {/* ========================================================= */}
      {viewMode === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Property List (5 cols) */}
          <div className="lg:col-span-5 space-y-4 max-h-[820px] overflow-y-auto pr-1">
            <div className="text-xs font-semibold text-gray-500 mb-1">
              Showing {filtered.length} Properties in Map View
            </div>

            {filtered.map((property) => (
              <div
                key={property.id}
                onClick={() => setSelectedMapPropId(property.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedMapPropId === property.id
                    ? 'bg-white border-[#006B7B] shadow-md ring-2 ring-teal-500/20'
                    : 'bg-white border-[#E6E9ED] hover:border-gray-300 shadow-xs'
                }`}
              >
                <div className="flex gap-3">
                  <img
                    src={property.coverImage}
                    alt={property.title}
                    className="w-28 h-24 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900">
                        {formatINR(property.price, { compact: true })}
                      </span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                        {property.possessionStatus || 'Ready to Move'}
                      </span>
                    </div>

                    <h4 className="font-bold text-gray-900 text-xs truncate mt-0.5" title={property.title}>
                      {property.title}
                    </h4>
                    <div className="text-[11px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                      <span>{property.location}</span>
                    </div>

                    <div className="text-[10px] text-gray-500 mt-2 font-mono flex items-center gap-3">
                      <span>{property.bedrooms} BHK</span>
                      <span>•</span>
                      <span>{property.builtUpArea} sqft</span>
                      <span>•</span>
                      <span className="text-[#006B7B] font-semibold">{formatINR(property.pricePerSqft || 6500)}/sqft</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[11px] text-teal-800 font-semibold">
                    <Calculator className="w-3.5 h-3.5 text-[#006B7B]" />
                    <span>EMI from {formatINR(property.loanDetails?.estimatedEmi || 95000)}/mo</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(`/app/properties/${property.id}`);
                    }}
                    className="text-[#006B7B] font-bold text-xs hover:underline flex items-center gap-0.5"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Simulated Interactive Architectural GIS Map (7 cols) */}
          <div className="lg:col-span-7 sticky top-24 space-y-4">
            <div className="relative h-[620px] rounded-3xl overflow-hidden border-2 border-gray-200 shadow-md bg-[#0F172A]">
              
              {/* Map Canvas Background (Simulated Vector Map) */}
              <div className="absolute inset-0 opacity-85">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="#0F172A" />
                  <rect width="100%" height="100%" fill="url(#gridPattern)" />

                  {/* Curving River / Water Body */}
                  <path
                    d="M-50,380 C180,340 320,440 500,410 C680,380 750,480 900,460"
                    fill="none"
                    stroke="#0284C7"
                    strokeWidth="28"
                    opacity="0.35"
                  />
                  {/* Metro Rail Line (Purple) */}
                  <path
                    d="M50,100 L320,240 L540,290 L850,360"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="3.5"
                    strokeDasharray="6,4"
                  />
                  {/* Arterial Ring Road (Teal) */}
                  <circle cx="420" cy="300" r="220" fill="none" stroke="#006B7B" strokeWidth="2.5" opacity="0.6" />
                </svg>
              </div>

              {/* Map Floating Badges: Transit, Hubs */}
              <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-black/80 backdrop-blur-md border border-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Live GIS Satellite &amp; Transit Active
                </span>
                <span className="px-2.5 py-1 bg-purple-900/80 backdrop-blur-md border border-purple-400/30 text-purple-200 rounded-xl text-[10px] font-mono">
                  Metro Transit Corridors
                </span>
              </div>

              {/* Interactive Property Map Pins */}
              {properties.map((p, idx) => {
                // Computed visual positions for the canvas
                const pinCoordinates: Record<string, { top: string; left: string }> = {
                  prop_kl_terrace: { top: '38%', left: '34%' },
                  prop_damansara_villa: { top: '48%', left: '68%' },
                  prop_bangsar_semi_d: { top: '64%', left: '26%' },
                  prop_sohna_penthouse: { top: '22%', left: '55%' },
                  prop_jubilee_hills_mansion: { top: '56%', left: '48%' },
                  prop_koregaon_residence: { top: '35%', left: '78%' },
                };
                const coords = pinCoordinates[p.id] || { top: `${30 + idx * 10}%`, left: `${25 + idx * 12}%` };
                const isSelected = selectedMapPropId === p.id;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedMapPropId(p.id)}
                    style={{ top: coords.top, left: coords.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                  >
                    <div
                      className={`px-3 py-1.5 rounded-full font-bold text-xs transition-all shadow-xl flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#55C7D9] text-black scale-110 ring-4 ring-white'
                          : 'bg-white text-gray-900 hover:bg-teal-50 hover:scale-105'
                      }`}
                    >
                      <Building className="w-3.5 h-3.5 text-[#006B7B]" />
                      <span>{formatINR(p.price, { compact: true })}</span>
                    </div>
                  </div>
                );
              })}

              {/* Selected Property Spotlight Card on Bottom of Map */}
              {selectedMapProperty && (
                <div className="absolute bottom-4 left-4 right-4 z-20 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-white/50 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={selectedMapProperty.coverImage}
                      alt={selectedMapProperty.title}
                      className="w-16 h-16 rounded-xl object-cover shadow-xs flex-shrink-0"
                    />
                    <div>
                      <div className="text-xs text-[#006B7B] font-bold font-mono">
                        {selectedMapProperty.developerName || 'Premier Builder'} • {selectedMapProperty.reraId}
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm truncate max-w-sm">
                        {selectedMapProperty.title}
                      </h3>
                      <div className="text-xs text-gray-600 flex items-center gap-2 mt-0.5">
                        <span className="font-bold text-gray-900 text-sm">
                          {formatINR(selectedMapProperty.price)}
                        </span>
                        <span>•</span>
                        <span>{selectedMapProperty.builtUpArea} sqft</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold">{selectedMapProperty.possessionStatus}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openContactAgent(selectedMapProperty)}
                      className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#006B7B]" />
                      <span>Contact</span>
                    </button>
                    <button
                      onClick={() => onNavigate(`/app/properties/${selectedMapProperty.id}`)}
                      className="px-4 py-2 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <span>Full Real Estate Sheet</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW MODE 2: HIGH-CONVERTING REAL ESTATE CARDS GRID */}
      {/* ========================================================= */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((property) => (
            <div
              key={property.id}
              className="p-4 bg-white rounded-3xl border border-[#E6E9ED] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Photo Gallery with Real Estate Badges */}
                <div className="relative rounded-2xl overflow-hidden aspect-16/10 mb-3.5 bg-gray-100">
                  <img
                    src={property.coverImage}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Top Left Badges: Possession Status + RERA */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                    <span className="px-2.5 py-1 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold rounded-lg shadow-sm">
                      {property.possessionStatus || 'Ready to Move'}
                    </span>
                    {property.reraId && (
                      <span className="px-2 py-0.5 bg-emerald-600/90 backdrop-blur-md text-white text-[9px] font-semibold rounded-md shadow-sm flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" />
                        <span>RERA Verified</span>
                      </span>
                    )}
                  </div>

                  {/* Top Right: Shortlist Heart */}
                  <button
                    onClick={() => archMindStore.togglePropertyShortlist(property.id)}
                    className={`absolute top-2.5 right-2.5 p-2 rounded-full bg-white/85 backdrop-blur-md hover:bg-white transition-colors shadow-xs ${
                      property.isShortlisted ? 'text-rose-500 fill-rose-500' : 'text-gray-600'
                    }`}
                    title="Shortlist Property"
                  >
                    <Heart className={`w-4 h-4 ${property.isShortlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  {/* Bottom Strip: City & Micro-market */}
                  <div className="absolute bottom-2 left-2.5 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-lg text-white text-[11px] font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#55C7D9]" />
                    <span>{property.location}</span>
                  </div>
                </div>

                {/* Developer Info & RERA */}
                <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                  <span className="font-semibold text-gray-700 truncate max-w-[190px]">
                    {property.developerName || 'Premier Builder'}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono truncate max-w-[120px]">
                    {property.reraId}
                  </span>
                </div>

                {/* Price Line & Price / sqft */}
                <div className="flex items-baseline justify-between pt-0.5">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight font-serif">
                    {formatINR(property.price, { compact: true })}
                  </div>
                  <div className="text-xs font-semibold text-gray-500">
                    {formatINR(property.pricePerSqft || 6500)} / sqft
                  </div>
                </div>

                {/* Title */}
                <h3
                  className="font-bold text-gray-900 text-sm mt-1 group-hover:text-[#006B7B] transition-colors truncate"
                  title={property.title}
                >
                  {property.title}
                </h3>

                {/* Specs Strip */}
                <div className="grid grid-cols-4 gap-1 py-3 border-y border-gray-100 my-3 text-xs text-center text-gray-700">
                  <div className="p-1">
                    <div className="font-bold text-gray-900">{property.bedrooms} BHK</div>
                    <div className="text-[10px] text-gray-400">Bedrooms</div>
                  </div>
                  <div className="p-1">
                    <div className="font-bold text-gray-900">{property.bathrooms} Baths</div>
                    <div className="text-[10px] text-gray-400">Ensuite</div>
                  </div>
                  <div className="p-1">
                    <div className="font-bold text-gray-900">{property.carpetArea || property.builtUpArea}</div>
                    <div className="text-[10px] text-gray-400">sqft carpet</div>
                  </div>
                  <div className="p-1">
                    <div className="font-bold text-gray-900">{property.parkingSpaces} Cars</div>
                    <div className="text-[10px] text-gray-400">Covered</div>
                  </div>
                </div>

                {/* Real Estate Quick Financial Badges */}
                <div className="space-y-1.5 mb-3 text-xs">
                  {/* EMI Calculator Pill */}
                  <div
                    onClick={() => openEmiCalculator(property)}
                    className="p-2.5 bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100/70 hover:to-emerald-100/70 rounded-xl border border-teal-200/60 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-teal-950">
                      <Calculator className="w-3.5 h-3.5 text-[#006B7B]" />
                      <span>Estimated EMI:</span>
                      <strong className="text-[#006B7B]">{formatINR(property.loanDetails?.estimatedEmi || 95000)}/mo</strong>
                    </div>
                    <span className="text-[10px] text-[#006B7B] font-bold hover:underline">Calculate →</span>
                  </div>

                  {/* AI Renovation Potential */}
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-gray-600 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>AI Architectural Score</span>
                    </span>
                    <span className="font-bold text-gray-900">{property.potentialScore}/100</span>
                  </div>
                </div>

                {/* Verified Agent Contact Preview */}
                {property.agentContact && (
                  <div className="p-2.5 bg-gray-50/70 rounded-2xl border border-gray-100 flex items-center justify-between gap-2 mb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={property.agentContact.avatarUrl}
                        alt={property.agentContact.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
                      />
                      <div>
                        <div className="font-bold text-gray-900 text-xs flex items-center gap-1">
                          <span>{property.agentContact.name}</span>
                          <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1 rounded">RERA</span>
                        </div>
                        <div className="text-[10px] text-gray-400">{property.agentContact.agency}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${property.agentContact.phone}`}
                        className="p-1.5 bg-white hover:bg-teal-50 text-[#006B7B] border border-gray-200 rounded-xl shadow-2xs transition-colors"
                        title={`Call ${property.agentContact.name}`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://wa.me/${property.agentContact.whatsapp}?text=Hi%20${encodeURIComponent(property.agentContact.name)},%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}%20listed%20on%20ArchMind.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-2xs transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => openContactAgent(property)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  <span>Schedule Visit</span>
                </button>
                <button
                  onClick={() => onNavigate(`/app/properties/${property.id}`)}
                  className="flex-1 py-2.5 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: REAL ESTATE HOME LOAN & EMI CALCULATOR */}
      {/* ========================================================= */}
      {emiModalProp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-teal-50 to-emerald-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#006B7B] text-white flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Home Loan &amp; EMI Estimator</h3>
                  <div className="text-[11px] text-gray-500">{emiModalProp.title}</div>
                </div>
              </div>
              <button
                onClick={() => setEmiModalProp(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              {/* Calculated Monthly EMI Hero Display */}
              <div className="p-5 bg-gradient-to-br from-[#0C1B2A] to-[#162F4A] rounded-2xl text-white text-center shadow-md">
                <span className="text-[11px] text-teal-300 font-mono uppercase tracking-wider block">
                  Estimated Monthly EMI
                </span>
                <div className="text-3xl font-extrabold text-white mt-1 font-serif">
                  {formatINR(calculateEmi(emiLoanAmount, emiInterestRate, emiTenureYears))}
                  <span className="text-sm font-normal text-gray-300"> / month</span>
                </div>
                <div className="text-[11px] text-gray-300 mt-2 font-mono flex items-center justify-center gap-3">
                  <span>Loan: {formatINR(emiLoanAmount)}</span>
                  <span>•</span>
                  <span>Rate: {emiInterestRate}%</span>
                  <span>•</span>
                  <span>{emiTenureYears} Years</span>
                </div>
              </div>

              {/* Sliders Control */}
              <div className="space-y-4">
                {/* Loan Principal Slider */}
                <div>
                  <div className="flex justify-between font-semibold text-gray-700 mb-1">
                    <span>Loan Amount (80% Default)</span>
                    <span className="text-[#006B7B] font-bold">{formatINR(emiLoanAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min={Math.round(emiModalProp.price * 0.2)}
                    max={Math.round(emiModalProp.price * 0.95)}
                    step={100000}
                    value={emiLoanAmount}
                    onChange={(e) => setEmiLoanAmount(Number(e.target.value))}
                    className="w-full accent-[#006B7B]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-0.5 font-mono">
                    <span>Down payment: {formatINR(emiModalProp.price - emiLoanAmount)}</span>
                    <span>Total Property: {formatINR(emiModalProp.price)}</span>
                  </div>
                </div>

                {/* Interest Rate Slider */}
                <div>
                  <div className="flex justify-between font-semibold text-gray-700 mb-1">
                    <span>Interest Rate (% per annum)</span>
                    <span className="text-[#006B7B] font-bold">{emiInterestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={7.5}
                    max={12}
                    step={0.05}
                    value={emiInterestRate}
                    onChange={(e) => setEmiInterestRate(Number(e.target.value))}
                    className="w-full accent-[#006B7B]"
                  />
                </div>

                {/* Tenure Slider */}
                <div>
                  <div className="flex justify-between font-semibold text-gray-700 mb-1">
                    <span>Loan Tenure</span>
                    <span className="text-[#006B7B] font-bold">{emiTenureYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={30}
                    step={1}
                    value={emiTenureYears}
                    onChange={(e) => setEmiTenureYears(Number(e.target.value))}
                    className="w-full accent-[#006B7B]"
                  />
                </div>
              </div>

              {/* Bank Partner Offers */}
              <div className="pt-2 border-t border-gray-100">
                <div className="text-[11px] font-bold text-gray-900 mb-2">Pre-Approved Banking Partners</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="font-bold text-gray-900 text-xs">HDFC Bank</div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">8.40% p.a.</div>
                    <div className="text-[9px] text-gray-400">Zero Processing</div>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="font-bold text-gray-900 text-xs">SBI Home Loan</div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">8.35% p.a.</div>
                    <div className="text-[9px] text-gray-400">Govt Assurance</div>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="font-bold text-gray-900 text-xs">ICICI Bank</div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">8.45% p.a.</div>
                    <div className="text-[9px] text-gray-400">Instant Sanction</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  alert(`Loan pre-approval application initiated for ${formatINR(emiLoanAmount)} with HDFC / SBI. Relationship manager will contact you within 2 hours.`);
                  setEmiModalProp(null);
                }}
                className="w-full py-3 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Apply for Pre-Approved Home Loan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: SCHEDULE SITE VISIT & CONTACT AGENT */}
      {/* ========================================================= */}
      {contactModalProp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Schedule Property Site Visit</h3>
                <div className="text-[11px] text-gray-500">{contactModalProp.title}</div>
              </div>
              <button
                onClick={() => setContactModalProp(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookVisitSubmit} className="p-6 space-y-4 text-xs">
              {/* Agent Card Header */}
              {contactModalProp.agentContact && (
                <div className="p-3 bg-teal-50/70 border border-teal-200/60 rounded-2xl flex items-center gap-3">
                  <img
                    src={contactModalProp.agentContact.avatarUrl}
                    alt={contactModalProp.agentContact.name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-teal-600/20"
                  />
                  <div>
                    <div className="font-bold text-gray-900 text-xs">{contactModalProp.agentContact.name}</div>
                    <div className="text-[10px] text-gray-500">{contactModalProp.agentContact.agency}</div>
                    <div className="text-[10px] text-teal-800 font-mono">{contactModalProp.agentContact.phone}</div>
                  </div>
                </div>
              )}

              {/* Visit Type */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">Visit Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['In-Person Site Visit', 'Live Video Tour'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setVisitType(t)}
                      className={`py-2 px-3 rounded-xl border text-center transition-all ${
                        visitType === t
                          ? 'border-[#006B7B] bg-teal-50 text-[#006B7B] font-bold'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Time Slot</label>
                  <select
                    value={visitTimeSlot}
                    onChange={(e) => setVisitTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white"
                  >
                    <option>10:00 AM (Morning)</option>
                    <option>11:30 AM (Morning)</option>
                    <option>02:30 PM (Afternoon)</option>
                    <option>04:00 PM (Afternoon)</option>
                    <option>05:30 PM (Evening Sunset)</option>
                  </select>
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Mobile Number (with WhatsApp)</label>
                  <input
                    type="tel"
                    required
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-bold transition-all shadow-md mt-2"
              >
                Confirm Site Visit Booking
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

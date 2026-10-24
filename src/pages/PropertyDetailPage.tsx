import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Car,
  Heart,
  Share2,
  Sparkles,
  DollarSign,
  Compass,
  Check,
  Building,
  Navigation,
  Phone,
  MessageSquare,
  Calendar,
  Calculator,
  ShieldCheck,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  Award,
  CheckCircle,
  Info,
  Home,
  CheckCheck,
  X,
  FileText,
  BadgePercent,
  Landmark,
} from 'lucide-react';
import { archMindStore } from '../services/store';
import { formatINR } from '../utils/formatters';

interface PropertyDetailPageProps {
  propertyId?: string;
  onNavigate: (route: string) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  propertyId = 'prop_kl_terrace',
  onNavigate,
}) => {
  const property = archMindStore.getProperty(propertyId) || archMindStore.getProperties()[0];
  const activeProject = archMindStore.getActiveProject();

  // Media & Gallery Tab
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'floorplan' | 'map' | 'ai'>('photos');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(true);

  // EMI Calculator Dynamic State
  const basePrice = property.price;
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(property.loanDetails?.indicativeInterestRate || 8.4);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [loanAppliedToast, setLoanAppliedToast] = useState(false);

  // Computed Loan Values
  const downPaymentAmount = Math.round((basePrice * downPaymentPercent) / 100);
  const loanPrincipal = basePrice - downPaymentAmount;
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const computedMonthlyEmi = Math.round(
    (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
  const totalRepayment = computedMonthlyEmi * totalMonths;
  const totalInterest = totalRepayment - loanPrincipal;

  // Price Breakdown Calculations (Indian Real Estate Standards)
  const isReady = property.possessionStatus === 'Ready to Move';
  const stampDutyRate = 0.055; // 5.5%
  const registrationRate = 0.01; // 1%
  const gstRate = isReady ? 0 : 0.05; // 5% if under construction, 0% for ready with OC
  const stampDuty = Math.round(basePrice * stampDutyRate);
  const registrationCharges = Math.round(basePrice * registrationRate);
  const gstAmount = Math.round(basePrice * gstRate);
  const maintenanceCorpus = 85000;
  const totalAllInclusiveCost = basePrice + stampDuty + registrationCharges + gstAmount + maintenanceCorpus;

  // Site Visit Booking State
  const [visitType, setVisitType] = useState<'In-Person Site Visit' | 'Live Video Guided Tour'>('In-Person Site Visit');
  const [visitDate, setVisitDate] = useState('This Saturday');
  const [visitTime, setVisitTime] = useState('11:00 AM');
  const [withCabPickup, setWithCabPickup] = useState(true);
  const [bookingName, setBookingName] = useState('Sarah Chen');
  const [bookingPhone, setBookingPhone] = useState('+91 98201 45890');
  const [visitConfirmedToast, setVisitConfirmedToast] = useState(false);
  const [copiedRera, setCopiedRera] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  const gallery = property.galleryImages && property.galleryImages.length > 0
    ? property.galleryImages
    : [property.coverImage];

  const agent = property.agentContact || {
    name: 'Rajesh Varma',
    agency: 'ArchMind Elite Realty Advisors',
    phone: '+91 98201 45890',
    whatsapp: 'https://wa.me/919820145890',
    email: 'rajesh.varma@archmindproperties.in',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    rating: 4.9,
    reviewCount: 42,
    reraRegistered: true,
  };

  const handleCopyRera = () => {
    if (property.reraId) {
      navigator.clipboard?.writeText(property.reraId);
      setCopiedRera(true);
      setTimeout(() => setCopiedRera(false), 2500);
    }
  };

  const handleBookVisit = (e: React.FormEvent) => {
    e.preventDefault();
    setVisitConfirmedToast(true);
    setTimeout(() => setVisitConfirmedToast(false), 4500);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => setInquirySent(false), 4000);
  };

  const googleMapsUrl = property.coordinates
    ? `https://maps.google.com/?q=${property.coordinates.lat},${property.coordinates.lng}`
    : `https://maps.google.com/?q=${encodeURIComponent(property.location + ', ' + property.city)}`;

  return (
    <div className="space-y-6 pb-16">
      
      {/* Toast: Site Visit Confirmed */}
      {visitConfirmedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#004F5C] text-white px-5 py-4 rounded-2xl shadow-2xl border border-teal-400/30 flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          <div>
            <div className="text-sm font-bold">Site Visit Confirmed!</div>
            <div className="text-xs text-teal-100">
              Agent {agent.name} will meet you on {visitDate} at {visitTime}. SMS details sent to {bookingPhone}.
            </div>
          </div>
          <button onClick={() => setVisitConfirmedToast(false)} className="ml-2 text-white/60 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Toast: Loan Application Pre-Approved */}
      {loanAppliedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-teal-500/30 flex items-center gap-3">
          <BadgePercent className="w-6 h-6 text-teal-400 flex-shrink-0" />
          <div>
            <div className="text-sm font-bold">Home Loan Pre-Qualification Sent</div>
            <div className="text-xs text-slate-300">
              Application for {formatINR(loanPrincipal)} forwarded to partner banks (HDFC, SBI, ICICI).
            </div>
          </div>
          <button onClick={() => setLoanAppliedToast(false)} className="ml-2 text-white/60 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP BAR / BREADCRUMBS & RERA IDENTIFIER */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E6E9ED] shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/app/properties')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-teal-50 text-xs text-[#006B7B] font-semibold rounded-xl border border-gray-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Discover Properties</span>
          </button>

          <span className="text-gray-300">/</span>

          <span className="text-xs font-semibold text-gray-800 truncate max-w-xs sm:max-w-md">
            {property.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* RERA Verified Badge */}
          {property.reraId && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-mono text-[11px]">{property.reraId}</span>
              <button
                onClick={handleCopyRera}
                title="Copy RERA ID"
                className="ml-1 text-emerald-700 hover:text-emerald-900 text-[10px] underline"
              >
                {copiedRera ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}

          {/* Shortlist button */}
          <button
            onClick={() => archMindStore.togglePropertyShortlist(property.id)}
            className="p-2 bg-white rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-2xs transition-colors"
            title="Shortlist Property"
          >
            <Heart className={`w-4 h-4 ${property.isShortlisted ? 'text-rose-500 fill-rose-500' : ''}`} />
          </button>

          {/* Share button */}
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Property share link copied to clipboard!');
              }
            }}
            className="p-2 bg-white rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-2xs transition-colors"
            title="Share Property"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT: 8 COLS REAL ESTATE SPECIFICATION + 4 COLS STICKY BROKER & BOOKING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: VISUAL MEDIA & DEEP SPECIFICATIONS (8 COLS) */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* MEDIA VIEWER: PHOTOS / BLUEPRINT / TRANSIT MAP */}
          <div className="bg-white rounded-3xl border border-[#E6E9ED] overflow-hidden shadow-xs">
            {/* View Mode Tabs */}
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2 bg-gray-50/80">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveMediaTab('photos')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeMediaTab === 'photos'
                      ? 'bg-white text-[#006B7B] shadow-2xs border border-gray-200'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Gallery ({gallery.length} Photos)
                </button>
                <button
                  onClick={() => setActiveMediaTab('floorplan')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeMediaTab === 'floorplan'
                      ? 'bg-white text-[#006B7B] shadow-2xs border border-gray-200'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Floor Plan Blueprint
                </button>
                <button
                  onClick={() => setActiveMediaTab('map')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeMediaTab === 'map'
                      ? 'bg-white text-[#006B7B] shadow-2xs border border-gray-200'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Neighbourhood GIS Map
                </button>
                <button
                  onClick={() => setActiveMediaTab('ai')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                    activeMediaTab === 'ai'
                      ? 'bg-white text-[#006B7B] shadow-2xs border border-gray-200'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-[#006B7B]" />
                  <span>AI Renovation Potential</span>
                </button>
              </div>

              <span className="hidden sm:inline-block px-2.5 py-0.5 bg-teal-50 text-[#006B7B] rounded-lg text-[10px] font-bold uppercase tracking-wider">
                RERA Registered Listing
              </span>
            </div>

            {/* TAB 1: PHOTO GALLERY */}
            {activeMediaTab === 'photos' && (
              <div className="p-4 space-y-3">
                <div className="relative rounded-2xl overflow-hidden aspect-16/10 bg-gray-900 shadow-inner group">
                  <img
                    src={gallery[activePhotoIdx]}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />

                  {/* Overlaid Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-black/75 backdrop-blur-md text-white text-xs font-bold rounded-xl shadow-xs">
                      {property.bhkType || `${property.bedrooms} BHK`}
                    </span>
                    <span className={`px-3 py-1 text-xs font-bold rounded-xl shadow-xs backdrop-blur-md ${
                      isReady ? 'bg-emerald-600/90 text-white' : 'bg-amber-600/90 text-white'
                    }`}>
                      {property.possessionStatus || 'Ready to Move'}
                    </span>
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-semibold rounded-xl shadow-xs">
                      Zero Brokerage
                    </span>
                  </div>

                  {/* Photo Counter */}
                  <div className="absolute bottom-4 right-4 px-2.5 py-1 bg-black/70 backdrop-blur-md text-white text-xs font-mono rounded-lg">
                    {activePhotoIdx + 1} / {gallery.length}
                  </div>
                </div>

                {/* Thumbnails */}
                {gallery.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                    {gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePhotoIdx(idx)}
                        className={`relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                          activePhotoIdx === idx
                            ? 'border-[#006B7B] ring-2 ring-teal-500/30 opacity-100 scale-102'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: FLOOR PLAN BLUEPRINT */}
            {activeMediaTab === 'floorplan' && (
              <div className="p-6 bg-slate-900 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-sm text-teal-400">Architectural Cad Blueprint &amp; Layout</h3>
                    <p className="text-xs text-slate-400">RERA verified carpet efficiency of 79.8% with zero wasted corridor circulation.</p>
                  </div>
                  <button
                    onClick={() => onNavigate('/app/floor-plans')}
                    className="px-3 py-1.5 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Open in AI Floor Plan Studio</span>
                  </button>
                </div>

                {/* Blueprint Canvas SVG */}
                <div className="relative border-2 border-teal-500/40 rounded-2xl bg-[#091524] p-6 overflow-hidden">
                  <svg className="w-full h-72 sm:h-80" viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="#091524" />
                    <rect width="100%" height="100%" fill="url(#cadGrid)" />

                    {/* Outer Boundary */}
                    <rect x="30" y="20" width="540" height="280" fill="none" stroke="#006B7B" strokeWidth="3" />

                    {/* Living & Dining Hall */}
                    <rect x="30" y="20" width="280" height="180" fill="#0E2439" stroke="#38BDF8" strokeWidth="1.5" />
                    <text x="170" y="105" fill="#38BDF8" fontSize="12" fontWeight="bold" textAnchor="middle">Living &amp; Dining Hall</text>
                    <text x="170" y="125" fill="#94A3B8" fontSize="10" textAnchor="middle">24'6" × 16'0" (392 sqft)</text>

                    {/* Master Bedroom Suite */}
                    <rect x="310" y="20" width="260" height="150" fill="#0F2D3D" stroke="#2DD4BF" strokeWidth="1.5" />
                    <text x="440" y="85" fill="#2DD4BF" fontSize="12" fontWeight="bold" textAnchor="middle">Master Suite + Walk-in</text>
                    <text x="440" y="105" fill="#94A3B8" fontSize="10" textAnchor="middle">16'0" × 14'0" (Ensuite 8'×6')</text>

                    {/* Bedroom 2 */}
                    <rect x="310" y="170" width="260" height="130" fill="#13273D" stroke="#818CF8" strokeWidth="1.5" />
                    <text x="440" y="230" fill="#818CF8" fontSize="12" fontWeight="bold" textAnchor="middle">Bedroom 2 / Kids Room</text>
                    <text x="440" y="248" fill="#94A3B8" fontSize="10" textAnchor="middle">14'0" × 12'6"</text>

                    {/* Kitchen & Utility */}
                    <rect x="30" y="200" width="160" height="100" fill="#1A2634" stroke="#F59E0B" strokeWidth="1.5" />
                    <text x="110" y="245" fill="#F59E0B" fontSize="11" fontWeight="bold" textAnchor="middle">Modular Kitchen</text>
                    <text x="110" y="262" fill="#94A3B8" fontSize="9" textAnchor="middle">12'0" × 10'0" + Utility</text>

                    {/* Sit-out Balcony Deck */}
                    <rect x="190" y="200" width="120" height="100" fill="#0A3638" stroke="#34D399" strokeWidth="1.5" strokeDasharray="4,2" />
                    <text x="250" y="245" fill="#34D399" fontSize="11" fontWeight="bold" textAnchor="middle">Balcony Deck</text>
                    <text x="250" y="262" fill="#94A3B8" fontSize="9" textAnchor="middle">12'0" × 6'0"</text>
                  </svg>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-slate-400 block text-[10px]">Carpet Area</span>
                    <span className="font-bold text-white text-sm">{property.carpetArea || Math.round(property.builtUpArea * 0.8)} sqft</span>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-slate-400 block text-[10px]">Super Built-up Area</span>
                    <span className="font-bold text-white text-sm">{property.superBuiltUpArea || property.builtUpArea} sqft</span>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-slate-400 block text-[10px]">Floor Level</span>
                    <span className="font-bold text-white text-sm">{property.floorNumber || '14th of 28'}</span>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-slate-400 block text-[10px]">Vastu Facing</span>
                    <span className="font-bold text-emerald-400 text-sm">{property.facing || 'East Facing'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: NEIGHBOURHOOD GIS TRANSIT MAP */}
            {activeMediaTab === 'map' && (
              <div className="p-6 bg-slate-950 text-white space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-teal-400">GIS Satellite &amp; Transit Grid</h3>
                    <p className="text-xs text-slate-400">{property.mapAddress || `${property.location}, ${property.city}`}</p>
                  </div>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>

                {/* Simulated Vector Transit Map */}
                <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-800 bg-[#0B132B]">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="transitGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1E293B" strokeWidth="0.6" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="#0B132B" />
                    <rect width="100%" height="100%" fill="url(#transitGrid)" />

                    {/* Road Network */}
                    <path d="M-20,160 L620,160" stroke="#334155" strokeWidth="12" />
                    <path d="M280,-20 L280,340" stroke="#334155" strokeWidth="12" />
                    {/* Metro Purple Line */}
                    <path d="M40,280 L280,160 L560,40" stroke="#8B5CF6" strokeWidth="4" strokeDasharray="8,4" />
                    {/* Ring Expressway */}
                    <circle cx="280" cy="160" r="110" fill="none" stroke="#006B7B" strokeWidth="2.5" opacity="0.6" />

                    {/* Property Central Pin */}
                    <circle cx="280" cy="160" r="16" fill="#006B7B" opacity="0.3" className="animate-ping" />
                    <circle cx="280" cy="160" r="8" fill="#14B8A6" stroke="#FFFFFF" strokeWidth="2" />
                    
                    {/* Metro Station Node */}
                    <circle cx="210" cy="200" r="6" fill="#8B5CF6" />
                    <text x="220" y="204" fill="#C4B5FD" fontSize="10" fontWeight="bold">Metro Station (800m)</text>

                    {/* Tech Park Node */}
                    <circle cx="390" cy="100" r="6" fill="#38BDF8" />
                    <text x="400" y="104" fill="#BAE6FD" fontSize="10" fontWeight="bold">Tech Park (2.1 km)</text>

                    {/* Hospital Node */}
                    <circle cx="180" cy="90" r="6" fill="#F43F5E" />
                    <text x="190" y="94" fill="#FECDD3" fontSize="10" fontWeight="bold">Hospital (2.5 km)</text>
                  </svg>

                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                    <span className="text-emerald-400 font-bold">Walk Score: 94/100</span> (Daily errands do not require a car)
                  </div>
                </div>

                {/* Nearby Transit Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {property.nearbyPlaces?.map((p, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="font-semibold text-slate-200">{p.name}</div>
                      <div className="text-[11px] text-teal-400 mt-0.5">{p.distance} • {p.type}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: AI RENOVATION & ARCHITECTURAL POTENTIAL */}
            {activeMediaTab === 'ai' && (
              <div className="p-6 bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#006B7B]" />
                    <h3 className="font-bold text-gray-900 text-sm">Gemini Multimodal Structural &amp; Interior Assessment</h3>
                  </div>
                  <span className="px-3 py-1 bg-[#006B7B] text-white text-xs font-bold rounded-full">
                    Score: {property.potentialScore}/100
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-white rounded-2xl border border-teal-100 shadow-2xs space-y-1">
                    <div className="font-bold text-gray-800 flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-[#006B7B]" />
                      <span>Structural Character</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-[11px]">
                      {property.aiInsights?.architecturalCharacter || 'Deep structural beam span with column-free living hall ideal for open European layouts.'}
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-teal-100 shadow-2xs space-y-1">
                    <div className="font-bold text-gray-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#006B7B]" />
                      <span>Renovation Potential</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-[11px]">
                      {property.aiInsights?.renovationPotential || 'Partition between kitchen and breakfast bar can be reconfigured for seamless island counters.'}
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-teal-100 shadow-2xs space-y-1">
                    <div className="font-bold text-gray-800 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-[#006B7B]" />
                      <span>Estimated AI Fit-out Cost</span>
                    </div>
                    <p className="text-[#006B7B] font-bold text-sm">
                      {property.aiInsights?.estimatedRenovationCost || '₹28,50,000 – ₹35,00,000'}
                    </p>
                    <span className="text-[10px] text-gray-400 block">Includes custom carpentry, lighting &amp; Italian flooring</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('/app/design-studio')}
                  className="w-full py-3 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch AI Design Studio with this Property Floor Plan</span>
                </button>
              </div>
            )}
          </div>

          {/* PROPERTY TITLE & CORE PRICING HERO CARD */}
          <div className="p-6 bg-white rounded-3xl border border-[#E6E9ED] shadow-xs space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-teal-50 text-[#006B7B] text-xs font-bold rounded-lg border border-teal-100">
                    {property.bhkType || `${property.bedrooms} BHK`}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {property.listingType} • {property.tenure}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 font-serif">
                  {property.title}
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>{property.location}, {property.city}</span>
                </div>
              </div>

              {/* Price Tag */}
              <div className="text-right">
                <div className="text-3xl font-extrabold text-[#006B7B] font-serif">
                  {formatINR(property.price)}
                </div>
                <div className="text-xs font-semibold text-gray-500 mt-0.5">
                  ({formatINR(property.price, { compact: true })}) • {formatINR(property.pricePerSqft || Math.round(property.price / property.builtUpArea))}/sqft
                </div>
                <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center justify-end gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Government Guideline Value Approved</span>
                </div>
              </div>
            </div>

            {/* REAL ESTATE SPECIFICATION TILES */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-gray-100 text-xs">
              <div className="p-3 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Bed className="w-4 h-4 text-[#006B7B]" />
                  <span className="text-[11px]">Configuration</span>
                </div>
                <div className="font-bold text-gray-900 text-sm">{property.bedrooms} Bedrooms</div>
                <div className="text-[10px] text-gray-400">All attached ensuites</div>
              </div>

              <div className="p-3 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Bath className="w-4 h-4 text-[#006B7B]" />
                  <span className="text-[11px]">Bathrooms</span>
                </div>
                <div className="font-bold text-gray-900 text-sm">{property.bathrooms} Baths</div>
                <div className="text-[10px] text-gray-400">+ Powder room</div>
              </div>

              <div className="p-3 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Maximize2 className="w-4 h-4 text-[#006B7B]" />
                  <span className="text-[11px]">Carpet Area</span>
                </div>
                <div className="font-bold text-gray-900 text-sm">{property.carpetArea || Math.round(property.builtUpArea * 0.8)} sqft</div>
                <div className="text-[10px] text-gray-400">Super: {property.builtUpArea} sqft</div>
              </div>

              <div className="p-3 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Car className="w-4 h-4 text-[#006B7B]" />
                  <span className="text-[11px]">Car Parking</span>
                </div>
                <div className="font-bold text-gray-900 text-sm">{property.parkingSpaces} Covered Stalls</div>
                <div className="text-[10px] text-gray-400">EV Charger installed</div>
              </div>
            </div>

            {/* SECONDARY ATTRIBUTES ROW */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2 text-gray-700">
                <Compass className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-gray-400">Facing</div>
                  <div className="font-semibold">{property.facing || 'East Facing (Vastu)'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Building className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-gray-400">Floor Level</div>
                  <div className="font-semibold">{property.floorNumber || '14th of 28 Floors'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-gray-400">Possession</div>
                  <div className="font-semibold">{property.possessionStatus} ({property.possessionDate || 'Immediate'})</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Home className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-gray-400">Furnishing</div>
                  <div className="font-semibold">{property.furnishingStatus || 'Semi-Furnished'}</div>
                </div>
              </div>
            </div>

            {/* ALL-INCLUSIVE PRICE BREAKDOWN (TRANSPARENT COST ESTIMATOR) */}
            <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200/70 space-y-3">
              <div
                onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  <BadgePercent className="w-4 h-4 text-[#006B7B]" />
                  <span className="font-bold text-gray-900 text-xs">
                    All-Inclusive Estimated Handover Cost: <span className="text-[#006B7B] font-mono">{formatINR(totalAllInclusiveCost)}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#006B7B] font-semibold">
                  <span>{showPriceBreakdown ? 'Hide Cost Sheet' : 'View Itemized Sheet'}</span>
                  {showPriceBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </div>
              </div>

              {showPriceBreakdown && (
                <div className="pt-2 border-t border-teal-200/60 text-xs space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Base Agreement Cost:</span>
                    <span className="font-mono font-semibold">{formatINR(basePrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Stamp Duty (~5.5% as per State RERA):</span>
                    <span className="font-mono">{formatINR(stampDuty)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Registration &amp; Sub-Registrar Fee (~1%):</span>
                    <span className="font-mono">{formatINR(registrationCharges)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>GST ({isReady ? '0% Exempted for Ready Property' : '5% Under Construction'}):</span>
                    <span className="font-mono">{formatINR(gstAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Maintenance Corpus &amp; Sinking Fund (1 Year):</span>
                    <span className="font-mono">{formatINR(maintenanceCorpus)}</span>
                  </div>
                  <div className="pt-2 border-t border-teal-200 flex justify-between font-bold text-gray-900 text-sm">
                    <span>Total Handover Estimated Price:</span>
                    <span className="text-[#006B7B] font-mono">{formatINR(totalAllInclusiveCost)}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 pt-1 italic">
                    * Includes 2 covered basement car parking slots, club membership, electricity meter installation &amp; Cauvery water connection charges.
                  </p>
                </div>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider text-gray-400">Property Overview</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* AMENITIES */}
            <div className="space-y-2.5">
              <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider text-gray-400">Society &amp; Lifestyle Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl text-xs font-medium flex items-center gap-1.5"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{amenity}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* BUILDER / DEVELOPER CREDENTIALS */}
            <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-[#006B7B]" />
                  <span className="font-bold text-gray-900 text-xs">Developer Track Record: {property.developerName || 'Prestige Estates Projects Ltd'}</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                  Clean Legal Title
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-gray-600 text-[11px] pt-1">
                <div>• {property.developerExperience || '35+ Years of Legacy'}</div>
                <div>• 140+ Projects Handed Over</div>
                <div>• Approved by SBI, HDFC, ICICI</div>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* HOME LOAN & EMI CALCULATOR (REAL ESTATE ESSENTIAL) */}
          {/* ========================================================= */}
          <div className="p-6 bg-white rounded-3xl border border-[#E6E9ED] shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#006B7B]" />
                <h3 className="font-bold text-gray-900 text-sm">Interactive Home Loan &amp; EMI Calculator</h3>
              </div>
              <span className="text-xs text-gray-500 font-mono">
                Loan Amount: <strong className="text-gray-900">{formatINR(loanPrincipal)}</strong>
              </span>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              {/* Slider 1: Down Payment */}
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <div className="flex justify-between font-semibold text-gray-800">
                  <span>Down Payment ({downPaymentPercent}%)</span>
                  <span className="text-[#006B7B] font-mono">{formatINR(downPaymentAmount)}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full accent-[#006B7B] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>10% (Min)</span>
                  <span>50% (Max)</span>
                </div>
              </div>

              {/* Slider 2: Interest Rate */}
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <div className="flex justify-between font-semibold text-gray-800">
                  <span>Interest Rate</span>
                  <span className="text-[#006B7B] font-mono">{interestRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min="8.0"
                  max="11.0"
                  step="0.05"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-[#006B7B] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>8.0% (Repo-linked)</span>
                  <span>11.0%</span>
                </div>
              </div>

              {/* Slider 3: Loan Tenure */}
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <div className="flex justify-between font-semibold text-gray-800">
                  <span>Tenure</span>
                  <span className="text-[#006B7B] font-mono">{tenureYears} Years</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-[#006B7B] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>5 Yrs</span>
                  <span>30 Yrs (Max)</span>
                </div>
              </div>

            </div>

            {/* Computed Results Banner */}
            <div className="p-4 bg-teal-900 text-white rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-teal-200 text-xs block">Estimated Monthly Outflow</span>
                <span className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
                  {formatINR(computedMonthlyEmi)} <span className="text-xs font-normal text-teal-200">/ month</span>
                </span>
              </div>

              <div className="flex gap-4 text-xs font-mono">
                <div>
                  <span className="text-teal-300 text-[10px] block">Principal</span>
                  <span className="font-bold">{formatINR(loanPrincipal, { compact: true })}</span>
                </div>
                <div className="border-l border-teal-700 pl-4">
                  <span className="text-teal-300 text-[10px] block">Total Interest</span>
                  <span className="font-bold">{formatINR(totalInterest, { compact: true })}</span>
                </div>
                <div className="border-l border-teal-700 pl-4">
                  <span className="text-teal-300 text-[10px] block">Total Repayment</span>
                  <span className="font-bold">{formatINR(totalRepayment, { compact: true })}</span>
                </div>
              </div>
            </div>

            {/* Approved Banking Partners */}
            <div className="space-y-2 pt-1 text-xs">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Pre-Approved Bank Offers on this Property</span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="font-bold text-gray-900">SBI Home Finance</div>
                  <div className="text-[#006B7B] font-semibold text-[11px]">8.40% • Zero Fee</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Govt Guarantee</div>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="font-bold text-gray-900">HDFC Bank</div>
                  <div className="text-[#006B7B] font-semibold text-[11px]">8.45% • Fast Track</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">48hr Sanction</div>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="font-bold text-gray-900">ICICI Bank</div>
                  <div className="text-[#006B7B] font-semibold text-[11px]">8.50% • Digital</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">100% Online</div>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="font-bold text-gray-900">Kotak Mahindra</div>
                  <div className="text-[#006B7B] font-semibold text-[11px]">8.55% • Flexible</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Part-payment free</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setLoanAppliedToast(true);
                  setTimeout(() => setLoanAppliedToast(false), 4000);
                }}
                className="w-full mt-2 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Landmark className="w-3.5 h-3.5 text-teal-400" />
                <span>Apply for Instant Loan Pre-Qualification</span>
              </button>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: STICKY AGENT CONTACT & SITE VISIT (4 COLS) */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          
          {/* VERIFIED REAL ESTATE ADVISOR CARD */}
          <div className="p-5 bg-white rounded-3xl border border-[#E6E9ED] shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={agent.avatarUrl}
                alt={agent.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-teal-500/30"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-gray-900 text-sm truncate">{agent.name}</h4>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                </div>
                <div className="text-[11px] text-gray-500 truncate">{agent.agency}</div>
                <div className="text-[10px] text-amber-600 font-semibold mt-0.5">
                  ★ {agent.rating} ({agent.reviewCount} verified buyer reviews)
                </div>
              </div>
            </div>

            {/* Direct Phone & WhatsApp Call-to-Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`tel:${agent.phone.replace(/\s+/g, '')}`}
                className="py-2.5 px-3 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Agent</span>
              </a>

              <a
                href={`${agent.whatsapp}?text=Hi%20${encodeURIComponent(agent.name)},%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}%20(RERA:%20${property.reraId || 'ArchMind'}).%20Please%20share%20brochure.`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Direct Phone Number Display */}
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500 text-[11px]">Direct Line:</span>
              <span className="font-bold text-gray-900 font-mono">{agent.phone}</span>
            </div>

            {/* Send Direct Message / Inquiry Form */}
            <form onSubmit={handleSendInquiry} className="space-y-2.5 pt-2 border-t border-gray-100 text-xs">
              <div className="font-semibold text-gray-800 text-xs">Send Fast Inquiry</div>
              
              <input
                type="text"
                placeholder="Your Full Name"
                defaultValue="Sarah Chen"
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-xs focus:outline-none focus:border-[#006B7B]"
              />

              <input
                type="tel"
                placeholder="Mobile Number"
                defaultValue="+91 98201 45890"
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-xs focus:outline-none focus:border-[#006B7B]"
              />

              <textarea
                rows={2}
                placeholder="I would like to know about available units, payment plans, and site visits..."
                defaultValue={`I would like to receive the official brochure and payment schedule for ${property.title}.`}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-xs focus:outline-none focus:border-[#006B7B] resize-none"
              />

              <button
                type="submit"
                className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{inquirySent ? '✓ Inquiry Dispatched!' : 'Submit Inquiry'}</span>
              </button>
            </form>
          </div>

          {/* INTERACTIVE SCHEDULE SITE VISIT BOX */}
          <div className="p-5 bg-gradient-to-br from-teal-50 to-white rounded-3xl border border-teal-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#006B7B]" />
              <h4 className="font-bold text-teal-950 text-xs">Book an Exclusive Site Visit</h4>
            </div>

            {/* Tour Type Toggle */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-white rounded-xl border border-teal-100 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setVisitType('In-Person Site Visit')}
                className={`py-1.5 rounded-lg transition-all ${
                  visitType === 'In-Person Site Visit'
                    ? 'bg-[#006B7B] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                In-Person Visit
              </button>
              <button
                type="button"
                onClick={() => setVisitType('Live Video Guided Tour')}
                className={`py-1.5 rounded-lg transition-all ${
                  visitType === 'Live Video Guided Tour'
                    ? 'bg-[#006B7B] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Live Video Tour
              </button>
            </div>

            {/* Quick Date Chips */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] text-gray-500 font-medium">Select Preferred Day:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {['Today', 'Tomorrow', 'This Saturday', 'This Sunday'].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setVisitDate(day)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      visitDate === day
                        ? 'bg-teal-900 text-white border-teal-900'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Chips */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] text-gray-500 font-medium">Select Time Slot:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {['10:00 AM', '12:30 PM', '3:00 PM', '5:30 PM'].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setVisitTime(slot)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      visitTime === slot
                        ? 'bg-[#006B7B] text-white border-[#006B7B]'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Free Cab Pickup Checkbox (Luxury Indian Real Estate Feature) */}
            <label className="flex items-start gap-2 text-xs text-gray-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={withCabPickup}
                onChange={(e) => setWithCabPickup(e.target.checked)}
                className="mt-0.5 accent-[#006B7B] rounded"
              />
              <span className="text-[11px] leading-tight">
                Include complimentary chauffeur AC cab pickup from my location.
              </span>
            </label>

            {/* Book Now Button */}
            <button
              onClick={handleBookVisit}
              className="w-full py-3 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Confirm {visitType}</span>
            </button>
          </div>

          {/* PROJECT INTEGRATION BOX (SEAMLESS ARCHMIND WORKFLOW) */}
          <div className="p-5 bg-white rounded-3xl border border-[#E6E9ED] shadow-xs space-y-3">
            <h4 className="font-bold text-gray-900 text-xs">Architectural Workspace Integration</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Attach this real estate asset directly to your active project to start planning floor layouts and budgeting.
            </p>

            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-xs">
              <span className="text-[10px] text-gray-400 block">Active Project</span>
              <span className="font-bold text-gray-900 truncate block mt-0.5">{activeProject?.name}</span>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  archMindStore.addPropertyToProject(property.id);
                  alert(`Successfully attached "${property.title}" to project "${activeProject?.name}"!`);
                }}
                className="w-full py-2.5 bg-white hover:bg-teal-50 text-[#006B7B] border border-[#006B7B] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Building className="w-3.5 h-3.5" />
                <span>Save to Active Project</span>
              </button>

              <button
                onClick={() => onNavigate('/app/design-studio')}
                className="w-full py-2.5 bg-teal-50 hover:bg-teal-100 text-[#006B7B] rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start AI Design in Studio</span>
              </button>

              <button
                onClick={() => onNavigate('/app/budget')}
                className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 border border-gray-200"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Estimate Renovation Budget</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

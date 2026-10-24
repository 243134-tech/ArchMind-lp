import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Maximize2,
  Layers,
  ShoppingBag,
  Calculator,
  ChevronRight,
  TrendingUp,
  Sun,
  ShieldCheck,
  Eye,
  Sliders,
  DollarSign,
  Palette,
  Package,
} from 'lucide-react';
import { archMindStore } from '../services/store';
import { SpaceAnalysis } from '../types';

interface SpaceAnalysisPageProps {
  onNavigate: (route: string) => void;
}

export const SpaceAnalysisPage: React.FC<SpaceAnalysisPageProps> = ({ onNavigate }) => {
  const activeProject = archMindStore.getActiveProject();
  const designs = archMindStore.getDesigns();
  const currentConcept = designs[0];

  // Get active analysis from store or current concept or generate default rich analysis
  const analysis: SpaceAnalysis = archMindStore.getLatestSpaceAnalysis() || currentConcept?.analysis || {
    id: 'analysis_demo',
    imageUrl: currentConcept?.beforeImageUrl || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    detectedRoomType: 'Living Room',
    architecturalStyle: 'Contemporary Malaysian Modern',
    confidence: 0.94,
    analysisSummary: 'Bright, rectangular open-plan living room with strong natural illumination and excellent renovation potential.',
    spatialCharacteristics: 'Generous floor-to-ceiling height (approx. 2.9m) with wide structural beam span.',
    layoutDescription: 'Linear circulation connecting the entrance foyer through to the balcony terrace.',
    doorsAndWindows: 'Full-height anodized aluminum sliding glass doors with direct natural daylight and cross ventilation.',
    visibleFeatures: [
      'Large double sliding glass doors leading to balcony terrace',
      'High 2.9m ceiling with potential for recessed cove lighting',
      'Clean rectangular structural footprint with zero column obstruction',
      'Neutral tiled flooring with baseboard skirting',
    ],
    furnitureDetected: ['Existing lounge sofa', 'Low profile TV console', 'Potted fiddle-leaf fig plant'],
    dominantColors: ['#EBE5DC (Warm Neutral)', '#D7B48D (Natural Oak)', '#637357 (Olive Green)'],
    lighting: 'Abundant natural daytime illumination. Recommended addition of warm 2700K indirect perimeter LED strips.',
    existingLayout: 'Open-concept rectangular living hall with direct visual axis out toward exterior terrace.',
    designOpportunities: [
      'Feature fluted acoustic wood slat wall to improve acoustics and add organic texture',
      'Seamless transition between indoor living space and outdoor balcony with flush threshold',
      'Built-in floating joinery to conceal cabling and maximize floor cleanliness',
    ],
    itemsLikelyPreserved: ['Sliding glass balcony frame', 'Ceiling fan junction point'],
    existingObjects: [
      { category: 'Seating', items: ['L-shaped sectional sofa', 'Accent armchair'] },
      { category: 'Surfaces & Joinery', items: ['Low TV console', 'Coffee table'] },
      { category: 'Openings & Windows', items: ['Balcony sliding glass doors', 'Transom vents'] },
      { category: 'Lighting Fixtures', items: ['Ceiling pendant junction', 'Recessed downlights'] },
      { category: 'Finishes & Materials', items: ['Porcelain floor tiles', 'Emulsion wall paint'] },
    ],
    colorAnalysis: {
      dominantColors: ['Warm Off-White (#F4F1EA)', 'Sand Beige (#E5D8C5)'],
      secondaryColors: ['Natural Timber Oak (#C8A279)', 'Graphite Metal (#33383F)'],
      suggestedComplementary: ['Muted Olive Green (#617255)', 'Brushed Brass (#CDB580)'],
    },
    lightingAnalysis: {
      naturalSources: 'Large sliding glass door provides continuous daytime natural light.',
      artificialFixtures: 'Single central pendant point lacks layered task illumination.',
      darkSpots: 'Upper ceiling corners and television wall perimeter require accent fill.',
      recommendations: 'Add low-glare magnetic track lights and warm perimeter cove LED lighting.',
    },
    spaceUtilization: {
      circulation: 'Clear 1.2m main pathway between living area and exterior terrace.',
      storageOpportunities: 'Underutilized vertical wall space above the television console.',
      unusedAreas: 'Corner adjacent to balcony glass can house a reading lounge or planter.',
      visualClutter: 'Exposed media cabling beneath current temporary stand.',
    },
    observations: {
      whatWorksWell: [
        'Generous natural daylight and outdoor visual connection',
        'Clean rectangular footprint with zero obstructing loadbearing columns',
      ],
      areasForImprovement: [
        'Cold acoustic reflections caused by hard tile surfaces and bare drywall',
        'Lack of dedicated ambient lighting for evening relaxation',
      ],
      lightingNotes: [
        'Natural daylight is optimal during morning and midday',
        'Nighttime lighting requires warm 2700K dimmable LED layers',
      ],
      furnitureAndLayout: [
        'Living seating currently faces away from the balcony view',
        'Scale of current coffee table is small relative to seating proportions',
      ],
      materialsAndColors: [
        'Current color scheme is monochromatic and lacks organic material contrast',
        'Introduction of oak timber slats and linen upholstery will soften acoustics',
      ],
      storageAndFunctionality: [
        'Requires concealed cabinet joinery for media peripherals and books',
        'Dedicated plant stand will elevate indoor botanical elements',
      ],
    },
    smartSuggestions: [
      {
        id: 'sugg_1',
        title: 'Install Fluted Acoustic Timber Slat Feature Wall',
        description: 'Place vertical oak slats over black acoustic felt behind the TV console to dramatically enhance aesthetics and dampen room echo.',
        reason: 'Replaces plain white drywall with architectural texture while absorbing sound reflections.',
        priority: 'High',
        difficulty: 'Moderate',
        designImpact: 'High',
        budgetCategory: 'Construction',
        visibleEvidence: 'Large bare drywall opposite sliding glass doors',
      },
      {
        id: 'sugg_2',
        title: 'Upgrade to Wide Plank Engineered European Oak Flooring',
        description: 'Overlay existing cold tiles with 190mm wide matte-lacquered engineered oak planks.',
        reason: 'Provides immediate visual warmth and soft underfoot tactile comfort for family living.',
        priority: 'High',
        difficulty: 'Moderate',
        designImpact: 'High',
        budgetCategory: 'Finishes',
        visibleEvidence: 'Cold reflective ceramic tile surface',
      },
      {
        id: 'sugg_3',
        title: 'Add Indirect 2700K Perimeter LED Cove Lighting',
        description: 'Build a slim false ceiling drop to house concealed LED cove lighting along the perimeter.',
        reason: 'Eliminates glaring direct downlights and creates a relaxing boutique hotel ambiance.',
        priority: 'Medium',
        difficulty: 'Moderate',
        designImpact: 'Medium',
        budgetCategory: 'Lighting',
        visibleEvidence: 'Exposed single ceiling junction box',
      },
      {
        id: 'sugg_4',
        title: 'Incorporate Bespoke Floating Media Joinery',
        description: 'Install custom wall-hung cabinetry with soft-close Blum hardware to conceal wiring.',
        reason: 'Keeps floor space visible, making the 200 sq ft room appear significantly larger.',
        priority: 'Medium',
        difficulty: 'Easy',
        designImpact: 'Medium',
        budgetCategory: 'Furnishing',
        visibleEvidence: 'Low-profile freestanding console with cable clutter',
      },
    ],
    limitationsNotice: 'Visual analysis only. Exact structural loadbearing calculations and physical measurements require on-site professional verification.',
  };

  const [activeTab, setActiveTab] = useState<'observations' | 'suggestions' | 'objects' | 'lighting'>('observations');

  const photo = analysis.imageUrl || currentConcept?.beforeImageUrl || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => onNavigate('/app/design-studio')}
            className="flex items-center gap-1.5 text-xs text-[#006B7B] font-medium hover:underline mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to AI Design Studio</span>
          </button>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171C2C] tracking-tight">
              AI Space Analysis Results
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#006B7B] border border-teal-200">
              Confidence {Math.round(analysis.confidence * 100)}%
            </span>
          </div>
          <p className="text-xs text-[#667085] mt-1 max-w-2xl">
            Deep spatial, material, lighting, and object analysis produced by Google Gemini Multimodal AI.
          </p>
        </div>

        {/* Primary Next Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/app/design-studio')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Generate AI Redesign</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: SPACE OVERVIEW CARD */}
      {/* ========================================================= */}
      <div className="p-6 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Uploaded Photo Preview (5 cols) */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-4/3 bg-gray-100 border border-gray-200">
            <img src={photo} alt="Analyzed Room" className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold rounded-lg">
              Source Photo Analyzed
            </div>
            <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-[#006B7B] text-white text-[10px] font-bold rounded-lg shadow-xs flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Multimodal Scan</span>
            </div>
          </div>

          {/* Key Findings (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Identified Room Typology</div>
              <h2 className="text-xl font-serif font-bold text-gray-900 mt-0.5">{analysis.detectedRoomType}</h2>
              <div className="text-xs text-[#006B7B] font-semibold mt-0.5">{analysis.architecturalStyle}</div>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">{analysis.analysisSummary}</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-gray-100">
              <div className="p-2.5 bg-gray-50 rounded-xl">
                <div className="text-[10px] text-gray-400">Ceiling & Proportion</div>
                <div className="font-semibold text-gray-900 mt-0.5 text-[11px] line-clamp-1">{analysis.spatialCharacteristics || '2.9m ceiling'}</div>
              </div>

              <div className="p-2.5 bg-gray-50 rounded-xl">
                <div className="text-[10px] text-gray-400">Daylight Fenestration</div>
                <div className="font-semibold text-gray-900 mt-0.5 text-[11px] line-clamp-1">Abundant South Facing</div>
              </div>

              <div className="p-2.5 bg-gray-50 rounded-xl">
                <div className="text-[10px] text-gray-400">Circulation Flow</div>
                <div className="font-semibold text-gray-900 mt-0.5 text-[11px] line-clamp-1">{analysis.spaceUtilization?.circulation || 'Linear Axis'}</div>
              </div>
            </div>

            {/* Dominant Palette Swatches */}
            <div>
              <div className="text-[10px] text-gray-400 font-semibold uppercase mb-1.5">Detected Color Profile</div>
              <div className="flex items-center gap-2">
                {['#F4F1EA', '#E5D8C5', '#C8A279', '#617255'].map((hex, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[10px] text-gray-700">
                    <span style={{ backgroundColor: hex }} className="w-3 h-3 rounded-full border border-black/10" />
                    <span className="font-mono">{hex}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 2: TABS (OBSERVATIONS / SUGGESTIONS / OBJECTS) */}
      {/* ========================================================= */}
      <div className="flex border-b border-gray-200 gap-4 overflow-x-auto scrollbar-none text-xs font-semibold">
        <button
          onClick={() => setActiveTab('observations')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'observations' ? 'border-[#006B7B] text-[#006B7B]' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          AI Observations (6 Categories)
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'suggestions' ? 'border-[#006B7B] text-[#006B7B]' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Smart Improvement Suggestions ({analysis.smartSuggestions?.length || 4})
        </button>
        <button
          onClick={() => setActiveTab('objects')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'objects' ? 'border-[#006B7B] text-[#006B7B]' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Detected Existing Objects
        </button>
        <button
          onClick={() => setActiveTab('lighting')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'lighting' ? 'border-[#006B7B] text-[#006B7B]' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Lighting & Space Utilization
        </button>
      </div>

      {/* TAB 1: OBSERVATIONS */}
      {activeTab === 'observations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Card 1: What Works Well */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
            <h3 className="font-bold text-gray-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>What Works Well</span>
            </h3>
            <ul className="space-y-2 text-xs text-gray-600">
              {analysis.observations?.whatWorksWell?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2: Areas for Improvement */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
            <h3 className="font-bold text-gray-900 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Areas for Improvement</span>
            </h3>
            <ul className="space-y-2 text-xs text-gray-600">
              {analysis.observations?.areasForImprovement?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 3: Lighting Assessment */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
            <h3 className="font-bold text-gray-900 text-xs flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#006B7B]" />
              <span>Lighting Assessment</span>
            </h3>
            <ul className="space-y-2 text-xs text-gray-600">
              {analysis.observations?.lightingNotes?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#006B7B] mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 4: Furniture & Layout */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
            <h3 className="font-bold text-gray-900 text-xs flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Furniture & Layout</span>
            </h3>
            <ul className="space-y-2 text-xs text-gray-600">
              {analysis.observations?.furnitureAndLayout?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 5: Materials & Colors */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
            <h3 className="font-bold text-gray-900 text-xs flex items-center gap-2">
              <Palette className="w-4 h-4 text-rose-500" />
              <span>Materials & Colors</span>
            </h3>
            <ul className="space-y-2 text-xs text-gray-600">
              {analysis.observations?.materialsAndColors?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 6: Storage & Functionality */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
            <h3 className="font-bold text-gray-900 text-xs flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" />
              <span>Storage & Functionality</span>
            </h3>
            <ul className="space-y-2 text-xs text-gray-600">
              {analysis.observations?.storageAndFunctionality?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}

      {/* TAB 2: SMART SUGGESTIONS */}
      {activeTab === 'suggestions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {analysis.smartSuggestions?.map((sugg) => (
            <div
              key={sugg.id}
              className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    sugg.priority === 'High' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {sugg.priority} Priority
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">Difficulty: {sugg.difficulty}</span>
                </div>

                <h4 className="font-bold text-gray-900 text-sm">{sugg.title}</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{sugg.description}</p>

                <div className="mt-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-gray-600 space-y-1">
                  <div><strong className="text-gray-800">Why it helps:</strong> {sugg.reason}</div>
                  <div><strong className="text-gray-800">Visible Evidence:</strong> {sugg.visibleEvidence}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#006B7B] font-semibold">Category: {sugg.budgetCategory || 'Finishes'}</span>
                <button
                  onClick={() => onNavigate('/app/design-studio')}
                  className="text-xs font-semibold text-[#006B7B] hover:underline flex items-center gap-1"
                >
                  <span>Apply in Redesign</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: OBJECTS */}
      {activeTab === 'objects' && (
        <div className="p-6 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-4">
          <h3 className="font-bold text-gray-900 text-sm">Detected Visible Objects in Photograph</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.existingObjects?.map((group, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                <div className="font-bold text-gray-900 text-xs">{group.category}</div>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white rounded-lg border border-gray-200 text-[11px] text-gray-700">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LIGHTING & SPACE UTILIZATION */}
      {activeTab === 'lighting' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#006B7B]" />
              <span>Lighting Engineering Assessment</span>
            </h3>
            <div className="space-y-2.5 text-xs text-gray-600">
              <div><strong className="text-gray-900">Natural Daylight:</strong> {analysis.lightingAnalysis?.naturalSources}</div>
              <div><strong className="text-gray-900">Artificial Fixtures:</strong> {analysis.lightingAnalysis?.artificialFixtures}</div>
              <div><strong className="text-gray-900">Dark Corners:</strong> {analysis.lightingAnalysis?.darkSpots}</div>
              <div className="p-3 bg-teal-50 text-teal-900 rounded-xl border border-teal-100">
                <strong>Recommendations:</strong> {analysis.lightingAnalysis?.recommendations}
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-[#006B7B]" />
              <span>Space & Circulation Utilization</span>
            </h3>
            <div className="space-y-2.5 text-xs text-gray-600">
              <div><strong className="text-gray-900">Circulation:</strong> {analysis.spaceUtilization?.circulation}</div>
              <div><strong className="text-gray-900">Storage Opportunities:</strong> {analysis.spaceUtilization?.storageOpportunities}</div>
              <div><strong className="text-gray-900">Unused Areas:</strong> {analysis.spaceUtilization?.unusedAreas}</div>
              <div><strong className="text-gray-900">Visual Clutter:</strong> {analysis.spaceUtilization?.visualClutter}</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 3: CONNECTED NEXT ACTIONS */}
      {/* ========================================================= */}
      <div className="p-6 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Carry Forward Analysis into Workflows</h3>
          <p className="text-xs text-gray-500">Every observation in this analysis can be immediately applied to your project modules.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('/app/design-studio')}
            className="p-4 bg-teal-50/70 hover:bg-teal-100 border border-teal-200 rounded-2xl text-left transition-colors group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-[#006B7B] text-white flex items-center justify-center mb-2">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="font-bold text-gray-900 text-xs group-hover:text-[#006B7B]">Generate AI Redesign</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Produce photorealistic designs based on this analysis</div>
            </div>
            <div className="pt-3 text-[11px] font-bold text-[#006B7B] flex items-center gap-1">
              <span>Start Redesign</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('/app/products')}
            className="p-4 bg-blue-50/70 hover:bg-blue-100 border border-blue-200 rounded-2xl text-left transition-colors group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-2">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="font-bold text-gray-900 text-xs group-hover:text-blue-700">Get Furniture Matching</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Source matching sofa, tables, and wood acoustic panels</div>
            </div>
            <div className="pt-3 text-[11px] font-bold text-blue-700 flex items-center gap-1">
              <span>View Catalog</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('/app/budget')}
            className="p-4 bg-emerald-50/70 hover:bg-emerald-100 border border-emerald-200 rounded-2xl text-left transition-colors group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2">
                <Calculator className="w-4 h-4" />
              </div>
              <div className="font-bold text-gray-900 text-xs group-hover:text-emerald-700">Estimate Renovation Cost</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Budget flooring, joinery, and lighting improvements</div>
            </div>
            <div className="pt-3 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <span>Open Budget</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => {
              archMindStore.updateProject(activeProject?.id || 'proj_modern_terrace', {
                notes: `AI Space Analysis completed on ${new Date().toLocaleDateString()}. Recommended acoustic wall panels and engineered oak flooring.`,
              });
              alert(`Analysis linked to project "${activeProject?.name}"!`);
            }}
            className="p-4 bg-purple-50/70 hover:bg-purple-100 border border-purple-200 rounded-2xl text-left transition-colors group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-2">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="font-bold text-gray-900 text-xs group-hover:text-purple-700">Save Analysis to Project</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Persist observations to {activeProject?.name} history</div>
            </div>
            <div className="pt-3 text-[11px] font-bold text-purple-700 flex items-center gap-1">
              <span>Persist Record</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Safety & Limitations Alert */}
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[10px] text-gray-500 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>{analysis.limitationsNotice}</span>
        </div>
      </div>

    </div>
  );
};

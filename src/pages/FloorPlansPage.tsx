import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Maximize2,
  Check,
  ChevronRight,
  Info,
  Car,
  Bed,
  Bath,
  Layers,
  Users,
  Send,
  Plus,
  X,
  FileCheck,
  Download,
  Eye,
} from 'lucide-react';
import { archMindStore } from '../services/store';
import { FloorPlanConcept } from '../types';

interface FloorPlansPageProps {
  onNavigate: (route: string) => void;
}

export const FloorPlansPage: React.FC<FloorPlansPageProps> = ({ onNavigate }) => {
  const activeProject = archMindStore.getActiveProject();
  const concepts = archMindStore.getFloorPlans();

  // Plot Inputs
  const [plotShape, setPlotShape] = useState<'Rectangular' | 'Irregular' | 'Upload'>('Rectangular');
  const [plotWidth, setPlotWidth] = useState(40);
  const [plotLength, setPlotLength] = useState(60);
  const totalPlotArea = plotWidth * plotLength;

  // Planning Requirements
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(3);
  const [parkingSpaces, setParkingSpaces] = useState(2);
  const [floors, setFloors] = useState(2);
  const [familySize, setFamilySize] = useState('4–5 people');
  const [specialReqs, setSpecialReqs] = useState(['Open Kitchen', 'Study Room', 'Home Office']);
  const [planningNotes, setPlanningNotes] = useState(
    'North-facing entrance preferred. Open plan living and dining with garden courtyard view. High ceiling in living hall.'
  );

  // Active Floor Plan Concept selected
  const [selectedConceptId, setSelectedConceptId] = useState<string>(
    concepts[0]?.id || 'plan_concept_1'
  );
  const activeConcept = concepts.find((c) => c.id === selectedConceptId) || concepts[0];

  // Active floor preview level (0 = Ground Floor, 1 = First Floor)
  const [floorLevel, setFloorLevel] = useState<0 | 1>(0);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(
    'Please review this conceptual 2D floor plan for structural compliance and setback validation.'
  );
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const addSpecialReq = () => {
    const custom = prompt('Enter special room or planning requirement:');
    if (custom) setSpecialReqs((prev) => [...prev, custom]);
  };

  const removeSpecialReq = (item: string) => {
    setSpecialReqs((prev) => prev.filter((r) => r !== item));
  };

  const handleRequestReview = (e: React.FormEvent) => {
    e.preventDefault();
    archMindStore.submitInquiry({
      projectId: activeProject?.id || 'proj_modern_terrace',
      professionalId: 'prof_elena_rostova',
      clientName: archMindStore.getUser().name,
      clientEmail: archMindStore.getUser().email,
      clientPhone: '+60 12-345 6789',
      serviceRequested: `Floor Plan Architectural Review (${activeConcept?.name || 'Concept 1'})`,
      message: reviewMessage,
    });
    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setReviewModalOpen(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold text-[#006B7B] uppercase tracking-wider mb-0.5">
            Floor Plans & Planning
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171C2C] tracking-tight">
            Floor Plans & Planning
          </h1>
          <p className="text-xs text-[#667085] mt-1">
            Turn your plot and requirements into intelligent floor plan concepts.
          </p>
        </div>

        {/* Stepper */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-[#006B7B] font-semibold">
            <span className="w-5 h-5 rounded-full bg-[#006B7B] text-white text-[10px] flex items-center justify-center">1</span>
            <div>
              <div className="leading-tight">Plot & Requirements</div>
              <div className="text-[9px] text-gray-400 font-normal">Enter your details</div>
            </div>
          </div>
          <div className="w-4 h-0.5 bg-gray-200"></div>
          <div className="flex items-center gap-1.5 text-[#006B7B] font-semibold">
            <span className="w-5 h-5 rounded-full bg-[#006B7B] text-white text-[10px] flex items-center justify-center">2</span>
            <div>
              <div className="leading-tight">Generate Plans</div>
              <div className="text-[9px] text-gray-400 font-normal">Get AI concepts</div>
            </div>
          </div>
          <div className="w-4 h-0.5 bg-gray-200"></div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-[10px] flex items-center justify-center">3</span>
            <div>
              <div className="leading-tight">Compare & Refine</div>
              <div className="text-[9px] text-gray-400">Review options</div>
            </div>
          </div>
          <div className="w-4 h-0.5 bg-gray-200"></div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-[10px] flex items-center justify-center">4</span>
            <div>
              <div className="leading-tight">Professional Review</div>
              <div className="text-[9px] text-gray-400">Verify with experts</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TOP SECTION: PLOT DETAILS, REQUIREMENTS, PLANNING NOTES */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Card 1: Plot Details (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 text-xs flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-[#006B7B]" />
                <span>Plot Details</span>
              </h3>
              <span className="text-[11px] text-[#006B7B] hover:underline cursor-pointer">Need help? View guidelines →</span>
            </div>

            {/* Shape toggles */}
            <div className="flex gap-1.5 mb-4">
              {['Rectangular Plot', 'Irregular Plot', 'Upload Site Plan'].map((shape) => (
                <button
                  key={shape}
                  onClick={() => setPlotShape(shape.split(' ')[0] as any)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-colors ${
                    plotShape === shape.split(' ')[0]
                      ? 'bg-[#E4F3F4] text-[#006B7B] border border-teal-300 font-semibold shadow-2xs'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Plot Width (ft)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={plotWidth}
                    onChange={(e) => setPlotWidth(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:outline-none focus:border-[#006B7B]"
                  />
                  <span className="absolute right-3 top-2.5 text-[11px] text-gray-400">ft</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Plot Length (ft)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={plotLength}
                    onChange={(e) => setPlotLength(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:outline-none focus:border-[#006B7B]"
                  />
                  <span className="absolute right-3 top-2.5 text-[11px] text-gray-400">ft</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Plot Preview Box */}
          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/60 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-emerald-800 uppercase font-semibold">Total Plot Area</div>
              <div className="text-xl font-bold text-emerald-950 mt-0.5">
                {totalPlotArea.toLocaleString()} <span className="text-xs font-normal">sq ft</span>
              </div>
            </div>

            {/* Visual plot diagram */}
            <div className="relative w-28 h-20 bg-emerald-100/80 rounded-lg border-2 border-dashed border-emerald-400 flex items-center justify-center text-center">
              <span className="text-[10px] font-bold text-emerald-800">{plotWidth} ft × {plotLength} ft</span>
              <div className="absolute top-1 right-1 text-[8px] text-emerald-700 font-mono flex items-center">
                <span>N</span> ↑
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Planning Requirements (4 cols) */}
        <div className="lg:col-span-4 p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-xs">Planning Requirements</h3>
            <span className="text-[10px] text-gray-400">Quick Presets ▾</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[10px] text-gray-500 mb-1">Bedrooms</label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800"
              >
                {[2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n} Bedrooms</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-gray-500 mb-1">Bathrooms</label>
              <select
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} Bathrooms</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-gray-500 mb-1">Parking Spaces</label>
              <select
                value={parkingSpaces}
                onChange={(e) => setParkingSpaces(Number(e.target.value))}
                className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n} Cars</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-gray-500 mb-1">Number of Floors</label>
              <select
                value={floors}
                onChange={(e) => setFloors(Number(e.target.value))}
                className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800"
              >
                {[1, 2, 3].map((n) => (
                  <option key={n} value={n}>{n} Floors</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-gray-500 mb-1">Special Requirements</label>
            <div className="flex flex-wrap gap-1.5">
              {specialReqs.map((req) => (
                <span
                  key={req}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#E4F3F4] text-[#006B7B] rounded-lg text-[10px] font-semibold"
                >
                  <span>{req}</span>
                  <button onClick={() => removeSpecialReq(req)} className="hover:text-teal-900">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              <button
                onClick={addSpecialReq}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 rounded-lg text-[10px] text-gray-600"
              >
                <Plus className="w-3 h-3" />
                <span>Add more</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Planning Notes (3 cols) */}
        <div className="lg:col-span-3 p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-xs mb-1">Planning Notes</h3>
            <textarea
              rows={4}
              value={planningNotes}
              onChange={(e) => setPlanningNotes(e.target.value)}
              placeholder="Add any specific requirements, lifestyle preferences, or design ideas..."
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 leading-relaxed focus:bg-white focus:outline-none focus:border-[#006B7B]"
            />
          </div>

          <div className="text-[10px] text-gray-500 mt-2 space-y-1">
            <span className="font-semibold text-gray-700">Examples:</span>
            <div>• North-facing entrance preferred</div>
            <div>• Open plan living & dining</div>
            <div>• Garden or central courtyard</div>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 3 AI FLOOR PLAN CONCEPTS */}
      {/* ========================================================= */}
      <div className="space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Floor Plan Concepts</span>
            </h2>
            <p className="text-xs text-gray-500">Based on your plot and requirements, here are 3 layout concepts.</p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex bg-gray-100 p-0.5 rounded-xl text-xs font-medium text-gray-600">
              <button
                onClick={() => setFloorLevel(0)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  floorLevel === 0 ? 'bg-[#006B7B] text-white' : 'hover:text-gray-900'
                }`}
              >
                Ground Floor
              </button>
              <button
                onClick={() => setFloorLevel(1)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  floorLevel === 1 ? 'bg-[#006B7B] text-white' : 'hover:text-gray-900'
                }`}
              >
                First Floor
              </button>
            </div>

            <button
              onClick={() => alert('Gemini generating additional layout concepts matching setback restrictions...')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Generate More Concepts</span>
            </button>
          </div>
        </div>

        {/* Concepts 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {concepts.map((concept) => {
            const isSelected = concept.id === selectedConceptId;
            const currentPlan = floorLevel === 1 && concept.firstFloorPlan ? concept.firstFloorPlan : concept.groundFloorPlan;

            return (
              <div
                key={concept.id}
                onClick={() => setSelectedConceptId(concept.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-2 border-[#006B7B] bg-[#E4F3F4]/20 shadow-md ring-2 ring-teal-600/10'
                    : 'border-[#E6E9ED] bg-white hover:border-gray-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase">
                      Concept {concept.conceptNumber}
                    </span>
                    {concept.isRecommended && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                        ★ Recommended
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm">{concept.name}</h3>
                  <p className="text-[11px] text-gray-500 mb-3">{concept.tagline}</p>

                  {/* Interactive 2D SVG Blueprint */}
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 aspect-4/3 bg-[#F8FAFC] p-2 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 520 380">
                      {/* Grid background lines */}
                      <defs>
                        <pattern id={`grid_${concept.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#grid_${concept.id})`} />

                      {/* Rooms rendered deterministically from geometry data */}
                      {currentPlan?.rooms.map((room) => (
                        <g key={room.id} className="cursor-pointer group">
                          <rect
                            x={room.x}
                            y={room.y}
                            width={room.width}
                            height={room.height}
                            fill={room.color}
                            stroke="#475569"
                            strokeWidth="2"
                            rx="4"
                            className="group-hover:stroke-[#006B7B] group-hover:stroke-[3]"
                          />
                          <text
                            x={room.x + room.width / 2}
                            y={room.y + room.height / 2 + 4}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="600"
                            fill="#1E293B"
                          >
                            {room.name}
                          </text>
                        </g>
                      ))}
                    </svg>

                    <span className="absolute bottom-2 left-2 text-[10px] bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-2xs text-gray-600 font-mono">
                      {currentPlan?.floorName || 'Ground Floor'}
                    </span>
                  </div>

                  {/* Specs list */}
                  <div className="grid grid-cols-4 gap-1 text-[10px] text-gray-600 py-3 border-b border-gray-100 text-center">
                    <div>
                      <div className="font-bold text-gray-900">{concept.bedrooms}</div>
                      <div>Beds</div>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{concept.bathrooms}</div>
                      <div>Baths</div>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{concept.parkingSpaces}</div>
                      <div>Parking</div>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{concept.floors}</div>
                      <div>Floors</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Viewing technical geometric blueprint for ${concept.name}`);
                    }}
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('/app/design-studio');
                    }}
                    className="flex-1 py-2 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Customize
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* ========================================================= */}
      {/* BOTTOM SECTION: AREA CALCULATIONS, COMPARISON TABLE, NEXT STEPS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Area Calculations (Concept 1) (4 cols) */}
        <div className="lg:col-span-4 p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-xs">Area Calculations ({activeConcept?.name})</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100">
              <div className="text-[10px] text-[#006B7B] uppercase font-semibold">Built-up Area</div>
              <div className="text-xl font-bold text-[#004F5C] mt-0.5">
                {activeConcept?.builtUpArea?.toLocaleString()} sq ft
              </div>
              <div className="text-[10px] text-teal-700 mt-0.5">({activeConcept?.builtUpPercentage}% of plot)</div>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <div className="text-[10px] text-emerald-800 uppercase font-semibold">Open Space</div>
              <div className="text-xl font-bold text-emerald-950 mt-0.5">
                {activeConcept?.openSpaceArea?.toLocaleString()} sq ft
              </div>
              <div className="text-[10px] text-emerald-700 mt-0.5">({activeConcept?.openSpacePercentage}% of plot)</div>
            </div>
          </div>

          <div className="space-y-2 text-xs divide-y divide-gray-100 pt-1">
            <div className="flex justify-between pt-1">
              <span className="text-gray-500">Ground Floor Area</span>
              <span className="font-semibold text-gray-900">{activeConcept?.groundFloorArea} sq ft</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-gray-500">First Floor Area</span>
              <span className="font-semibold text-gray-900">{activeConcept?.firstFloorArea} sq ft</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-gray-500">Total Built-up Area</span>
              <span className="font-bold text-gray-900">{activeConcept?.builtUpArea} sq ft</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-gray-500">Open Space / Garden</span>
              <span className="font-semibold text-gray-900">{activeConcept?.openSpaceArea} sq ft</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-gray-500">Total Plot Area</span>
              <span className="font-bold text-gray-900">{activeConcept?.totalPlotArea} sq ft</span>
            </div>
          </div>
        </div>

        {/* Concept Comparison Table (4 cols) */}
        <div className="lg:col-span-4 p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-xs">Concept Comparison</h3>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF8] text-gray-500 text-[10px] uppercase font-semibold">
              <tr>
                <th className="p-2">Feature</th>
                <th className="p-2 text-center">Concept 1</th>
                <th className="p-2 text-center">Concept 2</th>
                <th className="p-2 text-center">Concept 3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[11px]">
              <tr>
                <td className="p-2 text-gray-600 font-medium">Built-up Area</td>
                <td className="p-2 text-center font-bold text-[#006B7B]">1,860 sq ft</td>
                <td className="p-2 text-center">1,920 sq ft</td>
                <td className="p-2 text-center">1,650 sq ft</td>
              </tr>
              <tr>
                <td className="p-2 text-gray-600 font-medium">Open Space</td>
                <td className="p-2 text-center font-semibold">540 sq ft</td>
                <td className="p-2 text-center">480 sq ft</td>
                <td className="p-2 text-center">750 sq ft</td>
              </tr>
              <tr>
                <td className="p-2 text-gray-600 font-medium">Bedrooms</td>
                <td className="p-2 text-center">3</td>
                <td className="p-2 text-center">3</td>
                <td className="p-2 text-center">3</td>
              </tr>
              <tr>
                <td className="p-2 text-gray-600 font-medium">Bathrooms</td>
                <td className="p-2 text-center">3</td>
                <td className="p-2 text-center">3</td>
                <td className="p-2 text-center">2</td>
              </tr>
              <tr>
                <td className="p-2 text-gray-600 font-medium">Parking</td>
                <td className="p-2 text-center">2</td>
                <td className="p-2 text-center">2</td>
                <td className="p-2 text-center">2</td>
              </tr>
              <tr>
                <td className="p-2 text-gray-600 font-medium">Floors</td>
                <td className="p-2 text-center">2</td>
                <td className="p-2 text-center">2</td>
                <td className="p-2 text-center">2</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Next Steps & Request Professional Review (4 cols) */}
        <div className="lg:col-span-4 p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-xs mb-3 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Next Steps</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-teal-100 text-[#006B7B] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <div>
                  <div className="font-semibold text-gray-900 text-[11px]">Review and select a concept</div>
                  <div className="text-[10px] text-gray-500">Choose your preferred floor plan direction</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-teal-100 text-[#006B7B] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <div>
                  <div className="font-semibold text-gray-900 text-[11px]">Refine with AI or customize</div>
                  <div className="text-[10px] text-gray-500">Adjust room dimensions and boundary setbacks</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-teal-100 text-[#006B7B] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <div>
                  <div className="font-semibold text-gray-900 text-[11px]">Get professional verification</div>
                  <div className="text-[10px] text-gray-500">Submit to registered architect for compliance</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-teal-100 text-[#006B7B] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                <div>
                  <div className="font-semibold text-gray-900 text-[11px]">Finalize construction drawings</div>
                  <div className="text-[10px] text-gray-500">Prepare MEP and structural blueprints</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-4">
            <button
              onClick={() => setReviewModalOpen(true)}
              className="w-full py-3 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Request Professional Review</span>
            </button>
            <div className="text-[9px] text-gray-400 text-center mt-1.5">
              AI conceptual layout. Not certified construction documentation.
            </div>
          </div>
        </div>

      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E6E9ED] overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
              <h3 className="font-bold text-gray-900 text-sm">Request Professional Review</h3>
              <button onClick={() => setReviewModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewSuccess ? (
              <div className="p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">Inquiry Transmitted!</h4>
                <p className="text-xs text-gray-500">
                  Your floor plan concept has been linked to Elena Rostova (Studio Forma Architecture) under project {activeProject?.name}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestReview} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Concept to Review</label>
                  <input
                    type="text"
                    disabled
                    value={`${activeConcept?.name} (${activeConcept?.builtUpArea} sq ft)`}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Assigned Architect</label>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80"
                      alt="Elena"
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">Elena Rostova</div>
                      <div className="text-[10px] text-gray-500">Studio Forma Architecture • 4.9 ★</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Message to Architect</label>
                  <textarea
                    rows={3}
                    value={reviewMessage}
                    onChange={(e) => setReviewMessage(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="px-3.5 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl font-medium text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl font-medium shadow-xs"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

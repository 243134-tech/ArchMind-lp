import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Bookmark,
  Layers,
  RefreshCw,
  Edit2,
  ChevronRight,
  Plus,
  X,
  Check,
  ShoppingBag,
  Calculator,
  Maximize2,
  Users,
  Sliders,
  CheckCircle2,
  Download,
  History,
  Clock,
  RotateCcw,
  Compass,
  Eye,
  Box,
  Orbit,
  ZoomIn,
  ZoomOut,
  Sun,
  Sunset,
  Moon,
  Info,
  Maximize,
  Minimize,
  Play,
  Pause,
  SlidersHorizontal,
  SplitSquareVertical,
  CheckCircle,
} from 'lucide-react';
import { archMindStore } from '../services/store';
import { aiService } from '../services/aiService';
import { DesignConcept, DesignVariation, DesignVersionHistory } from '../types';
import { formatINR } from '../utils/formatters';

interface DesignResultsPageProps {
  designId?: string;
  onNavigate: (route: string) => void;
}

export const DesignResultsPage: React.FC<DesignResultsPageProps> = ({
  designId = 'des_modern_living',
  onNavigate,
}) => {
  const [, setTick] = useState(0);
  useEffect(() => {
    return archMindStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const activeProject = archMindStore.getActiveProject();
  const designs = archMindStore.getDesigns();
  const currentDesign = designs.find((d) => d.id === designId) || designs[0];

  // Visual View Mode: Compare Slider, 3D Spatial Perspective, 360 Vision Tour
  const [viewMode, setViewMode] = useState<'compare' | '3d' | '360'>('compare');

  // Draggable slider state (percentage 0 to 100)
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D Spatial Perspective State
  const [tilt3D, setTilt3D] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [lightingMode, setLightingMode] = useState<'day' | 'sunset' | 'night'>('day');
  const [show3DDimensions, setShow3DDimensions] = useState(true);
  const [active3DHotspot, setActive3DHotspot] = useState<number | null>(null);

  // 360 Degree Vision State
  const [panYaw, setPanYaw] = useState<number>(35); // 0 to 360 degrees
  const [panPitch, setPanPitch] = useState<number>(0); // -25 to +25 degrees
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [autoRotate360, setAutoRotate360] = useState(true);
  const [zoom360, setZoom360] = useState<number>(1);
  const [active360Hotspot, setActive360Hotspot] = useState<string | null>(null);
  const [is360Fullscreen, setIs360Fullscreen] = useState(false);
  const panoContainerRef = useRef<HTMLDivElement>(null);

  // Selected variation
  const [selectedVarId, setSelectedVarId] = useState<string>(
    currentDesign?.selectedVariationId || currentDesign?.variations?.[0]?.id || 'var_natural_modern'
  );

  const selectedVariation =
    currentDesign?.variations?.find((v) => v.id === selectedVarId) ||
    currentDesign?.variations?.[0];

  // Refinement prompt state
  const [refinePrompt, setRefinePrompt] = useState(
    'Transform this empty living room into a modern, warm, and functional space with a natural and minimalist style, suitable for a family of 4.'
  );
  const [chips, setChips] = useState([
    'Natural Modern',
    'Oak Slat TV Wall',
    'Warm Cove Lighting',
    'Bouclé Sofa',
    'Terrace Greens',
  ]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [savedVersionToast, setSavedVersionToast] = useState(false);
  const [refinementSuccess, setRefinementSuccess] = useState<string | null>(null);
  const [showVersionModal, setShowVersionModal] = useState(false);

  const activeVersionNumber = currentDesign?.versionNumber || 1;

  // Image assets
  const beforeImage = currentDesign?.beforeImageUrl || '/assets/sample_room_before.jpg';
  const afterImage = selectedVariation?.imageUrl || currentDesign?.afterImageUrl || '/assets/sample_room_ai_recommended.jpg';
  const perspective3dImage = currentDesign?.perspective3dUrl || '/assets/sample_room_3d_perspective.jpg';
  const panorama360Image = currentDesign?.panorama360Url || '/assets/sample_room_360_panorama.jpg';

  // Slider drag listeners for Compare mode
  useEffect(() => {
    const handleUp = () => setIsDragging(false);
    const handleMove = (e: PointerEvent) => {
      if (isDragging && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        setSliderPos(Math.round((x / rect.width) * 100));
      }
    };
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointermove', handleMove);
    };
  }, [isDragging]);

  // Auto-rotation timer for 360 Vision Mode
  useEffect(() => {
    if (viewMode !== '360' || !autoRotate360 || isPanning) return;
    const interval = setInterval(() => {
      setPanYaw((prev) => (prev + 0.35) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [viewMode, autoRotate360, isPanning]);

  // 360 Pan Drag Listeners
  const handle360PointerDown = (e: React.PointerEvent) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (!isPanning) return;
    const handleMove = (e: PointerEvent) => {
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      setPanYaw((prev) => {
        let next = prev - deltaX * 0.25;
        if (next < 0) next += 360;
        return next % 360;
      });
      setPanPitch((prev) => Math.max(-25, Math.min(25, prev + deltaY * 0.15)));
      setPanStart({ x: e.clientX, y: e.clientY });
    };

    const handleUp = () => setIsPanning(false);

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [isPanning, panStart]);

  // 3D Mouse Parallax
  const handle3DMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt3D({ x: x * 10, y: y * -10 });
  };

  const handle3DMouseLeave = () => {
    setTilt3D({ x: 0, y: 0 });
  };

  // Chips manipulation
  const removeChip = (chipToRemove: string) => {
    setChips((prev) => prev.filter((c) => c !== chipToRemove));
  };

  const addChip = () => {
    const custom = prompt('Enter design constraint or style tag:');
    if (custom) setChips((prev) => [...prev, custom]);
  };

  // Real Conversational AI Refinement Pipeline
  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setRefinementSuccess(null);
    try {
      const fullPrompt = `${refinePrompt}. Design tags: ${chips.join(', ')}`;
      const result = await aiService.refineDesign({
        baseImageUrl: afterImage,
        refinementPrompt: fullPrompt,
        variationName: selectedVariation?.name || 'Refined Variation',
        currentVersionNumber: activeVersionNumber,
      });

      const nextVersionNum = result.newVersionNumber || (activeVersionNumber + 1);

      // Create new version entry
      const newVersionEntry: DesignVersionHistory = {
        id: `ver_${Date.now()}`,
        versionNumber: nextVersionNum,
        imageUrl: result.newImageUrl,
        prompt: fullPrompt,
        timestamp: new Date().toISOString(),
        variationName: selectedVariation?.name || 'Refined Concept',
        notes: result.refinedNotes,
      };

      const updatedVersions = [
        ...(currentDesign?.versionHistory || []),
        newVersionEntry,
      ];

      const updatedVariations = currentDesign?.variations?.map((v) =>
        v.id === selectedVarId ? { ...v, imageUrl: result.newImageUrl } : v
      ) || [];

      archMindStore.updateDesign(currentDesign.id, {
        afterImageUrl: result.newImageUrl,
        variations: updatedVariations,
        versionHistory: updatedVersions,
        versionNumber: nextVersionNum,
        designNotes: `${currentDesign.designNotes}\n\n[Version ${nextVersionNum}]: ${result.refinedNotes}`,
      });

      setRefinementSuccess(`Version ${nextVersionNum} created & saved successfully!`);
      setTimeout(() => setRefinementSuccess(null), 4500);
    } catch (err) {
      console.error('Refinement failed:', err);
      alert('Design refinement encountered a network error. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSaveVersion = () => {
    const existing = currentDesign?.versionHistory?.some((v) => v.imageUrl === afterImage);
    if (!existing) {
      const newVer = (currentDesign?.versionNumber || 1) + 1;
      const newHistory: DesignVersionHistory[] = [
        ...(currentDesign?.versionHistory || []),
        {
          id: `ver_${Date.now()}`,
          versionNumber: newVer,
          imageUrl: afterImage,
          prompt: refinePrompt,
          timestamp: new Date().toISOString(),
          variationName: selectedVariation?.name || 'Saved Concept',
          notes: 'Saved explicitly by user.',
        },
      ];
      archMindStore.updateDesign(currentDesign.id, {
        versionHistory: newHistory,
        versionNumber: newVer,
      });
    }
    setSavedVersionToast(true);
    setTimeout(() => setSavedVersionToast(false), 3000);
  };

  const handleRestoreVersion = (version: DesignVersionHistory) => {
    const updatedVariations = currentDesign?.variations?.map((v) =>
      v.id === selectedVarId ? { ...v, imageUrl: version.imageUrl } : v
    ) || [];

    archMindStore.updateDesign(currentDesign.id, {
      afterImageUrl: version.imageUrl,
      variations: updatedVariations,
      versionNumber: version.versionNumber,
    });
    setShowVersionModal(false);
    setSavedVersionToast(true);
    setTimeout(() => setSavedVersionToast(false), 3000);
  };

  const handleDownload = () => {
    const currentActiveUrl =
      viewMode === '3d'
        ? perspective3dImage
        : viewMode === '360'
        ? panorama360Image
        : afterImage;

    const a = document.createElement('a');
    a.href = currentActiveUrl;
    a.download = `ArchMind-${selectedVariation?.name || 'Design'}-${viewMode}-v${activeVersionNumber}.jpg`;
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.click();
  };

  // 3D Spatial Hotspots Data
  const hotspots3D = [
    {
      id: 1,
      x: 82,
      y: 46,
      title: 'Acoustic White Oak Slats',
      category: 'Wall Finish & Audio',
      spec: '45mm × 20mm timber profiles on recycled felt backing. Includes concealed conduit channel & Samsung Frame 65" 4K TV.',
    },
    {
      id: 2,
      x: 27,
      y: 69,
      title: 'Luna Modular L-Sectional',
      category: 'Furniture & Seating',
      spec: 'High-resilience foam core with hypoallergenic goose-down layer, draped in spill-resistant sand textured bouclé fabric.',
    },
    {
      id: 3,
      x: 51,
      y: 73,
      title: 'Riva Fluted Oak Coffee Table',
      category: 'Tables & Decor',
      spec: 'Hand-turned solid oak fluted drum base with satin waterproof matte seal and organic stoneware styling tray.',
    },
    {
      id: 4,
      x: 48,
      y: 16,
      title: 'Architectural LED Cove Lighting',
      category: 'Ceiling & Lighting',
      spec: 'Gypsum drop ceiling tray with dual-color 2700K–3200K dimmable LED ribbons (95+ CRI high visual comfort).',
    },
    {
      id: 5,
      x: 18,
      y: 44,
      title: 'Triple Glazed Balcony Sliders',
      category: 'Glazing & Fenestration',
      spec: 'Thermal-break architectural matte black aluminum sliders with acoustic laminated glass overlooking terrace palms.',
    },
  ];

  // 360 Spatial Hotspots Data (Mapped to yaw azimuths)
  const hotspots360 = [
    {
      id: 'oak_wall',
      azimuth: 15,
      title: 'Oak Slat TV Wall & Media Unit',
      category: 'Custom Joinery',
      description: 'Full height acoustic timber battens with warm backlighting and floating walnut credenza.',
    },
    {
      id: 'sofa_zone',
      azimuth: 85,
      title: 'Bouclé Sectional & Coffee Table',
      category: 'Living Room Core',
      description: 'L-shaped seating oriented toward the panoramic outdoor balcony view.',
    },
    {
      id: 'balcony_view',
      azimuth: 295,
      title: 'Private Garden Balcony Deck',
      category: 'Terrace & Outdoors',
      description: 'Direct step-out access to landscaped planters and lush greenery.',
    },
    {
      id: 'cove_ceiling',
      azimuth: 180,
      title: 'Recessed Gypsum Cove Tray',
      category: 'Ambient Lighting',
      description: 'Diffused perimeter illumination creating floating ceiling depth.',
    },
  ];

  // Compass direction label
  const getCompassHeading = (yaw: number) => {
    if (yaw >= 315 || yaw < 45) return 'East (Feature Wall)';
    if (yaw >= 45 && yaw < 135) return 'South (Living Lounge)';
    if (yaw >= 135 && yaw < 225) return 'West (Dining Suite)';
    return 'North (Terrace Balcony)';
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#667085] mb-1">
            <span
              onClick={() => onNavigate('/app/design-studio')}
              className="hover:text-[#006B7B] cursor-pointer"
            >
              AI Design Studio
            </span>
            <span>›</span>
            <span className="text-[#006B7B] font-semibold">Design Results</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171C2C] tracking-tight">
            Design Results &amp; Spatial Views
          </h1>
          <p className="text-xs text-[#667085] mt-1">
            Transform raw spaces into architectural reality. Switch between 2D comparison, 3D spatial cutaway, and 360° VR vision.
          </p>
        </div>

        {/* Project Badge & Actions */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2.5 p-1.5 pr-3 bg-white rounded-2xl border border-[#E6E9ED] shadow-2xs">
            <img
              src={activeProject?.coverImage || '/assets/sample_room_ai_recommended.jpg'}
              alt="Project"
              className="w-8 h-8 rounded-xl object-cover"
            />
            <div className="text-left text-xs">
              <div className="font-semibold text-gray-900">{activeProject?.name}</div>
              <div className="text-[10px] text-gray-500">{activeProject?.location}</div>
            </div>
          </div>

          <button
            onClick={() => setShowVersionModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E6E9ED] hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-medium transition-colors shadow-2xs"
            title="View design versions and rollback"
          >
            <History className="w-4 h-4 text-[#006B7B]" />
            <span className="font-semibold text-[#006B7B]">v{activeVersionNumber}</span>
            <span className="hidden sm:inline text-gray-500">
              ({currentDesign?.versionHistory?.length || 1})
            </span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E6E9ED] hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-medium transition-colors shadow-2xs"
            title="Download rendered design"
          >
            <Download className="w-4 h-4 text-gray-600" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={handleSaveVersion}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Bookmark className="w-4 h-4" />
            <span>Save Version</span>
          </button>
        </div>
      </div>

      {/* Refinement Success Toast Notice */}
      {refinementSuccess && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-900 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-[#006B7B] shrink-0" />
          <span>{refinementSuccess}</span>
        </div>
      )}

      {/* Save Toast Notice */}
      {savedVersionToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Design version saved to project **{activeProject?.name}**! Accessible anytime in project designs.</span>
        </div>
      )}

      {/* Main Grid: Left Spatial Viewer + Variations (8 cols), Right Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================= */}
        {/* LEFT SECTION (8 cols): 3-IN-1 SPATIAL VIEWER */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* VIEW MODE TOOLBAR */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded-2xl border border-[#E6E9ED] shadow-2xs">
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setViewMode('compare')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'compare'
                    ? 'bg-white text-[#006B7B] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <SplitSquareVertical className="w-3.5 h-3.5" />
                <span>Before / After Split</span>
              </button>

              <button
                onClick={() => setViewMode('3d')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === '3d'
                    ? 'bg-white text-[#006B7B] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Box className="w-3.5 h-3.5 text-blue-600" />
                <span>3D Spatial Perspective</span>
              </button>

              <button
                onClick={() => setViewMode('360')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === '360'
                    ? 'bg-white text-[#006B7B] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Orbit className="w-3.5 h-3.5 text-teal-600" />
                <span>360° Vision VR Tour</span>
              </button>
            </div>

            {/* Quick helper tag */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#006B7B]" />
              <span>Sample Room: 320 sqft Living Hall</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 1. COMPARE MODE: BEFORE / AFTER DRAGGABLE SLIDER */}
          {/* ========================================================= */}
          {viewMode === 'compare' && (
            <div className="space-y-3">
              <div
                ref={containerRef}
                onPointerDown={() => setIsDragging(true)}
                className="relative rounded-3xl overflow-hidden aspect-16/10 sm:aspect-16/9 bg-gray-950 shadow-md border border-[#E6E9ED] select-none cursor-ew-resize group"
              >
                {/* After Image (Full Background) */}
                <img
                  src={afterImage}
                  alt="After AI Design"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                <span className="absolute top-4 right-4 z-10 px-3 py-1 bg-black/75 backdrop-blur-md text-white text-xs font-bold rounded-xl shadow-xs">
                  AI Recommended Living Room
                </span>

                {/* Before Image (Clipped Left Layer) */}
                <div
                  style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                >
                  <img
                    src={beforeImage}
                    alt="Before Space"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/75 backdrop-blur-md text-white text-xs font-bold rounded-xl shadow-xs">
                    Sample Room (Raw Empty)
                  </span>
                </div>

                {/* Draggable Divider Bar & Handle */}
                <div
                  style={{ left: `${sliderPos}%` }}
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl pointer-events-none z-20"
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center text-gray-800 border-2 border-[#006B7B]">
                    <div className="flex items-center gap-0.5 text-xs font-black text-[#006B7B]">
                      <span>‹</span>
                      <span>›</span>
                    </div>
                  </div>
                </div>

                {/* Hint overlay on hover */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/70 backdrop-blur-xs text-white/90 text-[10px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  Drag left or right to compare transformation
                </div>
              </div>

              {/* Slider Quick Buttons */}
              <div className="flex items-center justify-between text-xs px-1 text-gray-500">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSliderPos(0)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                      sliderPos === 0 ? 'bg-[#006B7B] text-white border-[#006B7B]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    100% AI Design
                  </button>
                  <button
                    onClick={() => setSliderPos(50)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                      sliderPos === 50 ? 'bg-[#006B7B] text-white border-[#006B7B]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    50 / 50 Split
                  </button>
                  <button
                    onClick={() => setSliderPos(100)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                      sliderPos === 100 ? 'bg-[#006B7B] text-white border-[#006B7B]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    100% Raw Before
                  </button>
                </div>
                <span className="font-mono text-[11px]">Split: {sliderPos}%</span>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. 3D SPATIAL PERSPECTIVE CUTAWAY MODE */}
          {/* ========================================================= */}
          {viewMode === '3d' && (
            <div className="space-y-3">
              <div
                onMouseMove={handle3DMouseMove}
                onMouseLeave={handle3DMouseLeave}
                className="relative rounded-3xl overflow-hidden aspect-16/10 sm:aspect-16/9 bg-[#0B132B] shadow-xl border border-slate-700 perspective-[1200px] select-none cursor-crosshair group"
              >
                {/* 3D Perspective Transforming Layer */}
                <div
                  style={{
                    transform: `rotateY(${tilt3D.x}deg) rotateX(${tilt3D.y}deg) scale(1.02)`,
                    transition: 'transform 0.15s ease-out',
                  }}
                  className="relative w-full h-full"
                >
                  <img
                    src={perspective3dImage}
                    alt="3D Spatial Perspective View"
                    className="w-full h-full object-cover"
                  />

                  {/* Lighting Simulation Overlay */}
                  {lightingMode === 'sunset' && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/25 via-rose-500/15 to-transparent pointer-events-none mix-blend-color-dodge"></div>
                  )}
                  {lightingMode === 'night' && (
                    <div className="absolute inset-0 bg-slate-950/40 pointer-events-none mix-blend-multiply"></div>
                  )}

                  {/* 3D Hotspot Pins */}
                  {hotspots3D.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => setActive3DHotspot(active3DHotspot === h.id ? null : h.id)}
                      style={{ left: `${h.x}%`, top: `${h.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group/pin"
                      title={h.title}
                    >
                      <span className="relative flex h-6 w-6 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-[#006B7B] border-2 border-white shadow-md text-white text-[9px] font-bold items-center justify-center">
                          {h.id}
                        </span>
                      </span>

                      {/* Tooltip on Hover */}
                      <span className="absolute bottom-7 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-black/85 backdrop-blur-md text-white text-[10px] font-semibold rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none">
                        {h.title}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Overlaid 3D View Controls */}
                <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-white text-xs font-bold rounded-xl shadow-xs border border-white/10 flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5 text-blue-400" />
                    <span>3D Spatial Axonometric View</span>
                  </span>
                  <span className="px-2.5 py-1 bg-teal-900/80 backdrop-blur-md text-teal-200 text-[11px] font-mono rounded-xl border border-teal-500/20">
                    Tilt: {tilt3D.x.toFixed(1)}° / {tilt3D.y.toFixed(1)}°
                  </span>
                </div>

                {/* Lighting Control Switcher */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-black/75 backdrop-blur-md p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setLightingMode('day')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      lightingMode === 'day' ? 'bg-[#006B7B] text-white' : 'text-gray-300 hover:text-white'
                    }`}
                    title="Natural Daylight"
                  >
                    <Sun className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setLightingMode('sunset')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      lightingMode === 'sunset' ? 'bg-amber-600 text-white' : 'text-gray-300 hover:text-white'
                    }`}
                    title="Golden Hour Sunset"
                  >
                    <Sunset className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setLightingMode('night')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      lightingMode === 'night' ? 'bg-indigo-700 text-white' : 'text-gray-300 hover:text-white'
                    }`}
                    title="Night Ambient Cove Lights"
                  >
                    <Moon className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Bottom Dimension Indicator */}
                <div className="absolute bottom-3 left-4 z-20 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-[11px] flex items-center gap-3 font-mono">
                  <span>Room A: <strong>320 sq.ft.</strong></span>
                  <span>•</span>
                  <span>Ceiling: <strong>11'0" Clearance</strong></span>
                  <span>•</span>
                  <span>Wall Length: <strong>18'8"</strong></span>
                </div>
              </div>

              {/* Selected Hotspot Detail Card */}
              {active3DHotspot && (
                <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-xs animate-in fade-in flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#006B7B] text-white flex items-center justify-center text-[10px] font-bold">
                        {active3DHotspot}
                      </span>
                      <span className="font-bold text-gray-900 text-sm">
                        {hotspots3D.find((h) => h.id === active3DHotspot)?.title}
                      </span>
                      <span className="px-2 py-0.5 bg-teal-100 text-[#006B7B] rounded text-[10px] font-bold uppercase">
                        {hotspots3D.find((h) => h.id === active3DHotspot)?.category}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-xs">
                      {hotspots3D.find((h) => h.id === active3DHotspot)?.spec}
                    </p>
                  </div>
                  <button
                    onClick={() => setActive3DHotspot(null)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. 360 DEGREE VISION VR TOUR MODE */}
          {/* ========================================================= */}
          {viewMode === '360' && (
            <div className="space-y-3">
              <div
                ref={panoContainerRef}
                onPointerDown={handle360PointerDown}
                className={`relative rounded-3xl overflow-hidden aspect-16/10 sm:aspect-16/9 bg-black shadow-xl border border-slate-700 select-none cursor-grab active:cursor-grabbing group ${
                  is360Fullscreen ? 'fixed inset-0 z-50 rounded-none aspect-auto' : ''
                }`}
              >
                {/* Seamless 360 Equirectangular Viewport */}
                <div
                  style={{
                    backgroundImage: `url(${panorama360Image})`,
                    backgroundPosition: `${(panYaw / 360) * 100}% ${50 + panPitch}%`,
                    backgroundSize: `${zoom360 * 220}% auto`,
                    backgroundRepeat: 'repeat-x',
                  }}
                  className="w-full h-full transition-[background-position] duration-75"
                ></div>

                {/* Top Control Bar */}
                <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-white text-xs font-bold rounded-xl shadow-xs border border-white/10 flex items-center gap-1.5">
                    <Orbit className="w-3.5 h-3.5 text-teal-400" />
                    <span>360° Vision VR Tour</span>
                  </span>

                  <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md text-teal-300 text-xs font-mono rounded-xl border border-white/10 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-teal-400" />
                    <span>{getCompassHeading(panYaw)} ({Math.round(panYaw)}°)</span>
                  </span>
                </div>

                {/* Right Floating Quick Tools */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10 text-white text-xs">
                  {/* Auto Rotate Toggle */}
                  <button
                    onClick={() => setAutoRotate360(!autoRotate360)}
                    className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                      autoRotate360 ? 'bg-[#006B7B] text-white' : 'hover:bg-white/10 text-gray-300'
                    }`}
                    title={autoRotate360 ? 'Pause Auto Orbit' : 'Resume Auto Orbit'}
                  >
                    {autoRotate360 ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span className="text-[10px] hidden sm:inline">{autoRotate360 ? 'Orbiting' : 'Orbit'}</span>
                  </button>

                  {/* Zoom In / Out */}
                  <button
                    onClick={() => setZoom360((z) => Math.min(1.8, z + 0.2))}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoom360((z) => Math.max(0.8, z - 0.2))}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>

                  {/* Fullscreen Toggle */}
                  <button
                    onClick={() => setIs360Fullscreen(!is360Fullscreen)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    title="Toggle Fullscreen"
                  >
                    {is360Fullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* 360 Hotspots Floating Bar */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-wrap gap-1.5 bg-black/85 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 max-w-[90%] overflow-x-auto scrollbar-none">
                  {hotspots360.map((h) => (
                    <button
                      key={h.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPanYaw(h.azimuth);
                        setActive360Hotspot(h.id);
                      }}
                      className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        active360Hotspot === h.id
                          ? 'bg-[#006B7B] text-white shadow-xs'
                          : 'bg-white/10 text-gray-200 hover:bg-white/20'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-teal-300" />
                      <span>{h.title}</span>
                    </button>
                  ))}
                </div>

                {/* Instruction Badge */}
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 backdrop-blur-xs text-white/80 text-[10px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  Click and drag in any direction to look 360° around the space
                </div>
              </div>

              {/* 360 Hotspot Active Description */}
              {active360Hotspot && (
                <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-xs animate-in fade-in flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-gray-900 text-sm">
                      {hotspots360.find((h) => h.id === active360Hotspot)?.title}
                    </span>
                    <span className="ml-2 px-2 py-0.5 bg-teal-100 text-[#006B7B] rounded text-[10px] font-bold uppercase">
                      {hotspots360.find((h) => h.id === active360Hotspot)?.category}
                    </span>
                    <p className="text-gray-700 leading-relaxed text-xs mt-1">
                      {hotspots360.find((h) => h.id === active360Hotspot)?.description}
                    </p>
                  </div>
                  <button onClick={() => setActive360Hotspot(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* DESIGN VARIATIONS CARDS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Design Variations</h3>
                <p className="text-[11px] text-gray-500">Explore different design directions generated from your prompt.</p>
              </div>
              <span className="text-[11px] text-[#006B7B] font-medium hover:underline cursor-pointer flex items-center gap-1">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {currentDesign?.variations?.map((v) => {
                const isSelected = v.id === selectedVarId;
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVarId(v.id)}
                    className={`p-2 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-2 border-[#006B7B] bg-[#E4F3F4]/30 shadow-xs ring-2 ring-teal-600/10'
                        : 'border-[#E6E9ED] bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="relative rounded-xl overflow-hidden aspect-4/3 mb-2 bg-gray-100">
                      <img src={v.imageUrl} alt={v.name} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#006B7B] text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-gray-900 text-xs truncate">{v.name}</div>
                    <div className="text-[10px] text-gray-500 truncate">{v.tagline}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STYLE & BUDGET SUMMARY (IN INDIAN RUPEES) */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#006B7B]"></span>
              <h3 className="font-bold text-gray-900 text-xs">Style &amp; Budget Summary</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
              
              {/* Left: Design Style */}
              <div className="flex items-start gap-3 p-3 bg-gray-50/70 rounded-xl border border-gray-100">
                <img
                  src={selectedVariation?.imageUrl || afterImage}
                  alt="Style thumbnail"
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase">Design Style</div>
                  <div className="font-bold text-gray-900 text-xs">{selectedVariation?.name}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">
                    A warm, contemporary look with natural materials, clean lines and a cozy atmosphere.
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {['Modern', 'Minimalist', 'Natural', 'Warm'].map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 bg-white rounded-md border border-gray-200 text-gray-600 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Estimated Budget */}
              <div className="p-3 bg-gray-50/70 rounded-xl border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase">Estimated Budget (₹ INR)</div>
                  <div className="text-base font-bold text-gray-900 font-serif">
                    {formatINR(currentDesign?.estimatedBudget || 2350000)} <span className="text-xs font-normal text-gray-500 font-sans">for this room</span>
                  </div>
                </div>

                {/* Multi-segment Bar */}
                <div className="my-2 h-2.5 rounded-full overflow-hidden flex bg-gray-200">
                  <div style={{ width: '42%' }} className="bg-[#0284C7]" title="Furniture 42%"></div>
                  <div style={{ width: '18%' }} className="bg-[#EAB308]" title="Fixtures 18%"></div>
                  <div style={{ width: '15%' }} className="bg-[#F43F5E]" title="Decor 15%"></div>
                  <div style={{ width: '25%' }} className="bg-[#8B5CF6]" title="Renovation 25%"></div>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-600">
                  <div className="flex items-center justify-between pr-2">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#0284C7]"></span> Furniture</span>
                    <span className="font-semibold text-gray-900 font-mono">{formatINR(987000, { compact: true })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#EAB308]"></span> Fixtures</span>
                    <span className="font-semibold text-gray-900 font-mono">{formatINR(423000, { compact: true })}</span>
                  </div>
                  <div className="flex items-center justify-between pr-2">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#F43F5E]"></span> Decor</span>
                    <span className="font-semibold text-gray-900 font-mono">{formatINR(352000, { compact: true })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span> Renovation</span>
                    <span className="font-semibold text-gray-900 font-mono">{formatINR(588000, { compact: true })}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RECOMMENDED NEXT ACTIONS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Recommended Next Actions</span>
                </h3>
                <p className="text-[11px] text-gray-500">Turn this design into reality with these connected next steps.</p>
              </div>
              <span className="text-[11px] text-[#006B7B] font-medium hover:underline cursor-pointer">View All</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Action 1: Products */}
              <div
                onClick={() => onNavigate('/app/products')}
                className="p-3.5 bg-white hover:bg-[#E4F3F4]/30 rounded-2xl border border-[#E6E9ED] shadow-xs cursor-pointer transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#006B7B] flex items-center justify-center mb-2">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-gray-900 text-xs group-hover:text-[#006B7B]">Find Similar Products</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Discover furniture and decor like this design</div>
                </div>
                <div className="pt-3 text-[11px] font-semibold text-[#006B7B] flex items-center gap-1">
                  <span>Browse catalog</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Action 2: Budget */}
              <div
                onClick={() => onNavigate('/app/budget')}
                className="p-3.5 bg-white hover:bg-[#E4F3F4]/30 rounded-2xl border border-[#E6E9ED] shadow-xs cursor-pointer transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-gray-900 text-xs group-hover:text-[#006B7B]">Estimate Cost</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Get a detailed cost estimate for this design</div>
                </div>
                <div className="pt-3 text-[11px] font-semibold text-[#006B7B] flex items-center gap-1">
                  <span>Open Budget</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Action 3: Floor Plans */}
              <div
                onClick={() => onNavigate('/app/floor-plans')}
                className="p-3.5 bg-white hover:bg-[#E4F3F4]/30 rounded-2xl border border-[#E6E9ED] shadow-xs cursor-pointer transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-gray-900 text-xs group-hover:text-[#006B7B]">Generate Floor Plan</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Visualize the layout with this design</div>
                </div>
                <div className="pt-3 text-[11px] font-semibold text-[#006B7B] flex items-center gap-1">
                  <span>View Blueprints</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Action 4: Professionals */}
              <div
                onClick={() => onNavigate('/app/professionals')}
                className="p-3.5 bg-white hover:bg-[#E4F3F4]/30 rounded-2xl border border-[#E6E9ED] shadow-xs cursor-pointer transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-gray-900 text-xs group-hover:text-[#006B7B]">Find Professionals</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Connect with interior designers and contractors</div>
                </div>
                <div className="pt-3 text-[11px] font-semibold text-[#006B7B] flex items-center gap-1">
                  <span>Get Quotations</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* RIGHT SIDEBAR (4 cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Card 1: Design Prompt & Refinement */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#006B7B]" />
              <h3 className="font-bold text-gray-900 text-xs">Design Prompt &amp; Refinement</h3>
            </div>

            <div className="relative">
              <textarea
                rows={3}
                value={refinePrompt}
                onChange={(e) => setRefinePrompt(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B] text-xs text-gray-900 leading-relaxed"
              />
              <span className="absolute bottom-2 right-2 text-[10px] text-gray-400 font-mono">
                {refinePrompt.length}/500
              </span>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-[11px] font-medium"
                >
                  <span>{chip}</span>
                  <button onClick={() => removeChip(chip)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={addChip}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 rounded-lg text-[11px] text-gray-600"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1 hover:text-gray-800 cursor-pointer">
                <Sliders className="w-3.5 h-3.5" />
                <span>Advanced Options</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>

            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="w-full py-2.5 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Designs'}</span>
            </button>
          </div>

          {/* Card 2: Design Notes */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-xs">Design Notes</h3>
              <button className="text-[11px] text-[#006B7B] hover:underline flex items-center gap-1">
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {currentDesign?.designNotes}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {['Open and airy', 'Family friendly', 'Natural materials', 'Neutral color palette'].map((t) => (
                <span key={t} className="text-[10px] px-2 py-1 bg-gray-50 border border-gray-200 text-gray-600 rounded-md font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Card 3: Materials & Furnishings */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-xs">Materials &amp; Furnishings</h3>
              <span
                onClick={() => onNavigate('/app/products')}
                className="text-[11px] text-[#006B7B] hover:underline cursor-pointer"
              >
                View All
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { name: 'Sofa & Seating', count: '4 items', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=80&q=80' },
                { name: 'Tables & Storage', count: '6 items', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=80&q=80' },
                { name: 'Lighting Fixtures', count: '5 items', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=80&q=80' },
                { name: 'Rugs & Textiles', count: '4 items', image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=80&q=80' },
                { name: 'Plants & Decor', count: '7 items', image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=80&q=80' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigate('/app/products')}
                  className="p-2 bg-gray-50/60 hover:bg-[#E4F3F4]/50 rounded-xl border border-gray-100 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <div className="font-semibold text-gray-900 text-xs">{item.name}</div>
                      <div className="text-[10px] text-gray-400">{item.count}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* VERSION HISTORY MODAL */}
      {showVersionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#006B7B] flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Design Version History</h3>
                  <p className="text-[11px] text-gray-500">
                    Track AI generations and restore any previous version.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowVersionModal(false)}
                className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 pr-1 flex-1">
              {currentDesign?.versionHistory && currentDesign.versionHistory.length > 0 ? (
                currentDesign.versionHistory.map((ver) => {
                  const isCurrent = ver.versionNumber === activeVersionNumber;
                  return (
                    <div
                      key={ver.id}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between ${
                        isCurrent
                          ? 'bg-[#E4F3F4]/30 border-[#006B7B] ring-1 ring-[#006B7B]/20'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={ver.imageUrl}
                          alt={`Version ${ver.versionNumber}`}
                          className="w-16 h-12 rounded-lg object-cover border border-gray-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-xs">
                              Version {ver.versionNumber}
                            </span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.5 bg-[#006B7B] text-white text-[9px] font-bold rounded">
                                Active
                              </span>
                            )}
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(ver.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-1 max-w-sm">
                            {ver.prompt}
                          </p>
                          {ver.notes && (
                            <p className="text-[10px] text-[#006B7B] mt-0.5 italic">
                              {ver.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                        {!isCurrent && (
                          <button
                            onClick={() => handleRestoreVersion(ver)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-[#006B7B] hover:text-white text-gray-700 text-[11px] font-semibold rounded-lg transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Restore</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-xs text-gray-500">
                  No previous iterations recorded yet.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end">
              <button
                onClick={() => setShowVersionModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

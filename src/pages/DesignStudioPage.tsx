import React, { useState } from 'react';
import {
  Upload,
  Sparkles,
  Play,
  Info,
  Check,
  Plus,
  X,
  ChevronRight,
  Lightbulb,
  Loader2,
  Armchair,
  Home,
  Sliders,
  DollarSign,
  Coffee,
  Tv,
  Briefcase,
  Users,
  Archive,
  BookOpen,
  Heart,
  Dog,
  Activity,
  Smile,
  Utensils,
  RefreshCw,
} from 'lucide-react';
import { archMindStore } from '../services/store';
import { aiService } from '../services/aiService';
import { DesignStyle, RoomType, ColorPreference } from '../types';

interface DesignStudioPageProps {
  onNavigate: (route: string) => void;
}

export const DesignStudioPage: React.FC<DesignStudioPageProps> = ({ onNavigate }) => {
  const activeProject = archMindStore.getActiveProject();

  // Step 1: Space Photo
  const [photoPreview, setPhotoPreview] = useState<string>(
    '/assets/sample_room_before.jpg'
  );
  const [isUploading, setIsUploading] = useState(false);

  // Step 2: Room Type
  const [roomType, setRoomType] = useState<RoomType>('Living Room');

  // Step 3: Design Style
  const [selectedStyles, setSelectedStyles] = useState<DesignStyle[]>(['Modern']);

  // Step 4: Color Preferences
  const [selectedColors, setSelectedColors] = useState<ColorPreference[]>(['Neutral', 'Earth Tones']);

  // Step 5: Budget Range
  const [budgetMin, setBudgetMin] = useState(10000);
  const [budgetMax, setBudgetMax] = useState(30000);

  // Step 6: Functional Needs
  const [functionalNeeds, setFunctionalNeeds] = useState<string[]>([
    'Relaxation',
    'Storage',
    'Family time',
  ]);

  // Step 7: Items to Retain
  const [itemsToRetain, setItemsToRetain] = useState<string[]>(['Sofa', 'Plants']);

  // Step 8: Additional Instructions
  const [additionalNotes, setAdditionalNotes] = useState(
    'I want a bright, airy living room with more storage, a cozy reading nook, and a modern but warm feel. Consider my love for natural materials and plants.'
  );

  // AI Pipeline Execution States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  const roomTypes: RoomType[] = [
    'Living Room',
    'Bedroom',
    'Kitchen',
    'Bathroom',
    'Dining Room',
    'Home Office',
    'Balcony',
    'Terrace',
    'Outdoor Space',
  ];

  const styleOptions: { style: DesignStyle; image: string }[] = [
    {
      style: 'Modern',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80',
    },
    {
      style: 'Scandinavian',
      image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=300&q=80',
    },
    {
      style: 'Minimalist',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=300&q=80',
    },
    {
      style: 'Japandi',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=300&q=80',
    },
    {
      style: 'Coastal',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=300&q=80',
    },
    {
      style: 'Industrial',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=300&q=80',
    },
  ];

  const colorPalettes: { name: ColorPreference; swatches: string[] }[] = [
    { name: 'Neutral', swatches: ['#EBE5DC', '#D8D0C5'] },
    { name: 'Warm', swatches: ['#E8C39E', '#C68B59'] },
    { name: 'Cool', swatches: ['#CBD5E1', '#64748B'] },
    { name: 'Earth Tones', swatches: ['#78866B', '#A27035'] },
    { name: 'Bold', swatches: ['#BE123C', '#1E3A8A'] },
    { name: 'Pastel', swatches: ['#FDE2E4', '#E2ECE9'] },
  ];

  const functionalOptions = [
    { label: 'Relaxation', icon: Armchair },
    { label: 'Entertainment', icon: Tv },
    { label: 'Work from home', icon: Briefcase },
    { label: 'Family time', icon: Users },
    { label: 'Storage', icon: Archive },
    { label: 'Reading', icon: BookOpen },
    { label: 'Hosting guests', icon: Heart },
    { label: 'Pet friendly', icon: Dog },
    { label: 'Exercise / Wellness', icon: Activity },
    { label: 'Kids play area', icon: Smile },
    { label: 'Dining', icon: Utensils },
  ];

  const retainableItems = [
    { name: 'Sofa', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=120&q=80' },
    { name: 'Rug', image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=120&q=80' },
    { name: 'TV Console', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=120&q=80' },
    { name: 'Plants', image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=120&q=80' },
    { name: 'Artwork', image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=120&q=80' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const toggleStyle = (style: DesignStyle) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? (prev.length > 1 ? prev.filter((s) => s !== style) : prev) : [...prev, style]
    );
  };

  const toggleColor = (color: ColorPreference) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? (prev.length > 1 ? prev.filter((c) => c !== color) : prev) : [...prev, color]
    );
  };

  const toggleNeed = (need: string) => {
    setFunctionalNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const toggleRetainItem = (name: string) => {
    setItemsToRetain((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeSpaceOnly = async () => {
    setIsAnalyzing(true);
    try {
      const result = await aiService.analyzeSpace(
        photoPreview,
        roomType,
        additionalNotes
      );
      if (result?.analysis) {
        archMindStore.saveSpaceAnalysis(result.analysis);
      }
      onNavigate('/app/space-analysis');
    } catch (err) {
      console.error('Space analysis failed:', err);
      onNavigate('/app/space-analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run the Real AI Generation Pipeline
  const handleGenerateDesign = async () => {
    setIsGenerating(true);
    setGenerationStep('Analyzing spatial geometry with Gemini Multimodal AI...');

    try {
      // 1. Multimodal space analysis
      const analysisResult = await aiService.analyzeSpace(
        photoPreview,
        roomType,
        additionalNotes
      );

      setGenerationStep('Synthesizing photorealistic design concepts with Imagen / Gemini...');

      // 2. Generate concepts
      const generationResult = await aiService.generateDesign({
        imageBase64: photoPreview,
        roomType,
        style: selectedStyles[0] || 'Modern',
        colorPreferences: selectedColors,
        budgetMin,
        budgetMax,
        functionalNeeds,
        itemsToRetain,
        additionalInstructions: additionalNotes,
        projectId: activeProject?.id || 'proj_modern_terrace',
      });

      setGenerationStep('Persisting design versions and materials catalog...');

      // 3. Save to Store
      const savedDesign = archMindStore.saveDesign({
        ...(generationResult.concept as any),
        analysis: analysisResult.analysis,
        versionNumber: 1,
      });

      // Navigate to Design Results
      onNavigate(`/app/designs/${savedDesign.id}`);
    } catch (err) {
      console.error('Generation failed:', err);
      // Fallback redirect to demo design
      onNavigate('/app/designs/des_modern_living');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold text-[#006B7B] uppercase tracking-wider mb-0.5">
            AI Design Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171C2C] flex items-center gap-2">
            <span>AI Design Studio</span>
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
          </h1>
          <p className="text-xs text-[#667085] mt-1 max-w-2xl">
            Upload a photo of your space and tell us what you'd like to create. Our AI will generate personalized design concepts that match your style, budget, and needs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('ArchMind AI utilizes multimodal visual understanding and spatial synthesis to preserve camera perspective and doors/windows while renovating finishes.')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E6E9ED] hover:bg-gray-50 rounded-xl text-xs font-medium text-gray-700 shadow-2xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 text-gray-500" />
            <span>How it works</span>
          </button>

          {/* Stepper Indicator */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-[#006B7B] font-semibold">
              <span className="w-5 h-5 rounded-full bg-[#006B7B] text-white text-[10px] flex items-center justify-center">1</span>
              <span>Set Your Vision</span>
            </div>
            <div className="w-4 h-0.5 bg-gray-200"></div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] flex items-center justify-center">2</span>
              <span>Generate Designs</span>
            </div>
            <div className="w-4 h-0.5 bg-gray-200"></div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] flex items-center justify-center">3</span>
              <span>Review & Refine</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: 8-STEP DESIGN FORM (8 cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* STEP 1: UPLOAD PHOTO */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#E4F3F4] text-[#006B7B] text-[11px] font-bold flex items-center justify-center">1</span>
                <h3 className="font-bold text-gray-900 text-xs">Upload a Photo of Your Space</h3>
                <Info className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <span className="text-[11px] text-[#006B7B] hover:underline cursor-pointer">Tips for great results</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Drag & Drop Area */}
              <label className="border-2 border-dashed border-gray-200 hover:border-[#006B7B] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-[#E4F3F4]/20 group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-gray-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5 text-[#006B7B]" />
                </div>
                <div className="font-semibold text-gray-900 text-xs">
                  Drag and drop a photo here
                </div>
                <div className="text-[11px] text-[#006B7B] mt-0.5 font-medium">or click to browse</div>
                <div className="text-[10px] text-gray-400 mt-2">
                  Supports JPG, PNG, HEIC up to 20MB
                </div>
                <span className="mt-3 px-3 py-1.5 bg-[#006B7B] text-white text-[11px] font-semibold rounded-xl shadow-2xs">
                  Upload a Photo
                </span>
              </label>

              {/* Uploaded Preview */}
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 aspect-4/3 bg-gray-100 group">
                <img
                  src={photoPreview}
                  alt="Uploaded Space"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-end p-3">
                  <label className="flex items-center gap-1.5 px-3 py-1.5 bg-black/70 hover:bg-black text-white text-[11px] font-medium rounded-xl cursor-pointer backdrop-blur-xs transition-colors">
                    <RefreshCw className="w-3 h-3" />
                    <span>Replace Photo</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Quick Space Analysis Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-teal-50/70 rounded-xl border border-teal-100">
              <div className="flex items-center gap-2.5 text-xs text-teal-900">
                <div className="w-7 h-7 rounded-lg bg-[#006B7B] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-xs">Want an instant room inspection?</div>
                  <div className="text-[11px] text-gray-600">Gemini will detect lighting, furniture, architectural style, and spatial layout.</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAnalyzeSpaceOnly}
                disabled={isAnalyzing}
                className="w-full sm:w-auto px-4 py-2 bg-[#006B7B] hover:bg-[#004F5C] text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Space...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Analyze Space with Gemini</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* STEP 2 & 3: ROOM TYPE & DESIGN STYLE */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Step 2: Room Type (5 cols) */}
            <div className="md:col-span-5 p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#E4F3F4] text-[#006B7B] text-[11px] font-bold flex items-center justify-center">2</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-xs">Room Type</h3>
                  <p className="text-[10px] text-gray-500">What room would you like to redesign?</p>
                </div>
              </div>
              <div className="relative">
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value as RoomType)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B] text-gray-900 text-xs font-medium"
                >
                  {roomTypes.map((rt) => (
                    <option key={rt} value={rt}>{rt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 3: Design Style (7 cols) */}
            <div className="md:col-span-7 p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#E4F3F4] text-[#006B7B] text-[11px] font-bold flex items-center justify-center">3</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-xs">Design Style</h3>
                  <p className="text-[10px] text-gray-500">Choose one or more styles you like.</p>
                </div>
              </div>

              {/* Style Cards Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {styleOptions.map((opt) => {
                  const isSelected = selectedStyles.includes(opt.style);
                  return (
                    <div
                      key={opt.style}
                      onClick={() => toggleStyle(opt.style)}
                      className={`cursor-pointer rounded-xl border p-1 text-center transition-all ${
                        isSelected
                          ? 'border-2 border-[#006B7B] bg-[#E4F3F4]/40 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <img
                        src={opt.image}
                        alt={opt.style}
                        className="w-full h-12 rounded-lg object-cover mb-1"
                      />
                      <span className="text-[10px] font-semibold text-gray-800 line-clamp-1">
                        {opt.style}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* STEP 4 & 5: COLOR PREFERENCES & BUDGET RANGE */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Step 4: Color Preferences (6 cols) */}
            <div className="md:col-span-6 p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#E4F3F4] text-[#006B7B] text-[11px] font-bold flex items-center justify-center">4</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-xs">Color Preferences</h3>
                  <p className="text-[10px] text-gray-500">Select colors you're drawn to. Choose up to 5.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {colorPalettes.map((cp) => {
                  const isSelected = selectedColors.includes(cp.name);
                  return (
                    <div
                      key={cp.name}
                      onClick={() => toggleColor(cp.name)}
                      className={`p-2 rounded-xl border cursor-pointer flex flex-col items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'border-2 border-[#006B7B] bg-[#E4F3F4]/40'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {cp.swatches.map((s, idx) => (
                          <span
                            key={idx}
                            style={{ backgroundColor: s }}
                            className="w-3.5 h-3.5 rounded-full border border-black/10"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-medium text-gray-800">{cp.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 5: Budget Range (6 cols) */}
            <div className="md:col-span-6 p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#E4F3F4] text-[#006B7B] text-[11px] font-bold flex items-center justify-center">5</span>
                  <div>
                    <h3 className="font-bold text-gray-900 text-xs">Budget Range</h3>
                    <p className="text-[10px] text-gray-500">What's your estimated budget for this room?</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
                  ${budgetMin.toLocaleString()} – ${budgetMax.toLocaleString()}
                </span>
              </div>

              {/* Slider */}
              <div className="pt-4 px-2">
                <input
                  type="range"
                  min={5000}
                  max={60000}
                  step={2500}
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(Number(e.target.value))}
                  className="w-full accent-[#006B7B]"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-mono">
                  <span>$1K</span>
                  <span>$5K</span>
                  <span>$10K</span>
                  <span>$25K</span>
                  <span>$50K</span>
                  <span>$100K+</span>
                </div>
              </div>
            </div>

          </div>

          {/* STEP 6: FUNCTIONAL NEEDS */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#E4F3F4] text-[#006B7B] text-[11px] font-bold flex items-center justify-center">6</span>
              <div>
                <h3 className="font-bold text-gray-900 text-xs">Functional Needs</h3>
                <p className="text-[10px] text-gray-500">What do you want this space to support? Select all that apply.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {functionalOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = functionalNeeds.includes(opt.label);
                return (
                  <button
                    key={opt.label}
                    onClick={() => toggleNeed(opt.label)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-[#E4F3F4] text-[#006B7B] border border-teal-300 font-semibold shadow-2xs'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 7: EXISTING ITEMS TO RETAIN */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#E4F3F4] text-[#006B7B] text-[11px] font-bold flex items-center justify-center">7</span>
              <div>
                <h3 className="font-bold text-gray-900 text-xs">Existing Items to Retain</h3>
                <p className="text-[10px] text-gray-500">Choose items you want to keep in the design.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-1">
              {retainableItems.map((item) => {
                const isSelected = itemsToRetain.includes(item.name);
                return (
                  <div
                    key={item.name}
                    onClick={() => toggleRetainItem(item.name)}
                    className={`p-2 rounded-xl border cursor-pointer text-center relative transition-all ${
                      isSelected
                        ? 'border-2 border-[#006B7B] bg-[#E4F3F4]/40'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#006B7B] text-white flex items-center justify-center text-[9px]">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-12 rounded-lg object-cover mb-1.5"
                    />
                    <span className="text-[10px] font-semibold text-gray-800">{item.name}</span>
                  </div>
                );
              })}

              <div
                onClick={() => {
                  const custom = prompt('Enter custom item to retain:');
                  if (custom) setItemsToRetain((prev) => [...prev, custom]);
                }}
                className="p-2 rounded-xl border border-dashed border-gray-300 hover:border-[#006B7B] cursor-pointer flex flex-col items-center justify-center text-center text-gray-500 hover:text-[#006B7B] transition-colors"
              >
                <Plus className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-semibold">Add item</span>
              </div>
            </div>
          </div>

          {/* STEP 8: ADDITIONAL INSTRUCTIONS */}
          <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#E4F3F4] text-[#006B7B] text-[11px] font-bold flex items-center justify-center">8</span>
                <h3 className="font-bold text-gray-900 text-xs">Additional Instructions (Optional)</h3>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">{additionalNotes.length}/500</span>
            </div>
            <textarea
              rows={3}
              maxLength={500}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g., I want a bright, airy living room with more storage, a cozy reading nook, and a modern but warm feel... Consider my love for natural materials and plants."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B] text-xs text-gray-900 leading-relaxed"
            />
          </div>

        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: DESIGN SUMMARY SIDEBAR (4 cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          
          <div className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs space-y-4">
            
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-[#E4F3F4] text-[#006B7B] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-xs">Design Summary</h3>
                <p className="text-[10px] text-gray-500">Review your inputs before generating designs.</p>
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-3 text-xs">
              
              {/* Space Photo */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Space Photo</span>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <button className="text-[11px] text-[#006B7B] hover:underline">Edit</button>
              </div>
              <img
                src={photoPreview}
                alt="Uploaded"
                className="w-full h-24 rounded-xl object-cover border border-gray-100"
              />

              {/* Room Type */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-400">Room Type</div>
                  <div className="font-semibold text-gray-900">{roomType}</div>
                </div>
                <button className="text-[11px] text-[#006B7B] hover:underline">Edit</button>
              </div>

              {/* Design Style */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-400">Design Style</div>
                  <div className="font-semibold text-gray-900">{selectedStyles.join(', ')}</div>
                </div>
                <button className="text-[11px] text-[#006B7B] hover:underline">Edit</button>
              </div>

              {/* Color Preferences */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-400">Color Preferences</div>
                  <div className="font-semibold text-gray-900">{selectedColors.join(', ')}</div>
                </div>
                <button className="text-[11px] text-[#006B7B] hover:underline">Edit</button>
              </div>

              {/* Budget Range */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-400">Budget Range</div>
                  <div className="font-semibold text-gray-900">${budgetMin.toLocaleString()} – ${budgetMax.toLocaleString()}</div>
                </div>
                <button className="text-[11px] text-[#006B7B] hover:underline">Edit</button>
              </div>

              {/* Functional Needs */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-400">Functional Needs</div>
                  <div className="font-semibold text-gray-900">{functionalNeeds.join(', ')}</div>
                </div>
                <button className="text-[11px] text-[#006B7B] hover:underline">Edit</button>
              </div>

              {/* Retained Items */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-400">Items to Retain</div>
                  <div className="font-semibold text-gray-900">{itemsToRetain.join(', ')}</div>
                </div>
                <button className="text-[11px] text-[#006B7B] hover:underline">Edit</button>
              </div>

            </div>

            {/* Primary Generate Button */}
            <div className="pt-3 border-t border-gray-100">
              <button
                onClick={handleGenerateDesign}
                disabled={isGenerating}
                className="w-full py-3.5 bg-[#006B7B] hover:bg-[#004F5C] disabled:bg-teal-800 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-teal-200" />
                    <span>Processing Design...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Design</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <div className="text-[10px] text-gray-400 text-center mt-2">
                This will create multiple design concepts based on your inputs.
              </div>
            </div>

            {/* Lightbulb Tip Banner */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/50 rounded-xl flex items-start gap-2.5 text-xs">
              <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-900 leading-snug">
                <span className="font-bold">You'll get 3–5 unique design concepts.</span> You can then refine, regenerate, or modify any design.
              </div>
            </div>

          </div>

          {/* Live Progress Card when generating */}
          {isGenerating && (
            <div className="p-4 bg-teal-900 text-white rounded-2xl shadow-xl animate-in fade-in space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-teal-200">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>AI Pipeline Active</span>
              </div>
              <p className="text-teal-100 text-[11px]">{generationStep}</p>
              <div className="w-full bg-teal-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-teal-400 h-1.5 rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

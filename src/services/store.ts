import {
  Project,
  DesignConcept,
  FloorPlanConcept,
  Product,
  BudgetItem,
  BudgetAssumption,
  CostSavingSuggestion,
  Property,
  Professional,
  ProfessionalInquiry,
  ProjectDocument,
  ProjectTask,
  MaintenanceTask,
  NotificationItem,
  UserSession,
  SpaceAnalysis,
} from '../types';

// ==========================================
// SEED DATA MATCHING SCREENSHOT SPECIFICATIONS
// ==========================================

export const INITIAL_USER: UserSession = {
  id: 'usr_sarah_chen',
  name: 'Sarah Chen',
  email: 'sarah.chen@archmind.design',
  role: 'Homeowner',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  preferredCurrency: 'INR',
  unitSystem: 'sqft',
  createdAt: '2025-01-10T08:00:00Z',
  provider: 'local-secure',
  primaryInterest: 'Manage renovation',
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_modern_terrace',
    name: 'Modern Terrace House',
    description: 'Complete 2-storey intermediate terrace house interior redesign and structural renovation.',
    projectType: 'Renovation',
    status: 'In Progress',
    location: 'Bangalore / Kuala Lumpur',
    currency: 'INR',
    budgetLimit: 2850000,
    builtUpArea: 2280,
    landArea: 2400,
    floors: 2,
    bedrooms: 3,
    bathrooms: 3,
    startDate: '2025-03-01',
    targetCompletionDate: '2025-08-30',
    progressPercentage: 46,
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    notes: 'Standard mid-range materials and finishes. Based on current market rates Q2 2025.',
    createdAt: '2025-02-15T10:00:00Z',
    updatedAt: '2025-04-12T14:30:00Z',
  },
  {
    id: 'proj_bangsar_loft',
    name: 'Bangsar Urban Loft',
    description: 'Minimalist Japandi penthouse refurbishment featuring custom oak millwork.',
    projectType: 'Interior Redesign',
    status: 'Planning',
    location: 'Indiranagar / Bangsar',
    currency: 'INR',
    budgetLimit: 1450000,
    builtUpArea: 1650,
    floors: 1,
    bedrooms: 2,
    bathrooms: 2,
    startDate: '2025-05-15',
    targetCompletionDate: '2025-09-15',
    progressPercentage: 20,
    coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    notes: 'Focus on natural materials, warm ambient lighting, open plan layout.',
    createdAt: '2025-03-01T12:00:00Z',
    updatedAt: '2025-03-20T16:00:00Z',
  },
];

export const INITIAL_BUDGET_ITEMS: BudgetItem[] = [
  {
    id: 'cost_1',
    projectId: 'proj_modern_terrace',
    name: 'Structure & External Works',
    category: 'Construction',
    unit: 'sqft',
    quantity: 2280,
    unitCost: 400,
    totalCost: 912000,
    status: 'Committed',
    supplier: 'Apex Civil Builders',
    notes: 'Structural alterations, boundary wall and porch reinforced slab.',
    createdAt: '2025-03-10T00:00:00Z',
    updatedAt: '2025-03-10T00:00:00Z',
  },
  {
    id: 'cost_2',
    projectId: 'proj_modern_terrace',
    name: 'Internal Walls & Finishes',
    category: 'Construction',
    unit: 'sqft',
    quantity: 2280,
    unitCost: 120,
    totalCost: 273600,
    status: 'Committed',
    supplier: 'Apex Civil Builders',
    notes: 'Skim coating, partition walls and premium Asian Paints anti-fungal emulsion.',
    createdAt: '2025-03-11T00:00:00Z',
    updatedAt: '2025-03-11T00:00:00Z',
  },
  {
    id: 'cost_3',
    projectId: 'proj_modern_terrace',
    name: 'Kitchen Cabinetry',
    category: 'Furnishing',
    unit: 'set',
    quantity: 1,
    unitCost: 180000,
    totalCost: 180000,
    status: 'Estimated',
    supplier: 'Modula Joinery',
    notes: 'Quartz island countertop with soft-close Blum hardware.',
    createdAt: '2025-03-12T00:00:00Z',
    updatedAt: '2025-03-12T00:00:00Z',
  },
  {
    id: 'cost_4',
    projectId: 'proj_modern_terrace',
    name: 'Built-in Wardrobes',
    category: 'Furnishing',
    unit: 'set',
    quantity: 3,
    unitCost: 80000,
    totalCost: 240000,
    status: 'Estimated',
    supplier: 'Modula Joinery',
    notes: 'Full height floor-to-ceiling wardrobes for Master & 2 Bedrooms.',
    createdAt: '2025-03-12T00:00:00Z',
    updatedAt: '2025-03-12T00:00:00Z',
  },
  {
    id: 'cost_5',
    projectId: 'proj_modern_terrace',
    name: 'Sanitary Ware',
    category: 'Fixtures & Fittings',
    unit: 'set',
    quantity: 2,
    unitCost: 60000,
    totalCost: 120000,
    status: 'Estimated',
    supplier: 'Jaquar / Kohler Concept',
    notes: 'Concealed cisterns, matte black mixer taps, freestanding washbasins.',
    createdAt: '2025-03-13T00:00:00Z',
    updatedAt: '2025-03-13T00:00:00Z',
  },
  {
    id: 'cost_6',
    projectId: 'proj_modern_terrace',
    name: 'Lighting & Electrical',
    category: 'Fixtures & Fittings',
    unit: 'lot',
    quantity: 1,
    unitCost: 240000,
    totalCost: 240000,
    status: 'Committed',
    supplier: 'Lumen Lux Engineering',
    notes: 'Recessed trimless LED downlights, magnetic tracks, smart dimmers.',
    createdAt: '2025-03-14T00:00:00Z',
    updatedAt: '2025-03-14T00:00:00Z',
  },
  {
    id: 'cost_7',
    projectId: 'proj_modern_terrace',
    name: 'Civil & Installation Labour',
    category: 'Labour',
    unit: 'lot',
    quantity: 1,
    unitCost: 510000,
    totalCost: 510000,
    status: 'Committed',
    supplier: 'Apex Civil Builders',
    notes: 'Masonry, plumbing rough-in, electrical rewiring, site management.',
    createdAt: '2025-03-15T00:00:00Z',
    updatedAt: '2025-03-15T00:00:00Z',
  },
  {
    id: 'cost_8',
    projectId: 'proj_modern_terrace',
    name: 'Contingency (10%)',
    category: 'Contingency',
    unit: 'lot',
    quantity: 1,
    unitCost: 300000,
    totalCost: 300000,
    status: 'Estimated',
    supplier: 'Buffer Reserve',
    notes: 'Unforeseen structural repairs, permit variations and market fluctuations.',
    createdAt: '2025-03-15T00:00:00Z',
    updatedAt: '2025-03-15T00:00:00Z',
  },
];

export const INITIAL_ASSUMPTIONS: BudgetAssumption[] = [
  { id: 'as_1', projectId: 'proj_modern_terrace', text: 'Standard mid-range materials and finishes', category: 'Specification' },
  { id: 'as_2', projectId: 'proj_modern_terrace', text: '2,280 sqft built-up area across 2 floors', category: 'Area' },
  { id: 'as_3', projectId: 'proj_modern_terrace', text: '2-storey terrace house (intermediate lot)', category: 'Typology' },
  { id: 'as_4', projectId: 'proj_modern_terrace', text: 'Located in Bangalore / Pan-India', category: 'Location' },
  { id: 'as_5', projectId: 'proj_modern_terrace', text: 'Based on current market rates (Q2 2025)', category: 'Cost Index' },
  { id: 'as_6', projectId: 'proj_modern_terrace', text: 'Includes design, construction and basic M&E', category: 'Scope' },
];

export const INITIAL_COST_SAVINGS: CostSavingSuggestion[] = [
  {
    id: 'cs_1',
    title: 'Use engineered wood flooring',
    description: 'Save up to 30% vs. solid hardwood with identical warm aesthetic and superior moisture resistance.',
    savingAmount: 80000,
    imageUrl: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=400&q=80',
    category: 'Flooring',
  },
  {
    id: 'cs_2',
    title: 'Consider modular kitchen',
    description: 'Get high precision German modular cabinets instead of high-labour custom joinery.',
    savingAmount: 50000,
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
    category: 'Furnishing',
  },
  {
    id: 'cs_3',
    title: 'Use LED lighting throughout',
    description: 'Reduce electrical cabling costs and cut monthly operating energy expenses by up to 40%.',
    savingAmount: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&q=80',
    category: 'Fixtures & Fittings',
  },
];

export const INITIAL_DESIGN_CONCEPTS: DesignConcept[] = [
  {
    id: 'des_modern_living',
    projectId: 'proj_modern_terrace',
    name: 'Modern Terrace House — Living Room Concept',
    roomType: 'Living Room',
    style: 'Modern',
    colorPreferences: ['Neutral', 'Earth Tones'],
    budgetMin: 10000,
    budgetMax: 30000,
    functionalNeeds: ['Relaxation', 'Storage', 'Family time', 'Hosting guests'],
    itemsToRetain: ['Sofa', 'Plants'],
    additionalNotes: 'I want a bright, airy living room with more storage, a cozy reading nook, and a modern but warm feel with natural wood and linen.',
    beforeImageUrl: '/assets/sample_room_before.jpg',
    afterImageUrl: '/assets/sample_room_ai_recommended.jpg',
    perspective3dUrl: '/assets/sample_room_3d_perspective.jpg',
    panorama360Url: '/assets/sample_room_360_panorama.jpg',
    selectedVariationId: 'var_natural_modern',
    variations: [
      {
        id: 'var_natural_modern',
        name: 'Natural Modern',
        tagline: 'Warm, cozy and timeless',
        imageUrl: '/assets/sample_room_ai_recommended.jpg',
        style: 'Modern',
        description: 'Warm oak timber slat accents with neutral bouclé upholstery, soft ambient cove lighting, and open circulation.',
      },
      {
        id: 'var_japandi_calm',
        name: 'Japandi Calm',
        tagline: 'Minimal and serene',
        imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
        style: 'Japandi',
        description: 'Low-profile seating, muted washi paper lamps, limewash walls, and natural ceramic pottery.',
      },
      {
        id: 'var_modern_luxury',
        name: 'Modern Luxury',
        tagline: 'Elegant and refined',
        imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
        style: 'Luxury',
        description: 'Calacatta marble feature wall, brass trim details, concealed acoustic slats, and deep velvet seating.',
      },
      {
        id: 'var_urban_contemporary',
        name: 'Urban Contemporary',
        tagline: 'Stylish and functional',
        imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
        style: 'Contemporary',
        description: 'Matte black metal architectural accents, fluted glass sliders, micro-cement flooring, and modular storage.',
      },
    ],
    designNotes: 'This design creates a warm and inviting living space with natural textures, wood accents, and plenty of natural light. The layout maximizes the space for family living while maintaining a clean and minimalist aesthetic.',
    colorPalette: [
      { name: 'Warm Neutral', hex: '#EBE5DC' },
      { name: 'Natural Wood', hex: '#D7B48D' },
      { name: 'Stone Grey', hex: '#B8AFA6' },
      { name: 'Olive Green', hex: '#637357' },
    ],
    materials: [
      { category: 'Furniture', name: 'Sofa & Seating (4 items)', checked: true },
      { category: 'Furniture', name: 'Tables & Storage (6 items)', checked: true },
      { category: 'Lighting', name: 'Lighting Fixtures (5 items)', checked: true },
      { category: 'Finishes', name: 'Rugs & Textiles (4 items)', checked: true },
      { category: 'Decor', name: 'Plants & Decor (7 items)', checked: true },
    ],
    estimatedBudget: 285000,
    budgetBreakdown: {
      furniture: 120000,
      fixturesAndLighting: 50000,
      decorAndAccessories: 43000,
      renovation: 72000,
    },
    versionHistory: [
      {
        id: 'ver_1',
        versionNumber: 1,
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        prompt: 'Transform empty living room with warm wood textures, bouclé upholstery, and natural lighting.',
        timestamp: '2025-03-22T10:00:00Z',
        variationName: 'Natural Modern',
        notes: 'Initial generation from uploaded living room photograph.',
      },
      {
        id: 'ver_2',
        versionNumber: 2,
        imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
        prompt: 'Refine with Japandi serenity: lower profile seating, warm ambient cove lighting, and fluted acoustic timber accents.',
        timestamp: '2025-04-02T15:00:00Z',
        variationName: 'Japandi Calm',
        notes: 'Refined based on family-friendly and acoustic damping preferences.',
      },
    ],
    createdAt: '2025-03-22T10:00:00Z',
    updatedAt: '2025-04-02T15:00:00Z',
    versionNumber: 2,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Luna Modular Sofa',
    brand: 'West Elm / Urban Ladder',
    category: 'Furniture',
    priceMin: 85000,
    priceMax: 125000,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    material: 'Bouclé Fabric',
    colors: ['#EBE5DC', '#D8D0C5', '#333333'],
    style: 'Modern',
    roomTypes: ['Living Room'],
    matchType: 'Exact Match',
    matchPercentage: 96,
    vendorUrl: 'https://www.urbanladder.com',
    description: 'Generously proportioned modular sofa wrapped in tactile bouclé with kiln-dried solid teak/hardwood frame.',
    inStock: true,
    isSavedToProject: true,
  },
  {
    id: 'prod_2',
    name: 'Riva Coffee Table',
    brand: 'Crate & Barrel',
    category: 'Furniture',
    priceMin: 24000,
    priceMax: 32000,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
    material: 'Solid Oak',
    colors: ['#D7B48D', '#8C6747'],
    style: 'Scandinavian',
    roomTypes: ['Living Room'],
    matchType: 'Exact Match',
    matchPercentage: 94,
    vendorUrl: 'https://www.crateandbarrel.com',
    description: 'Sculptural rounded low coffee table crafted from sustainably sourced European white oak.',
    inStock: true,
    isSavedToProject: true,
  },
  {
    id: 'prod_3',
    name: 'Cove Pendant Light',
    brand: 'Audo Copenhagen / Jaquar Art',
    category: 'Lighting',
    priceMin: 14500,
    priceMax: 21000,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    material: 'Stoneware Ceramic',
    colors: ['#E8E3DD', '#4A4A4A'],
    style: 'Minimalist',
    roomTypes: ['Living Room', 'Dining Room'],
    matchType: 'Similar Alternative',
    matchPercentage: 88,
    vendorUrl: 'https://audocph.com',
    description: 'Cast ceramic pendant emitting warm downward diffused illumination with antique brass ceiling canopy.',
    inStock: true,
    isSavedToProject: true,
  },
  {
    id: 'prod_4',
    name: 'Eli Lounge Chair',
    brand: 'Article / Chumbak Luxe',
    category: 'Furniture',
    priceMin: 28000,
    priceMax: 38000,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1580481077195-c3a82104e46b?auto=format&fit=crop&w=800&q=80',
    material: 'Linen Blend & Sheesham Wood',
    colors: ['#F2EEE9', '#786C5E'],
    style: 'Japandi',
    roomTypes: ['Living Room', 'Bedroom'],
    matchType: 'Exact Match',
    matchPercentage: 91,
    vendorUrl: 'https://www.article.com',
    description: 'Deep lounge seating angle with solid timber dowel framing and textured natural linen upholstery.',
    inStock: true,
    isSavedToProject: false,
  },
  {
    id: 'prod_5',
    name: 'Natural Oak Slat Panel',
    brand: 'WoodUpp India',
    category: 'Wall Materials',
    priceMin: 3200,
    priceMax: 4500,
    currency: 'INR',
    unit: 'panel',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    material: 'Oak Veneer on Recycled Acoustic Felt',
    colors: ['#D7B48D', '#544336'],
    style: 'Modern',
    roomTypes: ['Living Room', 'Bedroom'],
    matchType: 'Exact Match',
    matchPercentage: 98,
    vendorUrl: 'https://woodupp.com',
    description: 'Acoustic wall panelling offering class-A sound absorption and architectural visual texture.',
    inStock: true,
    isSavedToProject: true,
  },
  {
    id: 'prod_6',
    name: 'Calacatta Liri Quartz',
    brand: 'Silestone / AGL Quartz',
    category: 'Finishes',
    priceMin: 550,
    priceMax: 850,
    currency: 'INR',
    unit: 'sq ft',
    imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    material: 'Polished Engineered Quartz',
    colors: ['#FAF9F6', '#8F9499'],
    style: 'Luxury',
    roomTypes: ['Kitchen', 'Bathroom', 'Living Room'],
    matchType: 'Similar Alternative',
    matchPercentage: 86,
    vendorUrl: 'https://www.cosentino.com/silestone',
    description: 'Non-porous quartz surface with warm gold and grey dramatic veining inspired by Tuscan marble.',
    inStock: true,
    isSavedToProject: false,
  },
  {
    id: 'prod_7',
    name: 'European Oak Flooring',
    brand: 'Kährs / Pergo India',
    category: 'Flooring',
    priceMin: 280,
    priceMax: 420,
    currency: 'INR',
    unit: 'sq ft',
    imageUrl: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80',
    material: 'Engineered Oak Plank',
    colors: ['#DCC6AC', '#AA8C6D'],
    style: 'Scandinavian',
    roomTypes: ['Living Room', 'Bedroom', 'Dining Room'],
    matchType: 'Exact Match',
    matchPercentage: 95,
    vendorUrl: 'https://www.kahrs.com',
    description: 'Triple-layer engineered European oak with ultra-matt lacquer finish and Woodloc 5G locking joint.',
    inStock: true,
    isSavedToProject: true,
  },
  {
    id: 'prod_8',
    name: 'Harper Bar Stool',
    brand: 'AllModern / West Elm',
    category: 'Furniture',
    priceMin: 8500,
    priceMax: 12500,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
    material: 'Solid Wood & Top-Grain Leather',
    colors: ['#6B4423', '#2B2B2B'],
    style: 'Modern',
    roomTypes: ['Kitchen', 'Dining Room'],
    matchType: 'Similar Alternative',
    matchPercentage: 89,
    vendorUrl: 'https://www.allmodern.com',
    description: 'Tapered walnut legs with cognac leather curved bucket seat suited for breakfast islands.',
    inStock: true,
    isSavedToProject: false,
  },
];

export const INITIAL_FLOOR_PLANS: FloorPlanConcept[] = [
  {
    id: 'plan_concept_1',
    projectId: 'proj_modern_terrace',
    conceptNumber: 1,
    name: 'Modern Family Home',
    tagline: 'Spacious, functional and filled with natural light.',
    isRecommended: true,
    plotShape: 'Rectangular',
    plotWidth: 40,
    plotLength: 60,
    totalPlotArea: 2400,
    builtUpArea: 1860,
    groundFloorArea: 980,
    firstFloorArea: 880,
    openSpaceArea: 540,
    openSpacePercentage: 23,
    builtUpPercentage: 77,
    bedrooms: 3,
    bathrooms: 3,
    parkingSpaces: 2,
    floors: 2,
    familySize: '4–5 people',
    specialRequirements: ['Open Kitchen', 'Study Room', 'Home Office'],
    notes: 'North-facing entrance preferred. Open plan living and dining with seamless transition to rear garden terrace.',
    groundFloorPlan: {
      floorNumber: 0,
      floorName: 'Ground Floor',
      rooms: [
        { id: 'r1', name: 'Car Porch (2 Cars)', type: 'parking', x: 20, y: 20, width: 140, height: 180, color: '#E2E8F0' },
        { id: 'r2', name: 'Foyer', type: 'entrance', x: 170, y: 30, width: 70, height: 60, color: '#F1F5F9' },
        { id: 'r3', name: 'Living Room', type: 'living', x: 170, y: 100, width: 190, height: 160, color: '#E4F3F4' },
        { id: 'r4', name: 'Dining Room', type: 'dining', x: 370, y: 100, width: 120, height: 120, color: '#FEF3C7' },
        { id: 'r5', name: 'Open Kitchen & Island', type: 'kitchen', x: 370, y: 230, width: 120, height: 110, color: '#FCE7F3' },
        { id: 'r6', name: 'Powder Room / Bath 1', type: 'bath', x: 170, y: 270, width: 60, height: 70, color: '#E0F2FE' },
        { id: 'r7', name: 'Rear Courtyard / Garden', type: 'garden', x: 240, y: 270, width: 120, height: 70, color: '#DCFCE7' },
      ],
    },
    firstFloorPlan: {
      floorNumber: 1,
      floorName: 'First Floor',
      rooms: [
        { id: 'rf1', name: 'Master Bedroom + Walk-in', type: 'bedroom', x: 30, y: 30, width: 200, height: 180, color: '#EDE9FE' },
        { id: 'rf2', name: 'Master Ensuite Bath', type: 'bath', x: 240, y: 30, width: 90, height: 90, color: '#E0F2FE' },
        { id: 'rf3', name: 'Family Living Area', type: 'living', x: 240, y: 130, width: 110, height: 120, color: '#E4F3F4' },
        { id: 'rf4', name: 'Bedroom 2', type: 'bedroom', x: 360, y: 30, width: 130, height: 130, color: '#FEF3C7' },
        { id: 'rf5', name: 'Bedroom 3 / Study', type: 'bedroom', x: 360, y: 170, width: 130, height: 130, color: '#FCE7F3' },
        { id: 'rf6', name: 'Shared Bathroom 3', type: 'bath', x: 240, y: 260, width: 100, height: 70, color: '#E0F2FE' },
      ],
    },
    createdAt: '2025-03-18T10:00:00Z',
  },
  {
    id: 'plan_concept_2',
    projectId: 'proj_modern_terrace',
    conceptNumber: 2,
    name: 'Courtyard Living',
    tagline: 'Open spaces centered around an internal serene courtyard.',
    isRecommended: false,
    plotShape: 'Rectangular',
    plotWidth: 40,
    plotLength: 60,
    totalPlotArea: 2400,
    builtUpArea: 1920,
    groundFloorArea: 1020,
    firstFloorArea: 900,
    openSpaceArea: 480,
    openSpacePercentage: 20,
    builtUpPercentage: 80,
    bedrooms: 3,
    bathrooms: 3,
    parkingSpaces: 2,
    floors: 2,
    familySize: '4–5 people',
    specialRequirements: ['Internal Courtyard', 'Double Height Ceiling'],
    groundFloorPlan: {
      floorNumber: 0,
      floorName: 'Ground Floor',
      rooms: [
        { id: 'c2_1', name: 'Car Porch', type: 'parking', x: 20, y: 20, width: 130, height: 170, color: '#E2E8F0' },
        { id: 'c2_2', name: 'Central Air Courtyard', type: 'garden', x: 190, y: 110, width: 120, height: 120, color: '#DCFCE7' },
        { id: 'c2_3', name: 'Living Gallery', type: 'living', x: 160, y: 20, width: 180, height: 80, color: '#E4F3F4' },
        { id: 'c2_4', name: 'Dining & Kitchen', type: 'dining', x: 320, y: 110, width: 170, height: 140, color: '#FEF3C7' },
        { id: 'c2_5', name: 'Powder Bath', type: 'bath', x: 160, y: 240, width: 70, height: 80, color: '#E0F2FE' },
      ],
    },
    createdAt: '2025-03-18T11:00:00Z',
  },
  {
    id: 'plan_concept_3',
    projectId: 'proj_modern_terrace',
    conceptNumber: 3,
    name: 'Compact & Efficient',
    tagline: 'Smart layout with optimized space usage and larger garden.',
    isRecommended: false,
    plotShape: 'Rectangular',
    plotWidth: 40,
    plotLength: 60,
    totalPlotArea: 2400,
    builtUpArea: 1650,
    groundFloorArea: 870,
    firstFloorArea: 780,
    openSpaceArea: 750,
    openSpacePercentage: 31,
    builtUpPercentage: 69,
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 2,
    floors: 2,
    familySize: '4 people',
    specialRequirements: ['Maximized Garden', 'Efficient Storage'],
    groundFloorPlan: {
      floorNumber: 0,
      floorName: 'Ground Floor',
      rooms: [
        { id: 'c3_1', name: 'Car Porch', type: 'parking', x: 20, y: 20, width: 130, height: 160, color: '#E2E8F0' },
        { id: 'c3_2', name: 'Combined Living & Dining', type: 'living', x: 160, y: 20, width: 200, height: 180, color: '#E4F3F4' },
        { id: 'c3_3', name: 'Linear Kitchen', type: 'kitchen', x: 370, y: 20, width: 110, height: 180, color: '#FCE7F3' },
        { id: 'c3_4', name: 'Deep Rear Garden', type: 'garden', x: 160, y: 210, width: 320, height: 120, color: '#DCFCE7' },
      ],
    },
    createdAt: '2025-03-18T12:00:00Z',
  },
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop_kl_terrace',
    title: 'Prestige Windchimes — 4 BHK Luxury Terrace Villa',
    listingType: 'For Sale',
    price: 14500000,
    currency: 'INR',
    location: '100ft Road, Indiranagar',
    city: 'Bangalore',
    country: 'India',
    bedrooms: 4,
    bathrooms: 4,
    builtUpArea: 2280,
    carpetArea: 1840,
    superBuiltUpArea: 2450,
    pricePerSqft: 6360,
    landArea: 2400,
    parkingSpaces: 2,
    tenure: 'Freehold',
    reraId: 'PRM/KA/RERA/1251/310/PR/170915/000214',
    possessionStatus: 'Ready to Move',
    possessionDate: 'Ready Immediate',
    developerName: 'Prestige Estates Projects',
    developerExperience: '36+ Years • 280+ Completed Projects',
    bhkType: '4 BHK Luxury Villa',
    floorNumber: 'G + 2 Storeys Private Villa',
    facing: 'East',
    furnishingStatus: 'Semi-Furnished',
    coordinates: { lat: 12.9716, lng: 77.6412 },
    mapAddress: '100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Prime independent freehold luxury villa located in the heart of Indiranagar. Features soaring 11ft ceilings, Italian marble flooring in formal living, German modular kitchen fittings, private garden patio, and exceptional natural cross ventilation.',
    amenities: [
      'Gated Community 24/7 Security',
      'Solar Rooftop Water Heating',
      'EV Charging Point',
      'Clubhouse with Swimming Pool',
      'Children Play Area',
      'High-Speed Fiber Ready',
      'Rainwater Harvesting System',
    ],
    nearbyPlaces: [
      { name: 'Indiranagar Metro Station (Purple Line)', distance: '650 m', type: 'Transit' },
      { name: '100ft Road High Street Retail & Cafes', distance: '400 m', type: 'Retail' },
      { name: 'Manipal Hospital HAL Airport Road', distance: '2.4 km', type: 'Hospital' },
      { name: 'National Public School (NPS)', distance: '1.2 km', type: 'Education' },
      { name: 'Embassy GolfLinks Business Park (EGL)', distance: '3.8 km', type: 'IT Hub' },
    ],
    agentContact: {
      name: 'Rajesh Varma',
      agency: 'Knight Frank India Residential',
      phone: '+91 98201 45890',
      whatsapp: '919820145890',
      email: 'rajesh.varma@knightfrank.co.in',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
      rating: 4.9,
      reviewCount: 42,
      reraRegistered: true,
    },
    loanDetails: {
      eligibleBanks: ['HDFC Bank Home Loans', 'State Bank of India', 'ICICI Bank', 'Axis Bank'],
      minDownPaymentPercent: 20,
      indicativeInterestRate: 8.4,
      estimatedEmi: 100200,
      maxTenureYears: 30,
    },
    isShortlisted: true,
    potentialScore: 94,
    aiInsights: {
      architecturalCharacter: 'Reinforced concrete frame with wide 24ft column-free ground floor span, perfect for open-plan European kitchen and sunroom integration.',
      renovationPotential: 'High. Rear dining room can be seamlessly opened into the private patio, and 2nd floor terrace converted into a climate-controlled glass conservatory.',
      estimatedRenovationCost: '₹25,00,000 – ₹31,00,000 for full premium interior turnkey fit-out.',
    },
  },
  {
    id: 'prop_damansara_villa',
    title: 'Godrej Woodsman — 5 BHK Sky Villa & Lap Pool',
    listingType: 'For Sale',
    price: 28500000,
    currency: 'INR',
    location: 'ITPL Main Road, Whitefield',
    city: 'Bangalore',
    country: 'India',
    bedrooms: 5,
    bathrooms: 5,
    builtUpArea: 3800,
    carpetArea: 3120,
    superBuiltUpArea: 4100,
    pricePerSqft: 7500,
    landArea: 5500,
    parkingSpaces: 4,
    tenure: 'Freehold',
    reraId: 'PRM/KA/RERA/1251/446/PR/190518/002580',
    possessionStatus: 'Ready to Move',
    possessionDate: 'Ready Immediate',
    developerName: 'Godrej Properties',
    developerExperience: '34+ Years • 190+ Projects Pan-India',
    bhkType: '5 BHK Duplex Penthouse',
    floorNumber: '24th & 25th Duplex',
    facing: 'North-East',
    furnishingStatus: 'Fully Furnished',
    coordinates: { lat: 12.9698, lng: 77.7499 },
    mapAddress: 'ITPL Main Rd, Whitefield, Bengaluru, Karnataka 560066',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Iconic double-height sky villa with private temperature-controlled infinity plunge pool, unobstructed 270-degree horizon skyline views, full acoustic soundproofing, and imported Italian Calacatta marble throughout.',
    amenities: [
      'Private Sky Deck & Lap Pool',
      'Automated VRV Air Conditioning',
      'Private High-Speed Elevator with Biometric Access',
      'Concierge & Valet Service',
      '4 Dedicated Covered Basement Car Parks',
      'Smart Home Control via iPad / Voice',
      'Olympic-Length Community Pool & Tennis Courts',
    ],
    nearbyPlaces: [
      { name: 'Nallurhalli Metro Station', distance: '800 m', type: 'Transit' },
      { name: 'International Tech Park Bangalore (ITPB)', distance: '1.2 km', type: 'IT Hub' },
      { name: 'Nexus Shantiniketan Mall', distance: '1.5 km', type: 'Retail' },
      { name: 'Vydehi Institute of Medical Sciences', distance: '2.1 km', type: 'Hospital' },
    ],
    agentContact: {
      name: 'Pooja Sengupta',
      agency: "Sotheby's International Realty India",
      phone: '+91 98192 34091',
      whatsapp: '919819234091',
      email: 'pooja.sengupta@sothebysrealty.in',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      rating: 5.0,
      reviewCount: 38,
      reraRegistered: true,
    },
    loanDetails: {
      eligibleBanks: ['SBI Privilege Home Loans', 'HDFC Bank Wealth', 'Citibank', 'Kotak Mahindra'],
      minDownPaymentPercent: 20,
      indicativeInterestRate: 8.35,
      estimatedEmi: 196500,
      maxTenureYears: 30,
    },
    isShortlisted: false,
    potentialScore: 89,
    aiInsights: {
      architecturalCharacter: 'Brutalist contemporary concrete & steel architecture with triple-glazed Low-E acoustic facade sliders.',
      renovationPotential: 'Moderate. Master bedroom suite is primed for an integrated walk-in dressing lounge and bespoke timber headboard wall.',
      estimatedRenovationCost: '₹14,00,000 – ₹19,00,000 for bespoke custom joinery and lighting upgrade.',
    },
  },
  {
    id: 'prop_bangsar_semi_d',
    title: 'Lodha Bellissimo — 4 BHK Sea-View Contemporary Semi-D',
    listingType: 'For Sale',
    price: 48500000,
    currency: 'INR',
    location: 'Worli Sea Face / Lower Parel',
    city: 'Mumbai',
    country: 'India',
    bedrooms: 4,
    bathrooms: 4,
    builtUpArea: 3100,
    carpetArea: 2550,
    superBuiltUpArea: 3400,
    pricePerSqft: 15645,
    landArea: 3600,
    parkingSpaces: 3,
    tenure: 'Freehold',
    reraId: 'P51900008291',
    possessionStatus: 'Ready to Move',
    possessionDate: 'Ready Immediate',
    developerName: 'Lodha Luxury Group',
    developerExperience: '44+ Years • India’s Premier Luxury Builder',
    bhkType: '4 BHK Grand Suite',
    floorNumber: '18th of 48 Floors',
    facing: 'West',
    furnishingStatus: 'Fully Furnished',
    coordinates: { lat: 18.9986, lng: 72.8311 },
    mapAddress: 'NM Joshi Marg, Mahalakshmi, Mumbai, Maharashtra 400011',
    coverImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Architecturally curated residence overlooking Mumbai Arabian Sea horizon. Features private foyer, imported Poggenpohl kitchen with Miele appliances, master suite with Jacuzzi, and 12,000 sq ft signature club.',
    amenities: [
      'Unobstructed Arabian Sea & Sunset Views',
      'Private Wine Cellar & Cigar Lounge',
      'Heated Indoor Pool & Spa by Six Senses',
      'Squash & Badminton Courts',
      'Helipad Access on Rooftop',
      '3 Dedicated Mechanized Stacking Car Parks',
    ],
    nearbyPlaces: [
      { name: 'Bandra-Worli Sea Link Entrance', distance: '1.8 km', type: 'Transit' },
      { name: 'Palladium & High Street Phoenix Mall', distance: '900 m', type: 'Retail' },
      { name: 'Four Seasons Hotel & Rooftop Aer', distance: '1.1 km', type: 'Lifestyle' },
      { name: 'Jaslok Hospital Pedder Road', distance: '4.5 km', type: 'Hospital' },
    ],
    agentContact: {
      name: 'Karan Malhotra',
      agency: 'CBRE Premier Residential Mumbai',
      phone: '+91 98334 11204',
      whatsapp: '919833411204',
      email: 'karan.malhotra@cbre.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      rating: 4.8,
      reviewCount: 51,
      reraRegistered: true,
    },
    loanDetails: {
      eligibleBanks: ['HDFC Bank Private Banking', 'ICICI Bank Wealth', 'Standard Chartered'],
      minDownPaymentPercent: 20,
      indicativeInterestRate: 8.45,
      estimatedEmi: 335000,
      maxTenureYears: 25,
    },
    isShortlisted: true,
    potentialScore: 92,
    aiInsights: {
      architecturalCharacter: 'Modern coastal high-rise layout with expansive floor-to-ceiling curtain wall glazing and deep balcony spans.',
      renovationPotential: 'High. Partition between kitchen and breakfast nook can be replaced with fluted pocket glass sliding doors.',
      estimatedRenovationCost: '₹35,00,000 – ₹45,00,000 for ultra-luxury bespoke styling.',
    },
  },
  {
    id: 'prop_sohna_penthouse',
    title: 'DLF The Camellias — 4 BHK Signature Golf Course Penthouse',
    listingType: 'For Sale',
    price: 55000000,
    currency: 'INR',
    location: 'Golf Course Road, Sector 42',
    city: 'Delhi NCR',
    country: 'India',
    bedrooms: 4,
    bathrooms: 5,
    builtUpArea: 4200,
    carpetArea: 3480,
    superBuiltUpArea: 4650,
    pricePerSqft: 13095,
    landArea: 0,
    parkingSpaces: 4,
    tenure: 'Freehold',
    reraId: 'HRERA-PKL-GGM-1092-2018',
    possessionStatus: 'Ready to Move',
    possessionDate: 'Ready Immediate',
    developerName: 'DLF Limited',
    developerExperience: '75+ Years of Real Estate Legacy',
    bhkType: '4 BHK Luxury Penthouse',
    floorNumber: '21st of 32 Floors',
    facing: 'North-East',
    furnishingStatus: 'Semi-Furnished',
    coordinates: { lat: 28.4595, lng: 77.0988 },
    mapAddress: 'Golf Course Rd, DLF Phase 5, Sector 42, Gurugram, Haryana 122002',
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Ultra-exclusive residence overlooking the PGA standard Arnold Palmer and Gary Player Golf Courses. Designed by Hafeez Contractor with interiors by Yabu Pushelberg. Features 12ft clear floor-to-ceiling heights.',
    amenities: [
      '18-Hole Championship Golf Course View',
      '7-Star Clubhouse with Michelin-Grade Dining',
      'Olympic Size Indoor & Outdoor Pools',
      'Helicopter Ambulance Evacuation Helipad',
      '4 Reserved EV-Ready Basement Parking Lots',
      'Double Skin Thermal Insulation & Acoustic Barrier',
    ],
    nearbyPlaces: [
      { name: 'Sector 42-43 Rapid Metro Station', distance: '500 m', type: 'Transit' },
      { name: 'One Horizon Center Corporate Hub', distance: '1.2 km', type: 'IT Hub' },
      { name: 'Fortis Memorial Research Institute', distance: '4.2 km', type: 'Hospital' },
      { name: 'Indira Gandhi International Airport (T3)', distance: '14.5 km', type: 'Airport' },
    ],
    agentContact: {
      name: 'Vikramaditya Oberoi',
      agency: 'DLF Private Estates Division',
      phone: '+91 98111 87654',
      whatsapp: '919811187654',
      email: 'oberoi-vikram@dlfestates.com',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      rating: 4.9,
      reviewCount: 64,
      reraRegistered: true,
    },
    loanDetails: {
      eligibleBanks: ['SBI Wealth Home Loans', 'HDFC Bank', 'ICICI Bank Private', 'HSBC Premier'],
      minDownPaymentPercent: 20,
      indicativeInterestRate: 8.4,
      estimatedEmi: 380000,
      maxTenureYears: 25,
    },
    isShortlisted: false,
    potentialScore: 96,
    aiInsights: {
      architecturalCharacter: 'Contemporary grand-scale column-free living pavilion with uninterrupted 60ft wraparound glass terrace.',
      renovationPotential: 'High. Integrate custom concealed acoustic panelling and multi-zone smart circadian architectural lighting.',
      estimatedRenovationCost: '₹40,00,000 – ₹55,00,000',
    },
  },
  {
    id: 'prop_jubilee_hills_mansion',
    title: 'Aparna One — 4 BHK Smart Green Automation Villa',
    listingType: 'For Sale',
    price: 26000000,
    currency: 'INR',
    location: 'Road No. 36, Jubilee Hills',
    city: 'Hyderabad',
    country: 'India',
    bedrooms: 4,
    bathrooms: 4,
    builtUpArea: 3450,
    carpetArea: 2890,
    superBuiltUpArea: 3700,
    pricePerSqft: 7536,
    landArea: 4200,
    parkingSpaces: 3,
    tenure: 'Freehold',
    reraId: 'P02400000543',
    possessionStatus: 'Under Construction',
    possessionDate: 'November 2026',
    developerName: 'Aparna Enterprises & Constructions',
    developerExperience: '28+ Years • 60+ Million sq ft Delivered',
    bhkType: '4 BHK Luxury Sky Villa',
    floorNumber: '12th of 36 Floors',
    facing: 'East',
    furnishingStatus: 'Semi-Furnished',
    coordinates: { lat: 17.4319, lng: 78.4073 },
    mapAddress: 'Road Number 36, Jubilee Hills, Hyderabad, Telangana 500033',
    coverImage: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'IGBC Platinum Certified ultra-luxury smart apartment with AI-based climate control, touchless elevator access, biometric security, and 80% open landscaped area overlooking KBR National Park.',
    amenities: [
      'IGBC Platinum Green Building',
      'Voice-Controlled Home Automation',
      'Temperature Controlled Swimming Pool',
      'Private Banquet Hall & Library',
      '100% DG Power Backup with Sound Attenuation',
      'Water Softener & RO Water System',
    ],
    nearbyPlaces: [
      { name: 'Jubilee Hills Check Post Metro Station', distance: '1.1 km', type: 'Transit' },
      { name: 'HITEC City Cyber Towers', distance: '4.5 km', type: 'IT Hub' },
      { name: 'Apollo Health City Jubilee Hills', distance: '2.3 km', type: 'Hospital' },
      { name: 'KBR National Park Walking Trail', distance: '850 m', type: 'Park' },
    ],
    agentContact: {
      name: 'Ananya Reddy',
      agency: 'JLL Hyderabad Residential',
      phone: '+91 99490 55432',
      whatsapp: '919949055432',
      email: 'ananya.reddy@jll.com',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
      rating: 4.9,
      reviewCount: 37,
      reraRegistered: true,
    },
    loanDetails: {
      eligibleBanks: ['State Bank of India', 'HDFC Bank', 'Axis Bank', 'Canara Bank'],
      minDownPaymentPercent: 20,
      indicativeInterestRate: 8.4,
      estimatedEmi: 179500,
      maxTenureYears: 30,
    },
    isShortlisted: true,
    potentialScore: 91,
    aiInsights: {
      architecturalCharacter: 'Energy-efficient aerodynamic building orientation with deep overhangs reducing heat ingress by 32%.',
      renovationPotential: 'High. Space layout includes convertible study room that can become a high-end sound-treated podcast/home theater suite.',
      estimatedRenovationCost: '₹22,00,000 – ₹28,00,000',
    },
  },
  {
    id: 'prop_koregaon_residence',
    title: 'Panchshil Waterfront — 3 BHK Designer Riverfront Residence',
    listingType: 'For Sale',
    price: 17500000,
    currency: 'INR',
    location: 'Lane 7, Koregaon Park',
    city: 'Pune',
    country: 'India',
    bedrooms: 3,
    bathrooms: 3,
    builtUpArea: 2150,
    carpetArea: 1780,
    superBuiltUpArea: 2300,
    pricePerSqft: 8139,
    landArea: 0,
    parkingSpaces: 2,
    tenure: 'Freehold',
    reraId: 'P52100019280',
    possessionStatus: 'Ready to Move',
    possessionDate: 'Ready Immediate',
    developerName: 'Panchshil Realty',
    developerExperience: '22+ Years • Known for YOO Pune & Trump Towers',
    bhkType: '3 BHK Waterfront Suite',
    floorNumber: '8th of 16 Floors',
    facing: 'North',
    furnishingStatus: 'Semi-Furnished',
    coordinates: { lat: 18.5362, lng: 73.8940 },
    mapAddress: 'Lane 7, Koregaon Park Annexe, Pune, Maharashtra 411001',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Boutique riverfront luxury apartment in Pune’s most coveted cultural and culinary neighborhood. Features Italian marble flooring, double-height covered veranda, Kohler artist edition bathroom suites, and smart climate control.',
    amenities: [
      'Serene Riverfront Promenade View',
      'Infinity Lap Pool on Podium Level',
      'Fitness Center by Technogym',
      '2 Dedicated Covered Basement Car Parks',
      'Multi-Tier 24/7 Security & CCTV',
      'Full DG Power Backup for Air Conditioning',
    ],
    nearbyPlaces: [
      { name: 'Kalyani Nagar Metro Station', distance: '1.2 km', type: 'Transit' },
      { name: 'Osho International Meditation Resort', distance: '900 m', type: 'Lifestyle' },
      { name: 'EON IT Park Kharadi', distance: '6.5 km', type: 'IT Hub' },
      { name: 'Pune International Airport (PNQ)', distance: '5.2 km', type: 'Airport' },
    ],
    agentContact: {
      name: 'Sunil Kothari',
      agency: 'Panchshil Signature Sales',
      phone: '+91 98220 89123',
      whatsapp: '919822089123',
      email: 'sunil.kothari@panchshil.com',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
      rating: 4.8,
      reviewCount: 29,
      reraRegistered: true,
    },
    loanDetails: {
      eligibleBanks: ['HDFC Bank', 'State Bank of India', 'Axis Bank', 'Bank of Baroda'],
      minDownPaymentPercent: 20,
      indicativeInterestRate: 8.4,
      estimatedEmi: 120800,
      maxTenureYears: 30,
    },
    isShortlisted: false,
    potentialScore: 90,
    aiInsights: {
      architecturalCharacter: 'Nordic-influenced modern minimal architectural envelope with floor-to-ceiling glass river view bays.',
      renovationPotential: 'High. Master bath layout allows double-basin vanity and frameless rain shower partition.',
      estimatedRenovationCost: '₹15,00,000 – ₹20,00,000',
    },
  },
];

export const INITIAL_PROFESSIONALS: Professional[] = [
  {
    id: 'prof_elena_rostova',
    name: 'Elena Rostova',
    role: 'Principal Architect',
    firm: 'Studio Forma Architecture',
    location: 'Bangalore & Singapore',
    rating: 4.9,
    reviewCount: 38,
    verified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    portfolioImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
    ],
    hourlyRate: 3500,
    currency: 'INR',
    specializations: ['Tropical Modernism', 'Sustainable Renovations', 'Planning Submissions'],
    bio: 'Award-winning architect with 14 years experience specializing in modern residential transformations that connect indoor and outdoor spaces.',
    phone: '+91 98765 43210',
    email: 'elena@studioforma.arch',
    completedProjects: 47,
  },
  {
    id: 'prof_marcus_vance',
    name: 'Marcus Vance',
    role: 'Interior Designer',
    firm: 'Vance Design Lab',
    location: 'Bangalore / Mumbai',
    rating: 5.0,
    reviewCount: 52,
    verified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    portfolioImages: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
    ],
    hourlyRate: 2800,
    currency: 'INR',
    specializations: ['Japandi Interiors', 'Bespoke Joinery', 'Smart Lighting Systems'],
    bio: 'Dedicated to warm minimalism and sensory material palettes. Featured in Architectural Digest and Dwell.',
    phone: '+91 98765 43211',
    email: 'marcus@vancedesign.in',
    completedProjects: 65,
  },
  {
    id: 'prof_david_chen',
    name: 'David Chen',
    role: 'General Contractor',
    firm: 'Apex Civil Builders',
    location: 'Bangalore / Pan-India',
    rating: 4.9,
    reviewCount: 84,
    verified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    portfolioImages: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=600&q=80',
    ],
    hourlyRate: 1800,
    currency: 'INR',
    specializations: ['Structural Retrofitting', 'Turnkey Renovation', 'ISO 9001 Certified'],
    bio: 'Over 20 years executing structural expansions, MEP coordination, and high-finish residential construction with strict timeline guarantees.',
    phone: '+91 98765 43212',
    email: 'david@apexbuilders.in',
    completedProjects: 120,
  },
];

export const INITIAL_TASKS: ProjectTask[] = [
  {
    id: 'task_1',
    projectId: 'proj_modern_terrace',
    title: 'Finalize flooring material selection',
    category: 'Finishes',
    dueDate: '2025-05-15',
    status: 'Pending',
    priority: 'High',
  },
  {
    id: 'task_2',
    projectId: 'proj_modern_terrace',
    title: 'Air conditioning system brand & quote review',
    category: 'M&E',
    dueDate: '2025-05-20',
    status: 'Pending',
    priority: 'Medium',
  },
  {
    id: 'task_3',
    projectId: 'proj_modern_terrace',
    title: 'Smart home system wiring specifications',
    category: 'Electrical',
    dueDate: '2025-05-28',
    status: 'Pending',
    priority: 'Medium',
  },
  {
    id: 'task_4',
    projectId: 'proj_modern_terrace',
    title: 'Review 2D conceptual floor plan with architect',
    category: 'Planning',
    dueDate: '2025-04-10',
    status: 'Completed',
    priority: 'High',
  },
];

export const INITIAL_MAINTENANCE: MaintenanceTask[] = [
  {
    id: 'maint_1',
    projectId: 'proj_modern_terrace',
    title: 'Air Conditioner Filter & Coil Servicing',
    category: 'HVAC',
    frequency: 'Quarterly',
    dueDate: '2025-06-15',
    status: 'Pending',
    priority: 'Medium',
    notes: 'Service chemical wash for 4 inverter split units across Living & Bedrooms.',
  },
  {
    id: 'maint_2',
    projectId: 'proj_modern_terrace',
    title: 'Main Water Filtration Cartridge Replacement',
    category: 'Plumbing',
    frequency: 'Bi-annually',
    dueDate: '2025-07-01',
    status: 'Pending',
    priority: 'High',
    notes: 'Replace multi-stage membrane filter at incoming municipal supply.',
  },
  {
    id: 'maint_3',
    projectId: 'proj_modern_terrace',
    title: 'Roof & Valley Gutter Drainage Inspection',
    category: 'Exterior',
    frequency: 'Annually',
    dueDate: '2025-09-10',
    status: 'Pending',
    priority: 'Low',
    notes: 'Clear leaves and inspect flashing before monsoon season.',
  },
];

export const INITIAL_DOCUMENTS: ProjectDocument[] = [
  {
    id: 'doc_1',
    projectId: 'proj_modern_terrace',
    title: 'Approved_Floor_Plan_v2.pdf',
    category: 'Floor Plans',
    fileSize: '4.2 MB',
    fileType: 'PDF',
    fileUrl: '#',
    uploadedAt: '2025-03-20',
    uploadedBy: 'Elena Rostova',
  },
  {
    id: 'doc_2',
    projectId: 'proj_modern_terrace',
    title: 'Apex_Builders_Civil_Contract_Final.pdf',
    category: 'Contracts',
    fileSize: '1.8 MB',
    fileType: 'PDF',
    fileUrl: '#',
    uploadedAt: '2025-03-25',
    uploadedBy: 'Sarah Chen',
  },
  {
    id: 'doc_3',
    projectId: 'proj_modern_terrace',
    title: 'City_Council_Renovation_Permit.pdf',
    category: 'Permits',
    fileSize: '890 KB',
    fileType: 'PDF',
    fileUrl: '#',
    uploadedAt: '2025-04-02',
    uploadedBy: 'Apex Civil Builders',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'AI Design Generation Complete',
    message: 'Your Living Room concept "Natural Modern" is ready with 4 variations.',
    timestamp: '10m ago',
    read: false,
    type: 'design',
    linkRoute: '/app/designs/des_modern_living',
  },
  {
    id: 'notif_2',
    title: 'Budget Allocation Update',
    message: '46% of budget ₹28,50,000 is now allocated across committed construction lots.',
    timestamp: '2h ago',
    read: false,
    type: 'budget',
    linkRoute: '/app/budget',
  },
  {
    id: 'notif_3',
    title: 'Flooring Task Due in 3 Days',
    message: 'Task: Finalize flooring material selection is pending confirmation.',
    timestamp: '1d ago',
    read: true,
    type: 'task',
    linkRoute: '/app/projects/proj_modern_terrace',
  },
];

// ==========================================
// REACTIVE CENTRAL STORE
// ==========================================

const STORE_SEED_VERSION = 'v4_sample_room_3d_360';

const STORAGE_KEYS = {
  USER: 'archmind_user_session',
  ACTIVE_PROJECT_ID: 'archmind_active_project_id',
  PROJECTS: 'archmind_projects',
  BUDGET_ITEMS: 'archmind_budget_items',
  DESIGNS: 'archmind_designs',
  FLOOR_PLANS: 'archmind_floor_plans',
  PRODUCTS: 'archmind_products',
  PROPERTIES: 'archmind_properties',
  TASKS: 'archmind_tasks',
  MAINTENANCE: 'archmind_maintenance',
  DOCUMENTS: 'archmind_documents',
  INQUIRIES: 'archmind_inquiries',
  NOTIFICATIONS: 'archmind_notifications',
  SPACE_ANALYSIS: 'archmind_space_analysis',
};

class ArchMindStore {
  private user: UserSession = INITIAL_USER;
  private activeProjectId: string = 'proj_modern_terrace';
  private projects: Project[] = INITIAL_PROJECTS;
  private budgetItems: BudgetItem[] = INITIAL_BUDGET_ITEMS;
  private assumptions: BudgetAssumption[] = INITIAL_ASSUMPTIONS;
  private costSavings: CostSavingSuggestion[] = INITIAL_COST_SAVINGS;
  private designs: DesignConcept[] = INITIAL_DESIGN_CONCEPTS;
  private floorPlans: FloorPlanConcept[] = INITIAL_FLOOR_PLANS;
  private products: Product[] = INITIAL_PRODUCTS;
  private properties: Property[] = INITIAL_PROPERTIES;
  private professionals: Professional[] = INITIAL_PROFESSIONALS;
  private tasks: ProjectTask[] = INITIAL_TASKS;
  private maintenance: MaintenanceTask[] = INITIAL_MAINTENANCE;
  private documents: ProjectDocument[] = INITIAL_DOCUMENTS;
  private inquiries: ProfessionalInquiry[] = [];
  private notifications: NotificationItem[] = INITIAL_NOTIFICATIONS;
  private currentSpaceAnalysis: SpaceAnalysis | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      // Automatic migration to fresh Indian Rupee seed data
      const storedVersion = localStorage.getItem('archmind_seed_version');
      if (storedVersion !== STORE_SEED_VERSION) {
        Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
        localStorage.setItem('archmind_seed_version', STORE_SEED_VERSION);
        this.persist();
        return;
      }

      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) this.user = JSON.parse(storedUser);

      const storedActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT_ID);
      if (storedActiveId) this.activeProjectId = storedActiveId;

      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (storedProjects) this.projects = JSON.parse(storedProjects);

      const storedBudget = localStorage.getItem(STORAGE_KEYS.BUDGET_ITEMS);
      if (storedBudget) this.budgetItems = JSON.parse(storedBudget);

      const storedDesigns = localStorage.getItem(STORAGE_KEYS.DESIGNS);
      if (storedDesigns) this.designs = JSON.parse(storedDesigns);

      const storedFloorPlans = localStorage.getItem(STORAGE_KEYS.FLOOR_PLANS);
      if (storedFloorPlans) this.floorPlans = JSON.parse(storedFloorPlans);

      const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (storedProducts) this.products = JSON.parse(storedProducts);

      const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (storedTasks) this.tasks = JSON.parse(storedTasks);

      const storedMaintenance = localStorage.getItem(STORAGE_KEYS.MAINTENANCE);
      if (storedMaintenance) this.maintenance = JSON.parse(storedMaintenance);

      const storedDocs = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      if (storedDocs) this.documents = JSON.parse(storedDocs);

      const storedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (storedNotifs) this.notifications = JSON.parse(storedNotifs);

      const storedAnalysis = localStorage.getItem(STORAGE_KEYS.SPACE_ANALYSIS);
      if (storedAnalysis) this.currentSpaceAnalysis = JSON.parse(storedAnalysis);
    } catch (e) {
      console.warn('Could not read from localStorage, using initial memory state', e);
    }
  }

  private persist() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, this.activeProjectId);
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(this.projects));
      localStorage.setItem(STORAGE_KEYS.BUDGET_ITEMS, JSON.stringify(this.budgetItems));
      localStorage.setItem(STORAGE_KEYS.DESIGNS, JSON.stringify(this.designs));
      localStorage.setItem(STORAGE_KEYS.FLOOR_PLANS, JSON.stringify(this.floorPlans));
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(this.products));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(this.tasks));
      localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(this.maintenance));
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(this.documents));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
      if (this.currentSpaceAnalysis) {
        localStorage.setItem(STORAGE_KEYS.SPACE_ANALYSIS, JSON.stringify(this.currentSpaceAnalysis));
      }
    } catch (e) {
      console.warn('Could not persist to localStorage', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.persist();
    this.listeners.forEach((fn) => fn());
  }

  // ------------------------------------------
  // GETTERS
  // ------------------------------------------

  public getUser(): UserSession {
    return this.user;
  }

  public setUser(user: UserSession) {
    this.user = user;
    this.notify();
  }

  public getActiveProjectId(): string {
    return this.activeProjectId;
  }

  public setActiveProjectId(id: string) {
    if (this.projects.some((p) => p.id === id)) {
      this.activeProjectId = id;
      this.notify();
    }
  }

  public getActiveProject(): Project | undefined {
    return this.projects.find((p) => p.id === this.activeProjectId) || this.projects[0];
  }

  public getProjects(): Project[] {
    return this.projects;
  }

  public getProject(id: string): Project | undefined {
    return this.projects.find((p) => p.id === id);
  }

  // ------------------------------------------
  // PROJECT MUTATIONS
  // ------------------------------------------

  public addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const id = `proj_${Date.now()}`;
    const newProject: Project = {
      ...project,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projects.push(newProject);
    this.activeProjectId = id;
    this.notify();
    return newProject;
  }

  public updateProject(id: string, updates: Partial<Project>) {
    this.projects = this.projects.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    this.notify();
  }

  public deleteProject(id: string) {
    this.projects = this.projects.filter((p) => p.id !== id);
    if (this.activeProjectId === id && this.projects.length > 0) {
      this.activeProjectId = this.projects[0].id;
    }
    this.notify();
  }

  // ------------------------------------------
  // BUDGET & COST ITEMS
  // ------------------------------------------

  public getBudgetItems(projectId = this.activeProjectId): BudgetItem[] {
    return this.budgetItems.filter((b) => b.projectId === projectId);
  }

  public addBudgetItem(item: Omit<BudgetItem, 'id' | 'createdAt' | 'updatedAt' | 'totalCost'>): BudgetItem {
    const totalCost = Number(item.quantity) * Number(item.unitCost);
    const newItem: BudgetItem = {
      ...item,
      id: `cost_${Date.now()}`,
      totalCost,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.budgetItems.push(newItem);
    this.notify();
    return newItem;
  }

  public updateBudgetItem(id: string, updates: Partial<BudgetItem>) {
    this.budgetItems = this.budgetItems.map((item) => {
      if (item.id === id) {
        const merged = { ...item, ...updates, updatedAt: new Date().toISOString() };
        merged.totalCost = Number(merged.quantity) * Number(merged.unitCost);
        return merged;
      }
      return item;
    });
    this.notify();
  }

  public deleteBudgetItem(id: string) {
    this.budgetItems = this.budgetItems.filter((i) => i.id !== id);
    this.notify();
  }

  public getAssumptions(projectId = this.activeProjectId): BudgetAssumption[] {
    return this.assumptions.filter((a) => a.projectId === projectId);
  }

  public getCostSavings(): CostSavingSuggestion[] {
    return this.costSavings;
  }

  // Deterministic summary calculation
  public getBudgetSummary(projectId = this.activeProjectId) {
    const project = this.getProject(projectId);
    const items = this.getBudgetItems(projectId);
    const totalEstimated = items.reduce((sum, item) => sum + item.totalCost, 0);
    const committedOrPaid = items
      .filter((i) => i.status === 'Committed' || i.status === 'Paid')
      .reduce((sum, item) => sum + item.totalCost, 0);

    const builtUpArea = project?.builtUpArea || 2280;
    const costPerSqft = Math.round(totalEstimated / (builtUpArea || 1));
    const budgetLimit = project?.budgetLimit || 285000;
    const allocatedPercentage = Math.round((committedOrPaid / (budgetLimit || 1)) * 100);

    // Categories breakdown
    const categoryTotals: Record<string, number> = {};
    items.forEach((item) => {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.totalCost;
    });

    return {
      totalEstimated,
      budgetLimit,
      committedOrPaid,
      costPerSqft,
      allocatedPercentage,
      itemCount: items.length,
      categoryTotals,
    };
  }

  // ------------------------------------------
  // AI DESIGNS & CONCEPTS
  // ------------------------------------------

  public getDesigns(projectId = this.activeProjectId): DesignConcept[] {
    return this.designs.filter((d) => d.projectId === projectId);
  }

  public getDesign(id: string): DesignConcept | undefined {
    return this.designs.find((d) => d.id === id);
  }

  public saveDesign(design: Omit<DesignConcept, 'id' | 'createdAt' | 'updatedAt'>): DesignConcept {
    const newDesign: DesignConcept = {
      ...design,
      id: `des_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.designs.push(newDesign);
    this.notify();
    return newDesign;
  }

  public updateDesign(id: string, updates: Partial<DesignConcept>) {
    this.designs = this.designs.map((d) =>
      d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
    );
    this.notify();
  }

  // ------------------------------------------
  // SPACE ANALYSIS
  // ------------------------------------------

  public getLatestSpaceAnalysis(): SpaceAnalysis | null {
    return this.currentSpaceAnalysis;
  }

  public saveSpaceAnalysis(analysis: SpaceAnalysis) {
    this.currentSpaceAnalysis = analysis;
    this.notify();
  }

  // ------------------------------------------
  // FLOOR PLANS
  // ------------------------------------------

  public getFloorPlans(projectId = this.activeProjectId): FloorPlanConcept[] {
    return this.floorPlans.filter((fp) => fp.projectId === projectId);
  }

  public getFloorPlan(id: string): FloorPlanConcept | undefined {
    return this.floorPlans.find((fp) => fp.id === id);
  }

  public saveFloorPlan(concept: Omit<FloorPlanConcept, 'id' | 'createdAt'>): FloorPlanConcept {
    const newPlan: FloorPlanConcept = {
      ...concept,
      id: `plan_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.floorPlans.push(newPlan);
    this.notify();
    return newPlan;
  }

  // ------------------------------------------
  // PRODUCTS & MATERIALS
  // ------------------------------------------

  public getProducts(): Product[] {
    return this.products;
  }

  public getProduct(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  public toggleProductSave(productId: string) {
    this.products = this.products.map((p) =>
      p.id === productId ? { ...p, isSavedToProject: !p.isSavedToProject } : p
    );
    this.notify();
  }

  public addProductToBudget(productId: string, quantity = 1, projectId = this.activeProjectId) {
    const product = this.getProduct(productId);
    if (!product) return;

    // Check if category exists
    let cat: any = 'Furnishing';
    if (product.category === 'Wall Materials' || product.category === 'Flooring' || product.category === 'Finishes') {
      cat = 'Construction';
    } else if (product.category === 'Lighting' || product.category === 'Kitchen & Bath') {
      cat = 'Fixtures & Fittings';
    }

    this.addBudgetItem({
      projectId,
      name: `${product.name} (${product.brand})`,
      category: cat,
      unit: product.unit || 'item',
      quantity,
      unitCost: product.priceMin,
      status: 'Estimated',
      supplier: product.brand,
      relatedProductId: product.id,
      notes: `Added from Products catalog: ${product.material}, ${product.style} style.`,
    });

    this.toggleProductSave(productId);
  }

  // ------------------------------------------
  // PROPERTIES & SHORTLIST
  // ------------------------------------------

  public getProperties(): Property[] {
    return this.properties;
  }

  public getProperty(id: string): Property | undefined {
    return this.properties.find((p) => p.id === id);
  }

  public togglePropertyShortlist(id: string) {
    this.properties = this.properties.map((p) =>
      p.id === id ? { ...p, isShortlisted: !p.isShortlisted } : p
    );
    this.notify();
  }

  public addPropertyToProject(propertyId: string, projectId = this.activeProjectId) {
    const property = this.getProperty(propertyId);
    if (!property) return;
    this.updateProject(projectId, {
      associatedPropertyId: property.id,
      location: property.location,
      builtUpArea: property.builtUpArea,
      landArea: property.landArea,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
    });
  }

  // ------------------------------------------
  // PROFESSIONALS & INQUIRIES
  // ------------------------------------------

  public getProfessionals(): Professional[] {
    return this.professionals;
  }

  public getProfessional(id: string): Professional | undefined {
    return this.professionals.find((p) => p.id === id);
  }

  public submitInquiry(inquiry: Omit<ProfessionalInquiry, 'id' | 'createdAt' | 'status'>): ProfessionalInquiry {
    const newInquiry: ProfessionalInquiry = {
      ...inquiry,
      id: `inq_${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    this.inquiries.push(newInquiry);
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      title: 'Inquiry Sent Successfully',
      message: `Your project inquiry for ${inquiry.serviceRequested} was registered.`,
      timestamp: 'Just now',
      read: false,
      type: 'inquiry',
      linkRoute: '/app/professionals',
    });
    this.notify();
    return newInquiry;
  }

  // ------------------------------------------
  // TASKS & MAINTENANCE
  // ------------------------------------------

  public getTasks(projectId = this.activeProjectId): ProjectTask[] {
    return this.tasks.filter((t) => t.projectId === projectId);
  }

  public addTask(task: Omit<ProjectTask, 'id'>): ProjectTask {
    const newTask: ProjectTask = {
      ...task,
      id: `task_${Date.now()}`,
    };
    this.tasks.push(newTask);
    this.notify();
    return newTask;
  }

  public toggleTaskStatus(id: string) {
    this.tasks = this.tasks.map((t) => {
      if (t.id === id) {
        const nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
        return {
          ...t,
          status: nextStatus,
          completedAt: nextStatus === 'Completed' ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });
    this.notify();
  }

  public deleteTask(id: string) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.notify();
  }

  public getMaintenance(projectId = this.activeProjectId): MaintenanceTask[] {
    return this.maintenance.filter((m) => m.projectId === projectId);
  }

  public toggleMaintenanceStatus(id: string) {
    this.maintenance = this.maintenance.map((m) =>
      m.id === id
        ? {
            ...m,
            status: m.status === 'Completed' ? 'Pending' : 'Completed',
            lastCompletedDate: m.status === 'Pending' ? new Date().toISOString().split('T')[0] : m.lastCompletedDate,
          }
        : m
    );
    this.notify();
  }

  // ------------------------------------------
  // DOCUMENTS
  // ------------------------------------------

  public getDocuments(projectId = this.activeProjectId): ProjectDocument[] {
    return this.documents.filter((d) => d.projectId === projectId);
  }

  public addDocument(doc: Omit<ProjectDocument, 'id' | 'uploadedAt'>): ProjectDocument {
    const newDoc: ProjectDocument = {
      ...doc,
      id: `doc_${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    this.documents.push(newDoc);
    this.notify();
    return newDoc;
  }

  public deleteDocument(id: string) {
    this.documents = this.documents.filter((d) => d.id !== id);
    this.notify();
  }

  // ------------------------------------------
  // NOTIFICATIONS
  // ------------------------------------------

  public getNotifications(): NotificationItem[] {
    return this.notifications;
  }

  public markNotificationRead(id: string) {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.notify();
  }

  public markAllNotificationsRead() {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    this.notify();
  }

  // ------------------------------------------
  // RESET TO DEMO / PURGE
  // ------------------------------------------

  public resetToDemo() {
    this.user = INITIAL_USER;
    this.activeProjectId = 'proj_modern_terrace';
    this.projects = INITIAL_PROJECTS;
    this.budgetItems = INITIAL_BUDGET_ITEMS;
    this.assumptions = INITIAL_ASSUMPTIONS;
    this.costSavings = INITIAL_COST_SAVINGS;
    this.designs = INITIAL_DESIGN_CONCEPTS;
    this.floorPlans = INITIAL_FLOOR_PLANS;
    this.products = INITIAL_PRODUCTS;
    this.properties = INITIAL_PROPERTIES;
    this.professionals = INITIAL_PROFESSIONALS;
    this.tasks = INITIAL_TASKS;
    this.maintenance = INITIAL_MAINTENANCE;
    this.documents = INITIAL_DOCUMENTS;
    this.notifications = INITIAL_NOTIFICATIONS;
    this.inquiries = [];
    this.notify();
  }
}

export const archMindStore = new ArchMindStore();

// ==========================================
// ARCHMIND — CORE APPLICATION TYPE DEFINITIONS
// ==========================================

export type AppRoute =
  | '/'
  | '/signin'
  | '/signup'
  | '/forgot-password'
  | '/app/overview'
  | '/app/properties'
  | '/app/properties/:propertyId'
  | '/app/design-studio'
  | '/app/designs/:designId'
  | '/app/floor-plans'
  | '/app/projects'
  | '/app/projects/:projectId'
  | '/app/products'
  | '/app/products/:productId'
  | '/app/budget'
  | '/app/professionals'
  | '/app/professionals/:professionalId'
  | '/app/documents'
  | '/app/maintenance'
  | '/app/settings';

// Legacy compatibility for landing page router
export type Route = '/' | '/signin' | '/signup' | string;

export type UserRole = 'Homeowner' | 'Architect' | 'Designer' | 'Developer';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  preferredCurrency: 'USD' | 'MYR' | 'INR' | 'EUR' | 'GBP';
  unitSystem: 'sqft' | 'sqm';
  createdAt: string;
  provider: 'local-secure' | 'firebase' | 'google' | 'oidc';
  primaryInterest?: 'Redesign my room' | 'Find a property' | 'Plan a new home' | 'Manage renovation' | 'Explore ArchMind';
  token?: string;
}

export interface AppConfig {
  appName: string;
  tagline: string;
  coreMessage: string;
  mainAppUrl: string;
  authProvider: 'firebase' | 'custom' | 'unconfigured';
  version: string;
}

// ------------------------------------------
// PROJECT (CENTRAL ENTITY)
// ------------------------------------------

export type ProjectType =
  | 'Property Purchase'
  | 'Interior Redesign'
  | 'Renovation'
  | 'New Construction'
  | 'Furnishing'
  | 'Exterior Redesign'
  | 'General Home Project';

export type ProjectStatus =
  | 'Idea'
  | 'Planning'
  | 'In Progress'
  | 'On Hold'
  | 'Completed'
  | 'Archived';

export interface Project {
  id: string;
  name: string;
  description: string;
  projectType: ProjectType;
  status: ProjectStatus;
  location: string;
  currency: 'USD' | 'MYR' | 'INR' | 'EUR' | 'GBP';
  budgetLimit: number;
  builtUpArea: number; // in sqft
  landArea?: number; // in sqft
  floors?: number;
  bedrooms?: number;
  bathrooms?: number;
  startDate: string;
  targetCompletionDate: string;
  progressPercentage: number;
  coverImage: string;
  associatedPropertyId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------
// AI DESIGN STUDIO & CONCEPTS
// ------------------------------------------

export type RoomType =
  | 'Living Room'
  | 'Bedroom'
  | 'Kitchen'
  | 'Bathroom'
  | 'Dining Room'
  | 'Home Office'
  | 'Balcony'
  | 'Terrace'
  | 'Outdoor Space'
  | 'Other';

export type DesignStyle =
  | 'Modern'
  | 'Minimalist'
  | 'Scandinavian'
  | 'Japandi'
  | 'Contemporary'
  | 'Luxury'
  | 'Traditional'
  | 'Industrial'
  | 'Coastal'
  | 'Bohemian';

export type ColorPreference =
  | 'Neutral'
  | 'Warm'
  | 'Cool'
  | 'Earth Tones'
  | 'Bold'
  | 'Pastel'
  | 'Custom';

export type FunctionalNeed =
  | 'Relaxation'
  | 'Entertainment'
  | 'Work from home'
  | 'Family time'
  | 'Storage'
  | 'Reading'
  | 'Hosting guests'
  | 'Pet friendly'
  | 'Exercise / Wellness'
  | 'Kids play area'
  | 'Dining'
  | 'Accessibility';

export interface SmartSuggestion {
  id: string;
  title: string;
  description: string;
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  budgetCategory?: string;
  designImpact: 'High' | 'Medium' | 'Subtle';
  visibleEvidence?: string;
}

export interface SpaceAnalysis {
  id?: string;
  imageUrl?: string;
  detectedRoomType: string;
  architecturalStyle: string;
  confidence: number;
  analysisSummary: string;
  visibleFeatures: string[];
  doorsAndWindows: string;
  furnitureDetected: string[];
  dominantColors: string[];
  lighting: string;
  existingLayout: string;
  designOpportunities: string[];
  itemsLikelyPreserved: string[];
  spatialCharacteristics?: string;
  layoutDescription?: string;
  existingObjects?: {
    category: string;
    items: string[];
  }[];
  colorAnalysis?: {
    dominantColors: string[];
    secondaryColors: string[];
    suggestedComplementary: string[];
  };
  lightingAnalysis?: {
    naturalSources: string;
    artificialFixtures: string;
    darkSpots: string;
    recommendations: string;
  };
  spaceUtilization?: {
    circulation: string;
    storageOpportunities: string;
    unusedAreas: string;
    visualClutter: string;
  };
  observations?: {
    whatWorksWell: string[];
    areasForImprovement: string[];
    lightingNotes: string[];
    furnitureAndLayout: string[];
    materialsAndColors: string[];
    storageAndFunctionality: string[];
  };
  smartSuggestions?: SmartSuggestion[];
  limitationsNotice?: string;
  createdAt?: string;
}

export interface DesignVariation {
  id: string;
  name: string;
  tagline: string;
  imageUrl: string;
  style: DesignStyle;
  description?: string;
}

export interface DesignVersionHistory {
  id: string;
  versionNumber: number;
  imageUrl: string;
  prompt: string;
  timestamp: string;
  variationName: string;
  notes?: string;
}

export interface DesignConcept {
  id: string;
  projectId: string;
  roomId?: string;
  name: string;
  roomType: RoomType;
  style: DesignStyle;
  colorPreferences: ColorPreference[];
  budgetMin: number;
  budgetMax: number;
  functionalNeeds: string[];
  itemsToRetain: string[];
  additionalNotes: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  perspective3dUrl?: string;
  panorama360Url?: string;
  variations: DesignVariation[];
  selectedVariationId: string;
  designNotes: string;
  analysis?: SpaceAnalysis;
  colorPalette: { name: string; hex: string }[];
  materials: { category: string; name: string; checked: boolean }[];
  estimatedBudget: number;
  budgetBreakdown: {
    furniture: number;
    fixturesAndLighting: number;
    decorAndAccessories: number;
    renovation: number;
  };
  versionHistory?: DesignVersionHistory[];
  createdAt: string;
  updatedAt: string;
  versionNumber: number;
}

// ------------------------------------------
// FLOOR PLANS & PLANNING
// ------------------------------------------

export interface FloorLayoutGeometry {
  floorNumber: number;
  floorName: string;
  rooms: {
    id: string;
    name: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    doors?: { wall: 'north' | 'south' | 'east' | 'west'; offset: number }[];
    windows?: { wall: 'north' | 'south' | 'east' | 'west'; offset: number }[];
  }[];
}

export interface FloorPlanConcept {
  id: string;
  projectId: string;
  conceptNumber: number;
  name: string;
  tagline: string;
  isRecommended?: boolean;
  plotShape: 'Rectangular' | 'Irregular' | 'Custom';
  plotWidth: number;
  plotLength: number;
  totalPlotArea: number; // sqft
  builtUpArea: number; // sqft
  groundFloorArea: number;
  firstFloorArea: number;
  openSpaceArea: number; // sqft
  openSpacePercentage: number;
  builtUpPercentage: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  floors: number;
  familySize: string;
  specialRequirements: string[];
  notes?: string;
  groundFloorSvg?: string;
  firstFloorSvg?: string;
  groundFloorPlan: FloorLayoutGeometry;
  firstFloorPlan?: FloorLayoutGeometry;
  createdAt: string;
}

// ------------------------------------------
// PRODUCTS & MATERIALS
// ------------------------------------------

export type ProductCategory =
  | 'All'
  | 'Furniture'
  | 'Lighting'
  | 'Finishes'
  | 'Flooring'
  | 'Wall Materials'
  | 'Kitchen & Bath'
  | 'Decor'
  | 'Outdoor';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  priceMin: number;
  priceMax: number;
  currency: string;
  unit?: string;
  imageUrl: string;
  material: string;
  dimensions?: string;
  colors: string[];
  style: DesignStyle;
  roomTypes: RoomType[];
  matchType: 'Exact Match' | 'Similar Alternative';
  matchPercentage: number;
  vendorUrl: string;
  description: string;
  inStock: boolean;
  isSavedToProject?: boolean;
}

// ------------------------------------------
// BUDGET PLANNER
// ------------------------------------------

export type CostCategory =
  | 'Construction'
  | 'Furnishing'
  | 'Fixtures & Fittings'
  | 'Labour'
  | 'Contingency'
  | 'Design Fees'
  | 'Permits'
  | 'Other';

export type CostItemStatus = 'Estimated' | 'Committed' | 'Paid';

export interface BudgetItem {
  id: string;
  projectId: string;
  name: string;
  category: CostCategory;
  unit: string; // 'sqft', 'set', 'lot', 'item', 'm'
  quantity: number;
  unitCost: number;
  totalCost: number;
  status: CostItemStatus;
  supplier?: string;
  relatedProductId?: string;
  relatedDesignId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetAssumption {
  id: string;
  projectId: string;
  text: string;
  category: string;
}

export interface CostSavingSuggestion {
  id: string;
  title: string;
  description: string;
  savingAmount: number;
  imageUrl?: string;
  category: string;
}

// ------------------------------------------
// PROPERTIES
// ------------------------------------------

export interface Property {
  id: string;
  title: string;
  listingType: 'For Sale' | 'For Rent';
  price: number;
  currency: string;
  location: string;
  city: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  builtUpArea: number; // sqft
  landArea?: number; // sqft
  carpetArea?: number; // sqft
  superBuiltUpArea?: number; // sqft
  pricePerSqft?: number; // ₹ / sqft
  parkingSpaces: number;
  tenure: 'Freehold' | 'Leasehold';
  coverImage: string;
  galleryImages: string[];
  description: string;
  amenities: string[];
  nearbyPlaces: { name: string; distance: string; type: string }[];
  isShortlisted?: boolean;
  isDemoListing?: boolean;
  potentialScore: number;
  
  // Real Estate Extensions
  reraId?: string;
  possessionStatus?: 'Ready to Move' | 'Under Construction' | 'New Launch';
  possessionDate?: string;
  developerName?: string;
  developerExperience?: string;
  bhkType?: string;
  floorNumber?: string;
  facing?: 'East' | 'North' | 'North-East' | 'West';
  furnishingStatus?: 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished';
  coordinates?: { lat: number; lng: number };
  mapAddress?: string;
  agentContact?: {
    name: string;
    agency: string;
    phone: string;
    whatsapp: string;
    email: string;
    avatarUrl: string;
    rating: number;
    reviewCount: number;
    reraRegistered: boolean;
  };
  loanDetails?: {
    eligibleBanks: string[];
    minDownPaymentPercent: number;
    indicativeInterestRate: number;
    estimatedEmi: number;
    maxTenureYears: number;
  };
  aiInsights?: {
    architecturalCharacter: string;
    renovationPotential: string;
    estimatedRenovationCost: string;
  };
}

// ------------------------------------------
// PROFESSIONALS
// ------------------------------------------

export type ProfessionalRole =
  | 'Principal Architect'
  | 'Architect'
  | 'Interior Designer'
  | 'Structural Engineer'
  | 'Civil Engineer'
  | 'General Contractor'
  | 'Landscape Architect'
  | 'Renovation Specialist'
  | 'Electrician'
  | 'Plumber';

export interface Professional {
  id: string;
  name: string;
  role: ProfessionalRole;
  firm: string;
  location: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  avatarUrl: string;
  coverImage?: string;
  portfolioImages: string[];
  hourlyRate: number;
  currency: string;
  specializations: string[];
  bio: string;
  phone: string;
  email: string;
  completedProjects: number;
}

export interface ProfessionalInquiry {
  id: string;
  projectId: string;
  professionalId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceRequested: string;
  message: string;
  status: 'Pending' | 'Contacted' | 'Booked' | 'Closed';
  createdAt: string;
}

// ------------------------------------------
// DOCUMENTS
// ------------------------------------------

export type DocumentCategory =
  | 'Floor Plans'
  | 'Quotations'
  | 'Contracts'
  | 'Permits'
  | 'Receipts'
  | 'Invoices'
  | 'Design References'
  | 'Other';

export interface ProjectDocument {
  id: string;
  projectId: string;
  title: string;
  category: DocumentCategory;
  fileSize: string;
  fileType: string;
  fileUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

// ------------------------------------------
// TASKS & MAINTENANCE
// ------------------------------------------

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  category: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  assignedTo?: string;
  completedAt?: string;
}

export interface MaintenanceTask {
  id: string;
  projectId: string;
  title: string;
  category: 'HVAC' | 'Plumbing' | 'Electrical' | 'Finishes' | 'Appliances' | 'Exterior';
  frequency: 'Monthly' | 'Quarterly' | 'Bi-annually' | 'Annually';
  dueDate: string;
  status: 'Pending' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  notes: string;
  lastCompletedDate?: string;
}

// ------------------------------------------
// NOTIFICATIONS & SEARCH
// ------------------------------------------

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'design' | 'budget' | 'task' | 'inquiry' | 'maintenance' | 'system';
  linkRoute?: string;
}

// ------------------------------------------
// AI COPILOT
// ------------------------------------------

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  actionTaken?: {
    type: 'add_task' | 'add_budget_item' | 'navigate' | 'update_budget';
    payload: any;
    label: string;
  };
}

# ArchMind — From Dream to Home, Powered by AI

> **Imagine It. Design It. Live It.**  
> *Core USP: See it. Design it. Buy it.*

ArchMind is a full-stack, connected architectural and renovation platform. It unifies the entire residential lifecycle around a central **Project** entity—from property discovery and multimodal space analysis to generative AI interior design, 2D floor plans, curated material catalogs, and deterministic budget planning.

---

## 📸 Key Modules Implemented (Matching 10 Reference Specifications)

1. **Public Landing Page (`/`)**: High-performance 300-frame scroll-based architectural background animation rendered on a High-DPI canvas with floating typography.
2. **Overview Dashboard (`/app/overview`)**: Real-time project statistics, $285,000 budget tracking, Recent Projects cards with progress bars, and AI Studio quick launch.
3. **AI Design Studio (`/app/design-studio`)**: 8-step structured vision builder (Photo Upload, Room Type, Design Styles, Color Palettes, Budget Dual Slider, Functional Needs, Retainable Items, Instructions) with live summary review.
4. **AI Design Results (`/app/designs/:designId`)**: Draggable interactive Before/After comparison slider, 4 photorealistic architectural variations (*Natural Modern*, *Japandi Calm*, *Modern Luxury*, *Urban Contemporary*), and prompt refinement.
5. **Floor Plans & Planning (`/app/floor-plans`)**: Dimensioned plot visualizer (40ft × 60ft, 2,400 sq ft), 3 AI layout concepts with interactive 2D SVG blueprints for Ground and First Floor, deterministic area calculations (1,860 sq ft / 77%), and direct professional review dispatch.
6. **Products & Materials (`/app/products`)**: Curated furniture, lighting, and finishes with recommendation badges (*Exact Match*, *Similar Alternative*), design alignment gauge (92%), and one-click *Add to Budget* workflow.
7. **Budget Planner (`/app/budget`)**: Financial center with $285,000 baseline, $125/sqft unit cost, 5-category donut breakdown, budget vs spend bar chart, assumptions checklist, and editable cost items CRUD table.
8. **Discover Properties & Details (`/app/properties`, `/app/properties/:propertyId`)**: Property catalog with bedroom and area filters, Gemini multimodal potential analysis, and project attachment.
9. **Projects Hub & Workspace (`/app/projects`, `/app/projects/:projectId`)**: Centralized project switcher with tabs for Overview, Designs, Floor Plans, Products, Budget, Tasks, and Documents.
10. **Supporting Services**:
    - **ArchMind AI Copilot**: Floating assistant with project context and tools.
    - **Professionals Directory (`/app/professionals`)**: Architects, designers, and contractors with inquiry dispatches.
    - **Document Vault (`/app/documents`)**: Secure storage for permits, contracts, and floor plans.
    - **Home Maintenance (`/app/maintenance`)**: Preventive equipment servicing with AI schedule recommendations.
    - **Settings (`/app/settings`)**: Profile preferences, currency selection (MYR, USD, INR), and Gemini AI health monitoring.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, High-DPI Canvas, Vite 8.
- **Backend / AI Engine**: Node.js, Express / Vite Middleware Plugin, official `@google/genai` SDK.
- **AI Models**:
  - `gemini-2.5-flash`: Multimodal visual spatial analysis, geometric room understanding, Copilot reasoning.
  - `imagen-3.0-generate-002`: Photorealistic architectural image synthesis with camera angle and fixture preservation.
- **Persistence**: Centralized reactive store with local persistence, pre-loaded with the comprehensive *Modern Terrace House* dataset, and production Firestore/Storage rules.

---

## 🚀 Running Locally

1. **Install Dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Configure Environment Variables** (Optional for live Gemini API calls):
   Create `.env.local` or set in your environment:
   ```bash
   GEMINI_API_KEY="your-gemini-api-key"
   ```
   *(Note: If no API key is supplied, ArchMind automatically uses high-fidelity architectural pipelines with clear status indicators).*

3. **Start the Unified Server**:
   ```bash
   npm run dev
   ```
   The application will be live at `http://localhost:3000`.

4. **Verify TypeScript & Production Build**:
   ```bash
   npm run lint   # tsc --noEmit (0 errors)
   npm run build  # Production bundle build
   ```

---

## 🔒 Security & Deployment Rules

- **Firestore Rules**: Located in [`firebase/firestore.rules`](file:///c:/Users/patha/OneDrive/Desktop/11/firebase/firestore.rules) enforcing project-level authorization and user isolation.
- **Storage Rules**: Located in [`firebase/storage.rules`](file:///c:/Users/patha/OneDrive/Desktop/11/firebase/storage.rules) keeping uploaded room photos and documents private.

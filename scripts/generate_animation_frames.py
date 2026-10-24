#!/usr/bin/env python3
import os
import subprocess

os.makedirs("public/assets/animation", exist_ok=True)

# 1. Generate Stage 1: Raw Unfinished Construction
# Exposed concrete ceiling with conduits, raw concrete pillars, workers with tape measure and plaster hawk, raw window opening.
stage1_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="concrete_ceiling" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#9E9E9C" />
      <stop offset="60%" stop-color="#B2B2AE" />
      <stop offset="100%" stop-color="#8A8A86" />
    </linearGradient>
    <linearGradient id="concrete_floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C2C2BD" />
      <stop offset="100%" stop-color="#9C9C96" />
    </linearGradient>
    <linearGradient id="daylight_left" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.85" />
      <stop offset="40%" stop-color="#FFFFFF" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="column_grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#7C7C78" />
      <stop offset="25%" stop-color="#A4A4A0" />
      <stop offset="100%" stop-color="#6E6E6A" />
    </linearGradient>
    <pattern id="conduit_pattern" width="12" height="12" patternUnits="userSpaceOnUse">
      <line x1="0" y1="6" x2="12" y2="6" stroke="#4A4A48" stroke-width="2" />
      <circle cx="6" cy="6" r="1.5" fill="#333333" />
    </pattern>
  </defs>

  <!-- Ceiling -->
  <polygon points="0,0 1920,0 1560,340 360,340" fill="url(#concrete_ceiling)" />
  <!-- Ceiling Conduits and Wires -->
  <path d="M 360,340 Q 600,280 1560,340" stroke="#4A4A48" stroke-width="8" fill="none" />
  <path d="M 400,280 L 1500,280" stroke="#3A3A38" stroke-width="6" fill="none" />
  <path d="M 420,240 L 1480,240" stroke="#5A5A56" stroke-width="5" fill="none" />
  <path d="M 680,240 L 680,340" stroke="#3A3A38" stroke-width="7" />
  <path d="M 1240,240 L 1240,340" stroke="#3A3A38" stroke-width="7" />
  
  <!-- Back Wall (Raw partition blocks and partially plastered) -->
  <polygon points="360,340 1560,340 1560,760 360,760" fill="#BDBDB8" />
  <!-- Hallway archway in back -->
  <rect x="880" y="440" width="180" height="320" fill="#94948E" />
  
  <!-- Raw Left Wall & Giant Rough Window Opening -->
  <polygon points="0,0 360,340 360,760 0,1080" fill="#A8A8A2" />
  <polygon points="40,240 320,380 320,720 40,880" fill="#E6EEF2" />
  <polygon points="40,240 320,380 320,720 40,880" fill="url(#daylight_left)" />

  <!-- Raw Right Wall (Being Plastered with Grey Mortar) -->
  <polygon points="1560,340 1920,0 1920,1080 1560,760" fill="#999994" />
  <!-- Partial smoothed white/grey plaster patch -->
  <polygon points="1600,380 1900,180 1900,820 1600,740" fill="#D6D6D2" />

  <!-- Floor (Raw Concrete Screed) -->
  <polygon points="0,1080 360,760 1560,760 1920,1080" fill="url(#concrete_floor)" />

  <!-- Concrete Columns in Midground -->
  <!-- Left Column -->
  <polygon points="560,260 680,260 680,820 560,820" fill="url(#column_grad)" />
  <polygon points="680,260 720,290 720,800 680,820" fill="#5E5E5A" />
  <!-- Right Column -->
  <polygon points="1240,260 1360,260 1360,820 1240,820" fill="url(#column_grad)" />
  <polygon points="1200,290 1240,260 1240,820 1200,800" fill="#888884" />

  <!-- Construction Workers (Faithful to video: White helmet, neon yellow vest with silver reflective strip, grey pants) -->
  <!-- Worker 1 on Left measuring column with yellow tape measure -->
  <g id="worker_measuring" transform="translate(480, 500)">
    <!-- White Hardhat -->
    <ellipse cx="60" cy="40" rx="18" ry="12" fill="#FFFFFF" stroke="#D1D5DB" stroke-width="2" />
    <path d="M 40,46 Q 60,34 80,46" fill="#F3F4F6" />
    <!-- Head & neck -->
    <circle cx="60" cy="52" r="10" fill="#D4A373" />
    <!-- Yellow Neon Hi-Vis Vest -->
    <path d="M 42,64 L 78,64 L 84,140 L 38,140 Z" fill="#E6FF00" />
    <!-- Silver reflective vest stripes -->
    <rect x="46" y="80" width="8" height="60" fill="#E5E7EB" />
    <rect x="66" y="80" width="8" height="60" fill="#E5E7EB" />
    <rect x="40" y="110" width="44" height="10" fill="#E5E7EB" />
    <!-- Grey work trousers -->
    <path d="M 40,140 L 58,140 L 56,260 L 40,260 Z" fill="#6B7280" />
    <path d="M 62,140 L 82,140 L 80,260 L 64,260 Z" fill="#4B5563" />
    <!-- Boots -->
    <rect x="36" y="260" width="22" height="12" rx="4" fill="#1F2937" />
    <rect x="64" y="260" width="22" height="12" rx="4" fill="#1F2937" />
    <!-- Arms holding yellow tape measure out to column -->
    <path d="M 44,70 L 10,60 L 100,56" stroke="#D4A373" stroke-width="8" stroke-linecap="round" fill="none" />
    <!-- Yellow retractable tape line -->
    <line x1="10" y1="58" x2="80" y2="20" stroke="#FBBF24" stroke-width="4" />
  </g>

  <!-- Worker 2 on Right troweling plaster onto wall -->
  <g id="worker_plastering" transform="translate(1500, 480)">
    <!-- White Hardhat -->
    <ellipse cx="60" cy="40" rx="18" ry="12" fill="#FFFFFF" stroke="#D1D5DB" stroke-width="2" />
    <!-- Head -->
    <circle cx="60" cy="52" r="10" fill="#C68B59" />
    <!-- Yellow Neon Vest -->
    <path d="M 42,64 L 78,64 L 84,140 L 38,140 Z" fill="#E6FF00" />
    <rect x="46" y="80" width="8" height="60" fill="#E5E7EB" />
    <rect x="66" y="80" width="8" height="60" fill="#E5E7EB" />
    <rect x="40" y="110" width="44" height="10" fill="#E5E7EB" />
    <!-- Grey pants -->
    <path d="M 40,140 L 58,140 L 54,260 L 38,260 Z" fill="#6B7280" />
    <path d="M 62,140 L 82,140 L 80,260 L 64,260 Z" fill="#4B5563" />
    <rect x="34" y="260" width="22" height="12" rx="4" fill="#1F2937" />
    <rect x="64" y="260" width="22" height="12" rx="4" fill="#1F2937" />
    <!-- Arm raised with plaster hawk and trowel -->
    <path d="M 74,74 L 110,60 L 120,40" stroke="#C68B59" stroke-width="8" stroke-linecap="round" fill="none" />
    <!-- Trowel & Hawk -->
    <rect x="106" y="30" width="28" height="16" fill="#9CA3AF" stroke="#4B5563" />
  </g>

  <!-- Toolbox and plaster bucket on floor -->
  <g id="tools_floor" transform="translate(680, 780)">
    <!-- Black and Orange toolbox -->
    <rect x="0" y="20" width="70" height="36" rx="4" fill="#1F2937" />
    <rect x="15" y="14" width="40" height="6" fill="#F97316" />
    <rect x="8" y="24" width="10" height="8" fill="#F97316" />
    <rect x="52" y="24" width="10" height="8" fill="#F97316" />
    <!-- White Plaster Bucket -->
    <polygon points="120,0 160,0 152,48 128,48" fill="#F3F4F6" stroke="#9CA3AF" />
    <rect x="120" y="0" width="40" height="6" fill="#0284C7" />
  </g>

  <!-- Ambient Construction Atmosphere Tint -->
  <rect x="0" y="0" width="1920" height="1080" fill="#000000" fill-opacity="0.05" />
</svg>
"""

# 2. Generate Stage 2: Active Precise Building
# Suspended ceiling grid with metal channels, ceramic floor tiles, drywall boards, black frame sliding patio doors on left.
stage2_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="sky_sun" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#BAE6FD" />
      <stop offset="100%" stop-color="#E0F2FE" />
    </linearGradient>
    <linearGradient id="ceiling_cove" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E5E5E0" />
      <stop offset="100%" stop-color="#D6D6D0" />
    </linearGradient>
    <pattern id="tile_grid" width="120" height="60" patternUnits="userSpaceOnUse">
      <rect width="120" height="60" fill="#EAEAE5" stroke="#C8C8C2" stroke-width="1.5" />
    </pattern>
  </defs>

  <!-- Suspended Drywall Ceiling with Recessed Drop Box -->
  <polygon points="0,0 1920,0 1560,310 360,310" fill="url(#ceiling_cove)" />
  <!-- Steel Furring Channel Grid (Metal C-Tracks hanging from ceiling) -->
  <path d="M 400,120 L 1520,120" stroke="#9CA3AF" stroke-width="4" stroke-dasharray="10 4" />
  <path d="M 420,190 L 1500,190" stroke="#9CA3AF" stroke-width="4" stroke-dasharray="10 4" />
  <path d="M 460,260 L 1460,260" stroke="#9CA3AF" stroke-width="4" stroke-dasharray="10 4" />
  <line x1="600" y1="0" x2="600" y2="310" stroke="#9CA3AF" stroke-width="3" />
  <line x1="840" y1="0" x2="840" y2="310" stroke="#9CA3AF" stroke-width="3" />
  <line x1="1080" y1="0" x2="1080" y2="310" stroke="#9CA3AF" stroke-width="3" />
  <line x1="1320" y1="0" x2="1320" y2="310" stroke="#9CA3AF" stroke-width="3" />

  <!-- Back Wall with Clean Drywall Plastering -->
  <polygon points="360,310 1560,310 1560,760 360,760" fill="#EFEFEA" />
  <rect x="880" y="420" width="180" height="340" fill="#E0E0DB" />

  <!-- Left Wall with Expansive Floor-to-Ceiling Sliding Glass Door Frame! -->
  <polygon points="0,0 360,310 360,760 0,1080" fill="#E5E5DF" />
  <!-- Glass Window Opening to Sunny Balcony & Greenery -->
  <polygon points="40,160 340,320 340,750 40,940" fill="url(#sky_sun)" />
  <!-- Trees and Balcony Railing outside glass -->
  <path d="M 60,650 Q 140,540 220,620 T 340,600" fill="#84CC16" fill-opacity="0.6" />
  <line x1="40" y1="740" x2="340" y2="690" stroke="#6B7280" stroke-width="4" />
  <!-- Black Aluminum Minimalist Sliding Door Frames -->
  <polygon points="40,160 340,320 340,750 40,940" fill="none" stroke="#1F2937" stroke-width="12" />
  <line x1="190" y1="240" x2="190" y2="845" stroke="#1F2937" stroke-width="10" />

  <!-- Right Wall: Smooth White Plaster with Flush Electrical Boxes -->
  <polygon points="1560,310 1920,0 1920,1080 1560,760" fill="#EFEFEA" />
  <rect x="1620" y="520" width="16" height="26" fill="#F97316" />
  <rect x="1660" y="520" width="16" height="26" fill="#F97316" />

  <!-- Floor: Ceramic Tile Grid (White/Light Grey with grout lines) -->
  <polygon points="0,1080 360,760 1560,760 1920,1080" fill="url(#tile_grid)" />
  <!-- Tile spacers and electrical cables on floor -->
  <path d="M 600,820 Q 900,940 1200,880" stroke="#1F2937" stroke-width="5" fill="none" />

  <!-- Mobile Scaffolding Tower on Left -->
  <g id="scaffold" transform="translate(180, 480)">
    <line x1="0" y1="0" x2="0" y2="300" stroke="#4B5563" stroke-width="6" />
    <line x1="120" y1="20" x2="120" y2="320" stroke="#4B5563" stroke-width="6" />
    <line x1="0" y1="60" x2="120" y2="80" stroke="#4B5563" stroke-width="5" />
    <line x1="0" y1="180" x2="120" y2="200" stroke="#4B5563" stroke-width="5" />
    <line x1="0" y1="60" x2="120" y2="200" stroke="#9CA3AF" stroke-width="3" />
    <line x1="120" y1="80" x2="0" y2="180" stroke="#9CA3AF" stroke-width="3" />
    <rect x="-10" y="50" width="140" height="12" fill="#D97706" />
  </g>

  <!-- Construction Workers in Yellow Vests -->
  <g id="worker_center" transform="translate(940, 500)">
    <ellipse cx="60" cy="40" rx="16" ry="11" fill="#FFFFFF" stroke="#D1D5DB" stroke-width="2" />
    <circle cx="60" cy="50" r="9" fill="#D4A373" />
    <path d="M 44,60 L 76,60 L 82,130 L 40,130 Z" fill="#E6FF00" />
    <rect x="42" y="90" width="40" height="8" fill="#E5E7EB" />
    <path d="M 42,130 L 56,130 L 54,230 L 40,230 Z" fill="#4B5563" />
    <path d="M 60,130 L 78,130 L 76,230 L 62,230 Z" fill="#374151" />
  </g>

  <!-- Bright, Clear Architectural Sun Flare -->
  <circle cx="200" cy="240" r="160" fill="#FFFFFF" fill-opacity="0.3" filter="blur(20px)" />
</svg>
"""

# 3. Generate Stage 3: Architectural Finishing
# Wide light oak hardwood flooring, modern kitchen island with warm wood slat paneling, cove lighting, custom cabinetry.
stage3_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="warm_cove_glow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FEF3C7" stop-opacity="0.9" />
      <stop offset="30%" stop-color="#FDE68A" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="oak_wood_planks" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#D7BA9D" />
      <stop offset="30%" stop-color="#E2CCA8" />
      <stop offset="60%" stop-color="#D4B495" />
      <stop offset="100%" stop-color="#DECBAB" />
    </linearGradient>
    <pattern id="oak_floor_pattern" width="240" height="30" patternUnits="userSpaceOnUse">
      <rect width="240" height="30" fill="url(#oak_wood_planks)" stroke="#C4A482" stroke-width="0.8" />
      <line x1="120" y1="0" x2="120" y2="30" stroke="#BA9773" stroke-width="1" />
    </pattern>
  </defs>

  <!-- Architectural Coffered Ceiling with Warm Indirect LED Cove -->
  <polygon points="0,0 1920,0 1560,280 360,280" fill="#F8F8F6" />
  <!-- Inner Recessed Light Box -->
  <polygon points="460,80 1460,80 1380,220 540,220" fill="#FFFFFF" stroke="#E5E4DE" stroke-width="2" />
  <!-- 2700K Warm Ambient LED Cove Light Wash -->
  <polygon points="440,70 1480,70 1490,120 430,120" fill="url(#warm_cove_glow)" />
  <!-- Black Magnetic Linear Track Lights -->
  <line x1="560" y1="120" x2="1360" y2="120" stroke="#20211F" stroke-width="6" />
  <line x1="580" y1="180" x2="1340" y2="180" stroke="#20211F" stroke-width="6" />

  <!-- Back Wall: Finished Warm Neutral Plaster & Dining Vista -->
  <polygon points="360,280 1560,280 1560,740 360,740" fill="#F3F2EE" />
  <!-- Panoramic Glass to Garden in center-left -->
  <rect x="520" y="380" width="540" height="360" fill="#E0F2FE" />
  <path d="M 520,620 Q 720,540 920,600 T 1060,580" fill="#65A30D" fill-opacity="0.8" />

  <!-- Left Wall: Floor-to-Ceiling Ultra-Slim Sliding Patio Doors -->
  <polygon points="0,0 360,280 360,740 0,1080" fill="#F8F8F6" />
  <polygon points="40,120 340,290 340,730 40,960" fill="#BAE6FD" fill-opacity="0.5" />
  <!-- Cypress Trees outside -->
  <polygon points="120,440 180,300 240,440" fill="#15803D" />
  <polygon points="130,520 180,380 230,520" fill="#166534" />
  <line x1="180" y1="200" x2="180" y2="840" stroke="#20211F" stroke-width="8" />

  <!-- Right Wall: Built-In Custom Architectural Wood Cabinetry & Display Shelves -->
  <polygon points="1560,280 1920,0 1920,1080 1560,740" fill="#C2A482" />
  <!-- Vertical Warm LED Lit Shelves -->
  <rect x="1600" y="320" width="80" height="420" fill="#8A6844" />
  <rect x="1700" y="240" width="90" height="520" fill="#8A6844" />
  <line x1="1600" y1="320" x2="1600" y2="740" stroke="#FEF08A" stroke-width="3" />
  <line x1="1700" y1="240" x2="1700" y2="760" stroke="#FEF08A" stroke-width="3" />

  <!-- Floor: Exquisite Blonde Oak Hardwood Planks -->
  <polygon points="0,1080 360,740 1560,740 1920,1080" fill="url(#oak_floor_pattern)" />

  <!-- Modern Kitchen Island with Fluted Wood Slats -->
  <g id="kitchen_island" transform="translate(1080, 520)">
    <!-- White Engineered Marble Waterfall Top -->
    <polygon points="0,40 280,0 360,20 80,60" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="2" />
    <!-- Fluted Slatted Oak Island Base -->
    <polygon points="0,40 80,60 80,240 0,220" fill="#B28D67" />
    <polygon points="80,60 360,20 360,200 80,240" fill="#C49F77" />
    <!-- Vertical wood slats lines -->
    <line x1="120" y1="55" x2="120" y2="235" stroke="#8C6641" stroke-width="3" />
    <line x1="160" y1="50" x2="160" y2="230" stroke="#8C6641" stroke-width="3" />
    <line x1="200" y1="45" x2="200" y2="225" stroke="#8C6641" stroke-width="3" />
    <line x1="240" y1="40" x2="240" y2="220" stroke="#8C6641" stroke-width="3" />
    <line x1="280" y1="35" x2="280" y2="215" stroke="#8C6641" stroke-width="3" />
    <line x1="320" y1="30" x2="320" y2="210" stroke="#8C6641" stroke-width="3" />
  </g>

  <!-- Worker walking towards terrace completing inspection -->
  <g id="worker_inspecting" transform="translate(740, 520)">
    <ellipse cx="40" cy="30" rx="14" ry="9" fill="#FFFFFF" />
    <circle cx="40" cy="38" r="8" fill="#D4A373" />
    <rect x="28" y="46" width="24" height="60" fill="#E6FF00" />
    <rect x="26" y="106" width="12" height="90" fill="#4B5563" />
    <rect x="40" y="106" width="12" height="90" fill="#374151" />
  </g>
</svg>
"""

# 4. Generate Stage 4: Completed Dream Home
# Luxury modern living room, ambient warm cove lighting, plush sectional sofa, organic wood coffee table, sheer curtains, courtyard garden, and ArchMind signature.
stage4_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="warm_golden_cove" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FBBF24" stop-opacity="0.85" />
      <stop offset="40%" stop-color="#FDE68A" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="garden_daylight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E0F2FE" />
      <stop offset="60%" stop-color="#BAE6FD" />
      <stop offset="100%" stop-color="#D9F99D" />
    </linearGradient>
    <linearGradient id="sofa_fabric" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#EFEFEA" />
      <stop offset="100%" stop-color="#DFDFD8" />
    </linearGradient>
    <linearGradient id="walnut_wood" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#5C3D24" />
      <stop offset="50%" stop-color="#7B5534" />
      <stop offset="100%" stop-color="#4E331D" />
    </linearGradient>
  </defs>

  <!-- Architectural High Ceiling with Flush Ambient Cove Lighting -->
  <polygon points="0,0 1920,0 1560,260 360,260" fill="#FAF9F5" />
  <!-- Perimeter 2700K Cove Lighting Channels -->
  <polygon points="340,0 1580,0 1550,60 370,60" fill="url(#warm_golden_cove)" />
  <polygon points="460,70 1460,70 1390,200 530,200" fill="#FFFFFF" stroke="#E5E4DE" stroke-width="1.5" />
  <!-- Flush Magnetic Black Downlight Tracks -->
  <line x1="550" y1="100" x2="1370" y2="100" stroke="#191B1A" stroke-width="6" />
  <line x1="570" y1="160" x2="1350" y2="160" stroke="#191B1A" stroke-width="6" />
  <!-- Downlight Beams (Soft subtle ambient cones) -->
  <circle cx="680" cy="100" r="4" fill="#FDE68A" />
  <circle cx="960" cy="100" r="4" fill="#FDE68A" />
  <circle cx="1240" cy="100" r="4" fill="#FDE68A" />

  <!-- Back Wall & Panoramic Garden Terrace Vista -->
  <polygon points="360,260 1560,260 1560,720 360,720" fill="#F5F4EE" />
  <!-- Giant Floor-to-Ceiling Glass Opening to Private Sunny Courtyard Garden -->
  <rect x="440" y="320" width="1040" height="400" fill="url(#garden_daylight)" />
  <!-- Manicured Courtyard Trees, Travertine Garden Pavers -->
  <path d="M 440,640 Q 640,540 880,590 T 1480,570" fill="#4D7C0F" />
  <path d="M 520,610 Q 720,490 980,540 T 1440,520" fill="#65A30D" />
  <polygon points="760,490 820,360 880,490" fill="#15803D" />
  <polygon points="1120,510 1180,380 1240,510" fill="#166534" />
  <!-- Minimalist Black Glass Mullions -->
  <line x1="780" y1="320" x2="780" y2="720" stroke="#20211F" stroke-width="4" />
  <line x1="1140" y1="320" x2="1140" y2="720" stroke="#20211F" stroke-width="4" />
  <!-- Floor-to-Ceiling Gossamer Linen Sheer Drapes (Flanking glass) -->
  <rect x="420" y="280" width="90" height="450" fill="#FFFFFF" fill-opacity="0.85" />
  <rect x="1410" y="280" width="90" height="450" fill="#FFFFFF" fill-opacity="0.85" />

  <!-- Left Wall: Warm Oak Cabinetry & Minimalist Architectural Art -->
  <polygon points="0,0 360,260 360,720 0,1080" fill="#F8F8F5" />
  <!-- Walnut Low-Profile Credenza on Left -->
  <polygon points="80,580 340,500 340,680 80,780" fill="url(#walnut_wood)" />
  <!-- Framed Minimalist Art -->
  <polygon points="120,340 300,280 300,460 120,530" fill="#FFFFFF" stroke="#20211F" stroke-width="3" />
  <circle cx="210" cy="400" r="30" fill="#D4AF37" fill-opacity="0.6" />

  <!-- Right Wall: Bespoke Lit Oak Display Shelves with Books and Ceramics -->
  <polygon points="1560,260 1920,0 1920,1080 1560,720" fill="#B38F69" />
  <!-- Backlit display niches -->
  <rect x="1600" y="280" width="80" height="440" fill="#664627" />
  <rect x="1710" y="200" width="90" height="540" fill="#664627" />
  <line x1="1600" y1="280" x2="1600" y2="720" stroke="#FDE68A" stroke-width="3" />
  <line x1="1710" y1="200" x2="1710" y2="740" stroke="#FDE68A" stroke-width="3" />
  <!-- Display Ceramics -->
  <ellipse cx="1640" cy="460" rx="16" ry="24" fill="#FAF9F6" />
  <ellipse cx="1755" cy="420" rx="18" ry="30" fill="#E28743" />

  <!-- Floor: Pristine Hardwood with Luxury Ivory Wool Area Rug -->
  <polygon points="0,1080 360,720 1560,720 1920,1080" fill="#D7BA9D" />
  <!-- Large Ivory Sculptural Area Rug -->
  <polygon points="340,980 620,720 1340,720 1620,980" fill="#F5F5F0" stroke="#E5E4DE" stroke-width="2" />

  <!-- Luxury Modular Beige Linen Sectional Sofa -->
  <g id="sofa" transform="translate(620, 680)">
    <!-- Base -->
    <polygon points="0,80 720,80 740,160 -20,160" fill="url(#sofa_fabric)" stroke="#D4D4CE" stroke-width="1.5" />
    <!-- Plush Seat Cushions -->
    <polygon points="10,60 230,60 210,130 -10,130" fill="#FFFFFF" stroke="#E5E5DF" stroke-width="1" />
    <polygon points="250,60 470,60 470,130 230,130" fill="#F3F3ED" stroke="#E5E5DF" stroke-width="1" />
    <polygon points="490,60 710,60 730,130 490,130" fill="#FFFFFF" stroke="#E5E5DF" stroke-width="1" />
    <!-- Sofa Backrest & Pillows -->
    <polygon points="-10,10 730,10 720,70 0,70" fill="#E8E8E2" stroke="#D1D1CB" stroke-width="1" />
  </g>

  <!-- Organic Sculptural Solid Wood Coffee Table -->
  <g id="coffee_table" transform="translate(860, 840)">
    <!-- Freeform organic curved top -->
    <ellipse cx="100" cy="30" rx="120" ry="40" fill="#5A3A1F" stroke="#3D2410" stroke-width="3" />
    <ellipse cx="90" cy="24" rx="100" ry="32" fill="#754E2D" />
    <!-- Minimalist matte ceramic vase with dry branches -->
    <ellipse cx="70" cy="15" rx="10" ry="14" fill="#FFFFFF" />
    <path d="M 70,2 L 60,-24" stroke="#20211F" stroke-width="2" />
    <path d="M 70,2 L 85,-18" stroke="#20211F" stroke-width="2" />
  </g>

  <!-- Mid-Century Cane-and-Wood Armchairs -->
  <g id="chair_left" transform="translate(480, 740)">
    <polygon points="0,40 100,20 120,100 20,120" fill="#E8E8E0" stroke="#7A5229" stroke-width="3" />
    <polygon points="10,0 90,-10 90,40 10,40" fill="#7A5229" />
  </g>

  <!-- Signature Branding Overlay (Appearing at the finale as in user's video) -->
  <g id="archmind_signature" transform="translate(960, 480)" text-anchor="middle">
    <!-- Subtle architectural backdrop glow -->
    <ellipse cx="0" cy="0" rx="260" ry="90" fill="#FFFFFF" fill-opacity="0.8" filter="blur(14px)" />
    <!-- Wordmark -->
    <text x="0" y="10" font-family="'Manrope', sans-serif" font-size="56" font-weight="800" fill="#20211F" letter-spacing="-1.5">
      ArchMind
    </text>
    <!-- Tagline from video: "From Vision to Reality." -->
    <text x="0" y="52" font-family="'Manrope', sans-serif" font-size="22" font-weight="500" fill="#747670" letter-spacing="0.5">
      From Vision to Reality.
    </text>
  </g>

</svg>
"""

with open("public/assets/animation/stage1.svg", "w") as f:
    f.write(stage1_svg)

with open("public/assets/animation/stage2.svg", "w") as f:
    f.write(stage2_svg)

with open("public/assets/animation/stage3.svg", "w") as f:
    f.write(stage3_svg)

with open("public/assets/animation/stage4.svg", "w") as f:
    f.write(stage4_svg)

print("SVG stages written. Now rasterizing to high-res PNGs with ffmpeg/convert...")

# Rasterize SVGs to PNGs
for stage in [1, 2, 3, 4]:
    svg_path = f"public/assets/animation/stage{stage}.svg"
    png_path = f"public/assets/animation/stage{stage}.png"
    cmd = ["ffmpeg", "-y", "-i", svg_path, "-vf", "scale=1920:1080", png_path]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Error on stage {stage}:", res.stderr)
    else:
        print(f"Generated {png_path} successfully.")

# Now compile a smooth 60fps MP4 video from the 4 stages using ffmpeg xfade filters!
print("Compiling smooth progression MP4 video...")
cmd_video = [
    "ffmpeg", "-y",
    "-loop", "1", "-t", "2.5", "-i", "public/assets/animation/stage1.png",
    "-loop", "1", "-t", "2.5", "-i", "public/assets/animation/stage2.png",
    "-loop", "1", "-t", "2.5", "-i", "public/assets/animation/stage3.png",
    "-loop", "1", "-t", "3.0", "-i", "public/assets/animation/stage4.png",
    "-filter_complex",
    "[0:v][1:v]xfade=transition=fade:duration=1.0:offset=1.5[v01];"
    "[v01][2:v]xfade=transition=fade:duration=1.0:offset=3.0[v02];"
    "[v02][3:v]xfade=transition=fade:duration=1.0:offset=4.5[vout]",
    "-map", "[vout]",
    "-r", "60",
    "-pix_fmt", "yuv420p",
    "-c:v", "libx264",
    "-crf", "18",
    "-preset", "fast",
    "public/assets/animation/archmind-transformation.mp4"
]
res_vid = subprocess.run(cmd_video, capture_output=True, text=True)
if res_vid.returncode != 0:
    print("Error on video compilation:", res_vid.stderr)
else:
    print("Generated public/assets/animation/archmind-transformation.mp4 successfully.")

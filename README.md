# AiroMarine Frontend

A modern maritime vessel tracking and management system built with Next.js, featuring real-time vessel monitoring, interactive maps, and comprehensive fleet management capabilities.

## 🚢 Features

- **Real-Time Vessel Tracking**: Monitor vessel positions and movements with automatic updates via WebSocket
- **Interactive Map**: Leaflet-based mapping with multiple tile layers (OpenStreetMap, CartoDB, Esri Satellite, OpenSeaMap)
- **Fleet Management**: Manage multiple vessels with detailed information and status monitoring
- **Points of Interest (POI)**: Create and manage maritime points of interest including ports, waypoints, and zones
- **User Management**: Role-based access control and user administration
- **Advanced Analytics**: View vessel history, routes, and comprehensive dashboards
- **Dark Mode Support**: Full dark mode theme support
- **Responsive Design**: Mobile-friendly interface that works on all devices

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: 
  - [shadcn/ui](https://ui.shadcn.com/) - Reusable component library
  - [Heroicons](https://heroicons.com/) - Icon library
  - [Lucide React](https://lucide.dev/) - Additional icons
- **Maps**: 
  - [Leaflet](https://leafletjs.com/) - Interactive maps
  - [React Leaflet](https://react-leaflet.js.org/) - React components for Leaflet
  - Leaflet Draw - Drawing tools
  - Leaflet.markercluster - Marker clustering
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) - Lightweight state management
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) (React Query) - Server state management
- **Form Handling**: 
  - [React Hook Form](https://react-hook-form.com/) - Form validation
  - [Zod](https://zod.dev/) - Schema validation
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Date Handling**: [date-fns](https://date-fns.org/)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   │   └── login/         # Login page
│   ├── dashboard/         # Main dashboard area
│   │   ├── poi/          # Points of Interest management
│   │   ├── users/        # User management
│   │   └── vessels/      # Vessel management
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── providers.tsx      # React Query provider
├── components/            # Reusable components
│   ├── layout/           # Layout components (Header, Sidebar, Navigation)
│   ├── map/              # Map-related components
│   ├── poi/              # POI components
│   ├── ui/               # UI components (Button, Card, Input, etc.)
│   └── vessel/           # Vessel components
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication hook
│   ├── usePOI.ts         # POI data hook
│   ├── useVessels.ts     # Vessel data hook
│   └── useWebSocket.ts   # WebSocket connection hook
├── lib/                  # Utility libraries
│   ├── api.ts            # API client configuration
│   ├── constants.ts      # Application constants
│   └── utils.ts          # Helper functions
├── stores/               # Zustand state stores
│   ├── authStore.ts      # Authentication state
│   ├── mapStore.ts       # Map state
│   ├── settingsStore.ts  # User settings
│   └── vesselStore.ts    # Vessel state
├── styles/               # Additional styles
│   └── leaflet-custom.css # Custom Leaflet styles
└── types/                # TypeScript type definitions
    ├── map.ts            # Map-related types
    ├── poi.ts            # POI types
    ├── user.ts           # User types
    └── vessel.ts         # Vessel types
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- Yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rakarahadyan/airomarine-frontend.git
cd airomarine-frontend
```

2. Install dependencies:
```bash
yarn install
```

3. Run the development server:
```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📜 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## 🎨 UI Components

The project uses shadcn/ui for component library. To add new components:

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add button dialog dropdown-menu
```

## 🗺️ Map Configuration

The application supports multiple map tile layers configured in `src/lib/constants.ts`:

- **OpenStreetMap** - Standard street map
- **CartoDB Voyager** - Clean, modern base map
- **CartoDB Dark** - Dark theme map
- **Esri World Imagery** - Satellite imagery
- **OpenSeaMap** - Maritime charts overlay

## 🔐 Authentication

The application uses token-based authentication stored in Zustand. Configure your API endpoint in `src/lib/api.ts`.

## 📊 State Management

- **Zustand** stores for global state (auth, vessels, map, settings)
- **TanStack Query** for server state and caching
- **React Hook Form** for form state

## 🌐 WebSocket Integration

Real-time vessel updates are handled through WebSocket connections (configured in `src/hooks/useWebSocket.ts`).

## 🎯 Key Features Implementation

### Vessel Tracking
- Real-time position updates
- Vessel clustering on map
- Detailed vessel information cards
- Navigation status indicators

### Map Interaction
- Multiple tile layer options
- Drawing tools (polygons, circles, markers)
- Coordinate display (decimal/DMS)
- Layer switching
- Zoom controls

### POI Management
- Create and edit POIs
- Categorize locations
- Display on map with custom icons
- Search and filter

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Authors

- **Raka Rahadyan** - [rakarahadyan](https://github.com/rakarahadyan)

---

Built with ❤️ for maritime operations worldwide

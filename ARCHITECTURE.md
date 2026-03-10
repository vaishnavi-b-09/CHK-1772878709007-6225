# 🏗️ Gyan Setu - Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Data Flow](#data-flow)
5. [Component Hierarchy](#component-hierarchy)
6. [API Design](#api-design)
7. [State Management](#state-management)
8. [Security Architecture](#security-architecture)

---

## System Overview

Gyan Setu follows a modern **JAMstack architecture** with Next.js as the core framework, providing both server-side rendering (SSR) and static site generation (SSG) capabilities.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USER DEVICES                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Desktop    │  │    Tablet    │  │    Mobile    │              │
│  │   Browser    │  │   Browser    │  │   Browser    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS APPLICATION                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    CLIENT SIDE (Browser)                       │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │  │
│  │  │   React      │  │   Three.js   │  │  Fabric.js   │        │  │
│  │  │  Components  │  │  3D Engine   │  │  2D Canvas   │        │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │  │
│  │                                                                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │  │
│  │  │   State      │  │  LocalStorage│  │   Routing    │        │  │
│  │  │  Management  │  │   (Cache)    │  │  (Next.js)   │        │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              │ API Calls                             │
│                              ▼                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    SERVER SIDE (Node.js)                       │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │  │
│  │  │  API Routes  │  │  Middleware  │  │   SSR/SSG    │        │  │
│  │  │  (Handlers)  │  │  (Auth)      │  │   Engine     │        │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ External API Calls
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   OpenAI     │  │   Firebase   │  │  CDN/Assets  │              │
│  │   API        │  │  Auth & DB   │  │   Storage    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Technology Stack

```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│  ┌────────────────────────────────┐    │
│  │  React 18 (UI Components)      │    │
│  │  - Functional Components       │    │
│  │  - Hooks (useState, useEffect) │    │
│  │  - Context API                 │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         STYLING LAYER                   │
│  ┌────────────────────────────────┐    │
│  │  Tailwind CSS                  │    │
│  │  - Utility Classes             │    │
│  │  - Custom Components           │    │
│  │  - Responsive Design           │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         VISUALIZATION LAYER             │
│  ┌────────────────────────────────┐    │
│  │  Three.js (3D Graphics)        │    │
│  │  - WebGL Renderer              │    │
│  │  - Scene Management            │    │
│  │  - Camera Controls             │    │
│  └────────────────────────────────┘    │
│  ┌────────────────────────────────┐    │
│  │  Fabric.js (2D Canvas)         │    │
│  │  - SVG Manipulation            │    │
│  │  - Drawing Tools               │    │
│  └────────────────────────────────┘    │
│  ┌────────────────────────────────┐    │
│  │  React Flow (Diagrams)         │    │
│  │  - Node-based UI               │    │
│  │  - Edge Connections            │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### Component Architecture

```
App Root (layout.tsx)
│
├── Global Providers
│   ├── Firebase Auth Provider
│   ├── Theme Provider
│   └── Error Boundary
│
├── Sidebar (Navigation)
│   ├── Logo
│   ├── Navigation Links
│   │   ├── Home
│   │   ├── Learn
│   │   ├── Visualizer
│   │   ├── Syllabus
│   │   ├── Dashboard
│   │   ├── Leaderboard
│   │   └── Profile
│   └── User Menu
│
└── Page Content (Dynamic)
    │
    ├── /learn (Chat Interface)
    │   ├── ChatHistory Sidebar
    │   │   ├── New Chat Button
    │   │   └── Session List
    │   │       └── Session Item
    │   │           ├── Title
    │   │           ├── Date
    │   │           └── Delete Button
    │   │
    │   ├── Main Chat Area
    │   │   ├── Header
    │   │   ├── Message List
    │   │   │   └── Message Component
    │   │   │       ├── Avatar
    │   │   │       ├── Content (Markdown)
    │   │   │       └── Visualization
    │   │   │           ├── InlineLesson
    │   │   │           │   ├── 3D Scene (Three.js)
    │   │   │           │   ├── Flow Diagram (ReactFlow)
    │   │   │           │   └── Code Display
    │   │   │           └── Show/Hide Button
    │   │   │
    │   │   └── Input Area
    │   │       ├── File Upload Button
    │   │       ├── Text Input
    │   │       ├── Voice Input Button
    │   │       └── Send Button
    │   │
    │   └── Loading Indicator
    │
    ├── /visualizer (Creative Canvas)
    │   ├── Mode Switcher (2D/3D)
    │   ├── Prompt Input
    │   ├── Canvas Area
    │   │   ├── FabricBoard (2D)
    │   │   │   ├── Canvas Element
    │   │   │   ├── Drawing Tools
    │   │   │   └── Export Button
    │   │   │
    │   │   └── ThreeDBoard (3D)
    │   │       ├── Three.js Canvas
    │   │       ├── Scene Objects
    │   │       ├── Camera Controls
    │   │       └── Lighting
    │   │
    │   └── Control Panel
    │
    ├── /syllabus (Learning Roadmap)
    │   ├── Topic Input Form
    │   ├── Pace Selector
    │   ├── Generate Button
    │   └── Roadmap Display
    │       └── Topic Card
    │           ├── Title
    │           ├── Duration
    │           ├── Difficulty Badge
    │           ├── Description
    │           └── Subtopics List
    │
    ├── /dashboard (Analytics)
    │   ├── Stats Cards
    │   ├── Progress Charts
    │   ├── Recent Activity
    │   └── Recommendations
    │
    └── /leaderboard (Gamification)
        ├── User Rank
        ├── Top Users List
        └── Achievement Badges
```

---

## Backend Architecture

### API Routes Structure

```
app/api/
│
├── explain/
│   └── route.ts
│       ├── POST Handler
│       │   ├── Parse request (history, attachments)
│       │   ├── Build OpenAI messages
│       │   ├── Call GPT-4o-mini
│       │   ├── Parse JSON response
│       │   └── Return visualization data
│       │
│       └── Error Handling
│           ├── API key validation
│           ├── Rate limiting
│           └── Error responses
│
├── visualize/
│   └── route.ts
│       ├── POST Handler
│       │   ├── Parse prompt & mode
│       │   ├── Generate system prompt
│       │   ├── Call OpenAI
│       │   ├── Parse SVG/JSON
│       │   └── Return visualization code
│       │
│       └── Fallback Logic
│           └── Local generation if API fails
│
├── visualize-3d/
│   └── route.ts
│       ├── POST Handler
│       │   ├── Parse prompt & current scene
│       │   ├── Scene modification logic
│       │   ├── Call OpenAI for complex ops
│       │   └── Return updated scene
│       │
│       └── Local 3D Engine
│           ├── Shape detection
│           ├── Color parsing
│           └── Position calculation
│
├── roadmap/
│   └── route.ts
│       ├── POST Handler
│       │   ├── Parse topics & pace
│       │   ├── Generate curriculum prompt
│       │   ├── Call OpenAI
│       │   └── Return structured roadmap
│       │
│       └── Validation
│           └── JSON schema validation
│
├── explain-concept/
│   └── route.ts
│       └── Deep dive explanations
│
└── check-models/
    └── route.ts
        └── API health check
```

### Request/Response Flow

```
1. CLIENT REQUEST
   ├── User Action (click, type, upload)
   ├── Event Handler (React)
   ├── State Update (useState)
   └── API Call (fetch)
       │
       ▼
2. API ROUTE
   ├── Request Validation
   │   ├── Check API key
   │   ├── Validate input
   │   └── Rate limit check
   │
   ├── Data Processing
   │   ├── Parse request body
   │   ├── Format for OpenAI
   │   └── Add system prompts
   │
   ├── External API Call
   │   ├── OpenAI API
   │   ├── Retry logic
   │   └── Timeout handling
   │
   ├── Response Processing
   │   ├── Parse JSON
   │   ├── Extract data
   │   └── Format response
   │
   └── Error Handling
       ├── Log errors
       ├── Fallback logic
       └── User-friendly messages
       │
       ▼
3. CLIENT RESPONSE
   ├── Update State
   ├── Render UI
   ├── Show Visualization
   └── Save to LocalStorage
```

---

## Data Flow

### Chat Message Flow

```
User Input
    │
    ├─→ Text Input
    ├─→ Voice Input (Speech Recognition API)
    └─→ File Upload (FileReader API)
    │
    ▼
Input Processing
    │
    ├─→ Validation
    ├─→ Base64 Encoding (for files)
    └─→ History Building
    │
    ▼
API Request
    │
    └─→ POST /api/explain
        {
          history: [
            { role: "user", content: "...", attachment: {...} },
            { role: "assistant", content: "..." }
          ]
        }
    │
    ▼
OpenAI Processing
    │
    ├─→ System Prompt Injection
    ├─→ Message Formatting
    ├─→ Model Inference (GPT-4o-mini)
    └─→ JSON Response Generation
    │
    ▼
Response Processing
    │
    ├─→ Parse JSON
    ├─→ Extract explanation
    ├─→ Extract visualization data
    └─→ Validate structure
    │
    ▼
UI Update
    │
    ├─→ Add message to chat
    ├─→ Render markdown
    ├─→ Show visualization button
    └─→ Save to localStorage
    │
    ▼
User Interaction
    │
    └─→ Click "Show Visualization"
        │
        ▼
    Render Visualization
        │
        ├─→ 3D Scene (Three.js)
        ├─→ Flow Diagram (ReactFlow)
        └─→ Code Display
```

### Visualization Generation Flow

```
User Prompt: "Create a solar system"
    │
    ▼
API Request
    │
    └─→ POST /api/visualize
        { prompt: "Create a solar system", mode: "3d" }
    │
    ▼
System Prompt Generation
    │
    └─→ "You are a Three.js developer. Create JSON for:
         - Sun (large yellow sphere at center)
         - Planets (smaller spheres orbiting)
         - Use realistic colors and positions"
    │
    ▼
OpenAI Processing
    │
    └─→ GPT-4o-mini generates:
        {
          "scene": [
            { "type": "sphere", "position": [0,0,0], 
              "color": "#FFD700", "args": [2,32,32], "label": "Sun" },
            { "type": "sphere", "position": [5,0,0], 
              "color": "#4169E1", "args": [0.6,32,32], "label": "Earth" }
          ]
        }
    │
    ▼
Response Processing
    │
    ├─→ Parse JSON
    ├─→ Validate structure
    └─→ Return to client
    │
    ▼
Three.js Rendering
    │
    ├─→ Create Scene
    ├─→ Add Camera
    ├─→ Add Lights
    ├─→ For each object:
    │   ├─→ Create Geometry
    │   ├─→ Create Material
    │   ├─→ Create Mesh
    │   ├─→ Set Position
    │   └─→ Add to Scene
    │
    └─→ Render Loop
        ├─→ Update animations
        ├─→ Handle controls
        └─→ Render frame
```

---

## State Management

### State Architecture

```
┌─────────────────────────────────────────┐
│         GLOBAL STATE                    │
│  ┌────────────────────────────────┐    │
│  │  Firebase Auth Context         │    │
│  │  - User object                 │    │
│  │  - isAuthenticated             │    │
│  │  - login/logout methods        │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         PAGE-LEVEL STATE                │
│  ┌────────────────────────────────┐    │
│  │  Chat Page (/learn)            │    │
│  │  - sessions: ChatSession[]     │    │
│  │  - currentSessionId: string    │    │
│  │  - input: string               │    │
│  │  - isLoading: boolean          │    │
│  │  - attachment: File | null     │    │
│  └────────────────────────────────┘    │
│                                         │
│  ┌────────────────────────────────┐    │
│  │  Visualizer Page               │    │
│  │  - mode: '2d' | '3d'           │    │
│  │  - prompt: string              │    │
│  │  - scene: Object[]             │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         COMPONENT STATE                 │
│  ┌────────────────────────────────┐    │
│  │  InlineLesson                  │    │
│  │  - isPlaying: boolean          │    │
│  │  - expanded: boolean           │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         PERSISTENT STATE                │
│  ┌────────────────────────────────┐    │
│  │  LocalStorage                  │    │
│  │  - gyanSetu_chats              │    │
│  │  - user_preferences            │    │
│  │  - theme_settings              │    │
│  └────────────────────────────────┘    │
│                                         │
│  ┌────────────────────────────────┐    │
│  │  Firebase Firestore            │    │
│  │  - user_profiles               │    │
│  │  - learning_progress           │    │
│  │  - achievements                │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### State Update Flow

```
User Action
    │
    ▼
Event Handler
    │
    ├─→ setState (React)
    │   └─→ Component Re-render
    │
    ├─→ localStorage.setItem
    │   └─→ Persist to browser
    │
    └─→ Firebase API call
        └─→ Sync to cloud
```

---

## Security Architecture

### Authentication Flow

```
1. User Login
   ├── Email/Password Input
   ├── Firebase Auth API
   ├── Token Generation
   └── Store in Context
   
2. Protected Routes
   ├── Check Auth State
   ├── Redirect if not authenticated
   └── Allow access if authenticated
   
3. API Security
   ├── Server-side API key storage
   ├── Environment variables
   ├── No client exposure
   └── Rate limiting
```

### Data Security

```
┌─────────────────────────────────────────┐
│         CLIENT SIDE                     │
│  ┌────────────────────────────────┐    │
│  │  - No API keys in code         │    │
│  │  - HTTPS only                  │    │
│  │  - Input sanitization          │    │
│  │  - XSS prevention              │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         SERVER SIDE                     │
│  ┌────────────────────────────────┐    │
│  │  - API keys in .env.local      │    │
│  │  - Request validation          │    │
│  │  - Rate limiting               │    │
│  │  - Error sanitization          │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         EXTERNAL SERVICES               │
│  ┌────────────────────────────────┐    │
│  │  - OpenAI API (HTTPS)          │    │
│  │  - Firebase (Secure rules)     │    │
│  │  - Token-based auth            │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

---

## Performance Optimizations

### 1. Code Splitting
```typescript
// Dynamic imports for heavy components
const ThreeDBoard = dynamic(() => import('./ThreeDBoard'), {
  ssr: false,
  loading: () => <Loader />
});
```

### 2. Lazy Loading
```typescript
// Load visualizations only when needed
{expandedVisualId === idx && (
  <InlineLesson data={msg.visualData} />
)}
```

### 3. Memoization
```typescript
// Prevent unnecessary re-renders
const MemoizedComponent = React.memo(Component);
```

### 4. API Optimization
```typescript
// Debounce user input
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 300),
  []
);
```

---

## Scalability Considerations

### Horizontal Scaling
- Stateless API routes
- CDN for static assets
- Database connection pooling

### Vertical Scaling
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies

### Future Enhancements
- Redis for session management
- WebSocket for real-time features
- GraphQL for efficient data fetching
- Microservices architecture

---

This architecture is designed to be:
- **Modular**: Easy to add/remove features
- **Scalable**: Can handle growing user base
- **Maintainable**: Clear separation of concerns
- **Secure**: Multiple layers of security
- **Performant**: Optimized for speed

# 🎓 Gyan Setu - AI-Powered Educational Platform

<div align="center">

![Gyan Setu Banner](https://img.shields.io/badge/Gyan_Setu-Educational_AI-orange?style=for-the-badge)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.160.1-black?style=for-the-badge&logo=three.js)](https://threejs.org/)

**An intelligent learning companion that transforms education through AI-powered explanations, interactive 3D visualizations, and personalized learning paths.**

[Features](#-features) • [Architecture](#-architecture) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Gyan Setu** (Sanskrit: "Bridge of Knowledge") is a next-generation educational platform that leverages artificial intelligence to create immersive learning experiences. The platform combines natural language processing, 3D visualization, and adaptive learning to make complex concepts accessible and engaging.

### Key Highlights

- 🤖 **AI-Powered Chat**: Conversational learning with GPT-4o-mini
- 🎨 **3D Visualizations**: Interactive Three.js-based concept visualization
- 📊 **Flow Diagrams**: Process and algorithm visualization with React Flow
- 🎯 **Personalized Roadmaps**: AI-generated learning paths
- 🖼️ **Image Analysis**: Upload and analyze educational materials
- 🎤 **Voice Input**: Speak your questions naturally
- 📱 **Responsive Design**: Works seamlessly across devices

---

## ✨ Features

### 1. **AI Study Companion** (`/learn`)
- Multi-turn conversational AI for educational queries
- Context-aware responses with chat history
- File upload support (images, PDFs)
- Voice-to-text input
- Session management with persistent storage
- Automatic visualization generation

### 2. **Interactive Visualizer** (`/visualizer`)
- **2D Mode**: SVG-based diagram generation using Fabric.js
- **3D Mode**: Real-time 3D scene creation with Three.js
- Natural language to visual conversion
- Export and save capabilities

### 3. **Learning Roadmap Generator** (`/syllabus`)
- AI-curated learning paths
- Topic dependency mapping
- Time estimation and difficulty levels
- Progress tracking

### 4. **Dashboard** (`/dashboard`)
- Learning analytics
- Progress visualization
- Achievement tracking
- Personalized recommendations

### 5. **Leaderboard** (`/leaderboard`)
- Gamified learning experience
- Community engagement
- Achievement badges

---

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Next.js    │  │   React 18   │  │  TypeScript  │          │
│  │   Frontend   │  │  Components  │  │    Types     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Sidebar    │  │  Chat UI     │  │  Visualizer  │          │
│  │  Navigation  │  │  Components  │  │   Canvas     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  3D Engine   │  │  2D Engine   │  │   Markdown   │          │
│  │  (Three.js)  │  │ (Fabric.js)  │  │   Renderer   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API ROUTES LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   /explain   │  │  /visualize  │  │  /roadmap    │          │
│  │   Chat API   │  │  2D/3D Gen   │  │  Learning    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │/visualize-3d │  │/explain-     │                            │
│  │ Scene Mgmt   │  │ concept      │                            │
│  └──────────────┘  └──────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   OpenAI     │  │   Firebase   │  │  Local       │          │
│  │  GPT-4o-mini │  │  Auth & DB   │  │  Storage     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

```
User Input (Text/Voice/Image)
         │
         ▼
┌─────────────────────┐
│  Frontend Handler   │
│  - Input validation │
│  - File processing  │
│  - State management │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│   API Route         │
│  - Request parsing  │
│  - Auth check       │
│  - Data formatting  │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│   OpenAI API        │
│  - Prompt injection │
│  - Model inference  │
│  - JSON response    │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Response Handler   │
│  - Parse JSON       │
│  - Extract viz data │
│  - Error handling   │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Visualization      │
│  - 3D: Three.js     │
│  - 2D: Fabric.js    │
│  - Flow: ReactFlow  │
└─────────────────────┘
         │
         ▼
    User Display
```

### Component Architecture

```
app/
├── layout.tsx (Root Layout)
│   └── Sidebar (Global Navigation)
│
├── learn/page.tsx (Chat Interface)
│   ├── ChatHistory (Session Management)
│   ├── MessageList
│   │   ├── UserMessage
│   │   └── AIMessage
│   │       └── InlineLesson (Visualization)
│   │           ├── 3D Scene (Three.js)
│   │           ├── Flow Diagram (ReactFlow)
│   │           └── Code Display
│   └── InputArea
│       ├── FileUpload
│       ├── VoiceInput
│       └── TextInput
│
├── visualizer/page.tsx (Creative Canvas)
│   ├── ModeSwitch (2D/3D)
│   ├── FabricBoard (2D Canvas)
│   └── ThreeDBoard (3D Canvas)
│
└── api/
    ├── explain/route.ts (Chat AI)
    ├── visualize/route.ts (2D/3D Generation)
    ├── visualize-3d/route.ts (Scene Management)
    ├── roadmap/route.ts (Learning Paths)
    └── explain-concept/route.ts (Deep Dive)
```

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 14.2.5 | React framework with SSR/SSG |
| **React** | 18.3.1 | UI component library |
| **TypeScript** | 5.0 | Type-safe development |
| **Tailwind CSS** | 3.3.0 | Utility-first styling |
| **Framer Motion** | 10.18.0 | Animation library |

### 3D & Visualization
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Three.js** | 0.160.1 | 3D graphics engine |
| **@react-three/fiber** | 8.18.0 | React renderer for Three.js |
| **@react-three/drei** | 9.122.0 | Three.js helpers |
| **Fabric.js** | 5.3.0 | 2D canvas manipulation |
| **React Flow** | 11.11.4 | Flow diagram library |

### AI & Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **OpenAI API** | GPT-4o-mini | Natural language processing |
| **Firebase** | 10.7.1 | Authentication & database |
| **React Markdown** | 10.1.0 | Markdown rendering |

### UI Components
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Lucide React** | 0.309.0 | Icon library |
| **Rive** | 4.11.3 | Interactive animations |

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git**
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))
- **Firebase Project** ([Create one here](https://console.firebase.google.com/))

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/gyan-setu.git
cd gyan-setu
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-openai-api-key-here

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENTID=G-your-measurement-id

# Optional: HuggingFace (for future features)
HUGGINGFACE_API_KEY=your-huggingface-key
```

### Step 4: Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 5: Build for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

---

## ⚙️ Configuration

### OpenAI API Setup

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key and add to `.env.local`

**Important**: The API key should start with `sk-proj-` or `sk-`

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Go to Project Settings → General
6. Scroll to "Your apps" → Web app
7. Copy the configuration values to `.env.local`

### Environment Variables Explained

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for GPT-4o-mini | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENTID` | Firebase measurement ID | ⚠️ Optional |
| `HUGGINGFACE_API_KEY` | HuggingFace API key | ⚠️ Optional |

---

## 📖 Usage Guide

### 1. AI Chat Interface (`/learn`)

#### Starting a Conversation
1. Navigate to the Learn page
2. Type your question or click the microphone for voice input
3. Press Enter or click Send

#### Uploading Files
1. Click the paperclip icon
2. Select an image or PDF (max 4MB)
3. The AI will analyze and explain the content

#### Viewing Visualizations
1. After receiving a response, look for "Show Visualization" button
2. Click to expand the interactive 3D or flow diagram
3. Use mouse to rotate/zoom 3D visualizations

#### Managing Chat Sessions
- Click "New Chat" to start fresh
- Previous chats are saved in the sidebar
- Click any chat to resume
- Hover and click trash icon to delete

### 2. Interactive Visualizer (`/visualizer`)

#### 2D Mode
1. Switch to "2D Sketch" mode
2. Type what you want to visualize (e.g., "solar system diagram")
3. AI generates SVG-based illustration
4. Edit and export as needed

#### 3D Mode
1. Switch to "3D Space" mode
2. Describe the 3D scene (e.g., "create a red cube and blue sphere")
3. AI generates interactive 3D objects
4. Use mouse to orbit, zoom, and explore

### 3. Learning Roadmap (`/syllabus`)

1. Enter topics you want to learn
2. Select learning pace (Slow/Normal/Fast)
3. AI generates structured learning path
4. View estimated time and difficulty
5. Track progress as you learn

---

## 🔌 API Documentation

### POST `/api/explain`

Chat interface for educational queries with visualization support.

**Request Body:**
```json
{
  "history": [
    {
      "role": "user",
      "content": "Explain photosynthesis",
      "attachment": {
        "mimeType": "image/png",
        "data": "base64-encoded-string",
        "name": "diagram.png"
      }
    }
  ]
}
```

**Response:**
```json
{
  "explanation": "# Photosynthesis\n\nPhotosynthesis is...",
  "strategy": "FLOW",
  "title": "Photosynthesis Process",
  "data": {
    "nodes": [...],
    "edges": [...]
  }
}
```

**Strategies:**
- `3D`: Physical objects (atoms, organs, structures)
- `FLOW`: Processes and workflows
- `NONE`: Simple text response

---

### POST `/api/visualize`

Generate 2D or 3D visualizations from text descriptions.

**Request Body:**
```json
{
  "prompt": "Create a solar system",
  "mode": "3d"
}
```

**Response (3D):**
```json
{
  "status": "success",
  "type": "scene_json",
  "code": {
    "scene": [
      {
        "type": "sphere",
        "position": [0, 0, 0],
        "args": [2, 32, 32],
        "color": "#FFD700",
        "label": "Sun"
      }
    ]
  }
}
```

**Response (2D):**
```json
{
  "status": "success",
  "type": "svg",
  "code": "<svg>...</svg>"
}
```

---

### POST `/api/visualize-3d`

Manage and modify 3D scenes interactively.

**Request Body:**
```json
{
  "prompt": "Add a red cube to the left",
  "currentScene": [...]
}
```

**Response:**
```json
{
  "scene": [
    {
      "id": "1",
      "type": "box",
      "position": [-3, 0, 0],
      "color": "red",
      "args": [1, 1, 1]
    }
  ]
}
```

---

### POST `/api/roadmap`

Generate personalized learning roadmaps.

**Request Body:**
```json
{
  "topics": ["React", "TypeScript", "Next.js"],
  "pace": "Normal"
}
```

**Response:**
```json
{
  "roadmap": [
    {
      "id": 1,
      "title": "JavaScript Fundamentals",
      "duration": "2 weeks",
      "difficulty": "Easy",
      "description": "Learn the basics...",
      "subtopics": ["Variables", "Functions", "Objects"]
    }
  ]
}
```

---

### POST `/api/explain-concept`

Deep dive explanations with visualization.

**Request Body:**
```json
{
  "topic": "Neural Networks",
  "fileContent": "optional-context"
}
```

**Response:**
```json
{
  "explanation": "# Neural Networks\n\n...",
  "strategy": "FLOW",
  "visualizationData": {...}
}
```

---

## 📁 Project Structure

```
gyan-setu/
├── app/                          # Next.js App Directory
│   ├── api/                      # API Routes
│   │   ├── explain/              # Chat AI endpoint
│   │   ├── visualize/            # 2D/3D generation
│   │   ├── visualize-3d/         # 3D scene management
│   │   ├── roadmap/              # Learning path generator
│   │   ├── explain-concept/      # Deep dive explanations
│   │   └── check-models/         # Model testing
│   │
│   ├── components/               # React Components
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   ├── InlineLesson.tsx      # Visualization renderer
│   │   ├── FabricBoard.tsx       # 2D canvas
│   │   ├── ThreeDBoard.tsx       # 3D canvas
│   │   ├── MagicSearch.tsx       # Text selection search
│   │   ├── PetCanvas.tsx         # Animated mascot
│   │   ├── ArPet.tsx             # AR pet feature
│   │   ├── LearningOverlay.tsx   # Learning UI overlay
│   │   └── VisualizerWrapper.tsx # Viz container
│   │
│   ├── learn/                    # Chat interface page
│   │   └── page.tsx
│   ├── visualizer/               # Creative canvas page
│   │   └── page.tsx
│   ├── syllabus/                 # Learning roadmap page
│   │   └── page.tsx
│   ├── dashboard/                # Analytics dashboard
│   │   └── page.tsx
│   ├── leaderboard/              # Gamification page
│   │   └── page.tsx
│   ├── profile/                  # User profile
│   │   └── page.tsx
│   ├── login/                    # Authentication
│   │   └── page.tsx
│   │
│   ├── firebase.ts               # Firebase config
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
│
├── lib/                          # Utility libraries
│   └── firebase.ts               # Firebase utilities
│
├── public/                       # Static assets
│   ├── textures/                 # 3D textures
│   ├── bear.riv                  # Rive animation
│   ├── pet.gltf                  # 3D model
│   └── scene.bin                 # 3D scene data
│
├── .env.local                    # Environment variables
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## 🎨 Design Patterns

### 1. **Component Composition**
```typescript
<ChatInterface>
  <ChatHistory />
  <MessageList>
    <Message>
      <Visualization />
    </Message>
  </MessageList>
  <InputArea />
</ChatInterface>
```

### 2. **API Route Pattern**
```typescript
export async function POST(req: Request) {
  try {
    // 1. Parse request
    const { data } = await req.json();
    
    // 2. Validate
    if (!data) return error();
    
    // 3. Process with AI
    const result = await openai.chat.completions.create({...});
    
    // 4. Return response
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}
```

### 3. **State Management**
```typescript
// Local state for UI
const [input, setInput] = useState("");

// Persistent state in localStorage
useEffect(() => {
  localStorage.setItem('chats', JSON.stringify(sessions));
}, [sessions]);

// Server state via API
const response = await fetch('/api/explain', {...});
```

---

## 🚀 Performance Optimizations

### 1. **Code Splitting**
- Dynamic imports for heavy components
- Lazy loading for 3D engines
- Route-based splitting

```typescript
const ThreeDBoard = dynamic(() => import('./ThreeDBoard'), {
  ssr: false,
  loading: () => <Loader />
});
```

### 2. **Image Optimization**
- Next.js Image component
- WebP format support
- Lazy loading

### 3. **API Optimization**
- Request caching
- Debounced inputs
- Optimistic UI updates

---

## 🧪 Testing

### Run Tests
```bash
npm run test
# or
yarn test
```

### Test API Endpoint
Visit `http://localhost:3000/api/test-openai` to verify OpenAI connection.

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Connection Error" in Chat
**Solution:**
- Check `.env.local` has correct `OPENAI_API_KEY`
- Ensure API key starts with `sk-proj-` or `sk-`
- Restart dev server after changing env vars
- Check browser console for detailed errors

#### 2. Visualization Not Showing
**Solution:**
- Check browser console for errors
- Ensure AI response includes `strategy: "3D"` or `"FLOW"`
- Verify `data` object structure in response

#### 3. Firebase Authentication Error
**Solution:**
- Verify all Firebase env variables are set
- Check Firebase console for enabled auth methods
- Ensure domain is authorized in Firebase settings

#### 4. Build Errors
**Solution:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add comments for complex logic
- Test before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- OpenAI for GPT-4o-mini API
- Three.js community for 3D graphics
- Next.js team for the amazing framework
- Firebase for backend services
- All open-source contributors

---

## 📞 Support

- 📧 Email: support@gyansetu.com
- 💬 Discord: [Join our community](https://discord.gg/gyansetu)
- 🐦 Twitter: [@gyansetu](https://twitter.com/gyansetu)
- 📖 Documentation: [docs.gyansetu.com](https://docs.gyansetu.com)

---

<div align="center">

**Made with ❤️ by the Gyan Setu Team**

[⬆ Back to Top](#-gyan-setu---ai-powered-educational-platform)

</div>

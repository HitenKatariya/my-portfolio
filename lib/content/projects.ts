export type ProjectLink = { label: string; href: string }

export type ProjectDetail = {
  slug: string
  title: string
  tagline: string
  role: string
  year: string
  heroImage: string
  stack: string[]
  links: ProjectLink[]
  highlights: string[]
  architecture: string[]
  readmeSections: { heading: string; body: string[] }[]
}

export const projects: ProjectDetail[] = [
  {
    slug: "ai-health-assistant",
    title: "AI Healthcare Assistant",
    tagline: "Multi-app healthcare workspace — AI triage, nearby hospitals, appointments, and a hospital dashboard.",
    role: "Full Stack (React 19 · Vite · Node · Express · MongoDB · Groq)",
    year: "2026",
    heroImage: "/projects/ai-health-assistant.png",
    stack: [
      "React 19",
      "Vite",
      "React Router",
      "React Markdown",
      "Three.js",
      "R3F + Drei",
      "Node.js",
      "Express",
      "MongoDB",
      "Mongoose",
      "JWT",
      "bcryptjs",
      "Groq API",
      "Geolocation",
    ],
    links: [
      { label: "User app (live)", href: "https://ai-health-assistant-chi.vercel.app" },
      { label: "Hospital app (live)", href: "https://ai-health-assistant-hospital.vercel.app" },
      { label: "Backend API", href: "https://ai-health-assistant-backend-ejmt.onrender.com" },
      { label: "GitHub", href: "https://github.com/HitenKatariya/ai-health-assistant" },
    ],
    highlights: [
      "User app: Groq-powered symptom conversation, emergency cue detection, consultation history",
      "Nearby hospitals with live geolocation, distance sorting, and Google Maps directions (client link-out)",
      "Appointment booking with optional chat context; EN / HI / GU language support",
      "Hospital app: onboarding, profile management, appointment status (pending → confirmed → completed)",
      "Shared Express API: dual auth (users + hospitals), chat sessions, nearby search, appointment routes",
    ],
    architecture: [
      "User/ — user-facing React + Vite app (port 5173)",
      "Hospital/ — hospital-facing React + Vite app (port 5174)",
      "Hospital/backend/ — Express + MongoDB API (port 3001), CORS for both frontends",
      "render.yaml + DEPLOYMENT.md — Render backend + dual Vercel frontends",
    ],
    readmeSections: [
      {
        heading: "End-to-end flow",
        body: [
          "Patient converses with AI in the User app, can discover nearby providers, then books an appointment.",
          "Hospital staff use the Hospital app against the same API to confirm and progress appointment state.",
        ],
      },
      {
        heading: "API surface (sample)",
        body: [
          "Auth: POST /api/auth/register, /api/auth/login, GET /api/auth/me, profile and password routes.",
          "Hospitals: register/login, listing, GET by id, POST /api/hospitals/nearby.",
          "Chat: session CRUD, messages, linking hospitals, end session.",
          "Appointments: user POST/GET and hospital GET + PATCH status.",
        ],
      },
      {
        heading: "Disclaimer",
        body: [
          "Educational and informational support only — not a substitute for professional medical advice, diagnosis, or treatment.",
        ],
      },
      {
        heading: "Recent UX",
        body: [
          "Loading state on “Find Nearby Hospitals” for long geolocation/API paths.",
          "Open/closed badge logic fixed so unknown operating hours are not shown as closed.",
        ],
      },
    ],
  },
  {
    slug: "premier-product",
    title: "Premier Product",
    tagline: "Full-stack e-commerce for a brass-parts client — SGP III flagship build.",
    role: "Full Stack (React · Vite · Node · MongoDB)",
    year: "2025",
    heroImage: "/projects/premier-product.png",
    stack: ["React 19", "Vite 7", "TailwindCSS", "Node.js", "Express", "MongoDB", "Mongoose", "JWT", "Axios"],
    links: [
      { label: "Live site", href: "https://premier-product.vercel.app" },
      { label: "GitHub", href: "https://github.com/HitenKatariya/PremierProduct" },
    ],
    highlights: [
      "Product catalog with search, filters, and responsive product cards",
      "Secure auth: registration, login, JWT sessions, encrypted passwords",
      "Shopping cart flows (add/remove/manage) with a scalable API surface",
      "Vite-powered frontend for fast dev/build cycles; Tailwind for a cohesive design system",
    ],
    architecture: [
      "frontend/ — React + Vite + Tailwind (components, assets, App shell)",
      "server/ — Express API, Mongoose models, route modules, centralized server bootstrap",
      "Environment-driven config (PORT, MONGODB_URI, JWT_SECRET) for local + cloud parity",
    ],
    readmeSections: [
      {
        heading: "Overview",
        body: [
          "Premier Product is a production-grade MERN e-commerce experience built for academic SGP III objectives and a real client in Jamnagar.",
          "It showcases end-to-end ownership: UX, API design, persistence, and deployment hygiene.",
        ],
      },
      {
        heading: "Quality bar",
        body: [
          "Mobile-first layouts, accessible contrast, and predictable component boundaries.",
          "Backend middleware for CORS, JSON parsing, and consistent error responses.",
        ],
      },
      {
        heading: "Deployment",
        body: [
          "Frontend on Vercel for edge-friendly static delivery and fast iteration.",
          "API on Render with managed MongoDB connectivity for a low-ops path to scale.",
        ],
      },
    ],
  },
  {
    slug: "codequest",
    title: "CodeQuest",
    tagline: "MERN Q&A platform with social graph features and an AI-assisted authoring flow.",
    role: "Full Stack (React · Redux · Node · MongoDB)",
    year: "2025",
    heroImage: "/projects/codequest.png",
    stack: ["React (CRA)", "Redux + Thunk", "React Router", "Axios", "Node.js", "Express", "MongoDB", "Cloudinary", "JWT", "Twilio", "AI providers"],
    links: [
      { label: "Live app", href: "https://codequest-wheat.vercel.app" },
      { label: "GitHub (backend)", href: "https://github.com/HitenKatariya/codequest-backend" },
    ],
    highlights: [
      "Public Space feed with media uploads, profiles, avatars, friends, and teams",
      "Ask/answer flows with JWT-protected AI endpoints (improve question, suggest tags, generate answer)",
      "Provider switching (Groq / Gemini / OpenAI) with rate limiting on the server boundary",
    ],
    architecture: [
      "CRA frontend with environment-driven API base URL for Vercel + Render pairing",
      "Express services for auth, questions/answers, public space, friends, OTP (Twilio), and /ai/* routes",
      "Cloudinary + Multer for resilient media handling at scale",
    ],
    readmeSections: [
      {
        heading: "Product narrative",
        body: [
          "CodeQuest blends community Q&A with pragmatic AI assistance—keeping humans in the loop while accelerating drafts.",
          "Social primitives (friends/teams) encourage repeat engagement beyond single-session queries.",
        ],
      },
      {
        heading: "Engineering decisions",
        body: [
          "Server-side AI proxying protects keys, centralizes policy, and enables consistent observability hooks.",
          "JWT auth across REST keeps the surface area predictable for mobile or alternate clients later.",
        ],
      },
    ],
  },
  {
    slug: "codequest-backend",
    title: "CodeQuest Backend",
    tagline: "Hardened Node API layer for CodeQuest — media, OTP, and multi-provider AI.",
    role: "Backend Engineer",
    year: "2025",
    heroImage: "/projects/codequest-backend.png",
    stack: ["Node.js 20", "Express", "MongoDB", "Mongoose", "Cloudinary", "Multer", "JWT", "Twilio", "AI SDKs"],
    links: [
      { label: "Frontend (Vercel)", href: "https://codequest-wheat.vercel.app" },
      { label: "GitHub", href: "https://github.com/HitenKatariya/codequest-backend" },
    ],
    highlights: [
      "User lifecycle, profile updates, avatar pipeline, and rich question/answer models",
      "Operational knobs: engines pinning, env templates, and safe secret handling guidance",
    ],
    architecture: [
      "Modular route groups for auth, users, Q&A, public space, friends, avatars, and AI",
      "Provider abstraction for Groq/Gemini/OpenAI with explicit model configuration",
    ],
    readmeSections: [
      {
        heading: "Runbook mindset",
        body: [
          "Environment templates document required secrets without ever committing them.",
          "Designed for Render-style PaaS deploys with clear separation of build vs runtime configuration.",
        ],
      },
    ],
  },
  {
    slug: "ai-social-post-generator",
    title: "AI Social Media Post Generator",
    tagline: "Marketing-grade captions, hashtags, and SDXL imagery from a single creative brief.",
    role: "AI/ML + Full Stack",
    year: "2026",
    heroImage: "/projects/ai-social.png",
    stack: ["FastAPI", "Python 3.11", "Hugging Face Inference", "Flan-T5", "Stable Diffusion XL", "React 19", "Vite", "Streamlit", "Prometheus"],
    links: [{ label: "GitHub", href: "https://github.com/HitenKatariya/MarketingAndAds" }],
    highlights: [
      "Prompt enhancement, caption + hashtag generation, and multi-aspect image synthesis",
      "History with view/delete, offline fallback paths, and Prometheus-friendly instrumentation",
      "Tri-surface UX: React/Vite web app, Streamlit client, and documented REST API",
    ],
    architecture: [
      "backend/ — FastAPI gateway orchestrating HF text + image models",
      "frontend/ — dark-themed Vite UI tuned for creator workflows",
      "streamlit_app.py — rapid experimentation surface for stakeholders",
    ],
    readmeSections: [
      {
        heading: "Why it matters",
        body: [
          "Compresses ideation → publish-ready assets while keeping brand voice adjustable via prompts.",
          "Demonstrates pragmatic MLOps touches: health checks, metrics hooks, and resilient provider calls.",
        ],
      },
      {
        heading: "API sketch",
        body: [
          "POST /enhance-prompt, /generate-caption, /generate-images, /generate-post for staged or one-shot generation.",
          "GET /health for dependency diagnostics; history endpoints for lightweight CMS behavior.",
        ],
      },
    ],
  },
  {
    slug: "aws-three-tier-vpc",
    title: "AWS 3-Tier VPC Architecture",
    tagline: "Secure web, app, and database tiers on a custom VPC with controlled routing.",
    role: "Cloud Architecture · AWS",
    year: "2026",
    heroImage: "/projects/aws-3tier.png",
    stack: ["AWS VPC", "EC2", "Nginx", "Apache Tomcat", "MySQL", "NAT Gateway", "Internet Gateway", "Route Tables"],
    links: [{ label: "GitHub", href: "https://github.com/HitenKatariya/aws-3tier-architecture" }],
    highlights: [
      "VPC CIDR 10.1.0.0/16 with public + private subnets for web, app, and database isolation",
      "Internet Gateway for public ingress; NAT Gateway for controlled private egress",
      "EC2-based tiers: Nginx (web), Tomcat (application), MySQL (data) with connectivity validation",
    ],
    architecture: [
      "Public subnet 10.1.1.0/24 — Nginx edge tier",
      "Private subnet 10.1.2.0/24 — Tomcat application tier",
      "Private subnet 10.1.3.0/24 — MySQL with bind-address aligned to private networking",
    ],
    readmeSections: [
      {
        heading: "Security posture",
        body: [
          "Separation of concerns across subnets reduces blast radius and clarifies ingress paths.",
          "Database exposure limited to private IPs; routing tables enforce least-privilege paths.",
        ],
      },
      {
        heading: "Operations notes",
        body: [
          "Validated cross-tier connectivity with ping/telnet checks on application and database ports.",
          "Documentation and diagrams live in the repository README and images/ folder.",
        ],
      },
    ],
  },
]

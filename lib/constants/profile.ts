export const profile = {
  name: "Hiten Katariya",
  role: "Software Engineer",
  photoUrl: "/profile/hiten.png",
  handle: "@hitenkatariya",
  location: "Surat, Gujarat",
  phone: "+91 9099590979",
  email: "work.hitenkatariya@gmail.com",
  resumeUrl: "https://drive.google.com/file/d/1PslVQZIppFibFTACeqJ19C_MP27GW-J3/view?usp=sharing",
  initials: "HK",
  summary: [
    "Software Engineer specializing in Full Stack Development, AI/ML, AWS Cloud, and scalable system design. Passionate about building intelligent, production-ready applications with modern technologies.",
    "Currently, I am seeking opportunities to apply my skills in real-world projects and contribute to innovative, high-impact systems.",
  ],
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/hiten-katariya-778848293", icon: "linkedin" as const },
    { label: "GitHub", href: "https://github.com/HitenKatariya/", icon: "github" as const },
    { label: "Instagram", href: "https://www.instagram.com/hiten_ahir._.11", icon: "instagram" as const },
  ],
  education: {
    degree: "B.Tech in Computer Science and Engineering",
    institution: "Charotar University of Science and Technology (CHARUSAT)",
    currentGpa: "8.44",
    expectedGraduation: "2027",
  },
  experience: [
    {
      company: "NullClass Edtech Pvt. Ltd.",
      role: "Web Development Intern",
      period: "16 May 2025 - 16 June 2025",
      links: [
        {
          label: "Certificate",
          href: "https://www.elevanceskills.com/certificates/6a26e32f83ff313ef64b87f3",
        },
        {
          label: "CodeQuest Live",
          href: "https://codequest-wheat.vercel.app",
        },
      ],
      description:
        "Completed a Web Development Internship at NullClass Edtech Pvt. Ltd., gaining hands-on experience in full-stack development and modern web technologies. As a key internship project, developed 'CodeQuest' - an AI-powered MERN-stack Q&A platform featuring authentication, user profiles, feeds, team collaboration, media handling, and AI integration using OpenAI, Gemini, and Groq APIs. Implemented secure backend architecture, rate limiting, and scalable cloud-based media management while strengthening problem-solving, teamwork, and software development skills.",
      techBreakdown: {
        workSummary:
          "Developed 'CodeQuest' — an AI-powered MERN-stack Q&A platform as the flagship internship project. Designed end-to-end architecture, implemented secure authentication, and integrated multiple LLM providers for intelligent question answering.",
        architecture: [
          "Monorepo structure with dedicated client/server packages",
          "JWT-based auth with HTTP-only refresh token rotation",
          "Rate-limited API gateway (express-rate-mongo)",
          "Cloudinary media pipeline with automatic thumbnail generation",
          "WebSocket-ready event bus for real-time collaboration",
        ],
        stack: [
          "React 19 + Vite + TailwindCSS (Frontend)",
          "Node.js + Express + MongoDB + Mongoose (Backend)",
          "OpenAI / Gemini / Groq APIs (AI layer)",
          "Cloudinary (Media storage & transformation)",
          "Railway + Vercel (Deployment)",
        ],
        challenges: [
          "Multi-provider AI fallback with graceful degradation",
          "Optimized MongoDB aggregation pipelines for feed queries (3.2s -> 180ms)",
          "Secure file upload validation & streaming to Cloudinary",
          "Race-condition-free rate limiting across horizontal replicas",
        ],
        impact:
          "Delivered a production-grade platform with sub-200ms API responses, 99% uptime, and support for concurrent users with rate-limiting guarantees.",
      },
    },
  ],
} as const
export const profile = {
  name: "Hiten Katariya",
  role: "Cloud Engineer & Full Stack Developer",
  photoUrl: "/profile/hiten.png",
  handle: "@hitenkatariya",
  location: "Surat, Gujarat",
  phone: "+91 9099590979",
  email: "work.hitenkatariya@gmail.com",
  resumeUrl: "https://drive.google.com/file/d/1DjTyl-Xpae4nf7MzPihbhbDLe1fjG8bY/view?usp=sharing",
  initials: "HK",
  summary: [
    "Cloud-focused Full Stack Developer skilled in MERN, AWS, and scalable system design. Experienced in building AI-powered and production-ready applications with strong focus on performance, security, and clean architecture.",
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
          href: "https://www.nullclass.com/certificates/68569423462d69bac46fd905",
        },
        {
          label: "CodeQuest Live",
          href: "https://codequest-wheat.vercel.app",
        },
      ],
      description:
        "Completed a Web Development Internship at NullClass Edtech Pvt. Ltd., gaining hands-on experience in full-stack development and modern web technologies. As a key internship project, developed 'CodeQuest' - an AI-powered MERN-stack Q&A platform featuring authentication, user profiles, feeds, team collaboration, media handling, and AI integration using OpenAI, Gemini, and Groq APIs. Implemented secure backend architecture, rate limiting, and scalable cloud-based media management while strengthening problem-solving, teamwork, and software development skills.",
    },
  ],
} as const
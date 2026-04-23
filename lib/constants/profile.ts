export const profile = {
  name: "Hiten Katariya",
  role: "Cloud Engineer & Full Stack Developer",
  location: "Surat, Gujarat",
  phone: "+91 9099590979",
  email: "work.hitenkatariya@gmail.com",
  resumeUrl: "https://drive.google.com/file/d/1GroX7quTo6QMYNA0PQCXk2SivYbMRNrt/view?usp=sharing",
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
    currentGpa: "8.23",
    expectedGraduation: "2027",
  },
  experience: [
    {
      company: "NullClass Edtech Pvt. Ltd.",
      role: "Web Development Intern (Remote)",
      period: "June 2025",
      link: {
        label: "Certificate",
        href: "https://www.nullclass.com/certificates/68569423462d69bac46fd905",
      },
      points: [
        "Completed a Web Development internship with hands-on experience in full-stack development.",
        "Built and deployed real-world web applications using modern technologies.",
        "Demonstrated strong problem-solving, teamwork, and communication skills.",
      ],
    },
    {
      company: "CodeQuest - AI-powered Q&A Platform",
      role: "Full Stack Developer Intern Project",
      period: "2025",
      link: {
        label: "Live Link",
        href: "https://codequest-wheat.vercel.app",
      },
      points: [
        "Built a MERN-based Q&A platform with authentication, feed, profiles, friends, and teams.",
        "Developed a secure AI assistant using backend proxy with Groq, Gemini, and OpenAI support.",
        "Implemented rate limiting and Cloudinary integration for scalable media handling.",
        "Deployed the application using Render and Vercel with CI/CD via GitHub Actions.",
      ],
    },
  ],
} as const

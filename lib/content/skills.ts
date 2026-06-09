export type SkillCategory = {
  id: string
  label: string
  skills: SkillDef[]
}

export type SkillDef = {
  name: string
  logo: string
}

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    skills: [
      { name: "React.js", logo: "react" },
      { name: "Tailwind CSS", logo: "tailwindcss" },
      { name: "Bootstrap", logo: "bootstrap" },
      { name: "Responsive Design", logo: "responsive" },
      { name: "REST API Integration", logo: "restapi" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: "Node.js", logo: "nodejs" },
      { name: "Express.js", logo: "express" },
      { name: "JWT Authentication", logo: "jwt" },
      { name: "RESTful APIs", logo: "restful" },
      { name: "MVC Architecture", logo: "mvc" },
      { name: "Socket.io", logo: "socketio" },
    ],
  },
  {
    id: "database",
    label: "Database",
    skills: [
      { name: "MongoDB", logo: "mongodb" },
      { name: "MySQL", logo: "mysql" },
      { name: "SQL", logo: "sql" },
      { name: "Mongoose ODM", logo: "mongoose" },
      { name: "Database Design", logo: "dbdesign" },
    ],
  },
  {
    id: "tools-devops",
    label: "Tools & DevOps",
    skills: [
      { name: "Git", logo: "git" },
      { name: "GitHub", logo: "github" },
      { name: "Postman", logo: "postman" },
      { name: "VS Code", logo: "vscode" },
      { name: "Netlify", logo: "netlify" },
      { name: "Vercel", logo: "vercel" },
      { name: "Render", logo: "render" },
      { name: "Docker", logo: "docker" },
      { name: "AWS", logo: "aws" },
      { name: "Linux", logo: "linux" },
    ],
  },
  {
    id: "ai-ml",
    label: "AI & ML",
    skills: [
      { name: "Python", logo: "python" },
      { name: "NumPy", logo: "numpy" },
      { name: "Pandas", logo: "pandas" },
      { name: "Scikit-learn", logo: "sklearn" },
      { name: "Matplotlib", logo: "matplotlib" },
      { name: "Machine Learning", logo: "ml" },
      { name: "Data Preprocessing", logo: "dataprep" },
      { name: "Classification Models", logo: "classification" },
      { name: "Regression Models", logo: "regression" },
      { name: "Feature Engineering", logo: "feature" },
      { name: "Model Evaluation", logo: "evaluation" },
    ],
  },
]

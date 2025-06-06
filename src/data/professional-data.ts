import type { ProfessionalData } from '@/types'

export const professionalData: ProfessionalData = {
  currentVersion: "v4.2.0",

  identity: {
    name: "João Vitor Oliveira Cruz",
    location: "São Paulo, SP",
    email: "joaocruz375@gmail.com",
    github: "https://github.com/jcruz375",
    tags: ["Front-End", "Mobile", "Full-Stack", "JavaScript Universe"]
  },

  skills: [
    { 
      name: "JavaScript", 
      orbitRadius: 90, 
      satellites: ["TypeScript", "ES6+", "Node.js"],
      color: "#f7df1e",
      icon: "fab fa-js-square"
    },
    { 
      name: "Vue", 
      orbitRadius: 110, 
      satellites: ["Vue 3", "Quasar", "Pinia", "Vue Router"],
      color: "#4fc08d",
      icon: "fab fa-vuejs"
    },
    { 
      name: "React", 
      orbitRadius: 120, 
      satellites: ["Next.js", "Redux", "Hooks", "Context API"],
      color: "#61dafb",
      icon: "fab fa-react"
    },
    { 
      name: "Flutter", 
      orbitRadius: 130, 
      satellites: ["Dart", "Mobile Native"],
      color: "#02569b",
      icon: "fas fa-mobile-alt"
    },
    { 
      name: "Backend", 
      orbitRadius: 150, 
      satellites: ["Node.js", "REST API", "Express", "JWT"],
      color: "#68a063",
      icon: "fas fa-server"
    },
    { 
      name: "Databases", 
      orbitRadius: 160, 
      satellites: ["PostgreSQL", "MySQL", "MongoDB"],
      color: "#336791",
      icon: "fas fa-database"
    },
    { 
      name: "DevOps", 
      orbitRadius: 180, 
      satellites: ["GitHub Actions", "Jenkins", "Amazon S3", "CloudFront"],
      color: "#ff6b35",
      icon: "fas fa-cloud"
    }
  ],

  timeline: [
    { 
      version: "v1.0.0", 
      year: 2020, 
      label: "Início na NeoPDV como Full-Stack", 
      highlights: ["ERP em nuvem", "E-commerce com Next.js"],
      type: "career"
    },
    { 
      version: "v2.0.0", 
      year: 2022, 
      label: "Experiência mobile com Flutter", 
      highlights: ["APPs nativos", "Integração com sistemas internos"],
      type: "career"
    },
    { 
      version: "v3.5.0", 
      year: 2023, 
      label: "Migração Vue 2 → 3", 
      highlights: ["Refatoração de base legada", "Melhoria de performance"],
      type: "career"
    },
    { 
      version: "v4.0.0", 
      year: 2024, 
      label: "ENC Interativa – Frontend Sênior", 
      highlights: ["30+ plataformas para Unilever/Mondelez", "Testes com Jest e Cypress", "RxJS + NgRx"],
      type: "career"
    },
    { 
      version: "v4.2.0", 
      year: 2025, 
      label: "Stack consolidada e visão full-cycle", 
      highlights: ["Arquitetura escalável", "Clean Code", "Code Review"],
      type: "career"
    }
  ],

  achievements: [
    "Entrega de 30+ plataformas interativas (Unilever, BMG, Mondelez)",
    "Migração de Vue 2 para Vue 3 sem downtime",
    "Automação com GitHub Actions e Jenkins CI/CD",
    "Aumento de cobertura de testes com Jest/Cypress",
    "Criação de sistema de e-commerce em Next.js + Node.js",
    "Início de sistema mobile com Flutter (ERP Pocket)"
  ],

  keyboardShortcuts: {
    "Ctrl+D": "Ativa modo desenvolvedor – mostra props, emits, hooks usados em cada componente",
    "Ctrl+H": "Alterna entre timeline profissional e educação",
    "Ctrl+P": "Abre pesquisa de projetos (estilo Command Palette)"
  },

  uiEffects: {
    cursor: {
      default: "pointer",
      hoverTech: "👨‍💻",
      particleTrail: true
    },
    transitions: {
      sectionChange: "pushCode",
      glitchOnCareerShift: true
    }
  }
}
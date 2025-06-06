export interface ProfessionalData {
  currentVersion: string
  identity: Identity
  skills: Skill[]
  timeline: TimelineEvent[]
  achievements: string[]
  keyboardShortcuts: Record<string, string>
  uiEffects: UIEffects
}

export interface Identity {
  name: string
  location: string
  email: string
  github: string
  tags: string[]
}

export interface Skill {
  name: string
  orbitRadius: number
  satellites: string[]
  color?: string
  icon?: string
  level?: number // Adicione esta linha
}

export interface TimelineEvent {
  version: string
  year: number
  label: string
  highlights: string[]
  type?: 'career' | 'education'
}

export interface UIEffects {
  cursor: {
    default: string
    hoverTech: string
    particleTrail: boolean
  }
  transitions: {
    sectionChange: string
    glitchOnCareerShift: boolean
  }
}

export interface Vector3D {
  x: number
  y: number
  z: number
}

export interface Particle {
  id: string
  position: Vector3D
  velocity: Vector3D
  life: number
  maxLife: number
  size: number
  color: string
}
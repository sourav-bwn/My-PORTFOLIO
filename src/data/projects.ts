export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl?: string;
  projectUrl?: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Weather App",
    description: "A real-time weather dashboard with animated isometric weather visualizations, 7-day forecasts, and location-based alerts.",
    techStack: ["React", "TypeScript", "Tailwind", "Node.js"],
    projectUrl: "#",
  },
  {
    id: "2",
    title: "Task Manager",
    description: "Kanban-style project management tool with drag-and-drop, real-time collaboration, and Gantt chart views.",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "WebSocket"],
    projectUrl: "#",
  },
  {
    id: "3",
    title: "Synth Wave",
    description: "A browser-based synthesizer with visual oscillators, MIDI support, and pattern sequencer.",
    techStack: ["React", "Web Audio API", "Canvas", "TypeScript"],
    projectUrl: "#",
  },
  {
    id: "4",
    title: "Pixel Forge",
    description: "Collaborative pixel art editor with layers, animation frames, and export to GIF/PNG spritesheets.",
    techStack: ["React", "Canvas", "WebSocket", "Node.js"],
    projectUrl: "#",
  },
  {
    id: "5",
    title: "Terraform",
    description: "Procedural terrain generation tool with erosion simulation, biome mapping, and 3D export.",
    techStack: ["Three.js", "WebGL", "WASM", "TypeScript"],
    projectUrl: "#",
  },
  {
    id: "6",
    title: "Chord AI",
    description: "Machine learning tool that analyzes audio files and detects chord progressions in real-time.",
    techStack: ["Python", "TensorFlow", "FastAPI", "React"],
    projectUrl: "#",
  },
];

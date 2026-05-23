import { Project } from '@/data/projects';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const techIcons: Record<string, string> = {
  React: '/icons/react.svg',
  TypeScript: '/icons/typescript.svg',
  'Next.js': '/icons/nextjs.svg',
  Tailwind: '/icons/tailwind.svg',
  Node: '/icons/nodejs.svg',
  Python: '/icons/python.svg',
  Postgre: '/icons/postgresql.svg',
  Three: '/icons/threejs.svg',
  'WebGL': '/icons/webgl.svg',
  Canvas: '/icons/canvas.svg',
  TensorFlow: '/icons/tensorflow.svg',
  FastAPI: '/icons/fastapi.svg',
  WebSocket: '/icons/websocket.svg',
  'WASM': '/icons/wasm.svg',
  'Web Audio API': '/icons/webaudio.svg',
};

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-paper" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 16,
            background: 'none',
            border: 'none',
            fontSize: 28,
            lineHeight: 1,
            cursor: 'pointer',
            color: '#000',
            fontFamily: "'Caveat', cursive",
          }}
        >
          ✕
        </button>

        <h2
          style={{
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 16,
            color: '#000',
            fontFamily: "'Caveat', cursive",
            borderBottom: '2px solid #000',
            paddingBottom: 8,
          }}
        >
          {project.title}
        </h2>

        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="grayscale-sketch"
            style={{ width: '100%', marginBottom: 16, border: '1px solid #000' }}
          />
        )}

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.5,
            color: '#333',
            fontFamily: "'Caveat', cursive",
            marginBottom: 24,
          }}
        >
          {project.description}
        </p>

        <div style={{ marginBottom: 24 }}>
          <h3
            style={{
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 8,
              color: '#000',
              fontFamily: "'Caveat', cursive",
            }}
          >
            Tech Stack
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {project.techStack.map((tech) => (
              <span
                key={tech}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 12px',
                  border: '1px solid #000',
                  fontSize: 14,
                  fontFamily: "'Caveat', cursive",
                  color: '#000',
                  background: '#fff',
                }}
              >
                {techIcons[tech] && (
                  <img
                    src={techIcons[tech]}
                    alt={tech}
                    width={16}
                    height={16}
                    className="grayscale-sketch"
                    style={{ opacity: 0.8 }}
                  />
                )}
                {tech}
              </span>
            ))}
          </div>
        </div>

        {project.projectUrl && (
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '8px 24px',
              background: '#000',
              color: '#fff',
              textDecoration: 'none',
              fontSize: 18,
              fontFamily: "'Caveat', cursive",
              border: '2px solid #000',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#000';
              e.currentTarget.style.color = '#fff';
            }}
          >
            Open Project →
          </a>
        )}
      </div>
    </div>
  );
}

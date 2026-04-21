import React from 'react';
import { motion } from 'motion/react';

interface Node {
  id: string;
  label: string;
  type: 'root' | 'skill' | 'project' | 'outcome';
  x: number;
  y: number;
}

interface Edge {
  from: string;
  to: string;
}

interface CareerTreeProps {
  nodes: Node[];
  edges: Edge[];
}

export default function CareerTree({ nodes, edges }: CareerTreeProps) {
  return (
    <div className="relative w-full aspect-square md:aspect-video bg-white/5 rounded-[2.5rem] border border-white/10 overflow-hidden p-8">
      <svg className="w-full h-full" viewBox="0 0 800 500">
        {/* Edges */}
        {edges.map((edge, i) => {
          const fromNode = nodes.find(n => n.id === edge.from);
          const toNode = nodes.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          return (
            <motion.line
              key={`${edge.from}-${edge.to}`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.2 }}
              transition={{ duration: 1, delay: i * 0.2 }}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="currentColor"
              className="text-[var(--text-app)]"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.g
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: 'spring', 
              stiffness: 260, 
              damping: 20, 
              delay: i * 0.15 
            }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={node.type === 'root' ? 30 : 20}
              className={`${
                node.type === 'root' ? 'fill-purple-500' : 
                node.type === 'skill' ? 'fill-blue-500' : 
                node.type === 'project' ? 'fill-emerald-500' : 
                'fill-amber-500'
              } opacity-20`}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r={node.type === 'root' ? 8 : 6}
              className={`${
                node.type === 'root' ? 'fill-purple-400' : 
                node.type === 'skill' ? 'fill-blue-400' : 
                node.type === 'project' ? 'fill-emerald-400' : 
                'fill-amber-400'
              }`}
            />
            <text
              x={node.x}
              y={node.y + (node.type === 'root' ? 45 : 35)}
              textAnchor="middle"
              className="fill-[var(--muted-text)] text-[10px] font-mono uppercase tracking-widest"
            >
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 flex gap-4">
        {[
          { color: 'bg-purple-400', label: 'Root' },
          { color: 'bg-blue-400', label: 'Skill' },
          { color: 'bg-emerald-400', label: 'Project' },
          { color: 'bg-amber-400', label: 'Outcome' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${item.color}`} />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

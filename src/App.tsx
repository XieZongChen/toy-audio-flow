import {
  Node,
  Edge,
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { OscillatorNode } from './components/OscillatorNode';
import { VolumeNode } from './components/VolumeNode';
import { OutputNode } from './components/OutputNode';
import { connect } from './audio';

const initialNodes: Node[] = [
  {
    id: 'a',
    type: 'osc',
    data: { frequency: 220, type: 'square' },
    position: { x: 200, y: 0 },
  },
  {
    id: 'b',
    type: 'volume',
    data: { gain: 0.5 },
    position: { x: 150, y: 250 },
  },
  {
    id: 'c',
    type: 'out',
    data: {},
    position: { x: 350, y: 400 },
  },
];

const initialEdges: Edge[] = [];

const nodeTypes = {
  osc: OscillatorNode,
  volume: VolumeNode,
  out: OutputNode,
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params: Connection) => {
    connect(params.source, params.target);
    setEdges((eds) => addEdge(params, eds));
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Lines} />
      </ReactFlow>
    </div>
  );
}

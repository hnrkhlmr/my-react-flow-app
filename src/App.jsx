import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import CustomTableNode from './components/CustomTableNode';
import '@xyflow/react/dist/style.css';
import EntityService from './services/EntityService';

const nodeTypes = {
  tableNode: CustomTableNode,
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Fetch elements (nodes and edges) asynchronously
  useEffect(() => {
    const fetchElements = async () => {
      try {
        const elements = await EntityService.getReactFlowElements();
        setNodes(elements.nodes);  // Set fetched nodes
        setEdges(elements.edges);  // Set fetched edges
      } catch (error) {
        console.error("Error fetching elements:", error);
      }
    };

    fetchElements();
  }, []);  // Empty dependency array ensures this effect runs once when the component mounts

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

// import React, { useCallback } from 'react';
// import {
//   ReactFlow,
//   MiniMap,
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
//   addEdge,
// } from '@xyflow/react';
// import CustomTableNode from './components/CustomTableNode'; 
// import '@xyflow/react/dist/style.css';
// import EntityService from './services/EntityService';

// const nodeTypes = {
//   tableNode: CustomTableNode,
// };

// // const initialNodes = {};
// // const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
// const elements = await EntityService.getReactFlowElements();
//  console.log(elements.nodes);
//  console.log(elements.edges);

// export default function App() {
//   const [nodes, setNodes, onNodesChange] = useNodesState(elements.nodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(elements.edges);
 
//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges],
//   );
 
//   return (
//     <div style={{ width: '100vw', height: '100vh' }}>
//       <ReactFlow
//         nodes={nodes}
//         nodeTypes={nodeTypes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//       >
//         <Controls />
//         <MiniMap />
//         <Background variant="dots" gap={12} size={1} />
//       </ReactFlow>
//     </div>
//   );
// }
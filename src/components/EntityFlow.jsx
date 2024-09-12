import React, { useState, useEffect } from 'react';
//import ReactFlow from 'react-flow-renderer';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import EntityService from './services/entityService';

import '@xyflow/react/dist/style.css';

function EntityFlow() {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const fetchElements = async () => {
      const flowElements = await EntityService.getReactFlowElements();
      setElements(flowElements);
    };

    fetchElements();
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow 
            elements={elements}
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

export default EntityFlow;

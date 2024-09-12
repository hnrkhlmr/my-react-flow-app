import React, { useState, useEffect, useCallback, useRef } from 'react';
import Select from 'react-select'; // Import react-select
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
import axios from 'axios';
import { toPng } from 'html-to-image';  // Importing the html-to-image library

const nodeTypes = {
  tableNode: CustomTableNode,
};

export default function App() {
  const reactFlowWrapper = useRef(null);  // Create a reference to the ReactFlow wrapper
  
  const [availableEntities, setAvailableEntities] = useState([]); // State to store available entities
  const [selectedEntities, setSelectedEntities] = useState([]); // State to store selected entities
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true); // State to manage loading

  // Fetch entities and set available entities asynchronously
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await axios.get('/files/entities.json');
        const entities = response.data.map(entity => ({
          value: entity.entityid,
          label: entity.originallocalizedname || entity.logicalname,
        }));
        setAvailableEntities(entities);
      } catch (error) {
        console.error('Error fetching entities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, []); // Empty array ensures this runs only once when the component mounts

  // Fetch the ReactFlow elements based on selected entities
  useEffect(() => {
    const fetchElements = async () => {
      try {
        const elements = await EntityService.getReactFlowElements(selectedEntities); // Pass selected entities to service
        setNodes(elements.nodes);
        setEdges(elements.edges);
      } catch (error) {
        console.error('Error fetching elements:', error);
      }
    };

    if (selectedEntities.length > 0) {
      fetchElements(); // Only fetch if entities are selected
    }
  }, [selectedEntities]);

  const handleEntitySelect = (selectedOptions) => {
    setSelectedEntities(selectedOptions.map(option => option.value)); // Update selected entities
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Function to export the flow chart as an image
  const exportAsImage = useCallback(() => {
    if (reactFlowWrapper.current === null) {
      return;
    }

    toPng(reactFlowWrapper.current, { cacheBust: true,
      backgroundColor: '#fff'
     })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'flow-model.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up after click
      })
      .catch((err) => {
        console.error('Error exporting as image:', err);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while data is being fetched
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* React-Select Dropdown */}
      <div style={{ marginBottom: '20px', width: '400px' }}>
        <Select
          isMulti
          options={availableEntities}
          onChange={handleEntitySelect}
          placeholder="Select entities to visualize"
        />
      </div>

      
      <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={25} size={1} />
        </ReactFlow>
      </div>
      {/* Button to export the flow as an image */}
      <button onClick={exportAsImage} style={{ position: 'absolute', top: 10, right: 10 }}>
        Export as Image
      </button>
    </div>
  );
}

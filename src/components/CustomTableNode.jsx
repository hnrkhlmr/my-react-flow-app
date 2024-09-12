import React from 'react';
//import { Handle } from 'react-flow-renderer';
import {
    Handle
  } from '@xyflow/react';
import '../CustomTableNode.css';

const CustomTableNode = ({ data }) => {
  const { label, columns } = data;

  return (
    <div className="custom-node">
      <div className="table-name">
        <strong>{label}</strong>
      </div>
      <hr />
      <div className="table-columns">
        <ul>
          {columns.map((col, index) => (
            <li key={index}>{col}</li>
          ))}
        </ul>
      </div>
      <Handle type="target" position="top" />
      <Handle type="source" position="bottom" />
    </div>
  );
};

export default CustomTableNode;

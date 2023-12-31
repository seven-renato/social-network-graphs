import React, { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { userGraph} from "../../axios/apiCalls"
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';


const UserGraphComponent = (props) => {
  const fgRef = useRef(null);

  const [graphData, setGraphData] = useState({nodes: [], links: []});
  
  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('link').distance(50); // Adjust the link distance as needed
    }
    userGraph(props.user.username).then(response => {
      if (response.status == 200) {
        generateGraphData(response.data)
      }
    })
  }, [props.render]);
  
  const generateGraphData = (data) => {
    const {nodes, edges, distances} = data
    const nodesL = nodes.map((node) => ({
      id: node,
      label: node,
      distance: distances[node],
      nodeLabel: node
    })); 
    const linkL = edges.map((edges) => ({
      source: edges.source,
      target: edges.target
    }));
    setGraphData({nodes: nodesL, links: linkL})
  };

  return (
    <div className='relative'>
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeLabel="label"
        linkDirectionalArrowLength={0}
        linkDirectionalArrowRelPos={1}
        emitPar
        onNodeClick={(node) => window.location.href = `/perfil/${node.id}`}
        nodeAutoColorBy={"distance"}
        numDimensions={2}
        height={300}
        width={260}
      />
    </div>
  );
};

export default UserGraphComponent;
import axios from 'axios';

export default class EntityService {
  static async getReactFlowElements() {
    try {
      // Fetch the entities JSON file
      const response = await axios.get('/files/entities.json');
      const entities = response.data;

      //Fetch the relations JSON file
      const respRel = await axios.get('/files/relationships.json');
      const relationships = respRel.data;

      // Transform the entities into React Flow elements
      const elements = this.transformToReactFlowFormat(entities, relationships);
      return elements;
    } catch (error) {
      console.error('Error fetching or transforming entities:', error);
      return [];
    }
  }

  static transformToReactFlowFormat(entities, relationships) {
    const nodes = [];
    const edges = [];
    const yAdd = 50;
    let yAxis = 0;
    // Generate nodes from the entities array
    entities.forEach((entity, index) => {
      const nodeId = entity.entityid; // Use entityid as the node ID

      // Create a node for each entity
      nodes.push({
        id: nodeId,
        type: 'tableNode',
        idAttr: entity.logicalname,
        data: {
          label: entity.originallocalizedname || entity.logicalname, // Display name or logical name
            columns: ['Column1', 'Column2', 'Column3']
        },
        position: { x: 0, y: yAxis } // Positioning; adjust as needed
      });
      yAxis+=yAdd;
    });
    relationships.forEach((relation, index) => {
      const entityLogicalName = relation.referencedEntity;
      const entRefEnt = relation.referencingEntity;

      const e1Id = nodes.find(n => n.idAttr === entityLogicalName).id;
      const e2Id = nodes.find(n => n.idAttr === entRefEnt).id;

      if (e1Id && e2Id) {
        edges.push({
          id: `e${index}`,
          source: e1Id,
          target: e2Id,
          animated: true, // Optional: makes the edge animated
          label: `${relation.referencedEntity}_${relation.referencingEntity}_${relation.referencedAttribute}_${relation.referencingAttribute}` // Example label
        });
      }
    });

    // Return combined nodes and edges array
    //return nodes;
    return {"nodes": nodes, "edges": edges};
  }
}

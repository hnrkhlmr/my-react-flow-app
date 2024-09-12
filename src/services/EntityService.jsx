import axios from 'axios';

export default class EntityService {
  static async getReactFlowElements(selectedEntities) {
    try {
      // Fetch the entities JSON file
      const response = await axios.get('/files/entities.json');
      const allEntities = response.data;

      // Filter the entities based on selected entities
      const entities = allEntities.filter(entity => selectedEntities.includes(entity.entityid));

      // Fetch the relationships JSON file
      const respRel = await axios.get('/files/relationships.json');
      const allRelationships = respRel.data;

      // Filter the relationships based on selected entities
      const relationships = this.filterRelationships(entities, allRelationships, selectedEntities);

      // Transform the entities and relationships into React Flow format
      const elements = this.transformToReactFlowFormat(entities, relationships);
      return elements;
    } catch (error) {
      console.error('Error fetching or transforming entities:', error);
      return { nodes: [], edges: [] };
    }
  }

  // Filter relationships to include only those between the selected entities
  static filterRelationships(entities, allRelationships, selectedEntities) {
    // If only one entity is selected, no relationships are needed
    if (selectedEntities.length <= 1) {
      return [];
    }

    return allRelationships.filter(relation => {
      const referencedEntity = relation.referencedEntity;
      const referencingEntity = relation.referencingEntity;

      // Only keep relationships where both referenced and referencing entities are selected
      const isReferencedEntitySelected = entities.some(entity => entity.logicalname === referencedEntity);
      const isReferencingEntitySelected = entities.some(entity => entity.logicalname === referencingEntity);

      return isReferencedEntitySelected && isReferencingEntitySelected;
    });
  }

  // Transform the entities and relationships into the React Flow format
  static transformToReactFlowFormat(entities, relationships) {
    const nodes = [];
    const edges = [];
    const yAdd = 50;
    let yAxis = 0;

    // Generate nodes from the entities array
    entities.forEach((entity, index) => {
      const nodeId = entity.entityid; // Use entityid as the node ID

      // Dynamically set columns based on entity data (or placeholder columns for now)
      const columns = entity.attributes ? entity.attributes.map(attr => attr.logicalname) : ['Column1', 'Column2', 'Column3'];

      // Create a node for each entity
      nodes.push({
        id: nodeId,
        type: 'tableNode',
        idAttr: entity.logicalname,
        data: {
          label: entity.originallocalizedname || entity.logicalname, // Display name or logical name
          columns: columns,
        },
        position: { x: 0, y: yAxis }, // Positioning; adjust as needed
      });

      yAxis += yAdd;
    });

    // Generate edges from relationships array
    relationships.forEach((relation, index) => {
      const entityLogicalName = relation.referencedEntity;
      const entRefEnt = relation.referencingEntity;

      const e1Id = nodes.find(n => n.idAttr === entityLogicalName)?.id;
      const e2Id = nodes.find(n => n.idAttr === entRefEnt)?.id;

      if (e1Id && e2Id) {
        edges.push({
          id: `e${index}`,
          source: e1Id,
          target: e2Id,
          animated: true, // Optional: makes the edge animated
          label: `${relation.referencedEntity}_${relation.referencingEntity}_${relation.referencedAttribute}_${relation.referencingAttribute}`, // Example label
        });
      }
    });

    // Return combined nodes and edges array
    return { nodes, edges };
  }
}

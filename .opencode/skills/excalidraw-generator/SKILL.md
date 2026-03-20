---
name: excalidraw-generator
description: Generate Excalidraw JSON for system design diagrams
---

## What I do
- Convert system design descriptions into Excalidraw JSON format
- Create basic shapes (rectangles, ellipses, lines, arrows)
- Add text labels
- Position elements logically
- Generate proper Excalidraw structure

## When to use me
Use this when you need to create system design diagrams in Excalidraw format. Provide a system design description and I'll generate the JSON.

## How I work

### Input Format
Provide a system design description with:
1. Components (services, databases, load balancers, etc.)
2. Relationships between components
3. Any specific layout preferences

### Output Format
I'll generate a complete Excalidraw JSON file that can be imported into Excalidraw.

### Excalidraw Structure
```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://app.excalidraw.com",
  "elements": [
    {
      "type": "rectangle",
      "id": "unique-id",
      "x": 100,
      "y": 100,
      "width": 200,
      "height": 100,
      "strokeColor": "#000000",
      "backgroundColor": "#ffffff",
      "fillStyle": "solid",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "angle": 0,
      "seed": 123456,
      "version": 1,
      "versionNonce": 123456,
      "isDeleted": false,
      "boundElements": [],
      "updated": 1234567890,
      "link": null,
      "locked": false
    },
    {
      "type": "text",
      "id": "unique-id",
      "x": 150,
      "y": 140,
      "width": 100,
      "height": 25,
      "text": "Component Name",
      "fontSize": 20,
      "fontFamily": 1,
      "textAlign": "center",
      "verticalAlign": "middle",
      "containerId": null,
      "originalText": "Component Name",
      "lineHeight": 1.25
    }
  ]
}
```

### Element Types
1. **Rectangle**: For services, databases, load balancers
2. **Ellipse**: For clouds, external systems
3. **Text**: Labels for components
4. **Arrow**: For connections between components
5. **Line**: For connections without arrows

### Layout Guidelines
- Use grid layout for clarity
- Position components logically (frontend → backend → database)
- Add sufficient spacing between elements
- Group related components

### Example Generation
Input: "Load balancer → Web servers → Database cluster"
Output: Three rectangles with labels, arrows connecting them.

### Color Scheme
- Services: #ffffff (white) with #000000 (black) border
- Databases: #ced4da (light gray)
- External systems: #7950f2 (purple)
- Load balancers: #ffff (white) with special styling

### Tools I Use
- Read: To understand existing diagrams
- Write: To create the JSON file
- Edit: To modify existing diagrams

## Skills I Can Invoke
- `create-spec`: If the diagram needs a specification first
- `spec-to-test-case`: For testing the diagram generation logic
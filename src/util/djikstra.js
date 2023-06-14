export default function dijkstra(graph, startNode) {
    const distances = [];
    const visited = [{}];
    const marked = [];

    const previou = {}
    const distance = {};
  const visitedNodes = {};
  for (let node in graph) {
    distance[node] = Infinity;
    previou[node] = null;
  }
  distance[startNode] = 0;
  while (true) {
    let shortestDistance = Infinity;
    let shortestNode = null;
    for (let node in distance) {
      if (!visitedNodes[node] && distance[node] < shortestDistance) {
        shortestDistance = distance[node];
        shortestNode = node;
      }
    }
    if (shortestNode === null || shortestDistance === Infinity) {
      break;
    }
    distances.push({...distance});
    for (let adjacentNode in graph[shortestNode]) {
      const d = graph[shortestNode][adjacentNode];
      const totalDistance = d + shortestDistance;
      if (totalDistance < distance[adjacentNode]) {
        distance[adjacentNode] = totalDistance;
      }
    }

    // Marquer le nœud avec la distance la plus courte comme visité
    visitedNodes[shortestNode] = true;
    marked.push(shortestNode);
    visited.push({...visitedNodes});
  }

//   return distance;
return {distances,visited,marked}
}
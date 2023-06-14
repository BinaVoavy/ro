export default function shortestPath(graph, start, destination) {
  const queue = new PriorityQueue();
  const distance = {};
  const predecessor = {};

  for (const node in graph) {
    distance[node] = Infinity;
    predecessor[node] = null;
  }
  distance[start] = 0;

  // Enqueue the start node with distance 0
  queue.enqueue(start, 0);

  while (!queue.isEmpty()) {
    const {element: currentNode, priority: currentDistance} = queue.dequeue();

    // Stop if the destination node is reached
    if (currentNode === destination) {
      break;
    }

    // Explore neighbors
    for (const neighbor in graph[currentNode]) {
      // Calculate the total distance from the start node to the neighbor through the current node
      const totalDistance = currentDistance + graph[currentNode][neighbor];

      // If the newly calculated distance is smaller than the previous distance, update the distance and predecessor tables
      if (totalDistance < distance[neighbor]) {
        distance[neighbor] = totalDistance;
        predecessor[neighbor] = currentNode;
        // Enqueue the neighbor with the updated distance
        queue.enqueue(neighbor, totalDistance);
      }
    }
  }
  // Build the shortest path
  const path = [];
  let node = destination;
  while (node !== null) {
    path.unshift(node);
    node = predecessor[node];
  }

  // If the destination is unreachable, return null
  if (path[0] !== start) {
    return null;
  }

  return path;
}


class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(element, priority) {
    const queueElement = { element, priority };
    let added = false;

    for (let i = 0; i < this.queue.length; i++) {
      if (queueElement.priority < this.queue[i].priority) {
        this.queue.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }

    if (!added) {
      this.queue.push(queueElement);
    }
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}

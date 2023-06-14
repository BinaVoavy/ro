import React, { useContext, useReducer } from "react";
import ACTION from "./action";
import shortestPath from "../util/shortestPath";

const Data = React.createContext();
const Dispatcher = React.createContext();

export function useStates() {
  return useContext(Data);
}

export function useDispatcher() {
  return useContext(Dispatcher);
}

const initialState = {
  nodes: [],
  edges: [],
  graph: {},
  startNode: null,
  destinationNode: null,
};

const startNodeColor = {
  color: { background: "#f1ee07" },
  font: { color: "#343434" },
};

const destinationNodeColor = {
  color: { background: "#f1ee07" },
  font: { color: "#343434" },
};

const normalNodeColor = {
  color: { background: "#D2E5FF" },
  font: { color: "#343434" },
};

const activeEdge = {
  width: 3,
};
const normalEdge = {
  width: 1,
};

const reducer = (state, action) => {
  const tmp = JSON.parse(JSON.stringify(state));
  let from, to;
  switch (action.type) {
    case ACTION.ADD_NODE:
      const id = Date.now();
      tmp.graph[action.payload] = {};
      tmp.nodes.push({ id, label: action.payload });
      return tmp;

    case ACTION.ADD_EDGES:
      from = tmp.nodes.find((n) => n.id === action.payload.from).label;
      to = tmp.nodes.find((n) => n.id === action.payload.to).label;
      tmp.graph[from][to] = action.payload.value;
      tmp.graph[to][from] = action.payload.value;
      if (
        tmp.edges.some(
          (el) => el.from === action.payload.from && el.to === action.payload.to
        )
      ) {
        tmp.edges = tmp.edges.map((el) => {
          if (el.from === action.payload.from && el.to === action.payload.to)
            return {
              from: action.payload.from,
              to: action.payload.to,
              label: action.payload.value.toString(),
            };
          return el;
        });
        return tmp;
      }
      tmp.edges.push({
        from: action.payload.from,
        to: action.payload.to,
        label: action.payload.value.toString(),
      });
      return tmp;

    case ACTION.DELETE_NODE:
      const node = tmp.nodes.find((n) => n.id === action.payload).label;
      delete tmp.graph[node];
      Object.keys(tmp.graph).forEach((el) => {
        delete tmp.graph[el][node];
      });
      tmp.nodes = tmp.nodes.filter((el) => el.id !== action.payload);
      tmp.edges = tmp.edges.filter(
        (el) => !(el.from === action.payload || el.to === action.payload)
      );
      return tmp;

    case ACTION.DELETE_EDGE:
      from = tmp.nodes.find((n) => n.id === action.payload.from).label;
      to = tmp.nodes.find((n) => n.id === action.payload.to).label;
      tmp.edges = tmp.edges.filter(
        (el) =>
          !(el.from === action.payload.from && el.to === action.payload.to)
      );
      delete tmp.graph[from][to];
      delete tmp.graph[to][from];

      return tmp;

    case ACTION.SET_STARTNODE:
      tmp.startNode = action.payload;
      tmp.nodes = tmp.nodes.map((el) => {
        if (el.id === action.payload) return { ...el, ...startNodeColor };
        return el;
      });
      return tmp;

    case ACTION.RESET_STARTNODE:
      tmp.startNode = null;
      tmp.nodes = tmp.nodes.map((el) => {
        return { ...el, ...normalNodeColor };
      });
      tmp.edges = tmp.edges.map((el) => ({ ...el, ...normalEdge }));
      return tmp;

    case ACTION.SET_DESTINATIONNODE:
      from = tmp.nodes.find((n) => n.id === tmp.startNode).label;
      to = tmp.nodes.find((n) => n.id === action.payload).label;
      tmp.nodes = tmp.nodes.map((el) => {
        if (el.id !== tmp.startNode) return { ...el, ...normalNodeColor };
        return el;
      });
      tmp.edges = tmp.edges.map((el) => ({ ...el, ...normalEdge }));
      const path = shortestPath(tmp.graph, from, to);

      if (path) {
        tmp.nodes = tmp.nodes.map((el) => {
          if (el.id === action.payload)
            return { ...el, ...destinationNodeColor };
          return el;
        });
        const pathId = path.map((el) => {
          return tmp.nodes.find((n) => n.label === el).id;
        });
        for (let i = 0; i < pathId.length - 1; i++) {
          tmp.edges = tmp.edges.map((el) => {
            if (
              (el.from === pathId[i] && el.to === pathId[i + 1]) ||
              (el.from === pathId[i + 1] && el.to === pathId[i])
            )
              return { ...el, ...activeEdge };
            return el;
          });
        }
      } else
        tmp.nodes = tmp.nodes.map((el) => {
          if (el.id === action.payload)
            return { ...el, ...destinationNodeColor };
          return el;
        });
      tmp.destinationNode = action.payload;
      return tmp;

    case ACTION.RESET_DESTINATIONNODE:
      tmp.nodes = tmp.nodes.map((el) => {
        if (el.id !== tmp.startNode) return { ...el, ...normalNodeColor };
        return el;
      });
      tmp.edges = tmp.edges.map((el) => ({ ...el, ...normalEdge }));
      tmp.destinationNode = null;
      return tmp;

    default:
      return state;
  }
};

export function DataContext({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Dispatcher.Provider value={dispatch}>
      <Data.Provider value={state}>{children}</Data.Provider>
    </Dispatcher.Provider>
  );
}

import { useEffect, useLayoutEffect, useRef } from "react";
import { Network } from "vis-network";
import { useDispatcher, useStates } from "../../context/context";
import getNode from "../../util/getNode.js";
import ACTION from "../../context/action.js";

const VisNetwork = () => {
  const { edges, graph, startNode, destinationNode } = useStates();
  let { nodes } = useStates();
  const positions = useRef({});
  const dispatch = useDispatcher();
  const visJsRef = useRef(null);
  useEffect(() => {
    const tab = Object.keys(positions.current);
    for (const id of tab) {
      nodes = nodes.map((el) => {
        if (el.id === +id)
          return {
            ...el,
            x: positions.current[id].x,
            y: positions.current[id].y,
          };
        return el;
      });
    }
    const network =
      visJsRef.current &&
      new Network(
        visJsRef.current,
        { nodes, edges },
        {
          physics: { enabled: false },
          edges: {
            arrows: { to: { enabled: false } },
            smooth: { enabled: false },
            chosen: false,
          },
          interaction: { zoomView: false },
          nodes: {
            shape: "circle",
            chosen: false,
            fixed: false,
          },
        }
      );
    // Use `network` here to configure events, etc
    network.on("click", (p) => {
      // console.log(p);
      const n = getNode(p);
      if (!n) return;
      if (!startNode) {
        dispatch({ type: ACTION.SET_STARTNODE, payload: n });
      } else if (n === startNode) {
        dispatch({ type: ACTION.RESET_STARTNODE, payload: null });
      } else if (n === destinationNode) {
        dispatch({ type: ACTION.RESET_DESTINATIONNODE, payload: null });
      } else {
        dispatch({ type: ACTION.SET_DESTINATIONNODE, payload: n });
      }
    });

    network.on("dragEnd", (p) => {
      positions.current = network?.getPositions();
    });
    positions.current = network?.getPositions();
  }, [visJsRef, graph]);

  return (
    <>
      <div className="layout_child network_container" ref={visJsRef} />
    </>
  );
};

export default VisNetwork;

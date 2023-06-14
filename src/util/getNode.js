import { useStates } from "../context/context";

export default function getNode (e){
    if (e.nodes.length !== 1) return null;
    return e.nodes[0]
}
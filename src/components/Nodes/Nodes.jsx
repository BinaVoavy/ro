import "./Nodes.css";

import React, { useState } from "react";
import { Button, Chip, TextField, Typography } from "@mui/material";
import { useDispatcher, useStates } from "../../context/context";
import ACTION from "../../context/action";

export default function Nodes() {
  const { nodes, destinationNode } = useStates();
  const [nodeLabel, setNodeLabel] = useState("");
  const [error, setError] = useState(false);
  const dispatch = useDispatcher();
  function addNode(value) {
    if (value === "" || nodes.some((el) => value === el.label))
      return setError(true);
    setError(false);
    dispatch({ type: ACTION.ADD_NODE, payload: value });
    setNodeLabel("");
  }
  // console.log(nodeLabel);
  return (
    <div className="layout_child node_container">
      <Typography sx={{ marginBottom: "1rem" }} variant="h4">
        Sommets
      </Typography>
      <form
        className="node_input"
        onSubmit={(e) => {
          e.preventDefault();
          addNode(nodeLabel.toUpperCase());
        }}
      >
        <TextField
          label="Sommet"
          size="small"
          name="node"
          value={nodeLabel}
          error={error}
          onChange={(e) => setNodeLabel(e.target.value)}
        />
        <Button variant="contained" type="submit">
          Ajouter
        </Button>
      </form>
      <div className="nodes">
        {nodes.map((el) => (
          <Chip
            label={el.label}
            key={el.id}
            onDelete={() => {
              dispatch({ type: ACTION.DELETE_NODE, payload: el.id });
              if (destinationNode && destinationNode === el.id)
                dispatch({
                  type: ACTION.RESET_DESTINATIONNODE,
                  payload: null,
                });
              if (destinationNode && destinationNode !== el.id) {
                dispatch({
                  type: ACTION.SET_DESTINATIONNODE,
                  payload: destinationNode,
                });
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

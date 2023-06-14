import "./Edges.css";

import React, { useState } from "react";
import {
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatcher, useStates } from "../../context/context";
import ACTION from "../../context/action";

export default function Edges() {
  const { nodes, edges, destinationNode } = useStates();
  const [from, setFrom] = useState("");
  const [fromError, setFromError] = useState(false);
  const [to, setTo] = useState("");
  const [toError, setToError] = useState(false);
  const [value, setValue] = useState("");
  const [valueError, setValueError] = useState(false);

  const dispatch = useDispatcher();

  function addEdges(from_, to_, value_) {
    const from = parseInt(from_ <= to_ ? from_ : to_);
    const to = parseInt(from_ > to_ ? from_ : to_);
    const value = parseInt(value_);
    if (isNaN(from)) return setFromError(true);
    setFromError(false);
    if (isNaN(to)) return setToError(true);
    setToError(false);
    if (isNaN(value)) return setValueError(true);
    setValueError(false);
    dispatch({ type: ACTION.ADD_EDGES, payload: { from, to, value } });
    setFrom("");
    setTo("");
    setValue("");
    if (destinationNode)
      dispatch({
        type: ACTION.SET_DESTINATIONNODE,
        payload: destinationNode,
      });
  }

  return (
    <div className="layout_child edges_container">
      <Typography variant="h4" marginBottom={"1rem"}>
        Arcs
      </Typography>
      <div className="edge_input">
        <div className="selects">
          <FormControl sx={{ width: "5rem" }}>
            <InputLabel size="small" id="from_id">
              Départ
            </InputLabel>
            <Select
              label="Départ"
              value={from}
              labelId="from_id"
              size="small"
              error={fromError}
              onChange={(e) => {
                setFrom(e.target.value);
              }}
            >
              {nodes.map((el) => (
                <MenuItem key={el.id} value={el.id}>
                  {el.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          &#8594;
          <FormControl sx={{ width: "5rem" }}>
            <InputLabel size="small" id="to_id">
              Vers
            </InputLabel>
            <Select
              value={to}
              label="vers"
              labelId="to_id"
              size="small"
              error={toError}
              onChange={(e) => {
                setTo(e.target.value);
              }}
            >
              {nodes.map((el) => (
                <MenuItem key={el.id} value={el.id}>
                  {el.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <form
          className="inputs"
          onSubmit={(e) => {
            e.preventDefault();
            addEdges(from, to, value);
          }}
        >
          <TextField
            size="small"
            type="number"
            label="Valeur"
            value={value}
            error={valueError}
            onChange={(e) => setValue(e.target.value)}
            sx={{ width: "6rem" }}
          />
          <Button variant="contained" type="submit" size="small">
            Ajouter
          </Button>
        </form>
      </div>
      <div className="edges">
        {edges.map((el) => (
          <Chip
            label={`${nodes.find((n) => n.id === el.from).label} → ${
              nodes.find((n) => n.id === el.to).label
            } : ${el.label}`}
            key={el.from + "" + el.to}
            onDelete={() => {
              dispatch({
                type: ACTION.DELETE_EDGE,
                payload: { from: el.from, to: el.to },
              });
              if (destinationNode)
                dispatch({
                  type: ACTION.SET_DESTINATIONNODE,
                  payload: destinationNode,
                });
            }}
          />
        ))}
      </div>
    </div>
  );
}

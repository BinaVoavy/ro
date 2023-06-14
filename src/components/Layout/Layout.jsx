import "./Layout.css";

import React from "react";

export default function Layout() {
  return (
    <div className="layout_container">
      <div className="layout_child node_container">node</div>
      <div className="layout_child edges_container">edges</div>
      <div className="layout_child network_container">network</div>
      <div className="layout_child table_container">table</div>
    </div>
  );
}

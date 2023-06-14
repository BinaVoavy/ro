import "./App.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Edges from "./components/Edges/Edges";
import Nodes from "./components/Nodes/Nodes";
import VisNetwork from "./components/Vis/Vis";
import { useStates } from "./context/context";
import dijkstra from "./util/djikstra";

function App() {
  const { graph, startNode, nodes } = useStates();

  const { distances, visited, marked } = dijkstra(
    graph,
    startNode ? nodes.find((e) => e.id === startNode).label : "A"
  );

  return (
    <div className="layout_container">
      <Nodes />
      <Edges />
      <VisNetwork />

      {startNode && (
        <div className="layout_child table_container">
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  {Object.keys(graph).map((el) => (
                    <TableCell align="center" sx={{ fontWeight: 700 }} key={el}>
                      {el}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {distances.map((distance, i) => (
                  <TableRow
                    key={"row" + i}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {Object.keys(distance).map((n) => (
                      <TableCell
                        key={"col" + n + i}
                        align="center"
                        sx={{
                          fontWeight: "400",
                          position: "relative",
                          background:
                            marked[i] === n
                              ? "#f1ee07"
                              : visited[i][n]
                              ? "#transparent"
                              : "transparent",
                        }}
                      >
                        {visited[i][n]
                          ? ""
                          : distance[n] === Infinity
                          ? "∞"
                          : distance[n]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
}

export default App;

const Center = ({ children }) => {
  return (
    <div
      style={{
        width: "100dvw",
        height: "100dvh",
        display: "grid",
        placeItems: "center",
      }}
    >
      {children}
    </div>
  );
};

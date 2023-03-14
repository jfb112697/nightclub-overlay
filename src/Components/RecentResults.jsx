import { React } from "react";
import { useState, useEffect, useCallback } from "react";
import { MatchRow } from "./PlayerRow";

function getMatch(node, slot) {
  return {
    name: node.slots[slot].entrant.name,
    score: node.slots[slot].standing.stats.score.value,
  };
}
const RecentResults = (props) => {
  const [nodes, setNodes] = useState(null);

  useEffect(() => {
    if (props.apiData.results.data) {
      setNodes(props.apiData.results.data.event.sets.nodes);
    }
    console.log(props.apiData);
  }, []);

  return (
    <div className="recent-result ad">
      <h1>Recent Results</h1>
      {nodes
        ? nodes.map((node, index) => {
            return (
              <MatchRow
                key={index}
                match={[getMatch(node, 0), getMatch(node, 1)].sort(function (
                  a,
                  b
                ) {
                  return b.score - a.score;
                })}
              />
            );
          })
        : null}
    </div>
  );
};

export default RecentResults;

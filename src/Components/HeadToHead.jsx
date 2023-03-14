import { memo, React } from "react";
import { useState, useEffect, useCallback } from "react";
import { MatchRow } from "./PlayerRow";
import PredictionBar from "./PredictionBar";

const HeadToHead = (props) => {
  const { player1, player2, apiData, outcomes, predictions } = props;
  const [headToHeadData, setHeadToHeadData] = useState(apiData);

  const isActive = headToHeadData.isActive;

  const [playerPercents, setPlayerPercents] = useState([]);

  useEffect(() => {
    if (outcomes && outcomes.length > 0) {
      setPlayerPercents([
        Math.ceil(
          (outcomes[0].channel_points * 100) /
          (outcomes[0].channel_points + outcomes[1].channel_points)
        ),
        Math.floor(
          (outcomes[1].channel_points * 100) /
          (outcomes[0].channel_points + outcomes[1].channel_points)
        ),
      ]);
    }
  }, [outcomes]);

  return (
    <>
      <div className="ad" style={{ height: "170px" }}>
        {player1.h2hWins > -1 && player2.h2hWins > -1 &&
          <><h1 style={{ fontSize: "34pt", marginTop: 0 }}>Head to Head</h1>

            <MatchRow
              key={Math.random()}
              match={[
                { name: player1.name, score: player1.h2hWins },
                { name: player2.name, score: player2.h2hWins },
              ]}
            /></>}
        {isActive && (
          <>
            <h1 style={{ marginTop: 0, marginBottom: "10px" }}>
              Live Prediction
            </h1>
            <div style={{ fontStyle: "italic", fontSize: "18pt" }}>
              {predictions.event.title}
            </div>
            <PredictionBar
              outcomes={outcomes}
              playerPercents={playerPercents}
            />
          </>
        )}
      </div>
    </>
  );
};

export default HeadToHead;

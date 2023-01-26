import { React } from "react";
import { useState, useEffect, useCallback } from "react";
import { MatchRow } from "./PlayerRow";
import { useTwitchAuth, useChannelPredictions } from "./TwitchAuth";
import TwitchJs from "twitch-js";
import PredictionBar from "./PredictionBar";

const HeadToHead = (props) => {
  const { accessToken, credentials, TWITCH_CLIENT_ID } = useTwitchAuth();
  const [predictions, outcomes, isActive] = useChannelPredictions(
    accessToken,
    credentials
  );
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
        <h1 style={{ fontSize: "34pt", marginTop: 0 }}>Head to Head</h1>

        <MatchRow
          key={Math.random()}
          match={[
            { name: props.player1.name, score: props.player1.h2hWins },
            { name: props.player2.name, score: props.player2.h2hWins },
          ]}
        />
      </div>

      {isActive && (
        <>
          <h1 style={{ marginTop: 0, marginBottom: "10px" }}>
            Live Prediction
          </h1>
          <div style={{ fontStyle: "italic", fontSize: "18pt" }}>
            {predictions.event.title}
          </div>
          <PredictionBar outcomes={outcomes} playerPercents={playerPercents} />
        </>
      )}
    </>
  );
};

export default HeadToHead;
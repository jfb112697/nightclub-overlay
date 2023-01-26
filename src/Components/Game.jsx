import React from "react";

import GameLeftPanel from "./GameLeftPanel";
import GameContainer from "./GameContainer";
import Scorebar from "./Scorebar";

export const Game = (props) => {
  const nodata = { name: "No Data", score: 0, pronouns: "It/Its", h2hWins: 0 };

  return (
    <>
      <h1>{props.twitchChannel}</h1>
      <div id="gameroot" onClick={props.onClick}>
        <div id="camera" />
        <GameLeftPanel
          ggId={props.ggId}
          player1={props.data ? props.data.Player1 : nodata}
          player2={props.data ? props.data.Player2 : nodata}
        />
        <GameContainer />
      </div>
      <div id="round-container">
        <div id="newround">{props.data ? props.data.round : "No Round"}</div>
      </div>
      <Scorebar
        player1={props.data ? props.data.Player1 : nodata}
        player2={props.data ? props.data.Player2 : nodata}
      />
    </>
  );
};

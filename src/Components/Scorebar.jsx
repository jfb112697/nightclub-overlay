import { React } from "react";
import { PlayerContainer } from "./PlayerContainer";

const Scorebar = (props) => {
  return (
    <div id="scorebar">
      <PlayerContainer player={props.player1} />
      <PlayerContainer player={props.player2} isReversed={true} />
    </div>
  );
};

export default Scorebar;

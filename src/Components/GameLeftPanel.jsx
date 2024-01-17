import { React, useState } from "react";
import nightclub from "../assets/nycmelee.png";
import os from "../assets/os.png"
import AdRoll from "./AdRoll";
import TwitchAuth from "./TwitchAuth";

const GameLeftPanel = (props) => {
  const [ad, setAd] = useState(0);
  const round = <div id="round">Winners Quarters</div>;

  return (
    <div id="leftpanel">
      <AdRoll
        ggId={props.ggId}
        ggSlug={props.ggSlug}
        player1={props.player1}
        player2={props.player2}
      />
      <div className="sponsors">
        <p className="fancy">
          <span className="sponsor-title">In Partnership With</span>
        </p>
        <div className="sponsor-images">
          <img src={nightclub}></img>
          <img src={os}></img>
        </div>
      </div>
    </div>
  );
};

export default GameLeftPanel;

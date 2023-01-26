import { React, useState } from "react";
import nightclub from "../assets/nycmelee.png";
import AdRoll from "./AdRoll";
import TwitchAuth from "./TwitchAuth";

const GameLeftPanel = (props) => {
  const [ad, setAd] = useState(0);
  const round = <div id="round">Winners Quarters</div>;

  return (
    <div id="leftpanel">
      <TwitchAuth />
      <AdRoll
        ggId={props.ggId}
        player1={props.player1}
        player2={props.player2}
      />
      <div className="sponsors">
        <p className="fancy">
          <span className="sponsor-title">In Partnership With</span>
        </p>
        <div className="sponsor-images">
          <img src={nightclub}></img>
          <img src="https://images.squarespace-cdn.com/content/v1/5d695110f8d59d0001fd289b/c085e465-ca9c-46cb-ac78-e8eced2dce7e/OS_with_bars_logo_WHITE.png?format=1500w" />
        </div>
      </div>
    </div>
  );
};

export default GameLeftPanel;

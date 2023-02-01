import React, { useEffect, useState } from "react";

function PredictionBar(props) {
  const [displayScore1, setDisplayScore1] = useState(0);
  const [displayScore2, setDisplayScore2] = useState(0);

  useEffect(() => {
    let currentScore1 = displayScore1;
    console.log("effect");
    let currentScore2 = displayScore2;
    let interval = 50;
    let interval2Speed = 50;
    const interval1 = setInterval(() => {
      if (currentScore1 !== props.playerPercents[0]) {
        if (currentScore1 < props.playerPercents[0]) {
          setDisplayScore1(++currentScore1);
        } else {
          if (displayScore1 > 0) {
            setDisplayScore1(--currentScore1);
          }
        }
        interval = Math.max(interval - 1, 20);
      } else {
        clearInterval(interval1);
      }
    }, interval);
    const interval2 = setInterval(() => {
      if (currentScore2 !== props.playerPercents[1]) {
        if (currentScore2 < props.playerPercents[1]) {
          setDisplayScore2(++currentScore2);
        } else {
          if (displayScore2 > 0) {
            setDisplayScore2(--currentScore2);
          }
        }
        Math.max(interval2Speed - 1, 30);
      } else {
        clearInterval(interval2);
      }
    }, interval2Speed);
    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, [props.playerPercents[0], props.playerPercents[1]]);

  return (
    <>
      <div className="prediction-bar" style={props.styles}>
        <div className="prediction-details">
          <div className="prediction-label first">{displayScore1 || "0"}%</div>

          <div className="option-name">{props.outcomes[0].title}</div>
        </div>
        <div className="prediction-container">
          <div
            className="prediction"
            style={{
              width:
                !props.playerPercents[0] && !props.playerPercents[1]
                  ? "50%"
                  : props.playerPercents[0] + "%",
            }}
          ></div>
          <div
            className="prediction"
            style={{
              width:
                !props.playerPercents[0] && !props.playerPercents[1]
                  ? "50%"
                  : props.playerPercents[1] + "%",
            }}
          ></div>
        </div>
        <div className="prediction-details" style={{ alignItems: "flex-end" }}>
          <div className="prediction-label" style={{ alignSelf: "flex-start" }}>
            {displayScore2 || "0"}%
          </div>
          <div className="option-name" style={{ textAlign: "right" }}>
            {props.outcomes[1].title}
          </div>
        </div>
      </div>

      <h4 style={{ margin: 0, position: "relative", top: "-25px" }}>
        Total points wagered:{" "}
        {props.outcomes[0].channel_points + props.outcomes[1].channel_points ||
          "0"}
      </h4>
    </>
  );
}

export default PredictionBar;

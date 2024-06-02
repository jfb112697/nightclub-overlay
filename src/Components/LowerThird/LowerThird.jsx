import React, { useEffect, useState, useRef } from "react";
import nightclub from "../../assets/nightclub.webm";
import PredictionBar from "../PredictionBar";
import { useChannelPredictions, useTwitchAuth } from "../TwitchAuth";
import LowerThirdScores from "./LowerThirdScores";
import { CSSTransition } from 'react-transition-group';


function LowerThird(props) {
  const commentators = props.data?.Commentators && (props.showCommentary == null || props.showCommentary == true) ? props.data.Commentators : null;
  const { accessToken, credentials } = useTwitchAuth();
  const [predictions, outcomes, isActive] = useChannelPredictions(accessToken, credentials, true);
  const [playerPercents, setPlayerPercents] = useState([]);

  useEffect(() => {
    if (outcomes?.length > 0) {
      setPlayerPercents([
        Math.ceil((outcomes[0].channel_points * 100) / (outcomes[0].channel_points + outcomes[1].channel_points)),
        Math.floor((outcomes[1].channel_points * 100) / (outcomes[0].channel_points + outcomes[1].channel_points)),
      ]);
    }
  }, [outcomes]);

  const [hideScores, setHideScores] = useState(false);
  const compactRef = useRef();

  useEffect(() => {
    const compact = props.data?.lowerThird?.Compact;
    console.log("Compact", compact, compactRef.current)
    if (compact !== compactRef.current) {
      compactRef.current = compact;
      if (compact) {
        setHideScores(true);
        setTimeout(() => setHideScores(false), 500); // Wait for the exit animation to finish before re-rendering
      }
    }
  }, [props.data]);

  return (
    <>
      <div className="commentary-container">
        {commentators && props.data?.lowerThird?.Commentary
          ? commentators.map((c) => (
            <div className="commentary-block" key={Math.random()}>
              <div className="commentary-name">{c.Name}</div>
              {c.Twitter && <div className="commentary-twitter">@{c.Twitter}</div>}
            </div>
          ))
          : ""}
      </div>

      <div className="lower-third-container">
        <div className="lower-third-circle">
          <video src={nightclub} autoPlay loop height={"360px"}></video>
        </div>
        <CSSTransition
          in={!!props.data}
          timeout={500}
          classNames="score-transition"
          unmountOnExit
        >
          <div className="lower-third-content-outer">
            {props.data && compactRef.current ? (

              <LowerThirdScores className={''} player1={props.data?.Player1} player2={props.data?.Player2} />
            ) : isActive ? (
              <div className="lower-third-content">
                <div className="lower-third-text-primary">
                  <div style={{ WebkitTextStroke: "#C61E94 8px" }}>Live Prediction</div>
                  <div>Live Prediction</div>
                </div>
                <div className="lower-third-text-secondary">{predictions.event.title}</div>
              </div>
            ) : (
              props.data && (
                <div className="lower-third-content">
                  <div className="lower-third-text-primary">
                    <div style={{ WebkitTextStroke: "#C61E94 8px" }}>
                      {props.data.lowerThird.LeftAnnotationText + ": " + props.data.lowerThird.TitleText}
                    </div>
                    <div>
                      {props.data.lowerThird.LeftAnnotationText + ": " + props.data.lowerThird.TitleText}
                    </div>
                  </div>
                  {props.data.round && (<div className="lower-third-text-secondary">{props.data.round}</div>)}

                </div>
              )
            )}


            {isActive && !compactRef.current && (
              <div className="lower-third-prediction-bar">
                <PredictionBar outcomes={outcomes} playerPercents={playerPercents} />
              </div>
            )}
          </div>
        </CSSTransition>
      </div>

    </>
  );
}

export default LowerThird;
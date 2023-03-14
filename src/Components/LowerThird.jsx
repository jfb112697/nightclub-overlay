import React, { useEffect, useState } from "react";
import nightclub from "../assets/nightclub.webm";
import lineSvg from "../assets/CommentatorLine_SVG.svg";
import PredictionBar from "./PredictionBar";
import TwitchAuth, { useChannelPredictions, useTwitchAuth } from "./TwitchAuth";

function LowerThird(props) {
  const commentators = props.data && props.data.Commentators && props.showCommentary == null || props.showCommentary == true ? props.data.Commentators : null;
  const { accessToken, credentials } = useTwitchAuth();
  const [predictions, outcomes, isActive] = useChannelPredictions(
    accessToken,
    credentials,
    true
  );
  const [titleText, setTitleText] = useState("");
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
      <div className="commentary-container">
        {commentators && props.data.lowerThird.Commentary
          ? commentators.map((c) => {
            return (
              <div className="commentary-block" key={Math.random()}>
                <div className="commentary-name">{c.Name}</div>
                {c.Twitter ? (
                  <div className="commentary-twitter">@{c.Twitter}</div>
                ) : (
                  <></>
                )}
              </div>
            );
          })
          : ""}
      </div>

      <div className="lower-third-container">
        <div className="lower-third-circle">
          <video src={nightclub} autoPlay loop height={"235px"}></video>
        </div>
        <div className="lower-third-content">
          <div className="lower-third-text-primary">
            {props.data && (
              <>
                <div style={{ WebkitTextStroke: "#C61E94 4px" }}>
                  {isActive
                    ? "Live Prediction"
                    : props.data.lowerThird.LeftAnnotationText +
                    ": " +
                    props.data.lowerThird.TitleText}
                </div>
                <div>
                  {isActive
                    ? "Live Prediction"
                    : props.data.lowerThird.LeftAnnotationText +
                    ": " +
                    props.data.lowerThird.TitleText}
                </div>
              </>
            )}
          </div>
          <div className="lower-third-text-secondary">
            {isActive
              ? predictions.event.title
              : props.data &&
              "The Nightclub S6E4 " + props.data &&
              props.data.round}
          </div>
        </div>
        {isActive && (
          <div className="lower-third-prediction-bar">
            <PredictionBar
              outcomes={outcomes}
              playerPercents={playerPercents}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default LowerThird;

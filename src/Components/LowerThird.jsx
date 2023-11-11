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
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
      const updateClock = () => {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;
        hours = hours || 12; // Convert '0' to '12'
        const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

        setCurrentTime(`${hours}:${minutesStr} ${ampm}`);
      };

      updateClock(); // Update clock immediately on mount
      const intervalId = setInterval(updateClock, 60000); // Update clock every minute

      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

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
    <div className="lower-third-root">
      <div className="lower-third-header-container">
        {props.data.lowerThird.ClockText || `Local Time: ${currentTime}`}{" "}
      </div>
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
          <img src="/function_3pfp.png" />
        </div>
        <div className="lower-third-content">
          <div className="lower-third-text-primary">
            {props.data && (
              <>
                <div style={{ WebkitTextStroke: "#35B0A6 4px" }}>
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
    </div>
  );
}

export default LowerThird;

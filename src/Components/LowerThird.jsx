import React, { useEffect, useState } from "react";
import PredictionBar from "./PredictionBar";
import { useChannelPredictions, useTwitchAuth } from "./TwitchAuth";

function LowerThird({ data, showCommentary = true }) {
  const { accessToken, credentials } = useTwitchAuth();
  const [predictions, outcomes, isActive] = useChannelPredictions(
    accessToken,
    credentials,
    true
  );

  const [currentTime, setCurrentTime] = useState("");
  const [playerPercents, setPlayerPercents] = useState([50, 50]); // Default percentages

  // Update clock
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

  // Handle outcomes update
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

  // Accessor for nested properties with a default value
  const getNestedValue = (obj, path, defaultValue) => {
    return path.split('.').reduce((acc, part) => acc && acc[part] ? acc[part] : defaultValue, obj);
  };

  const commentators = getNestedValue(data, 'Commentators', [{ Name: "Default Commentator", Twitter: "@default" }]);
  
  return (
    <div className="lower-third-root">
      <div className="lower-third-header-container">
        <div className="lower-third-header">
        {getNestedValue(data, 'lowerThird.ClockText', `Local Time: ${currentTime}`)}
        </div>
      </div>

      <div className="commentary-container">
        {showCommentary && commentators.map((commentator, index) => (
          <div className="commentary-block" key={index}>
            <div className="commentary-name">{commentator.Name}</div>
            {commentator.Twitter && (
              <div className="commentary-twitter">@{commentator.Twitter}</div>
            )}
          </div>
        ))}
      </div>

      <div className="lower-third-container">
        <div className="lower-third-circle">
          {/* Placeholder for an image or icon */}
        </div>
        <div className="lower-third-content">
          <div className="lower-third-text-primary">
            {isActive
              ? "Live Prediction"
              :                 <div>
              {getNestedValue(data, 'lowerThird.TitleText', 'Default Title')}</div>}
          </div>
          <div className="lower-third-text-secondary">
            {isActive
              ? predictions.event.title
              : getNestedValue(data, 'lowerThird.SubtitleText', '')}
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

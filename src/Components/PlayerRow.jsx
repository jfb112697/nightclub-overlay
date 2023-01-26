import { React } from "react";
import { useState, useEffect } from "react";

export const MatchRow = (props) => {
  return (
    <>
      <div className="player-row-container">
        <div className="result-player justify-content-flex-start">
          <div className="player-row-score left-17px">
            {props.match[0].score}
          </div>
          <div>
            <p className="player-row-name left-17px">
              {props.match[0].name.slice(
                props.match[0].name.lastIndexOf("|") + 1
              )}
            </p>
          </div>
        </div>
        <div className="result-player flex-direction-row-reverse justify-content-flex-end">
          <div className="player-row-score right-17px">
            {props.match[1].score}
          </div>
          <div className="justify-content-flex-end">
            <p className="player-row-name right-17px">
              {props.match[1].name.slice(
                props.match[1].name.lastIndexOf("|") + 1
              )}
            </p>
          </div>
        </div>
      </div>
      <div className="vs">VS</div>
    </>
  );
};

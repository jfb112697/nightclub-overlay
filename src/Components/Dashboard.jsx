import React, { useState } from "react";
import TwitchAuth, { useTwitchAuth, useChannelPredictions } from "./TwitchAuth";

function Dashboard(props) {
  const [predictionTitle, setPredictionTitle] = useState("Who will win?");
  const [votingTime, setVotingTime] = useState(120);
  const {
    accessToken,
    credentials,
    isAuthenticated,
    handleLogin,
    handleLogout,
    TWITCH_CLIENT_ID,
  } = useTwitchAuth();

    const [predictions, outcomes, isActive] = useChannelPredictions(
      accessToken,
      credentials,
      true
    );

  async function submitHandler() {
    const result = await fetch("https://api.twitch.tv/helix/predictions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Client-ID": TWITCH_CLIENT_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        broadcaster_id: credentials.user_id,
        title: predictionTitle,
        outcomes: [{ title: props.player1Name }, { title: props.player2Name }],
        prediction_window: votingTime,
      }),
    });
    console.log(result);
    return result;
  }

  async function endPrediction(index) {
    const result = fetch(
      "https://api.twitch.tv/helix/predictions?" +
        new URLSearchParams({
          broadcaster_id: credentials.user_id,
          status: "RESOLVED",
          id: predictions.event.id,
          winning_outcome_id: outcomes[index].id,
        }),
      {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Client-ID": TWITCH_CLIENT_ID,
        },
      }
    );
    console.log(result);
    return result;
  }
  return (
    <div className="dashboard-root">
      <div className="dashboard-container">
        <div className="dashboard-item">
          <TwitchAuth />
          {isAuthenticated && (
            <>
              <h3>You're signed in as {credentials.login}</h3>
              <button className="signout" onClick={handleLogout}>
                Sign Out
              </button>
            </>
          )}
        </div>
        {isAuthenticated && (
          <div className="dashboard-item">
            {!isActive ? (
              <>
                <h3>
                  Create prediction for {props.player1Name} vs{" "}
                  {props.player2Name}
                </h3>
                <input
                  type="text"
                  value={predictionTitle}
                  onChange={(e) => setPredictionTitle(e.target.value)}
                ></input>
                <input
                  type="number"
                  value={votingTime}
                  onChange={(e) => setVotingTime(e.target.value)}
                ></input>
                <button className="prediction-button" onClick={submitHandler}>
                  Start Prediction
                </button>
              </>
            ) : (
              <>
                <h3>Pick winner</h3>
                <button
                  onClick={() => {
                    endPrediction(0);
                  }}
                >
                  {props.player1Name}
                </button>
                <button
                  onClick={() => {
                    endPrediction(1);
                  }}
                >
                  {props.player2Name}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

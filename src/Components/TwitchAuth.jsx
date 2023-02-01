import React, { useState, useEffect, useRef } from "react";

const TWITCH_CLIENT_ID = "m5n80d113xm73ero76pws5ltojnpki";
const TWITCH_REDIRECT_URI = "https://ws-scoreboard.web.app/";

function useChannelPredictions(accessToken, credentials, isMounted) {
  const [predictions, setPredictions] = useState({});
  const [outcomes, setOutcomes] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (accessToken && credentials && isMounted) {
      const ws = new WebSocket("wss://eventsub-beta.wss.twitch.tv/ws");

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        console.log(data);

        if (data.metadata.message_type == "session_welcome") {
          setSessionId(data.payload.session.id);
          if (credentials) {
            subscribeToPredictions(data.payload.session.id);
          }
        } else if (
          data.metadata.message_type === "notification" &&
          data.payload
        ) {
          if (
            data.payload.subscription.type == "channel.prediction.progress" ||
            data.payload.subscription.type == "channel.prediction.begin"
          ) {
            setOutcomes(data.payload.event.outcomes);
            setPredictions(data.payload);
            setIsActive(true);
          } else {
            setPredictions(null);
            setOutcomes(null);
            setIsActive(false);
          }
        }
      };

      ws.onclose = () => {
        setWs(null);
      };

      setWs(ws);

      window.addEventListener("beforeunload", () => {
        ws.close();
      });

      return () => {
        window.removeEventListener("beforeunload", () => {});
        ws.close();
      };
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [accessToken, credentials]);

  async function subscribeToPredictions(sessionId) {
    const subscriptions = [
      "channel.prediction.begin",
      "channel.prediction.progress",
      "channel.prediction.end",
    ];

    for (let i = 0; i < subscriptions.length; i++) {
      console.log("subscribing");
      await setTimeout(() => {}, 100);
      await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
        method: "POST",
        headers: {
          "Client-ID": TWITCH_CLIENT_ID,
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: subscriptions[i],
          version: "1",
          condition: {
            broadcaster_user_id: credentials.user_id,
          },
          transport: {
            method: "websocket",
            session_id: sessionId,
          },
        }),
      });
    }
  }

  return [predictions, outcomes, isActive, sessionId];
}

function TwitchAuth() {
  const { credentials, isAuthenticated, handleLogin, handleLogout } =
    useTwitchAuth();

  return (
    <div>
      {isAuthenticated ? (
        <></>
      ) : (
        <button
          type="button"
          style={{
            background: "cyan",
            color: "darkgray",
            height: "200px",
            borderRadius: "8px",
          }}
          onClick={handleLogin}
        >
          Login with Twitch
        </button>
      )}
    </div>
  );
}

function useTwitchAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const TWITCH_CLIENT_ID = "m5n80d113xm73ero76pws5ltojnpki";
  const TWITCH_REDIRECT_URI = "https://ws-scoreboard.web.app/";

  const checkToken = async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const response = await fetch("https://id.twitch.tv/oauth2/validate", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          localStorage.removeItem("access_token");
          setIsAuthenticated(false);
          setCredentials(null);
        } else {
          const json = await response.json();
          setIsAuthenticated(true);
          setCredentials(json);
          setAccessToken(token);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    checkToken();
    handleCallback();
  }, []);

  function handleLogin() {
    window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${TWITCH_REDIRECT_URI}&scope=channel:manage:predictions&response_type=token`;
  }

  function handleLogout() {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
    setCredentials(null);
  }

  async function handleCallback() {
    if (!window.location.hash && !accessToken) {
      return;
    }
    localStorage.setItem(
      "access_token",
      document.location.hash.split("&")[0].split("=")[1]
    );
    setAccessToken(document.location.hash.split("&")[0].split("=")[1]);
    checkToken();
  }

  return {
    accessToken,
    credentials,
    isAuthenticated,
    handleLogin,
    handleLogout,
    TWITCH_CLIENT_ID,
  };
}

export default TwitchAuth;

export { useTwitchAuth, useChannelPredictions };

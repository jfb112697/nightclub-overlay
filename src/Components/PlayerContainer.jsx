import { React, useEffect, useState, useRef } from "react";

const useVisibility = (obj, keys) => {
  const initialState = {};
  keys.forEach((key) => {
    const [visibility, setVisibility] = useState(true);
    initialState[key] = visibility;
    initialState[key + "Handler"] = (vis = !visibility) => setVisibility(vis);
  });
  return [initialState];
};

const ScoreContainer = (props) => {
  let borderWidth = "0 3px 0 0";
  let br = "0 0 0 6px";
  const deg = props.isReversed ? "270deg" : "90deg";
  const scoreBg =
    "linear-gradient(" +
    deg +
    ", rgba(197, 30, 147, 1) 0%, rgba(253, 140, 251, 1) 100%)";
  if (props.isReversed) {
    borderWidth = "0 0 0 3px";

    br = "0 0 6px 0";
  }
  return (
    <div
      className={"score-container "}
      style={{
        borderWidth: borderWidth,
        borderRadius: br,
        background: scoreBg,
      }}
    >
      <span className={props.className}>{props.score}</span>
    </div>
  );
};

const PlayerContainer = (props) => {
  const playerRef = useRef(props.player);
  const nameGap = props.player.sponsor ? "12px" : "0";
  const visibleKeys = ["name", "score", "pronouns"];
  const [visibility] = useVisibility(playerRef.current, visibleKeys);

  useEffect(() => {
    visibility.nameHandler();
    setTimeout(() => {
      visibility.nameHandler(true);
      playerRef.current = props.player;
    }, 350);
  }, [props.player.name]);

  useEffect(() => {
    visibility.scoreHandler();
    setTimeout(() => {
      visibility.scoreHandler(true);
      playerRef.current = props.player;
    }, 350);
  }, [props.player.score]);

  useEffect(() => {
    visibility.pronounsHandler();
    setTimeout(() => {
      visibility.pronounsHandler(true);
      playerRef.current = props.player;
    }, 350);
  }, [props.player.pronouns]);

  function formatPronouns(pronouns) {
    pronouns = pronouns.toLowerCase();
    pronouns = pronouns.charAt(0).toUpperCase() + pronouns.slice(1);
    const slash = pronouns.indexOf("/");
    pronouns =
      pronouns.slice(0, slash + 1) +
      pronouns.charAt(slash + 1).toUpperCase() +
      pronouns.slice(slash + 2, pronouns.length);

    return pronouns;
  }

  return (
    <div
      className={`player-container ${
        props.isReversed ? "flex-direction-row-reverse" : "flex-direction-row"
      }`}
    >
      <ScoreContainer
        isReversed={props.isReversed}
        className={visibility.score ? "fade-in visible" : "fade-in"}
        score={
          playerRef.current && playerRef.current.score != null
            ? playerRef.current.score
            : "-1"
        }
      />
      <div
        className={`name-container ${
          props.isReversed ? "align-items-flex-end" : "align-items-flex-start"
        } ${props.isReversed ? "margin-right-13px" : "margin-left-13px"}`}
      >
        <div
          className={
            visibility.name ? "fade-in visible name-text" : "fade-in name-text"
          }
          style={{
            fontWeight: "bold",
            display: "flex",
            gap: nameGap,
          }}
        >
          <span
            style={{
              fontWeight: "normal",
            }}
          >
            {props.player.sponsor}
          </span>
          {playerRef.current.name}
        </div>
        <div
          className={
            "pronouns " + (visibility.pronouns ? "fade-in visible" : "fade-in")
          }
          style={{ fontSize: "12pt" }}
        >
          {playerRef.current.pronouns
            ? formatPronouns(playerRef.current.pronouns)
            : "They/Them"}
        </div>
      </div>
      <div
        className={`char-container ${
          props.isReversed
            ? "border-radius-0-10px-0-0"
            : "border-radius-10px-0-0-0"
        } ${
          props.isReversed
            ? "border-width-3px-3px-3px-0"
            : "border-width-3px-0-3px-3px"
        }`}
      >
        <img
          className={`${
            props.isReversed ? "" : "transform-scaleX-1"
          } position-relative ${props.isReversed ? "left-19px" : ""}`}
          src={`/Characters/${props.player.character}/0.png`}
        />
      </div>
    </div>
  );
};

export { PlayerContainer, ScoreContainer };

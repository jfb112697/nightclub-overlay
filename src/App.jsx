import Background from "./Components/Background";
import bgtexture from "./assets/bgtexture.svg";

import { useFetchPoll } from "./Hooks/useFetchPoll";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Game } from "./Components/Game";
import LowerThird from "./Components/LowerThird/LowerThird";
import { React, useState, useEffect } from "react";
import TwitchAuth from "./Components/TwitchAuth";
import Dashboard from "./Components/Dashboard";

function getPort(url) {
  const urlParams = new URLSearchParams(url.search);
  const port = urlParams.get('port');

  if (!port) {
    return 80;
  }

  return parseInt(port);
}

function App() {
  const port = getPort(window.location);
  const data = useFetchPoll(`http://localhost/getCurrentValues`);
  const [error, setError] = useState(null);

  const [id, setId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let json;
      try {
        const res = await fetch("https://api.smash.gg/gql/alpha", {
          method: "POST",
          headers: {
            Authorization: "Bearer 4582999ee0f6149902298862dbb1c453",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `query TournamentQuery($slug:String!){
              tournament(slug:$slug){
                events{
                  id
                  name
                }
              }
            }`,
            variables: { slug: data.Smashgg.slug },
          }),
        });
        json = await res.json();
        setId(json.data.tournament.events.filter(e => e.name.toLowerCase().includes("singles"))[0].id);
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, [data && data.Smashgg && data.Smashgg.slug]);

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Game data={data} ggId={id} />
              </>
            }
          ></Route>
          <Route
            path="/lower-third"
            element={<LowerThird data={data} />}
          ></Route>
          <Route
            path="/lower-third-nocom"
            element={<LowerThird data={data} showCommentary={false} />}
          ></Route>
          <Route
            path="/lower-third-scores"
            element={<LowerThird data={data} showScores={true} />}
          ></Route>
          <Route
            path="/dashboard"
            element={
              <Dashboard
                player1Name={(data && data.Player1.name) || ""}
                player2Name={(data && data.Player2.name) || ""}
              />
            }
          ></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;

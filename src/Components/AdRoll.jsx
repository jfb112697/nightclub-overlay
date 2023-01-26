import React, { useState, useEffect } from "react";
import RecentResults from "./RecentResults";
import HeadToHead from "./HeadToHead";
import nightclub from "../assets/nightclub.webm";
import { useChannelPredictions } from "./TwitchAuth";

const AdRoll = (props) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const recentResults = useRecentResults(props.ggId);
  const [opacity, setOpacity] = useState(100);
  const defaultAd = (
    <video
      key={1}
      height="825px"
      src={nightclub}
      style={{ position: "relative", top: "-50px" }}
      autoPlay
      loop
    />
  );

  const [ads, setAds] = useState([defaultAd]);

  useEffect(() => {
    let newAds = [defaultAd];
    if (recentResults && props.ggId)
      newAds.push(<RecentResults key={3} results={recentResults} />);
    if (props.player1.h2hWins > 0 || props.player2.h2hWins > 0)
      newAds.push(
        <HeadToHead player1={props.player1} player2={props.player2} />
      );
    setAds(newAds);
  }, [recentResults, props.ggId, props.player1.h2hWins, props.player2.h2hWins]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setOpacity(100);
        setCurrentAdIndex(
          (currentAdIndex) => (currentAdIndex + 1) % ads.length
        );
      }, 330);
    }, 7000);
    return () => clearInterval(intervalId);
  }, [ads]);

  return (
    <div className="ad-container">
      <div
        className="ad"
        style={{ transition: "opacity .33s", opacity: opacity }}
      >
        {ads[currentAdIndex]}
      </div>
    </div>
  );
};

const useRecentResults = (ggId) => {
  const [recentResults, setRecentResults] = useState(null);
  useEffect(() => {
    if (ggId) {
      let Query = `query EventSets($eventId: ID!, $page: Int!, $perPage: Int!) {
		event(id: $eventId) {
		  id
		  name
		  sets(
			page: $page
			perPage: $perPage
			sortType: RECENT
			filters:{
			  hideEmpty: true
			  state: 3
			}
			  ) {
			pageInfo {
			  total
			}
			
			nodes {
			  state
			  slots {
				entrant {
				  name
				}
				standing {
				  id
				  stats{
					score {
					  value
					}
				  }
				}
			  }
			}
		  }
		}
	  },
	  `;
      const fetchRecentResults = async () => {
        const response = await fetch("https://api.smash.gg/gql/alpha", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer ",
          },
          body: JSON.stringify({
            query: Query,
            variables: {
              eventId: ggId,
              page: 1,
              perPage: 4,
            },
          }),
        });
        const data = await response.json();

        setRecentResults(data);
      };
      fetchRecentResults();
      const intervalId = setInterval(fetchRecentResults, 10000);
      return () => clearInterval(intervalId);
    }
  }, [ggId]);
  return recentResults;
};

export default AdRoll;

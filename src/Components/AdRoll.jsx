import React, { useState, useEffect, useRef } from "react";
import RecentResults from "./RecentResults";
import HeadToHead from "./HeadToHead";
import nightclub from "../assets/nightclub.webm";
import { useTwitchAuth, useChannelPredictions } from "./TwitchAuth";

const AdRoll = (props) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const recentResults = useRecentResults(props.ggId);
  const { accessToken, credentials, TWITCH_CLIENT_ID } = useTwitchAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [opacity, setOpacity] = useState(100);
  const [intervalId, setIntervalId] = useState();
  const [ads, setAds] = useState([
    {
      element: () => <video
        src={nightclub}
        height="825px"
        autoPlay
        loop
        muted
        style={{ position: "relative", top: "-50px" }} />
    }
  ]);
  const [currentAd, setCurrentAd] = useState(ads[0]);

  const [predictions, outcomes, isActive] = useChannelPredictions(
    accessToken,
    credentials,
    isMounted
  );

  useEffect(() => {
    const adsToDisplay = [
      {
        element: () => <video
          src={nightclub}
          height="825px"
          autoPlay
          loop
          muted
          style={{ position: "relative", top: "-50px" }} />
      },
      {
        element: () => recentResults ? <RecentResults results={recentResults} /> : null,
      },
      {
        element: () =>
          (outcomes && isActive) || (props.player1.h2hWins > -1 && props.player2.h2hWins > -1) === true
            ? <HeadToHead outcomes={outcomes} predictions={predictions} isActive={isActive} />
            : null,
      },
    ];

    const filteredAds = adsToDisplay.filter((ad) => {
      const element = ad.element();
      return element !== null;
    });

    setAds(filteredAds);
  }, [recentResults, isActive, currentAdIndex, outcomes]);

  useEffect(() => { //When currentAdIndex changes
    setOpacity(0); //Fade out ad container
    setTimeout(() => setCurrentAd(ads[currentAdIndex]), 330); //Change active ad after fade-out finished
    setTimeout(() => {
      setOpacity(100); //Fade back in after 335ms
    }, 335);
  }, [currentAdIndex]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Update the current ad index
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [ads.length]);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);


  return (
    <div
      className="ad-container"
      style={{ transition: "opacity .33s", opacity }}
    >
      {currentAd.element()}
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
            Authorization: "Bearer a12c24765a6edf6007669900bdf67bcf",
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

import React, { useState, useEffect } from "react";
import RecentResults from "./RecentResults";
import HeadToHead from "./HeadToHead";
import nightclub from "../assets/nightclub2.webm";
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
      id: 1,
      type: "video",
      url: nightclub,
      height: "825px",
    },
  ]);
  const [currentAd, setCurrentAd] = useState(ads[0]);

  const [predictions, outcomes, isActive] = useChannelPredictions(
    accessToken,
    credentials,
    true
  );

  useEffect(() => {
    const adsToDisplay = [
      {
        id: 1,
        type: "video",
        url: nightclub,
        height: "825px",
      },
      {
        id: 2,
        type: "custom",
        component: RecentResults,
        apiData: recentResults && { results: recentResults },
      },
      {
        id: 3,
        type: "custom",
        component: HeadToHead,
        player1: props.player1,
        player2: props.player2,
        apiData:
          (outcomes && isActive) || (props.player1.h2hWins > -1 && props.player2.h2hWins > -1) === true
            ? {
              outcomes: outcomes,
              predictions: predictions,
              isActive: isActive,
            }
            : null,
      },
    ];

    const filteredAds = adsToDisplay.filter((ad) => {
      if (ad.type === "video" || ad.type === "image") {
        return true;
      } else if (ad.type === "custom") {
        const { apiData } = ad;
        // Only show ad if apiData is not null
        return apiData !== null;
      } else {
        return false;
      }
    });

    setAds(filteredAds);
  }, [recentResults, isActive, currentAdIndex, outcomes]);

  useEffect(() => {
    setOpacity(0);
    setTimeout(() => setCurrentAd(ads[currentAdIndex]), 330);
    setTimeout(() => {
      setOpacity(100);
    }, 335);
  }, [currentAdIndex]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Update the current ad index
      console.log((currentAdIndex + 1) % ads.length);
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

  function getAdComponent(ad) {
    let adComponent;
    switch (ad.type) {
      case "video":
        adComponent = (
          <video
            src={ad.url}
            height={ad.height}
            autoPlay
            loop
            muted
            style={{ position: "relative", top: "-50px" }}
          />
        );
        break;
      case "custom":
        const CustomAdComponent = ad.component;
        adComponent = (
          <CustomAdComponent
            outcomes={outcomes}
            predictions={predictions}
            {...ad}
          />
        );
        break;
      default:
        adComponent = null;
    }
    return (
      <div key={ad.id} className="ad">
        {adComponent}
      </div>
    );
  }
  return (
    <div
      className="ad-container"
      style={{ transition: "opacity .33s", opacity }}
    >
      {getAdComponent(currentAd)}
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
            Authorization: "Bearer 4582999ee0f6149902298862dbb1c453",
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

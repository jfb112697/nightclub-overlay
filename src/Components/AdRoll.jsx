import React, { useState, useEffect } from "react";
import RecentResults from "./RecentResults";
import HeadToHead from "./HeadToHead";
import nightclub from "../assets/nightclub.webm";
import { useChannelPredictions } from "./TwitchAuth";

const AdRoll = (props) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(1);
  const [opacities, setOpacities] = useState([100, 0, 0]);
  const recentResults = useRecentResults(props.ggId);
  const [opacity, setOpacity] = useState(100);
  const [isPredicting, setIsPredicting] = useState(false);
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
    let newAds = [...ads];
    newAds = newAds.filter(
      (component) => component.type.name !== "RecentResults"
    );
    if (recentResults && props.ggId) {
      newAds.push(<RecentResults key={3} results={recentResults} />);
    }
    setAds(newAds);
  }, [recentResults, props.ggId]);

  useEffect(() => {
    let filteredAds = ads.filter(
      (component) => component.type.name !== "HeadToHead"
    );
    filteredAds.map((v, i) => {
      console.log(v.type);
    });
    if (
      props.player1.h2hWins > 0 ||
      props.player2.h2hWins > 0 ||
      isPredicting
    ) {
      console.log("adding h2h");
      filteredAds.push(
        <HeadToHead
          player1={props.player1}
          player2={props.player2}
          setActive={setIsPredicting}
        />
      );
    }
    setAds(filteredAds);
  }, [props.player1.name, props.player2.name]);

  useEffect(() => {
    console.log("new opacities");
    const newOpacities = Array(ads.length);
    for (let i = 0; i < newOpacities.length; i++) {
      newOpacities[i] === currentAdIndex ? 100 : 0;
    }
    setOpacities(newOpacities);
    /* const intervalId = setInterval(() => {
      if (ads.length == 1 && currentAdIndex == 0) {
        return;
      }
      setOpacity(0);
      setTimeout(() => {
        setCurrentAdIndex(
          (currentAdIndex) => (currentAdIndex + 1) % ads.length
        );
      }, 330);
      setTimeout(() => {
        setOpacity(100);
      }, 350);
    }, 7000);
    return () => clearInterval(intervalId);*/
  }, [ads]);

  useEffect(() => {
    let newOpacities = [];
    ads.map((v, i) => {
      i === currentAdIndex ? (newOpacities[i] = 100) : (newOpacities[i] = 0);
    });
    setOpacities(newOpacities);
  }, [currentAdIndex]);

  return (
    <div
      className="ad-container"
      style={{ transition: "opacity .33s", opacity: opacity }}
    >
      {ads.map((v, i) => {
        let adOpacity = 0;
        if (currentAdIndex === i) {
          adOpacity = 100;
        }
        return (
          <div className="ad" style={{ opacity: opacities[i] }}>
            {v}
          </div>
        );
      })}
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

import React, { useState, useEffect, useRef } from "react";
import RecentResults from "./RecentResults";
import HeadToHead from "./HeadToHead";
import nightclub from "../assets/nightclub.webm";
import { useTwitchAuth, useChannelPredictions } from "./TwitchAuth";

const AdRoll = (props) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [opacities, setOpacities] = useState([100, 0]);
  const recentResults = useRecentResults(props.ggId);
  const [opacity, setOpacity] = useState(100);
  const [isPredicting, setIsPredicting] = useState(false);
  const { accessToken, credentials, TWITCH_CLIENT_ID } = useTwitchAuth();
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef(null);

  const [predictions, outcomes, isActive] = useChannelPredictions(
    accessToken,
    credentials,
    isMounted
  );

  const defaultAd = (
    <video
      key={31203912}
      height="825px"
      src={nightclub}
      style={{ position: "relative", top: "-50px" }}
      autoPlay
      loop
      muted
      ref={videoRef}
      onEnded={() => {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }}
    />
  );

  const [ads, setAds] = useState([defaultAd]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const newAds = [...ads];
    let rr = <RecentResults key={Math.random()} results={recentResults} />;
    if (recentResults && props.ggId) {
      newAds.push(rr);

      setOpacities([...opacities, 0]);

      setAds(newAds);
    }

    return () => {
      let filterdAds = [...ads].filter(a => a != rr);
      setAds(filterdAds);
    }
  }, [props.ggId]);

  useEffect(() => {
    const newAds = [...ads];
    const h2h = <HeadToHead
      player1={props.player1}
      player2={props.player2}
      outcomes={outcomes}
      predictions={predictions}
      isActive={isActive}
      key={Math.random()}
    />;
    if (props.player1.name || props.player2.name || isActive) {
      console.log("adding h2h");
      newAds.push(h2h);
      setOpacities([...opacities, 0]);
      setAds(newAds);
    }
    return () => {
      let filterdAds = [...ads].filter(a => a != h2h);
      setAds(filterdAds)
    };
  }, [props.player1.name, props.player2.name, isActive]);

  useEffect(() => {
    if (currentAdIndex == 0 && ads.length == 0) {
      return;
    }
    const intervalId = setInterval(() => {
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
    return () => clearInterval(intervalId);
  }, [ads]);


  useEffect(() => {
    let newOpacities = [];
    for (let i = 0; i < ads.length; i++) {
      newOpacities.push(currentAdIndex == i ? 100 : 0);
    }
    setOpacities(newOpacities);
  }, [ads, currentAdIndex]);

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

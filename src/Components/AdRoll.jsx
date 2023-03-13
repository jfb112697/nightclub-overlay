import React, { useState, useEffect, useRef } from "react";
import RecentResults from "./RecentResults";
import HeadToHead from "./HeadToHead";
import nightclub from "../assets/nightclub.webm";
import { useTwitchAuth, useChannelPredictions } from "./TwitchAuth";

const AdRoll = (props) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [opacities, setOpacities] = useState([100]);
  const recentResults = useRecentResults(props.ggId);
  const [opacity, setOpacity] = useState(100);
  const [isPredicting, setIsPredicting] = useState(false);
  const { accessToken, credentials, TWITCH_CLIENT_ID } = useTwitchAuth();
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef(null);
  const [ads, setAds] = useState([{
    id: 1,
    type: 'video',
    url: nightclub,
    height: "825px",



  }]);


  const [predictions, outcomes, isActive] = useChannelPredictions(
    accessToken,
    credentials,
    isMounted
  );

  useEffect(() => {
    const adsToDisplay = [
      {
        id: 1,
        type: 'video',
        url: nightclub,
        height: "825px"
      },
      {
        id: 2,
        type: 'custom',
        component: RecentResults,
        apiData: recentResults,
      },
      {
        id: 3,
        type: 'custom',
        component: HeadToHead,
        player1: props.player1,
        player2: props.player2,
        apiData:
          outcomes && isActive === true
            ? { outcomes: outcomes, predictions: predictions, isActive: isActive }
            : null,
      },
    ];

    const filteredAds = adsToDisplay.filter((ad) => {
      if (ad.type === 'video' || ad.type === 'image') {
        return true;
      } else if (ad.type === 'custom') {
        const { apiData } = ad;
        // Only show ad if apiData is not null
        return apiData !== null;
      } else {
        return false;
      }
    });

    setAds(filteredAds);
  }, [recentResults, isActive]);


  useEffect(() => {
    const interval = setInterval(() => {
      if (ads.length == 0 && currentAdIndex == 0) {
        return;
      }
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [ads]);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  function getAdComponent(ad) {
    let adComponent;
    switch (ad.type) {
      case 'video':
        adComponent = <video src={ad.url} height={ad.height} autoPlay loop muted style={{ position: "relative", top: "-50px" }} />;
        break;
      case 'custom':
        const CustomAdComponent = ad.component;
        adComponent = <CustomAdComponent {...ad} />;
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
    <div className="ad-container" style={{ transition: 'opacity .33s', opacity }}>
      {getAdComponent(ads[currentAdIndex])}
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

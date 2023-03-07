# nightclub-overlay
`nightclub-overlay` is a single-page React app that serves as the visual overlay for the live production of The Nightclub, the most viewed and attended Super Smash Bros. Melee weekly tournament in the world. Watch it in action every Wednesday @ https://twitch.tv/nycmelee


## Design Goals
`nightclub-overlay` was designed with inspiration from the high-quality live production overlays from the (now defunct) broadcast studio Beyond the Summit. The main goals of `nightclub-overlay` is to provide a well-designed aesthetically pleasing way to convery user entered scoreboard data to viewers as well as handle several API calls to give viewers unique insights through automated data ingestion.

## Integrations Rundown

#### start.gg
If given the slug for a bracket hosted by start.gg, `nightclub-overlay` will begin to poll a graphql request every 7 seconds for the 4 most recently completed matches of the bracket.

#### Twitch.tv
`nightclub-overlay` provides components to handle Twitch.tv oauth. Once authentication is completed a websockets connection is opened to the Twitch EventSub API, and an HTTPS API call is made to subscribe to events regarding channel predictions. Channel predictions are a feature on Twitch.tv that allows viwers to wager channel points (which are gained passively through watching the broadcast) on one of a number of pre-determined outcomes, once the broadcaster picks a "winner" the channel points are released to the viewers that wagered on the winning outcome. `nightclub-overlay` uses this data to convey the current state of the channel predictions to viewers as well as commentators. `nightclub-overlay` also hosts a small dashboard with a button to create a new channel prediction for the players already in the scoreboard, minimizing a process that normally takes several clicks and some typing to one button press, as well as buttons to select a winning outcome.


## Scenes

See `nightclub-overlay` in use.

### Main (Gameplay) Scene

<img width="1440" alt="image" src="https://user-images.githubusercontent.com/1462292/223492968-f3d69248-9b90-4931-9a0c-a5176b378129.png">


### Main Scene w/ Recent Results Visible

<img width="1440" alt="image" src="https://user-images.githubusercontent.com/1462292/223493124-c0f32cd1-39ce-4956-a9d3-d1230f8f3302.png">

### Lower Third Scene

<img width="1440" alt="image" src="https://user-images.githubusercontent.com/1462292/223493303-9a7ef296-5fb4-40c8-9e69-e8ad242fa2e2.png">

### Lower Third Scene w/ Channel Predictions 

<img width="1440" alt="image" src="https://user-images.githubusercontent.com/1462292/223493496-0411b61e-af1e-4ff8-ba1f-48fea64f55e0.png">

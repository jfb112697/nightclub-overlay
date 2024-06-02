import LowerThirdPlayerContainer from "./LowerThirdPlayerContainer";

function LowerThirdScores(props){
    return (
        <div className={"lower-third-score-container " + props.className }>
            <div className="lower-third-score-container-inner">
            <LowerThirdPlayerContainer player={props.player1} />
            <LowerThirdPlayerContainer player={props.player2} className="second-player" />
            </div>
            <img className="lower-third-logo" src="https://images.squarespace-cdn.com/content/v1/5d695110f8d59d0001fd289b/1785ccc8-2554-480b-8bd7-857c13b22110/OS_NYC_WHITE_TRANSPARENT.png?format=1500w"></img>
        </div>
    )
}

export default LowerThirdScores;
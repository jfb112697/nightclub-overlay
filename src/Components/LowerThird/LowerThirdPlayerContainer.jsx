import React from 'react';



const LowerThirdPlayerContainer = (props) => {
    return (
        <div className={`lower-third-score-player ${props.className}`}>
            
            <div className="lower-third-score-player-name">
                <div className="lower-third-score-number-container">
                <img src={`/Characters/${props.player.character}/0.png`} />
                    <div className='lower-third-score'>
                        {props.player.score}
                    </div>
                </div>
                <div className="lower-third-player-name">
                    {props.player.name}
                </div>
            </div>
            <div className="versus">
                {props.className ? 'S' : 'V'}
            </div>
        </div>
    );
};

export default LowerThirdPlayerContainer;
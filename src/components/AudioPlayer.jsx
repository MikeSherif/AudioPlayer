import {useRef, useState} from 'react';
import "./AudioPlayer.css"
import {PlayIcon, PauseIcon} from "./icons.jsx";
import LiquidGlass from 'liquid-glass-react'

const AudioPlayer = ({audioSrc}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef(null);

    const handleSeek = (e) => {

    }

    const handlePlayPause = () => {

    }

    return (
        <div className="audioPlayer" style={{
            backgroundImage: `url('https://react.avtor-dev.ru/upload/iblock/3b5/0nrenw1rzthb18h8wovcaal3y6gmpomv/a03.png')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            height: '780px'
        }}>
            <div className="audioWrapper">
                <button className="audioButton" onClick={handlePlayPause}>

                        {isPlaying ? <PauseIcon/> : <PlayIcon/>}

                </button>
                <div className="audioInfo">
                    <div className="audioDuration">
                        <p className="audioDurationText">{currentTime}</p>
                        <p className="audioDurationText">{duration}</p>
                    </div>
                    <input className="audioRange" type="range"
                           min="0"
                           max={duration}
                           value={currentTime}
                           onChange={handleSeek}
                    />
                </div>
                <audio ref={audioRef} src={audioSrc}></audio>
            </div>
        </div>);
};

export default AudioPlayer;
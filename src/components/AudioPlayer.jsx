import {useEffect, useRef, useState} from 'react';
import "./AudioPlayer.css"
import {PlayIcon, PauseIcon} from "./icons.jsx";
import LiquidGlass from 'liquid-glass-react'

const AudioPlayer = ({audioSrc}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef(null);

    const handleSeek = (e) => {
        audioRef.current.currentTime = e.target.value;
        setCurrentTime(e.target.value);
    }

    const handleTimeUpdate = (e) => {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration);
    }

    const handlePlay = (e) => {
        audioRef.current.play();
        setIsPlaying(true);
    }

    const handlePause = (e) => {
        audioRef.current.pause();
        setIsPlaying(false);
    }

    const handlePlayPause = () => {
        if(isPlaying) {
            handlePause();
        } else {
            handlePlay();
        }
    }

    function formatDuration(durationSeconds) {
        const minutes = Math.floor((durationSeconds / 60));
        const seconds = Math.floor((durationSeconds % 60));
        const formattedSeconds = seconds.toString().padStart(2, '0');
        return `${minutes}:${formattedSeconds}`;
    }

    useEffect(() => {
        audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        }
    }, [])
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
                        <p className="audioDurationText">{formatDuration(currentTime)}</p>
                        <p className="audioDurationText">{formatDuration(duration)}</p>
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
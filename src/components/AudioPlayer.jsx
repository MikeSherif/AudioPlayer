import { useEffect, useRef, useState } from 'react';
import "./AudioPlayer.css";
import { PlayIcon, PauseIcon } from "./icons.jsx";

const AudioPlayer = ({ audioSrc }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentBgIndex, setCurrentBgIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false); // флаг перетаскивания ползунка

    const audioRef = useRef(null);
    const debounceTimer = useRef(null);

    const backgrounds = [
        {
            time: 0,
            url: 'https://react.avtor-dev.ru/upload/iblock/3b5/0nrenw1rzthb18h8wovcaal3y6gmpomv/a03.png'
        },
        {
            time: 5,
            url: 'https://react.avtor-dev.ru/upload/iblock/c72/zdd8ytojpw5bjf54rfslyhppr3gojai9/b01.webp'
        }
    ];

    const updateBackground = (time) => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            let newIndex = 0;
            for (let i = 0; i < backgrounds.length; i++) {
                if (time >= backgrounds[i].time) {
                    newIndex = i;
                } else {
                    break;
                }
            }
            setCurrentBgIndex(newIndex);
        }, 180);
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            const time = audio.currentTime;
            setCurrentTime(time);

            // Обновляем фон только если НЕ перетаскиваем ползунок
            if (!isDragging) {
                updateBackground(time);
            }
        };

        const handleLoaded = () => {
            setDuration(audio.duration || 0);
            setCurrentBgIndex(0);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoaded);
        audio.addEventListener('canplay', handleLoaded);

        if (audio.readyState >= 1) {
            handleLoaded();
        }

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoaded);
            audio.removeEventListener('canplay', handleLoaded);
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [isDragging]); // зависимость от перетаскивания ренджа

    const handleSeekStart = () => {
        setIsDragging(true);
    };

    const handleSeekEnd = (e) => {
        setIsDragging(false);
        const newTime = Number(e.target.value);
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        updateBackground(newTime);
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.log("Play blocked:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const formatTime = (seconds) => {
        if (!seconds || !isFinite(seconds)) return '0:00';
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec.toString().padStart(2, '0')}`;
    };

    const currentBackground = backgrounds[currentBgIndex]?.url || '';

    return (
        <div
            className="audioPlayer"
            style={{
                backgroundImage: currentBackground ? `url(${currentBackground})` : 'none',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                height: 'clamp(18.75rem, 10.3929rem + 41.7857vw, 48rem)',
                borderRadius: '35px',
                transition: 'background-image 0.6s ease-out' // чуть короче переход
            }}
        >
            <div className="audioWrapper">
                <button className="audioButton" onClick={handlePlayPause}>
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>

                <div className="audioInfo">
                    <div className="audioDuration">
                        <p className="audioDurationText">{formatTime(currentTime)}</p>
                        <p className="audioDurationText">{formatTime(duration)}</p>
                    </div>

                    <input
                        className="audioRange"
                        type="range"
                        min="0"
                        max={duration || 100}
                        step="any"
                        value={currentTime}
                        onPointerDown={handleSeekStart}    // начало drag
                        onPointerUp={handleSeekEnd}        // конец drag
                        onChange={(e) => {
                            // во время drag обновляем только время, фон — нет
                            setCurrentTime(Number(e.target.value));
                        }}
                    />
                </div>

                <audio ref={audioRef} src={audioSrc} preload="metadata" />
            </div>
        </div>
    );
};

export default AudioPlayer;
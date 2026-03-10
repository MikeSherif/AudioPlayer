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
            url: 'img/01.jpg'
        },
        {
            time: 5,
            url: 'img/02.jpg'
        },
        {
            time: 10,
            url: 'img/03.jpg'
        },
        {
            time: 15,
            url: 'img/04.jpg'
        },
        {
            time: 20,
            url: 'img/05.jpg'
        },
        {
            time: 25,
            url: 'img/06.jpg'
        },
        {
            time: 30,
            url: 'img/07.jpg'
        },
        {
            time: 35,
            url: 'img/08.jpg'
        },
        {
            time: 40,
            url: 'img/09.jpg'
        },
        {
            time: 45,
            url: 'img/10.jpg'
        },
        {
            time: 50,
            url: 'img/11.jpg'
        },
        {
            time: 55,
            url: 'img/12.jpg'
        },
        {
            time: 60,
            url: 'img/13.jpg'
        },
        {
            time: 65,
            url: 'img/14.jpg'
        },
        {
            time: 70,
            url: 'img/15.jpg'
        },
        {
            time: 75,
            url: 'img/16.jpg'
        },
        {
            time: 80,
            url: 'img/17.jpg'
        },
        {
            time: 85,
            url: 'img/18.jpg'
        },
        {
            time: 90,
            url: 'img/19.jpg'
        },
        {
            time: 95,
            url: 'img/20.jpg'
        },
        {
            time: 100,
            url: 'img/21.jpg'
        },
        {
            time: 105,
            url: 'img/22.png'
        },
        {
            time: 110,
            url: 'img/23.png'
        },
        {
            time: 115,
            url: 'img/24.jpg'
        },
        {
            time: 120,
            url: 'img/25.jpg'
        },
        {
            time: 125,
            url: 'img/26_1.jpg'
        },
        {
            time: 130,
            url: 'img/26.jpg'
        },
        {
            time: 135,
            url: 'img/27.jpg'
        },
        {
            time: 140,
            url: 'img/28.jpg'
        },
        {
            time: 145,
            url: 'img/29.jpg'
        },
        {
            time: 150,
            url: 'img/30.jpg'
        },
        {
            time: 155,
            url: 'img/31.jpg'
        },
        {
            time: 160,
            url: 'img/32.jpg'
        },
        {
            time: 165,
            url: 'img/33.jpg'
        },
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
        }, 280);
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
                transition: 'background-image 0.3s' // чуть короче переход
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
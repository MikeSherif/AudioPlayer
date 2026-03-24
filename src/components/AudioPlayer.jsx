import { useEffect, useMemo, useRef, useState } from 'react';
import './AudioPlayer.css';
import { ArrowLeftIcon, ArrowRightIcon, PauseIcon, PlayIcon } from './icons.jsx';

const AUDIO_TOTAL_SECONDS = 26 * 60 + 50;

const AudioPlayer = ({ audioSrc }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentBgIndex, setCurrentBgIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const audioRef = useRef(null);
    const lastAutoBgIndexRef = useRef(0);
    const isDraggingRef = useRef(false);

    const backgrounds = useMemo(
        () => [
            { time: 71, url: 'img/01.jpg' },
            { time: 150, url: 'img/02.jpg' },
            { time: 233, url: 'img/03.jpg' },
            { time: 292, url: 'img/04.jpg' },
            { time: 336, url: 'img/05.jpg' },
            { time: 359, url: 'img/06.jpg' },
            { time: 440, url: 'img/07.jpg' },
            { time: 684, url: 'img/08.jpg' },
            { time: 747, url: 'img/09.jpg' },
            { time: 904, url: 'img/10.jpg' },
            { time: 937, url: 'img/11.jpg' },
            { time: 1003, url: 'img/12.jpg' },
            { time: 1005, url: 'img/13.jpg' },
            { time: 1079, url: 'img/14.jpg' },
            { time: 1080, url: 'img/15.jpg' },
            { time: 1200, url: 'img/16.jpg' },
            { time: 1214, url: 'img/17.jpg' },
            { time: 1234, url: 'img/18.jpg' },
            { time: 1289, url: 'img/19.jpg' },
            { time: 1310, url: 'img/20.jpg' },
            { time: 1330, url: 'img/21.jpg' },
            { time: 1350, url: 'img/22.png' },
            { time: 1360, url: 'img/23.png' },
            { time: 1430, url: 'img/24.jpg' },
            { time: 1460, url: 'img/25.jpg' },
            { time: 1485, url: 'img/26_1.jpg' },
            { time: 1515, url: 'img/26.jpg' },
            { time: 1525, url: 'img/27.jpg' },
            { time: 1539, url: 'img/28.jpg' },
            { time: 1553, url: 'img/29.jpg' },
            { time: 1568, url: 'img/30.jpg' },
            { time: 1582, url: 'img/31.jpg' },
            { time: 1596, url: 'img/32.jpg' },
            { time: 1610, url: 'img/33.jpg' }
        ],
        []
    );

    const findBgIndexByTime = (time) => {
        let newIndex = 0;
        for (let i = 0; i < backgrounds.length; i++) {
            if (time >= backgrounds[i].time) {
                newIndex = i;
            } else {
                break;
            }
        }
        return newIndex;
    };

    useEffect(() => {
        const images = backgrounds.map(({ url }) => {
            const image = new Image();
            image.src = url;
            return image;
        });

        return () => {
            images.length = 0;
        };
    }, [backgrounds]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            const time = audio.currentTime;
            if (isDraggingRef.current) return;

            setCurrentTime(time);
            const timedIndex = findBgIndexByTime(time);
            if (timedIndex !== lastAutoBgIndexRef.current) {
                lastAutoBgIndexRef.current = timedIndex;
                setCurrentBgIndex(timedIndex);
            }
        };

        const handleLoaded = () => {
            const mediaDuration = audio.duration || 0;
            const timedIndex = findBgIndexByTime(audio.currentTime);
            setDuration(mediaDuration || AUDIO_TOTAL_SECONDS);
            lastAutoBgIndexRef.current = timedIndex;
            setCurrentBgIndex(timedIndex);
        };

        const handleEnded = () => {
            setIsPlaying(false);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoaded);
        audio.addEventListener('canplay', handleLoaded);
        audio.addEventListener('ended', handleEnded);

        if (audio.readyState >= 1) {
            handleLoaded();
        }

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoaded);
            audio.removeEventListener('canplay', handleLoaded);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [backgrounds]);

    const goToSlide = (index) => {
        const normalizedIndex = Math.max(0, Math.min(index, backgrounds.length - 1));
        setCurrentBgIndex(normalizedIndex);
    };

    const handleSeekStart = () => {
        isDraggingRef.current = true;
        setIsDragging(true);
    };

    const handleSeekEnd = () => {
        isDraggingRef.current = false;
        setIsDragging(false);
    };

    const handleSeekChange = (newTime) => {
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
        setCurrentTime(newTime);
        const timedIndex = findBgIndexByTime(newTime);
        lastAutoBgIndexRef.current = timedIndex;
        setCurrentBgIndex(timedIndex);
    };

    useEffect(() => {
        if (!isDragging) return undefined;

        const stopDragging = () => {
            isDraggingRef.current = false;
            setIsDragging(false);
        };

        window.addEventListener('pointerup', stopDragging);
        window.addEventListener('pointercancel', stopDragging);

        return () => {
            window.removeEventListener('pointerup', stopDragging);
            window.removeEventListener('pointercancel', stopDragging);
        };
    }, [isDragging]);

    const handlePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            return;
        }

        audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => {
            console.log('Play blocked:', e);
            setIsPlaying(false);
        });
    };

    const formatTime = (seconds) => {
        if (!seconds || !isFinite(seconds)) return '0:00';
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className="audioPlayer" style={{ height: 'clamp(18.75rem, 10.3929rem + 41.7857vw, 48rem)' }}>
            <div className="audioBackgrounds" aria-hidden="true">
                {backgrounds.map((background, index) => (
                    <div
                        key={background.url}
                        className={`audioBackgroundLayer ${index === currentBgIndex ? 'isActive' : ''}`}
                        style={{ backgroundImage: `url(${background.url})` }}
                    />
                ))}
            </div>

            <button
                className="slideNavButton slideNavButtonPrev"
                onClick={() => goToSlide(currentBgIndex - 1)}
                disabled={currentBgIndex === 0}
                aria-label="Предыдущий слайд"
            >
                <ArrowLeftIcon />
            </button>

            <button
                className="slideNavButton slideNavButtonNext"
                onClick={() => goToSlide(currentBgIndex + 1)}
                disabled={currentBgIndex === backgrounds.length - 1}
                aria-label="Следующий слайд"
            >
                <ArrowRightIcon />
            </button>

            <div className="audioWrapper">
                <button className="audioButton" onClick={handlePlayPause}>
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>

                <div className="audioInfo">
                    <div className="audioDuration">
                        <p className="audioDurationText">{formatTime(currentTime)}</p>
                        <p className="audioDurationText">{formatTime(duration || AUDIO_TOTAL_SECONDS)}</p>
                    </div>

                    <input
                        className="audioRange"
                        type="range"
                        min="0"
                        max={duration || AUDIO_TOTAL_SECONDS}
                        step="any"
                        value={currentTime}
                        onPointerDown={handleSeekStart}
                        onPointerUp={handleSeekEnd}
                        onPointerCancel={handleSeekEnd}
                        onChange={(e) => {
                            const newTime = Number(e.target.value);
                            handleSeekChange(newTime);
                        }}
                    />
                </div>

                <audio ref={audioRef} src={audioSrc} preload="auto" />
            </div>
        </div>
    );
};

export default AudioPlayer;

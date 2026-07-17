import { useEffect, useMemo, useRef, useState } from 'react';
import './AudioPlayer.css';
import { ArrowLeftIcon, ArrowRightIcon, PauseIcon, PlayIcon } from './icons.jsx';

const AUDIO_TOTAL_SECONDS = 19 * 60 + 28;

const AudioPlayer2 = ({ audioSrc }) => {
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
            { time: 0, url: 'img/player2/images/0 обложка .png' },
            { time: 39, url: 'img/player2/images/1. Парк Крылья советов.jpg' },
            { time: 78, url: 'img/player2/images/2. Вид сверху.jpeg' },
            { time: 117, url: 'img/player2/images/3.Соцгород.jpg' },
            { time: 156, url: 'img/player2/images/4.Строители Соцгорода.jpg' },
            { time: 195, url: 'img/player2/images/5. Входная зона .jpeg' },
            { time: 234, url: 'img/player2/images/6. Входная зона парка.jpg' },
            { time: 273, url: 'img/player2/images/7. Улица Лядова.jpg' },
            { time: 311, url: 'img/player2/images/8. Копылова, 5 с сиренью.jpg' },
            { time: 350, url: 'img/player2/images/9. Копылова 5 .jpg' },
            { time: 389, url: 'img/player2/images/10. Копылов.png' },
            { time: 428, url: 'img/player2/images/11. Сквер деменьтьева.jpg' },
            { time: 467, url: 'img/player2/images/12.Дементьев_Пётр_Васильевич.jpg' },
            { time: 506, url: 'img/player2/images/13. Белинского, 8.jpg' },
            { time: 545, url: 'img/player2/images/14. вид на д.к. гайдара.jpg' },
            { time: 584, url: 'img/player2/images/15. сквер на Белинского.jpg' },
            { time: 623, url: 'img/player2/images/16. Окно в Соцгороде.JPG' },
            { time: 662, url: 'img/player2/images/17. Где жил королев.jpg' },
            { time: 701, url: 'img/player2/images/17.jpg' },
            { time: 740, url: 'img/player2/images/18.Михаил_Максимович_Глебов.jpg' },
            { time: 779, url: 'img/player2/images/19. Галай.jpg' },
            { time: 818, url: 'img/player2/images/20. Королев.jpg' },
            { time: 857, url: 'img/player2/images/22.jpg' },
            { time: 895, url: 'img/player2/images/23.jpg' },
            { time: 934, url: 'img/player2/images/24. Белинского 5 .jpg' },
            { time: 973, url: 'img/player2/images/25. Памятник Орджоникидзе.jpg' },
            { time: 1012, url: 'img/player2/images/26.jpg' },
            { time: 1051, url: 'img/player2/images/27.Дети в  дс 36.jpg' },
            { time: 1090, url: 'img/player2/images/28. фестиваль крылья советов.jpg' },
            { time: 1129, url: 'img/player2/images/29.jpg' }
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
            image.src = encodeURI(url);
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
                        style={{ backgroundImage: `url("${encodeURI(background.url)}")` }}
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

export default AudioPlayer2;

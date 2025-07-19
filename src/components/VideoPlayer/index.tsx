import { SPEED } from '@/constants';
import { useEffect, useRef, useState } from 'react';
import {
  FaExpand,
  FaPause,
  FaPlay,
  FaVolumeMute,
  FaVolumeUp,
} from 'react-icons/fa';
import {
  ControlsContainer,
  FullscreenButton,
  MainControls,
  PlayPauseButton,
  ProgressBar,
  SpeedControl,
  TimeControls,
  VideoElement,
  VideoPlayerContainer,
  VolumeControl,
  VolumeSlider,
  VolumeValue,
  VolumneSliderContainer,
} from './styled';
const VideoPlayer = ({ src, poster }: any) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout] = useState(null);

  // 格式化时间显示 (秒 -> 00:00)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // 临时显示控制条
  const showControlsTemporarily = () => {
    setShowControls(true);
    // if (controlsTimeout) {
    //   clearTimeout(controlsTimeout);
    // }
    // setControlsTimeout(setTimeout(() => setShowControls(false), 3000));
  };

  // 播放/暂停切换
  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
    showControlsTemporarily();
  };

  // 处理进度条变化
  const handleProgressChange = (e) => {
    const newProgress = e.target.value;
    setProgress(newProgress);
    videoRef.current.currentTime = (newProgress / 100) * duration;
    showControlsTemporarily();
  };

  // 处理音量变化
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    const roundedVolume = Math.round(newVolume * 100) / 100; // 保留两位小数
    setVolume(roundedVolume);
    videoRef.current.volume = roundedVolume;
    setIsMuted(roundedVolume === '0');
    showControlsTemporarily();
  };

  const volumePercent = isMuted ? 0 : Math.round(volume * 100);

  // 切换静音
  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    videoRef.current.muted = newMuted;
    showControlsTemporarily();
  };

  // 改变播放速度
  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    setPlaybackRate(newSpeed);
    videoRef.current.playbackRate = newSpeed;
    showControlsTemporarily();
  };

  // 切换全屏
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
    showControlsTemporarily();
  };

  // 初始化视频和事件监听
  useEffect(() => {
    const video = videoRef.current;

    const updateProgress = () => {
      if (duration) {
        setProgress((video.currentTime / duration) * 100);
        setCurrentTime(video.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [duration, controlsTimeout]);

  return (
    <VideoPlayerContainer
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => setShowControls(false)}
    >
      <VideoElement
        ref={videoRef}
        src={src}
        poster={poster}
        onClick={togglePlay}
      />

      <ControlsContainer style={{ opacity: showControls ? '1' : '0' }}>
        <ProgressBar
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleProgressChange}
        />

        <MainControls>
          <PlayPauseButton onClick={togglePlay}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </PlayPauseButton>

          <TimeControls>
            {formatTime(currentTime)} / {formatTime(duration)}
          </TimeControls>

          <VolumeControl>
            <button type="button" onClick={toggleMute}>
              {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <VolumneSliderContainer>
              <VolumeSlider
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
              />
              <VolumeValue>{volumePercent}%</VolumeValue>
            </VolumneSliderContainer>
          </VolumeControl>

          <SpeedControl value={playbackRate} onChange={handleSpeedChange}>
            {SPEED.map((speed) => (
              <option value={speed} key={speed}>
                {speed}x
              </option>
            ))}
          </SpeedControl>

          <FullscreenButton onClick={toggleFullscreen}>
            <FaExpand />
          </FullscreenButton>
        </MainControls>
      </ControlsContainer>
    </VideoPlayerContainer>
  );
};

export default VideoPlayer;

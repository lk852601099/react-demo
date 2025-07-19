import styled from 'styled-components';

const VideoPlayerContainer = styled.div`
  position: relative;
  max-width: 800px;
  margin: 20px auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
  background: #000;
`;

const VideoElement = styled.video`
  width: 100%;
  display: block;
`;

const ControlsContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 12px;
  display: flex;
  flex-direction: column;
  transition: opacity 0.3s ease;
`;

const MainControls = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  margin-top: 5px;
`;

const PlayPauseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  margin-right: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TimeControls = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-size: 14px;
  margin-right: 15px;
`;

const ProgressBar = styled.input`
  flex-grow: 1;
  height: 4px;
  margin: 0 10px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  appearance: none;
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ff4757;
    cursor: pointer;
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  margin-right: 15px;
`;

const VolumneSliderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 5px;
`;

const VolumeValue = styled.span`
  color: white;
  margin-right: 5px;
  font-size: 12px;
  min-width: 30px;
  text-align: center;
`;

const VolumeSlider = styled.input`
  width: 80px;
  height: 4px;
  margin-left: 5px;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ff4757;
    cursor: pointer;
  }
`;

const SpeedControl = styled.select`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 4px;
  border-radius: 4px;
  margin-right: 15px;
  margin-top: 5px;
  outline: none;
  option {
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 4px;
  }
`;

const FullscreenButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  margin-left: auto;
`;

export {
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
};

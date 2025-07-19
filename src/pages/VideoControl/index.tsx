import VideoPlayer from '@/components/VideoPlayer';

const App = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Custom Video Player</h1>
      <VideoPlayer
        src="
        https://assets.mixkit.co/069cihu8taaw66sfkyxv56ozpomu
        
        "
        poster="https://example.com/video-poster.jpg"
      />
    </div>
  );
};

export default App;

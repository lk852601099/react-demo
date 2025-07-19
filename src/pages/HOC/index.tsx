import { Fragment, useCallback, useEffect, useState } from 'react';
import { withProfiler } from './withProfiler';
function MyComponent() {
  return (
    <div>
      <h1>My Component</h1>
      <p>This is a simple component wrapped with Profiler.</p>
    </div>
  );
}

const MyComponentWithProfiler = withProfiler(MyComponent);

function Parent() {
  const [postMessageV, setPostMessageV] = useState<string[]>([]);
  const [channel] = useState(() => new BroadcastChannel('profiler'));

  const handleMessage = useCallback((e: any) => {
    if (e.type === 'message') {
      setPostMessageV((prev) => [...prev, e.data]);
    }
  }, []);

  useEffect(() => {
    channel.addEventListener('message', handleMessage);
    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, [channel, handleMessage]);

  return (
    <Fragment>
      <h1>Parent Component</h1>
      {postMessageV.length > 0
        ? postMessageV?.map((item: string, index: number) => (
            <p key={index}>Received Messages:{item}</p>
          ))
        : null}
      <hr className="my-5" />
      <MyComponentWithProfiler />
    </Fragment>
  );
}
export default Parent;

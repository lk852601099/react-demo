import React, { Profiler, useState } from 'react';
function withProfiler(WrappedComponent: React.ComponentType<any>) {
  return function ProfilerComponent(props: any) {
    const [states, setStates] = useState({
      mountTime: 0,
      renderTime: 0,
    });

    const onRenderCallback: any = (
      id: string,
      phase: 'mount' | 'update',
      actualDuration: number,
      baseDuration: number,
      startTime: number,
      commitTime: number,
      interactions: Set<any>,
    ) => {
      console.log({
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
      });
      if (phase === 'mount') {
        setStates((prev) => ({ ...prev, mountTime: actualDuration }));
      } else if (phase === 'update') {
        setStates((prev) => ({ ...prev, renderTime: actualDuration }));
      }
    };

    return (
      <>
        <Profiler id="WrappedComponent" onRender={onRenderCallback}>
          <WrappedComponent {...props} />
        </Profiler>
        <div>
          <h2>Profiler Metrics</h2>
          <p>Mount Time: {states.mountTime} ms</p>
          <p>Render Time: {states.renderTime} ms</p>
        </div>
      </>
    );
  };
}
export { withProfiler };

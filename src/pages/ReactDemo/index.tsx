import { Button } from 'antd';
import { useRef } from 'react';
import ChildComponent from './ChildComponent';

// 定义子组件暴露给父组件的方法类型
type ChildComponentRef = {
  childMethod: () => void;
};

function ReactDemo() {
  const childRef = useRef<ChildComponentRef>(null);
  // 调用子组件的方法
  const handleCallChildMethod = () => {
    if (childRef.current) {
      childRef.current.childMethod();
    }
  };
  return (
    <div className="w-60">
      <h3>父组件通过ref调用子组件方法</h3>
      <Button onClick={handleCallChildMethod}>调用子组件方法</Button>
      <ChildComponent ref={childRef} aa="sdfsd" />
    </div>
  );
}
export default ReactDemo;

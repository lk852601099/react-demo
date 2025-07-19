import type { InputRef } from 'antd';
import { Input } from 'antd';
import { forwardRef, useImperativeHandle, useRef } from 'react';
interface ChildComponentProps {
  aa?: string;
}
const ChildComponent = forwardRef((props: ChildComponentProps, ref) => {
  const inputRef = useRef<InputRef>(null);
  // 定义子组件的方法
  const childMethod = () => {
    inputRef.current?.focus(); // 让输入框获得焦点
  };
  // 使用 useImperativeHandle 将子组件方法暴露给父组件
  useImperativeHandle(ref, () => ({
    childMethod,
  }));
  return (
    <div>
      <hr className="my-5" />
      <h3>子组件</h3>
      <Input placeholder="这是子组件的输入框" ref={inputRef} />
    </div>
  );
});
export default ChildComponent;

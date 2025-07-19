import React from 'react';
import Child from './Child';
export default class Parent extends React.Component {
  constructor(props) {
    super(props);
    console.log('父组件构造函数');
  }
  static getDerivedStateFromProps() {
    console.log('父组件getDerivedStateFromProps');
  }
  componentDidMount() {
    console.log('父组件挂载完成');
  }
  shouldComponentUpdate() {
    console.log('shouldComponentUpdate');
    return true; // 返回true表示组件可以更新
  }
  static getSnapshotBeforeUpdate() {
    console.log('getSnapshotBeforeUpdate');
    return null; // 返回值会作为参数传递给componentDidUpdate
  }
  componentDidUpdate() {
    console.log('componentDidUpdate');
  }
  componentWillUnmount() {
    console.log('父组件卸载');
  }

  render() {
    console.log('父组件渲染');
    return (
      <div>
        <h1>父组件</h1>
        <Child />
      </div>
    );
  }
}

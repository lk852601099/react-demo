import React from 'react';

export default class Child extends React.Component {
  constructor(props) {
    super(props);
    console.log('子组件构造函数');
  }
  static getDerivedStateFromProps() {
    console.log('子组件 getDerivedStateFromProps');
  }
  componentDidMount() {
    console.log('子组件挂载完成');
  }
  shouldComponentUpdate() {
    console.log('子组件 shouldComponentUpdate');
    return true; // 返回true表示组件可以更新
  }
  getSnapshotBeforeUpdate() {
    console.log('子组件 getSnapshotBeforeUpdate');
    return null; // 返回值会作为参数传递给componentDidUpdate
  }
  componentDidUpdate() {
    console.log('子组件 componentDidUpdate');
  }
  componentWillUnmount() {
    console.log('子组件卸载');
  }
  render() {
    console.log('子组件渲染');
    return <h2>子组件</h2>;
  }
}

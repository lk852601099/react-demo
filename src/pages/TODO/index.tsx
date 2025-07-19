import { Button, Checkbox, Input, Segmented } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
interface TableList {
  key: number;
  text: string;
  checked: boolean;
  del: false;
}
const TodoList: React.FC = () => {
  const [inputV, setInputV] = useState<string>('');
  const [alignValue, setAlignValue] = useState<string>('');
  const [tableList, setTableList] = useState<TableList[]>([]);
  const [deepTableList, setDeepTableList] = useState<TableList[]>([]);
  const [channel] = useState(() => new BroadcastChannel('profiler'));
  useEffect(() => {
    return () => {
      channel.close();
    };
  }, []);
  // 添加内容
  const addTodoList = useCallback(() => {
    if (!inputV.trim()) {
      return;
    }
    setTableList([
      ...tableList,
      { key: Date.now(), text: inputV, checked: false, del: false },
    ]);
    channel.postMessage(inputV);
    setInputV('');
    setDeepTableList([
      ...deepTableList,
      { key: Date.now(), text: inputV, checked: false, del: false },
    ]);
  }, [inputV, channel]);
  // 删除
  const delTodo = (key: number) => {
    setTableList(
      [...tableList].filter(
        (item: { key: number; del: boolean }) => item.key !== key,
      ),
    );
    setDeepTableList(
      [...deepTableList].map((item: { key: number; del: boolean }) => {
        if (item.key === key) {
          return {
            ...item,
            del: true,
          };
        }
        return item;
      }) as TableList[],
    );
  };

  // 筛选
  const changeCheck = (checked: boolean, key: number) => {
    const newArr = [...tableList].map(
      (item: { key: number; checked: boolean }) => {
        if (item.key === key) {
          return {
            ...item,
            checked,
          };
        }
        return item;
      },
    );
    setTableList([...newArr] as TableList[]);
    setDeepTableList(
      [...deepTableList].map((item: { key: number; checked: boolean }) => {
        if (item.key === key) {
          return {
            ...item,
            checked,
          };
        }
        return item;
      }) as TableList[],
    );
  };

  const changeAlignValue = (value: string) => {
    setAlignValue(value);
    if (value === '已完成') {
      setTableList(
        [...deepTableList].filter((item) => item.checked && !item.del),
      );
    } else if (value === '未完成') {
      setTableList(
        [...deepTableList].filter((item) => !item.checked && !item.del),
      );
    } else if (value === '已删除') {
      setTableList([...deepTableList].filter((item) => item.del));
    } else {
      setTableList([...[...deepTableList]]);
    }
  };
  return (
    <>
      <h3>TodoList</h3>
      <div style={{ width: '20%' }}>
        <div style={{ display: 'flex' }}>
          <Input value={inputV} onChange={(e) => setInputV(e.target.value)} />
          <Button type="primary" onClick={addTodoList}>
            添加
          </Button>
        </div>
        <Segmented
          value={alignValue}
          style={{ margin: '8px 0' }}
          onChange={changeAlignValue}
          options={['已完成', '未完成', '已删除']}
        />
      </div>
      {tableList.map(
        (item: { key: number; text: string; checked: boolean }) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBlockStart: 8,
            }}
            key={item.key}
          >
            <Checkbox
              checked={item.checked}
              key={item.key}
              onChange={(e) => changeCheck(e.target.checked, item.key)}
            />
            <span
              style={{
                marginInline: 8,
                textDecoration: item.checked ? 'line-through' : '',
              }}
            >
              {item.text}
            </span>
            <Button
              onClick={() => delTodo(item.key)}
              hidden={alignValue === '已删除'}
            >
              删除
            </Button>
          </div>
        ),
      )}
    </>
  );
};

export default TodoList;

import { Button, Checkbox, Input, Segmented } from 'antd';
import React, { useCallback, useState } from 'react';
interface TableList {
  key: number;
  text: string;
  checked: boolean;
  del: false;
}

interface TableObj {
  [key: string]: TableList[];
}

const segmentOptions = [
  {
    label: '已完成',
    value: 'complete',
  },
  {
    label: '未完成',
    value: 'incomplete',
  },
  {
    label: '已删除',
    value: 'del',
  },
];
const TodoList: React.FC = () => {
  const [inputV, setInputV] = useState<string>('');
  const [alignValue, setAlignValue] = useState<string>('incomplete');
  const [tableObj, setTableObj] = useState<TableObj>({
    complete: [],
    incomplete: [],
    del: [],
  });
  const [channel] = useState(() => new BroadcastChannel('profiler'));

  // 添加内容
  const addTodoList = useCallback(() => {
    if (!inputV.trim()) return;
    setTableObj((prev) => ({
      ...prev,
      incomplete: [
        ...(prev.incomplete || []),
        { key: Date.now(), text: inputV, checked: false, del: false },
      ],
    }));
    setInputV('');
  }, [inputV, channel]);

  // 删除
  const dealTodo = (key: number, type: string) => {
    // const prev = JSON.parse(JSON.stringify(tableObj));
    setTableObj((prev: any) => {
      const updatedList = (prev[alignValue] || []).filter(
        (item: { key: number }) => item.key === key,
      );
      console.log('updatedList', updatedList);
      if (type === 'del') {
        // 如果是已完成，删除已完成的内容
        if (alignValue === 'complete') {
          return {
            ...prev,
            complete: prev.complete.filter(
              (item: { key: number }) => item.key !== key,
            ),
            del: [
              ...prev.del,
              ...updatedList.map((item: { del: boolean }) => ({
                ...item,
                del: true,
              })),
            ],
          };
        }
        // 如果是未完成，删除未完成的内容
        if (alignValue === 'incomplete') {
          return {
            ...prev,
            incomplete: prev.incomplete.filter(
              (item: { key: number }) => item.key !== key,
            ),
            del: [
              ...prev.del,
              ...updatedList.map((item: { del: boolean }) => ({
                ...item,
                del: true,
              })),
            ],
          };
        }
      } else {
        // 恢复 如果是未完成
        const dealItem = prev.del.find(
          (item: { key: number }) => item.key === key,
        );
        const filterDel = prev.del.filter(
          (item: { key: number }) => item.key !== key,
        );
        dealItem.del = false;

        if (dealItem?.checked) {
          prev.complete = [...prev.complete, dealItem];
        } else {
          prev.incomplete = [...prev.incomplete, dealItem];
        }
        console.log('dealItem', dealItem, filterDel, {
          ...prev,
          del: filterDel,
        });
        return {
          ...prev,
          del: filterDel,
        };
      }
    });
  };

  // 筛选
  const changeCheck = (checked: boolean, key: number) => {
    // const prev = JSON.parse(JSON.stringify(tableObj));
    setTableObj((prev: any) => {
      // 未完成 -> 已完成
      const updatedList = (prev[alignValue] || []).map(
        (item: { key: number }) => {
          if (item.key !== key) return item;
          return { ...item, checked };
        },
      );
      // 如果是已完成，删除已完成的内容
      if (alignValue === 'complete') {
        const checkComplete = updatedList.filter(
          (item: { checked: boolean }) => !item.checked,
        );

        const newIncomplete = [...prev.incomplete, ...checkComplete];
        return {
          ...prev,
          complete: updatedList.filter(
            (item: { checked: boolean }) => item.checked,
          ),
          incomplete: newIncomplete || [],
        };
      }
      // 如果是未完成，删除已完成的内容 添加已完成的内容到已完成列表
      if (alignValue === 'incomplete') {
        const checkComplete = updatedList.filter(
          (item: { checked: boolean }) => item.checked,
        );

        const newComplete = [...prev.complete, ...checkComplete];

        return {
          ...prev,
          incomplete: updatedList.filter(
            (item: { checked: boolean }) => !item.checked,
          ),
          complete: newComplete || [],
        };
      }
      // 如果是已删除，删除已删除的内容
      if (alignValue === 'del') {
        // 恢复已删除的内容
        const restoredDelItem = prev.del.find(
          (item: { key: number }) => item.key === key,
        );
        const filterDel = prev.del.filter(
          (item: { key: number }) => item.key !== key,
        );
        restoredDelItem.checked = checked;
        if (checked) {
          return {
            ...prev,
            del: filterDel,
            complete: [...prev.complete, restoredDelItem],
          };
        }

        return {
          ...prev,
          del: filterDel,
          incomplete: [...prev.incomplete, restoredDelItem],
        };
      }
    });
  };

  const changeAlignValue = (value: string) => setAlignValue(value);

  return (
    <>
      <h3>TodoList</h3>
      <div style={{ width: '20%' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input value={inputV} onChange={(e) => setInputV(e.target.value)} />
          <Button type="primary" onClick={addTodoList}>
            添加
          </Button>
        </div>
        <Segmented
          value={alignValue}
          style={{ margin: '8px 0' }}
          onChange={changeAlignValue}
          options={segmentOptions}
        />
      </div>
      {(tableObj[alignValue] || []).map(
        (item: {
          key: number;
          text: string;
          checked: boolean;
          del: boolean;
        }) => (
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
            {item.del ? (
              <Button onClick={() => dealTodo(item.key, 'restore')}>
                恢复
              </Button>
            ) : (
              <Button onClick={() => dealTodo(item.key, 'del')}>删除</Button>
            )}
          </div>
        ),
      )}
    </>
  );
};

export default TodoList;

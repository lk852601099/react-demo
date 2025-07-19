import { Button, Input, Tag } from 'antd';
import React, { Fragment, useMemo, useState } from 'react';
import { originList } from './data';
interface DataItem {
  id: string;
  label: string;
  text: string;
}

const { TextArea } = Input;
const Demo: React.FC = () => {
  const [dataList, setDataList] = useState(originList);
  const [selectList, setSelectList] = useState<DataItem[]>([]);
  // 已保存的分组
  const [savedGroups, setSavedGroups] = useState<DataItem[][]>([]);
  // 分类
  const grounpBy = useMemo(() => {
    const sortDataList = dataList.sort((a, b) =>
      a?.label?.localeCompare(b?.label, 'zh-Hans-CN'),
    );
    console.log('sdfsdfsd', sortDataList);
    return sortDataList.reduce(
      (acc: { [label: string]: DataItem[] }, user: any) => {
        if (!acc[user.label]) {
          acc[user.label] = [];
        }
        acc[user.label].push(user);
        return acc;
      },
      {},
    );
  }, [dataList]);

  // 检查项是否已被保存
  const isItemSaved = (item: DataItem) => {
    return savedGroups.some((group) => group.some((i) => i.id === item.id));
  };

  const clickTag = (item: DataItem) => {
    // const newData = [...selectList];
    // const idx = newData.findIndex(
    //   (items: { id: string }) => items.id === item.id,
    // );
    // if (idx >= 0) {
    //   newData.splice(idx, 1);
    // } else {
    //   newData.push(item);
    // }
    // setSelectList(newData);
    if (isItemSaved(item)) return;

    setSelectList((prev: DataItem[]) => {
      // 切换选中状态
      const exists = prev.some((i) => i.id === item.id);
      return exists ? prev.filter((i) => i.id !== item.id) : [...prev, item];
    });
  };

  /** 保存选中 */
  const save = () => {
    if (selectList.length === 0) return;

    setDataList((prev) => {
      const idsToRemove = selectList.map((item: { id: string }) => item.id);
      return prev.filter((items) => !idsToRemove.includes(items.id));
    });

    setSavedGroups((prev) => [...prev, selectList]);
    setSelectList([]);
  };

  /** 取消选中 */
  const cancelSave = () => {
    setDataList([...originList]);
    setSavedGroups([]);
    setSelectList([]);
  };
  // useEffect(() => {
  //   console.log('dataList', dataList)
  // }, [dataList])

  // 清空文本框内容
  const clearTextArea = (key?: number) => {
    if (key === undefined) {
      setSelectList([]);
      return;
    }
    const aa = [...savedGroups];
    const bb = aa.filter((_, idx) => idx === key);
    setSavedGroups((prev) => prev.filter((_, idx) => idx !== key));

    // const cc = [...dataList];
    // const dd = cc.concat(...bb);
    // console.log('dddd', dd, cc, ...bb)
    // setDataList([...dd]);
    setDataList((prev: DataItem[]) => {
      console.log('prev', prev, ...bb, prev.concat(...bb));
      return prev.concat(...bb);
    });
  };

  return (
    <Fragment>
      <div style={{ marginBlockEnd: 8 }}>
        <Button type="primary" style={{ marginInlineEnd: 8 }} onClick={save}>
          保存选中
        </Button>
        <Button onClick={cancelSave}>取消选中</Button>
        <div style={{ display: 'flex', marginBlockStart: 8 }}>
          {savedGroups.map((group, index) => (
            <TextArea
              key={index}
              allowClear
              value={group.map((item: DataItem) => item.text).join(', ')}
              style={{ width: '40%', marginInlineEnd: 8 }}
              onClear={() => clearTextArea(index)}
            />
          ))}
          {selectList.length ? (
            <TextArea
              allowClear
              value={selectList.map((item: DataItem) => item.text).join(', ')}
              onClear={() => clearTextArea()}
              style={{ width: '40%' }}
            />
          ) : null}
        </div>
      </div>
      {Object.keys(grounpBy).map((item: any) => {
        return (
          <div key={item}>
            <h2>{item}</h2>
            {grounpBy[item].map((content: DataItem) => (
              <Tag
                key={content.id}
                color={
                  selectList.findIndex(
                    (item: { id: string }) => item.id === content.id,
                  ) > -1
                    ? 'error'
                    : ''
                }
                style={{ marginBlockEnd: 4, cursor: 'pointer' }}
                onClick={() => clickTag(content)}
              >
                {content.text}
              </Tag>
            ))}
          </div>
        );
      })}
    </Fragment>
  );
};
export default Demo;

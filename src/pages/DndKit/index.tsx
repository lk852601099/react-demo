import { DeleteOutlined } from '@ant-design/icons';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Button,
  Card,
  Divider,
  Input,
  Layout,
  List,
  Radio,
  Segmented,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import './index.less';

const { Sider, Content } = Layout;
const { Title } = Typography;
// 定义可选的 colSpan 类型
type ColSpanType = '1/4' | '1/2' | '1/3' | '2/3' | '1';
// 字段定义
const fieldList: {
  id: string;
  label: string;
  value: string;
  colSpan: ColSpanType;
}[] = [
  { id: 'name', label: '名称', value: '张三', colSpan: '1/2' },
  { id: 'address', label: '地址', value: '北京', colSpan: '1/4' },
  { id: 'email', label: '邮箱', value: 'test@example.com', colSpan: '1' },
  { id: 'phone', label: '电话', value: '13800000000', colSpan: '1/3' },
];

const btnComponent = [
  { id: 'layout', label: '页面布局' },
  { id: 'print', label: '打印' },
  { id: 'export', label: '到处组件' },
];

// 拖拽到中间栏的组件类型
// type DroppedItem = {
//   uuid: string;
//   field: string;
//   label: string;
//   value: string;
//   colSpan: ColSpanType;
// };

// 1. 新增 DroppedItem 类型支持按钮
type DroppedItem = {
  uuid: string;
  type: 'field' | 'button';
  field?: string;
  label: string;
  value?: string;
  colSpan?: ColSpanType;
  btnId?: string;
};

// 2. 新建可拖拽按钮组件
const DraggableBtn: React.FC<{ btn: (typeof btnComponent)[number] }> = ({
  btn,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `btn-${btn.id}`,
    data: { ...btn, type: 'button' },
  });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        marginBottom: 8,
        width: '100%',
      }}
    >
      <Card size="small" bordered>
        <div>{btn.label}</div>
      </Card>
    </div>
  );
};
function uuid() {
  return Math.random().toString(36).slice(2) + Date.now();
}

// 左侧栏可拖拽项
const DraggableField: React.FC<{ field: (typeof fieldList)[number] }> = ({
  field,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: field.id,
    data: field,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        marginBottom: 8,
        width: '100%',
      }}
    >
      <Card size="small" bordered>
        <div>{field.label}</div>
      </Card>
    </div>
  );
};

// 中间栏可排序可拖拽项
// const SortableItem: React.FC<{
//   item: DroppedItem;
//   selected: boolean;
//   onClick: () => void;
//   onValueChange: (v: string) => void;
//   onDelete: () => void;
// }> = ({ item, selected, onClick, onValueChange, onDelete }) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({
//     id: item.uuid,
//   });

//   const styleProps: React.CSSProperties = {
//     borderRadius: 6,
//     background: '#fff',
//     padding: '2px 8px',
//     minHeight: 28,
//     height: 48,
//     marginBottom: 8,
//     cursor: 'grab',
//     display: 'flex',
//     alignItems: 'center',
//     gap: 8,
//     position: 'relative',
//     transition,
//   };
//   const [hovered, setHovered] = React.useState(false);

//   const borderStyle = (
//     selected: boolean,
//     hovered: boolean,
//     isDragging: boolean,
//   ) => {
//     if (selected) {
//       return isDragging ? '2px solid transparent' : '2px solid #1890ff';
//     }
//     if (hovered) {
//       return '2px dashed #1890ff';
//     }
//     return isDragging ? '1px solid transparent' : '1px solid #ccc';
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={{
//         ...styleProps,
//         transform: CSS.Transform.toString(transform),
//         opacity: isDragging ? 0 : 1, // 拖拽时原位置完全透明
//         zIndex: isDragging ? 100 : 'auto',
//         border: borderStyle(selected, hovered, isDragging),
//         boxShadow: selected && !isDragging ? '0 0 8px #1890ff44' : 'none',
//       }}
//       onClick={(e) => {
//         e.stopPropagation();
//         onClick();
//       }}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       <span
//         style={{ minWidth: 48, userSelect: 'none', cursor: 'grab' }}
//         {...attributes}
//         {...listeners}
//       >
//         {item.label}：
//       </span>
//       <Input
//         value={item.value}
//         onChange={(e) => onValueChange(e.target.value)}
//         style={{ flex: 1 }}
//         onClick={(e) => e.stopPropagation()}
//       />
//       {selected && (
//         <DeleteOutlined
//           style={{
//             color: '#ff4d4f',
//             fontSize: 18,
//             marginLeft: 8,
//             cursor: 'pointer',
//           }}
//           onClick={(e) => {
//             e.stopPropagation();
//             onDelete();
//           }}
//         />
//       )}
//     </div>
//   );
// };

// const SortableButton: React.FC<{
//   item: DroppedItem;
//   selected: boolean;
//   onClick: () => void;
//   onDelete: () => void;
// }> = ({ item, selected, onClick, onDelete }) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({
//     id: item.uuid,
//   });

//   return (
//     <div
//       ref={setNodeRef}
//       {...attributes}
//       {...listeners}
//       style={{
//         flex: 1,
//         display: 'flex',
//         alignItems: 'center',
//         height: '100%',
//         background: selected ? '#e6f7ff' : '#fff',
//         borderRadius: 6,
//         marginBottom: 8,
//         border: selected ? '2px solid #1890ff' : '1px solid #ccc',
//         padding: '0 8px',
//         position: 'relative',
//         boxShadow: selected && !isDragging ? '0 0 8px #1890ff44' : 'none',
//         opacity: isDragging ? 0 : 1,
//         cursor: 'grab',
//         transform: CSS.Transform.toString(transform),
//         transition,
//       }}
//       onClick={(e) => {
//         e.stopPropagation();
//         onClick();
//       }}
//     >
//       <Button
//         style={{
//           flex: 1,
//           background: 'transparent',
//           border: 'none',
//           boxShadow: 'none',
//           cursor: 'grab',
//         }}
//       >
//         {item.label}
//       </Button>
//       {selected && (
//         <DeleteOutlined
//           style={{
//             color: '#ff4d4f',
//             fontSize: 18,
//             marginLeft: 8,
//             cursor: 'pointer',
//           }}
//           onClick={(e) => {
//             e.stopPropagation();
//             onDelete();
//           }}
//         />
//       )}
//     </div>
//   );
// };

// 中间栏可放置区域
const DroppablePanel: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ children, onClick }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'center-panel',
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: 200,
        background: isOver ? '#e6f7ff' : '#fafcff',
        border: '1px dashed #b5b5b5',
        borderRadius: 8,
        padding: 16,
        transition: 'background 0.2s',
        width: '100%',
        height: '100%',
        // 关键：确保 droppable 区域始终撑满父容器
        boxSizing: 'border-box',
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const DndPage: React.FC = () => {
  const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([]);
  const [columns, setColumns] = useState(2); // 中间栏列数
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  // 4. gridColumn 计算函数，按每个 item 的 colSpan 返回百分比
  const getWidthPercent = (colSpan: DroppedItem['colSpan']) => {
    switch (colSpan) {
      case '1/4':
        return '25%';
      case '1/3':
        return '33.33%';
      case '1/2':
        return '50%';
      case '2/3':
        return '66.66%';
      case '1':
      default:
        return '100%';
    }
  };

  // const getGridSpan = (colSpan: DroppedItem['colSpan'], columns: number) => {
  //   switch (colSpan) {
  //     case '1/4':
  //       return Math.max(1, Math.round(columns * 0.25));
  //     case '1/3':
  //       return Math.max(1, Math.round(columns / 3));
  //     case '1/2':
  //       return Math.max(1, Math.round(columns / 2));
  //     case '2/3':
  //       return Math.max(1, Math.round((columns * 2) / 3));
  //     case '1':
  //     default:
  //       return columns;
  //   }
  // };
  // 保证 droppedItems 为空时自动清空 selectedId
  useEffect(() => {
    if (droppedItems.length === 0) {
      setSelectedId(null);
    }
    // 不自动选中，只有点击才选中
  }, [droppedItems]);

  // 拖拽结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    setActiveDragId(null);
    // 新增
    if (
      active &&
      fieldList.some((f) => f.id === active.id) &&
      over &&
      over.id === 'center-panel'
    ) {
      const field = fieldList.find((f) => f.id === active.id);
      if (field) {
        setDroppedItems((items) => [
          ...items,
          {
            uuid: uuid(),
            type: 'field', // 修复：加上 type 字段
            field: field.id,
            label: field.label,
            value: field.value,
            colSpan: field.colSpan || '1',
          },
        ]);
      }
      return;
    }
    // 拖拽按钮
    if (
      active &&
      typeof active.id === 'string' &&
      active.id.startsWith('btn-') &&
      over &&
      over.id === 'center-panel'
    ) {
      const btn = btnComponent.find((b) => `btn-${b.id}` === active.id);
      if (btn) {
        setDroppedItems((items) => [
          ...items,
          {
            uuid: uuid(),
            type: 'button',
            label: btn.label,
            btnId: btn.id,
          },
        ]);
      }
      return;
    }
    // 排序
    if (
      over &&
      active.id !== over.id &&
      droppedItems.some((i) => i.uuid === active.id) &&
      droppedItems.some((i) => i.uuid === over.id)
    ) {
      const oldIndex = droppedItems.findIndex((i) => i.uuid === active.id);
      const newIndex = droppedItems.findIndex((i) => i.uuid === over.id);
      setDroppedItems((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  // 拖拽开始
  const handleDragStart = (event: any) => {
    setActiveDragId(event.active.id);
    setSelectedId(null); // 清除选中状态
  };

  // 属性调整
  const handlePropertyChange = (
    uuid: string,
    key: 'label' | 'value' | 'colSpan',
    value: string,
  ) => {
    setDroppedItems((items) =>
      items.map((item) =>
        item.uuid === uuid ? { ...item, [key]: value } : item,
      ),
    );
  };

  const SortableBox: React.FC<{
    item: DroppedItem;
    selected: boolean;
    onClick: () => void;
    onValueChange?: (v: string) => void;
    onDelete: () => void;
  }> = ({ item, selected, onClick, onValueChange, onDelete }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useSortable({
        id: item.uuid,
      });
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{
          width:
            item.type === 'field' ? getWidthPercent(item.colSpan!) : '120px',
          minWidth: 120,
          boxSizing: 'border-box',
          position: 'relative',
          marginBottom: 8,
          borderRadius: 8,
          border: selected ? '2px solid #1890ff' : '1px solid #ccc',
          boxShadow: selected ? '0 0 8px #1890ff44' : 'none',
          background: selected ? 'pink' : '#fff',
          transition: 'border 0.2s, box-shadow 0.2s, background 0.2s',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          height: 48,
          zIndex: isDragging ? 100 : 'auto',
          transform: CSS.Transform.toString(transform),
          opacity: isDragging ? 0.5 : 1, // 拖拽时降低透明度
          cursor: isDragging ? 'grabbing' : 'grab', // 更改光标样式
          // ...transition,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
          console.log('Clicked item:', item);
        }}
      >
        {/* 删除图标，左上角绝对定位，只有选中时显示 */}
        {selected && (
          <DeleteOutlined
            style={{
              position: 'absolute',
              top: -10,
              left: -10,
              background: '#fff',
              borderRadius: '50%',
              boxShadow: '0 2px 8px #0001',
              color: '#ff4d4f',
              fontSize: 18,
              zIndex: 999, // 提高层级
              border: '1px solid #eee',
              opacity: isDragging ? 0 : 1, // 拖拽时隐藏删除图标
              cursor: isDragging ? 'not-allowed' : 'pointer',
            }}
            onClick={(e) => {
              if (isDragging) return; // 拖拽中禁止删除
              e.stopPropagation();
              onDelete();
            }}
          />
        )}
        {/* 拖拽内容 */}
        {item.type === 'field' ? (
          <>
            <span style={{ minWidth: 48, userSelect: 'none', cursor: 'grab' }}>
              {item.label}：
            </span>
            <Input
              value={item.value}
              onChange={(e) => onValueChange?.(e.target.value)}
              style={{ flex: 1 }}
              onClick={(e) => e.preventDefault()}
            />
          </>
        ) : (
          // <div
          //   style={{
          //     width: 120,
          //     background: 'pink',
          //     borderRadius: 6,
          //     border: '1px solid #ccc',
          //     padding: 14,
          //   }}
          //   onClick={(e) => {
          //     e.stopPropagation();
          //     onClick();
          //     console.log('Clicked button item:', item);
          //   }}
          // >{item.label}</div>
          <Button
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              cursor: 'grab',
              textAlign: 'left',
            }}
            onClick={(e) => {
              e.preventDefault(); // 仅阻止默认行为
              console.log('Clicked item:', item);

            }}
            // onClick={(e) => {
            //   console.log('Clicked item:', item);
            //   e.stopPropagation();
            //   onClick();
            // }}
          >
            {item.label}
          </Button>
        )}
      </div>
    );
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <Layout className="dnd-layout">
        {/* 左侧栏 */}
        <Sider width={260} theme="light" className="dnd-sider">
          <Title level={4}>字段列表</Title>
          <List
            dataSource={fieldList}
            renderItem={(item) => (
              <List.Item key={item.id} className="dnd-list-item">
                <DraggableField field={item} />
              </List.Item>
            )}
          />
          <Divider />
          <List
            dataSource={btnComponent}
            renderItem={(item) => (
              <List.Item key={item.id} className="dnd-list-item">
                <DraggableBtn btn={item} />
              </List.Item>
            )}
          />
        </Sider>

        {/* 中间栏 */}
        <Content className="dnd-content">
          <DroppablePanel>
            <SortableContext
              items={droppedItems.map((i) => i.uuid)}
              strategy={rectSortingStrategy}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 16,
                  minHeight: 200,
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                // style={{
                //   display: 'grid',
                //   gridTemplateColumns: `repeat(${columns}, 1fr)`,
                //   gap: 16,
                //   minHeight: 200,
                //   width: '100%',
                //   boxSizing: 'border-box',
                // }}
              >
                {droppedItems.length === 0 ? (
                  <div style={{ color: '#bbb', gridColumn: '100%' }}>
                    {/* <div style={{ color: '#bbb', gridColumn: `span ${columns}` }}> */}
                    请从左侧拖拽字段到此区域
                  </div>
                ) : (
                  // droppedItems.map((item) => (
                  //   <div
                  //     key={item.uuid}
                  //     style={{
                  //       width: getWidthPercent(item.colSpan),
                  //       // gridColumn: `span ${getGridSpan(item.colSpan, columns)}`,
                  //       minWidth: 120,
                  //       boxSizing: 'border-box',
                  //     }}
                  //   >
                  //     <SortableItem
                  //       item={item}
                  //       selected={selectedId === item.uuid}
                  //       onClick={() => {
                  //         setSelectedId(item.uuid);
                  //       }}
                  //       onValueChange={(v) =>
                  //         handlePropertyChange(item.uuid, 'value', v)
                  //       }
                  //       onDelete={() =>
                  //         setDroppedItems((items) => {
                  //           const newItems = items.filter(
                  //             (i) => i.uuid !== item.uuid,
                  //           );
                  //           // 如果删除的是当前选中项，清空选中
                  //           if (selectedId === item.uuid) {
                  //             setSelectedId(null);
                  //           }
                  //           return newItems;
                  //         })
                  //       }
                  //     />
                  //   </div>
                  // ))
                  droppedItems.map((item) => (
                    <SortableBox
                      key={item.uuid}
                      item={item}
                      selected={selectedId === item.uuid}
                      onClick={() => setSelectedId(item.uuid)}
                      onValueChange={(v) =>
                        handlePropertyChange(item.uuid, 'value', v)
                      }
                      onDelete={() =>
                        setDroppedItems((items) => {
                          const newItems = items.filter(
                            (i) => i.uuid !== item.uuid,
                          );
                          if (selectedId === item.uuid) setSelectedId(null);
                          return newItems;
                        })
                      }
                    />
                    // <div
                    //   key={item.uuid}
                    //   style={{
                    //     width:
                    //       item.type === 'field'
                    //         ? getWidthPercent(item.colSpan!)
                    //         : '120px',
                    //     minWidth: 120,
                    //     boxSizing: 'border-box',
                    //     display: 'flex',
                    //     alignItems: 'center',
                    //     height: 48,
                    //     background: '#fff',
                    //     borderRadius: 6,
                    //     marginBottom: 8,
                    //     border: '1px solid #ccc',
                    //     padding: '0 8px',
                    //     position: 'relative',
                    //   }}
                    // >
                    //   {item.type === 'field' ? (
                    //     <SortableItem
                    //       item={item as any}
                    //       selected={selectedId === item.uuid}
                    //       onClick={() => setSelectedId(item.uuid)}
                    //       onValueChange={(v) =>
                    //         handlePropertyChange(item.uuid, 'value', v)
                    //       }
                    //       onDelete={() =>
                    //         setDroppedItems((items) => {
                    //           const newItems = items.filter(
                    //             (i) => i.uuid !== item.uuid,
                    //           );
                    //           if (selectedId === item.uuid) setSelectedId(null);
                    //           return newItems;
                    //         })
                    //       }
                    //     />
                    //   ) : (
                    //     // <Card
                    //     //   size="small"
                    //     //   bordered
                    //     //   style={{
                    //     //     height: 48,
                    //     //     display: 'flex',
                    //     //     alignItems: 'center',
                    //     //     justifyContent: 'center',
                    //     //   }}
                    //     // >
                    //     <SortableButton
                    //       item={item}
                    //       selected={selectedId === item.uuid}
                    //       onClick={() => setSelectedId(item.uuid)}
                    //       onDelete={() =>
                    //         setDroppedItems((items) => {
                    //           const newItems = items.filter(
                    //             (i) => i.uuid !== item.uuid,
                    //           );
                    //           if (selectedId === item.uuid) setSelectedId(null);
                    //           return newItems;
                    //         })
                    //       }
                    //     />
                    //     // </Card>
                    //   )}
                    // </div>
                  ))
                )}
              </div>
            </SortableContext>
          </DroppablePanel>
        </Content>

        {/* 右侧栏 */}
        <Sider width={340} theme="light" className="dnd-sider-right">
          {/* 只有中间栏有元素且选中某项时才展示属性调整 */}
          {droppedItems.length > 0 && selectedId ? (
            (() => {
              const item = droppedItems.find((i) => i.uuid === selectedId);
              if (!item) return null;
              return (
                <>
                  <Title level={4}>属性调整</Title>
                  <div className="dnd-property">
                    <span>列宽</span>
                    <Segmented
                      options={[
                        { label: '1/4', value: '1/4' },
                        { label: '1/2', value: '1/2' },
                        { label: '1/3', value: '1/3' },
                        { label: '2/3', value: '2/3' },
                        { label: '1', value: '1' },
                      ]}
                      value={item.colSpan || '1'}
                      onChange={(v) =>
                        handlePropertyChange(item.uuid, 'colSpan', v as string)
                      }
                      style={{ width: 220 }}
                    />
                  </div>
                  <div className="dnd-property">
                    <span>字段名</span>
                    <Input
                      value={item.label}
                      onChange={(e) =>
                        handlePropertyChange(item.uuid, 'label', e.target.value)
                      }
                    />
                  </div>
                  <div className="dnd-property">
                    <span>值</span>
                    <Input
                      value={item.value}
                      onChange={(e) =>
                        handlePropertyChange(item.uuid, 'value', e.target.value)
                      }
                    />
                  </div>
                </>
              );
            })()
          ) : (
            <>
              <Title level={4}>页面调整</Title>
              <div style={{ marginBottom: 24 }}>
                <span>中间栏列数：</span>
                <Radio.Group
                  value={columns}
                  onChange={(e) => setColumns(e.target.value)}
                  optionType="button"
                  buttonStyle="solid"
                >
                  <Radio.Button value={1}>1</Radio.Button>
                  <Radio.Button value={2}>2</Radio.Button>
                  <Radio.Button value={3}>3</Radio.Button>
                  <Radio.Button value={4}>4</Radio.Button>
                </Radio.Group>
              </div>
            </>
          )}
        </Sider>
        {/* 拖拽覆盖层 */}
        <DragOverlay>
          {activeDragId
            ? (() => {
                // 拖拽左侧字段时
                const field = fieldList.find((f) => f.id === activeDragId);
                const isBtn = btnComponent.find(
                  (b) => `btn-${b.id}` === activeDragId,
                );
                // console.log('activeDragId', field);
                if (field) {
                  return (
                    <Card size="small" bordered className="dnd-drag-overlay">
                      <span>{field.label}</span>
                    </Card>
                  );
                }
                if (isBtn) {
                  return (
                    <Button style={{ width: '100%' }}>{isBtn.label}</Button>
                  );
                }
                // 拖拽中间元素时
                const item = droppedItems.find((i) => i.uuid === activeDragId);
                const isButton = item?.type === 'button';
                if (item) {
                  if (isButton) {
                    return (
                      <Button style={{ width: '100%' }}>{item.label}</Button>
                    );
                  }
                  return (
                    <div
                      className="dnd-drag-overlay-item"
                      style={{
                        border: '2px solid #1890ff',
                        borderRadius: 8,
                        background: '#fff',
                        padding: 16,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        opacity: 0.95,
                        minWidth: 120,
                        boxShadow: '0 4px 16px 0 #1890ff55',
                      }}
                    >
                      <span style={{ minWidth: 48 }}>{item.label}：</span>
                      <Input
                        size="small"
                        value={item.value}
                        readOnly
                        style={{ flex: 1 }}
                      />
                    </div>
                  );
                }
                return null;
              })()
            : null}
        </DragOverlay>
      </Layout>
    </DndContext>
  );
};

export default DndPage;

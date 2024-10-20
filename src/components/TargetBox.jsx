import React, { useState } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import DroppedItem from './DroppedItem';

const GRID_SIZE = 30;
const BOX_SIZE = 800;

export function StatefulTargetBox({ onDrop, items,setItems, updateItemPosition, isDragging, setIsDragging }) {
  const [isResizing, setIsResizing] = useState(false);
  
  const boundPosition = (x, y) => {
    const maxX = BOX_SIZE - 10 * GRID_SIZE;
    const maxY = BOX_SIZE - 2 * GRID_SIZE;
    return {
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY)),
    };
  };
  

  const handleDrop = (item, monitor) => {
    const delta = monitor.getDifferenceFromInitialOffset();
    const containerRect = document.querySelector('.target-box').getBoundingClientRect();
     // const offset = monitor.getClientOffset();
    // const x = Math.round((offset.x - containerRect.left) / GRID_SIZE) * GRID_SIZE;
    // const y = Math.round((offset.y - containerRect.top) / GRID_SIZE) * GRID_SIZE;
    const x = Math.round((delta.x-containerRect.left) / GRID_SIZE) * GRID_SIZE;
    const y = Math.round((delta.y-containerRect.top) / GRID_SIZE) * GRID_SIZE;
    
    const { x: boundedX, y: boundedY } = boundPosition(x, y);

    if (item.id) {
      updateItemPosition(item.id, { x: delta.x, y: delta.y });
    } else {
      onDrop(item, { x: boundedX, y: boundedY });
    }
  };

  const [, drop] = useDrop(() => ({
    accept: ['INPUT', 'DROPPED_ITEM'],
    drop: handleDrop,
  }), [onDrop, updateItemPosition]);

  const updateSize = (id, newSize) => {
 
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          console.log(newSize)
          return { ...item, size: newSize };
        }
        return item;
      })
    );
  };

  return (
    <div 
      ref={drop} 
      className="target-box relative" 
      style={{ 
        width: BOX_SIZE, 
        height: BOX_SIZE, 
        border: '1px solid black',
        backgroundImage: (isDragging || isResizing)
          ? 'linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)'
          : 'none',
        backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`
      }}
    >
      {items.map((item) => (
        <DroppedItem 
          key={item.id}
          id={item.id}
          type={item.type}
          position={item.position}
          updatePosition={updateItemPosition}
          setIsDragging={setIsDragging}
          updateSize={updateSize}
          size={item.size}
          setIsResizing={setIsResizing}
        />
      ))}
    </div>
  );
}
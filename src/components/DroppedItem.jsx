import React, { useState, useEffect, useCallback } from 'react';
import { useDrag } from 'react-dnd';

const GRID_SIZE = 30;
const BOX_SIZE = 800;

const ResizeHandle = ({ position, onResize }) => {
  const [, drag] = useDrag(() => ({
    type: 'resize',
    item: { position },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize"
      style={{
        [position]: '-4px',
        bottom: position === 'left' ? '-4px' : 'auto',
        right: position === 'left' ? 'auto' : '-4px',
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onResize(position);
      }}
    />
  );
};

const DroppedItem = ({ id, type, position, updatePosition, setIsDragging, updateSize, setIsResizing: setParentIsResizing }) => {
  const [size, setSize] = useState({ width: GRID_SIZE * 4, height: GRID_SIZE * 2 });
  const [isResizing, setIsResizing] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'DROPPED_ITEM',
    item: { id, type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    setIsDragging(isDragging);
  }, [isDragging, setIsDragging]);

  useEffect(() => {
    setParentIsResizing(isResizing);
  }, [isResizing, setParentIsResizing]);

  const handleResize = (handle) => {
    setIsResizing(true);
  };

  const boundPosition = (x, y) => {
    const maxX = BOX_SIZE - 10 * GRID_SIZE;
    const maxY = BOX_SIZE - 2 * GRID_SIZE;
    return {
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY)),
    };
  };

  const onMouseMove = useCallback(
    (e) => {
      if (isResizing) {
        const containerRect = document.querySelector('.target-box').getBoundingClientRect();
        let newWidth = Math.round((e.clientX - containerRect.left - position.x) / GRID_SIZE) * GRID_SIZE;
        let newHeight = Math.round((e.clientY - containerRect.top - position.y) / GRID_SIZE) * GRID_SIZE;

        // Constrain width and height to stay within box boundaries
        newWidth = Math.min(newWidth, BOX_SIZE - position.x);
        newHeight = Math.min(newHeight, BOX_SIZE - position.y);

        setSize((prevSize) => ({
          width: Math.max(GRID_SIZE * 2, newWidth),
          height: Math.max(GRID_SIZE, newHeight),
        }));
      }
    },
    [isResizing, position.x, position.y]
  );

  const onMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      updateSize(id, size);
    }
  }, [isResizing, id, size, updateSize]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isResizing, onMouseMove, onMouseUp]);

  return (
    <div
      ref={drag}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        opacity: isDragging ? 0.5 : 1,
        cursor: isResizing ? 'nwse-resize' : 'move',
        backgroundImage: isResizing
          ? 'linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)'
          : 'none',
        backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
      }}
    >
      {type === 'text' && (
        <input type="text" placeholder="Enter your name" className="w-full h-full p-2 border rounded" />
      )}
      {type === 'select' && (
        <select className="w-full h-full p-2 border rounded">
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </select>
      )}
      {type === 'picture' && (
        <img src="vite.svg" alt="Dropped image" className="w-full h-full object-fill" />
      )}
      <ResizeHandle position="right" onResize={handleResize} />
      <ResizeHandle position="left" onResize={handleResize} />
    </div>
  );
};

export default DroppedItem;

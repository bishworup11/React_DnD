import { memo, useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { StatefulTargetBox as TargetBox } from "./TargetBox.jsx";
import { TextInput, SelectInput, PictureInput } from "./DraggableInput.jsx";

const GRID_SIZE = 30;
const BOX_SIZE = 800;

export const Container = memo(function Container() {
  const [items, setItems] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDrop = useCallback((item, position) => {
    const id = Date.now();
    const newItem = { 
      ...item, 
      id, 
      position,
      size: { width: GRID_SIZE * 4, height: GRID_SIZE * 2 } // Default size
    };
    setItems((prevItems) => [...prevItems, newItem]);
  }, []);

  const boundPosition = useCallback((x, y, width, height) => {
    const maxX = BOX_SIZE - width;
    const maxY = BOX_SIZE - height;
    return {
      x: Math.max(0, Math.min(Math.round(x / GRID_SIZE) * GRID_SIZE, maxX)),
      y: Math.max(0, Math.min(Math.round(y / GRID_SIZE) * GRID_SIZE, maxY)),
    };
  }, []);

  const updateItemPosition = useCallback((id, delta) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newX = item.position.x + delta.x;
          const newY = item.position.y + delta.y;
          const { x, y } = boundPosition(newX, newY, item.size.width, item.size.height);
          return { ...item, position: { x, y } };
        }
        return item;
      })
    );
  }, [boundPosition]);

  const updateItemSize = useCallback((id, newSize) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const boundedSize = {
            width: Math.min(newSize.width, BOX_SIZE - item.position.x),
            height: Math.min(newSize.height, BOX_SIZE - item.position.y)
          };
          const { x, y } = boundPosition(item.position.x, item.position.y, boundedSize.width, boundedSize.height);
          return { ...item, size: boundedSize, position: { x, y } };
        }
        return item;
      })
    );
  }, [boundPosition]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-row flex-wrap overflow-hidden clear-both h-svh">
        <div className="w-1/5 bg-indigo-400 p-5 space-y-4">
          <TextInput setIsDragging={setIsDragging} />
          <SelectInput setIsDragging={setIsDragging} />
          <PictureInput setIsDragging={setIsDragging} />
        </div>
        <div className="w-3/4 bg-indigo-300 ml-4 mt-2">
          <TargetBox
            onDrop={handleDrop}
            items={items}
            setItems={setItems}
            updateItemPosition={updateItemPosition}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
          />
        </div>
      </div>
    </DndProvider>
  );
});

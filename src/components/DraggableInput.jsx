import React from "react";
import { useDrag } from "react-dnd";

const DraggableItem = ({ type, children, setIsDragging }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "INPUT",
    item: () => ({ type }), 
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  React.useEffect(() => {
    setIsDragging(isDragging);
  }, [isDragging, setIsDragging]);

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}>
      {children}
    </div>
  );
};

export function TextInput({ setIsDragging }) {
  return (
    <DraggableItem type="text" setIsDragging={setIsDragging}>
      <input
        type="text"
        placeholder="Enter your name"
        className="p-2 border rounded"
      />
    </DraggableItem>
  );
}

export function SelectInput({ setIsDragging }) {
  return (
    <DraggableItem type="select" setIsDragging={setIsDragging}>
      <select className="p-2 border rounded">
        <option>Option 1</option>
        <option>Option 2</option>
        <option>Option 3</option>
      </select>
    </DraggableItem>
  );
}

export function PictureInput({ setIsDragging }) {
  return (
    <DraggableItem type="picture" setIsDragging={setIsDragging}>
      <img
        src="vite.svg"
        alt="Draggable picture"
        className="border rounded"
        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
      />
    </DraggableItem>
  );
}
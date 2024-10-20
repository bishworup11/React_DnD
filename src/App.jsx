import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Container } from "./components/Container";


function App() {

  return (
    <DndProvider backend={HTML5Backend}> 
      <Container/>
     
    </DndProvider>
  );
}

export default App;





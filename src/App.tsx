import { RouterProvider } from "react-router/dom";
import "./App.css";
import Router from "./routes/router";
import { useEffect } from "react";

function App() {
  useEffect(() => {}, []);
  return <RouterProvider router={Router} />;
}

export default App;

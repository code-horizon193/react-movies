import React from "react";
import LandPage from "./components/LandPage";
import NavBar from "./components/NavBar";
import Features from "./components/Features";
import Questions from "./components/Questions";

const App = () => {
  return (
    <div className="w-screen overflow-x-hidden min-h-dvh bg-black relative">
      <NavBar />
      <LandPage />
      <Features />
      <Questions />
    </div>
  );
};

export default App;

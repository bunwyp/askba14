import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SwissHero from "./components/SwissHero";
import BA14Page from "./components/BA14Page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SwissHero />} />
        <Route path="/ba14" element={<BA14Page />} />
      </Routes>
    </Router>
  );
}

export default App;

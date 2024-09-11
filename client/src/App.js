import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Parent from "./Parent.js"
import DataPage from "./DataPage.js"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/data" element={<DataPage />} />
        <Route path="/*" element={<Parent />} />
      </Routes>
    </Router>
  );
}

export default App;


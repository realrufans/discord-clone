import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Header />} />
          <Route exact path="/channels" element={<Home />} />
          <Route exact path="/channels/:id" element={<Home />} />
          <Route exact path="/channels/:id/:id" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

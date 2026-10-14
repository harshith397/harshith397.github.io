import "./App.css";
//import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Home from "./pages/Home.jsx";
import ProjectPage from './pages/ProjectPage.jsx';
import AllProjects from "./pages/AllProjects";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="/projects" element={<AllProjects />} />
      </Routes>
    </Router>
  );
}

export default App


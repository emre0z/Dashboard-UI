import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TittleManagement from './pages/TittleManagement'; // Güncellenmiş dosya adı
import ProjectManagement from './pages/ProjectManagement'; // Güncellenmiş dosya adı
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/title-management" element={<TittleManagement />} />
          <Route path="/project-management" element={<ProjectManagement />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

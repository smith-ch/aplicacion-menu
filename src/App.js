import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import './index.css';

function App() {
  return (
    <div className="mobile-container">
     
        <Router>
          <Layout />
        </Router>
      </div>
  );
}

export default App; 
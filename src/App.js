import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import CallList from './components/CallList';
import CallDetails from './components/CallDetails';
import Login from './components/Login';

const App = () => {
  return (
    <Router>
      <Header />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/calls" element={<CallList />} />
          <Route path="/calls/:id" element={<CallDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

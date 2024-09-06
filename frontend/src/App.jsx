import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Surveys from './components/Surveys';
import AuthCheck from './components/AuthCheck';
import SurveyCreate from './components/SurveyCreate';
import SurveyFill from './components/SurveyFill'
import Profile from './components/Profile.jsx'
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<AuthCheck />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/surveys" element={<Surveys />} />
          <Route path="/create" element={<SurveyCreate />} />
          <Route path="/fill" element={<SurveyFill />} />
          
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;


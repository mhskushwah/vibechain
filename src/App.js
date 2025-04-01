import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import MyTeam from "./components/MyTeam";
import CommunityTree from "./components/CommunityTree";
import CommunityInfo from "./components/CommunityInfo";
import RecentIncome from './components/RecentIncome';
import Navbar from './components/Navbar';
import './components/Navbar.css';  // Agar aap chahein toh styling yahan rakh sakte hain
import Logout from './components/Logout';
import Flashout from './components/Flashout';

function WalletListener() {
  useEffect(() => {
    const detectWalletChange = async () => {
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length > 0) {
            window.location.href = "https://vibechain.vercel.app/"; // Auto Redirect
          }
        });
      }
    };
    detectWalletChange();
  }, []);

  return null; // This component does not render anything
}




function App() {
  return (
    <Router>
            <WalletListener />  {/* Wallet Change Detector */}

      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/myteam" element={<MyTeam userId={1} />} />
        <Route path="/communitytree" element={<CommunityTree />} />
        <Route path="/communityinfo" element={<CommunityInfo />} />
        <Route path="/recentincome" element={<RecentIncome />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/flashout" element={<Flashout />} />

        

      </Routes>
    </Router>
  );
}

export default App;
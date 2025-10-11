import React, { useState } from 'react';
import './Navbar.css'
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';

const HelporaLogo = () => (
  <svg width="200" height="50" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#16a34a', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <g>
      <path
        d="M 10 10 C 10 10, 10 0, 25 0 S 40 10, 40 10 L 40 30 C 40 45, 25 50, 25 50 C 25 50, 10 45, 10 30 Z"
        fill="url(#shieldGradient)"
      />
      <text
        x="25"
        y="28"
        fontFamily="Arial, sans-serif"
        fontSize="20"
        fill="white"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        +
      </text>
      <text
        x="55"
        y="30"
        fontFamily="Verdana, sans-serif"
        fontSize="24"
        fill="#333"
        fontWeight="bold"
      >
        Helpora
      </text>
    </g>
  </svg>
);

const Navbar = () => {
  const [visible,setVisible]=useState(false);
  return (
    <header className="header">
      <a href="/" className="logo">
        <HelporaLogo />
      </a>
      <nav className={`navbar ${visible ? 'active' : ''}`}>
        <img onClick={()=>setVisible(false)} src={assets.cross_icon} alt="" />
        <a href="/">Home</a>
       
        <a href="/register">Register</a>
        <a href="/login">Login</a>
      </nav>
      <div className="navbar-right">
          <img onClick={()=>setVisible(true)} src={assets.menu_icon} alt='menu' />
      </div>
    </header>
  )
}

export default Navbar;

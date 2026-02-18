import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const NotFound = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 to-yellow-500 text-white">
     <img className='w-80 h-100  '  src="https://imgs.search.brave.com/BPHknbynSBIl6O-bycXMp-oCyiC3T1VbJy5zbhkmcWU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9mdW5ueS1jYXQt/d2VhcmluZy1zdW5n/bGFzc2VzLWVhdGlu/Zy1pY2UtY3JlYW0t/Y29uZS1zb2xpZC1j/b2xvci1iYWNrZ3Jv/dW5kXzQxMTU2Mi02/NTc5LmpwZz9zaXpl/PTYyNiZleHQ9anBn" alt="" />
      <h1 className="text-6xl font-extrabold mb-4">404 - Page Not Found</h1>
      <p className="text-2xl mb-8">
        Oops! Looks like you're lost in space. But don't worry
      </p>
      <Button onClick={handleHomeClick} className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700">
        Take Me Home
      </Button>
    </div>
  );
};

export default NotFound;

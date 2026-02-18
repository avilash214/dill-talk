import React, { useEffect, useState } from 'react';
import Feed from './Feed';
import { Outlet } from 'react-router-dom';
import RightSidebar from './RightSidebar';
import useGetAllPost from '@/hooks/useGetAllPost';
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers';


const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
  const [visible, setVisible] = useState(false);
  const showContent = () => {
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, 6000); // 3000 milliseconds = 3 seconds
  };
  useEffect(() => {
    showContent();
  }, [])
  return (
    <>
      <div className='ml-[15%] fixed top-[30%] z-10 lg:ml-[16%]'>
        {visible && (
          <div className="mt-4 font-semibold p-4 text-white bg-rose-600 border border-rose-800 rounded">
            This website is best viewed on a larger screen. We apologize if the interface isn't perfect on smaller devices. Thank you for your understanding and patience.”          </div>
        )}
      </div>

      <div className="flex">
        <div className="flex-grow">
          <Feed />
          <Outlet />
        </div>
        <RightSidebar />
      </div>
    </>

  );
}

export default Home;

import React, { useEffect, useState } from 'react';
import LeftSidebar from './LeftSidebar';
import { Outlet } from 'react-router-dom';
import loading from '/images/loading.png'

const MainLayout = () => {
  const [loader, setLoader] = useState(false);
 
  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 3000);
  }, []);
  

  return (
    <div>
      {loader ? (
        <div className=' flex h-screen w-screen justify-center items-center '>
          <img className='' src={loading} alt="" />
        </div>

      ) : (
        <div className=''  >
          
          <LeftSidebar />
          <Outlet />
        </div>
      )}
    </div>
  );
};




export default MainLayout;

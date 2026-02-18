import Login from "./components/Login"
import Signup from "./components/Signup"
import Home from "./components/Home"
import MainLayout from "./components/MainLayout"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Profile from "./components/Profile"
import EditProfile from "./components/EditProfile"
import ChatPage from "./components/ChatPage"
import { io } from "socket.io-client";
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setSocket } from "./Redux/socketSlice"
import { setOnlineUsers } from "./Redux/chatSlice"
import { setLikeNotification } from "./Redux/rtnSlice"
import ProtectedRoutes from "./components/ProtectedRoutes"

import UserSearch from "./components/UserSearch"
import JokesPage from "./components/JokesPage"



const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      {
        path: '/',
        element: <ProtectedRoutes><Home /></ProtectedRoutes>
      },
      {
        path: '/profile/:id',
        element: <ProtectedRoutes><Profile /></ProtectedRoutes>
      },
      {
        path: '/profile/edit',
        element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>
      },
      {
        path: '/chat',
        element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>
      },
    
      {
        path: '/search',
        element: <ProtectedRoutes><UserSearch /></ProtectedRoutes>
      },
    
      {
        path: '/jokes',
        element: <ProtectedRoutes><JokesPage /></ProtectedRoutes>
      },



    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  

])

function App() {
  const { user } = useSelector(store => store.auth)
  const { socket } = useSelector(store => store.socketio)
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      const socketio = io('https://dilltalks.onrender.com', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification))
      })
      return () => {
        socketio?.close();
        dispatch(setSocket(null))
      }
    } else if (socket) {
      socket?.close();
      dispatch(setSocket(null))
    }
  }, [user, dispatch])
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App

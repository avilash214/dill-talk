import { setAuthUser, setFollowingUser } from "@/Redux/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import {
  Heart,
  Home,
  Laugh,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  SprayCan,
  TrendingUp,
} from "lucide-react";
import { space } from "postcss/lib/list";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/Redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { clearLikeNotifications, setLikeNotification } from "@/Redux/rtnSlice";
import { setEmptyMessagesL, setMessages, setMessagesL } from "@/Redux/chatSlice";



const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector((store) => store.realTimeNotification)
  const { messagesL } = useSelector(store => store.chat)
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const logoutHandler = async () => {
    try {
      const res = await axios.get("https://dilltalks.onrender.com/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        dispatch(setFollowingUser([]))
        dispatch(setMessages([]))
        dispatch(setMessagesL(null))
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleClearNotifications = () => {
    dispatch(clearLikeNotifications());


  };
  const handleClearMessages = () => {
    dispatch(setEmptyMessagesL());


  };
  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`)
    } else if (textType === "Home") {
      navigate(`/`);
    } else if (textType === "Messages") {
      navigate(`/chat`);
      handleClearMessages();

    } else if (textType === "Search") {
      navigate(`/search`);
      handleClearMessages();

    }else if (textType === "Jokes") {
      navigate(`/jokes`);
      handleClearMessages();

    }
  };
  const sideBarItems = [
    {
      icon: <Home />,
      text: "Home",
    },
    {
      icon: <Search />,
      text: "Search",
    },
    {
      icon: <Laugh/>,
      text: "Jokes",
    },
    {
      icon: < MessageCircle />,
      text: "Messages",
    },
    {
      icon: <Heart />,
      text: "Notifications",
    },
    {
      icon: <PlusSquare />,
      text: "Create",
    },
    {
      icon: (
        <Avatar className="w-7 h-7">
          <AvatarImage
            style={{ borderRadius: "15px" }}
            src={user?.profilepicture}
          />

          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    {
      icon: <LogOut />,
      text: "Logout",
    },
  ];
  return (
    <div className=" fixed top-0 z-10 left-0   border-r border-gray-300 w-fit h-screen lg:px-4 lg:w-[16%] ">
      <div className="flex flex-col">
        <h1 className="my-8 text-center font-bold text-xl">
          <h1 className="text-xl hidden font-bold font-poppins text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-black drop-shadow-2xl lg:text-3xl lg:block">
            Dill Talks
          </h1>
          <h1 className="text-2xl block font-bold font-poppins text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-black drop-shadow-2xl lg:text-3xl lg:hidden">
            DT
          </h1>
        </h1>
        <div>
          {sideBarItems.map((item, index) => {
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                className="flex  items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg py-2 mx-1 my-3"
                key={index}
              >
                {item.icon}
                <span className="lg:block  hidden">{item.text}</span>
                {
                  item.text === "Notifications" && likeNotification.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size='icon' className='rounded-full h-5 w-5 bg-rose-600 hover:bg-rose-600 absolute bottom-6 left-6'>
                          {likeNotification.length > 9 ? '9+' : likeNotification.length}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div onClick={handleClearNotifications}>
                          {
                            likeNotification.length === 0 ? (
                              <p>No new notification</p>
                            ) : (
                              likeNotification.map((notification) => (
                                <div key={notification.userId} className="flex items-center gap-2 my-2">
                                  <Avatar>
                                    <AvatarImage src={notification.userDetails?.profilePicture} />
                                    <AvatarFallback>CN</AvatarFallback>
                                  </Avatar>
                                  <p className="text-sm">
                                    <span className="font-bold">{notification.userDetails?.username} </span>liked your post
                                  </p>
                                </div>
                              ))
                            )
                          }
                        </div>
                      </PopoverContent>
                    </Popover>
                  )
                }
                {
                  item.text === "Messages" && messagesL?.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size='icon' className='rounded-full h-5 w-5 bg-rose-600 hover:bg-rose-600 absolute bottom-6 left-6'>
                          {messagesL.length > 9 ? '9+' : messagesL.length}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div>

                        </div>
                      </PopoverContent>
                    </Popover>
                  )
                }
              </div>
            );

          })}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;





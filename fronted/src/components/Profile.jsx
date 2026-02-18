import useGetUserProfile from '@/hooks/useGetUserProfile'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthUser, setUserProfile } from '@/Redux/authSlice';
import { setPosts, setSelectedPost } from '@/Redux/postSlice';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

const Profile = () => {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const dispatch = useDispatch();
  const { userprofile, user } = useSelector(store => store.auth);
 
  const isLoggedIn = user?._id === userId;
  const isFollowing = user?.following.includes(userId);
  const [activeTab, setActiveTab] = useState('posts');
  const navigate = useNavigate()
  const [displayedPost,setDisplayedPost] = useState(activeTab === 'posts' ? userprofile?.posts : userprofile?.bookmarks) 
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }
  const followUnfollowHandler = async () => {
    try {
      const res = await axios.get(`https://dilltalks.onrender.com/api/v1/user/followorunfollow/${userId}`, { withCredentials: true })


      if (res.data.success) {
        toast.success(res.data.message);

        // Update the user's following list
        const updatedUser = {
          ...user,
          following: user.following.includes(userId)
            ? user.following.filter(id => id !== userId)
            : [...user.following, userId]
        }
        dispatch(setAuthUser(updatedUser))
      }
    } catch (error) {
      toast.error(error.response.data.message);

    }
  }
  const deletePostHandler=async(postId)=>{
    try {
      const res = await axios.delete(
          `https://dilltalks.onrender.com/api/v1/post/delete/${postId}`,
          { withCredentials: true }
      );
      if (res.data.success) {
          const updatedPost = displayedPost.filter(
              (postItem) => postItem?._id !== postId
          );
          toast.success(res.data.message);
          
          
      }
  } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
  }
  }
  const deleteProfileHandler = async () => {
    try {
      const res = await axios.delete(`https://dilltalks.onrender.com/api/v1/user/deleteProfile/${user._id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        dispatch(setFollowingUser([]))
        dispatch(setMessages([]))
        dispatch(setMessagesL(null))
        toast.success(res.data.message);
        navigate("/login");

      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (

    <div className='flex ml-[16%] flex-col lg:flex-row max-w-5xl justify-center mx-auto lg:pl-10'>
      
      <div className='flex flex-col gap-10 p-4 lg:gap-20 lg:p-8'>
        <div className='grid  grid-cols-1 gap-6 lg:grid-cols-2'>
          <section className='flex items-center justify-center'>
            <Avatar className='h-28 w-28 lg:h-32 lg:w-32'>
              <AvatarImage src={userprofile?.profilePicture} alt="profile picture" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
              <div className='flex  flex-col items-center gap-2 sm:flex-row'>
                <span className='font-semibold text-lg'>{userprofile?.username}</span>
                {isLoggedIn ? (
                  <div className=' flex flex-wrap gap-3 sm:flex-row sm:flex-nowrap'>
                    <Link to="/profile/edit">
                      <Button variant='secondary' className='hover:bg-gray-200 h-[25px] text-xs lg:h-8 lg:text-sm'>Edit profile</Button>
                    </Link>
                    <Button variant='secondary' className='hover:bg-gray-200 cursor-not-allowed h-[25px] text-xs lg:h-8 lg:text-sm'>View archive</Button>
                    <Button onClick={() => setOpen(true)} variant='secondary' className='hover:bg-gray-200 h-[25px] text-xs lg:h-8 lg:text-sm'>Delete Account</Button>
                    <Dialog open={open}>
                      <DialogContent onInteractOutside={() => setOpen(false)}>
                        <div className="px-6 py-4 border-b border-gray-200">
                          <h2 className="text-xl font-semibold">Delete Account</h2>
                        </div>
                        <div className="p-6">
                          <p className="text-gray-700">Are you sure you want to delete your account? This action cannot be undone.</p>
                        </div>
                        <div className="flex justify-end px-6 py-4 border-t border-gray-200">
                          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2" onClick={() => setOpen(false)}>Cancel</button>
                          <button className="bg-red-600 text-white px-4 py-2 rounded-md" onClick={deleteProfileHandler}>Delete</button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  isFollowing ? (
                    <>
                      <Button onClick={followUnfollowHandler} variant="secondary" className='h-[25px] text-xs lg:h-8 lg:text-sm'>Unfollow</Button>
                      <Button variant="secondary" className='h-[25px] text-xs lg:h-8 lg:text-sm'>Message</Button>
                    </>
                  ) : (
                    <Button className='bg-[#0095F6] hover:bg-[#0095F6] h-8' onClick={followUnfollowHandler}>Follow</Button>
                  )
                )}
              </div>
              <div className='flex items-center gap-4'>
                <p className='font-semibold'>{userprofile?.posts.length}<span className='mx-2'>Posts</span></p>
                <p className='font-semibold'>{userprofile?.followers.length}<span className='mx-2'>Followers</span></p>
                <p className='font-semibold'>{userprofile?.following.length}<span className='mx-2'>Following</span></p>
              </div>
              <div className='flex flex-col gap-1'>
                <span>{userprofile?.bio || 'bio here....'}</span>
                <Badge className='w-fit' variant='secondary'>
                  <AtSign /><span className='pl-1'>{userprofile?.username}</span>
                </Badge>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t my-3 border-t-gray-200'>
          <div className='flex items-center justify-center gap-4 md:gap-10 text-sm'>
            <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={() => handleTabChange('posts')}>POSTS</span>
            <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`} onClick={() => handleTabChange('saved')}>SAVED</span>
            <span className={`py-3 cursor-pointer ${activeTab === 'reels' ? 'font-bold' : ''}`} onClick={() => handleTabChange('reels')}>REELS</span>
            <span className={`py-3 cursor-pointer ${activeTab === 'tags' ? 'font-bold' : ''}`} onClick={() => handleTabChange('tags')}>TAGS</span>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {displayedPost?.map((post) => (
              <div key={post?._id} className='relative group cursor-pointer'>
                <img src={post.image} alt="post image" className='rounded-sm my-2 aspect-square object-cover' />
                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <div className='flex  items-center text-white space-x-4'>
                    <button className='flex items-center gap-2 hover:text-gray-300'>
                      <Heart />
                      <span>{post?.likes.length}</span>
                    </button>
                    <button className='flex items-center gap-2 hover:text-gray-300'>
                      <MessageCircle />
                      <span>{post?.comments.length}</span>
                    </button>
                    <button onClick={()=>deletePostHandler(post._id)} className='flex items-center gap-2 text-rose-700 hover:text-gray-300'>
                        <Trash2/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

  );

}

export default Profile

import React, { useState } from 'react';
import { Avatar } from './ui/avatar';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { MoreHorizontal } from 'lucide-react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/Redux/postSlice';
import { toast } from 'sonner';

const Comment = ({ comment }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);
  const { selectedPost } = useSelector(store => store.post);
  const { user } = useSelector(store => store.auth);
  const[selectedComment,setSelectedComment]=useState(comment);
  
  const deleteCommentHandler = async () => {
    try {
      if (selectedPost?.author._id === user?._id) {
        const res = await axios.delete(`https://dilltalks.onrender.com/api/v1/post/${selectedPost._id}/comment/${selectedComment._id}`, { withCredentials: true });
        if (res.data.success) {
          setOpen(false);
          const updatedPosts = posts.map(postItem => {
            if (postItem._id === selectedPost._id) {
              return {
                ...postItem,
                comments: postItem.comments.filter(commentId => commentId !== selectedComment._id)
              };
            }
            return postItem;
          });
          setSelectedComment(" ");

          dispatch(setPosts(updatedPosts));
          toast.success(res.data.message);
        }
      } else {
        toast.error("You are not the author");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error deleting comment");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className='my-2 cursor-pointer'>
          <div className='flex gap-3 items-center'>
            <Avatar className='flex items-center justify-center'>
              <AvatarImage src={selectedComment?.author?.profilePicture} />
              <AvatarFallback></AvatarFallback>
            </Avatar>
            <span className='font-bold text-sm'>{selectedComment?.author?.username}</span>
            <span>{selectedComment?.text}</span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="w-30 h-10 flex justify-center cursor-pointer items-center">
        <div onClick={deleteCommentHandler}>Delete</div>
      </DialogContent>
    </Dialog>
  );
};

export default Comment;

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import { setPosts } from '@/Redux/postSlice'
import { toast } from 'sonner'


const CommentDialog = ({ open, setOpen }) => {
    const[text,setText]=useState("")
    const { posts } = useSelector((store) => store.post);
    const{selectedPost}=useSelector(store=>store.post)
    const dispatch=useDispatch();
    const[comment,setComment]=useState(selectedPost?.comments)
    useEffect(()=>{
        if(selectedPost){
            setComment(selectedPost?.comments)
        }
    },[selectedPost])
   
    const changeEventHandler=(e)=>{
        const inputText=e.target.value;
        if(inputText.trim()){
          setText(inputText);
        }else{
         setText("")
        }
    }
    
      
    const sendMessageHandler = async () => {
        try {
            const res = await axios.post(`https://dilltalks.onrender.com/api/v1/post/${selectedPost?._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true


            });
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);
                const updatedPostData = posts.map(p => p._id === selectedPost?._id ? { ...p, comments: updatedCommentData } : p)
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText("")
            }
        } catch (error) {
            console.log(error);

        }
    }
    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col">
                <div className='flex-col  flex lg:flex-row '>
                    <div className='w-full h-[400px] lg:w-1/2 lg:h-[500px]'>
                        <img className='rounded-l-lg  w-full h-full object-cover' src={selectedPost?.image} alt="post_img" />

                    </div>
                    <div className='w-full flex flex-col justify-between lg:w-1/2'>
                        <div className='flex items-center justify-between p-4'>
                            <div className=' flex gap-3 items-center'>
                                <Link>
                                    <Avatar>
                                        <AvatarImage src={selectedPost?.profilePicture} alt='post-image' />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link className='font-semibold text-xs'>{selectedPost?.author?.username}</Link>
                                    {/* <span className='text-gray-600 text-sm'>Bio here...</span> */}
                                </div>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal className='cursor-pointer' />
                                </DialogTrigger>
                                <DialogContent className="text-center" >
                                    <div className='cursor-pointer w-full text-[#ED4956] font-bold'>
                                        Unfollow
                                    </div>
                                    <div className='cursor-pointer w-full'>
                                        Add to favorites
                                    </div>
                                </DialogContent>
                            </Dialog>

                        </div>
                        <hr />
                        <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                            {
                                comment?.map((comment)=><Comment key={comment._id} comment={comment}/>)   || "no comments"
                            }
                        </div>
                        <div className='p-4'>
                         <div className='flex items-center gap-2'>
                            <input type="text" value={text} onChange={changeEventHandler}  placeholder='Add a comment...' className='w-full outline-none text-sm border-2 border-gray-300 p-2 rounded' />
                            <Button disabled={!text.trim()} onClick={sendMessageHandler} variant='outline'>send</Button>
                         </div>
                        </div>
                    </div>
                </div>



            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog
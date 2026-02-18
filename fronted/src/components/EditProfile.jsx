
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthUser } from '@/Redux/authSlice';

const EditProfile = () => {
    const imageRef = useRef();
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        profilePicture: user?.profilePicture,
        bio: user?.bio,
        gender: user?.gender
    });
    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setInput({ ...input, profilePicture: file });
    }
    const selectChangeHandler = (value) => {
       
         setInput({ ...input, gender: value })
    }
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const editProfileHandler = async () => {
        const formData = new FormData();
        formData.append("bio", input.bio);
        formData.append("gender", input.gender); // Append gender to FormData
        if (input.profilePicture) {
            formData.append("profilePicture", input.profilePicture);
        }
    
        try {
            setLoading(true);
            const res = await axios.post('https://dilltalks.onrender.com/api/v1/user/profile/edit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
    
            if (res.data.success) {
                const updatedUserData = {
                    ...user,
                    profilePicture: res.data.user?.profilePicture,
                    bio: res.data.user?.bio,
                    gender: res.data.user?.gender
                };
                dispatch(setAuthUser(updatedUserData));
                navigate(`/profile/${user?._id}`);
                toast.success(res.data.message);
            }
    
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className='flex max-w-2xl ml-[5%]   pl-10 lg:mx-auto'>
            <section className='flex flex-col gap-6 w-full my-8'>
                <h1 className='font-bold text-xl'>Edit Profile</h1>
                <div className="flex items-center  justify-between bg-gray-100 rounded-xl p-4">
                    <div className='flex items-center gap-3'>
                        <Avatar>
                            <AvatarImage src={user?.profilepicture} alt="post-image" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>


                        <div className="flex flex-col  text-start ">
                            <h1 className="font-bold text-sm text-[#000000cf]">
                                {user?.username}
                            </h1>
                            <span className='text-sm text-gray-600' >{user?.bio || 'Bio here...'}</span>
                        </div>
                    </div>
                    <input onChange={(e)=>fileChangeHandler(e)} ref={imageRef} type='file' className='hidden' />
                    <Button onClick={() => imageRef?.current?.click()} className>Change photo</Button>

                </div>
                <div>
                    <h1 className='font-bold text-xl mb-2'>Bio</h1>
                    <Textarea value={input.bio} onChange={(e) => setInput({ ...input, bio: e.target.value })} name='bio' className='focus-visible:ring-transparent' />
                </div>
                <div>
                    <h1 className='font-bold mb-2'>Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={selectChangeHandler} className=''>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={`${input.gender?input.gender:'Select your gender'}`} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>

                        </SelectContent>
                    </Select>

                </div>
                <div className='flex justify-end'>
                    {
                        loading ? (
                            <Button className='w-fit '>
                                <Loader2 className='mr-2 h-4 w-4 animate-spink' />
                                please wait
                            </Button>

                        ) : (<Button onClick={editProfileHandler} className='w-fit '>Submit</Button>)
                    }

                </div>
            </section>
        </div>

    )
}

export default EditProfile
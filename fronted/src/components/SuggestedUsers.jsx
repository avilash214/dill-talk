
import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'

const SuggestedUsers = () => {
    const { suggestedUsers } = useSelector(store => store.auth)
    return (
        <div className='my-10 ' >
            <div className='flex gap-5 items-center justify-between text-sm'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All</span>
            </div>
            {
                suggestedUsers?.map((user) => {
                    return (
                        <Link to={`/profile/${user?._id}`}>
                            <div key={user._id} className='flex items-center justify-between  my-5'>

                                <div className="flex items-center gap-2">

                                    <Avatar>
                                        <AvatarImage src={user?.profilePicture} alt="post-image" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>


                                    <div className="flex flex-col  text-start ">
                                        <h1 className="font-semibold text-[#000000cf]">
                                            <Link to={`/profile/${user?._id}`} >{user?.username}</Link>
                                        </h1>
                                        <span className='text-sm text-gray-600' >{user?.bio || 'Bio here...'}</span>
                                    </div>

                                </div>

                                {/* <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#399fe3]'>Follow</span> */}
                            </div>
                        </Link>

                    )
                })
            }
        </div >
    )
}

export default SuggestedUsers
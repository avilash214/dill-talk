
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers'

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth)
  return (
    <div className='w-fit my-10 pr-32 lg:block  hidden' >
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilepicture} alt="post-image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex flex-col  text-start ">
          <h1 className="font-semibold text-[#000000cf]">
            <Link to={`/profile/${user?._id}`} >{user?.username}</Link>
          </h1>
          <span className='text-sm text-gray-600' >{user?.bio || 'Bio here...'}</span>
        </div>

      </div>
      <SuggestedUsers/>
    </div>
  )
}

export default RightSidebar

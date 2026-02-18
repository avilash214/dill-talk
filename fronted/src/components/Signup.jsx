import { Label } from '@radix-ui/react-label'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const{user}=useSelector(store=>store.auth)
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }
  const signupHandler = async (e) => {
    e.preventDefault();//page reload nhi hoga so data loss nhi hoga
    
    try {
      setLoading(true)
      const res = await axios.post('https://dilltalks.onrender.com/api/v1/user/register', input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setInput({
          username: "",
          email: "",
          password: ""
        })

      }
    } catch (error) {

      toast.error(error.response.data.message);
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    if(user){
      navigate("/")
    }
  })

  return (
    <div className='flex items-center w-screen h-screen justify-center'>
      <form onSubmit={signupHandler} className='shadow-lg  flex flex-col gap-5 p-8'>
        <div>
          <h1 className='text-center font-bold text-xl'>LOGO</h1>
          <p className='text-sm text-center' >Signup to see photos & videos from your friends</p>
        </div>
        <div>
          <Label className='font-medium' >Username</Label>
          <Input type="text" name="username" value={input.username} onChange={changeEventHandler} className="focus-visible:ring-transparent my-1 " />

        </div>
        <div>
          <Label className='font-medium' >Email</Label>
          <Input type="email" name="email" value={input.email} onChange={changeEventHandler} className="focus-visible:ring-transparent my-1 " />

        </div>
        <div>
          <Label className='font-medium' >Password</Label>
          <Input type="password" name="password" value={input.password} onChange={changeEventHandler} className="focus-visible:ring-transparent my-1 " />

        </div>

        <Button type="submit">Signup</Button>
        <span className='text-center'>Already have an account?<Link to="/login" className="text-blue-600">Login</Link></span>
      </form>
    </div>
  )
}

export default Signup

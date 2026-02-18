import { setFollowingUser } from "@/Redux/authSlice";
import axios from "axios";
import { useEffect } from "react" 
import { useDispatch } from "react-redux"

export const useGetFollowing=(user)=>{

    const dispatch=useDispatch()
    useEffect(()=>{
        const fetchAllFollowing=async()=>{
            try {
                const res=await axios.get('https://dilltalks.onrender.com/api/v1/user/following',{withCredentials:true})
                if(res.data.success){
                    dispatch(setFollowingUser(res.data.following));
                }
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchAllFollowing();
    },[user]);
}
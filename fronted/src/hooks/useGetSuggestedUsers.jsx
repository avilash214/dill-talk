import { setSuggestedUsers } from "@/Redux/authSlice";
import { setPosts } from "@/Redux/postSlice";
import axios from "axios";
import {useEffect} from "react";
import { useDispatch } from "react-redux";


const useGetSuggestedUsers=()=>{
    const dispatch=useDispatch();   
    useEffect(()=>{
      
        const fetchSuggestedUsers=async()=>{
            try {
                const res=await axios.get('https://dilltalks.onrender.com/api/v1/user/suggested',{withCredentials:true})
                if(res.data.success){
                    dispatch(setSuggestedUsers(res.data.users));
                }
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchSuggestedUsers();
    },[]);
};
export default useGetSuggestedUsers;
import  {createSlice} from "@reduxjs/toolkit";

const authSlice=createSlice({
    name:"auth",
    initialState:{
        user:null,
        suggestedUsers:[],
        userprofile:null,
        selectedUser:null,
        followingUser:[],
    },
    reducers:{
        setAuthUser:(state,action)=>{
            state.user=action.payload;  
        },
        setSuggestedUsers:(state,action)=>{
            state.suggestedUsers=action.payload;
        },
        setUserProfile:(state,action)=>{
            state.userprofile=action.payload;
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser=action.payload;
        },
        setFollowingUser:(state,action)=>{
            state.followingUser=action.payload;
        },


    }
});
export const {setAuthUser,setSuggestedUsers,setUserProfile,setSelectedUser,setFollowingUser}=authSlice.actions; 
export default authSlice.reducer;  

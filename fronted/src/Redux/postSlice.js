    import { createSlice } from "@reduxjs/toolkit";
    const postSlice=createSlice({
        name:'post',
        initialState:{
            posts:[],
            selectedPost:null,
            selectedComment:null,
        },
        reducers:{
            //actions
            setPosts:(state,action)=>{
                state.posts = action.payload
            },
            setSelectedPost:(state,action)=>{
                state.selectedPost=action.payload
            },
            setSelectedComment:(state,action)=>{
                state.selectedComment=action.payload
            }
        }
    });
    export const{setPosts,setSelectedPost,setSelectedComment}=postSlice.actions;
    export default postSlice.reducer;
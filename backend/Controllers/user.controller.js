import { User } from "../Models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../Utils/datauri.js";
import cloudinary from "../Utils/cloudinary.js";
import { Post } from "../Models/post.model.js";
import { bookMarkPost } from "./post.controller.js";
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing,please check!",
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "Try different email",
                success: false,
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);//password will be stored in hashed formed
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({  //status code for creating is 201
            message: "Account created successfully",
            success: true,
        });
    } catch (error) {
        console.log(error)
    }
}
export const login=async(req,res)=>{
    try{
        const {email,password} = req.body;
        if ( !email || !password) {
            return res.status(401).json({
                message: "Something is missing,please check!",
                success: false,
            });
        }
        let user=await User.findOne({email})
        if(!user){
            return res.status(401).json({
                message:"Incorrect Email or password",
                success:false,
            });
        }
        const isPasswordMatch=await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(401).json({
                message:"Incorrect email or password",
                success:false,
            });
        }
      
       //populate each post id in posts array
       const populatedPost=await Promise.all(
         user.posts.map(async(postId)=>{
            const post=await Post.findById(postId);
            if(post.author.equals(user._id)){
                return post;
            }
            return null;
         })
       )
        user={
            _id:user._id,
            username:user.username,
            email:user.email,
            profilepicture:user.profilePicture,
            bio:user.bio,
            followers:user.followers,
            following:user.following,
            posts:populatedPost,
            bookmarks:user.bookmarks
            
        }
        const token=await jwt.sign({userId:user._id},process.env.SECRET_KEY);
        return res.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:1*21*60*60*1000}).json({
            message:`Welcome back ${user.username}`,
            success:true,
            user
            
        });
      

    }
    catch(error){
            console.log(error);
    }
};
export const logout=async(_,res)=>{
    try{
        return res.cookie("token","",{maxAge:0}).json({
            message:'Logged out successflly.',
            success:true
        });
    }
    catch(error){
        console.log(error)
    }
};
 // Ensure you're importing your User model correctly

export const deleteProfile = async (req, res) => {
    const userId = req.params.id;

    console.log('User ID:', userId); // Log the user ID to ensure it's being received
    const user = await User.findById(userId).select('-password');
    try {
        const result = await User.deleteOne({ _id:userId });
        if (user.profilePictureId) {
            await cloudinary.uploader.destroy(user.profilePictureId);
          }
        console.log('Delete result:', result); // Log the result to see the outcome

        if (result.deletedCount === 1) {
            return res.status(200).json({
                message: 'Account is deleted',
                success: true
            });
        } else {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }
    } catch (error) {
        console.error('Error:', error); // Log the error to debug

        return res.status(500).json({
            message: 'An error occurred',
            error: error.message,
            success: false
        });
    }
}


export const getProfile=async(req,res)=>{
    try{
        const userId=req.params.id;
        let user = await User.findById(userId)
        .select('-password')
        .populate({ path: 'posts' })
        .populate({ path: 'bookmarks' });      
         return res.status(200).json({
            user,
            success:true
        });
    }catch(error){
        console.log(error);
    }
};
export const editProfile = async (req, res) => {
    try {
      const userId = req.id;
      const { bio, gender } = req.body;
      const profilePicture = req.file;
  
      let cloudResponse;
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({
          message: 'User not found',
          success: false
        });
      }
  
      if (profilePicture) {
        try {
          // Delete old profile picture from Cloudinary
          if (user.profilePictureId) {
            await cloudinary.uploader.destroy(user.profilePictureId);
          }
  
          // Upload new profile picture to Cloudinary
          const fileUri = getDataUri(profilePicture);
          cloudResponse = await cloudinary.uploader.upload(fileUri);
          console.log(cloudResponse);
  
          // Update user's profile picture and profile picture ID
          user.profilePicture = cloudResponse.secure_url;
          user.profilePictureId = cloudResponse.public_id;
        } catch (uploadError) {
          console.error("Cloudinary upload error:", uploadError);
          return res.status(500).json({
            message: 'Image upload failed',
            success: false
          });
        }
      }
  
      if (bio) user.bio = bio;
      if (gender) user.gender = gender;
  
      await user.save();
  
      return res.status(200).json({
        message: 'Profile updated',
        success: true,
        user
      });
    } catch (error) {
      console.error("General error:", error);
      return res.status(500).json({
        message: 'Internal server error',
        success: false
      });
    }
  };
  
  
export const getSuggestedUsers=async (req,res)=>{
    try{
        const suggestedUsers=await User.find({_id:{$ne:req.id}}).select("-password");//ne means not equal to
        if(!suggestedUsers){
            return res.status(400).json({
                message:'currently do not have any users'
            })
        };
        return res.status(200).json({
            success:true,
            users:suggestedUsers
        })
    }
    catch(error){
        console.log(error);

    }
};
export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id;
        const jiskoFollowKarunga = req.params.id;
        if (followKrneWala === jiskoFollowKarunga) {
            return res.status(400).json({
                message: 'You can\'t follow/unfollow yourself'
            });
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKarunga);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }

        // Follow or unfollow logic
        const isFollowing = user.following.includes(jiskoFollowKarunga); // Ensure we're checking `user`

        if (isFollowing) {
            // Unfollow logic
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKarunga } }), // Pull follower's ID from following array
                User.updateOne({ _id: jiskoFollowKarunga }, { $pull: { followers: followKrneWala } }) // Pull follower's ID from followers array
            ]);
            return res.status(200).json({
                message: 'Unfollowed successfully',
                success: true
            });
        } else {
            // Follow logic
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKarunga } }), // Push follower's ID to following array
                User.updateOne({ _id: jiskoFollowKarunga }, { $push: { followers: followKrneWala } }) // Push follower's ID to followers array
            ]);
            return res.status(200).json({
                message: 'Followed successfully',
                success: true
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server error',
            success: false
        });
    }
};

export const getSearchedUser = async (req, res) => {
    try {
        const { q } = req.query; // Extract query parameter from req.query
        const users = await User.find({ username: { $regex: q, $options: 'i' } });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
export const getAllFollowing = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).populate('following', 'username profilePicture'); // Populate only 'username' and 'profilePicture' fields

        if (!user) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            following: user.following,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server error',
            success: false
        });
    }
};



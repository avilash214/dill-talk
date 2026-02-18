import sharp from "sharp"
import cloudinary from "../Utils/cloudinary.js";
import { Post } from "../Models/post.model.js"
import { User } from "../Models/user.model.js";
import { Comment } from "../Models/comment.model.js";
import { getReceiverSocketId,io } from "../Socket/socket.js";


export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) {
            console.log('Image is missing');
            return res.status(400).json({ message: 'Image required' });
        }
        
        // Image upload
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();  // Fixing typo in buffer conversion

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;  // Fixed typo
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        console.log('Cloudinary response:', cloudResponse);

        if (!cloudResponse.secure_url) {
            console.error('Failed to upload to Cloudinary');
            return res.status(500).json({ message: 'Failed to upload image' });
        }

        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            imageId: cloudResponse.public_id,
            author: authorId
        });
        console.log('Post created:', post);

        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
            console.log('User updated:', user);
        } else {
            console.error('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        await post.populate({ path: 'author', select: '-password' });
        return res.status(201).json({
            message: 'New post added',
            post,
            success: true,
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });

        const validPosts = [];

        for (let post of posts) {
            if (post.author) {
                const user = await User.findById(post.author._id);
                if (user) {
                    validPosts.push(post);
                } else {
                    await Post.findByIdAndDelete(post._id);
                }
            }
        }

        return res.status(200).json({
            posts: validPosts,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong',
            success: false
        });
    }
}

export const getUserPost=async(req,res)=>{
    try {
        const authorId=req.id;  
        const posts=await Post.find({author:authorId}).sort({createdAt:-1}).populate({
            path:'author',
            select:'username profilePicture'
        }).populate({
            path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
        })
        return res.status(200).json({
            posts,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}
export const likepost=async(req,res)=>{
    try {
        const likekrnewalaId=req.id;
        const postId=req.params.id;
        const post=await Post.findById(postId);
        if(!post) return res.send(400).json({
            message:'Post not found',
            success:false
        })
        //likelogic started
        await post.updateOne({$addToSet:{likes:likekrnewalaId}});//ek user ek hi like kr sakta he
        await post.save();
      
        //implement socket io for notification
        const user=await User.findById(likekrnewalaId).select('username profilePicture')
        const postOwnerId=post?.author?.toString();
        if(postOwnerId!==likekrnewalaId){
            //emit notification event
            const notification={
                type:'like',
                userId:likekrnewalaId,
                userDetails:user,
                postId,
                message:'Your post was liked'
            }
            const postOwnerSocketId=getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification);
        }


        return res.status(200).json({
            message:'Post is liked',
            success:true
        })
    } catch (error) {
        
    }
}
export const dislikepost=async(req,res)=>{
    try {
        const likekrnewalaId=req.id;
        const postId=req.params.id;
        const post=await Post.findById(postId);
        if(!post) return res.send(400).json({
            message:'Post not found',
            success:false
        })
        //likelogic started
        await post.updateOne({$pull:{likes:likekrnewalaId}});//id remove kr dega
        await post.save();
      
        //implement socket io for notification


        //implement socket io for notification
        const user=await User.findById(likekrnewalaId).select('username profilePicture')
        const postOwnerId=post?.author?.toString();
        if(postOwnerId!==likekrnewalaId){
            //emit notification event
            const notification={
                type:'dislike',
                userId:likekrnewalaId,
                userDetails:user,
                postId,
                message:'Your post was liked'
            }
            const postOwnerSocketId=getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification);
        }
        return res.status(200).json({
            message:'Post is disliked',
            success:true
        })
    } catch (error) {
        
    }
   
}
export const addComment=async (req,res)=>{
    try {
        const postId=req.params.id;
        const comtuserid= req.id //comment krne wala user ki id
        const {text}=req.body;
        const post=await Post.findById(postId);
        if(!text) return res.status(400).json({message:'Text is required',success:true});
        const comment=await Comment.create({
            text,
            author:comtuserid,
            post:postId

        })
        await comment.populate({
            path:'author',
            select:"username profilePicture"
        });
        post.comments.push(comment._id)
        await post.save();
        return res.status(201).json({
            message:'Comment Added',
            comment,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
};
export const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const postId = req.params.postId;
        
        // Delete the comment from the comments collection
        if (commentId) {
            await Comment.findByIdAndDelete(commentId);
        }
        
        // Remove the comment ID from the post's comments array
        const post = await Post.findById(postId);
        if (post) {
            post.comments = post.comments.filter(id => id.toString() !== commentId);
            await post.save();
        }
        
        return res.status(201).json({
            message: 'it will delete when page reloads',
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}
export const getCommentOfPost=async(req,res)=>{
    try{
        const postId=req.params.id;
        const comments=await Comment.find({post:postId}).populate('author','username profilePicture');
       if(!comments) return res.status(404).json({message:'No comments found for this post',success:false})

        return res.status(200).json({success:true,comments});
    }
    catch(error){
      console.log(error);
    }
};
export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post Not found', success: false });

        // Checking if the post is being deleted by the author
        if (post.author.toString() !== authorId) {
            return res.status(403).json({
                message: 'Unauthorized'
            });
        }

        // Delete the post and the associated image on Cloudinary
        await Post.findByIdAndDelete(postId);
        await cloudinary.uploader.destroy(post.imageId);

        // Update the user
        const user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        // Delete the comments of the post
        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            success: true,
            message: 'Post deleted'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const bookMarkPost=async(req,res)=>{
    try {
        const postId=req.params.id;
        const authorId=req.id;
        const post=await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found',success:false});
        const user=await User.findById(authorId);
        if(user.bookmarks.includes(post._id)){
            // Already bookmarked -> remove
            await User.updateOne(
                { _id: user._id },
                { $pull: { bookmarks: post._id } }
            );
            return res.status(200).json({ type: 'unsaved', message: 'Post removed from bookmark', success: true });
        } else {
            // Bookmark the post
            await User.updateOne(
                { _id: user._id },
                { $addToSet: { bookmarks: post._id } }
            );
            return res.status(200).json({ type: 'saved', message: 'Post bookmarked', success: true });
        }
        
    } catch (error) {
        console.log(error);
        
    }
}
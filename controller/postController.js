//import Post model object
const Post = require('./../model/postSchema');
//import User model (to update the User document with newly created post's id)
const User = require('./../model/userSchema');
//get all published posts
exports.getAllPublishedPosts = async (req, res) => {
   try {
        const posts = await Post.find({ state: "published" });
        res.status(200).json({
            status: "success",
            posts,
        })
    } catch (err) {
        throw err;
    }
};

//get a single published post
exports.getSinglePublishedPost = async (req, res) => {
   try {
        const post = await Post.findById(req.params.postId)
            .where("state")
            .eq("published");

        if (!post) {
            return res.status(404).json({
                status: "Failed",
                message: "Post with given ID not found!"
            });
        } else {
            //post.readCount === 0 ? post.readCount++ : post.readCount++;
            post.readCount++;
            await post.save();
        }
        res.status(200).json({
            status: "Successs",
            post,
        });
    } catch (err) {
        throw err
    };
    
};

//CREATE A NEW POST
exports.createPost = async (req, res) => {
    try {
        const { title, description, tags, body } = req.body;

        //calculate read time of post based on words in post body property
        //wpm = words per minute
        const wpm = 225;
        //spliting the post body data into array of words
        const numberOfWords = body.trim().split(/\s+/).length;
        const readTime = Math.ceil(numberOfWords / wpm);

        //get author name and author Id
        //req.user is an object contianing user returned by authenticationFunction in auth.js 
        let {firstname, lastname } = req.user; 
        let author = `${firstname} ${lastname}`;
        let authorId = req.user._id;
        const newPost = await Post.create({ title, description, tags, body, author,authorId, readTime });
        //add the newly created post to the 'posts' array property defined in the User Schema.
        let user = await User.findById(req.user._id);  
        user.posts.push(newPost._id);
        //save changes made , to the User document
        await user.save();
        //send back newly created post as json data in the response obj.
        res.status(201).json({
            status: "success",
            newPost,
        });
    } catch (err) {
        throw err;

    };
};

//UPDATE A POST
exports.updatePost = async (req,res) => {
    const {state,body} = req.body;
    try{
        //CHECK IF POST EXISTS, BEFORE UPDATE USING ID
        const postToUpdate = await Post.findById(req.params.postId);

        //IF NO POST FOUND
        if(!postToUpdate){
            return res.status(404).json({status:"Fail",message:"Post not found"});
        }

        //check if post belongs to the user initiatin the update request
        if(postToUpdate.authorId.toString() !== req.user._id.toString()){
            return res.status(401).json({
                status:'Fail',
                message:'You can only update a post you created!'
            });
        } 

        //UPDATE THE POST AFTER AURHORIZATION
        postToUpdate.state = state;
        postToUpdate.body = body;
        await postToUpdate.save();

        res.status(200).json({
            status:'Success',
            postToUpdate
        });

    } catch(err){
        res.status(500).json({
            status:"Error",
            message:"An error occurred while updating the post"
        });
    }
};

//DELETE A POST
exports.deletePost = async (req,res) => {
    try{
        const postToDelete = await Post.findByIdAndDelete(req.params.postId,{authorId:req.user.id});
        if(!postToDelete) {
            return res.status(404).json({
                status:"Fail",
                message:"Post with given Id not found"
            });
        }

        if(postToDelete.authorId.toString() !== req.user.id){
            return res.status(401).json({
                status:"Fail",
                messsage:"You can  only delete post you created",
            });
        }
        //delete a post from posts array in User document
        const postByUser = await User.findById(req.user._id);
        postByUser.posts.pull(postToDelete._id);
        // update the posts array of user with remaining posts
        await postByUser.updateOne({posts:postByUser.posts})

        res.status(200).json({
            status:"Success",
            message:"Post deleted successfully!"
        });
    }catch(err){
        throw err;
    }
};
//module.exports = {getAllPublishedPosts,getSinglePublishedPost,createPost,updatePost,deletePost};

/*
Notice that in auth.js  we assigned the value of user(currentUser) to req.user object
This req.user object becomes available on any route we pass this authenticationFunction 
middleWare function
 */


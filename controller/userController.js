//import Post model
const Post = require('./../model/postSchema');


exports.getAllPosts = async (req,res) => {
    try{
        const posts = await Post.find( { authorId:req.user._id} );
        res.status(200).json({
            status:"Success",
            posts
        });
    }catch(err){
        throw err;
    }
};


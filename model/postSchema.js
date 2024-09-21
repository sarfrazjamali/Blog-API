const mongooose = require('mongoose');

const postSchema = new mongooose.Schema(
    {
        title:{
            type:String,
            required:[true,"A Blog Post must have a title"]
        },

        description:{
            type:String,
            required:[true,"A Blog Post must have  a description"]
        },

        tags:[String],
        readCount:{
            type:Number,
            default: 0,
        },

        author:{
            type:String,
            required:true,
        },

        authorId:{
            type:mongooose.Schema.Types.ObjectId,
            ref:"User",
        },

        state:{
            type:String,
            enum:["draft","published"],
            default:"draft",
        },

        body:{
            type:String,
            required:[true,"A Blog Post must contain  a body"],
        },

        readTime:{
            type:String,
        },
    },
    {timestamps:true}
);
const Post = mongooose.model("Post",postSchema);
module.exports = Post;

/**
 * {timestamps:true}
 It automatically add createdAt and updatedAt fields to the database model,
 which are updated with current date and time whenever a record is created or modified.
 */
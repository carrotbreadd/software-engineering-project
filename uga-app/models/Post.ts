import { Schema, models, model } from "mongoose";

const CommentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: true,
      default: "/cpy1.png",
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    _id: true,
  }
);

const PostSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    username: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      required: true,
      default: "/cpy1.png",
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [CommentSchema],

    commentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Post = models.Post || model("Post", PostSchema);

export default Post;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

 PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  },
  isSaved: {
    type: Boolean,
    default: false
  },
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;

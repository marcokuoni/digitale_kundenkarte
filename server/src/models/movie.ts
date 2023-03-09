import mongoose from "mongoose"

const Schema = mongoose.Schema
const MovieSchema = new Schema(
   {
      title: {
         type: String,
         default: "",
         required: true,
      },
      director: {
         type: String,
         default: "",
         required: true,
      },
   },
   {
      timestamps: {
         createdAt: "created_at",
         updatedAt: "updated_at",
      },
   }
)

export default mongoose.model("movie", MovieSchema)
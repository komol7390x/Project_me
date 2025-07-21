import { Schema, model} from "mongoose";

const userSchema = new Schema(
  {
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    fullName:{type:String,required:true,min:3},
    description:{type:String},
    image_url:{type:String}
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model("users", userSchema);
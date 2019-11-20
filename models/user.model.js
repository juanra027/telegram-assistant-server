import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let userSchema = new Schema({
    _id:{
        type:String
    },
    name:{
        type: String,
        default: ''
    },
    groups:{
        type: [{ type : Schema.ObjectId, ref: 'Group'}],
        default:[]
    }
});
export default mongoose.model('User', userSchema);
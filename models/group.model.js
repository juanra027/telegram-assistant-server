import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let userSchema = new Schema({
    _id:{
        type:String
    },
    name:{
        type: String,
        default: ''
    }
});
export default mongoose.model('Group', userSchema);
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB database connection established successfully!'); }
    else { console.log('Error in MongoDB connection: ' + JSON.stringify(err, undefined, 2)); }
})
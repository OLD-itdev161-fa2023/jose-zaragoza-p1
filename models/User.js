import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        unique: true
    },
    mileage: {
        type: Number,
        required: true
    }
    time: {
        type: Number,
        required: true
    }
});

const User = mongoose.model('user', UserSchema);

export default User;
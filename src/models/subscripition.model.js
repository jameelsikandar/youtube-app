import mongoose, { Schema } from "mongoose";


const subscripitionSchema = new Schema(
    {
        subscriber: {
            type: Schema.Types.ObjectId,   // one who is subscribing
            ref: "User"
        },
        channel: {
            type: Schema.Types.ObjectId,  // one to whom 'subscriber' is subing
            ref: "User"
        }
    },

    {
        timestamps: true
    }
);


export const Subscripition = mongoose.model("Subscripition", subscripitionSchema)
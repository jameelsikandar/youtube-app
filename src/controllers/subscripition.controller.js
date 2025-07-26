import mongoose from "mongoose";
import { Subscripition } from '../models/subscripition.model.js'
import { User } from '../models/user.model.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// sub unsub channel
const toggleChannelSubscribe = asyncHandler(async (req, res) => {
    const channelId = req.params.channelId;
    const subscriberId = req.user._id;

    if (subscriberId.equals(channelId)) {
        throw new ApiError(400, "You cannot subscribe to your own channel")
    }

    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }

    const existingSubscripition = await Subscripition.findOne({
        subscriber: subscriberId,
        channel: channelId
    })

    if (existingSubscripition) {
        await existingSubscripition.deleteOne();

        return res.status(200).json(new ApiResponse(200, null, "Channel unsubscribed"))
    }

    await Subscripition.create({
        subscriber: subscriberId,
        channel: channelId
    });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Channel Subscribed!"))

});

// return subscribers of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }

    const subscribers = await Subscripition.find({
        channel: channelId
    }).populate("subscriber", "username fullName avatar")
        .sort({ createdAt: -1 })


    return res
        .status(200)
        .json(new ApiResponse(200, { totalSubscribers: subscribers.length, subscribers }, "Subscribers fetched successfully!"))
});

const getChannelUserSubscribed = asyncHandler(async (req, res) => {
    const subscriberId = req.params.subscriberId;

    const user = await User.findById(subscriberId);
    if (!user) {
        throw new ApiError(404, "Channel (User) not found!")
    }

    const subscribedChannels = await Subscripition.find({
        subscriber: subscriberId
    })
        .populate("channel", "username fullName avatar")
        .sort({ createdAt: -1 })


    return res
        .status(200)
        .json(new ApiResponse(200, {
            totalSubscribed: subscribedChannels.length,
            channels: subscribedChannels.map(sub => sub.channel)
        },
            "Subscribed channels fetched successfully!"
        ))

})



export {
    toggleChannelSubscribe,
    getUserChannelSubscribers,
    getChannelUserSubscribed
}
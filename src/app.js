import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
));

app.use(express.json(
    {
        limit: '16kb'
    }
));

app.use(express.urlencoded(
    {
        extended: true,
        limit: '16kb'
    }
));

app.use(express.static('public'));

app.use(cookieParser());

// routes

import userRouter from '../src/routes/user.route.js';

app.use('/api/v1/users', userRouter)

import videoRouter from '../src/routes/video.route.js';

app.use('/api/v1/videos', videoRouter);

import commentRouter from '../src/routes/comment.route.js'

app.use('/api/v1/comments', commentRouter)

import tweetRouter from '../src/routes/tweet.route.js'
app.use('/api/v1/tweets', tweetRouter)

export { app }



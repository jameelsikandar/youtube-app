import express, { Router } from 'express'
import { healthcheck } from '../controllers/healthcheck.controller.js'


const router = Router();

// server health
router.route('/').get(healthcheck);



export default router;

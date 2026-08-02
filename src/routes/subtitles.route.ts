import { Router } from 'express';
import { handleSubtitles } from '../controllers/subtitles.controller';

const router = Router();

router.post('/subtitles', handleSubtitles);

export default router;

import multer from 'multer';
import {promises as fs} from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import config from './config';

const imageStorage = multer.diskStorage({
    destination: async (_req, _file, cb) => {
        const destDir = path.join(config.publicPath, 'images');
        await fs.mkdir(destDir, {recursive: true});
        cb(null, destDir);
    },
    filename: (_req, file, cb) => {
        const extension = path.extname(file.originalname);
        cb(null, 'images' + randomUUID() + extension);
    }
});

export const imagesUpload = multer({storage: imageStorage});
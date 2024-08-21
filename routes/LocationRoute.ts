import express from 'express';

const guestbookRouter = express.Router();
guestbookRouter.use(express.json());


guestbookRouter.get('/', async (req, res) => {
    res.send('all info of location')
});
export default guestbookRouter;
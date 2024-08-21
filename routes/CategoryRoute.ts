import express from 'express';
import fileDb from "../fileDB";

const CategoryRouter = express.Router();
CategoryRouter.use(express.json());


CategoryRouter.get('/', async (req, res) => {

    await fileDb.init('category');
    const allMessages = await fileDb.getItems('category');

    res.send(allMessages)
});
export default CategoryRouter;
import express from 'express';
import fileDb from "../fileDB";

const CategoryRouter = express.Router();
CategoryRouter.use(express.json());


CategoryRouter.get('/', async (req, res) => {

    await fileDb.init('category');
    const allMessages = await fileDb.getItems('category');

    res.send(allMessages)
});

CategoryRouter.get('/:id', async (req, res) => {
    await fileDb.init('category');
    const {id} = req.params;


    const allMessages = await fileDb.getItems('category') || [];
    const getMsgById = allMessages.filter(x => x.id === id);

    if(getMsgById.length > 0){
        res.send(getMsgById)
    }else{
        res.send('Not found')
    }

});

CategoryRouter.post('/', async (req, res) => {
    await fileDb.init('category');
    const { category } = req.body;

    if(!category){
        return res.status(400).send('error')
    }

    const allMessages = await fileDb.getItems('category') || [];

    const idCheck = new Set(allMessages.map(message => message.id));
    let idNew = allMessages.length + 1;

    while (idCheck.has(`${idNew}`)) {
        idNew++;
    }

    const messages = {
        id: `${idNew}`,
        category : req.body.category,
        description: req.body.description ? req.body.description : null,
    }

    await fileDb.addItem(messages , "category");

    res.send(messages)
});
export default CategoryRouter;
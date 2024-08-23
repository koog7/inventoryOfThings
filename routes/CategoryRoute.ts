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

CategoryRouter.delete('/:id', async (req, res) => {
    await fileDb.init('category');
    await fileDb.init('accounting')
    const {id} = req.params;

    const accountingDB = await fileDb.getItems('accounting') || [];

    const isCategoryLinked = accountingDB.some(item => {
        if ('categoryId' in item) {
            return item.categoryId === id;
        }else{
            return false;
        }
    });

    if(!isCategoryLinked){
        await fileDb.removeItem(id , 'category')
        res.send('Success delete')
    }else{
        res.send('cant be deleted')
    }

});
export default CategoryRouter;
import express from 'express';
import fileDb, {Item} from "../fileDB";
import {imagesUpload} from "../multer";
import fs from 'fs/promises';


const AccountingRouter = express.Router();
AccountingRouter.use(express.json());


AccountingRouter.get('/', async (req, res) => {
    await fileDb.init('accounting');
    const allMessages = await fileDb.getItems('accounting')|| [];

    const getSpecificKeys = allMessages.map(message => {
        if ('name' in message) {
            return { id: message.id, name: message.name };
        }
    });

    res.send(getSpecificKeys)
});

AccountingRouter.get('/:id', async (req, res) => {
    await fileDb.init('accounting');
    const {id} = req.params;

    const allMessages = await fileDb.getItems('accounting') || [];
    const getMsgById = allMessages.filter(x => x.id === id);

    if(getMsgById.length > 0){
        res.send(getMsgById)
    }else{
        res.send('Not found')
    }

});

AccountingRouter.post('/', imagesUpload.single('photo'), async (req, res) => {
    await fileDb.init('accounting');
    const { categoryId , locationId , name } = req.body;

    if(!categoryId || !locationId || !name){
        return res.status(400).send('some of field are empty')
    }
    const allMessages = await fileDb.getItems('accounting') || [];

    const idCheck = new Set(allMessages.map(message => message.id));
    let idNew = allMessages.length + 1;

    while (idCheck.has(`${idNew}`)) {
        idNew++;
    }

    const messages = {
        id: `${idNew}`,
        categoryId : req.body.categoryId,
        locationId: req.body.locationId,
        name: req.body.name,
        description: req.body.description ? req.body.description : null,
        photo: req.file ? req.file.filename : null,
        date: req.body.date ? req.body.date : null,
    }

    await fileDb.addItem(messages , 'accounting');

    res.send(messages)
});


AccountingRouter.delete('/:id', async (req, res) => {
    await fileDb.init('accounting');
    const {id} = req.params;

    try{
        const allMessages = await fileDb.getItems('accounting') || [];
        const resource = allMessages.find(message => message.id === id);

        if (!resource) {
            return res.status(404).send('resource not found');
        }

        const item = resource as Item;
        const photoName = item.photo;
        const itemId = item.id

        if (photoName) {
            try {
                await fs.unlink(`./public/images/${photoName}`);
            } catch (e) {
                console.log(`failed to delete ${e}`);
            }
        }
        await fileDb.removeItem(itemId ,'accounting')
        res.send(`successful deleted`)
    }catch (e){
        res.send(e)
    }
});

export default AccountingRouter;
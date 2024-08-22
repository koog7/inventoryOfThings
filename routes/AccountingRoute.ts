import express from 'express';
import fileDb from "../fileDB";
import {imagesUpload} from "../multer";

const AccountingRouter = express.Router();
AccountingRouter.use(express.json());


AccountingRouter.get('/', async (req, res) => {
    await fileDb.init('accounting');
    const allMessages = await fileDb.getItems('accounting');

    res.send(allMessages)
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
    }

    await fileDb.addItem(messages , 'accounting');

    res.send(messages)
});
export default AccountingRouter;
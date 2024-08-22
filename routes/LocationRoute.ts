import express from 'express';
import fileDb from "../fileDB";

const LocationRouter = express.Router();
LocationRouter.use(express.json());


LocationRouter.get('/', async (req, res) => {
    await fileDb.init('location');
    const allMessages = await fileDb.getItems('location');

    res.send(allMessages)
});

LocationRouter.get('/:id', async (req, res) => {
    await fileDb.init('location');
    const {id} = req.params;

    const allMessages = await fileDb.getItems('location') || [];
    const getMsgById = allMessages.filter(x => x.id === id);

    if(getMsgById.length > 0){
        res.send(getMsgById)
    }else{
        res.send('Not found')
    }

});

LocationRouter.post('/', async (req, res) => {
    await fileDb.init('location');
    const { location } = req.body;

    if(!location){
        return res.status(400).send('error')
    }

    const allMessages = await fileDb.getItems('location') || [];

    const idCheck = new Set(allMessages.map(message => message.id));
    let idNew = allMessages.length + 1;

    while (idCheck.has(`${idNew}`)) {
        idNew++;
    }

    const messages = {
        id: `${idNew}`,
        location : req.body.location,
        description: req.body.description ? req.body.description : null,
    }

    await fileDb.addItem(messages , "location");

    res.send(messages)
});

export default LocationRouter;
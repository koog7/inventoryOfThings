import express from 'express';
import fileDb from "../fileDB";
import {randomUUID} from "node:crypto";

const LocationRouter = express.Router();
LocationRouter.use(express.json());


LocationRouter.get('/', async (req, res) => {
    await fileDb.init('location');
    const allMessages = await fileDb.getItems('location');

    res.send(allMessages)
});

LocationRouter.post('/', async (req, res) => {
    await fileDb.init('category');
    const { location } = req.body;

    if(!location){
        return res.status(400).send('error')
    }

    const messages = {
        id: randomUUID(),
        location : req.body.location,
        description: req.body.description ? req.body.description : null,
    }

    await fileDb.addItem(messages , "location");

    res.send(messages)
});

export default LocationRouter;
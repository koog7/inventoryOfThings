import express from 'express';
import AccountingRoute from "./routes/AccountingRoute";
import CategoryRoute from "./routes/CategoryRoute";
import LocationRoute from "./routes/LocationRoute";

const app = express();
const port = 8000;

app.use(express.json())
app.use(express.static('public'))

app.use('/accounting', AccountingRoute)
app.use('/category', CategoryRoute);
app.use('/location', LocationRoute);
const run = async () => {

    app.listen(port, () => {
        console.log('Server starter : http://127.0.0.1:' + port);
    });
};

run().catch(console.error);
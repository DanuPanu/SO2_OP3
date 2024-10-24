import express from 'express';
import path from 'path';
import apiVarastoRouter from './routes/apiVarasto';
import virheenkasittelija from './errors/errorhandler';

const app : express.Application = express();

const portti : number = Number(process.env.PORT) || 3103;

app.use(express.static(path.resolve(__dirname, "public")));

app.use("/api/varastotilanne", apiVarastoRouter);

app.use("/api", apiVarastoRouter);

app.use(virheenkasittelija);;

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi porttiin : ${portti}`);    

});
import express from 'express';
import Varasto, { Tuote } from '../models/varasto';
import { Virhe } from '../errors/errorhandler';

const varasto : Varasto = new Varasto();

const apiVarastoRouter : express.Router = express.Router();

apiVarastoRouter.use(express.json());

apiVarastoRouter.delete("/tuotteet/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    if(varasto.haeYksi(Number(req.params.id))){
        try{
            await varasto.poista(Number(req.params.id));
            res.json({viesti : "Tuote poistettu onnistuneesti!"});
        }catch (e : any){
            next(new Virhe())
        }
    }else{
        next(new Virhe(400, "Virheellinen id, tuotteen poistaminen epäonnistui"))
    }
});


apiVarastoRouter.put("/tuotteet/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    let muokattuTuote : Tuote = {
        id : req.body.id,
        koko : req.body.koko,
        vari : req.body.vari,
        varastotilanne : req.body.varastotilanne
    }
    

    if(varasto.haeYksi(Number(req.params.id))){
        if(req.body.vari.length > 0 && req.body.koko.length > 0){
            try{
                await varasto.muokkaa(muokattuTuote, Number(req.params.id));
                res.json({viesti : "Tuotetta muokattu onnistuneesti!"});
            } catch (e : any){
                next(new Virhe())
            }
        }else{
            next(new Virhe(400, "Virheellinen pyynnön body, tuotteen muokkaaminen epäonnistui"))
        }
    }else{
        next(new Virhe(400, "Virheellinen id, tuotteen muokkaaminen epäonnistui"))
    }
});

apiVarastoRouter.post("/tuotteet", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    let uusiTuote : Tuote = {
                        id : 0,
                        koko : req.body.koko,
                        vari : req.body.vari,
                        varastotilanne : req.body.varastotilanne
                    }

    if(req.body.vari.length > 0 && req.body.koko.length > 0){
        try {
            await varasto.lisaa(uusiTuote);
            res.json({viesti : "Tuote lisätty onnistuneesti!"});
        } catch (e : any){
            next(new Virhe())
        }
    } else{
        next(new Virhe(400, "Virheellinen pyynnön body, tuotteen lisääminen epäonnistui"))
    }
});

apiVarastoRouter.get("/varastotilanne/:id", (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try{    
        if(varasto.haeYksi(Number(req.params.id))){
            res.json({varastotilanne : varasto.haeYksi(Number(req.params.id))?.varastotilanne});
        } else{
            res.json({varastotilanne : "Ei tietoa"})        }
    } catch (e : any){
        next(new Virhe());
    }
});

apiVarastoRouter.get("/varastotilanne", (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try{
        if(varasto.haeToinen(String(req.query.vari), String(req.query.koko))){
            res.json({varastotilanne : varasto.haeToinen(String(req.query.vari), String(req.query.koko))?.varastotilanne})
        } else{
            res.json({varastotilanne : "Ei tietoa"})
        }
    } catch{
        next(new Virhe());
    }
    
});

apiVarastoRouter.get("/tuotteet", (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try{
        res.json(varasto.haeKaikki());
    } catch{
        next(new Virhe());
    }
});




export default apiVarastoRouter;
import {readFile, writeFile} from 'fs/promises';
import path from 'path';

export interface Tuote {
    id : number,
    koko : string,
    vari : string,
    varastotilanne : number
}

class Varasto {

    private varasto : Tuote[] = [];
    private tiedosto : string[] = [__dirname, "data.json"];

    constructor() {

        readFile(path.resolve(...this.tiedosto), "utf8")
            .then((data : string) => {
                this.varasto = JSON.parse(data);
            })
            .catch((e : any) => {
                throw new Error(e);
            });

    }

    public haeKaikki = () : Tuote[] => {

        try {
            return this.varasto;
        } catch (e : any) {
            throw new Error(e);
        }         

    }

    public haeYksi = (id : number) : Tuote | undefined => {

        try {
            return this.varasto.find((tuote : Tuote) => tuote.id === id);
        } catch (e : any) {
            throw new Error(e);
        }         
    }

    public haeToinen = (vari : string, koko : string) : Tuote | undefined => {
       
        try {
            return this.varasto.find((tuote : Tuote) => tuote.koko == koko && tuote.vari === vari);
        } catch (e : any){
            throw new Error(e);
        }
    }

    public lisaa = async (uusiTuote : Tuote) : Promise<void> => {

        try {
            this.varasto = [
                ...this.varasto,
                {
                    id : this.varasto.sort((a : Tuote,b : Tuote) => a.id - b.id)[this.varasto.length - 1].id + 1,
                    koko : uusiTuote.koko,
                    vari : uusiTuote.vari,
                    varastotilanne : uusiTuote.varastotilanne
                }                
            ];
            await this.tallenna();
        } catch (e : any) {
            throw new Error(e);
        }         

    }

    public muokkaa = async (muokattuTuote : Tuote, id : number) : Promise<void> => {

        try {
            this.varasto = this.varasto.filter((tuote : Tuote) => tuote.id !== id);
            this.varasto = [
                ...this.varasto,
                {
                    id : id,
                    koko : muokattuTuote.koko,
                    vari : muokattuTuote.vari,
                    varastotilanne : muokattuTuote.varastotilanne
                }    
            ].sort((a : Tuote, b : Tuote) => a.id - b.id);

            await this.tallenna();
        } catch (e : any) {
            throw new Error(e);
        }         
    }

    public poista = async (id : number) : Promise<void> => {

        try {
            this.varasto = this.varasto.filter((tuote : Tuote) => tuote.id !== id);
            await this.tallenna();
        } catch (e : any) {
            throw new Error(e);
        }         

    }

    private tallenna = async () : Promise<void> => {

        try {
            await writeFile(path.resolve(...this.tiedosto), JSON.stringify(this.varasto, null, 2), "utf8");
        } catch (e : any) {
            throw new Error();
        }
    }

}

export default Varasto;
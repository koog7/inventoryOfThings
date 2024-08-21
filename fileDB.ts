import { promises as fs } from 'fs';


const location = './database/locationDB.json';
const category = './database/categoryDB.json';
const accounting = './database/accountingDB.json';

interface Location {
    id: string;
    name: string;
    description?: string;
}
interface Category {
    id: string;
    name: string;
    description?: string;
}
interface Item {
    id: string;
    categoryId: string;
    locationId: string;
    name: string;
    description?: string;
    photo?: string | null;
}


let locationData: Location[] = [];
let categoryData: Category[] = [];
let accountingData: Item[] = [];

type DataType = 'location' | 'category' | 'accounting';

const fileDb = {
    async init(name: DataType) {
        if(name === 'location'){
            try {
                const fileContents = await fs.readFile(location);
                locationData = JSON.parse(fileContents.toString());
            } catch (e) {
                locationData = [];
            }
        }else if(name === 'category'){
            try {
                const fileContents = await fs.readFile(category);
                categoryData = JSON.parse(fileContents.toString());
            } catch (e) {
                categoryData = [];
            }
        }else if(name === 'accounting'){
            try {
                const fileContents = await fs.readFile(accounting);
                accountingData = JSON.parse(fileContents.toString());
            } catch (e) {
                accountingData = [];
            }
        }
    },
    async getItems(name: DataType) {
        if(name === 'location'){
            return locationData;
        }else if(name === 'category'){
            return categoryData;
        } else if(name === 'accounting'){
            return accountingData;
        }
    },
    async addItem(item: Location | Category | Item, name: DataType) {
        if (name === 'location') {
            locationData.push(item as Location);
            await this.save(name);
        } else if (name === 'category') {
            categoryData.push(item as Category);
            await this.save(name);
        } else if (name === 'accounting') {
            accountingData.push(item as Item);
            await this.save(name);
        }
    },
    async save(name: DataType) {
        if(name === 'location'){
            return fs.writeFile(name, JSON.stringify(locationData , null , 2));
        }else if(name === 'category'){
            return fs.writeFile(name, JSON.stringify(categoryData , null , 2));
        } else if(name === 'accounting'){
            return fs.writeFile(name, JSON.stringify(accountingData , null , 2));
        }

    }
};



export default fileDb;
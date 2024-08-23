import { promises as fs } from 'fs';
import path from 'path';

const location = path.join(__dirname, 'database', 'locationDB.json');
const category = path.join(__dirname, 'database', 'categoryDB.json');
const accounting = path.join(__dirname, 'database', 'accountingDB.json');

export interface Location {
    id: string;
    location: string;
    description?: string;
}
export interface Category {
    id: string;
    category: string;
    description?: string;
}
export interface Item {
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

    async removeItem(id: string, name: DataType) {
        let dataArray: (Location | Category | Item)[];

        if (name === 'location') {
            dataArray = locationData;

            const index = locationData.findIndex(item => item.id === id);

            locationData.splice(index, 1);
            await this.save(name);
        } else if (name === 'category') {
            dataArray = categoryData;

            const index = categoryData.findIndex(item => item.id === id);

            categoryData.splice(index, 1);
            await this.save(name);
        } else if (name === 'accounting') {
            dataArray = accountingData;

            const index = dataArray.findIndex(item => item.id === id);

            if (index === -1) {
                throw new Error('item not found');
            }
            dataArray.splice(index, 1);
            await this.save(name);
        }
    },
    async save(name: DataType) {
        if(name === 'location'){
            return fs.writeFile(location, JSON.stringify(locationData , null , 2));
        }else if(name === 'category'){
            return fs.writeFile(category, JSON.stringify(categoryData , null , 2));
        } else if(name === 'accounting'){
            return fs.writeFile(accounting, JSON.stringify(accountingData , null , 2));
        }

    }
};



export default fileDb;
import Database, {FrontendDBStore} from '../../../frontend-db/src';
import getDatabase from './get-database';

class ItemSet
{
   private db: Database;
   private store: FrontendDBStore;
   private data: {[key: string]: {
      name: string,
      usage: number,
   }} = {};
   private storeName: string;

   constructor(storeName)
   {
      this.storeName = storeName;
   }

   async init()
   {
      this.db = await getDatabase();

      if (!await this.db.existsStore(this.storeName)) {
         await this.db.createStore(this.storeName, {}, true, ['name']);
      }
      this.store = await this.db.getStore(this.storeName);

      var records = await this.store.getAllRecordsWithKeys();
      for (var record of records) {
         this.data[record[0] as string] = {
            name: record[1].name,
            usage: record[1].usage
         };
      }
   }

   async add(name: string): Promise<IDBValidKey>
   {
      await this.init();

      var record = {
         name,
         usage: 0
      };

      var key = await this.store.addRecord(record);
      this.data[key as string] = record;

      return key;
   }

   async get(key: IDBValidKey)
   {
      await this.init();
      return this.data[key as string];
   }

   async getForUpdate(key: string)
   {
      await this.init();
      return {
         key,
         name: this.data[key].name
      };
   }

   async getAll() {
      await this.init();
      var data: any[] = [];
      for (var [key, value] of Object.entries(this.data)) {
         data.push([key, value]);
      }
      return data;
   }

   async getAllForUpdate() {
      await this.init();
      var data: any[] = [];
      for (var [key, value] of Object.entries(this.data)) {
         data.push({
            key,
            name: value.name
         });
      }
      return data;
   }

   async remove(key: string)
   {
      await this.init();

      await this.store.deleteRecord(Number(key));
      delete this.data[key];
   }

   async update(key: string, newName: string)
   {
      await this.init();

      await this.store.updateRecord(Number(key), {name: newName});
      this.data[key].name = newName;
   }

   async use(key: number)
   {
      await this.init();

      var newUsage = this.data[key].usage + 1
      await this.store.updateRecord(key, {usage: newUsage})
      this.data[key].usage = newUsage;
   }

   async unUse(key: number)
   {
      await this.init();

      var newUsage = this.data[key].usage - 1;
      await this.store.updateRecord(key, {usage: newUsage})
      this.data[key].usage = newUsage;
   }

   async isInUse(key: number)
   {
      await this.init();

      return this.data[key].usage !== 0;
   }

   async deleteAll()
   {
      this.data = {};
   }
}

export default ItemSet;
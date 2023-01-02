import FrontendDB, { FrontendDBStore } from '../../../p7/src';

import {
   RECIPES_STORE_NAME
} from './constants';
import getDatabase from './get-database';
import {
   categorySet,
   ingredientSet
} from '.';
import ItemSet from './item-set';
import {
   Recipe,
   RecipeItem,
   RecipeFormData,
   RecipeForDisplay
} from './types';
import deepClone from '../helpers/deepClone';


class RecipeList
{
   db: FrontendDB;
   private data: {[key: string]: Recipe} = {};
   private store: FrontendDBStore;


   // Fill the local list with records from the underlying IndexedDB store, or
   // else create a fresh store.
   async init(getNewDB = false)
   {
      // TODO: Prevent this routine if it has been performed already.
      this.db = await getDatabase(getNewDB);

      // If the 'recipes' store doesn't exist, create it first.
      if (!await this.db.existsStore(RECIPES_STORE_NAME)) {
         await this.db.createStore(RECIPES_STORE_NAME, {}, 'id', ['rating']);
      }
      this.store = await this.db.getStore(RECIPES_STORE_NAME);
      var records = await this.store.getAllRecords()
      for (var record of records) {
         this.data[record.id] = record;
      }
   }


   private async getItemAfterPossiblyAdding(name: string, itemSet: ItemSet, isNew: boolean)
   {
      await this.init();

      var itemKey = +name;
      if (isNaN(itemKey)) {
         itemKey = await itemSet.add(name) as number;
      }
      await itemSet.use(itemKey);

      return itemKey;
   }


   private async getRecordForDB(data: RecipeFormData, isNew = false)
   {
      await this.init();

      var items: RecipeItem[] = [];
      for (var item of data.items) {
         var ingredients: IDBValidKey[] = [];

         for (var ingredient of item.ingredients) {
            ingredients.push(await this.getItemAfterPossiblyAdding(
               ingredient, ingredientSet, isNew));
         }

         items.push({
            name: item.name,
            ingredients,
            quantities: item.quantities
         });
      }

      var category = await this.getItemAfterPossiblyAdding(
         data.category, categorySet, isNew);

      // Now, given that we've added the necessary ingredients and the category
      // to their respective data stores, we can safely proceed with adding a
      // new record for the provided recipe data.
      var record: Recipe = {
         name: data.name,
         category: category,
         rating: Number(data.rating),
         yield: data.yield,
         items,
         instructions: data.instructions,
         review: data.review,
         iterationOf: null
      } as Recipe;

      if (isNew) {
         var dateString = '' + Number(new Date());
         record.id = dateString;
         record.dateCreated = dateString;
      }

      return record;
   }


   async addRecipe(data: RecipeFormData)
   {
      await this.init();

      var record = await this.getRecordForDB(data, true);
      await this.store.addRecord(record);
   }


   async getAllRecipes()
   {
      await this.init();

      var records: any[] = [];
      for (var key in this.data) {
         records.push(await this.getRecipe(key, false));
      }
      return records;
   }


   async getRecipe(key: string, withIngredientNames = false)
   {
      await this.init();

      var record = this.data[key];
      var recordCopy = deepClone(record) as RecipeForDisplay;

      // Process category
      recordCopy.category = [
         recordCopy.category,
         (await categorySet.get(record.category)).name
      ];

      // Process ingredients
      if (withIngredientNames) {
         for (var item of recordCopy.items) {
            var ingredientKeysWithNames: [IDBValidKey, string][] = [];
            for (var ingredientKey of item.ingredients) {
               ingredientKeysWithNames.push([
                  ingredientKey,
                  (await ingredientSet.get(ingredientKey)).name
               ]);
               item.ingredients = ingredientKeysWithNames;
            }
         }
      }

      return recordCopy;
   }


   async removeRecipe(key: string)
   {
      await this.init();

      await this.unUseCategoryAndIngredients(key);

      delete this.data[key];
      await this.store.deleteRecord(key);
   }


   async forEachIngredient(key: string, callback: (ingredientKey: IDBValidKey) => void)
   {
      await this.init();

      var record = this.data[key];
      for (var item of record.items) {
         for (var ingredient of item.ingredients) {
            await callback(ingredient);
         }
      }
   }


   async unUseCategoryAndIngredients(key: string)
   {
      await this.init();

      var record = this.data[key];

      // unUse() the category.
      await categorySet.unUse(record.category as number);

      // Go over all ingredients and unUse() each one.
      await this.forEachIngredient(key, async (ingredientKey) => {
         await ingredientSet.unUse(ingredientKey as number);
      });
   }


   async updateRecipe(key: string, data: RecipeFormData)
   {
      await this.init();

      await this.unUseCategoryAndIngredients(key);

      var record = await this.getRecordForDB(data);
      await this.store.updateRecord(key, record);
      this.data[key] = Object.assign(this.data[key], record);
   }

   cloneRecipe() {}


   async searchRecipe(query: string)
   {
      await this.init();

      var results: Recipe[] = [];
      for (var key in this.data) {
         var record = this.data[key];
         if (record.name.toLowerCase().includes(query.toLowerCase())) {
            results.push(await this.getRecipe(key));
         }
      }

      return results;
   }


   async isIngredientInUse(ingredientStringKey: string)
   {
      await this.init();
      return await ingredientSet.isInUse(Number(ingredientStringKey));
   }


   async isCategoryInUse(categoryStringKey: string)
   {
      await this.init();
      return await categorySet.isInUse(Number(categoryStringKey));
   }


   async download()
   {
      await this.init();
      await this.db.exportToJSON();
   }


   async restore(jsonString: string)
   {
      // TODO: Going 'quickly' back to the home page from the restoration page
      // after having clicked the Restore button causes an init() call to be
      // made before the init(true) call down below. This leads to an error
      // since at that init() call, the existing database has been deleted. There
      // are multiple ways to prevent this, and so this can be solved later on.

      // console.log('restore started')
      await this.init();
      await this.db.delete();

      await FrontendDB.restore(jsonString);
      // console.log('restore done')
      await this.init(true);
   }


   async deleteAll()
   {
      await this.init();

      await this.db.delete();
      this.data = {};
      await ingredientSet.deleteAll();
      await categorySet.deleteAll();

      await this.init(true);
   }
}

export default RecipeList;
import FrontendDB, { FrontendDBStore } from '../../../frontend-db/src';

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
   RecipeCompact,
   RecipeDetailed,
   RecipeForUpdate,
   RecipeDetailedIngredientStatus
} from './types';
import deepClone from '../helpers/deepClone';
import diffQuantities from './differ';


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
      var records = await this.store.getAllRecords();
      for (var record of records) {
         this.data[record.id] = record;
      }
   }


   private async getItemAfterPossiblyAdding(name: string, itemSet: ItemSet)
   {
      await this.init();

      var itemKey = +name;
      if (isNaN(itemKey)) {
         itemKey = await itemSet.add(name) as number;
      }
      await itemSet.use(itemKey);

      return itemKey;
   }


   private async getRecordForDB(data: RecipeFormData)
   {
      await this.init();

      var items: RecipeItem[] = [];
      for (var item of data.items) {
         var ingredients: IDBValidKey[] = [];

         for (var ingredient of item.ingredients) {
            ingredients.push(await this.getItemAfterPossiblyAdding(
               ingredient, ingredientSet));
         }

         items.push({
            name: item.name,
            ingredients,
            quantities: item.quantities
         });
      }

      var category = await this.getItemAfterPossiblyAdding(
         data.category, categorySet);

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
         previous: null,
         next: null,
      } as Recipe;

      return record;
   }


   async getNewRecord(recipeFormData: RecipeFormData): Promise<Recipe>
   async getNewRecord(key: string): Promise<Recipe>
   async getNewRecord(formDataOrKey: RecipeFormData | string)
   {
      await this.init();

      var record: Recipe;
      if (typeof formDataOrKey !== 'string') {
         record = await this.getRecordForDB(formDataOrKey as RecipeFormData);
      }
      else {
         record = deepClone(this.data[formDataOrKey as string]);
      }

      var timestamp = Number(new Date());
      record.id = '' + timestamp;
      record.dateCreated = timestamp;

      return record;
   }


   async addRecipe(data: RecipeFormData)
   {
      await this.init();

      var record = await this.getNewRecord(data);
      await this.addRecipeRecord(record);
   }


   private async addRecipeRecord(record: Recipe)
   {
      await this.init();

      await this.store.addRecord(record);
      this.data[record.id] = record;
   }


   private async useCategoryAndIngredients(record: Recipe)
   {
      await this.init();
      for (var item of record.items) {
         for (var ingredient of item.ingredients) {
            await this.getItemAfterPossiblyAdding(ingredient as string, ingredientSet);
         }
      }
      await this.getItemAfterPossiblyAdding(record.category as string, categorySet);
   }


   async cloneRecipe(key: string)
   {
      await this.init();

      var recordClone = await this.getNewRecord(key);
      recordClone.name += ' (copy)';
      recordClone.previous = null;
      recordClone.next = null;

      // 'Use' the ingredients' and the category.
      await this.useCategoryAndIngredients(recordClone);

      await this.addRecipeRecord(recordClone);
      return recordClone.id;
   }


   async makeIteration(key: string)
   {
      await this.init();

      var recordClone = await this.getNewRecord(key);      
      recordClone.previous = key;

      // 'Use' the ingredients' and the category.
      await this.useCategoryAndIngredients(recordClone);

      await this.addRecipeRecord(recordClone);

      await this.store.updateRecord(key, { next: recordClone.id });
      this.data[key].next = recordClone.id;

      return recordClone.id;
   }


   async getAllRecipes()
   {
      await this.init();

      var records: any[] = [];
      for (var key in this.data) {
         var record = this.data[key];
         if (record.next === null) {
            records.push(await this.getRecipe(key));
         }
      }
      return records;
   }


   async getRecipe(key: string)
   {
      await this.init();

      var record = this.data[key];
      var recordProcessed: RecipeCompact = deepClone(record);

      // Process data
      recordProcessed.dateCreated = new Date(record.dateCreated);

      // Process category
      recordProcessed.category = (await categorySet.get(record.category)).name;

      return recordProcessed;
   }
   

   private async compareIngredient(
      key: string,
      itemIndex: number,
      ingredientKey: string
   ): Promise<RecipeDetailedIngredientStatus>
   {
      await this.init();

      var record = this.data[key];
      if (record.previous) {
         var previousRecord = this.data[record.previous as string];
         var ingredients = record.items[itemIndex].ingredients;
         var previousIngredients = previousRecord.items[itemIndex].ingredients;

         // First, determine if the current ingredient is 'new'.
         if (!previousIngredients.includes(ingredientKey)) {
            return 'new';
         }
         else {
            // Given that the current ingredient is not 'new', further check if
            // it has increased or decreased in quantity.

            var quantity = record.items[itemIndex].quantities[ingredients
               .indexOf(ingredientKey)];
            var previousQuantity = previousRecord.items[itemIndex].quantities[
               previousIngredients.indexOf(ingredientKey)];

            return diffQuantities(quantity, previousQuantity);
         }
      }

      else {
         return 'same';
      }
   }


   async getRecipeDetailed(key: string)
   {
      await this.init();

      var record: RecipeDetailed = await this.getRecipe(key) as any;

      // Process ingredients
      var itemIndex = 0;
      for (var item of record.items) {
         var ingredients = item.ingredients;
         for (var i = 0, len = ingredients.length; i < len; i++) {
            ingredients[i] = {
               name: (await ingredientSet.get(ingredients[i] as any)).name,
               status: await this.compareIngredient(key, itemIndex, ingredients[i] as any)
            }
         }
         itemIndex++;
      }

      record.iterations = await this.getIterationDetails(key);

      return record;
   }


   async getRecipeForUpdate(key: string)
   {
      await this.init();

      var record: RecipeForUpdate = deepClone(this.data[key]);

      // Process category
      (record as any).category = await categorySet.getForUpdate(record.category as any);

      // Process ingredients
      for (var item of record.items) {
         var ingredients = item.ingredients;
         for (var i = 0, len = ingredients.length; i < len; i++) {
            ingredients[i] = await ingredientSet.getForUpdate(ingredients[i] as any);
         }
      }

      return record;
   }


   async removeRecipe(key: string)
   {
      await this.init();

      await this.unUseCategoryAndIngredients(key);
      var record = this.data[key];

      // Restructure the iteration pointers.
      if (record.previous) {
         var newNextOfPrevious: IDBValidKey | null = null;
         if (record.next) {
            newNextOfPrevious = record.next;
         }
         await this.updateRecipeRecord(record.previous as string, { next: newNextOfPrevious });
      }

      if (record.next) {
         var newPreviousOfNext: IDBValidKey | null = null;
         if (record.previous) {
            newPreviousOfNext = record.previous;
         }
         await this.updateRecipeRecord(record.next as string, { previous: newPreviousOfNext });
      }

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
      record.previous = this.data[key].previous;
      record.next = this.data[key].next;

      await this.updateRecipeRecord(key, record);
   }


   private async updateRecipeRecord(key: string, record: Object)
   {
      await this.init();
      await this.store.updateRecord(key, record);
      this.data[key] = Object.assign(this.data[key], record);
   }


   async getIterationDetails(key: string)
   {
      await this.init();

      var previous = this.data[key].previous;
      var next = this.data[key].next;

      if (previous || next) {
         var previousRecords = 1;
         while (previous) {
            previousRecords++;
            previous = this.data[previous as string].previous;
         }

         var nextRecords = 0;
         while (next) {
            nextRecords++;
            next = this.data[next as string].next;
         }

         return {
            current: previousRecords,
            total: previousRecords + nextRecords,
            next: this.data[key].next,
            previous: this.data[key].previous
         }
      }

      return null;
   }


   async searchRecipe(query: string)
   {
      await this.init();

      var results: RecipeCompact[] = [];
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

      await this.init();
      await this.db.delete();

      await FrontendDB.restore(jsonString);
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
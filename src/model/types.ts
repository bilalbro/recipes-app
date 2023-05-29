export interface ItemWithName {
   key: IDBValidKey,
   name: string
}


/* Form Data */
export interface RecipeItemFormData {
   name: string;
   ingredients: string[];
   quantities: string[];
}

export interface RecipeFormData {
   name: string;
   category: string;
   rating: string;
   items: RecipeItemFormData[];
   instructions: string;
   review: string;
   yield: string;
}
/* Form Data */


/* Recipe records */
export interface RecipeItem {
   name: string;
   ingredients: IDBValidKey[];
   quantities: string[];
}

export interface Recipe {
   id: string;
   dateCreated: number;
   name: string;
   category: IDBValidKey;
   rating: number;
   items: RecipeItem[];
   instructions: string;
   review: string;
   yield: string;
   previous: IDBValidKey | null;
   next: IDBValidKey | null;
}
/* Recipe records */


/* Recipe representation for 'All Recipes' pages */
export interface RecipeCompact extends Omit<Recipe, 'dateCreated'> {
   dateCreated: Date;
   category: string;
}
/* Recipe representation for 'All Recipes' page */


/* Recipe representation for 'Update' page */
interface RecipeItemForUpdate extends Omit<RecipeItem, 'ingredients'> {
   ingredients: ItemWithName[];
}

export interface RecipeForUpdate extends Omit<RecipeCompact, 'category' | 'items'> {
   category: ItemWithName;
   items: RecipeItemForUpdate[]
}
/* Recipe representation for 'Update' page */


/* Recipe representation for 'Recipe' page */
export type RecipeDetailedIngredientStatus = 'inc' | 'dec' | 'new' | 'same';

export interface RecipeDetailedIngredient {
   name: string,
   status: RecipeDetailedIngredientStatus
}

interface RecipeDetailedItem extends Omit<RecipeItem, 'ingredients'> {
   ingredients: RecipeDetailedIngredient[]
}

export interface RecipeDetailed extends Omit<RecipeCompact, 'items'> {
   items: RecipeDetailedItem[];
   iterations: {
      current: number,
      total: number,
      next: IDBValidKey | null,
      previous: IDBValidKey | null
   } | null;
}
/* Recipe representation for 'Recipe' page */


/* Quantity decomposed */
export interface QuantityDecomposed {
   mantissa: number,
   unit: string | null
}
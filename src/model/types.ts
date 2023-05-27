export interface RecipeItemFormData {
   name: string;
   ingredients: string[];
   quantities: string[];
}

export interface RecipeItem {
   name: string;
   ingredients: IDBValidKey[];
   quantities: string[];
}

export interface RecipeItemProcessed extends RecipeItem {
   ingredients: (number | string)[];
}

export interface ItemWithName {
   key: IDBValidKey,
   name: string
}

export interface RecipeItemForUpdate extends Omit<RecipeItem, 'ingredients'> {
   ingredients: ItemWithName[];
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

export interface RecipeProcessed extends Omit<Recipe, 'dateCreated'> {
   dateCreated: Date;
   category: string;
   items: RecipeItemProcessed[];
}

export interface RecipeDetailed extends RecipeProcessed {
   iterations: {
      current: number,
      total: number,
      next: IDBValidKey | null,
      previous: IDBValidKey | null
   } | null;
}

export interface RecipeDetailedForUpdate extends Omit<RecipeProcessed, 'category' | 'items'> {
   category: ItemWithName;
   items: RecipeItemForUpdate[]
}
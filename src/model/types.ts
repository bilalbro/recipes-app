export interface RecipeItemFormData {
   name: string,
   ingredients: string[],
   quantities: string[]
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

export interface RecipeItem {
   name: string,
   ingredients: IDBValidKey[],
   quantities: string[]
}

export interface Recipe {
   id: string,
   dateCreated: string;
   name: string;
   category: IDBValidKey;
   rating: number;
   items: RecipeItem[];
   instructions: string;
   review: string;
   yield: string;
   iterationOf: string | null;
}

export interface RecipeForDisplay extends Recipe {
   category: [IDBValidKey, string],
   ingredients: [IDBValidKey, string][]
}
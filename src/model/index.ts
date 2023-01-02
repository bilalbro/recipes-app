import { CATEGORIES_STORE_NAME, INGREDIENTS_STORE_NAME } from './constants';
import ItemSet from './item-set';
import RecipeList from './recipe-list';

const recipeList = new RecipeList();
const categorySet = new ItemSet(CATEGORIES_STORE_NAME);
const ingredientSet = new ItemSet(INGREDIENTS_STORE_NAME);

export {
   categorySet,
   ingredientSet,
   recipeList
}


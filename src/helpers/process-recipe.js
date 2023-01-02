export default function processRecipeForm(formData)
{
   var recipe = {};
   var processingIngredients = false;

   recipe.items = [];

   for (var [key, value] of formData) {
      if (key === 'group') {
         processingIngredients = true;
      }
      else if (key === 'groupend') {
         processingIngredients = false;
         continue;
      }

      if (processingIngredients) {
         if (key === 'group') {
            recipe.items.push({
               name: value,
               ingredients: [],
               quantities: []
            });
         }
         else {
            recipe.items[recipe.items.length - 1][key].push(value);
         }
      }

      else {
         recipe[key] = value;
      }
   }

   return recipe;
}
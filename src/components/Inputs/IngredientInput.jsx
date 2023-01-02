import React from 'react';

import { ingredientSet } from '../../model';
import { AutocompleteInput } from '.';

export default function IngredientInput({
   ingredientKey,
   ingredient,
   ...props
})
{
   return (
      <AutocompleteInput
         className="input-text input-text--white"
         name="ingredients"
         value={ingredient}
         hiddenValue={ingredientKey}
         allOnEmpty
         placeholder="Ingredient"
         data={ingredientSet.getAll()}
         filterFunction={(value, entry) => entry[1].name.toLowerCase().indexOf(value.toLowerCase()) !== -1}
         getSuggestionValue={entry => entry[1].name}
         getInputValue={entry => entry[1].name}
         noMatchText={value => `Ingredient '${value}' will be added`}
         getHiddenInputValue={entry => entry[0]}
         {...props}
      />
   );
}
import React from 'react';

import { categorySet } from '../../model';
import { AutocompleteInput } from '.';

export default function CategoryInput({
   category,
   ...props
})
{
   return (
      <AutocompleteInput
         className="input-text"
         name="category"
         value={category.name}
         hiddenValue={category.key}
         placeholder="Category"
         allOnEmpty
         data={categorySet.getAllForUpdate()}
         filterFunction={(value, entry) => entry.name.indexOf(value) !== -1}
         getSuggestionValue={entry => entry.name}
         getInputValue={entry => entry.name}
         noMatchText={value => `Category '${value}' will be added`}
         getHiddenInputValue={entry => entry.key}
         {...props}
      />
   );
}
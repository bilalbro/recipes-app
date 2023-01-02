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
         value={category[1]}
         hiddenValue={category[0]}
         placeholder="Category"
         allOnEmpty
         data={categorySet.getAll()}
         filterFunction={(value, entry) => entry[1].name.indexOf(value) !== -1}
         getSuggestionValue={entry => entry[1].name}
         getInputValue={entry => entry[1].name}
         noMatchText={value => `Category '${value}' will be added`}
         getHiddenInputValue={entry => entry[0]}
         {...props}
      />
   );
}
import React from 'react';
import { Form } from 'react-router-dom';

import {
   TextInput,
   TextAreaInput,
   RatingInput,
   InputGroup,
   InputGroupInline,

   ItemList,
   CategoryInput,
   LoadingSubmitButton,
} from '../components/Inputs';


export default function RecipeForm({
   action,
   data
})
{
   var isAddForm = false;

   if (!data) {
      isAddForm = true;
      data = {
         name: '',
         category: '',
         rating: 0,
         yield: '',
         items: [],
         instructions: '',
         review: ''
      }
   }

   return (
      <Form action={action} method="post">
         <InputGroupInline label="Title">
            <TextInput width="large" name="name" value={data.name}
            placeholder="Enter here..." />
         </InputGroupInline>

         <InputGroupInline label="Category">
            <CategoryInput category={data.category} />
         </InputGroupInline>

         <InputGroup basic>
            <InputGroupInline label="Rating">
               <RatingInput rating={data.rating} />
            </InputGroupInline>
            <InputGroupInline className="input-yield" label="Yield">
               <TextInput name="yield" value={data.yield} width="medium" />
            </InputGroupInline>
         </InputGroup>

         <InputGroup label="Ingredients">
            <ItemList items={data.items} />
         </InputGroup>

         <InputGroup label="Instructions">
            <TextAreaInput name="instructions"
            value={data.instructions} />
         </InputGroup>

         <InputGroup label="Review">
            <TextAreaInput size="small" name="review" value={data.review} />
         </InputGroup>

         <InputGroup>
            <LoadingSubmitButton type="primary">
               {isAddForm ? 'Add Recipe' : 'Update Recipe'}
            </LoadingSubmitButton>
         </InputGroup>
      </Form>
   )
}
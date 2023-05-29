import React from 'react';
import { BiPlus } from 'react-icons/bi';

import {
   InputGroup,
   InputGroupInline,
   TextInput,
   InputList,

   IngredientInput,
   Button,
} from '.';


function AddGroupButton({ onClick })
{
   return (
      <Button type="secondary" onClick={onClick}><BiPlus /> Add Section</Button>
   );
}

function RemoveGroupButton({ onClick })
{
   return (
      <Button type="secondary" error onClick={onClick}>Remove Group</Button>
   );
}

export default function ItemList({ items })
{
   return <>
      <InputList list={items} addButton={AddGroupButton} removeButton={RemoveGroupButton}>
         {({name = '', ingredients = [], quantities = []}, RemoveGroupButton) => (
            <InputGroup basic bg>
               <InputGroup basic>
                  <TextInput className="input-text--heading" width="medium"
                  name="group" value={name} placeholder="Section name"/>
               </InputGroup>

               <InputList focusInput list={ingredients.map((_, i) => [ingredients[i], quantities[i]])}>
                  {([ingredient, quantity = ''], RemoveButton, InsertButton) => (
                     <InputGroup basic>
                        <InputGroupInline style={{marginBottom: 0}}>
                           <IngredientInput {...{
                              ingredientKey: ingredient && ingredient.key,
                              ingredient: ingredient && ingredient.name
                           }} />
                        </InputGroupInline>

                        <InputGroupInline style={{marginBottom: 0}}>
                           <TextInput className="input-text--white" width="small"
                           name="quantities" placeholder="Qty" value={quantity} />
                        </InputGroupInline>

                        <InputGroupInline style={{marginBottom: 0}}>{RemoveButton}</InputGroupInline>
                        <InputGroupInline style={{marginBottom: 0}}>{InsertButton}</InputGroupInline>
                     </InputGroup>
                  )}
               </InputList>
               <InputGroup basic style={{marginTop: 15, marginBottom: 7}}>
                  {RemoveGroupButton}
               </InputGroup>
            </InputGroup>
         )}
      </InputList>
      <input type="hidden" name="groupend" value="true" />
   </>
}
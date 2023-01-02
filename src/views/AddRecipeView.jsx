import React from 'react';
import RecipeForm from '../components/RecipeForm';


export default function AddRecipe()
{   
   return <>
      <h1>Add Recipe</h1>
      <RecipeForm action="/" />
   </>
}
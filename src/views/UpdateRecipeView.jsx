import React from 'react';
import { useLoaderData } from 'react-router-dom';

import RecipeForm from '../components/RecipeForm';


export default function UpdateRecipeView()
{
   const recipe = useLoaderData();
   return <>
      <h1>Update Recipe</h1>
      <RecipeForm data={recipe} />
   </>
}
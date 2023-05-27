import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';

import RecipeCardList from '../components/RecipeCardList';


export default function Home()
{
   const recipes = useLoaderData();

   return (
      recipes.length
      ? <>
         <h1>Home <span className="light">({recipes && recipes.length})</span></h1>
         <RecipeCardList list={recipes} />
      </>
      : (
         <div className="centered">
            <h2>No recipes</h2>
            <p>Go to <Link to="/add">Add Recipe</Link> to add a new recipe.</p>
         </div>
      )
   );
}
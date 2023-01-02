import React from 'react';
import { useLoaderData } from 'react-router-dom';

import RecipeCardList from '../components/RecipeCardList';


export default function Search()
{
   const { query, results } = useLoaderData();
   
   return <>
      <h1>Search for <span className="light">"{query}"</span></h1>
      {results.length
      ? (
         <RecipeCardList list={results} />
      )
      : (
         <p className="text--light">No results found.</p>
      )}
   </>;
}
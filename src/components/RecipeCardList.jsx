import React from 'react';

import RecipeCard from '../components/RecipeCard';


function Recipes({
   list
})
{
   return <>
      {list.map(record => {
         return (
            <RecipeCard key={record.id} data={record} />
         );
      })}
      <div style={{clear: 'both'}}></div>
   </>
}

export default function RecipeCardList({
   list
})
{
   return (
      <div className="recipe-cards">
         <Recipes list={list} />
      </div>
   );
}
import React from 'react';
import { Link } from 'react-router-dom';

import Rating from './Rating';

export default function RecipeCard({
   data
})
{
   const {
      id,
      dateCreated,
      name,
      rating,
      category
   } = data;

   return (
      <div className="recipe-card-wrapper">
         <Link className="recipe-card" to={`/recipe/${id}`}>
            <h4 className="recipe-card_category">{category}</h4>
            <div className="recipe-card_rating">
               <Rating rating={rating}  />
            </div>
            <div className="recipe-card_date">{dateCreated.toDateString()}</div>
            <h2>{name}</h2>
         </Link>
      </div>
   );
}
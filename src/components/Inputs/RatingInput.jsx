import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { classNames } from '../helper';

export default function RatingInput({
   rating: _rating,
   stars = 5
})
{
   const [previousRating, setPreviousRating] = useState(_rating);
   const [rating, setRating] = useState(_rating);

   return (
      <div className="input-group input-group--basic input-rating">
         <input name="rating" type="hidden" value={previousRating}></input>

         {new Array(stars).fill().map((_, i) => (
            <button type="button" key={i} onMouseEnter={() => setRating(i + 1)}
            onMouseLeave={() => setRating(previousRating)} className={classNames({
               'star-input': true,
               'star-input--sel': i < rating
            })} onClick={() => {setPreviousRating(i + 1);setRating(i + 1)}}>
               <FaStar />
            </button>
         ))}
      </div>
   )
}
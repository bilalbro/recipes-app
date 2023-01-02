import React from 'react';
import { FaStar } from 'react-icons/fa';
import { classNames } from './helper';

export default function Rating({
   rating
})
{
   return (
      new Array(5).fill().map((_, i) => (
         <FaStar key={i} className={classNames({
            'star': true,
            'star--sel': i < rating
         })} />
      ))
   )
}
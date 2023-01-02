import React from 'react';
import { useLoaderData, Link, Form, useHref } from 'react-router-dom';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';

import {
   Button,
   LoadingSubmitButton,
   InputGroup
} from '../components/Inputs';
import Rating from '../components/Rating';
import { useModal } from '../helpers/modal';


function IngredientsGroup({
   name,
   ingredients,
   quantities
})
{
   return (
      <li>
         <h4>{name}</h4>
         <ol>
            {ingredients.map((_, i) => (
               <li key={i}>{ingredients[i][1]} - {quantities[i]}</li>
            ))}
         </ol>
      </li>
   )
}

function DeleteRecipeForm()
{
   const { hideModal } = useModal();
   const href = useHref();

   return (
      <Form action={href + '/delete'}>
         <p>Are you sure you want to delete this recipe?</p>
         <InputGroup style={{textAlign: 'right'}}>
            <Button type="secondary" error onClick={() => {hideModal()}}>Cancel</Button>
            &nbsp;&nbsp;
            <LoadingSubmitButton submit onLoad={() => {hideModal()}}>Delete</LoadingSubmitButton>
         </InputGroup>
      </Form>
   )
}

export default function Recipe({})
{
   const {
      name,
      category,
      rating,
      items,
      instructions,
      review
   } = useLoaderData();
   const { showModal } = useModal()

   function onClick() {
      showModal({
         title: 'Delete Recipe',
         body: <DeleteRecipeForm />
      });
   }

   return (
      <div className="recipe">
         <div className="recipe_header">
            <h6 className="text--md text--light">{category[1]}</h6>
            <h1>{name}</h1>

            <div className="recipe_btns">
               <Link to="update" className="recipe_btn btn btn--secondary">
                  <FaPencilAlt />
               </Link>
               <Button type="secondary" onClick={onClick} error className="recipe_btn">
                  <FaTrashAlt />
               </Button>
            </div>
         </div>
         <div className="recipe_rating">
            <Rating rating={rating} />
         </div>
         <div className="recipe_group">
            <div className="recipe_label">Ingredients</div>
            <ol>
               {items.map((item, i) => (
                  <IngredientsGroup key={i} {...item} />
               ))}
            </ol>
         </div>
         <div className="recipe_group">
            <div className="recipe_label">Instructions</div>
            <p>{instructions || '-'}</p>
         </div>
         <div className="recipe_group">
            <div className="recipe_label">Review</div>
            <p>{review || '-'}</p>
         </div>
      </div>
   )
}
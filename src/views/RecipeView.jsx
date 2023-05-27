import React from 'react';
import { useLoaderData, Link, Form, useHref } from 'react-router-dom';
import {
   FaArrowLeft,
   FaArrowRight,
   FaCopy,
   FaFastForward,
   FaPencilAlt,
   FaTrashAlt
} from 'react-icons/fa';

import { recipeList } from '../model';
import {
   Button,
   LoadingSubmitButton,
   InputGroup
} from '../components/Inputs';
import Rating from '../components/Rating';
import { useModal } from '../helpers/modal';
import { classNames } from '../components/helper';


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
               <li key={i}>{ingredients[i]} - {quantities[i]}</li>
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
      id,
      name,
      category,
      rating,
      items,
      instructions,
      review,
      dateCreated,
      iterations
   } = useLoaderData();
   const { showModal } = useModal()

   function onDelete() {
      showModal({
         title: 'Delete Recipe',
         body: <DeleteRecipeForm />
      });
   }

   return (
      <div className="recipe">
         {iterations && (
            <div className="recipe_iterations">
               <h6>Iteration {iterations.current} of {iterations.total}</h6>
               <div className="recipe_btns">
                  <Link to={'/recipe/' + iterations.previous}>
                     <span className={classNames({
                        'light': !iterations.previous
                     })}><FaArrowLeft/></span>
                  </Link>
                  <Link to={'/recipe/' + iterations.next}>
                     <span className={classNames({
                        'light': !iterations.next
                     })}><FaArrowRight/></span>
                  </Link>
               </div>
            </div>
         )}
         <div className="recipe_header">
            <h6 className="text--md text--light">{category}</h6>
            <h1>{name}</h1>

            <div className="recipe_btns">
               <Link to="iterate" className="recipe_btn btn btn--grey">
                  <FaFastForward/>
               </Link>
               <Link to="copy" className="recipe_btn btn btn--grey">
                  <FaCopy/>
               </Link>
               <Link to="update" className="recipe_btn btn btn--secondary">
                  <FaPencilAlt/>
               </Link>
               <Button type="secondary" onClick={onDelete} error className="recipe_btn">
                  <FaTrashAlt/>
               </Button>
            </div>
         </div>
         <div className="recipe_rating">
            <Rating rating={rating} />
         </div>
         <div className="recipe_group--close">
            <div className="light">{dateCreated.toDateString()}</div>
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
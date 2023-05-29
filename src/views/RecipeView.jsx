import React from 'react';
import { useLoaderData, Link, Form, useHref } from 'react-router-dom';
import {
   BiChevronRightCircle,
   BiCopyAlt,
   BiDownArrowAlt,
   BiLeftArrowAlt,
   BiPencil,
   BiPlus,
   BiRightArrowAlt,
   BiTrash,
   BiUpArrowAlt
} from 'react-icons/bi'

import { recipeList } from '../model';
import {
   Button,
   LoadingSubmitButton,
   InputGroup,
   LinkButton
} from '../components/Inputs';
import Rating from '../components/Rating';
import { useModal } from '../helpers/modal';
import { classNames } from '../components/helper';


function getIcon(status) {
   switch (status) {
      case 'inc':
         return <BiUpArrowAlt/>;
      case 'dec':
         return <BiDownArrowAlt/>;
      case 'new':
         return <BiPlus/>;
      default:
         return '';
   }
}

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
               <li key={i} className={classNames({
                  'ingredient': true,
                  [`ingredient--${ingredients[i].status}`]: ingredients[i].status
               })}>
                  <div className="icon">{getIcon(ingredients[i].status)}</div>
                  {ingredients[i].name} - {quantities[i]}
               </li>
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
                  <LinkButton
                     small type="transparent"
                     to={iterations.previous && ('/recipe/' + iterations.previous)}
                  >
                     <span className={classNames({ 'light': !iterations.previous })}>
                        <BiLeftArrowAlt/>
                     </span>
                  </LinkButton>
                  <LinkButton
                     small type="transparent"
                     to={iterations.next && ('/recipe/' + iterations.next)}
                  >
                     <span className={classNames({'light': !iterations.next })}>
                        <BiRightArrowAlt/>
                     </span>
                  </LinkButton>
               </div>
            </div>
         )}
         <div className="recipe_header">
            <h6 className="text--md text--light">{category}</h6>
            <h1>{name}</h1>

            <div className="recipe_btns">
               <Link to="iterate" className="recipe_btn btn btn--grey">
                  <BiChevronRightCircle/>
               </Link>
               <Link to="copy" className="recipe_btn btn btn--grey">
                  <BiCopyAlt/>
               </Link>
               <Link to="update" className="recipe_btn btn btn--secondary">
                  <BiPencil/>
               </Link>
               <Button type="secondary" onClick={onDelete} error className="recipe_btn">
                  <BiTrash/>
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
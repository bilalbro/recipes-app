import React from 'react';
import { useLoaderData, Form, useHref } from 'react-router-dom';
import { BiPencil, BiPlus, BiTrash } from 'react-icons/bi';

import {
   TextInput,
   Button,
   LoadingSubmitButton,
   InputGroup
} from '../components/Inputs';
import { useAlert } from '../helpers/alert';
import { useModal } from '../helpers/modal'; 


function ItemForm({
   buttonValue,
   name,
   itemKey,
})
{
   const { hideModal } = useModal();
   const href = useHref();

   return (
      <Form method="post" action={href}>
         {buttonValue === 'Update'
         ? (
            <InputGroup basic label="Name">
               <TextInput className="input-text--grey" width="full" value={name} name="name" />
            </InputGroup>
         )
         : (
            <p>Are you sure to perform this action?</p>
         )}

         <InputGroup style={{textAlign: 'right'}}>
            <Button type="secondary" error onClick={() => {hideModal()}}>Cancel</Button>
            &nbsp;&nbsp;
            <LoadingSubmitButton submit value={itemKey} name={buttonValue.toLowerCase()}
            onLoad={() => {/* hideModal() */}}>
               {buttonValue}
            </LoadingSubmitButton>
         </InputGroup>
      </Form>
   )
}


function ItemTableRow({
   item
})
{
   const { showModal } = useModal();
   const showAlert = useAlert();
   const [
      itemKey,
      { name, usage }
   ] = item;

   function onUpdateClick() {
      showModal({
         title: 'Updating item',
         body: <ItemForm buttonValue="Update" {...{name, itemKey}} />
      });
   }

   function onRemoveClick() {
      if (usage !== 0) {
         showAlert(`'${name}' is still in use in some recipes. Hence, it can't be deleted.`)
         return;
      }
      showModal({
         title: 'Remove item?',
         body: <ItemForm buttonValue="Delete" {...{name, itemKey}} />
      });
   }

   return (
      <tr>
         <td style={{width: '40%'}}>{name}</td>
         <td>{usage}</td>
         <td>
            <Button type="secondary" small onClick={onUpdateClick}>
               <BiPencil/> <span>Edit</span>
            </Button>
            &nbsp;&nbsp;
            <Button type="secondary" small error onClick={onRemoveClick}>
               <BiTrash/> <span>Delete</span>
            </Button>
         </td>
      </tr>
   )
}


function ItemTable({
   entries
})
{
   return (
      <table className="table">
         <thead>
            <tr><th>Item name</th><th>Usage</th><th>Actions</th></tr>
         </thead>
         <tbody>
            {entries.map(entry => (
               <ItemTableRow key={entry[0]} item={entry} />
            ))}
         </tbody>
      </table>
   )
}

function AddItemForm()
{
   const { hideModal } = useModal();
   const href = useHref();

   return (
      <Form method="post" action={href}>
         <InputGroup basic label="Name">
            <TextInput className="input-text--grey" width="full" name="name" />
         </InputGroup>

         <InputGroup style={{textAlign: 'right'}}>
            <Button type="secondary" error onClick={() => {hideModal()}}>Cancel</Button>
            &nbsp;&nbsp;
            <LoadingSubmitButton submit value="true" name="add" onLoad={() => {hideModal()}}>
               Add
            </LoadingSubmitButton>
         </InputGroup>
      </Form>
   );
}


export default function ItemList({
   title
})
{
   const entries = useLoaderData();
   const { showModal } = useModal();

   function onAddItem() {
      showModal({
         title: 'Add Item',
         body: <AddItemForm />
      });
   }

   return <>
      <h1>{title} <span className="light">({entries.length})</span></h1>

      <Button onClick={onAddItem} type="primary"><BiPlus /> <span>Add</span></Button>
      {entries.length
      ? <ItemTable entries={entries} />
      : null
      }
   </>
}
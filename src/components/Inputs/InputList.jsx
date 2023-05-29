import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BiPlus, BiReply, BiTrash } from 'react-icons/bi';

import Button from './Button';


function DefaultRemoveButton({ onClick })
{
   return (
      <Button type="light" onClick={onClick}><BiTrash /></Button>
   );
}

function DefaultAddButton({ onClick })
{
   return (
      <Button type="light" onClick={onClick}><BiPlus /></Button>
   )
}

function DefaultInsertButton({ onClick })
{
   return (
      <Button type="light" onClick={onClick}><BiReply /></Button>
   )
}


function getUniqueKey(i)
{
   return i + '' + Number(new Date());
}


function useInputList(initialList)
{
   const [list, setList] = useState(initialList.length === 0 ? [[]] : initialList);

   const computedKeys = useMemo(() => {
      return list.map((_, i) => {
         return i;
         // return i + '' + Number(new Date());
      });
   }, []);
   const [keys, setKeys] = useState(computedKeys);

   function add(i) {
      if (i === undefined) {
         setList([...list, []]);
         setKeys([...keys, getUniqueKey(keys.length)]);
      }
      else {
         setList([...list.slice(0, i), [], ...list.slice(i)]);
         setKeys([...keys.slice(0, i), getUniqueKey(i), ...keys.slice(i)]);
      }
   }

   function remove(i) {
      setList( list.filter((_, _i) => i !== _i) );
      setKeys( keys.filter((_, _i) => i !== _i) );
   }

   return {
      keys,
      list,
      add,
      remove
   };
}


export default function InputList({
   list: initialList = [],
   focusInput = false,
   addButton,
   insertButton,
   removeButton,
   children
})
{
   const { list, keys, add, remove } = useInputList(initialList);
   const divElement = useRef();
   const clicked = useRef(false);

   useEffect(() => {
      if (focusInput && clicked.current) {
         console.log('current', divElement.current)
         var inputElement;
         if (clicked.focusIndex === null) {
            inputElement = divElement.current.lastElementChild;
         }
         else {
            inputElement = divElement.current.children[clicked.focusIndex];
         }
         inputElement.getElementsByTagName('input')[0].focus(); 
         clicked.current = false;
      }
   });

   function onClick() {
      clicked.current = true;
      clicked.focusIndex = null;
      add();
   }

   function onInsertClick(i) {
      clicked.current = true;
      clicked.focusIndex = i;
      add(i);
   }

   function onRemoveClick(i) {
      remove(i);
   }

   const AddButton = addButton ? addButton : DefaultAddButton;
   const RemoveButton = removeButton ? removeButton : DefaultRemoveButton;
   const InsertButton = insertButton ? insertButton : DefaultInsertButton;

   return <>
      <div ref={divElement}>
         {list.map((_, i) => (
            <React.Fragment key={keys[i]}>
               {children(
                  list[i],
                  <RemoveButton onClick={() => onRemoveClick(i)} />,
                  <InsertButton onClick={() => onInsertClick(i)} />
               )}
            </React.Fragment>
         ))}
      </div>
      <AddButton onClick={onClick} />
   </>;
}
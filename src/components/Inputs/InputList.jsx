import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import Button from './Button';


function DefaultRemoveButton({
   onClick
})
{
   return (
      <Button type="light" onClick={onClick}><FaTimes /></Button>
   );
}


function DefaultAddButton({
   onClick
})
{
   return (
      <Button type="light" onClick={onClick}><FaPlus /></Button>
   )
}


function useInputList(initialList)
{
   const [list, setList] = useState(initialList.length === 0 ? [[]] : initialList);

   const computedKeys = useMemo(() => {
      return list.map((_, i) => {
         return i;
      });
   }, []);
   const [keys, setKeys] = useState(computedKeys);

   function add() {
      setList([...list, []]);
      setKeys([
         ...keys,
         keys[keys.length - 1] !== undefined ? keys[keys.length - 1] + 1 : 0
      ]);
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
   removeButton,
   children
})
{
   const { list, keys, add, remove } = useInputList(initialList);
   const divElement = useRef();
   const clicked = useRef(false);

   useEffect(() => {
      if (focusInput && clicked.current) {
         divElement.current.lastElementChild.getElementsByTagName('input')[0].focus();
         clicked.current = false;
      }
   });

   function onClick() {
      clicked.current = true;
      add();
   }

   function onRemoveClick(i) {
      remove(i);
   }

   const AddButton = addButton ? addButton : DefaultAddButton;
   const RemoveButton = removeButton ? removeButton : DefaultRemoveButton;

   return <>
      <div ref={divElement}>
         {list.map((_, i) => (
            <React.Fragment key={keys[i]}>
               {children(
                  list[i],
                  <RemoveButton onClick={() => {onRemoveClick(i)}} />
               )}
            </React.Fragment>
         ))}
      </div>
      <AddButton onClick={onClick} />
   </>;
}
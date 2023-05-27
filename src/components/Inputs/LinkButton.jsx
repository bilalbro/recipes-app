import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from './Button';


export default function LinkButton({
   to,
   children,
   ...props
})
{
   const navigate = useNavigate();

   function onClick() {
      if (to) {
         navigate(to);
      }
   }

   return (
      <Button disabled={!to} onClick={onClick} {...props}>
         {children}
      </Button>
   )
}
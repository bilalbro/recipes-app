import React, { useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';

import Button from './Button';
import { classNames } from '../helper';


export default function LoadingButton({
   children,
   loader,
   loadingText = '',
   disabled,
   ...props
})
{
   const [loading, setLoading] = useState(false);

   function onClick() {
      (async () => {
         setLoading(true);
         await loader();
         setLoading(false);
      })();
   }

   return (
      <Button onClick={onClick} className={classNames({
         'btn--loading': loading,
      })} disabled={loading ? true : disabled} {...props}>
         {loading
         ? <>
            <BiLoaderAlt />&nbsp;
            {loadingText}
         </>
         : children}
      </Button>
   )
}
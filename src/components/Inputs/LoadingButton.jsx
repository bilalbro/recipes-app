import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

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
            <FaSpinner />&nbsp;
            {loadingText}
         </>
         : children}
      </Button>
   )
}
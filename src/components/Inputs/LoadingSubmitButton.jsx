import React, { useEffect, useRef } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import { useNavigation } from 'react-router-dom';

import Button from './Button';
import { classNames } from '../helper';


export default function LoadingSubmitButton({
   children,
   onLoad = x => x,
   ...props
})
{
   const navigation = useNavigation();
   const loadingRef = useRef(null);
   const loading = navigation.state !== 'idle'
                   && navigation.formData
                   /* && navigation.formData.get(props.name) === String(props.value) */;

   if (loading) {
      loadingRef.current = true;
   }

   useEffect(() => {
      if (!loading && loadingRef.current) {
         onLoad();
         loadingRef.current = null;
      }
   }, [loading]);
   
   return (
      <Button className={classNames({
         'btn--loading': loading,
      })} disabled={loading} submit {...props}>
         {loading
         ? <BiLoaderAlt />
         : children}
      </Button>
   )
}
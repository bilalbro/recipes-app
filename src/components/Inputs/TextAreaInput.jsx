import React, {useState, useEffect} from 'react';
import {classNames} from '../helper';

export default function TextAreaInput({
   name,
   className,
   size,
   value = '',
   onChange = x => x,
   ...props
}) {
   const [_value, setValue] = useState(value);

   useEffect(() => {
      setValue(value);
   }, [value]);

   function _onChange(e) {
      onChange(e);
      setValue(e.target.value);
   }

   return <>
      <textarea type="text" value={_value} name={name} className={classNames({
         'input-textarea': true,
         [`input-textarea--${size}`]: size,
         [className]: className,
      })} {...props}
      onChange={_onChange} autoComplete="off" />
   </>
}
import React, {useState, useEffect} from 'react';
import {classNames} from '../helper';

export default function TextInput({
   name,
   className,
   value = '',
   width = 'small',
   size,
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
      <input type="text" value={_value} name={name} className={classNames({
         'input-text': true,
         [className]: className,
         [`input-size--${size}`]: size,
         [`input-width--${width}`]: width,
      })} {...props}
      onChange={_onChange} autoComplete="off" />
   </>
}
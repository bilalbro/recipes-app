import React from 'react';
import {classNames} from '../helper';

export default function Button({
   submit = false,
   type = 'primary',
   small,
   error,
   children,
   className = '',
   ...props
})
{
   return (
      <button type={submit ? 'submit' : 'button'} className={classNames({
         'btn': true,
         [`btn--${type}`]: type,
         'btn--small': small,
         'btn--error': error,
         [className]: true,
      })} {...props}>
         {children}
      </button>
   )
}
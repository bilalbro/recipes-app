import React from 'react';
import {classNames} from '../helper';

export function InputGroup({
   label,
   inline = false,
   basic = false,
   bg = false,
   className,
   children,
   ...props
})
{
   return (
      <div className={classNames({
         'input-group': !inline,
         'input-group--inline': inline,
         'input-group--basic': basic,
         'input-group--bg': bg,
         [className]: className
      })} {...props}>
         {label && <div className="input-label">{label}</div>}
         {children}
      </div>
   );
}

export function InputGroupInline(props) {
   return (
      <InputGroup inline={true} {...props}></InputGroup>
   );
}
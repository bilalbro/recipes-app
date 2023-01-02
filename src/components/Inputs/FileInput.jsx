import React, { useEffect, useRef, useState } from 'react';
import { FaFolder } from 'react-icons/fa';

import { Button, InputGroupInline, TextInput } from '.';


export default function FileInput({
   onLoad = x => x,
   onClear = x => x,
   ...props
})
{
   const [file, setFile] = useState(null);
   const fileInputElement = useRef();

   useEffect(() => {
      if (file) {
         var fr = new FileReader();
         fr.onload = function() {
            onLoad(this.result);
         }
         fr.readAsText(file);
      }
      else {
         onClear();
      }
   }, [file]);

   function onChange(e) {
      setFile(e.target.files[0]);
   }

   function onClick() {
      fileInputElement.current.click();
   }

   return (
      <div className="input-file">
         <InputGroupInline>
            <TextInput disabled width="medium" onClick={onClick}
               value={file?.name || 'No file selected'} />
         </InputGroupInline>

         <InputGroupInline>
            <Button onClick={onClick} {...props}><FaFolder /></Button>
         </InputGroupInline>

         <input ref={fileInputElement} type="file" onChange={onChange}
         style={{display: 'none'}} />
      </div>
   );
}
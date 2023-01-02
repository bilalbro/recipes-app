import React, { useState } from 'react';

import { recipeList } from '../model';
import {
   LoadingButton,
   FileInput,
   InputGroupInline
} from '../components/Inputs';


export default function RestoreSection()
{
   const [disabled, setDisabled] = useState(true);
   const [fileText, setFileText] = useState(null);

   function onLoad(result) {
      setFileText(result);
      setDisabled(false);
   }

   return <>
      <FileInput onLoad={onLoad} />
      <InputGroupInline style={{marginLeft: 10}}>
         <LoadingButton disabled={disabled} type="secondary"
            loader={recipeList.restore.bind(recipeList, fileText)}
            loadingText="Restoring">Restore</LoadingButton>
      </InputGroupInline>
   </>
}
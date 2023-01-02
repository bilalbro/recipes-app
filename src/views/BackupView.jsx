import React from 'react';

import { recipeList } from '../model';
import {
   Button,
   LoadingButton,
} from '../components/Inputs';
import RestoreSection from '../components/RestoreSection';


export default function BackupView()
{
   function onClick() {
      recipeList.download();
   }
   
   return <>
      <h1>Backup</h1>
      <p>Backing up your recipes ensures that any kind of data corruption at the storage end won't waste the endless amount of time that you spent crafting and writing these recipes 🙂.</p>
      <p>The backup file would be a plain JSON (JavaScript Object Notation) file which can be re-fed into this application to restore the version of the database stored in it.</p>
      <Button onClick={onClick}>Download JSON</Button>
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1>Restore</h1>
      <p>Upload a JSON file in order to restore your recipes database.</p>
      <RestoreSection />
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1>Reset</h1>
      <p>Delete all the data associated with this recipes database.</p>
      <LoadingButton loader={recipeList.deleteAll.bind(recipeList)}
         type="secondary" loadingText="Resetting" error>Reset Data</LoadingButton>
   </>
}
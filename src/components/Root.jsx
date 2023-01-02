import React, { useState } from 'react';

import Header from './Header';
import SideBar from './SideBar';
import { Overlay } from '../helpers/overlay';
import { Modal } from '../helpers/modal';
import { Alert } from '../helpers/alert';


export default function Root({
   element
})
{
   const [classApplied, setClassApplied] = useState(false);

   return <>
      <Overlay />
      <Modal />
      <Alert />

      <Header setClassApplied={setClassApplied} />
      <SideBar classApplied={classApplied} />

      <div className="main">
         {element}
      </div>
      <div style={{clear:'both'}}></div>
   </>
}
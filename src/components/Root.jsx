import React, { useState } from 'react';
import { useNavigation } from 'react-router-dom';

import Header from './Header';
import SideBar from './SideBar';
import { Overlay } from '../helpers/overlay';
import { Modal } from '../helpers/modal';
import { Alert } from '../helpers/alert';
import { classNames } from './helper';
import { BiLoaderAlt } from 'react-icons/bi';


export default function Root({
   element
})
{
   const [classApplied, setClassApplied] = useState(false);
   const navigation = useNavigation();
   const isLoading = navigation.state !== 'idle';

   return <>
      <Overlay />
      <Modal />
      <Alert />

      <Header setClassApplied={setClassApplied} />
      <SideBar classApplied={classApplied} />

      <div className={classNames({
         'main': true,
         'main--loading': isLoading
      })}>
         {element}
         {isLoading && (
            <div className="icon btn--loading"><BiLoaderAlt/></div>
         )}
      </div>
      <div style={{clear:'both'}}></div>
   </>
}
import React from 'react';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { useOverlayFunctions } from '../helpers/overlay';
import { Button } from './Inputs';

export default function Header({
   setClassApplied
})
{
   const [showOverlay, hideOverlay] = useOverlayFunctions(
      () => {setClassApplied(true)}, () => {setClassApplied(false)}, 850);

   function onClick() {
      showOverlay();
   }

   return (
      <header>
         <Link to="/" className="header_logo"><img src="/logo.svg" /></Link>
         <Button type="transparent" onClick={onClick}><FaBars /></Button>
      </header>
   )
}
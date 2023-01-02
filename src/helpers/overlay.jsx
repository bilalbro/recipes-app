import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { classNames } from '../components/helper';

var overlayRendered = false;
var setShown = null;
var hideFunctionRef = null;
var widthRef = null;


function resizeHandler() {
   if (innerWidth > widthRef.current) {
      hideOverlay();
   }
}

// Since the functionality of hiding the overlay has to be used in two places,
// i.e. when the overlay is clicked and when some function manually triggers it,
// we create a separate function for it to keep things DRY.
function hideOverlay()
{
   hideFunctionRef.current?.();
   hideFunctionRef.current = null;
   setShown(false);
}

export function useOverlayFunctions(showCallback, hideCallback, width)
{
   if (!overlayRendered) {
      throw new Error('There is no Overlay component rendered in the component tree.');
   }

   return [
      function show() {
         showCallback();
         hideFunctionRef.current = hideCallback;
         widthRef.current = width;
         setShown(true);
      },
      hideOverlay
   ];
}

export function Overlay()
{
   overlayRendered = true;
   const [shown, _setShown] = useState(false);
   const _hideFunctionRef = useRef();
   const _widthRef = useRef();

   useEffect(() => {
      setShown = _setShown;
      hideFunctionRef = _hideFunctionRef;
      widthRef = _widthRef;
   }, []);

   useEffect(() => {
      if (shown && widthRef.current) {
         window.addEventListener('resize', resizeHandler);
         return () => {
            window.removeEventListener('resize', resizeHandler);
         }
      }      
   }, [_widthRef.current]);

   const location = useLocation();

   useEffect(() => {
      hideOverlay();
   }, [location]);


   function onClick() {
      hideOverlay();
   }

   return (
      <div className={classNames({
         'overlay': true,
         'overlay--shown': shown
      })} onClick={onClick}></div>
   );
}
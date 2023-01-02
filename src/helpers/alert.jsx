import React, { useEffect, useState, useRef } from 'react';
import { classNames } from '../components/helper';

var setAlertMessage = null;
var setAlertShown = null;


export function useAlert()
{
   return function showAlert(message) {
      setAlertShown(true);
      setAlertMessage(message);
   };
}

export function Alert()
{
   const [alertMessage, _setAlertMessage] = useState(null);
   const [alertShown, _setAlertShown] = useState(false);
   const timeoutRef = useRef();

   useEffect(() => {
      setAlertShown = _setAlertShown
      setAlertMessage = _setAlertMessage;
   }, []);

   useEffect(() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
         _setAlertShown(false);
      }, 3000);
   });

   return (
      <div className={classNames({
         'alert': true,
         'alert--shown': alertShown
      })}>
         {alertMessage}
      </div>
   );
}
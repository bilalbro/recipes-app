import React from 'react';
import { Form, useRouteError } from 'react-router-dom';

import Root from '../components/Root';


function Error()
{
   const error = useRouteError();

   return (
      <div className="centered">
         <h2>Oops!</h2>
         <p>
            {error.status && error.status === 404
            ? (
               'The requested page does not exist!'
            )
            : <>
               An internal error occured in the system.<br />
               Try refreshing the browser to rectify it.
            </>}
         </p>
      </div>
   )
}

export default function ErrorView()
{
   return (
      <Root element={<Error />} />
   )
}
import React from 'react';
import { Outlet } from 'react-router-dom';

import Root from '../components/Root';


export default function RootView()
{
   return (
      <Root element={<Outlet />} />
   )
}
import React from 'react';
import { Form, Link, useHref, useSearchParams } from 'react-router-dom';
import { FaPlusCircle } from 'react-icons/fa';

import { classNames } from './helper';
import { TextInput } from './Inputs';


function SideBarLink({
   href,
   children
})
{
   const _href = useHref();

   return (
      <li className={classNames({
         'sidebar_entry': true,
         'sidebar_entry--sel': _href.startsWith(href)
      })}><Link to={href}>{children}</Link></li>
   );
}

export default function SideBar({
   classApplied
})
{
   const [searchParams] = useSearchParams();
   const query = searchParams.get('q') || '';

   return (
      <section className={classNames({
         'sidebar': true,
         'sidebar--shown': classApplied
      })}>
         <div className="sidebar_logo">
            <Link to="/"><img src="/logo.svg" /></Link>
         </div>
         <Form action="/search">
            <TextInput className="input-text--heading" name="q" width="full"
            placeholder="Search recipes" value={query} />
         </Form>
         <ul className="sidebar_entries">
            <SideBarLink href="/add"><FaPlusCircle /> <span>Add Recipe</span></SideBarLink>
            <SideBarLink href="/ingredients">Ingredient List</SideBarLink>
            <SideBarLink href="/categories">Category List</SideBarLink>
            <SideBarLink href="/backup">Backup / Reset</SideBarLink>
         </ul>
         <p>Developed with ❤ by <a href="https://github.com/bilalbro">@bilalbro</a>, using Sass, React, React Router and IndexedDB.</p>
      </section>
   )
}
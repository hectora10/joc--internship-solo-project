"use client";

import Link from 'next/link';
import React from 'react';
import { FaHome } from "react-icons/fa";
import { usePathname } from 'next/navigation';

const NavBar = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);

  return (
    <nav className='flex items-center space-x-4 border-b mb-5 px-5 h-14'>
      <Link href='/'><FaHome /></Link>
      {pathSegments.length > 0 && (
        <ul className='flex space-x-2'>
          {pathSegments.map((segment: string, index: number) => {
            const href = '/' + pathSegments.slice(0, index + 1).join('/');

            return (
              <li key={index} className='flex items-center'>
                <span className='text-zinc-500'>/</span>
                <Link
                  href={href}
                  className={`text-zinc-500 hover:text-zinc-800 transition-colors ${
                    index === pathSegments.length - 1 ? 'font-bold' : ''
                  }`}
                >
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  )
}

export default NavBar;
import React, { useState } from 'react';

interface Props {}

const Menu: React.FunctionComponent<Props> = () => {
  const [activeLink, setActiveLink] = useState<'home' | 'about' | 'treemap'| 'linecharts'>('home');

  const handleLinkClick = (link: 'home' | 'about' | 'treemap' | 'linecharts' ) => {
    setActiveLink(link);
  };

  return (
    <nav>
      <ul>
       {/*  <li>
          <button
            className={activeLink === 'home' ? 'active' : ''}
            onClick={() => handleLinkClick('home')}
          >
            Home
          </button>
        </li>
        <li>
          <button
            className={activeLink === 'about' ? 'active' : ''}
            onClick={() => handleLinkClick('about')}
          >
            About
          </button>
        </li>
        <li>
          <button
            className={activeLink === 'treemap' ? 'active' : ''}
            onClick={() => handleLinkClick('treemap')}
          >
            Treemap
          </button>
        </li>
        <li>
          <button
            className={activeLink === 'linecharts' ? 'active' : ''}
            onClick={() => handleLinkClick('linecharts')}
          >
            linecharts
          </button>
        </li> */}
      </ul>
    </nav>
  );
};
export default Menu
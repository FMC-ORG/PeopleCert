import { HelpCircle, LifeBuoy, ListTree } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

import AudienceSwitcher from '@/components/AudienceSwitcher/index.jsx';
import { DarkmodeSwitch } from '@/components/DarkModeSwitcher';
import LocaleSelector from '@/components/LocaleSelector/index.jsx';
import Logo from '@/components/Logo/index.jsx';
import PreviewSearch from '@/widgets/PreviewSearch/index.jsx';

const navLinkClass = ({ isActive }) =>
  `hidden md:inline-flex items-center gap-1.5 text-sm font-medium px-2.5 py-1.5 rounded-md transition-colors ${
    isActive
      ? 'text-peoplecert-orange'
      : 'text-peoplecert-navy/80 hover:text-peoplecert-orange dark:text-gray-200 dark:hover:text-peoplecert-orange'
  }`;

const Header = () => {
  return (
    <div className="header-outer">
      <div className="header-inner">
        <Link to="/" tabIndex={1} className="shrink-0">
          <Logo />
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={navLinkClass}>
            <LifeBuoy className="w-4 h-4" /> Home
          </NavLink>
          <NavLink to="/search?q=certifications" className={navLinkClass}>
            <ListTree className="w-4 h-4" /> Browse topics
          </NavLink>
          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium px-2.5 py-1.5 rounded-md text-peoplecert-navy/80 hover:text-peoplecert-orange dark:text-gray-200 dark:hover:text-peoplecert-orange"
          >
            <HelpCircle className="w-4 h-4" /> Contact
          </a>
        </nav>

        <div className="flex-1 max-w-[520px] hidden sm:block">
          <PreviewSearch rfkId="rfkid_6" defaultItemsPerPage={6} />
        </div>

        <div className="flex items-center gap-1">
          <AudienceSwitcher compact />
          <DarkmodeSwitch />
          <LocaleSelector />
        </div>
      </div>
    </div>
  );
};

export default Header;

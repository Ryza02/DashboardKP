import Link from 'next/link';

const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 p-6 md:p-8 z-20">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Logo */}
        <div className="flex items-center space-x-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4" cy="4" r="2" fill="white"/>
            <circle cx="10" cy="4" r="2" fill="white"/>
            <circle cx="4" cy="10" r="2" fill="white"/>
          </svg>
          <span className="font-bold text-lg">VOS</span>
        </div>
        
        {/* Center Nav */}
        <nav className="hidden md:flex items-center space-x-8 text-sm text-gray-300">
          <Link href="#" className="hover:text-white transition-colors">Intro</Link>
          <Link href="#" className="hover:text-white transition-colors">About</Link>
        </nav>

        {/* Right Text */}
        <div className="hidden lg:block text-right text-xs text-gray-400 max-w-xs">
          <p>VOSgx® is a multi-asset investment and growth equity firm</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
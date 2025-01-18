import { Menu, Recycle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const location = useLocation();
  const isManagementPage = location.pathname === '/bins';

  return (
    <nav className="fixed top-0 left-0 right-0 bg-green-600 shadow-lg z-50 h-16">
      <div className="flex items-center justify-between h-full px-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center w-10 h-10 text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
              <Recycle className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-xl font-bold text-white">
              {isManagementPage ? 'Bins Management' : 'Municipal Smart Bin Dashboard'}
            </span>
          </div>
        </div>
        
        <div className="w-10 lg:hidden" /> {/* Spacer for centering */}
      </div>
    </nav>
  );
}
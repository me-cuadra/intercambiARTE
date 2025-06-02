import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Search, Plus, User, Menu, X, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleConnect = async () => {
    try {
      await connect({ connector: injected() });
      toast.success('Wallet connected successfully!');
    } catch (error) {
      toast.error('Failed to connect wallet');
      console.error('Error connecting wallet:', error);
    }
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary-600">
          IntercambiARTE
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink 
            to="/explore" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <Search size={18} />
            Explore
          </NavLink>
          <NavLink 
            to="/add-asset" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <Plus size={18} />
            Add Asset
          </NavLink>
          <NavLink 
            to="/my-assets" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <User size={18} />
            My Assets
          </NavLink>
        </nav>

        {/* Connect Wallet Button */}
        <div className="hidden md:block">
          {isConnected ? (
            <div className="flex items-center gap-4">
              <div className="bg-primary-50 px-4 py-2 rounded-md text-primary-700 font-medium">
                {formatAddress(address)}
              </div>
              <button 
                onClick={() => disconnect()}
                className="btn btn-outline"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="connect-wallet-btn"
              onClick={handleConnect}
            >
              <Wallet size={18} />
              Connect Wallet
            </motion.button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-neutral-700" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-neutral-100 shadow-md"
        >
          <div className="container mx-auto py-4 flex flex-col gap-4">
            <NavLink 
              to="/explore" 
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Search size={18} />
              Explore
            </NavLink>
            <NavLink 
              to="/add-asset" 
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Plus size={18} />
              Add Asset
            </NavLink>
            <NavLink 
              to="/my-assets" 
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User size={18} />
              My Assets
            </NavLink>
            
            {/* Mobile Connect Wallet Button */}
            {isConnected ? (
              <div className="flex flex-col gap-2">
                <div className="bg-primary-50 px-4 py-2 rounded-md text-primary-700 font-medium text-center">
                  {formatAddress(address)}
                </div>
                <button 
                  onClick={() => {
                    disconnect();
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn btn-outline w-full"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                className="connect-wallet-btn w-full"
                onClick={() => {
                  handleConnect();
                  setIsMobileMenuOpen(false);
                }}
              >
                <Wallet size={18} />
                Connect Wallet
              </button>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag, Package, User, ExternalLink, Download } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import toast from 'react-hot-toast';
import { mockItems } from '../utils/mockData';

const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { account } = useWallet();
  
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  
  useEffect(() => {
    // Simulate fetching item data
    const timer = setTimeout(() => {
      const foundItem = mockItems.find(item => item.id.toString() === id);
      
      if (foundItem) {
        setItem(foundItem);
      }
      
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  const isOwner = item && account && item.owner.slice(-4) === account.slice(-4);
  
  const handleTransfer = async (e) => {
    e.preventDefault();
    
    if (!receiverAddress.trim()) {
      toast.error('Please enter a receiver address');
      return;
    }
    
    setIsTransferring(true);
    
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowTransferModal(false);
      toast.success('Asset transferred successfully!');
      navigate('/my-assets');
    } catch (error) {
      console.error('Error transferring asset:', error);
      toast.error('Failed to transfer asset');
    } finally {
      setIsTransferring(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!item) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Item Not Found</h1>
        <p className="text-neutral-600 mb-6">
          The item you're looking for doesn't exist or has been removed
        </p>
        <Link to="/explore" className="btn btn-primary">
          Back to Explore
        </Link>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-8"
    >
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-auto object-cover aspect-square"
          />
        </div>
        
        {/* Details Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <span className="inline-block bg-primary-100 text-primary-800 text-xs font-medium py-1 px-2 rounded-full">
              {item.category}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
          
          <p className="text-neutral-700 mb-6">
            {item.description}
          </p>
          
          <div className="space-y-4 mb-8">
            {item.brand && (
              <div className="flex items-center gap-2 text-neutral-700">
                <Tag size={18} className="text-neutral-500" />
                <span className="font-medium">Brand:</span> {item.brand}
              </div>
            )}
            
            <div className="flex items-center gap-2 text-neutral-700">
              <Package size={18} className="text-neutral-500" />
              <span className="font-medium">Condition:</span> {item.condition}
            </div>
            
            <div className="flex items-center gap-2 text-neutral-700">
              <Calendar size={18} className="text-neutral-500" />
              <span className="font-medium">Listed:</span> {item.listedDate}
            </div>
            
            <div className="flex items-center gap-2 text-neutral-700">
              <User size={18} className="text-neutral-500" />
              <span className="font-medium">Owner:</span> 
              <span className="text-sm bg-neutral-100 px-2 py-1 rounded-md">
                {item.owner}
              </span>
            </div>
          </div>
          
          {/* Blockchain Info */}
          <div className="bg-neutral-50 p-4 rounded-md mb-6">
            <h3 className="font-semibold mb-2 text-neutral-800">Blockchain Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Network</span>
                <span className="font-medium">Story Protocol (Aeneid)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Token ID</span>
                <a 
                  href={`https://aeneid.explorer.story.foundation/ipa/${item.tokenId || '0x123456789'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary-600 hover:underline flex items-center gap-1"
                >
                  {item.tokenId || '0x1234...6789'}
                  <ExternalLink size={14} />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">License Terms</span>
                <a 
                  href="#"
                  className="font-medium text-primary-600 hover:underline flex items-center gap-1"
                >
                  View Terms
                  <Download size={14} />
                </a>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          {isOwner ? (
            <div className="space-y-3">
              <button 
                onClick={() => setShowTransferModal(true)}
                className="w-full btn btn-primary"
              >
                Transfer Ownership
              </button>
              <button className="w-full btn btn-outline">
                Update Details
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button className="w-full btn btn-primary">
                Request Exchange
              </button>
              <button className="w-full btn btn-outline">
                Contact Owner
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-bold mb-4">Transfer Ownership</h2>
            
            <p className="text-neutral-600 mb-4">
              This will transfer the NFT and ownership of this asset to another wallet address.
            </p>
            
            <form onSubmit={handleTransfer}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Receiver Address
                </label>
                <input 
                  type="text"
                  value={receiverAddress}
                  onChange={(e) => setReceiverAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div className="bg-warning-50 p-3 rounded-md border border-warning-200 mb-4">
                <p className="text-warning-800 text-sm">
                  <strong>Warning:</strong> This action cannot be undone. Make sure you're transferring 
                  to the correct address.
                </p>
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowTransferModal(false)}
                  disabled={isTransferring}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className={`btn btn-primary ${isTransferring ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isTransferring}
                >
                  {isTransferring ? 'Processing...' : 'Confirm Transfer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ItemDetailPage;
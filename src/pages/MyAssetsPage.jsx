import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import ItemCard from '../components/ItemCard';
import { mockItems } from '../utils/mockData';

const MyAssetsPage = () => {
  const { account } = useWallet();
  const [myItems, setMyItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (account) {
      // Simulate fetching user's items
      const timer = setTimeout(() => {
        // Filter items where the last 4 characters of owner address match the user's address
        const userItems = mockItems.filter(item => {
          const ownerLastChars = item.owner.slice(-4);
          const userLastChars = account.slice(-4);
          return ownerLastChars === userLastChars;
        });
        
        setMyItems(userItems);
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [account]);

  if (!account) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-neutral-600 mb-6">
            You need to connect your wallet to view your assets
          </p>
          <img 
            src="https://images.pexels.com/photos/7936602/pexels-photo-7936602.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Connect wallet" 
            className="w-48 h-48 object-cover mx-auto rounded-full mb-6"
          />
          <p className="text-neutral-500 mb-6">
            Connect your MetaMask wallet to access your registered assets and manage them
          </p>
        </div>
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Assets</h1>
          <p className="text-neutral-600">
            Manage your tokenized assets on Story Protocol
          </p>
        </div>
        <Link to="/add-asset" className="btn btn-primary flex items-center gap-2">
          <Plus size={18} />
          Add New Asset
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {myItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {myItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ItemCard item={item} isOwner={true} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <img 
                src="https://images.pexels.com/photos/6863248/pexels-photo-6863248.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="No assets" 
                className="w-48 h-48 object-cover mx-auto rounded-full mb-6"
              />
              <h2 className="text-2xl font-bold mb-2">No Assets Found</h2>
              <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                You haven't registered any assets yet. Start by adding your first item.
              </p>
              <Link to="/add-asset" className="btn btn-primary inline-flex items-center gap-2">
                <Plus size={18} />
                Add Your First Asset
              </Link>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default MyAssetsPage;
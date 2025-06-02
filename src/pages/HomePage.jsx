import { Link } from 'react-router-dom';
import { Search, ArrowRight, ShoppingBag, Shield, Shuffle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ItemCard from '../components/ItemCard';
import { mockItems } from '../utils/mockData';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const featuredItems = mockItems.slice(0, 4);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-16"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16 md:py-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Exchange Physical Goods as Tokenized Assets
              </h1>
              <p className="text-lg text-primary-100 max-w-lg">
                List your items as NFTs on Story Protocol and exchange them securely with other users. 
                A modern approach to peer-to-peer item exchange.
              </p>
              
              <div className="relative mt-8 max-w-lg">
                <input
                  type="text"
                  placeholder="Search for items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input pr-12 text-neutral-900 w-full"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary-500 p-2">
                  <Search size={20} />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-8">
                <Link to="/explore" className="btn btn-secondary">
                  Explore Marketplace
                </Link>
                <Link to="/add-asset" className="btn bg-white text-primary-600 hover:bg-primary-50">
                  List Your Item
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="hidden lg:block"
            >
              <img 
                src="https://images.pexels.com/photos/5905700/pexels-photo-5905700.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Tokenized goods exchange" 
                className="rounded-lg shadow-2xl w-full object-cover max-h-[500px]"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              A new way to exchange physical goods securely using blockchain technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-neutral-50 p-6 rounded-lg text-center"
            >
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={28} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">List Your Item</h3>
              <p className="text-neutral-600">
                Tokenize your physical goods as NFTs on Story Protocol with detailed metadata
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-neutral-50 p-6 rounded-lg text-center"
            >
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={28} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Ownership</h3>
              <p className="text-neutral-600">
                Verify ownership and history on the blockchain with transparent records
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-neutral-50 p-6 rounded-lg text-center"
            >
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shuffle size={28} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Exchange Safely</h3>
              <p className="text-neutral-600">
                Transfer ownership on-chain when exchanging physical goods in person
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Featured Items */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Items</h2>
            <Link to="/explore" className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;
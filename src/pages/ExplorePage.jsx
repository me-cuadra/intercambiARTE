import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import CategoryFilter from '../components/CategoryFilter';
import ItemCard from '../components/ItemCard';
import { mockItems } from '../utils/mockData';

const ExplorePage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(mockItems);
      setFilteredItems(mockItems);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Filter items based on category and search query
  useEffect(() => {
    if (items.length === 0) return;

    let result = [...items];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(item => 
        item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        (item.brand && item.brand.toLowerCase().includes(query))
      );
    }
    
    setFilteredItems(result);
  }, [selectedCategory, searchQuery, items]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All Items</h1>
        <p className="text-neutral-600">
          Browse all tokenized items available for exchange
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search for items..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input pr-12"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
              <Search size={20} />
            </div>
          </div>
          <div className="flex-shrink-0">
            <p className="text-sm text-neutral-500 mb-2 ml-1">Filter by category:</p>
            <CategoryFilter 
              selectedCategory={selectedCategory} 
              onSelectCategory={handleCategoryChange} 
            />
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div>
          <div className="mb-4 text-sm text-neutral-500">
            {filteredItems.length} items found
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ItemCard item={item} />
              </motion.div>
            ))}
          </div>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-neutral-500">No items found matching your criteria</p>
              <button 
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 btn btn-outline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ExplorePage;
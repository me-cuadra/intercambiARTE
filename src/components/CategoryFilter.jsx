import { motion } from 'framer-motion';
import { Car, Smartphone, Sofa, Shirt, Award, Palette, PenTool as Tool, Package } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Items', icon: Package },
  { id: 'vehicles', name: 'Vehicles', icon: Car },
  { id: 'electronics', name: 'Electronics', icon: Smartphone },
  { id: 'furniture', name: 'Furniture', icon: Sofa },
  { id: 'clothing', name: 'Clothing', icon: Shirt },
  { id: 'collectibles', name: 'Collectibles', icon: Award },
  { id: 'art', name: 'Art', icon: Palette },
  { id: 'tools', name: 'Tools', icon: Tool },
];

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = selectedCategory === category.id;
        
        return (
          <motion.button
            key={category.id}
            whileTap={{ scale: 0.95 }}
            className={`category-btn ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCategory(category.id)}
          >
            <Icon size={16} />
            {category.name}
          </motion.button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
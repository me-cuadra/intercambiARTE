import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/helpers';

const ItemCard = ({ item, isOwner = false }) => {
  return (
    <motion.div whileHover={{ y: -5 }} className="item-card">
      <Link to={`/item/${item.id}`}>
        <div className="relative">
          {/* Category Tag */}
          <div className="absolute top-2 left-2 z-10">
            <span className="tag bg-primary-100 text-primary-800">
              {item.category}
            </span>
          </div>
          
          {/* Owner Tag - only shown on profile */}
          {isOwner && (
            <div className="absolute top-2 right-2 z-10">
              <span className="tag bg-success-100 text-success-800">
                My Asset
              </span>
            </div>
          )}
          
          {/* Image */}
          <div className="h-64 overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 truncate">{item.title}</h3>
          <p className="text-neutral-600 text-sm mb-3 line-clamp-2 h-10">
            {item.description}
          </p>
          
          {/* Details */}
          <div className="space-y-1 text-sm text-neutral-500">
            {item.brand && (
              <div className="flex items-center justify-between">
                <span>Brand:</span>
                <span className="font-medium text-neutral-700">{item.brand}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span>Condition:</span>
              <span className="font-medium text-neutral-700">{item.condition}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Listed:</span>
              <span className="font-medium text-neutral-700">{formatDate(item.listedDate)}</span>
            </div>
          </div>
          
          {/* Owner */}
          <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-between items-center">
            <div className="owner-badge">
              Owner: <span className="font-medium ml-1">{item.owner.slice(0, 6)}...{item.owner.slice(-4)}</span>
            </div>
            <span className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-md">
              IntercambiARTE
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ItemCard;
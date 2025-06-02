import { Calendar, Tag, Package } from 'lucide-react';

const AssetPreview = ({ asset }) => {
  return (
    <div className="bg-neutral-50 rounded-lg overflow-hidden border border-neutral-200">
      {/* Image */}
      {asset.imagePreview && (
        <img
          src={asset.imagePreview}
          alt="Asset preview"
          className="w-full h-64 object-cover"
        />
      )}
      
      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <span className="inline-block bg-primary-100 text-primary-800 text-xs font-medium py-1 px-2 rounded-full">
            {asset.category}
          </span>
        </div>
        
        <h2 className="text-xl font-bold mb-2">{asset.title}</h2>
        <p className="text-neutral-700 mb-6">{asset.description}</p>
        
        <div className="space-y-3">
          {asset.brand && (
            <div className="flex items-center gap-2 text-neutral-700">
              <Tag size={18} className="text-neutral-500" />
              <span className="font-medium">Brand:</span> {asset.brand}
            </div>
          )}
          
          <div className="flex items-center gap-2 text-neutral-700">
            <Package size={18} className="text-neutral-500" />
            <span className="font-medium">Condition:</span> {asset.condition}
          </div>
          
          <div className="flex items-center gap-2 text-neutral-700">
            <Calendar size={18} className="text-neutral-500" />
            <span className="font-medium">Listing Date:</span> {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetPreview;
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, AlertCircle, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import AssetPreview from '../components/AssetPreview';
import { useStoryProtocol } from '../hooks/useStoryProtocol';
import { calculateFileHash, uploadFileToIPFS } from '../utils/storyProtocolUtils';

const AddAssetPage = () => {
  const { address } = useAccount();
  const { registerAsset, isReady, isRegistering } = useStoryProtocol();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    brand: '',
    imageFile: null,
    imagePreview: null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [errors, setErrors] = useState({});
  
  const categories = [
    'Vehicles',
    'Electronics',
    'Furniture',
    'Clothing',
    'Collectibles',
    'Art',
    'Tools',
    'Other'
  ];
  
  const conditions = [
    'New',
    'Like New',
    'Excellent',
    'Good',
    'Fair',
    'Poor'
  ];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar errores al cambiar el valor
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño y tipo de archivo
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('La imagen es demasiado grande. Máximo 5MB.');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona un archivo de imagen válido.');
        return;
      }
      
      setFormData({
        ...formData,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };
  
  const handleImageClick = () => {
    if (!formData.imagePreview && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const validateStep1 = () => {
    const newErrors = {};
    let isValid = true;
    
    if (!formData.title.trim()) {
      newErrors.title = 'Por favor ingresa un título';
      toast.error(newErrors.title);
      isValid = false;
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Por favor ingresa una descripción';
      toast.error(newErrors.description);
      isValid = false;
    }
    
    if (!formData.category) {
      newErrors.category = 'Por favor selecciona una categoría';
      toast.error(newErrors.category);
      isValid = false;
    }
    
    if (!formData.imageFile) {
      newErrors.imageFile = 'Por favor sube una imagen';
      toast.error(newErrors.imageFile);
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const validateStep2 = () => {
    const newErrors = {};
    let isValid = true;
    
    if (!formData.condition) {
      newErrors.condition = 'Por favor selecciona una condición';
      toast.error(newErrors.condition);
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrev = (e) => {
    e.preventDefault();
    setStep(1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar según el paso actual
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
        window.scrollTo(0, 0);
      }
      return;
    }
    
    // Validar paso 2
    if (!validateStep2()) return;
    
    // Capture address at moment of submission
    const currentAddress = address;
    if (!currentAddress) {
      toast.error('Por favor conecta tu wallet primero');
      return;
    }
    
    if (!isReady) {
      toast.error('Cliente de Story Protocol no está listo');
      return;
    }
    
    setIsSubmitting(true);
    setIsUploading(true);
    
    try {
      // Mostrar mensaje de carga para IPFS
      const uploadToast = toast.loading('Subiendo imagen a IPFS...');
      
      // Upload image to IPFS first
      const imageUrl = await uploadFileToIPFS(formData.imageFile);
      
      // Calculate image hash
      const imageHash = await calculateFileHash(formData.imageFile);
      
      toast.dismiss(uploadToast);
      toast.success('Imagen subida exitosamente');
      
      setIsUploading(false);
      
      // Mostrar mensaje de registro
      const registerToast = toast.loading('Registrando asset en Story Protocol...');
      
      // Secondary address check before registration
      if (!currentAddress) {
        toast.error('Wallet desconectada durante la operación');
        return;
      }
      
      // Register asset with captured address
      const result = await registerAsset({
        title: formData.title,
        description: formData.description,
        image: imageUrl,
        imageHash,
        category: formData.category,
        condition: formData.condition,
        brand: formData.brand,
        owner: currentAddress // Use captured address
      });
      
      toast.dismiss(registerToast);
      
      console.log('Asset registrado:', {
        txHash: result.txHash,
        ipId: result.ipId,
        explorerUrl: result.explorerUrl
      });
      
      // Mostrar toast con enlace al explorador
      toast((t) => (
        <div className="flex flex-col gap-2">
          <p>Asset registrado exitosamente!</p>
          <a 
            href={result.explorerUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-primary-600 text-white px-4 py-2 rounded text-center"
          >
            Ver en Story Explorer
          </a>
        </div>
      ), { duration: 8000 });
      
      // Redirigir después de un breve retraso para que el usuario vea el toast
      setTimeout(() => {
        navigate('/my-assets', { 
          state: { 
            registeredAsset: {
              ...formData,
              txHash: result.txHash,
              ipId: result.ipId,
              explorerUrl: result.explorerUrl
            } 
          }
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error registering asset:', error);
      // El error específico ya se maneja en el hook useStoryProtocol
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };
  
  if (!address) {
    return (
      <div className="container mx-auto py-16 text-center">
        <AlertCircle size={48} className="mx-auto text-warning-500 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Wallet Connection Required</h1>
        <p className="text-neutral-600 mb-6">
          You need to connect your wallet to add a new asset
        </p>
        <button 
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          Go to Home
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-8 text-center">Registrar Nuevo Asset</h1>
      
      {/* Progress Steps */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center">
          <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step === 1 ? 'bg-primary-600 text-white' : 'bg-primary-200'}`}>
            1
          </div>
          <div className="h-1 w-16 bg-gray-200 mx-2"></div>
          <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step === 2 ? 'bg-primary-600 text-white' : 'bg-primary-200'}`}>
            2
          </div>
        </div>
      </div>
      
      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            key={`step-${step}`}
          >
            <form onSubmit={step === 1 ? handleNext : handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
              {step === 1 && (
                <>
                  <h2 className="text-xl font-semibold mb-6">Información Básica</h2>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título*
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Nombre del asset"
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción*
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Describe tu asset"
                    ></textarea>
                    {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría*
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Selecciona una categoría</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Imagen*
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center ${
                        errors.imageFile ? 'border-red-500' : formData.imageFile ? 'border-primary-500' : 'border-gray-300'
                      }`}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      {formData.imagePreview ? (
                        <div className="relative">
                          <img
                            src={formData.imagePreview}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded-md"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData({ ...formData, imageFile: null, imagePreview: null });
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div 
                          className="space-y-2 cursor-pointer"
                          onClick={handleImageClick}
                        >
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            Arrastra una imagen o haz clic para seleccionar
                          </p>
                          <p className="text-xs text-gray-400">
                            PNG, JPG, GIF hasta 5MB
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                    {errors.imageFile && <p className="mt-1 text-sm text-red-500">{errors.imageFile}</p>}
                  </div>
                </>
              )}
              
              {step === 2 && (
                <>
                  <h2 className="text-xl font-semibold mb-6">Detalles Adicionales</h2>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Condición*
                    </label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.condition ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Selecciona una condición</option>
                      {conditions.map((condition) => (
                        <option key={condition} value={condition}>
                          {condition}
                        </option>
                      ))}
                    </select>
                    {errors.condition && <p className="mt-1 text-sm text-red-500">{errors.condition}</p>}
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marca (opcional)
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Marca o fabricante"
                    />
                  </div>
                  
                  <div className="mt-8 border-t pt-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Al registrar este asset, se creará un NFT en Story Protocol que representa la propiedad intelectual del mismo.
                    </p>
                  </div>
                </>
              )}
              
              <div className="flex justify-between mt-6">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                )}
                
                {step === 1 ? (
                  <button
                    type="submit"
                    className="ml-auto px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-auto px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        {isUploading ? 'Subiendo...' : 'Registrando...'}
                        <Loader2 className="animate-spin h-4 w-4" />
                      </>
                    ) : (
                      'Registrar Asset'
                    )}
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
        
        {/* Preview */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6">Vista Previa</h2>
              <AssetPreview asset={formData} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AddAssetPage;
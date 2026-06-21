import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api.js';
import { toast } from 'react-toastify';
import { PackagePlus, UploadCloud, Loader2 } from 'lucide-react';

const AddItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Books');
  const [condition, setCondition] = useState('Good');
  const [image, setImage] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const { data } = await api.get(`/products/${id}`);
          setTitle(data.title);
          setDescription(data.description);
          setPrice(data.price);
          setCategory(data.category);
          setCondition(data.condition);
          setImage(data.images[0] || '');
        } catch (error) {
          toast.error('Failed to load item for editing');
          navigate('/dashboard');
        }
      };
      fetchProduct();
    }
  }, [id, navigate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await api.post('/upload', formData, config);
      setImage(data.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error('Please upload at least one image');
      return;
    }
    setSubmitting(true);
    
    const productData = {
      title,
      description,
      price: Number(price),
      category,
      condition,
      images: [image],
    };

    try {
      if (id) {
        await api.put(`/products/${id}`, productData);
        toast.success('Item updated successfully');
      } else {
        await api.post('/products', productData);
        toast.success('Item listed successfully');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to list item');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100">
        <div className="text-center mb-10">
          <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <PackagePlus className="h-8 w-8 text-blue-600 -rotate-3" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {id ? 'Edit Item' : 'List a New Item'}
          </h2>
          <p className="mt-3 text-gray-500 font-medium">Fill in the details to sell your item.</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Item Title</label>
              <input
                type="text"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-medium transition-colors bg-gray-50 focus:bg-white"
                placeholder="e.g. Calculus Early Transcendentals 8th Edition"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea
                required
                rows={4}
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-medium transition-colors bg-gray-50 focus:bg-white"
                placeholder="Describe your item in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price ($)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-medium transition-colors bg-gray-50 focus:bg-white"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-medium transition-colors bg-gray-50 focus:bg-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Books">Books</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Notes">Notes</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Condition</label>
              <select
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-medium transition-colors bg-gray-50 focus:bg-white"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="space-y-1 text-center">
                  {image ? (
                    <div className="mb-4">
                      <img src={image} alt="Preview" className="mx-auto h-32 object-cover rounded-lg shadow-sm" />
                    </div>
                  ) : (
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label className="relative cursor-pointer bg-white rounded-md font-bold text-blue-600 hover:text-blue-500 focus-within:outline-none px-2 py-1">
                      <span>Upload a file</span>
                      <input type="file" className="sr-only" onChange={uploadFileHandler} accept="image/*" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
              {uploading && <p className="text-sm text-blue-600 mt-2 flex items-center gap-1"><Loader2 className="animate-spin h-4 w-4" /> Uploading image...</p>}
            </div>
          </div>

          <div className="pt-5">
            <button
              type="submit"
              disabled={submitting || uploading}
              className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-lg disabled:opacity-70 transition-all transform hover:-translate-y-0.5"
            >
              {submitting ? 'Processing...' : (id ? 'Update Item' : 'List Item')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;

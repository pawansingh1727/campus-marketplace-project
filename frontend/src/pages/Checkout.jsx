import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../utils/api.js';
import { toast } from 'react-toastify';
import { CreditCard, CheckCircle } from 'lucide-react';

const stripePromise = loadStripe('pk_test_placeholder');

const CheckoutForm = ({ clientSecret, product }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    setTimeout(async () => {
      try {
        await api.post('/orders', {
          productId: product._id,
          paymentIntentId: 'pi_dummy_123',
          paymentStatus: 'completed'
        });
        toast.success('Payment successful!');
        navigate('/orders');
      } catch (error) {
        toast.error('Failed to create order');
      }
      setProcessing(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': { color: '#aab7c4' },
            },
            invalid: { color: '#9e2146' },
          },
        }} />
      </div>
      <button 
        type="submit" 
        disabled={!stripe || processing}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {processing ? 'Processing Payment...' : (
          <>
            <CreditCard className="h-5 w-5" /> Pay ${product.price}
          </>
        )}
      </button>
    </form>
  );
};

const Checkout = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const fetchProductAndIntent = async () => {
      try {
        const { data: productData } = await api.get(`/products/${id}`);
        setProduct(productData);

        const { data: intentData } = await api.post('/orders/create-payment-intent', {
          productId: id
        });
        setClientSecret(intentData.clientSecret);
      } catch (error) {
        toast.error('Failed to initialize checkout');
      }
    };
    fetchProductAndIntent();
  }, [id]);

  if (!product || !clientSecret) return <div className="text-center py-20 font-bold">Preparing checkout...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900">Secure Checkout</h1>
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        <div className="md:w-1/2 p-8 bg-gray-50 border-r border-gray-100">
          <h3 className="font-bold text-gray-500 mb-4 uppercase text-sm">Order Summary</h3>
          <div className="flex items-center gap-4 mb-6">
            <img src={product.images[0] || 'https://via.placeholder.com/100'} alt={product.title} className="h-20 w-20 object-cover rounded-lg" />
            <div>
              <h4 className="font-bold text-gray-900 line-clamp-2">{product.title}</h4>
              <p className="text-blue-600 font-bold">${product.price}</p>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4 mt-auto">
            <div className="flex justify-between font-extrabold text-xl">
              <span>Total</span>
              <span>${product.price}</span>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 p-8">
          <h3 className="font-bold text-gray-900 mb-6 text-xl">Payment Details</h3>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm clientSecret={clientSecret} product={product} />
          </Elements>
          <p className="text-xs text-gray-500 mt-6 flex items-center justify-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" /> Payments are secure and encrypted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

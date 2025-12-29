import { Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OrderSuccess = () => {
  return (
    <div className="max-w-2xl mx-auto py-24 px-4 text-center">
      {/* Success Icon */}
      <div className="flex justify-center mb-10">
        <div className="bg-green-100 p-6 rounded-full animate-in zoom-in duration-500">
          <CheckCircle2 size={64} className="text-green-600" />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-5xl font-black mb-6 uppercase tracking-tighter italic">
        Success!
      </h1>
      <h2 className="text-2xl font-bold mb-6">Your order is being processed</h2>
      
      <p className="text-gray-500 max-w-md mx-auto mb-16 leading-relaxed">
        We've received your order and sent a confirmation email to your inbox. 
        Our team is working hard to get your GLAMOUR items to you as soon as possible.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
        <Button variant="outline" className="w-full sm:w-auto px-10 h-14 rounded-none border-2 border-black font-bold hover:bg-black hover:text-white transition-all" asChild>
          <Link to="/">
            <Home size={18} className="mr-2" />
            Back to Home
          </Link>
        </Button>

        <Button className="w-full sm:w-auto px-10 h-14 bg-black text-white rounded-none hover:bg-gray-800 transition-all font-bold" asChild>
          <Link to="/orders">
            <ShoppingBag size={18} className="mr-2" />
            View My Orders
          </Link>
        </Button>
      </div>
      
      {/* Continue Shopping Link (Separated with more space) */}
      <div className="mt-8">
        <Button variant="ghost" className="px-10 h-12 rounded-none hover:bg-gray-100 font-bold underline underline-offset-8 decoration-2" asChild>
          <Link to="/shop">
            Continue Shopping
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </Button>
      </div>

      {/* Support Note */}
      <p className="mt-24 text-sm text-gray-400 border-t pt-8">
        Need help? Contact our support at <span className="text-black font-semibold">support@glamour.com</span>
      </p>
    </div>
  );
};

export default OrderSuccess;
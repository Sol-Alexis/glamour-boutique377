import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  Home,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white border border-gray-200 shadow-xl rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden">
        {/* Decorative Accent */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-72 h-72 bg-green-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-gray-200 rounded-full blur-3xl opacity-40" />
        </div>

        {/* Success Icon */}
        <div className="relative flex justify-center mb-10">
          <div className="bg-green-100 p-6 rounded-full ring-8 ring-green-50 animate-in zoom-in duration-500">
            <CheckCircle2 size={64} className="text-green-600" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Order Confirmed 🎉
        </h1>

        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-6">
          Thank you for shopping with{" "}
          <span className="font-black">GLAMOUR</span>
        </h2>

        <p className="text-gray-500 max-w-lg mx-auto mb-14 leading-relaxed">
          Your order has been successfully placed and is now being processed.
          You’ll receive a confirmation email shortly with all the details.
        </p>

        {/* Highlights */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Sparkles size={18} className="text-black" />
            Premium quality products
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Sparkles size={18} className="text-black" />
            Fast & reliable delivery
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Sparkles size={18} className="text-black" />
            Secure payment
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-12">
          <Button
            variant="outline"
            className="w-full sm:w-auto px-10 h-14 rounded-xl border-2 border-black font-bold hover:bg-black hover:text-white transition-all"
            asChild
          >
            <Link to="/">
              <Home size={18} className="mr-2" />
              Back to Home
            </Link>
          </Button>

          <Button
            className="w-full sm:w-auto px-10 h-14 bg-black text-white rounded-xl hover:bg-gray-800 transition-all font-bold shadow-lg"
            asChild
          >
            <Link to="/orders">
              <ShoppingBag size={18} className="mr-2" />
              View My Orders
            </Link>
          </Button>
        </div>

        {/* Continue Shopping */}
        <div className="mt-6">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold text-black hover:opacity-70 transition underline underline-offset-8"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Support Note */}
        <p className="mt-20 text-sm text-gray-400 border-t pt-8">
          Need help? Contact our support at{" "}
          <a
            href="mailto:glamourboutique377@gmail.com"
            className="text-black font-semibold hover:underline"
          >
            glamourboutique377@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;

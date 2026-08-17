import React from "react";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-950 px-5 pb-8 pt-14 text-gray-300 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-extrabold text-[#ff4d2d]">
              MithoDelivery
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
              Your favorite food from your favorite restaurants, delivered
              straight to your doorstep.
            </p>

            <div className="mt-6 flex gap-3">
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition hover:bg-[#ff4d2d] hover:text-white">
                <Facebook size={18} />
              </button>

              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition hover:bg-[#ff4d2d] hover:text-white">
                <Instagram size={18} />
              </button>

              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition hover:bg-[#ff4d2d] hover:text-white">
                <Twitter size={18} />
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white">Company</h3>

            <div className="mt-4 space-y-3 text-sm text-gray-400">
              <button className="block hover:text-[#ff4d2d]">About Us</button>
              <button className="block hover:text-[#ff4d2d]">Contact</button>
              <button className="block hover:text-[#ff4d2d]">Careers</button>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white">Customers</h3>

            <div className="mt-4 space-y-3 text-sm text-gray-400">
              <button className="block hover:text-[#ff4d2d]">
                Restaurants
              </button>
              <button className="block hover:text-[#ff4d2d]">Offers</button>
              <button className="block hover:text-[#ff4d2d]">My Orders</button>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white">Contact</h3>

            <div className="mt-4 space-y-3 text-sm text-gray-400">
              <p className="flex items-start gap-2">
                <MapPin size={17} className="mt-0.5 flex-shrink-0" />
                Nepal
              </p>

              <p className="flex items-center gap-2">
                <Phone size={17} />
                +977 9800000000
              </p>

              <p className="flex items-center gap-2">
                <Mail size={17} />
                support@mithodelivery.com
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-6">
          <div className="flex flex-col gap-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 MithoDelivery. All rights reserved.</p>

            <div className="flex gap-5">
              <button className="hover:text-gray-300">
                Privacy Policy
              </button>

              <button className="hover:text-gray-300">
                Terms & Conditions
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
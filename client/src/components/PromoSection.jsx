import React from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PromoSection = () => {
  const navigate = useNavigate();

  return (
    <section className="px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#ff4d2d] px-6 py-12 sm:px-10 lg:px-16">
        <div className="flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
          <div className="max-w-2xl text-white">
            <p className="text-sm font-bold uppercase tracking-wider text-orange-100">
              Ready to order?
            </p>

            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              Your next delicious meal is just a few clicks away.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-orange-50 sm:text-base">
              Create your account, discover restaurants near you and start
              ordering your favorite food today.
            </p>
          </div>

          <button
            onClick={() => navigate("/register")}
            className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-[#ff4d2d] transition hover:bg-orange-50"
          >
            <ShoppingBag size={19} />
            Start Ordering
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
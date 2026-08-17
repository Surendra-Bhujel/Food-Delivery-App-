import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  ArrowRight,
  Utensils,
  Clock,
  Bike,
} from "lucide-react";

import Food from "../assets/Food.avif";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fff9f6] text-gray-900">
      <nav className="fixed top-0 left-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer text-2xl font-bold text-[#ff4d2d] sm:text-3xl"
          >
            MithoDelivery
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-gray-700 transition hover:text-[#ff4d2d]"
            >
              How it works
            </a>

            <a
              href="#restaurants"
              className="text-sm font-medium text-gray-700 transition hover:text-[#ff4d2d]"
            >
              Restaurants
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-gray-700 transition hover:text-[#ff4d2d]"
            >
              About us
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition hover:text-[#ff4d2d] sm:px-4"
            >
              Log in
            </button>

            <button
              onClick={() => navigate("/register")}
              className="rounded-lg bg-[#ff4d2d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e63e1f] sm:px-5"
            >
              Sign up
            </button>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative overflow-hidden pt-[76px]">
          <div className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-20">
            <div className="max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#ff4d2d]/10 px-4 py-2 text-sm font-semibold text-[#ff4d2d]">
                <Bike size={17} />
                Fast food delivery at your doorstep
              </div>

              <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                Your favourite food,
                <span className="block text-[#ff4d2d]">delivered to you.</span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-gray-600 sm:text-lg">
                Discover delicious food from your favourite local restaurants
                and get it delivered fresh and fast, right to your doorstep.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("/register")}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#ff4d2d] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#ff4d2d]/20 transition hover:bg-[#e63e1f]"
                >
                  Order food
                  <ArrowRight size={19} />
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-semibold text-gray-800 transition hover:border-[#ff4d2d] hover:text-[#ff4d2d]"
                >
                  I already have an account
                </button>
              </div>

              <div className="mt-10 flex flex-wrap gap-6 border-t border-gray-200 pt-6">
                <div>
                  <p className="text-2xl font-bold text-gray-900">Fast</p>
                  <p className="text-sm text-gray-500">Delivery</p>
                </div>

                <div className="h-10 w-px bg-gray-200" />

                <div>
                  <p className="text-2xl font-bold text-gray-900">Fresh</p>
                  <p className="text-sm text-gray-500">Food</p>
                </div>

                <div className="h-10 w-px bg-gray-200" />

                <div>
                  <p className="text-2xl font-bold text-gray-900">Local</p>
                  <p className="text-sm text-gray-500">Restaurants</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#ff4d2d]/10 blur-3xl" />

              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-orange-200/40 blur-3xl" />

              <div className="relative overflow-hidden rounded-[30px] shadow-2xl">
                <img
                  src={Food}
                  alt="Delicious food"
                  className="h-[430px] w-full object-cover sm:h-[520px] lg:h-[600px]"
                />

                <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur-sm sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff4d2d]/10 text-[#ff4d2d]">
                      <Utensils size={21} />
                    </div>

                    <div>
                      <p className="font-bold text-gray-900">
                        Delicious food is waiting
                      </p>
                      <p className="text-sm text-gray-500">
                        Order from restaurants near you
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-[#ff4d2d]">
                Simple & easy
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                How MithoDelivery works
              </h2>

              <p className="mt-4 text-gray-600">
                Getting your favourite food delivered is simple.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 bg-[#fff9f6] p-7 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff4d2d]/10 text-[#ff4d2d]">
                  <MapPin size={25} />
                </div>

                <h3 className="mt-5 text-lg font-bold">Choose your location</h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Tell us where you want your food delivered and discover
                  restaurants around you.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-[#fff9f6] p-7 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff4d2d]/10 text-[#ff4d2d]">
                  <Search size={25} />
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  Find your favourite food
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Browse restaurants, explore menus and choose exactly what you
                  are craving.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-[#fff9f6] p-7 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff4d2d]/10 text-[#ff4d2d]">
                  <Clock size={25} />
                </div>

                <h3 className="mt-5 text-lg font-bold">Get it delivered</h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Place your order and track it while your food makes its way to
                  your doorstep.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="restaurants" className="bg-[#fff9f6] py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-[#ff4d2d]">
                  Local food, delivered
                </p>

                <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                  Discover great restaurants around you.
                </h2>

                <p className="mt-5 max-w-xl leading-7 text-gray-600">
                  From quick meals to your favourite local dishes, MithoDelivery
                  helps you discover food and restaurants without leaving your
                  home.
                </p>

                <button
                  onClick={() => navigate("/register")}
                  className="mt-7 flex items-center gap-2 rounded-xl bg-[#ff4d2d] px-6 py-3.5 font-semibold text-white transition hover:bg-[#e63e1f]"
                >
                  Explore restaurants
                  <ArrowRight size={19} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <Utensils className="text-[#ff4d2d]" size={28} />
                  <h3 className="mt-4 font-bold">Wide choice</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Explore different restaurants and food options.
                  </p>
                </div>

                <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                  <Bike className="text-[#ff4d2d]" size={28} />
                  <h3 className="mt-4 font-bold">Fast delivery</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Get your order delivered to your location.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <MapPin className="text-[#ff4d2d]" size={28} />
                  <h3 className="mt-4 font-bold">Easy ordering</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Find food based on your location.
                  </p>
                </div>

                <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                  <Clock className="text-[#ff4d2d]" size={28} />
                  <h3 className="mt-4 font-bold">Track orders</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Follow your order from restaurant to doorstep.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="bg-white py-20">
          <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Hungry? Let's get started.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
              Create your account and start discovering delicious food from
              restaurants near you.
            </p>

            <button
              onClick={() => navigate("/register")}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#ff4d2d] px-7 py-3.5 font-semibold text-white shadow-lg shadow-[#ff4d2d]/20 transition hover:bg-[#e63e1f]"
            >
              Get started
              <ArrowRight size={19} />
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-950 text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-[#ff4d2d]">
                MithoDelivery
              </h2>

              <p className="mt-4 max-w-md text-sm leading-6 text-gray-400">
                Delicious food from your favourite local restaurants, delivered
                straight to your doorstep.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Company</h3>

              <div className="mt-4 flex flex-col gap-3 text-sm text-gray-400">
                <a href="#about" className="hover:text-white">
                  About us
                </a>

                <a href="#how-it-works" className="hover:text-white">
                  How it works
                </a>

                <a href="#restaurants" className="hover:text-white">
                  Restaurants
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Get started</h3>

              <div className="mt-4 flex flex-col gap-3 text-sm text-gray-400">
                <button
                  onClick={() => navigate("/login")}
                  className="text-left hover:text-white"
                >
                  Log in
                </button>

                <button
                  onClick={() => navigate("/register")}
                  className="text-left hover:text-white"
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} MithoDelivery. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

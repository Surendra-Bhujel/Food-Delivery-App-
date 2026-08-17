import React from "react";
import { ArrowRight, Clock, MapPin, Star } from "lucide-react";

const restaurants = [
  {
    name: "Mitho Kitchen",
    cuisine: "Nepali • Newari",
    rating: "4.8",
    time: "25-35 min",
    fee: "Rs. 50 delivery",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Himalayan Bites",
    cuisine: "Momo • Asian",
    rating: "4.7",
    time: "20-30 min",
    fee: "Rs. 40 delivery",
    image:
      "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Urban Burger",
    cuisine: "Burger • Fast Food",
    rating: "4.6",
    time: "25-40 min",
    fee: "Rs. 60 delivery",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
  },
];

const PopularRestaurants = () => {
  return (
    <section id="restaurants" className="px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#ff4d2d]">
              Popular
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Popular restaurants
            </h2>

            <p className="mt-2 text-gray-600">
              Discover restaurants loved by food lovers.
            </p>
          </div>

          <button className="flex items-center gap-2 self-start text-sm font-bold text-[#ff4d2d] sm:self-auto">
            View all
            <ArrowRight size={17} />
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.name}
              className="overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />

                <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-900 shadow">
                  <Star
                    size={14}
                    className="text-yellow-500"
                    fill="currentColor"
                  />
                  {restaurant.rating}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {restaurant.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {restaurant.cuisine}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Clock size={15} />
                    {restaurant.time}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <MapPin size={15} />
                    {restaurant.fee}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRestaurants;
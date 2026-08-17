import React from "react";
import {
  Beef,
  CakeSlice,
  Coffee,
  Drumstick,
  Pizza,
  Soup,
  Utensils,
  Salad,
} from "lucide-react";

const categories = [
  {
    name: "Momo",
    icon: Soup,
  },
  {
    name: "Pizza",
    icon: Pizza,
  },
  {
    name: "Burger",
    icon: Beef,
  },
  {
    name: "Chicken",
    icon: Drumstick,
  },
  {
    name: "Thakali",
    icon: Utensils,
  },
  {
    name: "Desserts",
    icon: CakeSlice,
  },
  {
    name: "Drinks",
    icon: Coffee,
  },
  {
    name: "Healthy",
    icon: Salad,
  },
];

const CategorySection = () => {
  return (
    <section id="categories" className="px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wider text-[#ff4d2d]">
            Explore
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What are you craving?
          </h2>

          <p className="mt-2 text-gray-600">
            Explore popular food categories and find something delicious.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                key={category.name}
                className="group flex flex-col items-center justify-center rounded-2xl bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-[#ff4d2d] transition group-hover:bg-[#ff4d2d] group-hover:text-white">
                  <Icon size={25} />
                </div>

                <span className="mt-3 text-sm font-semibold text-gray-800">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
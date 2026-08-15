import React, { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { serverUrl } from "../App";
import { setRestaurant } from "../redux/ownerSlice";

const CreateEditRestaurant = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { restaurant } = useSelector((state) => state.owner);

  const {
    currentCity,
    currentState,
    currentAddress,
    currentLatitude,
    currentLongitude,
  } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");

  const [phone, setPhone] = useState("");
  const [cuisineType, setCuisineType] = useState("Other");

  const [image, setImage] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);

  const [loading, setLoading] = useState(false);

  // Load restaurant data when editing
  // Load current location when creating
  useEffect(() => {
    if (restaurant) {
      setName(restaurant.name || "");

      setCity(restaurant.address?.city || "");

      setState(restaurant.address?.state || "");

      setAddress(restaurant.address?.formattedAddress || "");

      setFrontendImage(restaurant.logo || null);

      setPhone(restaurant.contact?.phone || "");

      setCuisineType(restaurant.cuisineType?.[0] || "Other");
    } else {
      setName("");

      setCity(currentCity || "");

      setState(currentState || "");

      setAddress(currentAddress || "");

      setPhone("");

      setCuisineType("Other");

      setFrontendImage(null);
    }
  }, [restaurant, currentCity, currentState, currentAddress]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !city || !state || !address) {
      alert("Please fill in all restaurant details.");
      return;
    }

    if (!phone) {
      alert("Please enter restaurant phone number.");
      return;
    }

    if (
      currentLatitude === null ||
      currentLatitude === undefined ||
      currentLongitude === null ||
      currentLongitude === undefined
    ) {
      alert(
        "Location is not available. Please allow location access and try again.",
      );
      return;
    }

    try {
      setLoading(true);

      let result;

      // EDIT
      if (restaurant) {
        const editFormData = new FormData();

        editFormData.append("name", name);
        editFormData.append("city", city);
        editFormData.append("state", state);
        editFormData.append("address", address);
        editFormData.append("phone", phone);
        editFormData.append("cuisineType", JSON.stringify([cuisineType]));
        editFormData.append("latitude", currentLatitude);
        editFormData.append("longitude", currentLongitude);

        if (image) {
          editFormData.append("image", image);
        }

        result = await axios.put(
          `${serverUrl}/api/restaurants/${restaurant._id}`,
          editFormData,
          {
            withCredentials: true,
          },
        );
      }

      // CREATE
      else {
        const createFormData = new FormData();

        createFormData.append("name", name);
        createFormData.append("city", city);
        createFormData.append("state", state);
        createFormData.append("address", address);
        createFormData.append("phone", phone);
        createFormData.append("cuisineType", JSON.stringify([cuisineType]));
        createFormData.append("latitude", currentLatitude);
        createFormData.append("longitude", currentLongitude);

        if (image) {
          createFormData.append("image", image);
        }

        result = await axios.post(
          `${serverUrl}/api/restaurants`,
          createFormData,
          {
            withCredentials: true,
          },
        );
      }

      console.log("Restaurant response:", result.data);

      dispatch(setRestaurant(result.data.data));

      navigate("/");
    } catch (error) {
      console.log("Restaurant error:", error.response?.data || error.message);

      alert(error.response?.data?.message || "Failed to save restaurant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-white p-6">
      {/* Back button */}
      <div
        className="absolute left-5 top-5 z-10 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <IoMdArrowBack size={35} className="text-[#ff4d2d]" />
      </div>

      {/* Card */}
      <div className="w-full max-w-lg rounded-2xl border border-orange-100 bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 rounded-full bg-orange-100 p-4">
            <FaUtensils className="h-16 w-16 text-[#ff4d2d]" />
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900">
            {restaurant ? "Edit Restaurant" : "Add Restaurant"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>

            <input
              type="text"
              placeholder="Enter Restaurant Name"
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Image */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Restaurant Image
            </label>

            <input
              type="file"
              accept="image/*"
              className="w-full rounded-lg border px-4 py-2"
              onChange={handleImageChange}
            />

            {frontendImage && (
              <div className="mt-3 overflow-hidden rounded-xl border">
                <img
                  src={frontendImage}
                  alt="Restaurant"
                  className="h-48 w-full object-cover"
                />
              </div>
            )}

            {restaurant && (
              <p className="mt-1 text-xs text-gray-400">
                Leave empty to keep the current image.
              </p>
            )}
          </div>

          {/* Cuisine */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Cuisine
            </label>

            <select
              value={cuisineType}
              onChange={(e) => setCuisineType(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Nepali">Nepali</option>

              <option value="Fast Food">Fast Food</option>

              <option value="Indian">Indian</option>

              <option value="Chinese">Chinese</option>

              <option value="Italian">Italian</option>

              <option value="Japanese">Japanese</option>

              <option value="Mexican">Mexican</option>

              <option value="Thai">Thai</option>

              <option value="American">American</option>

              <option value="Mediterranean">Mediterranean</option>

              <option value="Other">Other</option>
            </select>
          </div>

          {/* City / State */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                City
              </label>

              <input
                type="text"
                placeholder="City"
                className="w-full rounded-lg border px-4 py-2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                State
              </label>

              <input
                type="text"
                placeholder="State"
                className="w-full rounded-lg border px-4 py-2"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Address
            </label>

            <input
              type="text"
              placeholder="Enter Restaurant Address"
              className="w-full rounded-lg border px-4 py-2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone
            </label>

            <input
              type="tel"
              placeholder="Enter restaurant phone"
              className="w-full rounded-lg border px-4 py-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Save */}
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-lg bg-[#ff4d2d] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEditRestaurant;

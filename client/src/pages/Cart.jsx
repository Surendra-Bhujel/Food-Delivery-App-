import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";

import Nav from "../components/Nav.jsx";
import CartItemCard from "../components/CartItemCard.jsx";
import {
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "../redux/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, totalAmount, loading, restaurant } = useSelector(
    (state) => state.cart,
  );

  const handleIncrease = async (item) => {
    await dispatch(
      updateCartItemQuantity({
        itemId: item._id,
        quantity: item.quantity + 1,
      }),
    );
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) {
      await dispatch(removeCartItem(item._id));
      return;
    }

    await dispatch(
      updateCartItemQuantity({
        itemId: item._id,
        quantity: item.quantity - 1,
      }),
    );
  };

  const handleRemove = async (item) => {
    await dispatch(removeCartItem(item._id));
  };

  const handleClearCart = async () => {
    const confirmed = window.confirm("Clear your entire cart?");
    if (!confirmed) return;

    await dispatch(clearCart());
  };

  const deliveryFee = restaurant?.deliveryFee ?? 0;
  const grandTotal = totalAmount + deliveryFee;

  return (
    <div className="min-h-screen bg-[#fff9f6]">
      <Nav />

      <main className="mx-auto w-full max-w-3xl px-4 pb-10 pt-[100px] sm:px-6">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-700 transition hover:text-[#ff4d2d]"
        >
          <IoMdArrowBack size={22} />
          <span>Back</span>
        </button>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Your Cart
          </h1>

          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-sm font-medium text-red-500 hover:text-red-600"
            >
              Clear Cart
            </button>
          )}
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <p className="text-gray-500">Loading your cart...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <FiShoppingCart className="mx-auto h-12 w-12 text-gray-300" />

            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              Your cart is empty
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Add items from a restaurant to get started.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-5 rounded-lg bg-[#ff4d2d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e63e1f]"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <CartItemCard
                  key={item._id}
                  item={item}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            {/* Bill Summary */}
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-bold text-gray-800">
                Bill Summary
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Item Total</span>
                  <span>Rs. {totalAmount}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>Rs. {deliveryFee}</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-lg font-bold text-gray-800">
                <span>Total</span>
                <span className="text-[#ff4d2d]">Rs. {grandTotal}</span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full rounded-lg bg-[#ff4d2d] px-5 py-3 font-semibold text-white transition hover:bg-[#e63e1f]"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Cart;

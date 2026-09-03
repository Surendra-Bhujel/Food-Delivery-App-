# 🍔 MithoDelivery

> A comprehensive full-stack food delivery platform connecting customers, restaurants, and delivery riders with real-time order tracking and geolocation-based delivery management.

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express-5.2-000000?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-9.7-13AA52?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.3-06B6D4?style=flat-square&logo=tailwindcss)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=flat-square&logo=socket.io)
![License](https://img.shields.io/badge/License-ISC-green?style=flat-square)

---

## ✨ Overview

**MithoDelivery** is a production-ready food delivery ecosystem built with modern web technologies. It enables customers to browse restaurants and order food, restaurant owners to manage menus and orders, and delivery riders to manage and track deliveries in real-time.

### Key Capabilities
- 🔐 **Role-Based Access Control** - Customer, Owner, and Rider roles with distinct dashboards
- 🗺️ **Real-time Order Tracking** - Live GPS tracking with interactive maps
- 💬 **Real-time Updates** - Socket.IO powered instant notifications
- 📱 **Responsive Design** - Mobile-friendly interface with Tailwind CSS
- 🔄 **State Management** - Redux Toolkit for predictable app state
- 🌐 **OAuth Support** - Google authentication integration
- 📸 **Cloud Storage** - Cloudinary for image uploads
- 💳 **Payment Ready** - Stripe integration support

---

## 🎯 Features

### 👥 Customer Features
- ✅ User registration, login, and Google OAuth
- ✅ Password recovery via OTP
- ✅ Browse restaurants with filters (cuisine, location, rating)
- ✅ View detailed menus with prices and nutritional info
- ✅ Add/remove items from shopping cart
- ✅ Checkout with multiple payment methods
- ✅ Real-time order tracking with rider location
- ✅ View order history and details
- ✅ Rate restaurants and delivery riders

### 🏪 Restaurant Owner Features
- ✅ Create and manage restaurant profile
- ✅ Set operating hours and delivery fees
- ✅ Add, edit, and delete menu items with images
- ✅ Toggle item availability
- ✅ View incoming orders in real-time
- ✅ Confirm and assign riders to orders
- ✅ Track order progress
- ✅ Owner dashboard with statistics

### 🚴 Delivery Rider Features
- ✅ View assigned deliveries
- ✅ Update order status during delivery
- ✅ Share real-time GPS location
- ✅ Manage online/offline/busy status
- ✅ View delivery history
- ✅ Delivery dashboard

---

## 🛠️ Tech Stack

### Frontend
```
React 19.2.7              - UI Library
Vite 8.1.1               - Build Tool
Tailwind CSS 4.3.2       - Styling
Redux Toolkit 2.12.0     - State Management
React Router 8.3.0       - Routing
Socket.io-client 4.8.3   - Real-time Communication
Leaflet 1.9.4            - Maps & Geolocation
Axios 1.18.1             - HTTP Client
Firebase 12.16.0         - Authentication
React Hot Toast 2.6.0    - Notifications
```

### Backend
```
Node.js 18+              - Runtime
Express 5.2.1            - Framework
MongoDB 9.7.4            - Database
Mongoose 9.7.4           - ODM
JWT                      - Authentication
Socket.io 4.8.3          - Real-time Communication
Bcryptjs 3.0.3           - Password Hashing
Multer 2.2.0             - File Upload
Cloudinary 2.10.0        - Cloud Storage
Nodemailer 9.0.3         - Email Service
Stripe 22.3.2            - Payment Processing
Dotenv 17.4.2            - Environment Config
```

---

## 📁 Project Structure

### Clean, Organized Folder Layout

```
MithoDelivery/
│
├── 📂 client/                          Frontend React Application
│   ├── src/
│   │   ├── components/                 Reusable UI components
│   │   ├── pages/                      Page components (Home, Cart, Orders, etc.)
│   │   ├── hooks/                      Custom React hooks
│   │   ├── redux/                      State management (store, slices)
│   │   ├── App.jsx                     Main routing component
│   │   ├── main.jsx                    React entry point
│   │   └── index.css                   Global Tailwind styles
│   ├── public/                         Static assets
│   ├── package.json
│   ├── vite.config.js
│   └── .env.local                      Frontend environment variables
│
├── 📂 server/                          Node.js Express Backend
│   ├── models/                         Mongoose database schemas
│   │   ├── User.js                     User (customer, owner, rider)
│   │   ├── Restaurant.js               Restaurant details
│   │   ├── MenuItem.js                 Menu items
│   │   ├── Order.js                    Order tracking
│   │   ├── Cart.js                     Shopping cart
│   │   └── RiderLocation.js            GPS tracking
│   │
│   ├── routes/                         API endpoints
│   │   ├── authRoutes.js               Authentication
│   │   ├── restaurantRoutes.js         Restaurant management
│   │   ├── menuRoutes.js               Menu operations
│   │   ├── cartRoutes.js               Cart operations
│   │   ├── orderRoutes.js              Order management
│   │   └── riderRoutes.js              Rider operations
│   │
│   ├── controllers/                    Business logic
│   │   ├── authController.js
│   │   ├── restaurantController.js
│   │   ├── menuController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── riderController.js
│   │
│   ├── middleware/                     Express middleware
│   │   ├── auth.js                     JWT & role-based access
│   │   ├── multer.js                   File upload handler
│   │   └── errorHandler.js             Global error handling
│   │
│   ├── sockets/                        Real-time features
│   │   └── socketHandler.js            Socket.IO events
│   │
│   ├── utils/                          Utility functions
│   │   └── sendEmail.js                Email service
│   │
│   ├── server.js                       Application entry point
│   ├── package.json
│   ├── .env.example                    Environment template
│   └── .env                            Environment variables (local only)
│
└── README.md                           Documentation
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Download |
|---|---|---|
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org) |
| **npm** | 9+ | Included with Node.js |
| **MongoDB** | 4.4+ | [mongodb.com](https://mongodb.com) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) |
| **Git** | Latest | [git-scm.com](https://git-scm.com) |

### Optional Services
- **Cloudinary** - Image hosting (free tier available)
- **Firebase** - Google authentication (free tier available)
- **Stripe** - Payment processing (free tier available)
- **Gmail** - Email notifications (free)

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Surendra-Bhujel/Food-Delivery-App-.git
cd Food-Delivery-App-
```

### Step 2: Setup Backend

#### Install Dependencies
```bash
cd server
npm install
```

#### Configure Environment Variables

Create `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# ============ Server Configuration ============
PORT=5000
NODE_ENV=development

# ============ Database ============
# For local MongoDB:
MONGO_URI=mongodb://localhost:27017/mitho_delivery

# For MongoDB Atlas (cloud):
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mitho_delivery

# ============ Authentication ============
JWT_SECRET=your_super_secret_key_here_minimum_32_characters_long
JWT_EXPIRE=30d

# ============ Email Configuration ============
EMAIL=your_email@gmail.com
PASS_WORD=your_gmail_app_password

# ============ Cloudinary (Image Upload) ============
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ============ Stripe (Payment) ============
# STRIPE_SECRET_KEY=your_stripe_secret_key

# ============ Frontend URL ============
# CLIENT_URL=http://localhost:5173
```

#### Start Backend Server

```bash
npm run dev
```

Expected output:
```
Connected to MongoDB
Server running at http://localhost:5000
```

---

### Step 3: Setup Frontend

#### Install Dependencies
```bash
cd ../client
npm install
```

#### Configure Environment Variables

Create `.env.local` file in the `client` directory:

```bash
# .env.local file content:
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_FIREBASE_AUTHDOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECTID=your_project_id
VITE_FIREBASE_STORAGEBUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGINGSENDERID=your_sender_id
VITE_FIREBASE_APPID=your_app_id
VITE_GEOAPIKEY=your_geo_api_key
```

#### Start Frontend Development Server

```bash
npm run dev
```

Expected output:
```
VITE v8.1.1  ready in 123 ms

➜  Local:   http://localhost:5173/
```

---

## 💻 Running the Application

### Development Mode (Both Servers Running)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Then open: **http://localhost:5173**

### Production Build

#### Build Frontend
```bash
cd client
npm run build
```

This creates optimized build in `client/dist/`

#### Run Backend in Production
```bash
cd server
NODE_ENV=production npm start
```

---

## 🔑 Authentication & User Roles

### Three User Roles

```
┌─────────────────────────────────────────────────────────────┐
│  👥 CUSTOMER                                                │
├─────────────────────────────────────────────────────────────┤
│ • Browse restaurants and menus                              │
│ • Add items to cart and checkout                            │
│ • Place and track orders                                    │
│ • Rate restaurants and riders                               │
│ • View order history                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  🏪 RESTAURANT OWNER                                        │
├─────────────────────────────────────────────────────────────┤
│ • Create and manage restaurant                              │
│ • Manage menu items (add, edit, delete)                     │
│ • Receive and confirm orders                                │
│ • Assign riders to deliveries                               │
│ • View analytics and order history                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  🚴 DELIVERY RIDER                                          │
├─────────────────────────────────────────────────────────────┤
│ • View assigned deliveries                                  │
│ • Update order status                                       │
│ • Share real-time location                                  │
│ • Manage availability status                                │
│ • Track earnings                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "customer"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

#### Google OAuth
```http
POST /auth/google-auth
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "googleId": "google_id_token",
  "role": "customer"
}
```

#### Forgot Password (Send OTP)
```http
POST /auth/send-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Verify OTP
```http
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "1234"
}
```

#### Reset Password
```http
POST /auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "newPassword": "newpassword123"
}
```

---

### Restaurant Endpoints

#### Get All Restaurants
```http
GET /restaurants?city=Kathmandu&cuisineType=Italian
```

#### Create Restaurant (Owner Only)
```http
POST /restaurants
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "name": "Pizza Palace",
  "description": "Authentic Italian pizzas",
  "cuisineType": ["Italian", "Mediterranean"],
  "address": {
    "coordinates": [85.3240, 27.7172],
    "formattedAddress": "Kathmandu, Nepal"
  },
  "phone": "9876543210"
}
```

#### Get My Restaurant (Owner Only)
```http
GET /restaurants/my-restaurant
Authorization: Bearer <token>
```

#### Get Restaurant by ID
```http
GET /restaurants/:id
```

#### Update Restaurant (Owner Only)
```http
PUT /restaurants/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

---

### Menu Endpoints

#### Get Restaurant Menu
```http
GET /menu/restaurant/:restaurantId
```

#### Add Menu Item (Owner Only)
```http
POST /menu
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "name": "Margherita Pizza",
  "description": "Fresh mozzarella, basil, tomato",
  "price": 350,
  "category": "Pizzas",
  "foodType": "Vegetarian",
  "spicyLevel": "Mild",
  "preparationTime": 20
}
```

#### Update Menu Item (Owner Only)
```http
PUT /menu/:id
Authorization: Bearer <token>
```

#### Delete Menu Item (Owner Only)
```http
DELETE /menu/:id
Authorization: Bearer <token>
```

#### Toggle Item Availability (Owner Only)
```http
PATCH /menu/:id/toggle
Authorization: Bearer <token>
```

---

### Cart Endpoints

#### Get Cart
```http
GET /cart
Authorization: Bearer <token>
```

#### Add Item to Cart
```http
POST /cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "menuItemId": "...",
  "quantity": 1,
  "note": "Extra cheese"
}
```

#### Update Cart Item
```http
PUT /cart/items/:itemId
Authorization: Bearer <token>

{
  "quantity": 2
}
```

#### Remove Item from Cart
```http
DELETE /cart/items/:itemId
Authorization: Bearer <token>
```

#### Clear Cart
```http
DELETE /cart
Authorization: Bearer <token>
```

---

### Order Endpoints

#### Create Order (Customer Only)
```http
POST /orders/checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "deliveryAddress": {
    "coordinates": [85.3240, 27.7172],
    "formattedAddress": "123 Main St, Kathmandu",
    "contactNumber": "9876543210"
  },
  "paymentMethod": "card",
  "specialInstructions": "No onions"
}
```

#### Get My Orders (Customer)
```http
GET /orders/mine
Authorization: Bearer <token>
```

#### Get Order Details
```http
GET /orders/:id
Authorization: Bearer <token>
```

#### Get Restaurant Orders (Owner Only)
```http
GET /orders/restaurant/:restaurantId
Authorization: Bearer <token>
```

#### Confirm Order (Owner Only)
```http
PUT /orders/:id/confirm
Authorization: Bearer <token>
```

#### Assign Rider to Order (Owner Only)
```http
PUT /orders/:id/assign-rider
Authorization: Bearer <token>
Content-Type: application/json

{
  "riderId": "..."
}
```

#### Get Available Riders (Owner Only)
```http
GET /orders/available-riders
Authorization: Bearer <token>
```

#### Update Order Status (Rider Only)
```http
PUT /orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "out_for_delivery",
  "note": "On the way"
}
```

**Valid Status Transitions:**
```
pending → confirmed
confirmed → preparing
preparing → out_for_delivery
out_for_delivery → delivered
(Any status → cancelled)
```

---

## 🔄 Real-time Features with Socket.IO

### Connect to Socket Server

```javascript
import io from 'socket.io-client';

const socket = io("http://localhost:5000", {
  withCredentials: true
});
```

### Join Order Room

```javascript
socket.emit("join_order_room", {
  orderId: "order_id_here",
  role: "customer",  // "customer", "owner", or "rider"
  userId: "user_id_here"
});
```

### Listen to Order Status Updates

```javascript
socket.on("order:status_update", (data) => {
  console.log(`Order ${data.orderId} status: ${data.status}`);
  console.log(`Timestamp: ${data.timestamp}`);
  // Update UI with new order status
});
```

### Listen to Rider Location Updates

```javascript
socket.on("rider:location", (data) => {
  console.log(`Rider Location: [${data.coordinates[0]}, ${data.coordinates[1]}]`);
  // Update map with rider location
});
```

### Send Rider Location

```javascript
socket.emit("rider:location", {
  orderId: "order_id_here",
  coordinates: [85.3240, 27.7172],
  accuracy: 10,
  speed: 45,
  heading: 180
});
```

### Leave Order Room

```javascript
socket.emit("leave_order_room", {
  orderId: "order_id_here"
});
```

---

## 💾 Database Schema

### Collections Overview

#### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (enum: ["customer", "owner", "rider"]),
  avatar: String (URL),
  address: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  availability: String (for riders: "online", "offline", "busy"),
  restaurantId: ObjectId (reference to Restaurant),
  createdAt: Date,
  updatedAt: Date
}
```

#### Restaurants Collection
```javascript
{
  _id: ObjectId,
  owner: ObjectId (reference to User),
  name: String,
  description: String,
  cuisineType: [String],
  address: {
    type: "Point",
    coordinates: [longitude, latitude],
    formattedAddress: String
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  operatingHours: {
    open: String (HH:MM),
    close: String (HH:MM),
    daysOpen: [String]
  },
  logo: String (URL),
  coverImage: String (URL),
  rating: Number (0-5),
  deliveryFee: Number,
  estimatedDeliveryTime: Number (minutes),
  menu: [ObjectId] (reference to MenuItems),
  createdAt: Date,
  updatedAt: Date
}
```

#### MenuItems Collection
```javascript
{
  _id: ObjectId,
  restaurant: ObjectId (reference to Restaurant),
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String (URL),
  foodType: String (enum: ["Vegetarian", "Non-Vegetarian", "Other"]),
  isAvailable: Boolean,
  spicyLevel: String,
  preparationTime: Number,
  calories: Number,
  nutritionalInfo: {
    protein: Number,
    carbs: Number,
    fat: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Orders Collection
```javascript
{
  _id: ObjectId,
  customer: ObjectId (reference to User),
  restaurant: ObjectId (reference to Restaurant),
  rider: ObjectId (reference to User - optional),
  items: [
    {
      menuItem: ObjectId,
      name: String,
      quantity: Number,
      price: Number,
      note: String
    }
  ],
  subtotal: Number,
  tax: Number,
  deliveryFee: Number,
  totalAmount: Number,
  status: String (enum: ["pending", "confirmed", "assigned", 
                         "preparing", "out_for_delivery", 
                         "delivered", "cancelled"]),
  deliveryAddress: {
    type: "Point",
    coordinates: [longitude, latitude],
    formattedAddress: String,
    instructions: String
  },
  paymentMethod: String (enum: ["card", "cash", "digital_wallet"]),
  paymentStatus: String (enum: ["pending", "paid", "failed", "refunded"]),
  statusHistory: [
    {
      status: String,
      timestamp: Date,
      note: String
    }
  ],
  customerRating: {
    rating: Number (1-5),
    comment: String
  },
  riderRating: {
    rating: Number (1-5),
    comment: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Cart Collection
```javascript
{
  _id: ObjectId,
  customer: ObjectId (reference to User),
  restaurant: ObjectId (reference to Restaurant),
  items: [
    {
      menuItem: ObjectId,
      name: String,
      quantity: Number,
      priceAtAdd: Number,
      note: String
    }
  ],
  totalAmount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Security Features

- ✅ **Password Hashing** - bcryptjs with 10 salt rounds
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Role-Based Access Control** - Middleware for route protection
- ✅ **HTTPS Ready** - Secure cookies in production
- ✅ **CORS Enabled** - Cross-origin request handling
- ✅ **Environment Secrets** - Sensitive data in .env files
- ✅ **Input Validation** - Server-side validation
- ✅ **OTP Verification** - Secure password recovery

---

## 📝 npm Scripts

### Backend Scripts
```bash
npm run dev      # Run with Nodemon (development)
npm start        # Run in production
```

### Frontend Scripts
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

---

## 🚀 Deployment Guide

### Deploy Frontend (Vercel/Netlify)

1. **Build the project:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy `dist` folder** to Vercel or Netlify

3. **Set environment variables** in hosting platform:
   ```
   VITE_FIREBASE_APIKEY
   VITE_FIREBASE_AUTHDOMAIN
   VITE_FIREBASE_PROJECTID
   VITE_FIREBASE_STORAGEBUCKET
   VITE_FIREBASE_MESSAGINGSENDERID
   VITE_FIREBASE_APPID
   VITE_GEOAPIKEY
   ```

### Deploy Backend (Render/Railway/Heroku)

1. **Set production environment variables:**
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=...
   EMAIL=...
   PASS_WORD=...
   CLOUDINARY_*=...
   ```

2. **Deploy server folder** to your hosting platform

3. **Ensure MongoDB Atlas** is accessible from deployed server

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Solution: Ensure MongoDB is running or update MONGO_URI with correct connection string
```

### CORS Error
```
Solution: Check CLIENT_URL in server .env matches frontend URL
```

### Socket.IO Not Connecting
```
Solution: Verify server and client URLs match, check CORS settings
```

### Image Upload Failed
```
Solution: Verify Cloudinary credentials in .env file
```

### Email Not Sending
```
Solution: Use Gmail app password (not regular password), enable "Less secure apps"
```

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com/manual)
- [Socket.IO Docs](https://socket.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Redux Toolkit](https://redux-toolkit.js.org)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **ISC License** - see LICENSE file for details.

---

## 👨‍💻 Author

**Surendra Bhujel**

- 🔗 GitHub: [@Surendra-Bhujel](https://github.com/Surendra-Bhujel)
- 📧 Email: [your-email@example.com](mailto:your-email@example.com)

---

## 📞 Support

For issues, questions, or suggestions:
- Open an [Issue](https://github.com/Surendra-Bhujel/Food-Delivery-App-/issues)
- Start a [Discussion](https://github.com/Surendra-Bhujel/Food-Delivery-App-/discussions)

---

<div align="center">

**Made with ❤️ by [Surendra Bhujel](https://github.com/Surendra-Bhujel)**

⭐ If you found this helpful, please give it a star!

</div>

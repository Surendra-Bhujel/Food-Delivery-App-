import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new mongoose.Schema ({
    
    username:{
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be atleast 3 characters'],
        maxlength: [20, 'Username cannot exceed 20 characters']
    },
      email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
     password:{
        type: String,
        required:[true, 'Password is required'],
        minlength: [6, 'Password must be atleast 6 characters'],
        select: false, // Don't return password by default 
    },
    role:{
        type: String,
        enum: ['customer', 'owner', 'rider'],
        default: 'customer'
    },
    avatar: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    },
    phone:{
        type: String,
        trim: true
    },
    address:{
        type:{
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates:{
            type: [Number],
            default: [0, 0],
        },
        isActive:{
            type: Boolean,
            default: [0, 0],
        },
        formattedAddress: String,
   },
    isActive: {
      type: Boolean,
      default: true,
    },
    // For riders
    availability: {
      type: String,
      enum: ['online', 'offline', 'busy'],
      default: 'offline',
    },
    // For restaurant owners
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);


// Index for geospatial queries
userSchema.index({ 'address.coordinates': '2dsphere' });


// Hash password before saving
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method 
userSchema.methods.comparePassword = function(){
    const user = this.Object();
    delete user.password;
    return user;
};


export default mongoose.model('User', userSchema);


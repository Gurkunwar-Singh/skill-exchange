const express = require('express');
const dotenv = require('dotenv');
const http = require("http"); 
const socketIo = require("socket.io");
const cors = require('cors');
const jwt = require("jsonwebtoken"); 
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require("./routes/dashboard");
const Profile = require("./models/Profile");
const ServiceRequest=require('./models/ServiceRequest');
const serviceRequestRoutes = require("./routes/serviceRequestRoute");
const agreementRoutes=require("./routes/agreements")
const teamRoutes = require('./routes/teams');

const prodOrigin = [process.env.ORIGIN_1, process.env.ORIGIN_2].filter(Boolean);
const devOrigin=[ process.env.FRONT_URL,]
//http://localhost:5173', 'http://localhost:5174','http://localhost:5175'
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.ORIGIN_1, process.env.ORIGIN_2] 
    : ['http://localhost:5173']; 
dotenv.config();





const app = express();
const server = http.createServer(app); 

const io = socketIo(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT"],
    },
});

// Middleware
app.use(express.json());


app.use(cors({
  origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
// Connect to MongoDB
connectDB();

app.get("/api/health", (req, res) => {
  res.send("✅ Backend is alive!");
});


// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", (req, res, next) => {
  req.io = io; // Attach io instance
  next();
}, serviceRequestRoutes);


app.use('/api/milestones', require('./routes/Milestones'));
app.use('/api/agreements', agreementRoutes);
app.use('/api/teams', require('./routes/teams'));
app.use('/api/teams', teamRoutes);


const onlineUsers = new Map();

io.on("connection", async (socket) => {
  console.log("New client connected:", socket.id);

  try {
      // Send all existing service requests when a user connects
      const allRequests = await ServiceRequest.find();
      socket.emit("updateRequests", allRequests);
  } catch (error) {
      console.error("Error fetching initial requests:", error);
  }

 
  // Handle user login with token
  socket.on("join", async (token) => {
      try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await Profile.findOne({ email: decoded.email });

          if (!user) return;

          onlineUsers.set(socket.id, user.email);
          console.log(`${user.email} joined.`);

          // Find matches and send them to the user
          const matches = await Profile.find({
              skills: { $in: user.skills },
              email: { $ne: user.email },
          }).select("name skills email");

          socket.emit("updateMatches", matches);
      } catch (err) {
          console.error("Invalid token:", err.message);
      }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      onlineUsers.delete(socket.id);
  });
});

// Use `server.listen()` instead of `app.listen()`
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// const express = require('express');
// const dotenv = require('dotenv');
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const connectDB = require('./config/db');
// const userRoutes = require('./routes/userRoutes');
// const authRoutes = require('./routes/authRoutes');
// const dashboardRoutes = require('./routes/dashboard');
// const serviceRequestRoutes = require('./routes/serviceRequestRoute');
// const Profile = require('./models/Profile');
// const ServiceRequest = require('./models/ServiceRequest');

// dotenv.config();

// const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//     cors: {
//         origin: allowedOrigins,
//         methods: ['GET', 'POST', 'PUT'],
//     },
// });

// app.use(express.json());
// app.use(cors({
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true,
// }));

// connectDB();

// // Routes
// app.use('/api', authRoutes);
// app.use('/api', userRoutes);
// app.use('/api', dashboardRoutes);
// app.use('/api', (req, res, next) => {
//     req.io = io; // Attach io instance
//     next();
// }, serviceRequestRoutes);

// Optionally, if you want to include milestones, uncomment and ensure the milestones route file is correctly set up:
//  const milestonesRoutes = require('./routes/Milestones')(io);
//  app.use('/api/Milestones', milestonesRoutes);

// const onlineUsers = new Map();

// io.on('connection', async (socket) => {
//     console.log('New client connected:', socket.id);

//     try {
//         // Send all existing service requests when a user connects
//         const allRequests = await ServiceRequest.find();
//         socket.emit('updateRequests', allRequests);
//     } catch (error) {
//         console.error('Error fetching initial requests:', error);
//     }

//     // Handle user login with token
//     socket.on('join', async (token) => {
//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             const user = await Profile.findOne({ email: decoded.email });

//             if (!user) return;

//             onlineUsers.set(socket.id, user.email);
//             console.log(`${user.email} joined.`);

//             // Find matches and send them to the user
//             const matches = await Profile.find({
//                 skills: { $in: user.skills },
//                 email: { $ne: user.email },
//             }).select('name skills email');

//             socket.emit('updateMatches', matches);
//         } catch (err) {
//             console.error('Invalid token:', err.message);
//         }
//     });

//     // Handle disconnection
//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//         onlineUsers.delete(socket.id);
//     });
// });

// // Use `server.listen()` instead of `app.listen()`
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

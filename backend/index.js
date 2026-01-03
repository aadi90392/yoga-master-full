const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const stripe = require('stripe')(process.env.PAYMENT_SECRET);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // <--- IMPORTED BCRYPT
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// --- MIDDLEWARE: VERIFY JWT ---
const verifyJWT = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).send({ error: true, message: 'Unauthorized access' });
    }
    const token = authorization.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ error: true, message: 'Forbidden user or token has expired' });
        }
        req.decoded = decoded;
        next();
    });
};

// --- MONGODB CONNECTION ---
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hsyqpj8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        // --- COLLECTIONS ---
        const database = client.db("yoga-master");
        const userCollection = database.collection("users");
        const classesCollection = database.collection("classes");
        const cartCollection = database.collection("cart");
        const paymentCollection = database.collection("payments");
        const enrolledCollection = database.collection("enrolled");
        const appliedCollection = database.collection("applied");

        // =========================================================================
        // AUTHENTICATION ROUTES (SECURED)
        // =========================================================================

        // 1. SIGNUP (With Password Hashing & Duplicate Check)
        app.post('/new-user', async (req, res) => {
            const user = req.body;
            
            // Check if email already exists
            const query = { email: user.email };
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'User already exists', insertedId: null });
            }

            // Hash Password before saving
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const newUser = { ...user, password: hashedPassword };

            const result = await userCollection.insertOne(newUser);
            res.send(result);
        });

        // 2. LOGIN (With Password Comparison)
        app.post('/api/login', async (req, res) => {
            const { email, password } = req.body;
            
            // Find user by email
            const user = await userCollection.findOne({ email: email });
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }

            // Compare Hashed Password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).send({ message: "Invalid Password" });
            }

            // Generate Token
            const token = jwt.sign(
                { email: user.email, role: user.role },
                process.env.ACCESS_SECRET,
                { expiresIn: '24h' }
            );
            
            // Send user info (Exclude password)
            const userInfo = {
                _id: user._id,
                name: user.name,
                email: user.email,
                photoUrl: user.photoUrl,
                role: user.role
            };

            res.send({ token, user: userInfo });
        });


        // --- ROLE VERIFICATION MIDDLEWARES ---
        const verifyAdmin = async (req, res, next) => {
            const email = req.decoded.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            if (user?.role === 'admin') {
                next();
            } else {
                return res.status(403).send({ error: true, message: 'Forbidden access' });
            }
        };

        const verifyInstructor = async (req, res, next) => {
            const email = req.decoded.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            if (user?.role === 'instructor' || user?.role === 'admin') {
                next();
            } else {
                return res.status(403).send({ error: true, message: 'Forbidden access' });
            }
        };

        // =========================================================================
        // USER MANAGEMENT
        // =========================================================================

        app.get('/users', async (req, res) => {
            const result = await userCollection.find({}).toArray();
            res.send(result);
        });

        app.get('/user/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        app.delete('/delete-user/:id', verifyJWT, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });

        app.put('/update-user/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const body = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = { $set: {} };

            // Security: Only Admin can change Role
            if (body.option) {
                if (req.decoded.role === 'admin') {
                    updateDoc.$set.role = body.option;
                }
            }

            // Normal Profile Updates
            if (body.name) updateDoc.$set.name = body.name;
            if (body.phone) updateDoc.$set.phone = body.phone;
            if (body.address) updateDoc.$set.address = body.address;
            if (body.photoUrl) updateDoc.$set.photoUrl = body.photoUrl;
            if (body.about) updateDoc.$set.about = body.about;
            if (body.skills) updateDoc.$set.skills = body.skills;

            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        // =========================================================================
        // INSTRUCTOR APPLICATIONS
        // =========================================================================

        app.post('/as-instructor', verifyJWT, async (req, res) => {
            const data = req.body;
            const existing = await appliedCollection.findOne({ email: data.email });
            if (existing) return res.send({ message: "Already applied" });

            const result = await appliedCollection.insertOne({ ...data, appliedAt: new Date() });
            res.send(result);
        });

        app.get('/applied-instructors', async (req, res) => {
            const result = await appliedCollection.find().toArray();
            res.send(result);
        });
        
        // Single user application status check
        app.get('/applied-instructors/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;
            const result = await appliedCollection.findOne({ email });
            res.send(result);
        });

        app.patch('/make-instructor', verifyJWT, verifyAdmin, async (req, res) => {
            const { email } = req.body;
            const filter = { email: email };
            const updateDoc = { $set: { role: 'instructor' } };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        app.delete('/delete-application/:id', verifyJWT, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await appliedCollection.deleteOne(query);
            res.send(result);
        });

        // =========================================================================
        // CLASSES MANAGEMENT
        // =========================================================================

        app.post('/new-class', verifyJWT, verifyInstructor, async (req, res) => {
            const newClass = req.body;
            const result = await classesCollection.insertOne(newClass);
            res.send(result);
        });

        // All Approved Classes (Public)
        app.get('/classes', async (req, res) => {
            const query = { status: 'approved' };
            const result = await classesCollection.find(query).toArray();
            res.send(result);
        });

        // Instructor Specific Classes
        app.get('/classes/:email', verifyJWT, verifyInstructor, async (req, res) => {
            const email = req.params.email;
            const query = { instructorEmail: email };
            const result = await classesCollection.find(query).toArray();
            res.send(result);
        });

        // Admin: Manage All Classes
        app.get('/class-manage', async (req, res) => {
            const result = await classesCollection.find().toArray();
            res.send(result);
        });

        // Admin: Approve/Reject Class
        app.patch('/change-status/:id', verifyJWT, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const { status, reason } = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = { $set: { status, reason } };
            const result = await classesCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        // Get Single Class
        app.get('/class/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await classesCollection.find(query).toArray();
            res.send(result);
        });

        // Update Class Details
        app.put('/update-class/:id', verifyJWT, verifyInstructor, async (req, res) => {
            const id = req.params.id;
            const updateClass = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    name: updateClass.name,
                    description: updateClass.description,
                    price: updateClass.price,
                    availableSeats: parseInt(updateClass.availableSeats),
                    videoLink: updateClass.videoLink,
                    status: 'pending' // Reset status on update
                }
            };
            const result = await classesCollection.updateOne(filter, updateDoc);
            res.send(result);
        });
        
        // Admin: Delete Class
        app.delete('/delete-class/:id', verifyJWT, verifyAdmin, async (req, res) => {
             const id = req.params.id;
             const query = { _id: new ObjectId(id) };
             const result = await classesCollection.deleteOne(query);
             res.send(result);
        });

        app.get('/popular_classes', async (req, res) => {
            const result = await classesCollection.find().sort({ totalEnrolled: -1 }).limit(6).toArray();
            res.send(result);
        });

        app.get('/popular-instructors', async (req, res) => {
            const pipeline = [
                { $group: { _id: "$instructorEmail", totalEnrolled: { $sum: "$totalEnrolled" } } },
                { $lookup: { from: "users", localField: "_id", foreignField: "email", as: "instructor" } },
                { $match: { "instructor": { $ne: [] } } },
                { $project: { _id: 0, instructor: { $arrayElemAt: ["$instructor", 0] }, totalEnrolled: 1 } },
                { $sort: { totalEnrolled: -1 } },
                { $limit: 6 }
            ];
            const result = await classesCollection.aggregate(pipeline).toArray();
            res.send(result);
        });

        // =========================================================================
        // CART ROUTES
        // =========================================================================

        app.post('/add-to-cart', verifyJWT, async (req, res) => {
            const newCartItem = req.body;
            const result = await cartCollection.insertOne(newCartItem);
            res.send(result);
        });

        app.get('/cart/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;
            const query = { userMail: email };
            const projection = { classId: 1 };
            const carts = await cartCollection.find(query, { projection }).toArray();
            const classIds = carts.map(cart => new ObjectId(cart.classId));
            const query2 = { _id: { $in: classIds } };
            const result = await classesCollection.find(query2).toArray();
            res.send(result);
        });

        app.delete('/delete-cart-item/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const query = { classId: id }; // Deleting by classId from cart
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        });

        // =========================================================================
        // PAYMENT ROUTES
        // =========================================================================

        app.post('/create-payment-intent', async (req, res) => {
            const { price } = req.body;
            const amount = parseInt(price) * 100;
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: ['card']
            });
            res.send({ clientSecret: paymentIntent.client_secret });
        });

        app.post('/payment-info', verifyJWT, async (req, res) => {
            const paymentInfo = req.body;
            const classesId = paymentInfo.classesId;
            const userEmail = paymentInfo.userEmail;
            
            const classesQuery = { _id: { $in: classesId.map(id => new ObjectId(id)) } };
            const classes = await classesCollection.find(classesQuery).toArray();

            // 1. Add to Payment History
            const paymentResult = await paymentCollection.insertOne(paymentInfo);

            // 2. Add to Enrolled Collection
            const newEnrolledData = {
                userEmail: userEmail,
                classesId: classesId.map(id => new ObjectId(id)),
                transactionId: paymentInfo.transactionId,
                date: new Date()
            };
            const enrolledResult = await enrolledCollection.insertOne(newEnrolledData);

            // 3. Delete from Cart
            const cartQuery = { classId: { $in: classesId }, userMail: userEmail };
            const deletedResult = await cartCollection.deleteMany(cartQuery);

            // 4. Update Class Seats & Enrolled Count
            const updatedDoc = {
                $inc: {
                    totalEnrolled: 1,
                    availableSeats: -1
                }
            };
            const updatedResult = await classesCollection.updateMany(classesQuery, updatedDoc);

            res.send({ paymentResult, deletedResult, enrolledResult, updatedResult });
        });

        app.get('/payment-history/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email };
            const result = await paymentCollection.find(query).sort({ date: -1 }).toArray();
            res.send(result);
        });

        app.get('/enrolled-classes/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email };
            const pipeline = [
                { $match: query },
                { $lookup: { from: "classes", localField: "classesId", foreignField: "_id", as: "classes" } },
                { $unwind: "$classes" },
                { $lookup: { from: "users", localField: "classes.instructorEmail", foreignField: "email", as: "instructor" } },
                { $project: { _id: 0, classes: 1, instructor: { $arrayElemAt: ["$instructor", 0] } } }
            ];
            const result = await enrolledCollection.aggregate(pipeline).toArray();
            res.send(result);
        });

        // =========================================================================
        // STATS ROUTES
        // =========================================================================

        app.get('/instructor-stats/:email', verifyJWT, verifyInstructor, async (req, res) => {
            const email = req.params.email;
            const query = { instructorEmail: email };
            try {
                const classes = await classesCollection.find(query).toArray();
                const totalClasses = classes.length;
                const totalEnrolled = classes.reduce((sum, item) => sum + parseInt(item.totalEnrolled || 0), 0);
                const totalRevenue = classes.reduce((sum, item) => {
                    return sum + (parseFloat(item.price) * parseInt(item.totalEnrolled || 0));
                }, 0);

                res.send({
                    totalClasses,
                    totalEnrolled,
                    totalRevenue,
                    classesData: classes
                });
            } catch (error) {
                res.status(500).send({ message: "Error fetching stats" });
            }
        });

        app.get('/admin-stats', verifyJWT, verifyAdmin, async (req, res) => {
            const approvedClasses = await classesCollection.countDocuments({ status: 'approved' });
            const pendingClasses = await classesCollection.countDocuments({ status: 'pending' });
            const instructors = await userCollection.countDocuments({ role: 'instructor' });
            const totalClasses = await classesCollection.countDocuments();
            const totalEnrolled = await enrolledCollection.countDocuments();

            res.send({ approvedClasses, pendingClasses, instructors, totalClasses, totalEnrolled });
        });

        // Connect Check
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    } finally {
        // await client.close(); // Keep connection open
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Yoga Master Server Running');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
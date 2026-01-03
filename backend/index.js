const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const stripe = require('stripe')(process.env.PAYMENT_SECRET);
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

// --- MIDDLEWARE: VERIFY JWT ---
const verifyJWT = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).send({ error: true, message: 'Unauthorize access' })
    }
    const token = authorization?.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ error: true, message: 'forbidden user or token has expired' })
        }
        req.decoded = decoded;
        next();
    })
}

// --- MONGODB CONNECTION ---
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hsyqpj8.mongodb.net/?appName=Cluster0`;

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
        // AUTHENTICATION & ROLES
        // =========================================================================


        

        app.post('/api/login', async (req, res) => {
            const { email, password } = req.body;
            const user = await userCollection.findOne({ email: email });

            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            if (user.password !== password) {
                return res.status(401).send({ message: "Invalid Password" });
            }

            const token = jwt.sign(
                { email: user.email, role: user.role },
                process.env.ACCESS_SECRET,
                { expiresIn: '24h' }
            );
            res.send({ token, user });
        });

        app.post('/new-user', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        });

        // Middleware: Verify Admin
        const verifyAdmin = async (req, res, next) => {
            const email = req.decoded.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            if (user.role === 'admin') {
                next();
            } else {
                return res.status(401).send({ error: true, message: 'Unauthorize access' })
            }
        };

        // Middleware: Verify Instructor
        const verifyInstructor = async (req, res, next) => {
            const email = req.decoded.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            if (user.role === 'instructor' || user.role === 'admin') {
                next()
            } else {
                return res.status(401).send({ error: true, message: 'Unauthorize access' })
            }
        };

        // =========================================================================
        // USER MANAGEMENT ROUTES
        // =========================================================================


        app.delete('/delete-class/:id', verifyJWT, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await classesCollection.deleteOne(query);
            res.send(result);
        });

        app.get('/users', async (req, res) => {
            const users = await userCollection.find({}).toArray();
            res.send(users);
        });

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const user = await userCollection.findOne(query);
            res.send(user);
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

        // --- UPDATE USER (SECURE VERSION) ---
        // VerifyJWT laga hai, yani login hona zaroori hai
        // VerifyAdmin hata diya, taaki user khud ko edit kar sake
        app.put('/update-user/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const body = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = { $set: {} };

            // SECURITY CHECK: 
            // Agar koi 'Role' change karne ki koshish kar raha hai (option field se)
            if (body.option) {
                // To check karo ki wo banda Admin hai ya nahi
                if (req.decoded.role === 'admin') {
                    updateDoc.$set.role = body.option; // Admin hai to allow karo
                } else {
                    // Agar Admin nahi hai, to Role change IGNORE kar do.
                    // Hum error throw nahi kar rahe taaki baaki form save ho jaye,
                    // bas role change nahi hoga.
                }
            }

            // Baaki fields sabke liye open hain (Personal Info)
            if (body.name) updateDoc.$set.name = body.name;
            if (body.address) updateDoc.$set.address = body.address;
            if (body.phone) updateDoc.$set.phone = body.phone;
            if (body.about) updateDoc.$set.about = body.about;
            if (body.photoUrl) updateDoc.$set.photoUrl = body.photoUrl;
            if (body.skills) updateDoc.$set.skills = body.skills;
            
            // Email change allow nahi karte usually identity ke liye
            // if (body.email) updateDoc.$set.email = body.email;

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

            const result = await appliedCollection.insertOne({
                ...data,
                appliedAt: new Date()
            });
            res.send(result);
        });

        app.get('/applied-instructors/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;
            const result = await appliedCollection.findOne({ email });
            res.send(result);
        });

        app.get('/applied-instructors', async (req, res) => {
            const result = await appliedCollection.find().toArray();
            res.send(result);
        });

        app.patch('/make-instructor', verifyJWT, verifyAdmin, async (req, res) => {
            const { email } = req.body;
            const filter = { email: email };
            const updateDoc = {
                $set: { role: 'instructor' }
            };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        app.delete('/delete-application/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await appliedCollection.deleteOne(query);
            res.send(result);
        });

        // =========================================================================
        // CLASS ROUTES
        // =========================================================================

        app.post('/new-class', verifyJWT, verifyInstructor, async (req, res) => {
            const newClass = req.body;
            const result = await classesCollection.insertOne(newClass);
            res.send(result);
        });

        app.get('/classes', async (req, res) => {
            const query = { status: 'approved' };
            const result = await classesCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/classes/:email', verifyJWT, verifyInstructor, async (req, res) => {
            const email = req.params.email;
            const query = { instructorEmail: email };
            const result = await classesCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/class-manage', async (req, res) => {
            const result = await classesCollection.find().toArray();
            res.send(result);
        });

        app.patch('/change-status/:id', verifyJWT, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const reason = req.body.reason;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: { status: status, reason: reason },
            };
            const result = await classesCollection.updateOne(filter, updateDoc, { upsert: true });
            res.send(result);
        })

        app.get('/approved-classes', async (req, res) => {
            const query = { status: "approved" };
            const result = await classesCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/class/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await classesCollection.find(query).toArray();
            res.send(result);
        })

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
                    status: 'pending', 
                }
            };
            const result = await classesCollection.updateOne(filter, updateDoc, { upsert: true });
            res.send(result);
        })

        // =========================================================================
        // CART ROUTES
        // =========================================================================

        app.post('/add-to-cart', verifyJWT, async (req, res) => {
            const newCartItem = req.body;
            const result = await cartCollection.insertOne(newCartItem);
            res.send(result);
        });

        app.get('/cart-item/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const email = req.body.email;
            const query = { classId: id, userMail: email };
            const projection = { classId: 1 }
            const result = await cartCollection.findOne(query, { projection: projection });
            res.send(result);
        });

        app.get('/cart/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;
            const query = { userMail: email };
            const projection = { classId: 1 };
            const carts = await cartCollection.find(query, { projection: projection }).toArray();
            const classIds = carts.map(cart => new ObjectId(cart.classId));
            const query2 = { _id: { $in: classIds } };
            const result = await classesCollection.find(query2).toArray();
            res.send(result);
        });

        app.delete('/delete-cart-item/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const query = { classId: id };
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
            const singleClassId = req.query.classId;
            let query;
            if (singleClassId) {
                query = { classId: singleClassId, userMail: userEmail };
            } else {
                query = { classId: { $in: classesId } };
            }
            const classesQuery = { _id: { $in: classesId.map(id => new ObjectId(id)) } };
            const classes = await classesCollection.find(classesQuery).toArray();
            const newEnrolledData = {
                userEmail: userEmail,
                classesId: classesId.map(id => new ObjectId(id)),
                transactionId: paymentInfo.transactionId,
            };
            const updatedDoc = {
                $set: {
                    totalEnrolled: classes.reduce((total, current) => total + current.totalEnrolled, 0) + 1 || 0,
                    availableSeats: classes.reduce((total, current) => total + current.availableSeats, 0) - 1 || 0,
                }
            };
            const updatedResult = await classesCollection.updateMany(classesQuery, updatedDoc, { upsert: true });
            const enrolledResult = await enrolledCollection.insertOne(newEnrolledData);
            const deletedResult = await cartCollection.deleteMany(query);
            const paymentResult = await paymentCollection.insertOne(paymentInfo);
            res.send({ paymentResult, deletedResult, enrolledResult, updatedResult });
        });

        app.get('/payment-history/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email };
            const result = await paymentCollection.find(query).sort({ date: -1 }).toArray();
            res.send(result);
        });

        app.get('/payment-history-length/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email };
            const total = await paymentCollection.countDocuments(query);
            res.send({ total });
        });

        // =========================================================================
        // STATS & ANALYTICS
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

        app.get('/admin-stats', verifyJWT, verifyAdmin, async (req, res) => {
            const approvedClasses = (await classesCollection.find({ status: 'approved' }).toArray()).length;
            const pendingClasses = (await classesCollection.find({ status: 'pending' }).toArray()).length;
            const instructors = (await userCollection.find({ role: 'instructor' }).toArray()).length;
            const totalClasses = (await classesCollection.find().toArray()).length;
            const totalEnrolled = (await enrolledCollection.find().toArray()).length;

            const result = { approvedClasses, pendingClasses, instructors, totalClasses, totalEnrolled }
            res.send(result);
        });

        

        app.get('/instructors', async (req, res) => {
            const result = await userCollection.find({ role: 'instructor' }).toArray();
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
            ]
            const result = await enrolledCollection.aggregate(pipeline).toArray();
            res.send(result);
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    } finally {
        // Client close nahi karna
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Yoga Master Server Running')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
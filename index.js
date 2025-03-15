const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 8080;


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Replace <username>, <password>, and <dbname> with actual credentials
const DB_URI = 'mongodb+srv://manoj:manojyadav@demo-api.jl2zn.mongodb.net/';

// Connect to MongoDB
mongoose.connect(DB_URI)
    .then(() => console.log('Database connected successfully'))
    .catch((error) => console.error(`Database connection error: ${error.message}`));

// Create Schema
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required:true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        enum: ["male", "female"], // Corrected enum for validation
    },
    status: {
        type: String,
        enum: ["active", "inactive"], // Corrected enum values
        default:null,
    },
})

// studentSchema.pre('save', async function(next){
//     if(this.isModi)
// })

// Create Model
const Student = mongoose.model("Student", studentSchema);

// Insert Student with POST method
app.post('/api/datas', async (req, res) => {
    try {
        const addData = new Student(req.body);
        await addData.save();
        res.json(addData);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Issue" });
    }
});



// register 
app.post('/register', async (req,res)=>{
    const {name,email, password,phone,gender}=req.body;
    try{
        const getuser = new Student({name,email, password,phone,gender});
        console.log("getuser is:", getuser);
        if(!getuser) return res.status(400).json({message:'user not registerd ', status:false,data:getuser});
        await getuser.save();
        res.status(200).json({message:"user login succesfully", status:true, data:getuser});
    }catch(error){
        console.error(error);
        res.status(500).json({message:'internla server issue', status:false, data:null});
    }
})


// login 
// app.post('/login', async (req,res)=>{
//     const 
// })
// Get Students with GET method
app.get('/api/datas', async (req, res) => {
    try {
        const getData = await Student.find();
        res.json(getData);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Issue" });
    }
});

// Update Student with PATCH method
app.patch('/api/datas/:id', async (req, res) => {
    try {
        const updateData = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updateData || { error: "Data not found" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Issue" });
    }
});

// Delete Student with DELETE method
app.delete('/api/datas/:id', async (req, res) => {
    try {
        const deleteData = await Student.findByIdAndDelete(req.params.id);
        res.json(deleteData ? { message: "Deleted successfully" } : { error: "Data not found" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Issue" });
    }
});

// Insert Multiple Students
app.post('/api/datas/bulk', async (req, res) => {
    try {
        const insertStu = await Student.insertMany(req.body);
        res.status(200).json(insertStu);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Issue" });
    }
});

// Update Multiple Students
app.put('/api/datas', async (req, res) => {
    try {
        const { filter, upData } = req.body;
        const manyupData = await Student.updateMany(filter, { $set: upData });
        res.json(manyupData);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Issue" });
    }
});

// Delete Multiple Students
app.delete('/api/datas', async (req, res) => {
    try {
        const filter = req.body;
        const deleterAll = await Student.deleteMany(filter);
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Issue" });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

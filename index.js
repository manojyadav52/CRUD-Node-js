const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT =8080;


app.use(express.json());
app.use(express.urlencoded({extended:true}));


// connect the databases with the mongoose
mongoose.connect('mongodb://localhost:27017/Pro-3',
{useNewUrlParser: true, useUnifiedTopology: true});

// create Schema 
const studentSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        value:["male","female"],
    },
    status:{
        type:String,
        value:["active","noactive"],
    },
});


// created model
const Student =mongoose.model("Student",studentSchema);

// insert Student witht the help of the post methods 
app.post('/api/datas', async (req,res)=>{
        try{
            const addData = new Student(req.body);
            await addData.save();
            res.json(addData);
        }catch(error){
            res.status(500).json({error:"Interanal Server Issue"});
        }
});


// get Student with the help of the get methods 
app.get('/api/datas/',async (req,res)=>{
            try{
                const getData = await Student.find();
                if(getData){
                    res.json(getData);
                }else{
                    res.status(400).json({error:"data not found"});
                }
            }catch(error){
                res.json({error:"Intrnal Server Issue"});
            }
});



// update Student with the help of the patch methods 
app.patch('/api/datas/:id', async (req,res)=>{
        try{
                const updateData = await Student.findByIdAndUpdate(req.params.id, req.body, {new:true});
                if(updateData){
                    res.json(updateData);
                }else{
                    res.json({error:"data not found"});
                }
        }catch(error){
            res.json({error:"internal Server Issue"});
        }
});



// delete Student with the help of the Delete Methods 
app.delete('/api/datas/:id', async (req,res)=>{
        try{
            const deleteData =await Student.findByIdAndDelete(req.params.id);
            if(deleteData){
                res.end();
            }else{
                res.json({error:"data not found"});
            }
        }catch(error){
            res.json({error:"interanl Server Issue"});
        }
})






//////////////////////////////////////////////////////////////////////////////////////////////////////////




// insertMany StudentData with the help of the post mehtods 
app.post('/api/datas', async (req,res)=>{
       try{
            const insertStu = await Student.insertMany(req.body);
            if(insertStu){
                res.status(200).json(insertStu);
            }else{
                res.json({error:"data not inserted"});
            }
       }catch(error){
        res.status(500).json({error:"Internal server issue"});
       }
});


// updateMany
app.put('/api/datas', async (req,res)=>{
       try{
            const {filter,upData} =req.body;
            const manyupData =await Student.updateMany(filter,{$set:upData});
            if(manyupData){
                res.json(manyupData);
            }else{
                res.json({error:"data not updated"});
            }
       }catch(error){
        res.json({error:"Internal Server Issue"});
       }
});



// deleteMany
app.delete('/api/datas', async (req,res)=>{
        try{
                const filter =req.body;
                const deleterAll = await Student.deleteMany(filter);
                if(deleterAll){
                    res.end();
                }else{
                    res.json({error:"data not deleted"});
                }
        }catch(error){
            res.json({error:"Internal server issue"});
        }
})

// created Server 
app.listen(PORT,(req,res)=>console.log(`server will be listening the ${PORT}`));
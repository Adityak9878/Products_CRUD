const express=require('express');
const app=express();
const path=require('path');
const methodOverride=require('method-override');


app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));

const Product=require('./models/product.js')

const mongoose=require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/FarmStand')
.then(()=>{
    console.log("MONGO CONNECTION OPEN");
})
.catch((err)=>{
    console.log("Error !")
    console.log(err)
})

app.put('/products/:id',async (req,res)=>{
    const {id}=req.params;
    const newProduct=await Product.findByIdAndUpdate(id,req.body,{runValidators:true,new:true});
    res.redirect('/products');
})

app.delete('/products/:id',async(req,res)=>{
    const {id}=req.params;
    const deletedProduct=await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

app.get('/products',async (req,res)=>{
    const {category}=req.query;
    if(category){
        const products=await Product.find({category});
        res.render('products/index',{products})
    }
    else{
        const products=await Product.find();
        res.render('products/index',{products})
    }
   
})

app.get('/products/:id',async (req,res)=>{
    const {id}=req.params;
    const product=await Product.findById(id);
    res.render('products/show',{product})
})

app.get('/products_NEW',(req,res)=>{
    res.render('products/new');
})

app.get('/products/:id/edit',async (req,res)=>{
     const {id}=req.params;
    const product=await Product.findById(id);
    res.render('products/edit',{product});
})

app.post('/products',async (req,res)=>{
    const newProduct=new Product(req.body);
    await newProduct.save();
    console.log(newProduct);
    res.redirect('/products');
})

app.listen(3000,()=>{
    console.log("Listening on Port 3000");
})

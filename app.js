require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const fs = require('fs')
//const morgan = require('morgan');

//Database Connection
const dbconnect = require('./config/database');
//Google login Config
require('./config/google_passort');
// Enable cors
const cors = require('cors');
app.use(cors());


// //create a write stream (in append mode)
// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
// app.use(morgan('dev', {
//     skip: function (req, res) { return res.statusCode < 400 }
//   }))
// // setup the logger
// app.use(morgan('combined', { stream: accessLogStream }));


// Start Google login Authdentication
    // Session middleware
    app.use(session({
        secret: 'iamkingofecommerceapp',
        resave: false,
        saveUninitialized: true,
    }));
    // Initialize passport and session
    app.use(passport.initialize());
    app.use(passport.session());
//End Google login Authdentication

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for serving uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Google login
const googleloginRouter = require('./api/user/auth/googlelogin/googleloginRouter');
app.use('/api', googleloginRouter);

//Router Modules
const adminRouter = require('./api/admin/adminRouter');
const categoryRouter = require('./api/category/categoryRouter');
const subcategoryRouter = require('./api/subcategory/subCategoryRouter');
const brandRouter = require('./api/brand/brandRouter'); 
const tagsRouter = require('./api/tags/tagsdRouter');
const attributeRouter = require('./api/attribute/attributeRouter');
const attributevaluesRouter = require('./api/attributevalues/attributevaluesRouter');
const bannerRouter = require('./api/banner/bannerRouter');
const offerbannerRouter = require('./api/offerbanner/offerbannerRouter');
//Company Setting
const generalinfoRouter = require('./api/settings/generalinfo/generalinfoRouter');
const companyinfoRouter = require('./api/settings/companyinfo/companyRouter');
const metadataRouter = require('./api/settings/metadata/metadataRouter');
const contactinfoRouter = require('./api/settings/contactinfo/contactinfoRouter');
const aboutusinfoRouter = require('./api/settings/aboutus/aboutusRouter');
const policyRouter = require('./api/settings/policy/policyRouter');
//Product
const productRouter = require('./api/product/productRouter');
//Promocode
const promocodeRouter = require('./api/promocodes/promocodeRouter');
//tax vat
const taxRouter = require('./api/tax/taxRouter');

//******** Mobile App Api ***********/
//Google LoginConfig
const loginConfigRouter = require('./api/settings/loginconfig/loginConfigRouter');
//Register
const userRouter = require('./api/user/auth/userRouter');
//Address
const addresMobileRouter = require('./api/mobile/address/addressRouter');
//Category
const categoryMobileRouter = require('./api/mobile/category/categoryRouter');
//Sub category
const subcategoryMobileRouter = require('./api/mobile/subcategory/subcategoryRouter');
//Product
const productMobileController = require('./api/mobile/product/productRouter');
//Review
const reviewMobileRouter = require('./api/review/mobile/reviewRouter');
//Add to cart
const addtocartMobileRouter = require('./api/mobile/cart/cartRouter');
//Whishlist
const whishlistRouter = require('./api/mobile/wishlist/wishlistRouter');
//PlaceOrder
const placeorderMobileRouter = require('./api/mobile/order/orderRouter');


app.use('/api', adminRouter);
app.use('/api', categoryRouter);
app.use('/api', subcategoryRouter);
app.use('/api', brandRouter);
app.use('/api', tagsRouter);
app.use('/api', attributeRouter);
app.use('/api', attributevaluesRouter);
app.use('/api', bannerRouter);
app.use('/api', offerbannerRouter);
//Company Setting
app.use('/api', generalinfoRouter);
app.use('/api', companyinfoRouter);
app.use('/api', metadataRouter);
app.use('/api', contactinfoRouter);
app.use('/api', aboutusinfoRouter);
app.use('/api', policyRouter);
//Product
app.use('/api', productRouter);
//promocode
app.use('/api', promocodeRouter);
//tax
app.use('/api', taxRouter);
//******** Mobile App Api ***********/
//Google LoginConfig
app.use('/api', loginConfigRouter);
//Register
app.use('/api/mobile', userRouter);
//Address
app.use('/api/mobile', addresMobileRouter);
//Category
app.use('/api/mobile', categoryMobileRouter);
//Sub category
app.use('/api/mobile', subcategoryMobileRouter);
//Product
app.use('/api/mobile', productMobileController);
//Review
app.use('/api/mobile', reviewMobileRouter);
//Add to cart
app.use('/api/mobile', addtocartMobileRouter);
//Whislist
app.use('/api/mobile', whishlistRouter);
////PlaceOrder
app.use('/api/mobile', placeorderMobileRouter);


// Catch-all 404 handler
const customError = require('./utils/customError');
app.use((req, res, next) => {
    next(customError.NotFound('The requested resource could not be found'));
});
// Error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    dbconnect();
    console.log("Server Running on", PORT);
});
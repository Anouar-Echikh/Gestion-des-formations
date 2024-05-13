const express=require('express');
const passport = require("passport");
const logger = require("morgan");

require('dotenv').config();
const database = require('./src/database/db.config');
//const express=require('express');
const app=express();
const cors=require('cors');
app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(logger("dev"));
database.mongoose.connect(database.url, {
    useNewUrlParser: true,
    useUnifiedTopology:true
    }
    ).then(()=>{
        console.log('connected to database'); 
       })
       .catch(err => {
           console.log(err);
       });
       ;

//passport
app.use(passport.initialize());
app.use(passport.session());
require("./src/config/passport")(passport);
require('./src/api/routes/routes')(app);

// --------- Errors -------------//
//the Error-middlewares must be in the end of file and befor "module-export"

app.use((req, res, next) => {
    var err = new Error(`URL : [${req.originalUrl}] => Not found`);
    err.status = 404;
    next(err);
  });
  
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    const error = err.message || "Error processing your request";
    res.status(status).send({
      error
    });
  });


app.listen(process.env.PORT, ()=>{
    console.log ('listening on port', process.env.PORT);
});
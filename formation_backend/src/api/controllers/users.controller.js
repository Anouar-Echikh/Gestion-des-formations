const User = require("../models/users.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserController = {};
/***
 * Sign up logic
 */

 UserController.register = async (req, res, next) => {
  const { name, email, password,role,level,image,connected } = await req.body;
  

  //console.log(newUser);
  try {
    //get infoDevice from user request
   
        const foundUser = await User.findOne({ "local.email": email });
        if (foundUser) {
          res.send({ error: `L'email : " ${email} " est déjà utilisé` });
          next();
        } else {
          
          // Create a new user
          const newUser = new User({
            method: "local",
            local: {
              email,
              password
            },
            name,
            lastLogin: new Date(),
            connected:connected!=null?connected: true,
            role: role?role:"user",
            
          });

          //add new user
          const userAdded = await newUser.save();
          // remove password from response
          const responseUser = {};
          responseUser.name = userAdded.local.name;
          responseUser.email = userAdded.local.email;
          responseUser._id = userAdded.local._id;

          //Generate the token
          const secret = process.env.JWT_SECRET;
          const expiration = process.env.JWT_EXPIRATION; //JWT_EXPIRATION : can be 1-2-3-...d (1day) or 2-3-...h (hour)
          const token = jwt.sign({ _id: userAdded._id }, secret, {
            expiresIn: expiration
          });

          // Respond with token and user

          return res.send({ token });
        }    
    
  } catch (e) {
    next(e)
  }
};




UserController.login = async (req, res, next) => {
  const { email, password, verifiedUser } = req.body;

  try {

    //check email and password
    const foundUser = await User.findOne({ "local.email": email.toLowerCase() });
    if (!foundUser) {
      // res.send({ error: `L'email : [${email}] n'existe pas dans le système.` });
      const error = new Error(
        `L'email : [${email}] \n n'existe pas dans le système.`
      );
      // error.status = 401;
      res.send({
        error: `L'email : [${email}] n'existe pas dans le système.`
      });
      
      
    } else {
      foundUser.isPasswordMatch(
        password,
        foundUser.local.password,
        async (err, user) => {
          if (user) {
            //if credit ok ,then return jwt // or we can return jwt for free use (3 days - 30 d -90 d - ...) in registration

            const secret = process.env.JWT_SECRET;
            const expiration = process.env.JWT_EXPIRATION; //JWT_EXPIRATION : can be 1-2-3-...d (1day) or 2-3-...h (hour)
            const token = jwt.sign({ _id: foundUser._id }, secret, {
              expiresIn: expiration
            });
            //Check if this account is blocked by admin
            if (foundUser.blocked) {
              res.status(401);
              return res.send({
                error: "Ce compte est bloqué, veuillez contacter l'administartion!"
              });
            } else {
              // add date of User login
              await User.updateOne(
                { _id: foundUser._id },
                {
                  $set: {
                    lastLogin: new Date(),
                    connected: true,

                    infoDevice: null
                  }
                }
              );
              //-----end of adding date//

              res.send({ token });
            }
          } else {
            //correct email & incorrect password
            res.send({
              error: "Vérifier le mot de passe!"
            });
          }
        }
      );
    }

  } catch (e) {
    next(e);
  }
};

//**** modify User */
UserController.patch = async (req, res, next) => {
  let body = req.body;
  const id = req.params.id;
  body = {
    ...body, 
    updatedAt: new Date()
  }
  try {

      
      const updatedUser = await User.updateOne(
        { _id: id },
        body
      );

      res.send({
        success: true,
        updatedUser
      });
     
   
  } catch (e) {
    next(e);
  }
};
//unlock account by verifying password
UserController.unlockUser = async (req, res, next) => {
  const { id, password } = req.body;

  try {
    //check email and password
    const foundUser = await User.findOne({ _id: id });
    if (foundUser.method === "local") {
      foundUser.isPasswordMatch(
        password,
        foundUser.local.password,
        async (err, User) => {
          if (User) {
            return res.send({ success: true });
          } else {
            return res.send({
              error: "Vérifier le mot de passe!",
              reqBody: req.body
            });
          }
        }
      );
    }

    if (foundUser.method === "facebook") {
      foundUser.isPasswordMatch(
        password,
        foundUser.facebook.password,
        async (err, User) => {
          if (User) {
            return res.send({ success: true });
          } else {
            return res.send({
              error: "Vérifier le mot de passe!"
            });
          }
        }
      );
    }
    if (foundUser.method === "google") {
      foundUser.isPasswordMatch(
        password,
        foundUser.google.password,
        async (err, User) => {
          if (User) {
            return res.send({ success: true });
          } else {
            return res.send({
              error: "Vérifier le mot de passe!",
              reqBody: req.body
            });
          }
        }
      );
    }
  } catch (e) {
    next(e);
  }
};


/***
 *
 * Get Current User
 *
 */

UserController.currentUser = (req, res, next) => {
  let user = req.user;
  console.log("currentUser:", user)
  res.send(user);
};




/***
*
* Get all Users
*
*/
UserController.getAllUsers = async (req, res, next) => {
  try {
    const Users = await User.find({});

    res.send(Users);

  } catch (e) {
    next(e);
  }
};

/***
 *
 * Get User by email
 *
 */


UserController.getUserByEmail = async (req, res, next) => {
  const email = req.params.email;
  try {
    const foundUser = await User.findOne({
      "local.email": email
    });
    //let arrOfAccount = foundUser; //because in UsersReducer we have Users:[] as state
    if (foundUser) {
      res.send({ account: foundUser });
    } else {
      res.status(401).send({
        error: `L'email : [${email}] n'existe pas dans le système.`
      });
    }
  } catch (e) {
    next(e);
  }
};

// Get User by Id

UserController.getUserById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const foundUser = await User.findOne({
      _id: id
    });
 
    if (foundUser) {
      res.send({ account: foundUser });
    } else {
      res.send({
        error: `Ce compte n'existe pas dans le système.`
      });
    }
  } catch (e) {
    next(e);
  }
};
UserController.getUserCIValue = async (req, res, next) => {
  const idCiN = req.params.ciValue;
  try {
    const foundUser = await User.findOne({
      ciValue: idCiN
    });
 
    if (foundUser) {
      res.send({ account: foundUser });
    } else {
      res.send({
        error: `Ce compte n'existe pas dans le système.`

      });
    }
  } catch (e) {
    next(e);
  }
};

/***
 *
 * Delete User
 *
 */
UserController.destroy = async (req, res, next) => {
  const id = req.params.id;

  try {
    await User.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "User deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};

/***
 *
 * Update User
 *
 */


//Update password
UserController.updatePassword = async (req, res, next) => {
  const { password, id } = req.body;

  try {
    const UserToUpdate = await User.findById(id);
    //Encrypt the password
    const salt = await bcrypt.genSalt();
    const cryptedPassword = await bcrypt.hash(password, salt);

    if (UserToUpdate.method === "local") {
      const a = (updatedUser = await User.updateOne(
        { _id: id },
        {
          $set: {
            "local.password": cryptedPassword,
            lastUpdate: new Date()
          }
        }
      ));
      if (a.ok === 1) {
        return res.send({
          success: true
        });
      } else {
        return res.send({
          success: false,
          error: "Problème de mis à jour"
        });
      }
    }


  } catch (e) {
    next(e);
  }
};

UserController.logOut = async (req, res, next) => {
  const User_id = req.user._id;

  try {
    const updatedUser = await User.updateOne(
      { _id: User_id },
      { $set: { connected: false } }
    );

    return res.send({
      success: true
    });
  } catch (e) {
    next(e);
  }
};

//upload image avatar
UserController.uploadImg = async (req, res, next) => {
  if (req.file) {
    res.send({ imgUpload: true });
    //res.json(req.file);
  } else res.send({ imgUpload: true });
};

module.exports = UserController;

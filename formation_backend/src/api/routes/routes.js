module.exports = (app) => {
  const router = require("express").Router();
  const passport = require("passport");
  const formationController = require("../controllers/formation.controller");
  const userController = require("../controllers/users.controller");
  const emailController = require("../controllers/email.controller");

  //auth and sign up & retrive account

  router.post("/register", userController.register);
  router.post("/login", userController.login);
  router.post("/unlock", userController.unlockUser);
  router.get("/user/:email", userController.getUserByEmail);
  router.put("/changeUserPwd", userController.updatePassword);
  router.post("/sendEmailFromClient", emailController.sendEmail); //Send email from contact form

  // Customize auth message Protect the  routes
  router.all("*", (req, res, next) => {

    passport.authenticate("jwt", { session: false }, (err, user) => {
      if (err || !user) {
        const error = new Error("You are not authorized to access this area");
        error.status = 401;
        throw error;
      }
  
      req.user = user;
      return next();
    })(req, res, next);
   
  });

  //users
  router.get("/profile", userController.currentUser);
  router.put("/logOut", userController.logOut);
  router.get("/users", userController.getAllUsers);
  router.get("/user/:id", userController.getUserById);
  router.patch("/user/patch/:id", userController.patch);
  router.delete("/user/:id", userController.destroy);

  //formation
  router.post("/formations/create", formationController.create);
  router.get("/formations/all", formationController.findAll);
  router.get("/formations/getOne/:id", formationController.findOne);
  router.patch("/formations/update/:id", formationController.patch);
  router.delete("/formations/delete/:id", formationController.delete);
  app.use("/api/", router);
};

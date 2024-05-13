const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

const UserSchema = Schema({
  method: {
    type: String,
    enum: ["local", "google", "facebook","microsoft"],
    required: true
  },
  local: {
    name: { type: String },
    email: {
      type: String,
      lowercase: true,
      index: true
    },
    password: {
      type: String
    }
  },
  role: { type: String }, //role can be : admin, formateur, etudiant
  name: { type: String, text: true },
  joined: { type: Date, default: new Date() },
  image: {type: Object},
  lastUpdate: { type: Date },
  lastLogin: { type: Date },
  phone: { type: String },
  cin: { type: String },
  level: { type: String },
  status: { type: String },
  connected: { type: Boolean }, 
  active: { type: String },
 });

UserSchema.pre("save", async function(next) {
  if (this.method == "local") {
    //Check if password is not modified
    if (!this.isModified("local.password")) {
      return next();
    }

    //Encrypt the password
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.local.password, salt);
      this.local.password = hash;
      next();
    } catch (e) {
      return next(e);
    }
  }
  if (this.method == "facebook") {
    //Check if password is not modified
    if (!this.isModified("facebook.password")) {
      return next();
    }

    //Encrypt the password
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.facebook.password, salt);
      this.facebook.password = hash;
      next();
    } catch (e) {
      return next(e);
    }
  }
  if (this.method == "google") {
    //Check if password is not modified
    if (!this.isModified("google.password")) {
      return next();
    }

    //Encrypt the password
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.google.password, salt);
      this.google.password = hash;
      next();
    } catch (e) {
      return next(e);
    }
  }
});
UserSchema.pre("update", async function(next) {
  if (this.method == "local") {
    //Check if password is not modified
    if (!this.isModified("local.password")) {
      return next();
    }

    //Encrypt the password
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.local.password, salt);
      this.local.password = hash;
      next();
    } catch (e) {
      return next(e);
    }
  }
  if (this.method == "facebook") {
    //Check if password is not modified
    if (!this.isModified("facebook.password")) {
      return next();
    }

    //Encrypt the password
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.facebook.password, salt);
      this.facebook.password = hash;
      next();
    } catch (e) {
      return next(e);
    }
  }
  if (this.method == "google") {
    //Check if password is not modified
    if (!this.isModified("google.password")) {
      return next();
    }

    //Encrypt the password
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.google.password, salt);
      this.google.password = hash;
      next();
    } catch (e) {
      return next(e);
    }
  }
});

UserSchema.methods.isPasswordMatch = async function(password, hash, callback) {
  await bcrypt.compare(password, hash, (err, sucess) => {
    if (err) {
      return callback(err);
    }
    callback(null, sucess);
  });
};
//for security :override toJSON() in order to remove password from response object
//but it is bad if we want to reuse the json object because the "password" field is removed from.
/*UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};*/

//UserSchema.plugin(validator); we don't DidUpdate to this plugin because the error is already handled in the controller
const User = mongoose.model("User", UserSchema);

module.exports = User;


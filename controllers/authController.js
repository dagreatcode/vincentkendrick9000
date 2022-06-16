require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");

// "Login"

router.post("/api/login", (req, res) => {
  // const password = req.body;
  // const email = req.body; 
  const data = req.body
  const email = data.email
  const password = data.password
  // const typeOfUser = data.typeOfUser

  // console.log(email)
  // console.log(password) 
  // console.log(typeOfUser) 
  // console.log(data) 
  db.User.findOne({ email: email })
    .then((foundUser) => {
      console.log(data) 
      console.log(foundUser);
      if (foundUser) {
        // TODO: if too many failed attempts to login.
        bcrypt
        
          .compare(password, foundUser.password)
          .then(function (result) {
            console.log("password:", password)
            console.log("Found User Password:", foundUser.password)
            console.log("The password match result: ", result);
            if (result) {
              // // TODO: Send a jwt back as data instead.
              // // TODO: lock down the token in a time limit
              // // TODO: Something needs to be on the back end paying attention
              const token = jwt.sign(
                { email: foundUser.email },
                process.env.SECRET
              );
              console.log("Token:", token)
              res.json({
                err: false,
                data: token,
                message: "Successfully logged in.",
              });
            } else {
              res.status(401).json({
                err: true,
                data: null,
                message: "Failed to sign in 3",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(401).json({
              err: true,
              data: null,
              message: "Failed to sign in 2",
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        err: true,
        data: null,
        message: "Failed to sign in 1",
      });
    });
});

// TODO: Fix the return password to match. maybe reverse hash to match login password.
// "Sign Up"

router.post("/api/signUp", (req, res) => {
  // const { email, password } = req.body;
  // console.log(req.body[0].email);
  // console.log(req.body[0].password)
  // console.log(req.body)
  const data = req.body
  //  const password = req.body[0]?.password;
  //  const email = req.body[0]?.email && req.body[0];
  //  const {test} = req.body;
  //  console.log(data.email)
  const email = data.email
  const password = data.password
  //  const em = email.toString()

  //  console.log(password)
  //  console.log(email)
  if (!email || !password) {
    res.status(400);
  } else {
    bcrypt
      .hash(password, 10)
      .then((hashedPassword) => {
        // const ema = email[0]
        // console.log(hashedPassword);
        // console.log(ema)
        db.User.create({
          email: email,
          password: hashedPassword,
        })
          .then((newUser) => {
            // console.log(newUser._id)
            // TODO: Here I Am!
            console.log(newUser)
            // console.log(newUser.email)
            const token = jwt.sign(
              {_email: newUser.email },
              process.env.SECRET
            );
            res.json({
              err: false,
              data: token,
              message: "Successfully signed up.",
            });
            // res.json(newUser);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: true,
              data: null,
              message: "Unable to signUp.",
            });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
        error: true,
        data: null,
        message: "Password?",
        });
      });
  }
});

module.exports = router;

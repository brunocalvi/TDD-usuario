const express = require("express");
const mongo = require("../database/mongo");
const user = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWTSecret = ";LQ7e{+d)^.L3Yw-*KQBz?6ZfI4";

let User = mongo.model("User", user);

router.get("/", (req, res) => {
  res.json({});
});

router.post("/user", async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;

  if(name == "" || email == "" || password == "") {
    res.status(400).send({mensagem: 'Dados vazios.'});
    return;
  }

  try {
    let user = await User.findOne({"email": email});

    if(user != undefined) {
      res.status(400).send({error: `E-mail já cadastrado.`});
      return;
    }

    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);

    let newUser = new User({name: name, email: email, password: hash});

    await newUser.save();
    res.json({email: email});

  }catch(e) {
    res.status(400).send({mensagem: `Falha: ${e}`});
  }
});

router.post("/auth", async (req, res) => {
  let {email, password} = req.body;

  let user = await User.findOne({'email': email});

  if(user == undefined) {
    res.status(403).json({errors: {email: "E-mail não cadastrado."}});
    return;
  }

  let isPassowrdRight = await bcrypt.compare(password, user.password);

  if(!isPassowrdRight) {
    res.status(403).json({errors: {password: "Senha incorreta."}});
    return;
  }

  jwt.sign({email, name: user.name, id: user._id}, JWTSecret, {expiresIn: '48h'}, (err, token) => {
    if(err) {
      console.log(err);
      res.status(500).send({mensagem: `Falha ao gerar o token`});

    } else {
      res.status(200).json({ token });
    }
  });
});

router.delete("/user/:email", async (req, res) => {
  await User.deleteOne({"email": req.params.email});

  res.status(200).send({mensagem: `Usuário deletado`});
});

module.exports = router;
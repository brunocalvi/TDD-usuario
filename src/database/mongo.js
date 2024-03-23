const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/guiapics").then(() => {
  //console.log("O banco se conectou ...")
}).catch(e => {
  console.log(e);
});

module.exports = mongoose;
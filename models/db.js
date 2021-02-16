const mongoose = require('mongoose');
const uri = "mongodb+srv://root:admin@cluster0.xwn73.mongodb.net/MTUJS?retryWrites=true&w=majority";
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true  });
module.exports = mongoose;
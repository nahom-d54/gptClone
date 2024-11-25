const fs = require('fs');
const path = require('path');

const mongoose  = require('mongoose');


const modelsPath = path.join(process.cwd(), 'src/models');

// Initialize all models in src/models directory

fs.readdirSync(modelsPath)
  .filter((dir) => dir.indexOf(''))

  .forEach((dir) => require(path.join(modelsPath, dir)));

const connectToDb = async () => {
  try {
    const connectOptions = {};

    
    await mongoose.connect(process.env.MONGO_URI, connectOptions);
    console.log("connected to database")

  } catch (error) {
    console.error( error);
    throw error;
  }
};

module.exports = connectToDb;
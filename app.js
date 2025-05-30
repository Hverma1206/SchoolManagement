const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const schoolRoutes = require('./routes/schools');
const db = require('./db'); 
const app = express();

db.query('SELECT 1')
.then(() => {console.log('Database connection successful');})
.catch(err => {
  console.error('Database connection failed:', err);
});


app.use(bodyParser.json());

app.use('/', schoolRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

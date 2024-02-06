const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
const corsOptions = {
    origin: 'https://valentine-nine-sigma.vercel.app', // Change this to your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };
  
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const responseSchema = new mongoose.Schema({
  response: String,
});

const Response = mongoose.model('Response', responseSchema);

app.post('/api/responses', async (req, res) => {
  try {
    const { response } = req.body;
    const newResponse = new Response({ response });
    await newResponse.save();
    res.status(201).json(newResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/', (req, res) => {
    res.send('Hello, this is your server responding!');
  });
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

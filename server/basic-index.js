
// Dependency Imports
import express from 'express'
import dotenv from "dotenv"

// load env variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public_frontend'));
app.use(express.json());


app.get('/getData', (req, res) => {
  res.status(200).send({
    message:`Return this message from backend`
  });
});

app.post('/postData', (req, res) => {
  const {posting} = req.body;
  console.log(posting);
})

app.listen(port, () => console.log(`Server is running on port: ${port}`));
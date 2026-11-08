const express = require('express');
const app = express();

app.use(express.json());

// Define your routes here
app.get('/', (req, res) => {
    res.send('Hello, World updated second time!');
});

app.get('/crash', (req, res) => {
    res.send('Server will crash now!');
    process.exit(1); // This will crash the server
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
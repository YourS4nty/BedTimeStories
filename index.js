const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, 'views')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const express = require('express');
const app = express();

require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const PORT = process.env.PORT || 3500;

app.use('/api/v1', require('./routes'));

app.listen(PORT, () =>
    console.log(`server is running on http://localhost:${PORT}`)
);

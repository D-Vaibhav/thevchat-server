const express= require('express');
const router= express.Router();

// setting route for get('/')
router.get('/', (req, res) => {
    res.send('server is up and start running...');
});

module.exports= router;
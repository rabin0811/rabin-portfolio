const express = require('express')

const router = express.Router()

let visitors = 0

router.get('/', (req, res) => {

    visitors++

    res.status(200).json({
        visitors,
    })

})

module.exports = router
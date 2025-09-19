const express = require("express");
const { addTransection, getAllTransection, editTransection, deleteTransection } = require("../controllers/transectionCtrl");


//router object
const router = express.Router();

//routes
//Add transection Post Method

router.post('/add-transection', addTransection)

//Edit transection Post Method

router.post('/edit-transection', editTransection)


//Edit transection Post Method

router.post('/delete-transection', deleteTransection)

//get Transection Get Method

router.post('/get-transection', getAllTransection)

module.exports = router;
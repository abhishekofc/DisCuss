import express from "express";
import { addcategory, editcategory, showcategory, deletecategory, getallcategory } from "../controllers/category.controller.js";
import { authenticateadmin } from "../onlyadmin.js";
const categoryroute = express.Router();

// Correct HTTP methods
categoryroute.post('/add', authenticateadmin,addcategory);
categoryroute.put('/update/:categoryid', authenticateadmin,editcategory);
categoryroute.get('/show/:categoryid',authenticateadmin, showcategory);
categoryroute.delete('/delete/:categoryid',authenticateadmin, deletecategory);
categoryroute.get('/all-category', getallcategory);

export default categoryroute;

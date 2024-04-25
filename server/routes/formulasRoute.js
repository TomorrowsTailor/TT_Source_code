const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { TrouserCalculation, FetchFormulaeController,UpdateFormulaController, DeleteFormulaController, generatePDF } = require("../controllers/formulasController");
router.post("/calculate", TrouserCalculation);

router.get("/formulae",FetchFormulaeController);
router.put("/edit-formulae/:id",UpdateFormulaController)
router.delete("/delete-formulae/:id",DeleteFormulaController)
// router.get('/download-pdf',generatePDF);

module.exports = router;

const express = require("express");
const { validateIdMiddleware } = require("../utils/validationUtils");
const {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
  getMonthlyReport,
  getSalesSummary,
} = require("../controllers/sales");

const router = express.Router();

function validateSaleData(req, res, next) {
  const { items, paymentMethod } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: "A venda deve conter pelo menos um item.",
    });
  }

  for (const item of items) {
    if (!item.productId || !item.quantity || !item.unitPrice) {
      return res.status(400).json({
        error: "Cada item deve ter productId, quantity e unitPrice.",
      });
    }

    if (item.quantity <= 0) {
      return res.status(400).json({
        error: "A quantidade deve ser maior que zero.",
      });
    }

    if (item.unitPrice <= 0) {
      return res.status(400).json({
        error: "O preço unitário deve ser maior que zero.",
      });
    }
  }

  const validPaymentMethods = [
    "dinheiro",
    "cartao_credito",
    "cartao_debito",
    "pix",
    "transferencia"
  ];

  if (!paymentMethod || !validPaymentMethods.includes(paymentMethod)) {
    return res.status(400).json({
      error: "Método de pagamento inválido.",
    });
  }

  next();
}

router.post("/", validateSaleData, createSale);
router.get("/", getAllSales);
router.get("/summary", getSalesSummary);
router.get("/report", getMonthlyReport);
router.get("/:id", validateIdMiddleware, getSaleById);
router.put("/:id", validateIdMiddleware, validateSaleData, updateSale);
router.delete("/:id", validateIdMiddleware, deleteSale);

router.use((err, req, res, next) => {
  console.error("🚨 Erro capturado:", err.message);
  res.status(500).json({ error: err.message || "Erro interno do servidor." });
});

module.exports = router; 
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
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesByCategory,
  initializeServices,
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
    if (!item.itemId || !item.itemType || !item.quantity || !item.unitPrice) {
      return res.status(400).json({
        error: "Cada item deve ter itemId, itemType, quantity e unitPrice.",
      });
    }

    if (!["product", "service"].includes(item.itemType)) {
      return res.status(400).json({
        error: "Tipo de item inválido. Deve ser 'product' ou 'service'.",
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

function validateSaleUpdate(req, res, next) {
  const { status, notes } = req.body;
  
  // Para atualizações simples como cancelamento, só validamos se há dados
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      error: "Dados para atualização são obrigatórios.",
    });
  }

  // Se status for fornecido, validar valores permitidos
  if (status && !["concluida", "cancelada", "pendente"].includes(status)) {
    return res.status(400).json({
      error: "Status inválido. Valores permitidos: concluida, cancelada, pendente",
    });
  }

  next();
}

// Rotas de serviços (devem vir antes das rotas com :id)
router.post("/services", createService);
router.get("/services", getAllServices);
router.get("/services/category/:category", getServicesByCategory);
router.get("/services/:id", validateIdMiddleware, getServiceById);
router.put("/services/:id", validateIdMiddleware, updateService);
router.delete("/services/:id", validateIdMiddleware, deleteService);
router.post("/services/initialize", initializeServices);

// Rotas de vendas
router.post("/", validateSaleData, createSale);
router.get("/", getAllSales);
router.get("/summary", getSalesSummary);
router.get("/report", getMonthlyReport);
router.get("/:id", validateIdMiddleware, getSaleById);
router.put("/:id", validateIdMiddleware, validateSaleUpdate, updateSale);
router.delete("/:id", validateIdMiddleware, deleteSale);

router.use((err, req, res, next) => {
  console.error("🚨 Erro capturado:", err.message);
  res.status(500).json({ error: err.message || "Erro interno do servidor." });
});

module.exports = router; 
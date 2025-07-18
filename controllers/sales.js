const {
  createSaleService,
  getAllSalesService,
  getSaleByIdService,
  updateSaleService,
  deleteSaleService,
  getMonthlyReportService,
  getSalesSummaryService,
} = require("../services/sales");

const mongoose = require("mongoose");

async function createSale(req, res) {
  try {
    const saleData = req.body;

    if (!saleData.items || !saleData.items.length) {
      return res.status(400).json({
        error: "A venda deve conter pelo menos um item.",
      });
    }

    if (!saleData.paymentMethod) {
      return res.status(400).json({
        error: "Método de pagamento é obrigatório.",
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        error: "Usuário não autenticado ou token inválido.",
      });
    }

    saleData.soldBy = req.user.id;

    const newSale = await createSaleService(saleData);

    res.status(201).json(newSale);
  } catch (error) {
    console.error("❌ Erro ao criar venda:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
}

async function getAllSales(req, res) {
  try {
    const { status, paymentMethod, startDate, endDate, soldBy } = req.query || {};
    const sales = await getAllSalesService({ status, paymentMethod, startDate, endDate, soldBy });

    res.status(200).json(sales);
  } catch (error) {
    console.error("❌ Erro ao buscar vendas:", error.message);
    res.status(500).json({ error: error.message || "Erro interno no servidor" });
  }
}

async function getSaleById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const sale = await getSaleByIdService(id);
    if (!sale) {
      return res.status(404).json({ error: "Venda não encontrada." });
    }

    res.status(200).json(sale);
  } catch (error) {
    console.error("❌ Erro ao buscar venda por ID:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function updateSale(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const updatedData = req.body;
    const updatedSale = await updateSaleService(id, updatedData);
    
    res.status(200).json(updatedSale);
  } catch (error) {
    console.error("❌ Erro ao atualizar venda:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function deleteSale(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    await deleteSaleService(id);
    res.status(204).end();
  } catch (error) {
    console.error("❌ Erro ao excluir venda:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getMonthlyReport(req, res) {
  try {
    const { year, month } = req.query;
    
    if (!year || !month) {
      return res.status(400).json({
        error: "Ano e mês são obrigatórios para gerar o relatório.",
      });
    }

    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        error: "Ano e mês devem ser números válidos.",
      });
    }

    const report = await getMonthlyReportService(yearNum, monthNum);
    res.status(200).json(report);
  } catch (error) {
    console.error("❌ Erro ao gerar relatório mensal:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getSalesSummary(req, res) {
  try {
    const summary = await getSalesSummaryService();
    res.status(200).json(summary);
  } catch (error) {
    console.error("❌ Erro ao buscar resumo de vendas:", error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
  getMonthlyReport,
  getSalesSummary,
}; 
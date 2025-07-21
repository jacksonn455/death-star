const {
  createSaleService,
  getAllSalesService,
  getSaleByIdService,
  updateSaleService,
  deleteSaleService,
  getMonthlyReportService,
  getSalesSummaryService,
  // Funções de serviços
  createServiceService,
  getAllServicesService,
  getServiceByIdService,
  updateServiceService,
  deleteServiceService,
  getServicesByCategoryService,
  initializeServicesService,
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

// Funções para gerenciar serviços
async function createService(req, res) {
  try {
    const serviceData = req.body;

    if (!serviceData.name || !serviceData.category || !serviceData.duration || !serviceData.price) {
      return res.status(400).json({
        error: "Nome, categoria, duração e preço são obrigatórios.",
      });
    }

    if (serviceData.price <= 0) {
      return res.status(400).json({
        error: "O preço deve ser maior que zero.",
      });
    }

    const validCategories = ["facial", "corporal", "pos_operatorio"];
    if (!validCategories.includes(serviceData.category)) {
      return res.status(400).json({
        error: "Categoria inválida. Categorias válidas: facial, corporal, pos_operatorio",
      });
    }

    const newService = await createServiceService(serviceData);
    res.status(201).json(newService);
  } catch (error) {
    console.error("❌ Erro ao criar serviço:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
}

async function getAllServices(req, res) {
  try {
    const { category, isActive } = req.query || {};
    const services = await getAllServicesService({ category, isActive });

    res.status(200).json(services);
  } catch (error) {
    console.error("❌ Erro ao buscar serviços:", error.message);
    res.status(500).json({ error: error.message || "Erro interno no servidor" });
  }
}

async function getServiceById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const service = await getServiceByIdService(id);
    if (!service) {
      return res.status(404).json({ error: "Serviço não encontrado." });
    }

    res.status(200).json(service);
  } catch (error) {
    console.error("❌ Erro ao buscar serviço por ID:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function updateService(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const updatedData = req.body;

    if (updatedData.price && updatedData.price <= 0) {
      return res.status(400).json({
        error: "O preço deve ser maior que zero.",
      });
    }

    if (updatedData.category) {
      const validCategories = ["facial", "corporal", "pos_operatorio"];
      if (!validCategories.includes(updatedData.category)) {
        return res.status(400).json({
          error: "Categoria inválida. Categorias válidas: facial, corporal, pos_operatorio",
        });
      }
    }

    const updatedService = await updateServiceService(id, updatedData);
    res.status(200).json(updatedService);
  } catch (error) {
    console.error("❌ Erro ao atualizar serviço:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function deleteService(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    await deleteServiceService(id);
    res.status(204).end();
  } catch (error) {
    console.error("❌ Erro ao excluir serviço:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getServicesByCategory(req, res) {
  try {
    const { category } = req.params;
    
    const validCategories = ["facial", "corporal", "pos_operatorio"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: "Categoria inválida. Categorias válidas: facial, corporal, pos_operatorio",
      });
    }

    const services = await getServicesByCategoryService(category);
    res.status(200).json(services);
  } catch (error) {
    console.error("❌ Erro ao buscar serviços por categoria:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function initializeServices(req, res) {
  try {
    await initializeServicesService();
    res.status(200).json({ message: "Serviços inicializados com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao inicializar serviços:", error.message);
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
  // Funções de serviços
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesByCategory,
  initializeServices,
}; 
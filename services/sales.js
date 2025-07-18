const Sale = require("../models/sales");
const Product = require("../models/products");

async function createSaleService(saleData) {
  try {
    if (!saleData.items || !saleData.items.length) {
      throw new Error("A venda deve conter pelo menos um item.");
    }

    if (!saleData.paymentMethod) {
      throw new Error("Método de pagamento é obrigatório.");
    }

    if (!saleData.soldBy) {
      throw new Error("Usuário que realizou a venda é obrigatório.");
    }

    for (const item of saleData.items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        throw new Error(`Produto com ID ${item.productId} não encontrado.`);
      }

      if (product.quantity < item.quantity) {
        throw new Error(`Estoque insuficiente para ${product.name}. Disponível: ${product.quantity}`);
      }

      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity }
      });
    }

    let totalAmount = 0;
    saleData.items.forEach(item => {
      item.totalPrice = item.quantity * item.unitPrice;
      totalAmount += item.totalPrice;
    });

    saleData.totalAmount = totalAmount;

    const newSale = new Sale(saleData);
    const savedSale = await newSale.save();

    await savedSale.populate("items.productId");

    return savedSale;
  } catch (error) {
    console.error("❌ Erro ao criar venda:", error.message);
    throw new Error(`Erro ao criar venda: ${error.message}`);
  }
}

async function getAllSalesService(query = {}) {
  try {
    const filters = {};

    if (query.status) {
      filters.status = query.status;
    }

    if (query.paymentMethod) {
      filters.paymentMethod = query.paymentMethod;
    }

    if (query.startDate && query.endDate) {
      filters.createdAt = {
        $gte: new Date(query.startDate),
        $lte: new Date(query.endDate)
      };
    }

    if (query.soldBy) {
      filters.soldBy = query.soldBy;
    }

    const sales = await Sale.find(filters)
      .populate("items.productId")
      .populate("soldBy", "name email")
      .sort({ createdAt: -1 });

    return sales || [];
  } catch (error) {
    console.error("❌ Erro ao buscar vendas:", error.message);
    throw new Error("Erro ao buscar vendas.");
  }
}

async function getSaleByIdService(id) {
  try {
    const sale = await Sale.findById(id)
      .populate("items.productId")
      .populate("soldBy", "name email");
    
    return sale;
  } catch (error) {
    console.error("❌ Erro ao buscar venda por ID:", error.message);
    throw new Error(`Erro ao buscar venda por ID: ${error.message}`);
  }
}

async function updateSaleService(id, updatedData) {
  try {
    const existingSale = await Sale.findById(id);

    if (!existingSale) {
      throw new Error("Venda não encontrada.");
    }

    if (updatedData.status === "cancelada" && existingSale.status !== "cancelada") {
      for (const item of existingSale.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: item.quantity }
        });
      }
    }

    const updatedSale = await Sale.findByIdAndUpdate(id, updatedData, {
      new: true,
    }).populate("items.productId").populate("soldBy", "name email");

    return updatedSale;
  } catch (error) {
    console.error("❌ Erro ao atualizar venda:", error.message);
    throw new Error("Erro ao atualizar venda.");
  }
}

async function deleteSaleService(id) {
  try {
    const sale = await Sale.findById(id);
    
    if (!sale) {
      throw new Error("Venda não encontrada.");
    }

    if (sale.status !== "cancelada") {
      for (const item of sale.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: item.quantity }
        });
      }
    }

    const deletedSale = await Sale.findByIdAndDelete(id);
    return deletedSale;
  } catch (error) {
    console.error("❌ Erro ao deletar venda:", error.message);
    throw new Error(`Erro ao deletar venda: ${error.message}`);
  }
}

async function getMonthlyReportService(year, month) {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const sales = await Sale.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: "concluida"
    }).populate("items.productId");

    const report = {
      period: `${year}-${month.toString().padStart(2, '0')}`,
      totalSales: sales.length,
      totalRevenue: 0,
      totalItems: 0,
      paymentMethods: {},
      topProducts: {},
      dailySales: {}
    };

    sales.forEach(sale => {
      report.totalRevenue += sale.totalAmount;

      report.paymentMethods[sale.paymentMethod] = 
        (report.paymentMethods[sale.paymentMethod] || 0) + 1;

      sale.items.forEach(item => {
        const productName = item.productName;
        if (!report.topProducts[productName]) {
          report.topProducts[productName] = {
            quantity: 0,
            revenue: 0
          };
        }
        report.topProducts[productName].quantity += item.quantity;
        report.topProducts[productName].revenue += item.totalPrice;
        report.totalItems += item.quantity;
      });

      const saleDate = sale.createdAt.toISOString().split('T')[0];
      if (!report.dailySales[saleDate]) {
        report.dailySales[saleDate] = {
          sales: 0,
          revenue: 0
        };
      }
      report.dailySales[saleDate].sales += 1;
      report.dailySales[saleDate].revenue += sale.totalAmount;
    });

    report.topProducts = Object.entries(report.topProducts)
      .sort(([,a], [,b]) => b.quantity - a.quantity)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    return report;
  } catch (error) {
    console.error("❌ Erro ao gerar relatório mensal:", error.message);
    throw new Error("Erro ao gerar relatório mensal.");
  }
}

async function getSalesSummaryService() {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [todaySales, monthSales, yearSales] = await Promise.all([
      Sale.countDocuments({
        createdAt: {
          $gte: new Date(today.setHours(0, 0, 0, 0)),
          $lt: new Date(today.setHours(23, 59, 59, 999))
        },
        status: "concluida"
      }),
      Sale.countDocuments({
        createdAt: { $gte: startOfMonth },
        status: "concluida"
      }),
      Sale.countDocuments({
        createdAt: { $gte: startOfYear },
        status: "concluida"
      })
    ]);

    const [todayRevenue, monthRevenue, yearRevenue] = await Promise.all([
      Sale.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(today.setHours(0, 0, 0, 0)),
              $lt: new Date(today.setHours(23, 59, 59, 999))
            },
            status: "concluida"
          }
        },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),
      Sale.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth },
            status: "concluida"
          }
        },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),
      Sale.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfYear },
            status: "concluida"
          }
        },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ])
    ]);

    return {
      today: {
        sales: todaySales,
        revenue: todayRevenue[0]?.total || 0
      },
      month: {
        sales: monthSales,
        revenue: monthRevenue[0]?.total || 0
      },
      year: {
        sales: yearSales,
        revenue: yearRevenue[0]?.total || 0
      }
    };
  } catch (error) {
    console.error("❌ Erro ao buscar resumo de vendas:", error.message);
    throw new Error("Erro ao buscar resumo de vendas.");
  }
}

module.exports = {
  createSaleService,
  getAllSalesService,
  getSaleByIdService,
  updateSaleService,
  deleteSaleService,
  getMonthlyReportService,
  getSalesSummaryService,
}; 
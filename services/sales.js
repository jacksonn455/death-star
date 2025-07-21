const Sale = require("../models/sales");
const Product = require("../models/products");
const Service = require("../models/services");

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
      if (item.itemType === "product") {
        const product = await Product.findById(item.itemId);
        
        if (!product) {
          throw new Error(`Produto com ID ${item.itemId} não encontrado.`);
        }

        if (product.quantity < item.quantity) {
          throw new Error(`Estoque insuficiente para ${product.name}. Disponível: ${product.quantity}`);
        }

        await Product.findByIdAndUpdate(item.itemId, {
          $inc: { quantity: -item.quantity }
        });
      } else if (item.itemType === "service") {
        const service = await Service.findById(item.itemId);
        
        if (!service) {
          throw new Error(`Serviço com ID ${item.itemId} não encontrado.`);
        }

        if (!service.isActive) {
          throw new Error(`Serviço ${service.name} não está ativo.`);
        }
      } else {
        throw new Error(`Tipo de item inválido: ${item.itemType}`);
      }
    }

    let totalAmount = 0;
    saleData.items.forEach(item => {
      item.totalPrice = item.quantity * item.unitPrice;
      totalAmount += item.totalPrice;
    });

    saleData.totalAmount = totalAmount;

    const newSale = new Sale(saleData);
    const savedSale = await newSale.save();

    // Removido populate desnecessário

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
        if (item.itemType === "product") {
          await Product.findByIdAndUpdate(item.itemId, {
            $inc: { quantity: item.quantity }
          });
        }
        // Para serviços não há necessidade de devolver ao estoque
      }
    }

    const updatedSale = await Sale.findByIdAndUpdate(id, updatedData, {
      new: true,
    }).populate("soldBy", "name email");

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
        if (item.itemType === "product") {
          await Product.findByIdAndUpdate(item.itemId, {
            $inc: { quantity: item.quantity }
          });
        }
        // Para serviços não há necessidade de devolver ao estoque
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
    });

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
        const itemName = item.itemName;
        if (!report.topProducts[itemName]) {
          report.topProducts[itemName] = {
            quantity: 0,
            revenue: 0,
            type: item.itemType
          };
        }
        report.topProducts[itemName].quantity += item.quantity;
        report.topProducts[itemName].revenue += item.totalPrice;
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

// Funções para gerenciar serviços
async function createServiceService(serviceData) {
  try {
    if (!serviceData.name || !serviceData.category || !serviceData.duration || !serviceData.price) {
      throw new Error("Nome, categoria, duração e preço são obrigatórios.");
    }

    if (serviceData.price <= 0) {
      throw new Error("O preço deve ser maior que zero.");
    }

    const newService = new Service(serviceData);
    const savedService = await newService.save();

    return savedService;
  } catch (error) {
    console.error("❌ Erro ao criar serviço:", error.message);
    throw new Error(`Erro ao criar serviço: ${error.message}`);
  }
}

async function getAllServicesService(query = {}) {
  try {
    const filters = {};

    if (query.category) {
      filters.category = query.category;
    }

    if (query.isActive !== undefined) {
      filters.isActive = query.isActive;
    }

    const services = await Service.find(filters)
      .sort({ category: 1, name: 1 });

    return services || [];
  } catch (error) {
    console.error("❌ Erro ao buscar serviços:", error.message);
    throw new Error("Erro ao buscar serviços.");
  }
}

async function getServiceByIdService(id) {
  try {
    const service = await Service.findById(id);
    return service;
  } catch (error) {
    console.error("❌ Erro ao buscar serviço por ID:", error.message);
    throw new Error(`Erro ao buscar serviço por ID: ${error.message}`);
  }
}

async function updateServiceService(id, updatedData) {
  try {
    if (updatedData.price && updatedData.price <= 0) {
      throw new Error("O preço deve ser maior que zero.");
    }

    const updatedService = await Service.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedService) {
      throw new Error("Serviço não encontrado.");
    }

    return updatedService;
  } catch (error) {
    console.error("❌ Erro ao atualizar serviço:", error.message);
    throw new Error("Erro ao atualizar serviço.");
  }
}

async function deleteServiceService(id) {
  try {
    const deletedService = await Service.findByIdAndDelete(id);
    
    if (!deletedService) {
      throw new Error("Serviço não encontrado.");
    }

    return deletedService;
  } catch (error) {
    console.error("❌ Erro ao deletar serviço:", error.message);
    throw new Error(`Erro ao deletar serviço: ${error.message}`);
  }
}

async function getServicesByCategoryService(category) {
  try {
    const services = await Service.find({ 
      category, 
      isActive: true 
    }).sort({ name: 1 });

    return services || [];
  } catch (error) {
    console.error("❌ Erro ao buscar serviços por categoria:", error.message);
    throw new Error("Erro ao buscar serviços por categoria.");
  }
}

async function initializeServicesService() {
  try {
    const existingServices = await Service.countDocuments();
    
    if (existingServices > 0) {
      console.log("✅ Serviços já inicializados.");
      return;
    }

    const servicesData = [
      // Serviços Faciais
      { name: "Anamnese facial – 100 reais, desconto no plano de tratamento", category: "facial", duration: "1h", price: 250.00 },
      { name: "Limpeza de pele", category: "facial", duration: "1h 30 min", price: 220.00 },
      { name: "Microagulhamento + retorno", category: "facial", duration: "60 min", price: 590.00 },
      { name: "Peeling Químico", category: "facial", duration: "45 min", price: 180.00 },
      { name: "Peeling de diamante", category: "facial", duration: "50 min", price: 180.00 },
      { name: "Peeling Elétrico", category: "facial", duration: "50 min", price: 180.00 },
      { name: "Carboxiterapia - olheiras", category: "facial", duration: "30 min", price: 130.00 },
      { name: "Carboxiterapia - papada", category: "facial", duration: "30 min", price: 130.00 },
      { name: "Modulação cutânea", category: "facial", duration: "50 min", price: 185.00 },
      { name: "Radiofrequência Facial + gluconolactona", category: "facial", duration: "50 min", price: 250.00 },
      { name: "Jato de plasma – blefaro", category: "facial", duration: "60 min", price: 390.00 },
      { name: "Jato de plasma – Full Face", category: "facial", duration: "1h 30 min", price: 590.00 },
      { name: "Ultrassom Microfocado Full face", category: "facial", duration: "1h 30 min", price: 990.00 },
      { name: "Ultrassom Microfocado Terço inferior", category: "facial", duration: "40 min", price: 790.00 },
      { name: "Ultrassom Microfocado Face + pescoço", category: "facial", duration: "2h", price: 1190.00 },
      { name: "Bioestimulador enzimático", category: "facial", duration: "1h 30 min", price: 280.00 },

      // Serviços Corporais
      { name: "Anamnese Corporal – 100 reais, desconto no plano de tratamento", category: "corporal", duration: "1h", price: 250.00 },
      { name: "Carboxiterapia gordura", category: "corporal", duration: "30 min", price: 180.00 },
      { name: "Carboxiterapia celulite", category: "corporal", duration: "30 min", price: 180.00 },
      { name: "Radiofrequência Abdominal", category: "corporal", duration: "45 min", price: 180.00 },
      { name: "Radiofrequência pernas", category: "corporal", duration: "50 min", price: 180.00 },
      { name: "Ultrassom Abdominal", category: "corporal", duration: "40 min", price: 180.00 },
      { name: "Ultrassom Pernas", category: "corporal", duration: "60 min", price: 180.00 },
      { name: "Ultrassom Macrofocado", category: "corporal", duration: "1h 30 min", price: 590.00 },
      { name: "Lipocavitação abdominal", category: "corporal", duration: "30 min", price: 180.00 },
      { name: "Eletrolipólise", category: "corporal", duration: "60 min", price: 180.00 },
      { name: "Ondas de choque nas pernas", category: "corporal", duration: "50 min", price: 180.00 },
      { name: "Corrente russa corporal", category: "corporal", duration: "30 min", price: 150.00 },
      { name: "Bota pneumática", category: "corporal", duration: "45 min", price: 180.00 },
      { name: "Endermologia pernas", category: "corporal", duration: "50 min", price: 180.00 },
      { name: "Criolipólise Big Placê", category: "corporal", duration: "60 min", price: 1290.00 },
      { name: "Criolipólise pequenas placas", category: "corporal", duration: "60 min", price: 890.00 },
      { name: "PEIM", category: "corporal", duration: "60 min", price: 180.00 },
      { name: "Drenagem linfática manual", category: "corporal", duration: "60 min", price: 180.00 },
      { name: "Drenagem linfática gestante", category: "corporal", duration: "60 min", price: 200.00 },

      // Serviços Pós-operatório
      { name: "Drenagem manual pós operatória", category: "pos_operatorio", duration: "60 min", price: 250.00 },
      { name: "Tapping abdominal – aplicação hospitalar/ domicilio", category: "pos_operatorio", duration: "60 min", price: 650.00 },
      { name: "Tapping peito – aplicação hospitalar/ domicilio", category: "pos_operatorio", duration: "60 min", price: 490.00 },
      { name: "Tapping abdominal + peito – aplicação hospitalar/ domicilio", category: "pos_operatorio", duration: "1h e 30 min", price: 990.00 },
      { name: "Ultrassom Abdominal", category: "pos_operatorio", duration: "45 min", price: 180.00 },
      { name: "Ultrassom Pernas", category: "pos_operatorio", duration: "60 min", price: 180.00 },
      { name: "Ondas de choque nas pernas", category: "pos_operatorio", duration: "60 min", price: 180.00 },
      { name: "Ondas de choque no abdômen", category: "pos_operatorio", duration: "45 min", price: 180.00 },
      { name: "Corrente russa corporal", category: "pos_operatorio", duration: "60 min", price: 180.00 },
      { name: "Bota pneumática", category: "pos_operatorio", duration: "45 min", price: 180.00 },
      { name: "Curativos conforme necessidade", category: "pos_operatorio", duration: "--", price: 150.00, description: "Variação de 80 à 220" },
      { name: "Banho acompanhado sem lavagem de cabelo", category: "pos_operatorio", duration: "40 min", price: 120.00 },
      { name: "Serviço de alta hospitalar: Drenagem manual + laser Ilib", category: "pos_operatorio", duration: "60 min", price: 220.00 },
      { name: "Laser Ilib", category: "pos_operatorio", duration: "30 min", price: 180.00 },
      { name: "Aplicação de laser e LED cicatrizes", category: "pos_operatorio", duration: "40 min", price: 180.00 }
    ];

    await Service.insertMany(servicesData);
    console.log("✅ Serviços inicializados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao inicializar serviços:", error.message);
    throw new Error("Erro ao inicializar serviços.");
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
  // Funções de serviços
  createServiceService,
  getAllServicesService,
  getServiceByIdService,
  updateServiceService,
  deleteServiceService,
  getServicesByCategoryService,
  initializeServicesService,
}; 
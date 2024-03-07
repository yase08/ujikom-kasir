const prisma = require("../libs/prisma");
const exportExcel = require("../libs/excel");

const createSale = async (req, res) => {
  try {
    const newSale = await prisma.sales.create({
      data: { customer_id: parseInt(req.body.customer_id), ...req.body },
    });

    return res.status(201).json({ message: "Sale created", sale: newSale });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const exportSale = async (req, res) => {
  try {
    const date = Date.now();
    const sale = await prisma.sales.findMany();

    const result = sale.map((item, index) => {
      return {
        no: index + 1,
        salename: item.salename,
        fullname: item.fullname,
        email: item.email,
        address: item.address,
      };
    });

    const columns = [
      { header: "No", key: "no", width: 15 },
      { header: "Salename", key: "salename", width: 15 },
      { header: "Fullname", key: "fullname", width: 15 },
      { header: "Email", key: "email", width: 15 },
      { header: "Address", key: "address", width: 15 },
    ];
    const file = `data-project-${date}.xlsx`;

    const exportToExcel = await exportExcel(columns, result, file, res);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=${file}`);

    if (!exportToExcel) {
      return res.status(500).json({ message: "Failed to export data" });
    }

    return res.status(200).json({ message: "Export success" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSales = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const search = req.query.search || "";

    const countSale = prisma.sales.count();
    const salePromise = prisma.sales.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
          },
        ],
      },
      skip,
      take: pageSize,
    });

    const [totalSale, sales] = await prisma.$transaction([
      countSale,
      salePromise,
    ]);

    if (!sales) {
      return res.status(404).json({ message: "Sale not found" });
    }

    return res.status(200).json({
      message: "Get sale success",
      sales,
      totalPages: Math.ceil(totalSale / pageSize),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const saleByDetailSale = async (req, res) => {
  try {
    const sale = await prisma.sales.findMany({
      where: {
        DetailSales: {
          some: {
            id: parseInt(req.params.id),
          },
        },
      },
      include: {
        customer: true,
      },
    });

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const modifiedResponse = sale.map((item) => {
      return {
        id: item.id,
        saleDate: item.saleDate,
        totalPrice: item.totalPrice,
        customerName: item.customer.name,
      };
    });

    return res.status(200).json({
      message: "Get sale success",
      sale: modifiedResponse,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSale = async (req, res) => {
  try {
    const sale = await prisma.sales.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        customer: true,
      },
    });

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const result = {
      id: sale.id,
      saleDate: sale.saleDate,
      totalPrice: sale.totalPrice,
      customer: {
        id: sale.customer.id,
        name: sale.customer.name,
      },
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt,
    };

    return res.status(200).json({
      message: "Get sale success",
      sale: result,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteSale = async (req, res) => {
  try {
    const sale = await prisma.sales.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    return res.status(200).json({ message: "Sale deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateSale = async (req, res) => {
  try {
    const sale = await prisma.sales.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    await prisma.sales.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: req.body,
    });

    return res.status(200).json({ message: "Sale updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSale,
  getSales,
  deleteSale,
  updateSale,
  exportSale,
  getSale,
  saleByDetailSale,
};

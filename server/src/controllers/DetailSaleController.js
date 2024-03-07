const prisma = require("../libs/prisma");
const exportExcel = require("../libs/excel");

const createDetailSale = async (req, res) => {
  try {
    const detailSale = await prisma.detailSales.createMany({
      data: req.body.products.map((product) => {
        return {
          sale_id: parseInt(product.sale_id),
          product_id: parseInt(product.product_id),
          totalProduct: parseInt(product.totalProduct),
          subTotal: parseInt(product.subTotal),
        };
      }),
    });

    const productsToUpdate = req.body.products.map((product) => ({
      id: parseInt(product.product_id),
      quantityToDecrement: parseInt(product.totalProduct),
    }));

    await Promise.all(
      productsToUpdate.map(async (product) => {
        await prisma.product.update({
          where: {
            id: product.id,
          },
          data: {
            stock: { decrement: product.quantityToDecrement },
          },
        });
      })
    );

    return res.status(201).json({ message: "Detail sale created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const exportDetailSale = async (req, res) => {
  try {
    const date = Date.now();
    const detailSale = await prisma.detailSales.findMany();

    const result = detailSale.map((item, index) => {
      return {
        no: index + 1,
        detailSalename: item.detailSalename,
        fullname: item.fullname,
        email: item.email,
        address: item.address,
      };
    });

    const columns = [
      { header: "No", key: "no", width: 15 },
      { header: "DetailSalename", key: "detailSalename", width: 15 },
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

const getDetailSales = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const countDetailSale = prisma.detailSales.count();
    const detailSalePromise = prisma.detailSales.findMany({
      skip,
      take: pageSize,
      include: {
        sale: {
          include: {
            customer: true,
          },
        },
        product: true,
      },
    });

    const [totalDetailSale, detailSales] = await prisma.$transaction([
      countDetailSale,
      detailSalePromise,
    ]);

    if (!detailSales) {
      return res.status(404).json({ message: "DetailSale not found" });
    }

    const result = detailSales.reduce((acc, current) => {
      const foundIndex = acc.findIndex(
        (item) => item.sale_id === current.sale_id
      );
      if (foundIndex === -1) {
        acc.push({
          id: current.id,
          customerName: current.sale.customer.name,
          totalProduct: current.totalProduct,
          subTotal: current.subTotal,
          sale_id: current.sale_id,
          date: current.createdAt,
        });
      }
      return acc;
    }, []);

    return res.status(200).json({
      message: "Get detailSale success",
      detailSales: result,
      totalPages: Math.ceil(totalDetailSale / pageSize),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getDetailSale = async (req, res) => {
  try {
    const countDetailSale = prisma.detailSales.count();
    const detailSalePromise = prisma.detailSales.findMany({
      where: {
        sale_id: parseInt(req.params.id),
      },
      include: {
        sale: {
          include: {
            customer: true,
          },
        },
        product: true,
      },
    });

    const [totalDetailSale, detailSales] = await prisma.$transaction([
      countDetailSale,
      detailSalePromise,
    ]);

    if (!detailSales) {
      return res.status(404).json({ message: "DetailSale not found" });
    }

    const result = detailSales.map((item) => {
      return {
        productName: item.product.name,
        productPrice: item.product.price,
        totalPrice: item.sale.totalPrice,
      };
    });

    return res.status(200).json({
      message: "Get detailSale success",
      detailSales: result,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteDetailSale = async (req, res) => {
  try {
    const detailSale = await prisma.detailSales.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    return res.status(200).json({ message: "DetailSale deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateDetailSale = async (req, res) => {
  try {
    const detailSale = await prisma.detailSales.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    await prisma.detailSales.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: req.body,
    });

    return res.status(200).json({ message: "DetailSale updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDetailSale,
  getDetailSales,
  deleteDetailSale,
  updateDetailSale,
  exportDetailSale,
  getDetailSale,
};

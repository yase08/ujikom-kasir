const prisma = require("../libs/prisma");
const exportExcel = require("../libs/excel");

const createProduct = async (req, res) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        name: req.body.name,
      },
    });

    if (product) {
      return res.status(400).json({ message: "Product already exists" });
    }

    await prisma.product.create({
      data: {
        ...req.body,
      },
    });

    return res.status(201).json({ message: "Product created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const exportProduct = async (req, res) => {
  try {
    const date = Date.now();
    const product = await prisma.product.findMany();

    const result = product.map((item, index) => {
      return {
        no: index + 1,
        productname: item.productname,
        fullname: item.fullname,
        email: item.email,
        address: item.address,
      };
    });

    const columns = [
      { header: "No", key: "no", width: 15 },
      { header: "Productname", key: "productname", width: 15 },
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

const getProductsOption = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        stock: {
          gt: 0,
        },
      },
    });

    if (!products) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Get product option success",
      products,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const search = req.query.search || "";

    const countProduct = prisma.product.count();
    const productPromise = prisma.product.findMany({
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

    const [totalProduct, products] = await prisma.$transaction([
      countProduct,
      productPromise,
    ]);

    if (!products) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Get product success",
      products,
      totalPages: Math.ceil(totalProduct / pageSize),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const result = {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    return res.status(200).json({
      message: "Get product success",
      product: result,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    console.log(req.params.id);
    const deleteDetailSale = await prisma.detailSales.deleteMany({
      where: {
        product_id: parseInt(req.params.id),
      },
    });

    const product = await prisma.product.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    await prisma.product.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: req.body,
    });

    return res.status(200).json({ message: "Product updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  exportProduct,
  getProduct,
  getProductsOption,
};

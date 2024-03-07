const prisma = require("../libs/prisma");
const exportExcel = require("../libs/excel");

const createCustomer = async (req, res) => {
  try {
    const customer = await prisma.customer.findFirst({
      where: {
        name: req.body.name,
      },
    });

    if (customer) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    const newCustomer = await prisma.customer.create({
      data: { ...req.body },
    });

    return res
      .status(201)
      .json({ message: "Customer created", customer: newCustomer });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const exportCustomer = async (req, res) => {
  try {
    const date = Date.now();
    const customer = await prisma.customer.findMany();

    const result = customer.map((item, index) => {
      return {
        no: index + 1,
        customername: item.customername,
        fullname: item.fullname,
        email: item.email,
        address: item.address,
      };
    });

    const columns = [
      { header: "No", key: "no", width: 15 },
      { header: "Customername", key: "customername", width: 15 },
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

const getCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const search = req.query.search || "";

    const countCustomer = prisma.customer.count();
    const customerPromise = prisma.customer.findMany({
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

    const [totalCustomer, customers] = await prisma.$transaction([
      countCustomer,
      customerPromise,
    ]);

    if (!customers) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json({
      message: "Get customer success",
      customers,
      totalPages: Math.ceil(totalCustomer / pageSize),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCustomer = async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const result = {
      id: customer.id,
      name: customer.name,
      address: customer.address,
      mobileNumber: customer.mobileNumber,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };

    return res.status(200).json({
      message: "Get customer success",
      customer: result,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customer = await prisma.customer.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    return res.status(200).json({ message: "Customer deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    await prisma.customer.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: req.body,
    });

    return res.status(200).json({ message: "Customer updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  deleteCustomer,
  updateCustomer,
  exportCustomer,
  getCustomer,
};

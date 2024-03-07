const prisma = require("../libs/prisma");
const exportExcel = require("../libs/excel");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  try {
    if (req.file) {
      req.body.image = req.file.filename;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    console.log(req.body);

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await prisma.user.create({
      data: { ...req.body, password: hashedPassword },
    });

    return res.status(201).json({ message: "User created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const exportUser = async (req, res) => {
  try {
    const date = Date.now();
    const user = await prisma.user.findMany();

    const result = user.map((item, index) => {
      return {
        no: index + 1,
        username: item.username,
        fullname: item.fullname,
        email: item.email,
        address: item.address,
      };
    });

    const columns = [
      { header: "No", key: "no", width: 15 },
      { header: "Username", key: "username", width: 15 },
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

const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const search = req.query.search || "";

    const countUser = prisma.user.count();
    const userPromise = prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: search,
            },
          },
        ],
      },
      skip,
      take: pageSize,
    });

    const [totalUser, users] = await prisma.$transaction([
      countUser,
      userPromise,
    ]);

    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }

    const modifiedResponse = users.map((user) => ({
      username: user.username,
      fullname: user.fullname,
      address: user.address,
      email: user.email,
      role: user.role,
      image: user.image,
    }));

    return res.status(200).json({
      message: "Get user success",
      users: modifiedResponse,
      totalPages: Math.ceil(totalUser / pageSize),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = {
      id: user.id,
      email: user.email,
      username: user.username,
      fullname: user.fullname,
      address: user.address,
      role: user.role,
      image: user.image,
    };

    return res.status(200).json({
      message: "Get user success",
      user: result,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await prisma.user.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    if (req.file) {
      req.body.image = req.file.filename;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (req.body.password === "") {
      req.body.password = user.password;
    }

    await prisma.user.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: req.body,
    });

    return res.status(200).json({ message: "User updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  deleteUser,
  updateUser,
  exportUser,
  getUser,
};

const path = require("path");
const fs = require("fs").promises;
const ExcelJS = require("exceljs");

const exportExcel = async (columns, rows, filename, res) => {
  return new Promise(async (resolve, reject) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Project", {
      pageSetup: {
        paperSize: 9,
        orientation: "landscape",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        horizontalCentered: true,
        verticalCentered: true,
      },
    });

    const customHeaderRow = worksheet.addRow(
      columns.map((column) => column.header)
    );
    customHeaderRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    customHeaderRow.height = 30;

    worksheet.columns = columns;
    worksheet.addRows(rows);

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });
    });

    const exportDir = path.join(__dirname, "../public/export/");
    const filePath = path.join(exportDir, filename);

    try {
      // Ensure the directory structure exists
      await fs.mkdir(exportDir, { recursive: true });

      // Write the workbook to the file
      // await workbook.xlsx.writeFile(filePath);
      return await workbook.xlsx.write(res);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = exportExcel;

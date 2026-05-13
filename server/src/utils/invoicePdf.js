function buildInvoiceMarkup(bill) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Invoice ${bill.billNumber}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
      h1, h2, p { margin: 0 0 12px; }
      table { width: 100%; border-collapse: collapse; margin-top: 24px; }
      th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
      .summary { margin-top: 24px; width: 320px; margin-left: auto; }
      .summary td { border: none; }
    </style>
  </head>
  <body>
    <h1>Pharmacy Invoice</h1>
    <p><strong>Bill Number:</strong> ${bill.billNumber}</p>
    <p><strong>Date:</strong> ${new Date(bill.createdAt).toLocaleString()}</p>
    <p><strong>Cashier:</strong> ${bill.cashierId?.name || 'Staff'}</p>
    <p><strong>Customer:</strong> ${bill.customerId?.name || 'Walk-in customer'}</p>
    <table>
      <thead>
        <tr>
          <th>Medicine</th>
          <th>Batch</th>
          <th>Qty</th>
          <th>Price</th>
          <th>GST</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${bill.items
          .map(
            (item) => `
            <tr>
              <td>${item.medicineNameSnapshot}</td>
              <td>${item.batchNumberSnapshot || '-'}</td>
              <td>${item.quantity}</td>
              <td>₹${item.unitPrice.toFixed(2)}</td>
              <td>${item.gstRate}%</td>
              <td>₹${item.lineTotal.toFixed(2)}</td>
            </tr>`,
          )
          .join('')}
      </tbody>
    </table>
    <table class="summary">
      <tbody>
        <tr><td>Subtotal</td><td>₹${bill.subtotal.toFixed(2)}</td></tr>
        <tr><td>GST</td><td>₹${bill.totalTax.toFixed(2)}</td></tr>
        <tr><td>Discount</td><td>₹${bill.discountAmount.toFixed(2)}</td></tr>
        <tr><td><strong>Grand Total</strong></td><td><strong>₹${bill.grandTotal.toFixed(2)}</strong></td></tr>
      </tbody>
    </table>
  </body>
</html>`;
}

function generateInvoiceBuffer(bill) {
  return Buffer.from(buildInvoiceMarkup(bill), 'utf-8');
}

module.exports = { buildInvoiceMarkup, generateInvoiceBuffer };

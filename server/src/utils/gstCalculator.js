function roundCurrency(value) {
  return Number(Number(value || 0).toFixed(2));
}

function calculateLineTotals(quantity, unitPrice, gstRate) {
  const lineSubtotal = roundCurrency(quantity * unitPrice);
  const lineTax = roundCurrency(lineSubtotal * ((gstRate || 0) / 100));
  const lineTotal = roundCurrency(lineSubtotal + lineTax);

  return { lineSubtotal, lineTax, lineTotal };
}

module.exports = { roundCurrency, calculateLineTotals };

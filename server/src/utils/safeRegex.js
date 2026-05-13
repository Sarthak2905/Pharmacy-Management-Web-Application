function escapeRegex(value = '') {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildSearchRegex(value = '') {
  return new RegExp(escapeRegex(value.trim()), 'i');
}

module.exports = { buildSearchRegex };

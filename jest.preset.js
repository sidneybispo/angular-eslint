// Import the Nx preset for Jest
const { getJestPreset } = require('@nrwl/jest');

// Get the Nx preset configuration
const jestPreset = getJestPreset();

// Export the Jest configuration with the Nx preset
module.exports = {
  ...jestPreset,
};

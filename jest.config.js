const { getJestProjects } = require('@nrwl/jest');

const projects = getJestProjects();

module.exports = { projects };



const { getJestProjects } = require('@nrwl/jest');

const projects = getJestProjects ? getJestProjects() : [];

module.exports = { projects };


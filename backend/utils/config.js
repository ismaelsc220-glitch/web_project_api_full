const { NODE_ENV, JWT_SECRET } = process.env;

if (NODE_ENV === 'production' && !JWT_SECRET) {
  throw new Error('Configura JWT_SECRET para ejecutar en producción');
}

module.exports = {
  JWT_SECRET: JWT_SECRET || 'dev-secret',
};

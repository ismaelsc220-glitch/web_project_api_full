const path = require('node:path');
const { createLogger, format, transports } = require('winston');

const requestLog = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({
      filename: path.join(__dirname, '..', 'request.log'),
    }),
  ],
});

const errorLog = createLogger({
  level: 'error',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({
      filename: path.join(__dirname, '..', 'error.log'),
    }),
  ],
});

const requestLogger = (req, res, next) => {
  const startedAt = Date.now();

  res.on('finish', () => {
    requestLog.info('Solicitud HTTP', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  return next();
};

const errorLogger = (err, req, res, next) => {
  errorLog.error(err.message || 'Error en la solicitud', {
    method: req.method,
    path: req.path,
    name: err.name,
    stack: err.stack,
  });

  return next(err);
};

module.exports = { requestLogger, errorLogger };

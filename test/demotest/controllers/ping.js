const { ErrorObject } = require('../helpers/error')
const { endpointResponse } = require('../helpers/success')

module.exports = {
  pong: (req, res, next) => {
    try {
      endpointResponse({
        res,
        code: 200,
        status: true,
        message: 'PONG',
      })
    } catch (error) {
      next(new ErrorObject(`[Error making PING] - [ping - pong]: ${error.message}`, 500))
    }
  },
}
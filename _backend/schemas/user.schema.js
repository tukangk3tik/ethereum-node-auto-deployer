
export const createUser = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        data: {
          token: { type: 'string' },
          expiresIn: { type: 'string' },
          userId: { type: 'string' },
        }
      },
    },
  },
};
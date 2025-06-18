

export const createEthNodeSchema = {
  body: {
    type: 'object',
    required: ['type', 'network', 'ip', 'port', 'status', 'deploy_at', 'created_by'],
    properties: {
      type: { type: 'string' },
      network: { type: 'string' },
      ip: { type: 'string' },
      port: { type: 'string' },
      status: { type: 'boolean' },
      deploy_at: { type: 'string' },
      created_by: { type: 'string' },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          node_id: { type: 'string' },
        }
      },
    },
  },
};
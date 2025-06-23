

export const createEthNodeSchema = {
  body: {
    type: 'object',
    required: ['node_code', 'client_type', 'network', 'host_ip', 'host_user', 'private_key', 'http_port', 'ws_port', 'p2p_port'],
    properties: {
      node_code: { type: 'string' },
      client_type: { type: 'string' },
      network: { type: 'string' },
      host_ip: { type: 'string' },
      host_user: { type: 'string' },
      private_key: { type: 'string' },
      http_port: { type: 'string' },
      ws_port: { type: 'string' },
      p2p_port: { type: 'string' },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          node_code: { type: 'string' },
          client_type: { type: 'string' },
          network: { type: 'string' },
          host_ip: { type: 'string' },
          host_user: { type: 'string' },
          private_key: { type: 'string' },
          http_port: { type: 'string' },
          ws_port: { type: 'string' },
          p2p_port: { type: 'string' },
          status: { type: 'string' },
          deploy_at: { type: 'string' },
          deploy_number: { type: 'string' },
          created_by: { type: 'string' },
        }
      },
    },
  },
};

export const stopEthNodeSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  body: {
    type: 'object',
    required: ['private_key'],
    properties: {
      private_key: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          _id: { type: 'string' },
          node_code: { type: 'string' },
          deploy_number: { type: 'string' },
        },
      },
    },
  },
};

export const deleteEthNodeSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          _id: { type: 'string' },
          node_code: { type: 'string' },
        },
      },
    },
  },
};

export const getEthNodeSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          node_code: { type: 'string' },
          client_type: { type: 'string' },
          network: { type: 'string' },
          host_ip: { type: 'string' },
          host_user: { type: 'string' },
          private_key: { type: 'string' },
          http_port: { type: 'string' },
          ws_port: { type: 'string' },
          p2p_port: { type: 'string' },
          status: { type: 'string' },
          deploy_at: { type: 'string' },
          deploy_number: { type: 'string' },
          created_by: { type: 'string' },
        }
      },
    },
  },
};
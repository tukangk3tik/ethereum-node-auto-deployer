import Joi from "joi";
import { join } from "path";

export const nodeFormSchema = Joi.object({
  _id: Joi.string(),
  node_code: Joi.string().required(),
  client_type: Joi.string().required(),
  network: Joi.string().required(),
  host_ip: Joi.string().ip().required(),
  host_user: Joi.string().required(),
  http_port: Joi.number().integer().min(1).max(65535).required(),
  ws_port: Joi.number().integer().min(1).max(65535).required(),
  p2p_port: Joi.number().integer().min(1).max(65535).required(),
  auto_deploy: Joi.boolean().default(false),
});

export const createEthNodeSchema = {
  consumes: ['multipart/form-data'],
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
  consumes: ['multipart/form-data'],
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
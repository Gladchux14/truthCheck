import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';


const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Truth Check API Documentation',
      version,
      description: 'API documentation for Truth Check application',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '5f8d04b3ab35b428f8611098'
            },
            username: {
              type: 'string',
              example: 'john doe'
            },
            email: {
              type: 'string',
              example: 'johndoe@gmail.com'
            },
            password: {
              type: 'string',
              example: 'Password123!'
            }
          }
        },
      }
    }
  },
  apis: ['./src/routes/*.ts']  // Path to the API routes files
};

const specs = swaggerJsdoc(options);

export default specs;
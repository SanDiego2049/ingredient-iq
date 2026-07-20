const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IngredientIQ API',
      version: '1.0.0',
      description:
        'REST API for the IngredientIQ food safety scanner. Provides AI-powered ingredient analysis, scan history management, and user account management. Authentication (registration, login, logout) is handled client-side via Supabase Auth directly and is not proxied through this API. All authenticated endpoints require a valid JWT Bearer token issued by Supabase Auth.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'JWT token issued by Supabase Auth. Pass as Authorization: Bearer <token>.',
        },
      },
      schemas: {
        AnalysisResult: {
          type: 'object',
          properties: {
            verdict: {
              type: 'string',
              enum: ['SAFE', 'UNSAFE', 'CAUTION', 'UNRECOGNISED'],
              description:
                'AI-generated safety verdict for the ingredient list',
            },
            summary: {
              type: 'string',
              description: 'Plain-language one-sentence verdict summary',
            },
            concerns: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  ingredient: { type: 'string' },
                  reason: { type: 'string' },
                  severity: {
                    type: 'string',
                    enum: ['low', 'medium', 'high'],
                  },
                },
              },
            },
            positives: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  ingredient: { type: 'string' },
                  benefit: { type: 'string' },
                },
              },
            },
            disclaimer: { type: 'string' },
          },
        },
        Scan: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            product_name: { type: 'string' },
            raw_ingredients: { type: 'string' },
            ingredient_hash: { type: 'string' },
            verdict: {
              type: 'string',
              enum: ['SAFE', 'UNSAFE', 'CAUTION', 'UNRECOGNISED'],
            },
            summary: { type: 'string' },
            analysis_json: {
              $ref: '#/components/schemas/AnalysisResult',
            },
            scanned_at: { type: 'string', format: 'date-time' },
          },
        },
        Profile: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            display_name: { type: 'string', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = swaggerSpec

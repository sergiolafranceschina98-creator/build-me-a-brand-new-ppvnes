import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema/schema.js';
import type { App } from '../index.js';

interface CreateClientBody {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  experience: string;
  goals: string;
  training_frequency: number;
  equipment: string;
  injuries?: string;
  preferred_exercises?: string;
  session_duration: number;
  body_fat_percentage?: number;
}

interface ClientListItem {
  id: string;
  name: string;
  age: number;
  goals: string;
  training_frequency: number;
  created_at: Date;
}

export function register(app: App, fastify: FastifyInstance) {
  // Create a new client
  fastify.post<{ Body: CreateClientBody }>('/api/clients', {
    schema: {
      description: 'Create a new client profile',
      tags: ['clients'],
      body: {
        type: 'object',
        required: [
          'name',
          'age',
          'gender',
          'height',
          'weight',
          'experience',
          'goals',
          'training_frequency',
          'equipment',
          'session_duration',
        ],
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
          gender: { type: 'string' },
          height: { type: 'number' },
          weight: { type: 'number' },
          experience: { type: 'string' },
          goals: { type: 'string' },
          training_frequency: { type: 'number' },
          equipment: { type: 'string' },
          injuries: { type: 'string' },
          preferred_exercises: { type: 'string' },
          session_duration: { type: 'number' },
          body_fat_percentage: { type: 'number' },
        },
      },
      response: {
        201: {
          description: 'Client created successfully',
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            age: { type: 'number' },
            gender: { type: 'string' },
            height: { type: 'number' },
            weight: { type: 'number' },
            experience: { type: 'string' },
            goals: { type: 'string' },
            training_frequency: { type: 'number' },
            equipment: { type: 'string' },
            injuries: { type: ['string', 'null'] },
            preferred_exercises: { type: ['string', 'null'] },
            session_duration: { type: 'number' },
            body_fat_percentage: { type: ['number', 'null'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  }, async (request, reply) => {
    app.logger.info({ body: request.body }, 'Creating client');

    const [client] = await app.db
      .insert(schema.clients)
      .values({
        name: request.body.name,
        age: request.body.age,
        gender: request.body.gender,
        height: request.body.height,
        weight: request.body.weight.toString(),
        experience: request.body.experience,
        goals: request.body.goals,
        trainingFrequency: request.body.training_frequency,
        equipment: request.body.equipment,
        injuries: request.body.injuries,
        preferredExercises: request.body.preferred_exercises,
        sessionDuration: request.body.session_duration,
        bodyFatPercentage: request.body.body_fat_percentage?.toString(),
      })
      .returning();

    app.logger.info({ clientId: client.id }, 'Client created successfully');

    return reply.status(201).send({
      id: client.id,
      name: client.name,
      age: client.age,
      gender: client.gender,
      height: client.height,
      weight: parseFloat(client.weight as any),
      experience: client.experience,
      goals: client.goals,
      training_frequency: client.trainingFrequency,
      equipment: client.equipment,
      injuries: client.injuries,
      preferred_exercises: client.preferredExercises,
      session_duration: client.sessionDuration,
      body_fat_percentage: client.bodyFatPercentage ? parseFloat(client.bodyFatPercentage as any) : null,
      created_at: client.createdAt,
    });
  });

  // Get all clients
  fastify.get('/api/clients', {
    schema: {
      description: 'Get all clients',
      tags: ['clients'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              age: { type: 'number' },
              goals: { type: 'string' },
              training_frequency: { type: 'number' },
              created_at: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  }, async () => {
    app.logger.info('Fetching all clients');

    const clients = await app.db
      .select({
        id: schema.clients.id,
        name: schema.clients.name,
        age: schema.clients.age,
        goals: schema.clients.goals,
        trainingFrequency: schema.clients.trainingFrequency,
        createdAt: schema.clients.createdAt,
      })
      .from(schema.clients);

    const result = clients.map(c => ({
      id: c.id,
      name: c.name,
      age: c.age,
      goals: c.goals,
      training_frequency: c.trainingFrequency,
      created_at: c.createdAt,
    }));

    app.logger.info({ count: result.length }, 'Clients fetched successfully');
    return result;
  });

  // Get a specific client
  fastify.get<{ Params: { id: string } }>('/api/clients/:id', {
    schema: {
      description: 'Get client by ID',
      tags: ['clients'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            age: { type: 'number' },
            gender: { type: 'string' },
            height: { type: 'number' },
            weight: { type: 'number' },
            experience: { type: 'string' },
            goals: { type: 'string' },
            training_frequency: { type: 'number' },
            equipment: { type: 'string' },
            injuries: { type: ['string', 'null'] },
            preferred_exercises: { type: ['string', 'null'] },
            session_duration: { type: 'number' },
            body_fat_percentage: { type: ['number', 'null'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { id } = request.params;
    app.logger.info({ clientId: id }, 'Fetching client');

    const client = await app.db
      .select()
      .from(schema.clients)
      .where(eq(schema.clients.id, id))
      .then(rows => rows[0]);

    if (!client) {
      app.logger.warn({ clientId: id }, 'Client not found');
      return reply.status(404).send({ error: 'Client not found' });
    }

    app.logger.info({ clientId: id }, 'Client fetched successfully');
    return {
      id: client.id,
      name: client.name,
      age: client.age,
      gender: client.gender,
      height: client.height,
      weight: parseFloat(client.weight as any),
      experience: client.experience,
      goals: client.goals,
      training_frequency: client.trainingFrequency,
      equipment: client.equipment,
      injuries: client.injuries,
      preferred_exercises: client.preferredExercises,
      session_duration: client.sessionDuration,
      body_fat_percentage: client.bodyFatPercentage ? parseFloat(client.bodyFatPercentage as any) : null,
      created_at: client.createdAt,
    };
  });
}

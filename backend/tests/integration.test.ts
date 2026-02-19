import { describe, test, expect } from "bun:test";
import { api, authenticatedApi, signUpTestUser, expectStatus, connectWebSocket, connectAuthenticatedWebSocket, waitForMessage } from "./helpers";

describe("API Integration Tests", () => {
  // Shared state for chaining tests (e.g., created resource IDs, auth tokens)
  let clientId: string;
  let programId: string;

  describe("Clients", () => {
    test("Create a new client", async () => {
      const res = await api("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "John Doe",
          age: 30,
          gender: "Male",
          height: 180,
          weight: 85,
          experience: "Intermediate",
          goals: "Build muscle",
          training_frequency: 4,
          equipment: "Barbell, Dumbbell",
          session_duration: 60,
        }),
      });
      await expectStatus(res, 201);
      const data = await res.json();
      expect(data.id).toBeDefined();
      expect(data.name).toBe("John Doe");
      expect(data.age).toBe(30);
      expect(data.weight).toBe(85);
      clientId = data.id;
    });

    test("Create a client with optional fields", async () => {
      const res = await api("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Jane Smith",
          age: 28,
          gender: "Female",
          height: 165,
          weight: 65,
          experience: "Beginner",
          goals: "Weight loss",
          training_frequency: 3,
          equipment: "Dumbbells",
          session_duration: 45,
          injuries: "None",
          preferred_exercises: "Cardio",
          body_fat_percentage: 25.5,
        }),
      });
      await expectStatus(res, 201);
      const data = await res.json();
      expect(data.id).toBeDefined();
      expect(data.injuries).toBe("None");
      expect(data.body_fat_percentage).toBe(25.5);
    });

    test("Create a client without required fields", async () => {
      const res = await api("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Incomplete Client",
          age: 25,
          // Missing other required fields
        }),
      });
      await expectStatus(res, 400);
    });

    test("Get all clients", async () => {
      const res = await api("/api/clients", {
        method: "GET",
      });
      await expectStatus(res, 200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      // Verify the client we created is in the list
      const createdClient = data.find((c) => c.id === clientId);
      expect(createdClient).toBeDefined();
      expect(createdClient.name).toBe("John Doe");
    });

    test("Get client by ID", async () => {
      const res = await api(`/api/clients/${clientId}`, {
        method: "GET",
      });
      await expectStatus(res, 200);
      const data = await res.json();
      expect(data.id).toBe(clientId);
      expect(data.name).toBe("John Doe");
      expect(data.age).toBe(30);
      expect(data.gender).toBe("Male");
      expect(data.height).toBe(180);
      expect(data.weight).toBe(85);
      expect(data.experience).toBe("Intermediate");
      expect(data.goals).toBe("Build muscle");
      expect(data.training_frequency).toBe(4);
      expect(data.equipment).toBe("Barbell, Dumbbell");
      expect(data.session_duration).toBe(60);
    });

    test("Get client with invalid UUID format", async () => {
      const res = await api(`/api/clients/invalid-uuid`, {
        method: "GET",
      });
      await expectStatus(res, 400);
    });

    test("Get client with nonexistent UUID", async () => {
      const res = await api(`/api/clients/00000000-0000-0000-0000-000000000000`, {
        method: "GET",
      });
      await expectStatus(res, 404);
    });

    test("Delete client with invalid UUID format", async () => {
      const res = await api(`/api/clients/invalid-uuid`, {
        method: "DELETE",
      });
      await expectStatus(res, 400);
    });

    test("Delete nonexistent client", async () => {
      const res = await api(`/api/clients/00000000-0000-0000-0000-000000000000`, {
        method: "DELETE",
      });
      await expectStatus(res, 404);
    });
  });

  describe("Programs", () => {
    test("Generate a workout program for a client", async () => {
      const res = await api(`/api/clients/${clientId}/generate-program`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      await expectStatus(res, 201);
      const data = await res.json();
      expect(data.id).toBeDefined();
      expect(data.client_id).toBe(clientId);
      expect(data.program_name).toBeDefined();
      expect(data.duration_weeks).toBeDefined();
      expect(data.split_type).toBeDefined();
      expect(data.program_structure).toBeDefined();
      programId = data.id;
    });

    test("Generate program for nonexistent client", async () => {
      const res = await api(`/api/clients/00000000-0000-0000-0000-000000000000/generate-program`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      await expectStatus(res, 404);
    });

    test("Get all programs for a client", async () => {
      const res = await api(`/api/clients/${clientId}/programs`, {
        method: "GET",
      });
      await expectStatus(res, 200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      // Verify the generated program is in the list
      const createdProgram = data.find((p) => p.id === programId);
      expect(createdProgram).toBeDefined();
      expect(createdProgram.program_name).toBeDefined();
    });

    test("Get programs for nonexistent client", async () => {
      const res = await api(`/api/clients/00000000-0000-0000-0000-000000000000/programs`, {
        method: "GET",
      });
      await expectStatus(res, 404);
    });

    test("Get full program details by ID", async () => {
      const res = await api(`/api/programs/${programId}`, {
        method: "GET",
      });
      await expectStatus(res, 200);
      const data = await res.json();
      expect(data.id).toBe(programId);
      expect(data.client_id).toBe(clientId);
      expect(data.program_name).toBeDefined();
      expect(data.duration_weeks).toBeDefined();
      expect(data.split_type).toBeDefined();
      expect(data.program_structure).toBeDefined();
    });

    test("Get program with nonexistent ID", async () => {
      const res = await api(`/api/programs/00000000-0000-0000-0000-000000000000`, {
        method: "GET",
      });
      await expectStatus(res, 404);
    });

    test("Get program with invalid UUID format", async () => {
      const res = await api(`/api/programs/invalid-uuid`, {
        method: "GET",
      });
      await expectStatus(res, 400);
    });

    test("Delete client (also deletes associated programs)", async () => {
      const res = await api(`/api/clients/${clientId}`, {
        method: "DELETE",
      });
      await expectStatus(res, 200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.message).toBe("Client deleted successfully");
    });
  });
});

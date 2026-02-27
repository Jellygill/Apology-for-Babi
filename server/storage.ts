import { db } from "./db";
import { responses, type InsertResponse, type Response } from "@shared/schema";

export interface IStorage {
  createResponse(insertResponse: InsertResponse): Promise<Response>;
  getResponses(): Promise<Response[]>;
}

export class DatabaseStorage implements IStorage {
  async createResponse(insertResponse: InsertResponse): Promise<Response> {
    const [response] = await db
      .insert(responses)
      .values(insertResponse)
      .returning();
    return response;
  }

  async getResponses(): Promise<Response[]> {
    return await db.select().from(responses).orderBy(responses.createdAt);
  }
}

export const storage = new DatabaseStorage();

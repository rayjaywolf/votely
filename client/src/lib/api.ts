import { CreatePollInput, Poll } from "./types";

const API_URL = "http://localhost:3000/api";

export const api = {
  createPoll: async (input: CreatePollInput): Promise<Poll> => {
    const response = await fetch(`${API_URL}/polls`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error("Failed to create poll");
    return response.json();
  },

  getPolls: async (): Promise<Poll[]> => {
    const response = await fetch(`${API_URL}/polls`);
    if (!response.ok) throw new Error("Failed to fetch polls");
    return response.json();
  },

  getPoll: async (id: string): Promise<Poll> => {
    const response = await fetch(`${API_URL}/polls/${id}`);
    if (!response.ok) throw new Error("Failed to fetch poll");
    return response.json();
  },

  vote: async (pollId: string, optionId: string): Promise<Poll> => {
    const response = await fetch(`${API_URL}/polls/${pollId}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ optionId }),
    });
    if (!response.ok) throw new Error("Failed to vote");
    return response.json();
  },
}; 
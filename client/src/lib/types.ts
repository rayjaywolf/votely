export type Poll = {
  id: string;
  question: string;
  options: Option[];
  createdAt: string;
  updatedAt: string;
};

export type Option = {
  id: string;
  text: string;
  votes: number;
  pollId: string;
};

export type CreatePollInput = {
  question: string;
  options: string[];
}; 
const STORAGE_KEY = 'votely_votes';

export const storage = {
  getVotedPolls: (): string[] => {
    const votes = localStorage.getItem(STORAGE_KEY);
    return votes ? JSON.parse(votes) : [];
  },

  addVotedPoll: (pollId: string) => {
    const votes = storage.getVotedPolls();
    if (!votes.includes(pollId)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...votes, pollId]));
    }
  },

  removeVotedPoll: (pollId: string) => {
    const votes = storage.getVotedPolls();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(votes.filter(id => id !== pollId))
    );
  },

  hasVotedOnPoll: (pollId: string): boolean => {
    const votes = storage.getVotedPolls();
    return votes.includes(pollId);
  }
}; 
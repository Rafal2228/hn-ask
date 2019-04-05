import { API_BASE_URL } from '../constants/config';
import { Story } from '../models/story';

export async function getStory(storyId: number) {
  const res = await fetch(`${API_BASE_URL}/item/${storyId}.json`);
  const story = (await res.json()) as Story;

  return story;
}

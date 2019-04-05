export interface Story {
  id: number;
  by: string;
  descendants: number;
  kids: number[];
  score: number;
  text: string;
  /**
   * note timestamp
   */
  time: number;
  title: string;
  type: 'story';
}

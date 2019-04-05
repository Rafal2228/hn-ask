export interface Comment {
  id: number;
  by: string;
  kids: number[];
  parent: number;
  text: string;
  /**
   * note timestamp
   */
  time: number;
  type: 'comment';
}

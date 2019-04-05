import { default as chalk } from 'chalk';
import console = require('console');
import * as fs from 'fs';
import { fromString } from 'html-to-text';
import { default as fetch } from 'node-fetch';
import * as path from 'path';
import { promisify } from 'util';
import { JobOffer } from '../src/models/job-offer';

const asyncWriteFile = promisify(fs.writeFile);

interface Story {
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

interface Comment {
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

const API_BASE_URL = 'https://hacker-news.firebaseio.com/v0';
const STORY_IDS = [19281834, 19055166, 18807017];

async function getItem<T>(itemId: number) {
  try {
    const res = await fetch(`${API_BASE_URL}/item/${itemId}.json`);
    const story = (await res.json()) as T;

    return story;
  } catch (e) {
    return null;
  }
}

async function scrape() {
  // tslint:disable-next-line:no-console
  console.log(chalk.green('Scraping stories data ...'));

  const stories = await Promise.all(STORY_IDS.map(id => getItem<Story>(id)));

  // tslint:disable-next-line:no-console
  console.log(
    chalk.green(`Got ${stories.length} stories data, loading comments ...`)
  );

  const commentsIds = await Promise.all(
    stories
      .filter(story => story !== null)
      .map(story => (story as Story).kids)
      .reduce((acc, kids) => {
        acc.push(...kids);

        return acc;
      }, [])
  );

  const comments = [];
  for (let i = 0; i < commentsIds.length; i += 5) {
    try {
      const loaded = await Promise.all([
        getItem<Comment>(commentsIds[i]),
        getItem<Comment>(commentsIds[i + 1]),
        getItem<Comment>(commentsIds[i + 2]),
        getItem<Comment>(commentsIds[i + 3]),
        getItem<Comment>(commentsIds[i + 4]),
      ]);

      comments.push(...loaded);
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(
        chalk.yellow(
          `Failed to loads comments from ${i} to ${i + 4}, skipping ...`
        )
      );
    }
  }

  // tslint:disable-next-line:no-console
  console.log(
    chalk.green(`Got ${comments.length} comments data, parsing job offers ...`)
  );

  const jobs: JobOffer[] = comments
    .filter(
      c =>
        !!c &&
        !!c.text &&
        typeof c.text === 'string' &&
        c.text.indexOf('<p>') !== -1 &&
        c.text.indexOf('|') !== -1
    )
    .map((comment: Comment) => {
      const firstLine = comment.text.split('<p>')[0];
      const splited = firstLine.split('|');
      const company = splited[0].trim();
      const position = splited[1] ? splited[1].trim() : '';
      const remote =
        firstLine
          .replace('-', '')
          .toLocaleLowerCase()
          .indexOf('onsite') === -1;

      const salary = splited
        .slice(2, splited.length)
        .find(str => /[0-9][0-9]/.test(str));
      let minSalary: string | null = null;
      let maxSalary: string | null = null;
      let currency: string | null = null;

      if (salary) {
        const parts = salary.split('-');
        minSalary = parts[0].replace(/\D/g, '');
        maxSalary = (parts[1] || parts[0]).replace(/\D/g, '');
        const isDollar = salary.indexOf('$') !== -1;
        currency = isDollar
          ? '$'
          : salary
              .replace('-', '')
              .replace(/[0-9]/g, '')
              .toUpperCase();
      }

      const description = fromString(comment.text);

      return {
        by: comment.by,
        commentId: comment.id,
        company,
        description,
        position,
        remote,
        minSalary,
        maxSalary,
        currency,
      };
    });

  const savePath = path.resolve(__dirname, '../src/jobs.json');

  // tslint:disable-next-line:no-console
  console.log(
    chalk.green(`Parsed ${jobs.length} jobs, saving to ${savePath} ...`)
  );

  await asyncWriteFile(savePath, JSON.stringify(jobs), {
    encoding: 'utf-8',
  });

  // tslint:disable-next-line:no-console
  console.log(chalk.green(`Saved.`));
}

scrape();

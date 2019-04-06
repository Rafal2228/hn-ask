import { default as chalk } from 'chalk';
import console = require('console');
import * as fs from 'fs';
import { fromString } from 'html-to-text';
import { default as fetch } from 'node-fetch';
import * as path from 'path';
import { promisify } from 'util';
import { POSITION_TAGS } from '../src/constants/position-tags';
import { JobOffer } from '../src/models/job-offer';

const POSITION_TAGS_EXPRESSIONS = POSITION_TAGS.map(tag => ({
  tag,
  expression: new RegExp(tag, 'i'),
}));

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

function normalizeLetters(str: string) {
  return str.replace(/[^a-zA-Z]/g, '').toLowerCase();
}

function normalizeTags(str: string) {
  return str.replace(/[^a-zA-Z+# ]/g, '').toLowerCase();
}

function normalizeCurrency(str: string) {
  return str.replace(/[^a-zA-Z0-9 $€\-]/g, '').toLowerCase();
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
    .map((comment: Comment) => {
      // Validate
      if (!comment || typeof comment.text !== 'string') {
        return null;
      }

      let splited = comment.text.split('<p>');

      if (splited.length < 2) {
        splited = comment.text.split('\n');

        if (splited.length < 2) {
          return null;
        }
      }

      const firstLine = fromString(splited[0]);
      let groups = firstLine.split('|');
      if (groups.length < 3) {
        return null;
      }

      // Remote
      let remote = false;

      for (const group of groups) {
        const normalized = normalizeLetters(group);

        if (normalized.includes('onsite')) {
          groups = groups.filter(g => g !== group);

          break;
        }

        if (normalized.includes('remote')) {
          remote = true;
          groups = groups.filter(g => g !== group);

          break;
        }
      }

      if (!groups.length) {
        return null;
      }

      // Position
      let position = '';
      const positionTagsSet = new Set<string>();

      for (const group of groups) {
        const normalized = normalizeTags(group);
        let hasAny = false;

        POSITION_TAGS_EXPRESSIONS.forEach(({ tag, expression }) => {
          if (!expression.test(normalized)) {
            return;
          }

          hasAny = true;
          positionTagsSet.add(tag);
        });

        if (hasAny) {
          position = position.length ? `${position} | ${group}` : group;
          groups = groups.filter(g => g !== group);
        }
      }

      const positionTags = Array.from(positionTagsSet);

      if (!groups.length || !positionTags.length) {
        return null;
      }

      // Salary
      let minSalary: number | null = null;
      let maxSalary: number | null = null;
      let currency: string | null = null;

      for (const group of groups) {
        const normalized = normalizeCurrency(group);

        if (normalized.includes('usd') || normalized.includes('$')) {
          currency = 'USD';
        } else if (normalized.includes('eur') || normalized.includes('€')) {
          currency = 'EUR';
        }

        if (!currency) {
          continue;
        }

        const digits = normalized.match(/\d+/g);

        if (!digits || !digits.length) {
          currency = null;
          continue;
        }

        minSalary = +digits[0];
        maxSalary = +(digits[1] || digits[0]);

        if (minSalary < 1000) {
          minSalary *= 1000;
        }

        if (maxSalary < 1000) {
          maxSalary *= 1000;
        }

        if (minSalary > maxSalary) {
          const tmp = minSalary;
          minSalary = maxSalary;
          maxSalary = tmp;
        }

        groups = groups.filter(g => g !== group);
        break;
      }

      if (!groups.length) {
        return null;
      }

      const company = groups[0];
      const description = fromString(comment.text);

      return {
        by: comment.by,
        commentId: comment.id,
        company,
        description,
        position,
        positionTags,
        remote,
        minSalary,
        maxSalary,
        currency,
      };
    })
    .filter(job => !!job) as JobOffer[];

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

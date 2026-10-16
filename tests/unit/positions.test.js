import { jest } from '@jest/globals';

describe('Borg careers page', () => {
  let index;

  beforeAll(async () => {
    index = await import('../../scraper/index.js');
  });

  const card = (id, title, dept) => `
    <section id="pos_x"><li class="pos-card" id="${id}">
      <div class="content">
        <div class="title">${title}</div>
        <div class="dept">${dept}</div>
        <button class="refer">Aplica</button>
      </div>
      <ul class="desc"><li>Candidatul ideal</li></ul>
    </li></section>`;

  const page = `<ul>
    ${card('pos_1', 'Senior\n<br />\nWeb Developer', 'IT Software')}
    ${card('pos_2', 'Contabil', 'Financiar')}
    ${card('pos_2', 'Contabil duplicat', 'Financiar')}
    <li class="pos-card"><div class="title">Fara id</div></li>
  </ul>`;

  it('builds the job URL from the card id and joins title lines split by <br>', () => {
    const jobs = index.parsePositionCards(page, 'https://jobs.borgdesign.ro/');
    expect(jobs.map((j) => j.url)).toEqual([
      'https://jobs.borgdesign.ro/#pos_1',
      'https://jobs.borgdesign.ro/#pos_2'
    ]);
    expect(jobs[0].title).toBe('Senior Web Developer');
  });

  it('skips cards without an id and de-duplicates repeated ids', () => {
    expect(index.parsePositionCards(page, 'https://jobs.borgdesign.ro/')).toHaveLength(2);
  });

  it('tags IT departments only, and ignores a hash already on the base URL', () => {
    const jobs = index.parsePositionCards(page, 'https://jobs.borgdesign.ro/#section2');
    expect(jobs[0].tags).toEqual(['it']);
    expect(jobs[1].tags).toEqual([]);
    expect(jobs[0].url).toBe('https://jobs.borgdesign.ro/#pos_1');
  });

  it('uses the configured default location and workmode', () => {
    const [job] = index.parsePositionCards(page, 'https://jobs.borgdesign.ro/');
    expect(job.location).toEqual(['București']);
    expect(job.workmode).toBe('on-site');
  });
});

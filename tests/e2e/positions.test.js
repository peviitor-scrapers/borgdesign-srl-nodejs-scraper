import scraperConfig from '../../scraper/config/scraper.js';

describe('E2E: live Borg careers page', () => {
  it('lists at least one well-formed position', async () => {
    const { parsePositionCards } = await import('../../scraper/index.js');
    const res = await fetch(scraperConfig.sources.positions, { headers: { 'User-Agent': scraperConfig.userAgent } });
    expect(res.ok).toBe(true);
    const jobs = parsePositionCards(await res.text());
    expect(jobs.length).toBeGreaterThan(0);
    for (const j of jobs) {
      expect(j.url.startsWith(scraperConfig.ownJobUrlPrefix)).toBe(true);
      expect(j.title).toBeTruthy();
    }
  }, 30000);
});

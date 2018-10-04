const legally = require('./');

describe('legally', () => {
  it('works with the current folder', async () => {
    expect(await legally()).toMatchObject({
      'fs-array@2.2.1': { package: [ 'MIT' ], copying: [ 'MIT' ], readme: [] }
    });
  });

  it('baconjs: folder called "readme"', async () => {
    const bacon = await legally('baconjs');
    const name = Object.keys(bacon)[0];
    expect(name.split('@')[0]).toBe('baconjs');
    const licenses = Object.values(bacon)[0];
    expect(Array.isArray(licenses.package)).toBe(true);
    expect(Array.isArray(licenses.copying)).toBe(true);
    expect(Array.isArray(licenses.readme)).toBe(true);
  });

  it('huncwot: file in folder called package.json', async () => {
    const hunc = await legally('huncwot');
    const name = Object.keys(hunc).find(key => /huncwot/.test(key));
    expect(name.split('@')[0]).toBe('huncwot');
    const licenses = hunc[name];
    expect(Array.isArray(licenses.package)).toBe(true);
    expect(Array.isArray(licenses.copying)).toBe(true);
    expect(Array.isArray(licenses.readme)).toBe(true);
  }, 30000);  // Fairly large package
});

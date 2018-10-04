const legally = require('./');

describe('legally', () => {
  it('works with the current folder', async () => {
    expect(await legally()).toMatchObject({
      'fs-array@2.2.1': { package: [ 'MIT' ], copying: [ 'MIT' ], readme: [] }
    });
  });

  it('baconjs: folder called "readme"', async () => {
    const bacon = await legally('baconjs');
    const [name, licenses] = Object.entries(bacon)[0];
    expect(name.split('@')[0]).toBe('baconjs');
    expect(Array.isArray(licenses.package)).toBe(true);
    expect(Array.isArray(licenses.copying)).toBe(true);
    expect(Array.isArray(licenses.readme)).toBe(true);
  });
});

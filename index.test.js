const legally = require('./');

describe('legally', () => {
  it('works with the current folder', async () => {
    expect(await legally()).toMatchObject({
      'fs-array@2.2.1': { package: [ 'MIT' ], copying: [ 'MIT' ], readme: [] }
    });
  });

  it('baconjs: folder called "readme"', async () => {
    const bacon = await legally('baconjs');
    console.log('BACON:', bacon);
    const name = Object.keys(bacon)[0];
    expect(name.split('@')[0]).toBe('baconjs');
    const licenses = Object.values(bacon)[0];
    expect(Array.isArray(licenses.package)).toBe(true);
    expect(Array.isArray(licenses.copying)).toBe(true);
    expect(Array.isArray(licenses.readme)).toBe(true);
  });
});

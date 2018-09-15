const search = require('./search_json');

describe('search_json', () => {
  it('returns empty if there is nothing', () => {
    expect(search()).toEqual([]);
    expect(search({})).toEqual([]);
    expect(search({ name: 'hello' })).toEqual([]);
  });

  it('returns MIT for the regex', () => {
    expect(search({ license: 'mit License' })).toEqual(['MIT']);
    expect(search({ license: 'MIT license' })).toEqual(['MIT']);
    expect(search({ license: 'MIT License' })).toEqual(['MIT']);
  });

  it('accepts different keys', () => {
    expect(search({ license: 'mit License' })).toEqual(['MIT']);
    expect(search({ licence: 'MIT license' })).toEqual(['MIT']);
    expect(search({ licenses: 'MIT License' })).toEqual(['MIT']);
    expect(search({ licences: 'MIT License' })).toEqual(['MIT']);
  });

  it('returns MIT and ISC for the regex', () => {
    expect(search({ license: 'MIT and ISC '})).toEqual(['ISC', 'MIT']);
  });

  it('can handle licenses', () => {
    expect(search({
      "license": "MIT",
      "licenses": [{ "type": "MIT", "url": "http://opensource.org/licenses/MIT" } ]
    })).toEqual(['MIT']);
  });

  it('can handle diverse formattings', () => {
    expect(search({ license: 'MIT' })).toEqual(['MIT']);
    expect(search({ license: { type: 'MIT' } })).toEqual(['MIT']);
    expect(search({ license: [{ type: 'MIT' }] })).toEqual(['MIT']);
    expect(search({ license: 'BSD', licenses: ['CC0', { type: 'MIT' }] })).toEqual(['BSD', 'CC0', 'MIT']);
  });
});

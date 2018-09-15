const search = require('./search_text');

describe('search_text', () => {
  it('returns empty if there is nothing', () => {
    expect(search()).toEqual([]);
    expect(search('')).toEqual([]);
    expect(search(5)).toEqual([]);
    expect(search('Hello world')).toEqual([]);
    expect(search('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')).toEqual([]);
  });

  it('returns MIT for the regex', () => {
    expect(search(`mit License`)).toEqual(['MIT']);
    expect(search(`MIT license`)).toEqual(['MIT']);
    expect(search(`MIT License`)).toEqual(['MIT']);
  });

  it('returns MIT and ISC for the regex', () => {
    expect(search(`This mit License and ISC license`)).toEqual(['ISC', 'MIT']);
  });

  it('returns MIT from full text', () => {
    expect(search(`
      # License

      Permission is hereby granted, free of charge, to any person obtaining a copy
      of this software and associated documentation files (the "Software"), to deal
      in the Software without restriction, including without limitation the rights
      to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
      copies of the Software, and to permit persons to whom the Software is
      furnished to do so, subject to the following conditions:

      The above copyright notice and this permission notice shall be included in
      all copies or substantial portions of the Software.

      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
      OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
      THE SOFTWARE.

      End of license
    `)).toEqual(['MIT']);
  });
});

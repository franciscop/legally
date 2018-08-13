var chai = require('chai');
var expect = chai.expect;
var package = require('../lib/package');

var legally = require('../lib/legally.js')(__dirname + '/moch');

describe('package.js', function(){
  it('should be defined', function(){
    expect(package).to.be.a('function');
  });

  it('no license is correctly handled', function(){
    expect(package({})).to.deep.equal([]);
    expect(package(false)).to.deep.equal([]);
    expect(package({ licenses: [] })).to.deep.equal([]);
    expect(package({ licenses: {} })).to.deep.equal([]);
    expect(package({ licenses: [{}] })).to.deep.equal([]);
  });

  it('accepts an object different license formats', function(){
    expect(package({ licenses: 'MIT' })).to.deep.equal(['MIT']);
    expect(package({ licenses: ['MIT'] })).to.deep.equal(['MIT']);
    expect(package({ licenses: { type: 'MIT'} })).to.deep.equal(['MIT']);
    expect(package({ licenses: [{ type: 'MIT' }] })).to.deep.equal(['MIT']);
  });

  it('cleans up few licenses', function(){
    expect(package({ licenses: 'MIT' })).to.deep.equal(['MIT']);
    expect(package({ licenses: 'MIT/X11' })).to.deep.equal(['MIT']);
    expect(package({ licenses: 'BSD-3-Clause' })).to.deep.equal(['BSD 3 Clause']);
    expect(package({ licenses: 'BSD 3-Clause' })).to.deep.equal(['BSD 3 Clause']);
    expect(package({ licenses: 'BSD-3 Clause' })).to.deep.equal(['BSD 3 Clause']);
    expect(package({ licenses: 'Apache 2.0' })).to.deep.equal(['Apache 2.0']);
    expect(package({ licenses: 'Apache Version 2.0' })).to.deep.equal(['Apache 2.0']);
    expect(package({ licenses: 'Apache License, Version 2.0' })).to.deep.equal(['Apache 2.0']);
    expect(package({ licenses: 'Apache License,Version 2.0' })).to.deep.equal(['Apache 2.0']);
    expect(package({ licenses: 'AFLv2.1' })).to.deep.equal(['AFL 2.1']);
  });
});

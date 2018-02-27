/* eslint-disable no-unused-expressions */
const chai = require('chai');
const Menuridae = require('../index');
const chaiAsPromised = require('chai-as-promised');
const dotenv = require('dotenv');

dotenv.config();

chai.use(chaiAsPromised);

const { expect } = chai;

const menuridae = new Menuridae();

describe('#Menuridae', () => {
  it('should have a loginUrl property', () => {
    expect(menuridae.loginUrl).to.not.be.undefined;
  });
});

describe('#login', () => {
  it('should login with a valid email and password', async () => {
    const result = await menuridae.login(process.env.EMAIL, process.env.PASSWORD);
    expect(result).to.be.true;
  });

  it('should fail if no username and password is supplied', async () => {
    expect(menuridae.login()).to.eventually.be.rejectedWith(Error);
  });

  it('should return false if it fails to log in', async () => {
    await menuridae.logout();
    const result = await menuridae.login(process.env.EMAIL, process.env.PASSWORD.split('').reverse());
    expect(result).to.be.false;
  });

  after(() => menuridae.logout());
});

describe('#logout', () => {
  it('should reinitialise the cookie jar', async () => {
    await menuridae.login(process.env.EMAIL, process.env.PASSWORD);
    expect(menuridae.loggedIn).to.equal(true);
    await menuridae.logout();
    expect(menuridae.loggedIn).to.equal(false);
  });
});

describe('#getCSRFToken', async () => {
  before(() => menuridae.login(process.env.EMAIL, process.env.PASSWORD));

  it('should return a CSRF token from the "my voice" page', async () => {
    const result = await menuridae.getCSRFToken();
    expect(result).to.have.property('length');
  });

  after(() => menuridae.logout());
});

describe('#generate', function () {
  this.timeout(6000);

  it('should fail if the input is not provided', async () => {
    expect(menuridae.generate()).to.eventually.be.rejectedWith('Supply input');
  });

  it('should not run if the client is not logged in', () => {
    expect(menuridae.generate({ texts: ['Test'] })).to.eventually.be.rejectedWith('Not logged in');
  });

  it('should generate the a file from the input and give the URL to that file', async () => {
    await menuridae.login(process.env.EMAIL, process.env.PASSWORD);
    const result = await menuridae.generate({ texts: ['Hello world'] });
    expect(result).to.match(/http/);
  });

  after(() => menuridae.logout());
});

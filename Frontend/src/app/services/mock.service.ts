import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MockService {
  // tslint:disable-next-line: no-use-before-declare
  API = API;
  constructor() { }

}

const API = {
  post: {
    '/login': {
      email: 'deverpham@gmail.com',
      id: 1,
      wallet: 'mzp6BEt1EuMZraHDWM3fDQpMGrJ1DmTA3j',
      token: '123459asd56asd654asd6',
      expired: 1238489
    },
    '/register': {
      email: 'deverpham@gmail.com',
      id: 1,
      wallet: 'mzp6BEt1EuMZraHDWM3fDQpMGrJ1DmTA3j',
      token: '123459asd56asd654asd6',
      expired: 1238489
    }
  },
  get: {
    '/analytics': {
      wallets: [{
        user_id: 1,
        wallet: 'mzp6BEt1EuMZraHDWM3fDQpMGrJ1DmTA3j'
      },
      {
        user_id: 2,
        wallet: '2N54QBN3Ub4r9PbjXMshyaH2nLQaB9REcaw'
      },
      {
        user_id: 3,
        wallet: '2N7UbttR5FppWB7MPBG2C6MboJeUfaGP9uU'
      }],
      onlines: 100,
      btcSent: 32.5,
      registers: 200
    }
  }
};

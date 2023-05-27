import FrontendDB from '../../../frontend-db/src';
import { DB_NAME } from './constants';

var openDBRequest: Promise<FrontendDB>;

function getDatabase(getNew = false): Promise<FrontendDB> {
   return new Promise((resolve, reject) => {
      if (!openDBRequest || getNew) {
         openDBRequest = FrontendDB.open(DB_NAME);
      }
      openDBRequest.then(db => {
         resolve(db)
      });
   });
}

export default getDatabase;
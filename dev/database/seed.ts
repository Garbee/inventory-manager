import * as dotenv from 'dotenv';
dotenv.config();
import {db, pgp} from '../../src/database/connection';
import * as faker from 'faker';

function makeid(length: number) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
	  result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

(async function() {
	for (let i =0; i < 10; i++) {
		const name = makeid(4);
		await db.locations.create({name}, ['id', 'name']);
	}
})();

import * as dotenv from "dotenv";
dotenv.config();
import { db } from "../../src/database/connection";

function makeid(length: number) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

(async function () {
  for (let i = 0; i < 10; i++) {
    const name = makeid(4);
    const location = await db.locations.create({ name }, ["id", "name"]);
    for (let i = 0; i < 10; i++) {
      const data = {
        name: makeid(10),
        title: makeid(15),
        location_id: location.id,
      };
      await db.items.create(data, ["id"]);
    }
  }
})();

const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
let hash = bcrypt.hashSync('jackson', salt);
console.log(hash);

const didMatch = bcrypt.compareSync(
    'sis',
    '$2b$10$G2LziGNPj043WGSPOizsPOZZeNDyA8h5aeKYcAqCq04OeanhC1TbG'
);

if (didMatch) {
    console.log(`you're in!`);
} else {
    console.log('💩');
}

const bcrypt = require("bcryptjs");
const hash = "$2b$10$VA/KVqG/njTyIkQILTYdHuuTsyDBfHAHgvjNV2s4udZvlLBmoGqn2";
const isValid = bcrypt.compareSync("250772", hash);
console.log("Is Valid:", isValid);

import { LowSync, JSONFileSync } from 'lowdb';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

const db = new LowSync(new JSONFileSync('./public/db/db.json'));

export const createNewUser=async(username, password)=> {
  db.read();
  const hash = await generateHash(password);
  const user = {
    username: username,
    hash: hash,
    id: uuidv4()
  };
  db.data.users.push(user);
  db.write();
  delete user.hash;
  return user;
}

export const existingUser=async(username, password)=> {
  db.read();
  const potentionalUser = db.data.users.find((user) => user.username === username);
  if (potentionalUser) {
    return potentionalUser;
  }
  return null;
}


export const verifyUser=async(username, password)=> {
  db.read();
  const potentionalUser = db.data.users.find((user) => user.username === username);
  if (potentionalUser) {
    const isTruePassword = await checkPasswordHash(password, potentionalUser.hash);
    if (isTruePassword) {
      return potentionalUser;
    }
  }
  return null;
}

function generateHash(password) {
  return new Promise(resolve => {
    bcrypt.hash(password, 10, function (err, hash) {
      // Store hash in your password DB.
      resolve(hash);
    });
  });
}

function checkPasswordHash(password, hash) {
  return new Promise(resolve => {
    bcrypt.compare(password, hash, function (err, result) {
      // Store hash in your password DB.
      resolve(result);
    });
  });
}

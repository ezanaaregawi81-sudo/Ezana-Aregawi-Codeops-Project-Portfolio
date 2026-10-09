import 'server-only';
import { scryptSync, timingSafeEqual } from 'node:crypto';

// Demo accounts. A real app keeps these in a database; passwords are only ever stored hashed.
const SALT = 'addis-eats-demo';
const hash = (password) => scryptSync(password, SALT, 32);

const users = [
  { id: 'u-abebe', email: 'abebe@example.com', name: 'Abebe Bikila', role: 'customer', passwordHash: hash('injera123') },
  { id: 'u-tirunesh', email: 'tirunesh@example.com', name: 'Tirunesh Dibaba', role: 'customer', passwordHash: hash('injera123') },
  { id: 'u-kitchen', email: 'kitchen@addiseats.et', name: 'Kitchen Staff', role: 'staff', passwordHash: hash('kitchen123') },
];

// An unknown email and a wrong password both return null, so the form can't be used to
// find out which emails have accounts. The hash is computed either way, so timing doesn't tell.
export function verifyCredentials(email, password) {
  const user = users.find((u) => u.email === String(email).trim().toLowerCase());
  const attempt = hash(String(password));
  if (!user || !timingSafeEqual(user.passwordHash, attempt)) return null;
  return { id: user.id, name: user.name, role: user.role };
}

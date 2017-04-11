/* @flow */
import crypto from 'crypto';

const KEY_SIZE = 16;

export function generateRandomHexString(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

export function generateId(): string {
  return generateRandomHexString(KEY_SIZE);
}

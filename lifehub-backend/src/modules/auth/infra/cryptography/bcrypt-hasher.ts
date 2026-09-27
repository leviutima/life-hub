import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { Hasher } from '../../domain/services/hasher.js';

const SALT_ROUNDS = 10;

@Injectable()
export class BcryptHasher implements Hasher {
  hash(plain: string): Promise<string> {
    return hash(plain, SALT_ROUNDS);
  }

  compare(plain: string, hashed: string): Promise<boolean> {
    return compare(plain, hashed);
  }
}

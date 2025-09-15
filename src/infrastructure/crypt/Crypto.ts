import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class CryptoService {
  // ======================== ENCRYPT ========================
  async encrypt(data: string): Promise<string> {
    const salt = 7;
    return hash(data, salt);
  }

  // ======================== DECRYPT ========================
  async decrypt(data: string, encryptedDate: string): Promise<boolean> {
    if (!data.trim() || !encryptedDate.trim()) {
      return false;
    }
    return compare(data, encryptedDate);
  }
}

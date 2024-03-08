import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  isAuthenticated(username: string, password: string): boolean {
    return username === 'validUser' && password === 'validPassword';
  }
}

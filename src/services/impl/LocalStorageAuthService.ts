import { IAuthService } from '../interfaces';
import { User } from '@/types';
import { StorageService } from '../storage.service';
import { hashPassword } from '@/utils/crypto';

export class LocalStorageAuthService implements IAuthService {
  async register(fullName: string, email: string, password: string, phone?: string): Promise<User> {
    const users = StorageService.getUsers();

    // Check if email already exists
    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      throw new Error('البريد الإلكتروني مسجل بالفعل / Email already registered');
    }

    const hashedPassword = await hashPassword(password);
    const newUser: User = {
      id: crypto.randomUUID(),
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    StorageService.setUsers(users);

    // Set current user session (exclude password from saved object)
    const { password: _, ...userSession } = newUser;
    StorageService.setCurrentUser(userSession as User);

    return userSession as User;
  }

  async login(email: string, password: string): Promise<User> {
    const users = StorageService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة / Incorrect email or password');
    }

    const hashedPassword = await hashPassword(password);
    if (user.password !== hashedPassword) {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة / Incorrect email or password');
    }

    const { password: _, ...userSession } = user;
    StorageService.setCurrentUser(userSession as User);

    return userSession as User;
  }

  async logout(): Promise<void> {
    StorageService.setCurrentUser(null);
  }

  getCurrentUser(): User | null {
    return StorageService.getCurrentUser();
  }

  async updateProfile(userId: string, fullName: string, phone?: string, email?: string, password?: string): Promise<User> {
    const users = StorageService.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new Error('المستخدم غير موجود / User not found');
    }

    // Check if new email is already taken by another user
    if (email && email.toLowerCase() !== users[userIndex].email.toLowerCase()) {
      const emailExists = users.some(u => u.id !== userId && u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        throw new Error('البريد الإلكتروني مسجل مسبقاً / Email already exists');
      }
    }

    let updatedPassword = users[userIndex].password;
    if (password && password.trim() !== '') {
      updatedPassword = await hashPassword(password);
    }

    const updatedUser = {
      ...users[userIndex],
      fullName,
      phone,
      ...(email && { email }),
      password: updatedPassword,
    };

    users[userIndex] = updatedUser;
    StorageService.setUsers(users);

    const { password: _, ...userSession } = updatedUser;
    StorageService.setCurrentUser(userSession as User);

    return userSession as User;
  }
}

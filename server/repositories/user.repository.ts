import { AppDataSource } from "../config/database.config";
import { User } from "../entities/user.entity";
import { IUser } from "../interfaces/user.interface";

export const getUserByUsername = async (username: string): Promise<User | null> => {
  return AppDataSource.getRepository(User).findOne({ where: { username } });
};

export const createUser = async (userData: Omit<IUser, 'id'>): Promise<User> => {
  const userRepository = AppDataSource.getRepository(User);
  const newUser = userRepository.create(userData);
  return userRepository.save(newUser);
};
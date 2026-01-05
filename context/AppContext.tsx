import { createContext } from 'react';
import { User, Language, Translations } from '../types';

export interface AppContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  lang: Language;
  setLang: (l: Language) => void;
  t: Translations;
  toggleWishlist: (productId: string) => void;
  toggleFollow: (targetUserId: string) => Promise<void>;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);
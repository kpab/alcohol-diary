export interface AlcoholRecord {
  id: string;
  date: Date;
  category: AlcoholCategory;
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  store?: string;
  photo?: string;
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum AlcoholCategory {
  BEER = 'ビール',
  SAKE = '日本酒',
  WINE_RED = '赤ワイン',
  WINE_WHITE = '白ワイン',
  WHISKEY = 'ウイスキー',
  SHOCHU = '焼酎',
  COCKTAIL = 'カクテル',
  OTHER = 'その他'
}

export interface UserSettings {
  isPremium: boolean;
  premiumPurchaseDate?: Date;
}
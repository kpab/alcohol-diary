import AsyncStorage from '@react-native-async-storage/async-storage';
import { AlcoholRecord, UserSettings } from '../types';

const STORAGE_KEYS = {
  RECORDS: 'alcohol_records',
  SETTINGS: 'user_settings'
};

export class StorageService {
  static async getAllRecords(): Promise<AlcoholRecord[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.RECORDS);
      if (!data) return [];
      return JSON.parse(data).map((record: any) => ({
        ...record,
        date: new Date(record.date),
        createdAt: new Date(record.createdAt),
        updatedAt: new Date(record.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading records:', error);
      return [];
    }
  }

  static async saveRecord(record: AlcoholRecord): Promise<void> {
    try {
      const records = await this.getAllRecords();
      const existingIndex = records.findIndex(r => r.id === record.id);
      
      if (existingIndex >= 0) {
        records[existingIndex] = record;
      } else {
        records.push(record);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    } catch (error) {
      console.error('Error saving record:', error);
      throw error;
    }
  }

  static async deleteRecord(id: string): Promise<void> {
    try {
      const records = await this.getAllRecords();
      const filteredRecords = records.filter(r => r.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(filteredRecords));
    } catch (error) {
      console.error('Error deleting record:', error);
      throw error;
    }
  }

  static async getSettings(): Promise<UserSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        return { isPremium: false };
      }
      const settings = JSON.parse(data);
      if (settings.premiumPurchaseDate) {
        settings.premiumPurchaseDate = new Date(settings.premiumPurchaseDate);
      }
      return settings;
    } catch (error) {
      console.error('Error loading settings:', error);
      return { isPremium: false };
    }
  }

  static async saveSettings(settings: UserSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }
}
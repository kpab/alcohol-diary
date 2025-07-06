import { Platform } from 'react-native';
import { AlcoholRecord, UserSettings } from '../types';

const STORAGE_KEYS = {
  RECORDS: 'alcohol_records',
  SETTINGS: 'user_settings'
};

export class StorageService {
  static async getAllRecords(): Promise<AlcoholRecord[]> {
    try {
      let data: string | null = null;
      if (Platform.OS === 'web') {
        data = localStorage.getItem(STORAGE_KEYS.RECORDS);
      } else {
        // Mobile implementation - will be added later
        return [];
      }
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
      
      const data = JSON.stringify(records);
      if (Platform.OS === 'web') {
        localStorage.setItem(STORAGE_KEYS.RECORDS, data);
      } else {
        // Mobile implementation - will be added later
      }
    } catch (error) {
      console.error('Error saving record:', error);
      throw error;
    }
  }

  static async deleteRecord(id: string): Promise<void> {
    try {
      const records = await this.getAllRecords();
      const filteredRecords = records.filter(r => r.id !== id);
      const data = JSON.stringify(filteredRecords);
      if (Platform.OS === 'web') {
        localStorage.setItem(STORAGE_KEYS.RECORDS, data);
      } else {
        // Mobile implementation - will be added later
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      throw error;
    }
  }

  static async getSettings(): Promise<UserSettings> {
    try {
      let data: string | null = null;
      if (Platform.OS === 'web') {
        data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      } else {
        // Mobile implementation - will be added later
        data = null;
      }
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
      const data = JSON.stringify(settings);
      if (Platform.OS === 'web') {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, data);
      } else {
        // Mobile implementation - will be added later
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  static async setPremiumStatus(isPremium: boolean): Promise<void> {
    try {
      const settings = await this.getSettings();
      const updatedSettings: UserSettings = {
        ...settings,
        isPremium,
        premiumPurchaseDate: isPremium ? new Date() : undefined,
      };
      await this.saveSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating premium status:', error);
      throw error;
    }
  }

  static async getPremiumStatus(): Promise<boolean> {
    try {
      const settings = await this.getSettings();
      return settings.isPremium || false;
    } catch (error) {
      console.error('Error getting premium status:', error);
      return false;
    }
  }
}
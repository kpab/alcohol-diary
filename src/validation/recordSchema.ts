import { z } from 'zod';
import { AlcoholCategory } from '../types';

export const recordSchema = z.object({
  date: z.date({
    required_error: '日付を選択してください',
    invalid_type_error: '有効な日付を選択してください',
  }),
  category: z.nativeEnum(AlcoholCategory, {
    required_error: 'カテゴリを選択してください',
    invalid_type_error: '有効なカテゴリを選択してください',
  }),
  name: z.string({
    required_error: 'お酒の名前を入力してください',
  }).min(1, {
    message: 'お酒の名前を入力してください',
  }).max(100, {
    message: 'お酒の名前は100文字以内で入力してください',
  }),
  rating: z.number({
    required_error: '評価を選択してください',
    invalid_type_error: '有効な評価を選択してください',
  }).min(1, {
    message: '評価は1以上で選択してください',
  }).max(5, {
    message: '評価は5以下で選択してください',
  }),
  store: z.string().max(100, {
    message: '店舗名は100文字以内で入力してください',
  }).optional(),
  memo: z.string().max(500, {
    message: 'メモは500文字以内で入力してください',
  }).optional(),
});

export type RecordFormData = z.infer<typeof recordSchema>;

export const validateRecord = (data: any) => {
  return recordSchema.safeParse(data);
};
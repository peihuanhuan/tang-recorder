import AsyncStorage from "@react-native-async-storage/async-storage";

import _ from "lodash/array";
import { v4 as uuidv4 } from 'uuid';

export class RecordPO {
  id: string;
  name: string;
  category: string;
  tags: string[];
  md5: string;
  path: string;
  durationMillis: number;
  size: number;
  createAt: number;
  deleteAt: number;

  constructor(
    name: string,
    category: string,
    tags: string[],
    md5: string,
    path: string,
    durationMillis: number,
    size: number,
    createAt: number,
  ) {
    this.name = name;
    this.category = category;
    this.tags = tags;
    this.md5 = md5;
    this.path = path;
    this.durationMillis = durationMillis;
    this.size = size;
    this.createAt = createAt;
  }
}

const RECORD_KEY = "records";
export class RecordService {
  static async storeRecord(record: RecordPO) {
    const originValue = await AsyncStorage.getItem(RECORD_KEY);
    record.id = uuidv4();

    let records = originValue != null ? JSON.parse(originValue) : [];
    records = [...records, record];

    await AsyncStorage.setItem(RECORD_KEY, JSON.stringify(records));
  }

  static async listRecords(): Promise<RecordPO[]> {
    const originValue = await AsyncStorage.getItem(RECORD_KEY);

    const records = originValue != null ? JSON.parse(originValue) : [];
    records.sort((a, b) => b.createAt - a.createAt);
    return records.filter(obj => obj.deleteAt === null);
  }

  static async getRecordById(id:string): Promise<RecordPO> {
    const originValue = await AsyncStorage.getItem(RECORD_KEY);

    const records = originValue != null ? JSON.parse(originValue) : [];
    return records.find(obj => obj.id === id);
  }

  static async deleteRecordById(id:string): Promise<void> {
    const originValue = await AsyncStorage.getItem(RECORD_KEY);

    const records = originValue != null ? JSON.parse(originValue) : [];
    const needDelete =  records.find(obj => obj.id === id);
    needDelete.deleteAt =  new Date().getTime()
    await AsyncStorage.setItem(RECORD_KEY, JSON.stringify(records));
  }


  static async getAllCategoriesAndTags(
    record: RecordPO,
  ): Promise<[string[], string[]]> {
    const originValue = await AsyncStorage.getItem(RECORD_KEY);

    const records = (
      originValue != null ? JSON.parse(originValue) : []
    ) as RecordPO[];

    const categories = _.uniq(records.map((e) => e.category));
    const tags = _.uniq(records.flatMap((e) => e.tags));

    return [categories, tags];
  }
}

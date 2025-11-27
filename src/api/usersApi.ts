import { Reader } from '../redux/usersSlice';
import { mockReaders, delay } from './mockData';

const READERS_KEY = 'library_readers';

const initReaders = () => {
  if (!localStorage.getItem(READERS_KEY)) {
    localStorage.setItem(READERS_KEY, JSON.stringify(mockReaders));
  }
};

const getStoredReaders = (): Reader[] => {
  initReaders();
  const data = localStorage.getItem(READERS_KEY);
  return data ? JSON.parse(data) : [];
};

const saveReaders = (readers: Reader[]) => {
  localStorage.setItem(READERS_KEY, JSON.stringify(readers));
};

export const getReaders = async (): Promise<Reader[]> => {
  await delay(300);
  return getStoredReaders();
};

export const createReader = async (reader: Omit<Reader, 'id'>): Promise<Reader> => {
  await delay(300);
  const readers = getStoredReaders();
  const newReader: Reader = {
    ...reader,
    id: Date.now().toString(),
  };
  readers.push(newReader);
  saveReaders(readers);
  return newReader;
};

export const updateReader = async (reader: Reader): Promise<Reader> => {
  await delay(300);
  const readers = getStoredReaders();
  const index = readers.findIndex(r => r.id === reader.id);
  if (index !== -1) {
    readers[index] = reader;
    saveReaders(readers);
  }
  return reader;
};

export const deleteReader = async (id: string): Promise<void> => {
  await delay(300);
  const readers = getStoredReaders();
  const filtered = readers.filter(r => r.id !== id);
  saveReaders(filtered);
};

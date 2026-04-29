import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type {
  CareerRoadmap,
  DiagnosisAnswers,
  DiagnosisDocumentShape,
  DiagnosisResult,
} from "@/types/diagnosis";

type StoreData = { items: DiagnosisDocumentShape[] };

const STORE_DIR = path.join(process.cwd(), ".data");
const STORE_FILE = path.join(STORE_DIR, "diagnosis-store.json");

async function ensureStoreFile() {
  await mkdir(STORE_DIR, { recursive: true });
  try {
    await readFile(STORE_FILE, "utf8");
  } catch {
    await writeFile(STORE_FILE, JSON.stringify({ items: [] }, null, 2), "utf8");
  }
}

async function readStore(): Promise<StoreData> {
  await ensureStoreFile();
  const raw = await readFile(STORE_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw) as StoreData;
    return Array.isArray(parsed.items) ? parsed : { items: [] };
  } catch {
    return { items: [] };
  }
}

async function writeStore(data: StoreData) {
  await ensureStoreFile();
  await writeFile(STORE_FILE, JSON.stringify(data, null, 2), "utf8");
}

function toHex24(input: string) {
  const normalized = input.replace(/[^a-f0-9]/gi, "").toLowerCase();
  if (normalized.length >= 24) return normalized.slice(0, 24);
  return (normalized + "0".repeat(24)).slice(0, 24);
}

function createId() {
  return toHex24(`${Date.now().toString(16)}${Math.random().toString(16)}`);
}

export async function createDiagnosisLocal(input: {
  userId: string;
  answers: DiagnosisAnswers;
  result: DiagnosisResult;
  careerRoadmap: CareerRoadmap;
}) {
  const store = await readStore();
  const now = new Date().toISOString();
  const row: DiagnosisDocumentShape = {
    _id: createId(),
    userId: toHex24(input.userId),
    answers: input.answers,
    result: input.result,
    careerRoadmap: input.careerRoadmap,
    createdAt: now,
    updatedAt: now,
  };
  store.items.push(row);
  await writeStore(store);
  return row;
}

export async function listDiagnosisLocal(userId: string) {
  const uid = toHex24(userId);
  const store = await readStore();
  return store.items
    .filter((x) => x.userId === uid)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getDiagnosisLocal(userId: string, id: string) {
  const uid = toHex24(userId);
  const rid = toHex24(id);
  const store = await readStore();
  return store.items.find((x) => x.userId === uid && x._id === rid) ?? null;
}

export async function updateDiagnosisLocal(
  userId: string,
  id: string,
  payload: { result: DiagnosisResult; careerRoadmap: CareerRoadmap },
) {
  const uid = toHex24(userId);
  const rid = toHex24(id);
  const store = await readStore();
  const idx = store.items.findIndex((x) => x.userId === uid && x._id === rid);
  if (idx < 0) return null;
  const current = store.items[idx];
  const next: DiagnosisDocumentShape = {
    ...current,
    result: payload.result,
    careerRoadmap: payload.careerRoadmap,
    updatedAt: new Date().toISOString(),
  };
  store.items[idx] = next;
  await writeStore(store);
  return next;
}

export async function deleteDiagnosisLocal(userId: string, id: string) {
  const uid = toHex24(userId);
  const rid = toHex24(id);
  const store = await readStore();
  const nextItems = store.items.filter((x) => !(x.userId === uid && x._id === rid));
  if (nextItems.length === store.items.length) return false;
  await writeStore({ items: nextItems });
  return true;
}

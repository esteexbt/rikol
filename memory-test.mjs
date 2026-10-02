import { MemWal } from "@mysten-incubation/memwal";

const userId = "b5d9a967-0d8a-4f13-b92b-ad449fc6e80a";
const namespace = `rikol-user-${userId}`;

const privateKey = process.env.MEMWAL_PRIVATE_KEY;

if (!privateKey) {
  throw new Error("MEMWAL_PRIVATE_KEY is not set.");
}

const keyBytes = Uint8Array.from(
  privateKey.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
);

const memwal = MemWal.create({
  key: keyBytes,
  accountId: process.env.MEMWAL_ACCOUNT_ID,
  serverUrl: process.env.MEMWAL_SERVER_URL,
  namespace,
});

const result = await memwal.recall({
  query: "What do we know about this user?",
  limit: 10,
});

console.log("\n=== RIKOL WALRUS MEMORIES ===");
console.log(`Found: ${result.results.length} memories\n`);

for (const memory of result.results) {
  console.log(`- ${memory.text}`);
  console.log(`  distance: ${memory.distance}`);
}

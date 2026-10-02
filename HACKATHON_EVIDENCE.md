# Rikol — Walrus Session 8 Hackathon Evidence

## Project

**Project:** Rikol  
**Purpose:** Personal AI assistant with persistent cross-conversation memory powered by Walrus Memory.

---

# Hackathon Requirements

## 1. Walrus Memory Integration

- [x] MemWal SDK integrated
- [x] Walrus Memory used for persistent user memory
- [x] Production Walrus relayer configured
- [x] User-specific namespaces implemented
- [x] Cross-conversation memory verified through the Rikol UI

### Production configuration

- Relayer: `https://relayer.memory.walrus.xyz`
- MemWal Account ID: `0x3b6447f8...703a3c07f5`
- Delegate keys registered: 1

---

## 2. Walrus Mainnet Blobs

**Requirement:** At least 10 Mainnet blobs.

**Status: COMPLETE**

10 distinct blob IDs have been independently checked against the Walrus Mainnet aggregator and returned HTTP 200.

### Verified blobs

1. `rKlz66f7AqiRcSenj1vNULkooDA_be5Jz8g8Jd32s-o`
   - Memory: User is a 300 level university student
   - Mainnet: HTTP 200

2. `0UaffoGPCkFVW5YK8He0d140KR3hJ4jc8sVbqwRNTgg`
   - Memory: User is a designer
   - Mainnet: HTTP 200

3. `Au6kdllIRxXLIDEvdxyxGo5Rv1Giv27eEa0qiV_uzWw`
   - Memory: User's name is John
   - Mainnet: HTTP 200

4. `280VdJ58KaWI2G6KaBAhkrBzA1F9htMlteL-X4cjNRA`
   - Memory: User's name is Chimbuzor
   - Mainnet: HTTP 200

5. `50FR1bKvAhnKV7sRoIuLk160Du3jTQPPZcFbnVKi2ys`
   - Memory: User is building a project called Rikol
   - Mainnet: HTTP 200

6. `Em6Z7V98WrRwLi9q9XSTtLP6bDrjn605hp84dJ4lCGg`
   - Memory: User's dog's name is Ekuke
   - Mainnet: HTTP 200

7. `oBAVaGAutFs-ihqxeG-h7uG72SlDb4EDYbDVookq7E4`
   - Memory: User's favorite snack is chin chin
   - Mainnet: HTTP 200

8. `aEmAmBJEbKN2rrLILNLt1QkyMDOHcJgKkNe0-DtTXHE`
   - Memory: User's favorite design software is Figma
   - Mainnet: HTTP 200

9. `CAV9bcy0ICuguyui-vG0kW8RJRtogmDLeR0QKatDia0`
   - Memory: User usually goes to school every Monday
   - Mainnet: HTTP 200

10. `ToeBbMHerw6dY9O0XfjThWWqTmvodzK0Qh0Jd23t4N4`
    - Memory: Test memory
    - Mainnet: HTTP 200

---

## 3. User Namespaces

Two user-specific namespaces have been observed:

- `rikol-user-b5d9a967-0d8a-4f13-b92b-ad449fc6e80a`
  - 5 memories

- `rikol-user-31978fce-6ef8-4514-a750-0f26e83fe40b`
  - 5 memories

Total observed memories: **10**

---

## 4. Persistent Memory Verification

- [x] Memory created in one conversation
- [x] New conversation opened
- [x] Rikol successfully recalled the previous information
- [x] Memory verified directly through MemWal recall
- [x] Corresponding blob IDs verified on Walrus Mainnet

---

# Remaining Submission Requirements

- [ ] Agent ID / account evidence finalized
- [x] Dedicated Walrus Sessions wallet
- [ ] Production deployment
- [ ] Publicly reachable deployed application
- [ ] Public GitHub repository
- [ ] README with setup instructions
- [ ] LLM/model documented
- [ ] Real-user usage evidence
- [ ] Medium/Inkray article
- [ ] X post with `@WalrusProtocol` and `#WalrusMemory`
- [ ] Walrus feedback form
- [ ] Bug/friction point documented
- [ ] Improvement idea documented
- [ ] GitHub issue if applicable
- [ ] Walrus Discord participation
- [ ] DeepSurge submission

---

# Evidence Notes

The Walrus dashboard's "Delete Pre-Migration Memories" section is not being used as the current blob-count source because it specifically applies to memories written before July 30, 2026.

Current Mainnet blob evidence was verified directly using the Walrus Mainnet aggregator.

**Never commit or publish `MEMWAL_PRIVATE_KEY`.**

## 5. Dedicated Sessions Wallet

- Status: Complete
- Network: Sui Testnet
- Address: `0xaeed63280e90920531458ddaf896937ed9046b242c193a60abe81b6f486ffede`
- Purpose: Dedicated wallet created specifically for the Walrus Sessions submission.


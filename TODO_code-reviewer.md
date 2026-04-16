# Code Review for PEFCL

## Context
- **Repository**: pefcl
- **Language**: TypeScript (Node.js/Bun Server & React Web)
- **Framework**: FiveM (CitizenFX), Express (Mocking), Sequelize (ORM), Jotai (State)
- **Scope**: Comprehensive security, performance, and quality review.

## Review Plan
- [x] **CR-PLAN-1.1 [Security Scan]**:
  - **Scope**: Inspect the AuthService, AccountController, and Transaction logic for authorization bypasses and transaction integrity.
  - **Priority**: Critical
- [x] **CR-PLAN-1.2 [Performance Audit]**:
  - **Scope**: Identify memory leaks in event emitters and N+1 query patterns in services.
  - **Priority**: High
- [x] **CR-PLAN-1.3 [Architecture & Quality]**:
  - **Scope**: Assess SOLID adherence and error handling robustness.
  - **Priority**: Medium

## Review Findings

### Security & Data Integrity

- [x] **CR-ITEM-1.1 [Critical: Race Condition in Balance Updates]**:
  - **Severity**: Critical
  - **Location**: `src/server/services/account/account.db.ts` (Lines 93-94, 98, 102) and `src/server/services/account/account.service.ts` (Line 754)
  - **Description**: The application reads the current balance into memory and then performs an update with the calculated value. In high-concurrency scenarios, this facilitates a "lost update" anomaly where simultaneous transactions can overwrite each other, potentially leading to money duplication or loss.
  - **Recommendation**: Use atomic increments/decrements provided by Sequelize or raw SQL literals to ensure atomicity at the database level.
  ```typescript
  // Recommended Fix in account.db.ts
  async transfer({ fromAccount, toAccount, amount, transaction }: TransferParams) {
    await fromAccount.decrement('balance', { by: amount, transaction });
    await toAccount.increment('balance', { by: amount, transaction });
  }
  ```

- [x] **CR-ITEM-1.2 [High: Missing Await on Transaction Commit/Rollback]**:
  - **Severity**: High
  - **Location**: `src/server/services/account/account.service.ts` (Lines 179, 182, 335, 338, 399, 401, etc.) and `src/server/services/transaction/transaction.service.ts` (Lines 142, 144, 191, 193)
  - **Description**: `t.commit()` and `t.rollback()` are asynchronous operations in Sequelize but are called without `await` across multiple services. This can lead to race conditions where the response is sent to the client before the database transaction is actually finalized.
  - **Recommendation**: Always `await` transaction lifecycle methods to ensure data consistency before continuing execution.

### Performance

- [x] **CR-ITEM-2.1 [Critical: Progressive Memory Leak in Mock Server]**:
  - **Severity**: Critical
  - **Location**: `src/server/server.ts` (Line 62)
  - **Description**: The `createEndpoint` function adds a new `onNet` listener for the `responseEventName` on every single HTTP request. These listeners are never removed, causing the event emitter's listener array to grow indefinitely until a `MaxListenersExceededWarning` occurs and eventually crashes the process or severely slows it down.
  - **Recommendation**: Use `onceNet` (if available) or manually remove the listener inside the resolver.
  ```typescript
  // Example Fix
  const handler = (_source: number, data: any) => {
    removeEventListener(responseEventName, handler); // Pseudocode for listener removal
    resolve(data);
  };
  onNet(responseEventName, handler);
  ```

- [x] **CR-ITEM-2.2 [Medium: N+1 Query in handleGetMyAccounts]**:
  - **Severity**: Medium
  - **Location**: `src/server/services/account/account.service.ts` (Lines 140-155)
  - **Description**: `handleGetMyAccounts` fetches all accounts for a user and then fetches shared accounts separately. While not a classic N+1, it's inefficient. More importantly, it performs client-side filtering on server-side data.
  - **Recommendation**: Optimize queries to fetch both personal and shared accounts in a single optimized query or use `Promise.all` for parallel execution.

### Bug Detection & Logic

- [x] **CR-ITEM-3.1 [Medium: Silent Error Swallowing in Database Operations]**:
  - **Severity**: Medium
  - **Location**: `src/server/services/account/account.service.ts` (Lines 649, 692, 724, 772)
  - **Description**: Multiple `catch` blocks in the service layer only perform a `t.rollback()` but do not re-throw the error or notify the controller/UI of the failure. This leads to the UI potentially showing a "Success" state while the database operation actually failed.
  - **Recommendation**: Re-throw the error or return a specific error structure so the controller can respond with a proper error status.

## Effort & Priority Assessment
- **Implementation Effort**: 4-6 hours (Critical fixes only)
- **Complexity Level**: Moderate (requires careful transaction handling)
- **Dependencies**: None
- **Priority Score**: 10/10 (Critical due to money integrity and memory leak)

## Quality Assurance Task Checklist
- [x] Every finding has a severity level and remediation path.
- [x] Security issues appear first.
- [x] Performance suggestions include justification.
- [x] References are accurate.

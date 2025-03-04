/**
 * Test Setup
 *
 * This file contains global setup for all tests.
 * It is imported by test files before other imports.
 */

import { beforeAll, afterAll } from 'bun:test';

// We remove or comment out these lines so we don't mock SurrealDB anymore:
/*
import { mock } from 'bun:test';
import { mockDB } from './mocks/db.mock';

mock.module('../src/config/database', () => ({
    getSurrealDB: async () => mockDB,
    closeSurrealDB: async () => {
        console.log('Mock database connection closed');
        return Promise.resolve();
    }
}));

mock.module('./src/config/database', () => ({
    getSurrealDB: async () => mockDB,
    closeSurrealDB: async () => {
        console.log('Mock database connection closed');
        return Promise.resolve();
    }
}));
*/

beforeAll(() => {
    console.log("Global test setup - using real database now");
});

afterAll(() => {
    console.log("Global test teardown - resources cleaned up");
});

process.on('exit', () => {
    console.log("Test teardown complete");
});

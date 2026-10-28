import { faker } from '@faker-js/faker';

// Seeded, so every story (and every reload) shows the same data.
faker.seed(42);

export type Person = {
  age: number;
  city: string;
  email: string;
  firstName: string;
  id: string;
  isActive: boolean;
  lastName: string;
  salary: number;
  state: string;
  subRows?: Person[];
};

const makePerson = (): Person => ({
  age: faker.number.int({ max: 68, min: 21 }),
  city: faker.location.city(),
  email: faker.internet.email().toLowerCase(),
  firstName: faker.person.firstName(),
  id: faker.string.uuid(),
  isActive: faker.datatype.boolean(),
  lastName: faker.person.lastName(),
  salary: faker.number.int({ max: 190_000, min: 32_000 }),
  state: faker.location.state(),
});

export const makeData = (count = 50): Person[] =>
  Array.from({ length: count }, makePerson);

/** People with nested `subRows`, for tree examples. */
export const makeTree = (count = 8): Person[] =>
  makeData(count).map((manager) => ({
    ...manager,
    subRows: makeData(3).map((report) => ({ ...report, subRows: makeData(2) })),
  }));

export const states = [...new Set(makeData(80).map((p) => p.state))].sort();

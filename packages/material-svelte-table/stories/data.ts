import { faker } from '@faker-js/faker';

// Seeded, so every story (and every reload) shows the same data.
faker.seed(42);

export type Person = {
  address: string;
  city: string;
  firstName: string;
  gender: string;
  id: string;
  lastName: string;
  phoneNumber: string;
  state: string;
};

export const makePeople = (count = 100): Person[] =>
  Array.from({ length: count }, () => ({
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    firstName: faker.person.firstName(),
    gender: faker.person.sex(),
    id: faker.string.uuid(),
    lastName: faker.person.lastName(),
    phoneNumber: faker.phone.number(),
    state: faker.location.state(),
  }));

export const states = [...new Set(makePeople(60).map((p) => p.state))].sort();

export type Employee = Person & {
  age: number;
  birthDate: Date;
  isActive: boolean;
  salary: number;
  subRows?: Employee[];
};

export const makeEmployees = (count = 100): Employee[] =>
  makePeople(count).map((person) => ({
    ...person,
    age: faker.number.int({ max: 70, min: 21 }),
    birthDate: faker.date.birthdate(),
    isActive: faker.datatype.boolean(),
    salary: faker.number.int({ max: 200_000, min: 30_000 }),
  }));

/** Employees with nested `subRows`, for tree / expanding examples. */
export const makeTree = (): Employee[] =>
  makeEmployees(8).map((manager) => ({
    ...manager,
    subRows: makeEmployees(3).map((report) => ({
      ...report,
      subRows: makeEmployees(2),
    })),
  }));

export const people = makePeople(100);
export const employees = makeEmployees(100);

import type { MRT_ColumnDef } from '../src/lib';

export const personColumns: MRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'address', header: 'Address' },
  { accessorKey: 'state', header: 'State' },
  { accessorKey: 'phoneNumber', header: 'Phone Number' },
];

export const employeeColumns: MRT_ColumnDef<Employee>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'gender', header: 'Gender' },
  { accessorKey: 'state', header: 'State' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'salary', header: 'Salary' },
];

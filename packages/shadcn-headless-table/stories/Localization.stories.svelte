<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ShadcnHeadlessTable, type HeadlessColumnDef } from '../src/lib';
  import { type Person, makeData } from './data';

  const { Story } = defineMeta({ title: 'Features/Localization' });

  import { MRT_Localization_ES } from '../src/lib/locales/es';
  import { MRT_Localization_FR } from '../src/lib/locales/fr';

  const columns: HeadlessColumnDef<Person>[] = [
    { accessor: 'firstName', header: 'First Name' },
    { accessor: 'lastName', header: 'Last Name' },
    { accessor: 'email', header: 'Email', width: 260 },
    { accessor: 'state', header: 'State' },
    { accessor: 'age', header: 'Age', width: 100, align: 'end' },
  ];

  const data = makeData(60);
</script>

<Story name="Spanish">
  <ShadcnHeadlessTable {columns} {data} localization={MRT_Localization_ES} />
</Story>

<Story name="French">
  <ShadcnHeadlessTable {columns} {data} localization={MRT_Localization_FR} />
</Story>

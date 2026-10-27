import {
  type MRT_ColumnDef,
  type MRT_RowData,
  type MRT_StatefulTableOptions,
} from '../types';
import { MRT_DefaultDisplayColumn } from '../tableOptions';
import {
  defaultDisplayColumnProps,
  showRowActionsColumn,
  showRowDragColumn,
  showRowExpandColumn,
  showRowNumbersColumn,
  showRowPinningColumn,
  showRowSelectionColumn,
  showRowSpacerColumn,
} from './displayColumn.utils';

/**
 * Display column definitions (`mrt-row-*`).
 *
 * Unlike the React version, these carry configuration only (id, header, size,
 * alignment). The cell and header content of each display column is rendered
 * by the table body and head components, which dispatch on the column id, so a
 * `Cell` or `Header` snippet from `displayColumnDefOptions` still takes
 * precedence.
 */

const getRowPinningColumnDef = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): MRT_ColumnDef<TData> => ({
  grow: false,
  ...defaultDisplayColumnProps({
    header: 'pin',
    id: 'mrt-row-pin',
    size: 60,
    tableOptions,
  }),
});

const getRowDragColumnDef = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): MRT_ColumnDef<TData> => ({
  grow: false,
  ...defaultDisplayColumnProps({
    header: 'move',
    id: 'mrt-row-drag',
    size: 60,
    tableOptions,
  }),
});

const getRowActionsColumnDef = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): MRT_ColumnDef<TData> => ({
  ...defaultDisplayColumnProps({
    header: 'actions',
    id: 'mrt-row-actions',
    size: 70,
    tableOptions,
  }),
});

const getRowExpandColumnDef = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): MRT_ColumnDef<TData> => {
  const {
    defaultColumn,
    detailPanel,
    enableExpandAll,
    groupedColumnMode,
    positionExpandColumn,
  } = tableOptions;

  const alignProps =
    positionExpandColumn === 'last'
      ? ({ style: 'text-align: right' } as const)
      : undefined;

  return {
    tableBodyCellProps: alignProps,
    tableHeadCellProps: alignProps,
    ...defaultDisplayColumnProps({
      header: 'expand',
      id: 'mrt-row-expand',
      size:
        groupedColumnMode === 'remove'
          ? (defaultColumn?.size ?? 180)
          : detailPanel
            ? enableExpandAll
              ? 60
              : 70
            : 100,
      tableOptions,
    }),
  };
};

const getRowSelectColumnDef = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): MRT_ColumnDef<TData> => ({
  grow: false,
  ...defaultDisplayColumnProps({
    header: 'select',
    id: 'mrt-row-select',
    size: tableOptions.enableSelectAll ? 60 : 70,
    tableOptions,
  }),
});

const getRowNumbersColumnDef = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): MRT_ColumnDef<TData> => ({
  grow: false,
  ...defaultDisplayColumnProps({
    header: 'rowNumbers',
    id: 'mrt-row-numbers',
    size: 50,
    tableOptions,
  }),
});

const blankColProps = { style: 'min-width: 0; padding: 0; width: 0' };

const getRowSpacerColumnDef = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): MRT_ColumnDef<TData> => ({
  ...defaultDisplayColumnProps({
    id: 'mrt-row-spacer',
    size: 0,
    tableOptions,
  }),
  grow: true,
  ...MRT_DefaultDisplayColumn,
  tableBodyCellProps: blankColProps,
  tableFooterCellProps: blankColProps,
  tableHeadCellProps: blankColProps,
});

/** The display columns to prepend (leading) and append (trailing) to `columns`. */
export const getDisplayColumnDefs = <TData extends MRT_RowData>(
  tableOptions: MRT_StatefulTableOptions<TData>,
): {
  leading: MRT_ColumnDef<TData>[];
  trailing: MRT_ColumnDef<TData>[];
} => ({
  leading: [
    showRowPinningColumn(tableOptions) && getRowPinningColumnDef(tableOptions),
    showRowDragColumn(tableOptions) && getRowDragColumnDef(tableOptions),
    showRowActionsColumn(tableOptions) && getRowActionsColumnDef(tableOptions),
    showRowExpandColumn(tableOptions) && getRowExpandColumnDef(tableOptions),
    showRowSelectionColumn(tableOptions) && getRowSelectColumnDef(tableOptions),
    showRowNumbersColumn(tableOptions) && getRowNumbersColumnDef(tableOptions),
  ].filter(Boolean) as MRT_ColumnDef<TData>[],
  trailing: [
    showRowSpacerColumn(tableOptions) && getRowSpacerColumnDef(tableOptions),
  ].filter(Boolean) as MRT_ColumnDef<TData>[],
});

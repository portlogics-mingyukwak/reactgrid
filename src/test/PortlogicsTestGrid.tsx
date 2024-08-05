/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import {
  Column,
  Row,
  Id,
  MenuOption,
  SelectionMode,
  DropPosition,
  CellLocation,
  DefaultCellTypes,
  CellChange,
  ReactGridProps,
  TextCell,
  NumberCell,
  HeaderCell,
  ChevronCell,
  Range,
  ReactGridInstance,
} from "../reactgrid";
import { TestConfig } from "./testEnvConfig";
import "../styles.scss";
import { flattenData } from "./flattenData";
import portData from "./data.json";
import { TestGridOptionsSelect } from "./TestGrid";

export type GridRow = Row<DefaultCellTypes>;

interface TestGridProps {
  enableSticky?: boolean;
  enableColumnAndRowSelection?: boolean;
  enableGroupSelection?: boolean;
  enableFrozenFocus?: boolean;
  firstRowType?: TextCell["type"] | HeaderCell["type"]; // 'text' if undefined
  firstColType?: ChevronCell["type"] | HeaderCell["type"]; // 'chevron' if undefined
  cellType?: TextCell["type"] | HeaderCell["type"]; // 'text' if undefined
  config: TestConfig;
  component: React.ComponentClass<ReactGridProps>;
}

export const TestGrid: React.FC<TestGridProps> = (props) => {
  const reactGridRef = React.useRef<ReactGridInstance>(null);
  const { config, component, enableSticky, enableColumnAndRowSelection, enableGroupSelection, enableFrozenFocus } =
    props;

  const [render, setRender] = React.useState(true);

  const { rows: portRows, columns: portColumns } = flattenData(portData);

  const [columns, setColumns] = React.useState(portColumns);

  const [rows, setRows] = React.useState(portRows);

  const handleColumnResize = (columnId: Id, width: number, selectedColIds: Id[]) => {
    setColumns((prevColumns) => {
      const setColumnWidth = (columnIndex: number) => {
        const resizedColumn = prevColumns[columnIndex];
        prevColumns[columnIndex] = { ...resizedColumn, width };
      };

      if (selectedColIds.includes(columnId)) {
        const stateColumnIndexes = prevColumns
          .filter((col) => selectedColIds.includes(col.columnId))
          .map((col) => prevColumns.findIndex((el) => el.columnId === col.columnId));
        stateColumnIndexes.forEach(setColumnWidth);
      } else {
        const columnIndex = prevColumns.findIndex((col) => col.columnId === columnId);
        setColumnWidth(columnIndex);
      }
      return [...prevColumns];
    });
  };

  // eslint-disable-next-line
  const handleChangesTest = (changes: CellChange[]) => {
    changes.forEach((change) => {
      const ax: TextCell["type"] | NumberCell["type"] = Math.random() > 0.5 ? "text" : "number";
      if (change.newCell.type === ax) {
        console.log(change.newCell.type);
      }
      if (change.type === "text") {
        console.log(change.newCell.text);
      }
      if (change.type === "checkbox") {
        console.log(change.previousCell.checked);
      }
    });
  };

  // TODO ReactGrid should be able to handle this function
  // eslint-disable-next-line
  const handleChangesTest2 = (changes: CellChange<TextCell>[]) => {};

  const handleChanges = (changes: CellChange<DefaultCellTypes>[]) => {
    setRows((prevRows) => {
      changes.forEach((change) => {
        const changeRowIdx = prevRows.findIndex((el) => el.rowId === change.rowId);
        const changeColumnIdx = columns.findIndex((el) => el.columnId === change.columnId);
        if (change.type === "text") {
          // console.log(change.newCell.text);
        }
        if (change.type === "checkbox") {
          // console.log(change.previousCell.checked);
        }
        prevRows[changeRowIdx].cells[changeColumnIdx] = change.newCell;
      });
      return [...prevRows];
    });
  };

  const reorderArray = <T extends unknown>(arr: T[], idxs: number[], to: number) => {
    const movedElements: T[] = arr.filter((_: T, idx: number) => idxs.includes(idx));
    to = Math.min(...idxs) < to ? (to += 1) : (to -= idxs.filter((idx) => idx < to).length);
    const leftSide: T[] = arr.filter((_: T, idx: number) => idx < to && !idxs.includes(idx));
    const rightSide: T[] = arr.filter((_: T, idx: number) => idx >= to && !idxs.includes(idx));
    return [...leftSide, ...movedElements, ...rightSide];
  };

  const handleCanReorderColumns = (targetColumnId: Id, columnIds: Id[], dropPosition: DropPosition): boolean => {
    return true;
  };

  const handleCanReorderRows = (targetColumnId: Id, rowIds: Id[], dropPosition: DropPosition): boolean => {
    // const rowIndex = state.rows.findIndex((row: Row) => row.rowId === targetColumnId);
    // if (rowIndex === 0) return false;
    return true;
  };

  const handleColumnsReorder = (targetColumnId: Id, columnIds: Id[], dropPosition: DropPosition) => {
    const to = columns.findIndex((column: Column) => column.columnId === targetColumnId);
    const columnIdxs = columnIds.map((id: Id, idx: number) => columns.findIndex((c: Column) => c.columnId === id));
    setRows(
      rows.map((row) => ({
        ...row,
        cells: reorderArray(row.cells, columnIdxs, to),
      }))
    );
    setColumns(reorderArray(columns, columnIdxs, to));
  };

  const handleRowsReorder = (targetRowId: Id, rowIds: Id[], dropPosition: DropPosition) => {
    setRows((prevRows) => {
      const to = rows.findIndex((row) => row.rowId === targetRowId);
      const columnIdxs = rowIds.map((id) => rows.findIndex((r) => r.rowId === id));
      return reorderArray(prevRows, columnIdxs, to);
    });
  };

  const handleContextMenu = (
    selectedRowIds: Id[],
    selectedColIds: Id[],
    selectionMode: SelectionMode,
    menuOptions: MenuOption[],
    selectedRanges: Array<CellLocation[]>
  ): MenuOption[] => {
    if (selectionMode === "row") {
      menuOptions = [
        ...menuOptions,
        {
          id: "rowOption",
          label: "Custom menu row option",
          handler: (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode) => {},
        },
      ];
    }
    if (selectionMode === "column") {
      menuOptions = [
        ...menuOptions,
        {
          id: "columnOption",
          label: "Custom menu column option",
          handler: (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode) => {},
        },
      ];
    }
    return [
      ...menuOptions,
      {
        id: "all",
        label: "Custom menu option",
        handler: (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode) => {},
      },
    ];
  };

  const handleFocusLocationChanged = (location: CellLocation): void => {};

  const handleFocusLocationChanging = (location: CellLocation): boolean => true;

  const handleSelectionChanged = (range: Range[]): void => {};

  const BANNED_LOCATION = { rowIdx: 5, colIdx: 10 };

  const doesRangeContainLocationByIdx = (range: Range, location: { rowIdx: number; colIdx: number }): boolean => {
    return (
      location.colIdx >= range.first.column.idx &&
      location.colIdx <= range.last.column.idx &&
      location.rowIdx >= range.first.row.idx &&
      location.rowIdx <= range.last.row.idx
    );
  };

  const handleSelectionChanging = (ranges: Range[]): boolean => {
    return true;
    // Returns false if any range contains the banned location
    return !ranges.some((range) => doesRangeContainLocationByIdx(range, BANNED_LOCATION));
  };

  const handleClearSelections = () => {
    if (reactGridRef.current) {
      reactGridRef.current.clearSelections();
    }
  };

  const Component = component;
  return (
    <>
      <div
        className="test-grid-container"
        data-cy="div-scrollable-element"
        style={{
          ...(!config.pinToBody && {
            height: config.fillViewport ? `calc(100vh - 30px)` : config.rgViewportHeight,
            width: config.fillViewport ? `calc(100vw - 45px)` : config.rgViewportWidth,
            margin: config.margin,
            overflow: "auto",
          }),
          position: "relative",
          ...(config.flexRow && {
            display: "flex",
            flexDirection: "row",
          }),
        }}
      >
        <button onClick={handleClearSelections}>Clear Selections</button>
        {render && (
          <Component
            ref={reactGridRef}
            rows={rows}
            columns={columns}
            initialFocusLocation={config.initialFocusLocation}
            focusLocation={enableFrozenFocus ? config.focusLocation : undefined}
            // onCellsChanged={handleChangesTest2} // TODO This handler should be allowed
            onCellsChanged={handleChanges}
            onColumnResized={handleColumnResize}
            highlights={config.highlights}
            stickyLeftColumns={enableSticky ? config.stickyLeft : undefined}
            stickyRightColumns={enableSticky ? config.stickyRight : undefined}
            stickyTopRows={enableSticky ? config.stickyTop : undefined}
            stickyBottomRows={enableSticky ? config.stickyBottom : undefined}
            canReorderColumns={handleCanReorderColumns}
            canReorderRows={handleCanReorderRows}
            onColumnsReordered={handleColumnsReorder}
            onRowsReordered={handleRowsReorder}
            onContextMenu={handleContextMenu}
            onFocusLocationChanged={handleFocusLocationChanged}
            onFocusLocationChanging={handleFocusLocationChanging}
            enableRowSelection={enableColumnAndRowSelection || false}
            enableColumnSelection={enableColumnAndRowSelection || false}
            enableFullWidthHeader={config.enableFullWidthHeader || false}
            enableRangeSelection={config.enableRangeSelection}
            enableFillHandle={config.enableFillHandle}
            enableGroupIdRender={config.enableGroupIdRender}
            enableGroupSelection={enableGroupSelection || false}
            labels={config.labels}
            horizontalStickyBreakpoint={config.horizontalStickyBreakpoint}
            verticalStickyBreakpoint={config.verticalStickyBreakpoint}
            disableVirtualScrolling={config.disableVirtualScrolling}
            onSelectionChanged={handleSelectionChanged}
            onSelectionChanging={handleSelectionChanging}
            moveRightOnEnter={config.moveRightOnEnter}
          />
        )}
      </div>
      <TestGridOptionsSelect></TestGridOptionsSelect>
      <button
        onClick={() => {
          setRender((render) => !render);
        }}
      >
        Mount / Unmount
      </button>
    </>
  );
};

export const withDiv = <T extends Record<string, unknown> & TestGridProps>(
  Component: React.ComponentType<T>
): React.FC<T> => {
  Component.displayName = "WithDivWrapperTestGrid";
  const wrappedComponent = ({ ...props }: TestGridProps) => {
    return (
      <div style={{ ...props.config.withDivComponentStyles }}>
        <Component {...(props as T)} />
      </div>
    );
  };
  return wrappedComponent;
};

export const PortlogicsTestGrid = withDiv(TestGrid);

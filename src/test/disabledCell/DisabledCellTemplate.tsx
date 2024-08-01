import * as React from "react";

import "./disabled-cell-style.css";
import {
  Cell,
  CellTemplate,
  Compatible,
  getCellProperty,
  isAlphaNumericKey,
  isNavigationKey,
  Uncertain,
  UncertainCompatible,
} from "../../core";

export interface DisabledCell extends Cell {
  type: "disabled";
  text: string;
  disabled: boolean;
}

export class DisabledCellTemplate implements CellTemplate<DisabledCell> {
  // TODO: 값이 보이긴 보임(옅게). ✅
  // 직접 edit하지는 못함. ✅
  // 클릭(focus)하면 맨 위 활성화된 row로 focus 이동.
  // 활성화된 row edit하면 아래 값들도 자동으로 변경
  /**
   * Validates and converts `uncertainCell` to compatible cell type
   *
   * @param {Uncertain<TCell>} uncertainCell Cell with all optional fields of its base (`TCell`)
   * @returns {Compatible<TCell>} Compatible cell of its base (`TCell`)
   */
  getCompatibleCell(uncertainCell: Uncertain<DisabledCell>): Compatible<DisabledCell> {
    const text = getCellProperty(uncertainCell, "text", "string");
    const value = parseFloat(text);
    const disabled = getCellProperty(uncertainCell, "disabled", "boolean");
    return {
      ...uncertainCell,
      text,
      value,
      disabled: disabled ?? false,
    };
  }

  /**
   * Handles keydown event on cell template and double click (opening cell in edit mode)
   * Default: cell => { cell, enableEditMode: false }
   *
   * @param {Compatible<TCell>} cell Incoming `Compatible` cell
   * @param {number} keyCode Represents the key pressed on the keyboard, or 1 for a pointer event (double click).
   * @param {boolean} ctrl Is `ctrl` pressed when event is called ()
   * @param {boolean} shift Is `shift` pressed when event is called
   * @param {boolean} alt Is `alt` pressed when event is called
   * @param {string} [key] Represents the value of the key pressed by the user. Optional for backwards compatibility.
   * @param {boolean} capsLock Is caps lock active when event is called. Optional for backwards compatibility.
   * @returns {{ cell: Compatible<TCell>; enableEditMode: boolean }} Cell data and edit mode either affected by the event or not
   */
  handleKeyDown(
    cell: Compatible<DisabledCell>,
    keyCode: number,
    ctrl: boolean,
    shift: boolean,
    alt: boolean
  ): {
    cell: Compatible<DisabledCell>;
    enableEditMode: boolean;
  } {
    return { cell, enableEditMode: false };
  }

  /**
   * Returns `true` if the cell is focusable
   *
   * @param {Compatible<TCell>} cell Current cell as `Compatible` cell
   * @returns {boolean} `true` if cell should be focusable, by default returns `true`
   */
  isFocusable(cell: Compatible<DisabledCell>): boolean {
    return true;
  }

  update(cell: Compatible<DisabledCell>, cellToMerge: UncertainCompatible<DisabledCell>): Compatible<DisabledCell> {
    return this.getCompatibleCell({ ...cell, text: cellToMerge.text });
  }

  /**
   * Renders the cell content
   *
   * @param {Compatible<TCell>} cell Incoming `Compatible` cell
   * @param {boolean} isInEditMode Flag is set to `true`, if cell is rendered in edit mode
   * @param {(cell: Compatible<TCell>, commit: boolean) => void} onCellChanged Callback used for commiting changes on a cell. For example: typing on html `input` element
   * @returns {React.ReactNode} Content of a cell
   */
  render(
    cell: Compatible<DisabledCell>,
    isInEditMode: boolean,
    onCellChanged: (cell: Compatible<DisabledCell>, commit: boolean) => void
  ): React.ReactNode {
    return !isInEditMode ? (
      <div className="rg-disabled-cell">{cell.text}</div>
    ) : (
      <input
        ref={(input) => {
          input && input.focus();
        }}
        defaultValue={cell.text}
        onChange={(e) => onCellChanged(this.getCompatibleCell({ ...cell, text: e.currentTarget.value }), false)}
        onCopy={(e) => e.stopPropagation()}
        onCut={(e) => e.stopPropagation()}
        onPaste={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (isAlphaNumericKey(e.keyCode) || isNavigationKey(e.keyCode)) e.stopPropagation();
        }}
      />
    );
  }
}

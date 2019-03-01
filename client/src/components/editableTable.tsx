import React, { FC, useState, useEffect } from 'react';
import { Toggle } from './Toggle';
import { Autocomplete } from './Autocomplete';

interface IEditableTableProps {
  autoSaveRow: boolean;
  className?: string;
  deleteButton: boolean;
  rowDeleteCallback: (i: number, row: any) => void;
  rowSaveCallback: Function;
  data: any[];
  headers: any[];
}

export const EditableTable: FC<IEditableTableProps> = (props) => {
  const { autoSaveRow, className, data, deleteButton, headers, rowDeleteCallback, rowSaveCallback } = props;
  const [autoCompleteValues, setAutoCompleteValues] = useState({});
  const [tableData, setTableData] = useState(data);
  useEffect(() => {
    let autoCompValues = {};
    headers.forEach(h => {
      if (h.type === 'autocomplete') {
        data.forEach((d, i) => {
          autoCompValues[`${h.name}${i}`] = d[h.name];
        });
      }
    });
    setAutoCompleteValues(autoCompValues);
  }, [headers, data])

  const onChange = (e, i, header) => {
    let editedData = [ ... tableData ];
    editedData[i][header.name] = e.target.value;
    if (header.type === 'number') {
      editedData[i][header.name] = parseInt(editedData[i][header.name]);
    }
    setTableData(editedData);
    if (autoSaveRow) {
      rowSaveCallback(editedData[i], i, editedData);
    }
  };

  const autocompleteChanged = (item, i, header) => {
    let autoCompValues = { ...autoCompleteValues };
    let editedData = [ ...tableData ];
    let key = `${header.name}${i}`;
    autoCompValues[key] = item.val;
    editedData[i][header.name] = item.val;
    setAutoCompleteValues(autoCompValues);
    setTableData(editedData);
    if (autoSaveRow) {
      rowSaveCallback(editedData[i], i, editedData);
    }
  };

  const focus = (e) => {
    e.target.select();
  };

  const toggled = (field, i) => {
    let editedData = [ ...tableData ];
    editedData[i][field] = !editedData[i][field];
    setTableData(editedData);
    if (autoSaveRow) {
      rowSaveCallback(editedData[i], i, editedData);
    }
  };

  const deleteRow = (i) => {
    let editedData = [ ...data ];
    let deletedRow = editedData.splice(i, 1)[0];
    setTableData(editedData);
    if (rowDeleteCallback) {
      rowDeleteCallback(i, deletedRow);
    }
  };

  let headerRowCells = headers.map(header => {
    return <th key={header.title} className="title-case">{header.title ? header.title : header.name}</th>;
  });

  if (deleteButton) {
    headerRowCells.push(<th></th>);
  }

  let rows = data.map((d, i) => {
    let cells = headers.map(header => {
      if (header.type === 'select') {
        return (
          <td key={header.title + 'td' + i} className="align-center">
            <select onChange={(e) => onChange(e, i, header)}>
              {
                header.options.map(opt => {
                  return <option key={opt} value={opt} selected={opt === d[header.name]}>{opt}</option>
                })
              }
            </select>
          </td>
        )
      }

      if (header.type === 'boolean') {
        return <td className="flex-center"><Toggle id={`${header.name}-${i}`} toggled={(e) => toggled(e, i)} onOff={d[header.name]} property={header.name} /></td>
      }
      else if (header.type === 'autocomplete') {
        return (
          <td>
            <Autocomplete
              value={d[header.name]}
              options={header.items}
              onSelect={(item) => autocompleteChanged(item, i, header)}
              renderItems={header.render}
            />
          </td>
        )
      }

      return <td><input onFocus={focus} value={d[header.name]} type={header.type} onChange={(e) => onChange(e, i, header)} /></td>
    });

    if (deleteButton) {
      cells.push(<td><button className="delete-btn" onClick={() => deleteRow(i)}>&times;</button></td>);
    }
    return <tr>{cells}</tr>;
  });

  return (
    <table className={`editable-table ${className ? className : ''}`}>
      <thead>
        <tr>
          {headerRowCells}
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
};
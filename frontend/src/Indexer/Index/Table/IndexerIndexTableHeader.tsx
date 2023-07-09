import classNames from 'classnames';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import IconButton from 'Components/Link/IconButton';
import Column from 'Components/Table/Column';
import TableOptionsModalWrapper from 'Components/Table/TableOptions/TableOptionsModalWrapper';
import VirtualTableHeader from 'Components/Table/VirtualTableHeader';
import VirtualTableHeaderCell from 'Components/Table/VirtualTableHeaderCell';
import { icons } from 'Helpers/Props';
import SortDirection from 'Helpers/Props/SortDirection';
import {
  setIndexerSort,
  setIndexerTableOption,
} from 'Store/Actions/indexerIndexActions';
import IndexerIndexTableOptions from './IndexerIndexTableOptions';
import styles from './IndexerIndexTableHeader.css';

interface IndexerIndexTableHeaderProps {
  showBanners: boolean;
  columns: Column[];
  sortKey?: string;
  sortDirection?: SortDirection;
}

function IndexerIndexTableHeader(props: IndexerIndexTableHeaderProps) {
  const { columns, sortKey, sortDirection } = props;
  const dispatch = useDispatch();

  const onSortPress = useCallback(
    (value) => {
      dispatch(setIndexerSort({ sortKey: value }));
    },
    [dispatch]
  );

  const onTableOptionChange = useCallback(
    (payload) => {
      dispatch(setIndexerTableOption(payload));
    },
    [dispatch]
  );

  return (
    <VirtualTableHeader>
      {columns.map((column) => {
        const { name, label, isSortable, isVisible } = column;

        if (!isVisible) {
          return null;
        }

        if (name === 'actions') {
          return (
            <VirtualTableHeaderCell
              key={name}
              className={styles[name]}
              name={name}
              isSortable={false}
            >
              <TableOptionsModalWrapper
                columns={columns}
                optionsComponent={IndexerIndexTableOptions}
                onTableOptionChange={onTableOptionChange}
              >
                <IconButton name={icons.ADVANCED_SETTINGS} />
              </TableOptionsModalWrapper>
            </VirtualTableHeaderCell>
          );
        }

        return (
          <VirtualTableHeaderCell
            key={name}
            className={classNames(styles[name])}
            name={name}
            sortKey={sortKey}
            sortDirection={sortDirection}
            isSortable={isSortable}
            onSortPress={onSortPress}
          >
            {label}
          </VirtualTableHeaderCell>
        );
      })}
    </VirtualTableHeader>
  );
}

export default IndexerIndexTableHeader;

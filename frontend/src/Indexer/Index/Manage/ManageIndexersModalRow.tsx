import React, { useCallback } from 'react';
import Label from 'Components/Label';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableSelectCell from 'Components/Table/Cells/TableSelectCell';
import Column from 'Components/Table/Column';
import TableRow from 'Components/Table/TableRow';
import TagListConnector from 'Components/TagListConnector';
import { Field } from 'typings/Indexer';
import { SelectStateInputProps } from 'typings/props';
import translate from 'Utilities/String/translate';
import { kinds } from '../../../Helpers/Props';
import { DISABLED } from '../../../Helpers/Props/kinds';
import styles from './ManageIndexersModalRow.css';

interface ManageIndexersModalRowProps {
  id: number;
  name: string;
  enable: boolean;
  priority: number;
  fields: Field[];
  implementation: string;
  tags: number[];
  columns: Column[];
  isSelected?: boolean;
  onSelectedChange(result: SelectStateInputProps): void;
}

function ManageIndexersModalRow(props: ManageIndexersModalRowProps) {
  const {
    id,
    isSelected,
    name,
    enable,
    priority,
    fields,
    implementation,
    tags,
    onSelectedChange,
  } = props;

  const minimumSeeders =
    fields.find(
      (field) => field.name === 'torrentBaseSettings.appMinimumSeeders'
    )?.value ?? undefined;

  const seedRatio =
    fields.find((field) => field.name === 'torrentBaseSettings.seedRatio')
      ?.value ?? undefined;

  const seedTime =
    fields.find((field) => field.name === 'torrentBaseSettings.seedTime')
      ?.value ?? undefined;

  const packSeedTime =
    fields.find((field) => field.name === 'torrentBaseSettings.packSeedTime')
      ?.value ?? undefined;

  const onSelectedChangeWrapper = useCallback(
    (result: SelectStateInputProps) => {
      onSelectedChange({
        ...result,
      });
    },
    [onSelectedChange]
  );

  return (
    <TableRow>
      <TableSelectCell
        id={id}
        isSelected={isSelected}
        onSelectedChange={onSelectedChangeWrapper}
      />

      <TableRowCell className={styles.name}>{name}</TableRowCell>

      <TableRowCell className={styles.implementation}>
        {implementation}
      </TableRowCell>

      <TableRowCell className={styles.enabled}>
        <Label kind={enable ? kinds.SUCCESS : kinds.DISABLED}>
          {enable ? translate('Yes') : translate('No')}
        </Label>
      </TableRowCell>

      <TableRowCell className={styles.priority}>{priority}</TableRowCell>

      <TableRowCell className={styles.minimumSeeders}>
        {minimumSeeders}
      </TableRowCell>

      <TableRowCell className={styles.seedRatio}>{seedRatio}</TableRowCell>

      <TableRowCell className={styles.seedTime}>{seedTime}</TableRowCell>

      <TableRowCell className={styles.packSeedTime}>
        {packSeedTime}
      </TableRowCell>

      <TableRowCell className={styles.tags}>
        <TagListConnector tags={tags} />
      </TableRowCell>
    </TableRow>
  );
}

export default ManageIndexersModalRow;

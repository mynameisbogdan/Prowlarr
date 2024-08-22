import React from 'react';
import Icon from 'Components/Icon';
import VirtualTableRowCell from 'Components/Table/Cells/TableRowCell';
import Popover from 'Components/Tooltip/Popover';
import { icons, kinds, tooltipPositions } from 'Helpers/Props';
import { IndexerStatus } from 'Indexer/Indexer';
import translate from 'Utilities/String/translate';
import DisabledIndexerInfo from './DisabledIndexerInfo';
import styles from './IndexerStatusCell.css';

function getIconKind(enabled: boolean, redirect: boolean, isObsolete: boolean) {
  if (isObsolete) {
    return kinds.WARNING;
  }

  if (enabled) {
    return redirect ? kinds.INFO : kinds.SUCCESS;
  }

  return kinds.DEFAULT;
}

function getIconName(enabled: boolean, redirect: boolean, isObsolete: boolean) {
  if (isObsolete) {
    return icons.WARNING;
  }

  if (enabled) {
    return redirect ? icons.REDIRECT : icons.CHECK;
  }

  return icons.BLOCKLIST;
}

function getIconTooltip(
  enabled: boolean,
  redirect: boolean,
  isObsolete: boolean
) {
  if (isObsolete) {
    return translate('Deprecated');
  }

  if (enabled) {
    return redirect ? translate('EnabledRedirected') : translate('Enabled');
  }

  return translate('Disabled');
}

interface IndexerStatusCellProps {
  className: string;
  enabled: boolean;
  redirect: boolean;
  status?: IndexerStatus;
  isObsolete?: boolean;
  longDateFormat: string;
  timeFormat: string;
  component?: React.ElementType;
}

function IndexerStatusCell(props: IndexerStatusCellProps) {
  const {
    className,
    enabled,
    redirect,
    status,
    isObsolete = false,
    longDateFormat,
    timeFormat,
    component: Component = VirtualTableRowCell,
    ...otherProps
  } = props;

  return (
    <Component className={className} {...otherProps}>
      <Icon
        className={styles.statusIcon}
        kind={getIconKind(enabled, redirect, isObsolete)}
        name={getIconName(enabled, redirect, isObsolete)}
        title={getIconTooltip(enabled, redirect, isObsolete)}
      />
      {status ? (
        <Popover
          className={styles.indexerStatusTooltip}
          canFlip={true}
          anchor={
            <Icon
              className={styles.statusIcon}
              kind={kinds.DANGER}
              name={icons.WARNING}
            />
          }
          title={translate('IndexerDisabled')}
          body={
            <div>
              <DisabledIndexerInfo
                mostRecentFailure={status.mostRecentFailure}
                initialFailure={status.initialFailure}
                disabledTill={status.disabledTill}
                longDateFormat={longDateFormat}
                timeFormat={timeFormat}
              />
            </div>
          }
          position={tooltipPositions.BOTTOM}
        />
      ) : null}
    </Component>
  );
}

export default IndexerStatusCell;

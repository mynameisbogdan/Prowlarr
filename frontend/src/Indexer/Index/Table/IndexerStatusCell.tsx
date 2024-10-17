import React from 'react';
import Alert from 'Components/Alert';
import Icon from 'Components/Icon';
import VirtualTableRowCell from 'Components/Table/Cells/TableRowCell';
import Popover from 'Components/Tooltip/Popover';
import { icons, kinds, tooltipPositions } from 'Helpers/Props';
import { IndexerStatus } from 'Indexer/Indexer';
import ProviderMessage from 'typings/ProviderMessage';
import translate from 'Utilities/String/translate';
import DisabledIndexerInfo from './DisabledIndexerInfo';
import styles from './IndexerStatusCell.css';

function getIconKind(enabled: boolean, redirect: boolean) {
  if (enabled) {
    return redirect ? kinds.INFO : kinds.SUCCESS;
  }

  return kinds.DEFAULT;
}

function getIconName(enabled: boolean, redirect: boolean) {
  if (enabled) {
    return redirect ? icons.REDIRECT : icons.CHECK;
  }

  return icons.BLOCKLIST;
}

function getIconTooltip(enabled: boolean, redirect: boolean) {
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
  message?: ProviderMessage;
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
    message,
    longDateFormat,
    timeFormat,
    component: Component = VirtualTableRowCell,
    ...otherProps
  } = props;

  return (
    <Component className={className} {...otherProps}>
      <Icon
        className={styles.statusIcon}
        kind={getIconKind(enabled, redirect)}
        name={getIconName(enabled, redirect)}
        title={getIconTooltip(enabled, redirect)}
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
            <DisabledIndexerInfo
              mostRecentFailure={status.mostRecentFailure}
              initialFailure={status.initialFailure}
              disabledTill={status.disabledTill}
              longDateFormat={longDateFormat}
              timeFormat={timeFormat}
            />
          }
          position={tooltipPositions.BOTTOM}
        />
      ) : null}

      {message ? (
        <Popover
          anchor={
            <Icon
              className={styles.statusIcon}
              kind={kinds.WARNING}
              name={icons.MESSAGE}
            />
          }
          title={translate('Message')}
          body={<Alert kind={message.type}>{message.message}</Alert>}
          position={tooltipPositions.BOTTOM}
        />
      ) : null}
    </Component>
  );
}

export default IndexerStatusCell;

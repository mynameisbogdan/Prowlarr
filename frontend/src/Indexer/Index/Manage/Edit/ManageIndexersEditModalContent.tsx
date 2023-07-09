import React, { useCallback, useState } from 'react';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { inputTypes } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import styles from './ManageIndexersEditModalContent.css';

interface SavePayload {
  enable?: boolean;
  priority?: number;
  minimumSeeders?: number;
  seedRatio?: number;
  seedTime?: number;
  packSeedTime?: number;
}

interface ManageIndexersEditModalContentProps {
  indexerIds: number[];
  onSavePress(payload: object): void;
  onModalClose(): void;
}

const NO_CHANGE = 'noChange';

const enableOptions = [
  { key: NO_CHANGE, value: translate('NoChange'), disabled: true },
  { key: 'enabled', value: translate('Enabled') },
  { key: 'disabled', value: translate('Disabled') },
];

function ManageIndexersEditModalContent(
  props: ManageIndexersEditModalContentProps
) {
  const { indexerIds, onSavePress, onModalClose } = props;

  const [enable, setEnable] = useState(NO_CHANGE);
  const [priority, setPriority] = useState<null | string | number>(null);
  const [minimumSeeders, setMinimumSeeders] = useState<null | string | number>(
    null
  );
  const [seedRatio, setSeedRatio] = useState<null | string | number>(null);
  const [seedTime, setSeedTime] = useState<null | string | number>(null);
  const [packSeedTime, setPackSeedTime] = useState<null | string | number>(
    null
  );

  const save = useCallback(() => {
    let hasChanges = false;
    const payload: SavePayload = {};

    if (enable !== NO_CHANGE) {
      hasChanges = true;
      payload.enable = enable === 'enabled';
    }

    if (priority !== null) {
      hasChanges = true;
      payload.priority = priority as number;
    }

    if (minimumSeeders !== null) {
      hasChanges = true;
      payload.minimumSeeders = minimumSeeders as number;
    }

    if (seedRatio !== null) {
      hasChanges = true;
      payload.seedRatio = seedRatio as number;
    }

    if (seedTime !== null) {
      hasChanges = true;
      payload.seedTime = seedTime as number;
    }

    if (packSeedTime !== null) {
      hasChanges = true;
      payload.packSeedTime = packSeedTime as number;
    }

    if (hasChanges) {
      onSavePress(payload);
    }

    onModalClose();
  }, [
    enable,
    priority,
    minimumSeeders,
    seedRatio,
    seedTime,
    packSeedTime,
    onSavePress,
    onModalClose,
  ]);

  const onInputChange = useCallback(
    ({ name, value }: { name: string; value: string }) => {
      switch (name) {
        case 'enable':
          setEnable(value);
          break;
        case 'priority':
          setPriority(value);
          break;
        case 'minimumSeeders':
          setMinimumSeeders(value);
          break;
        case 'seedRatio':
          setSeedRatio(value);
          break;
        case 'seedTime':
          setSeedTime(value);
          break;
        case 'packSeedTime':
          setPackSeedTime(value);
          break;
        default:
          console.warn(`EditIndexersModalContent Unknown Input: '${name}'`);
      }
    },
    []
  );

  const selectedCount = indexerIds.length;

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>{translate('EditSelectedIndexers')}</ModalHeader>

      <ModalBody>
        <FormGroup>
          <FormLabel>{translate('Enable')}</FormLabel>

          <FormInputGroup
            type={inputTypes.SELECT}
            name="enable"
            value={enable}
            values={enableOptions}
            onChange={onInputChange}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>{translate('Priority')}</FormLabel>

          <FormInputGroup
            type={inputTypes.NUMBER}
            name="priority"
            value={priority}
            min={1}
            max={50}
            onChange={onInputChange}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>{translate('MinimumSeeders')}</FormLabel>

          <FormInputGroup
            type={inputTypes.NUMBER}
            name="minimumSeeders"
            value={minimumSeeders}
            onChange={onInputChange}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>{translate('SeedRatio')}</FormLabel>

          <FormInputGroup
            type={inputTypes.NUMBER}
            name="seedRatio"
            value={seedRatio}
            onChange={onInputChange}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>{translate('SeedTime')}</FormLabel>

          <FormInputGroup
            type={inputTypes.NUMBER}
            name="seedTime"
            value={seedTime}
            onChange={onInputChange}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>{translate('PackSeedTime')}</FormLabel>

          <FormInputGroup
            type={inputTypes.NUMBER}
            name="packSeedTime"
            value={packSeedTime}
            onChange={onInputChange}
          />
        </FormGroup>
      </ModalBody>

      <ModalFooter className={styles.modalFooter}>
        <div className={styles.selected}>
          {translate('CountIndexersSelected', [selectedCount])}
        </div>

        <div>
          <Button onPress={onModalClose}>{translate('Cancel')}</Button>

          <Button onPress={save}>{translate('ApplyChanges')}</Button>
        </div>
      </ModalFooter>
    </ModalContent>
  );
}

export default ManageIndexersEditModalContent;

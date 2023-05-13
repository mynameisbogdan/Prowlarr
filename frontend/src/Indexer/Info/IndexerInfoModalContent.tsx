import { uniqBy } from 'lodash-es';
import React, { useCallback, useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import Alert from 'Components/Alert';
import DescriptionList from 'Components/DescriptionList/DescriptionList';
import DescriptionListItem from 'Components/DescriptionList/DescriptionListItem';
import DescriptionListItemDescription from 'Components/DescriptionList/DescriptionListItemDescription';
import DescriptionListItemTitle from 'Components/DescriptionList/DescriptionListItemTitle';
import FieldSet from 'Components/FieldSet';
import Label from 'Components/Label';
import Button from 'Components/Link/Button';
import Link from 'Components/Link/Link';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import TableRow from 'Components/Table/TableRow';
import TagListConnector from 'Components/TagListConnector';
import { kinds } from 'Helpers/Props';
import DeleteIndexerModal from 'Indexer/Delete/DeleteIndexerModal';
import EditIndexerModalConnector from 'Indexer/Edit/EditIndexerModalConnector';
import PrivacyLabel from 'Indexer/Index/Table/PrivacyLabel';
import Indexer, { IndexerCapabilities } from 'Indexer/Indexer';
import useIndexer from 'Indexer/useIndexer';
import translate from 'Utilities/String/translate';
import IndexerHistory from './History/IndexerHistory';
import styles from './IndexerInfoModalContent.css';

const TABS = ['details', 'categories', 'history', 'stats'];

interface IndexerInfoModalContentProps {
  indexerId: number;
  onModalClose(): void;
  onCloneIndexerPress(id: number): void;
}

function IndexerInfoModalContent(props: IndexerInfoModalContentProps) {
  const { indexerId, onModalClose, onCloneIndexerPress } = props;

  const {
    id,
    name,
    description,
    encoding,
    language,
    indexerUrls,
    fields,
    tags,
    protocol,
    privacy,
    capabilities = {} as IndexerCapabilities,
  } = useIndexer(indexerId) as Indexer;

  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  const [isEditIndexerModalOpen, setIsEditIndexerModalOpen] = useState(false);
  const [isDeleteIndexerModalOpen, setIsDeleteIndexerModalOpen] =
    useState(false);

  const handleTabSelect = useCallback(
    (selectedIndex: number) => {
      const selectedTab = TABS[selectedIndex];
      setSelectedTab(selectedTab);
    },
    [setSelectedTab]
  );

  const handleEditIndexerPress = useCallback(() => {
    setIsEditIndexerModalOpen(true);
  }, [setIsEditIndexerModalOpen]);

  const handleEditIndexerModalClose = useCallback(() => {
    setIsEditIndexerModalOpen(false);
  }, [setIsEditIndexerModalOpen]);

  const handleDeleteIndexerPress = useCallback(() => {
    setIsEditIndexerModalOpen(false);
    setIsDeleteIndexerModalOpen(true);
  }, [setIsDeleteIndexerModalOpen]);

  const handleDeleteIndexerModalClose = useCallback(() => {
    setIsDeleteIndexerModalOpen(false);
    onModalClose();
  }, [setIsDeleteIndexerModalOpen, onModalClose]);

  const handleCloneIndexerPressWrapper = useCallback(() => {
    onCloneIndexerPress(id);
    onModalClose();
  }, [id, onCloneIndexerPress, onModalClose]);

  const baseUrl =
    fields.find((field) => field.name === 'baseUrl')?.value ??
    (Array.isArray(indexerUrls) ? indexerUrls[0] : undefined);

  const indexerUrl = baseUrl?.replace(/(:\/\/)api\./, '$1');

  const vipExpiration =
    fields.find((field) => field.name === 'vipExpiration')?.value ?? undefined;

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>{`${name}`}</ModalHeader>

      <ModalBody>
        <Tabs
          className={styles.tabs}
          selectedIndex={TABS.indexOf(selectedTab)}
          onSelect={handleTabSelect}
        >
          <TabList className={styles.tabList}>
            <Tab className={styles.tab} selectedClassName={styles.selectedTab}>
              {translate('Details')}
            </Tab>

            <Tab className={styles.tab} selectedClassName={styles.selectedTab}>
              {translate('Categories')}
            </Tab>

            <Tab className={styles.tab} selectedClassName={styles.selectedTab}>
              {translate('History')}
            </Tab>
          </TabList>
          <TabPanel>
            <div className={styles.tabContent}>
              <FieldSet legend={translate('IndexerDetails')}>
                <div>
                  <DescriptionList>
                    <DescriptionListItem
                      descriptionClassName={styles.description}
                      title={translate('Id')}
                      data={id}
                    />
                    <DescriptionListItem
                      descriptionClassName={styles.description}
                      title={translate('Description')}
                      data={description ? description : '-'}
                    />
                    <DescriptionListItem
                      descriptionClassName={styles.description}
                      title={translate('Encoding')}
                      data={encoding ? encoding : '-'}
                    />
                    <DescriptionListItem
                      descriptionClassName={styles.description}
                      title={translate('Language')}
                      data={language ?? '-'}
                    />
                    <DescriptionListItem
                      descriptionClassName={styles.description}
                      title={translate('Privacy')}
                      data={privacy ? <PrivacyLabel privacy={privacy} /> : '-'}
                    />
                    {vipExpiration ? (
                      <DescriptionListItem
                        descriptionClassName={styles.description}
                        title={translate('VipExpiration')}
                        data={vipExpiration}
                      />
                    ) : null}
                    <DescriptionListItemTitle>
                      {translate('IndexerSite')}
                    </DescriptionListItemTitle>
                    <DescriptionListItemDescription>
                      {indexerUrl ? (
                        <Link to={indexerUrl}>{indexerUrl}</Link>
                      ) : (
                        '-'
                      )}
                    </DescriptionListItemDescription>
                    <DescriptionListItemTitle>
                      {protocol === 'usenet'
                        ? translate('NewznabUrl')
                        : translate('TorznabUrl')}
                    </DescriptionListItemTitle>
                    <DescriptionListItemDescription>
                      {`${window.location.origin}${window.Prowlarr.urlBase}/${id}/api`}
                    </DescriptionListItemDescription>
                    {tags.length > 0 ? (
                      <>
                        <DescriptionListItemTitle>
                          {translate('Tags')}
                        </DescriptionListItemTitle>
                        <DescriptionListItemDescription>
                          <TagListConnector tags={tags} />
                        </DescriptionListItemDescription>
                      </>
                    ) : null}
                  </DescriptionList>
                </div>
              </FieldSet>

              <FieldSet legend={translate('SearchCapabilities')}>
                <div>
                  <DescriptionList>
                    <DescriptionListItem
                      descriptionClassName={styles.description}
                      title={translate('RawSearchSupported')}
                      data={
                        capabilities?.supportsRawSearch
                          ? translate('Yes')
                          : translate('No')
                      }
                    />
                    <DescriptionListItem
                      descriptionClassName={styles.description}
                      title={translate('SearchTypes')}
                      data={
                        capabilities?.searchParams?.length > 0 ? (
                          <Label kind={kinds.PRIMARY}>
                            {capabilities.searchParams[0]}
                          </Label>
                        ) : (
                          translate('NotSupported')
                        )
                      }
                    />
                    <DescriptionListItem
                      descriptionClassName={styles.description}
                      title={translate('TVSearchTypes')}
                      data={
                        capabilities?.tvSearchParams?.length > 0
                          ? capabilities.tvSearchParams.map((p) => {
                              return (
                                <Label key={p} kind={kinds.PRIMARY}>
                                  {p}
                                </Label>
                              );
                            })
                          : translate('NotSupported')
                      }
                    />
                    <DescriptionListItem
                      descriptionClassName={styles.description}
                      title={translate('MovieSearchTypes')}
                      data={
                        capabilities?.movieSearchParams?.length > 0
                          ? capabilities.movieSearchParams.map((p) => {
                              return (
                                <Label key={p} kind={kinds.PRIMARY}>
                                  {p}
                                </Label>
                              );
                            })
                          : translate('NotSupported')
                      }
                    />
                    <DescriptionListItem
                      descriptionClassName={styles.description}
                      title={translate('BookSearchTypes')}
                      data={
                        capabilities?.bookSearchParams?.length > 0
                          ? capabilities.bookSearchParams.map((p) => {
                              return (
                                <Label key={p} kind={kinds.PRIMARY}>
                                  {p}
                                </Label>
                              );
                            })
                          : translate('NotSupported')
                      }
                    />
                    <DescriptionListItem
                      descriptionClassName={styles.description}
                      title={translate('MusicSearchTypes')}
                      data={
                        capabilities?.musicSearchParams?.length > 0
                          ? capabilities.musicSearchParams.map((p) => {
                              return (
                                <Label key={p} kind={kinds.PRIMARY}>
                                  {p}
                                </Label>
                              );
                            })
                          : translate('NotSupported')
                      }
                    />
                  </DescriptionList>
                </div>
              </FieldSet>
            </div>
          </TabPanel>
          <TabPanel>
            <div className={styles.tabContent}>
              {capabilities?.categories?.length > 0 ? (
                <FieldSet legend={translate('IndexerCategories')}>
                  <Table
                    columns={[
                      {
                        name: 'id',
                        label: translate('Id'),
                        isVisible: true,
                      },
                      {
                        name: 'name',
                        label: translate('Name'),
                        isVisible: true,
                      },
                    ]}
                  >
                    {uniqBy(capabilities.categories, 'id')
                      .sort((a, b) => a.id - b.id)
                      .map((category) => {
                        return (
                          <TableBody key={category.id}>
                            <TableRow key={category.id}>
                              <TableRowCell>{category.id}</TableRowCell>
                              <TableRowCell>{category.name}</TableRowCell>
                            </TableRow>
                            {category?.subCategories?.length > 0
                              ? uniqBy(category.subCategories, 'id')
                                  .sort((a, b) => a.id - b.id)
                                  .map((subCategory) => {
                                    return (
                                      <TableRow key={subCategory.id}>
                                        <TableRowCell>
                                          {subCategory.id}
                                        </TableRowCell>
                                        <TableRowCell>
                                          {subCategory.name}
                                        </TableRowCell>
                                      </TableRow>
                                    );
                                  })
                              : null}
                          </TableBody>
                        );
                      })}
                  </Table>
                </FieldSet>
              ) : (
                <Alert kind={kinds.INFO}>
                  {translate('NoIndexerCategories')}
                </Alert>
              )}
            </div>
          </TabPanel>
          <TabPanel>
            <div className={styles.tabContent}>
              <IndexerHistory indexerId={id} />
            </div>
          </TabPanel>
        </Tabs>
      </ModalBody>
      <ModalFooter className={styles.modalFooter}>
        <div>
          <Button
            className={styles.deleteButton}
            kind={kinds.DANGER}
            onPress={handleDeleteIndexerPress}
          >
            {translate('Delete')}
          </Button>
          <Button onPress={handleCloneIndexerPressWrapper}>
            {translate('Clone')}
          </Button>
        </div>
        <div>
          <Button onPress={handleEditIndexerPress}>{translate('Edit')}</Button>
          <Button onPress={onModalClose}>{translate('Close')}</Button>
        </div>
      </ModalFooter>

      <EditIndexerModalConnector
        isOpen={isEditIndexerModalOpen}
        id={id}
        onModalClose={handleEditIndexerModalClose}
        onDeleteIndexerPress={handleDeleteIndexerPress}
      />

      <DeleteIndexerModal
        isOpen={isDeleteIndexerModalOpen}
        indexerId={id}
        onModalClose={handleDeleteIndexerModalClose}
      />
    </ModalContent>
  );
}

export default IndexerInfoModalContent;

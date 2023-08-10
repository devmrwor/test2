import withLayout from '@/hocs/withLayout';
import withRole from '@/hocs/withRole';
import { Roles } from '../../../common/enums/roles';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Pagination, Table, TableBody, TableCell, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../common/constants/categoriesPagination';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { BurgerButton } from '@/components/Buttons/BurgerButton';
import { ExportData } from '../../../common/enums/import-export-routes';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ApiRoutes, Routes, UserRoutes } from '../../../common/enums/api-routes';
import { ImportDialog } from '@/components/modals/ImportDialog/ImportDialog';
import { formatDate } from '@/utils/dateFormatter';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useQuery } from 'react-query';
import { IPaginationResponse } from '../../../common/types/pagination-response';
import { IProfile } from '../../../common/types/profile';
import { getProfiles } from '@/services/profiles';
import { CustomerTypes } from '../../../common/enums/customer-type';
import { DownloadIcon, UploadIcon } from '@/components/Icons/Icons';
import { useLayout } from '@/contexts/layoutContext';
import { uniteApiRoutes, uniteRoutes } from '@/utils/uniteRoute';
import { useS3Upload } from 'next-s3-upload';
import { IExportData } from '../../../common/types/exportData';
import { syncDb } from '@lib/sync';
import { deleteExportData, getExportData } from '@/services/export';
import classNames from 'classnames';
import { CustomCheckbox } from '@/components/Checkbox/Checkbox';
import { CustomTableRow } from '@/components/primitives/TableRow/TableRow';
import { useTable } from '@/hooks/useTable';
import { useTableHeadData } from '@/hooks/useTableHeadData';
import { useTableHead } from '@/hooks/useTableHead';
import { BaseButton } from '@/components/Buttons/BaseButton';

export const ImportExportPage = () => {
  const { t } = useTranslation();

  const { uploadToS3 } = useS3Upload();
  const router = useRouter();
  const query = router.query;

  const { setBreadcrumbs, addNotification } = useLayout();
  const [page, setPage] = useState(query.page ? parseInt(query.page as string) : DEFAULT_PAGE);
  const [filter, setFilter] = useState<ExportData>((query.filter as ExportData) || ExportData.EXPORT);
  const [isOpenImportDialog, setIsOpenImportDialog] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      { route: uniteRoutes([Routes.ROOT]), name: t('home') },
      { route: '', name: t('import-export') },
    ]);
  }, []);

  const handleFilterChange = (newFilter: ExportData) => {
    setFilter(newFilter);
    setPage(DEFAULT_PAGE);
    router.push({
      pathname: router.pathname,
      query: { ...query, filter: newFilter, page: DEFAULT_PAGE },
    });
  };

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
    router.push({
      pathname: router.pathname,
      query: { ...query, limit: DEFAULT_LIMIT, page: newPage },
    });
  };

  const openImportDialog = () => {
    setIsOpenImportDialog(true);
  };

  const deleteExportDataHandler = async (selectedRow: number, showNotification = true) => {
    if (!selectedRow) return;
    await deleteExportData(selectedRow);
    refetchExportData();
    addNotification({
      type: 'success',
      text: t('export_data_deleted'),
    });
  };

  const deleteMultipleExportDataHandler = async (selectedRows: number[]) => {
    if (!selectedRows) return;
    await Promise.all(selectedRows.map((row) => deleteExportData(row)));
    refetchExportData();
    addNotification({
      type: 'success',
      text: t('export_data_deleted'),
    });
  };

  const exportToXLS = async () => {
    if (!profiles) return;
    const data = profiles?.rows.map((profile) => {
      const messengers = (
        typeof profile.messengers == 'string' ? JSON.parse(profile.messengers) : profile.messengers || []
      ).reduce((acc, el) => ((acc[el.messenger.name] = el.nicknameOrNumber), acc), {});
      const languages = (typeof profile.languages == 'string' ? JSON.parse(profile.languages) : profile.languages || [])
        .map((el) => el.name)
        .join(',');
      const tags = profile.tags?.join(',') || [];
      return {
        id: profile.id,
        user_id: profile.user_id,
        type: profile.type,
        name: profile.name,
        company_name: profile.company_name,
        address: profile.address,
        phone_numbers: profile.phone_numbers,
        ...messengers,
        email: profile.email,
        description: profile.description,
        languages,
        tags,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Profiles');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

    const s2ab = (s: string) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    };
    const filename = 'profiles_export.xlsx';
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    saveAs(blob, filename);

    const file = new File([blob], filename, { type: 'application/octet-stream' });

    const { url } = await uploadToS3(file);

    const exportDataBody: IExportData = {
      link: url,
      file_name: file.name,
      type: ExportData.EXPORT,
      is_successful: true,
      count_of_rows: data.length,
    };

    const exportDataResponse = await fetch(uniteApiRoutes([ApiRoutes.EXPORT_DATA]), {
      method: 'POST',
      body: JSON.stringify(exportDataBody),
    });

    if (!exportDataResponse.ok) {
      console.log(exportDataResponse);
      throw new Error('Error creating exportData');
    }
    refetchExportData();
  };

  const useQueryCallback = () => getProfiles(page, 0, UserRoutes.EXECUTORS, CustomerTypes.ALL, '');

  const { data: profiles, error } = useQuery<IPaginationResponse<IProfile>>(
    ['profiles', page, DEFAULT_LIMIT],
    useQueryCallback
  );

  const { tableHeadData, sortField, sortOrder } = useTableHeadData({
    columns: [
      'id',
      'files',
      'category',
      filter === ExportData.IMPORT ? 'count' : undefined,
      filter === ExportData.IMPORT ? 'status' : undefined,
      'date',
      'time',
    ],
    setPage,
  });

  const getExportDataQuery = () => getExportData(page, DEFAULT_LIMIT, filter, sortOrder, sortField);

  const {
    data: exportData,
    error: exportDataError,
    isLoading,
    refetch: refetchExportData,
  } = useQuery<IPaginationResponse<IProfile>>(
    ['exportData', page, DEFAULT_LIMIT, filter, sortField, sortOrder],
    getExportDataQuery
  );

  const onCloseHandler = () => {
    setIsOpenImportDialog(false);
    refetchExportData();
  };

  function downloadFileOnClick(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'true';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const from = (page - 1) * DEFAULT_LIMIT + 1;
  const to = page * DEFAULT_LIMIT;
  const count = exportData?.count || 0;

  const { popper, isAllSelected, toggleSelectedRow, toggleIsAllSelected, getIsRowSelected, handleOpen } = useTable({
    rows: exportData?.rows || [],
    deleteSingle: deleteExportDataHandler,
    deleteMultiple: deleteMultipleExportDataHandler,
  });

  const TableHead = useTableHead({
    tableHeadData,
    isAllSelected,
    toggleIsAllSelected,
  });

  const isExport = filter === ExportData.EXPORT;

  function shortenName(name: string, maxSymbol: number) {
    if (name.length > maxSymbol) return name.substring(0, maxSymbol - 3) + '...';
    return name;
  }

  return (
    <div className="">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-4">
          <div className="w-[243px]">
            <ButtonGroup
              buttons={[
                {
                  text: t('export'),
                  isActive: filter === ExportData.EXPORT,
                  onClick: () => handleFilterChange(ExportData.EXPORT),
                },
                {
                  text: t('import'),
                  isActive: filter === ExportData.IMPORT,
                  onClick: () => handleFilterChange(ExportData.IMPORT),
                },
              ]}
            />
          </div>

          <BaseButton
            fill="outline"
            size="md"
            type="outline"
            color="primary"
            Icon={isExport ? UploadIcon : DownloadIcon}
            text={t(isExport ? 'download' : 'upload')}
            onClick={isExport ? exportToXLS : openImportDialog}
          />
        </div>
        <p className="self-center text-text-secondary">{t('showed', { from, to, count })}</p>
      </div>

      <Table size="small" className="w-full">
        <>
          {TableHead}
          {(error || exportDataError) && (
            <Typography color="error">{error?.message || exportDataError?.message}</Typography>
          )}
          {isLoading && <Typography>{t('loading')}</Typography>}

          {exportData?.rows && (
            <TableBody>
              {exportData.rows.map((data) => (
                <CustomTableRow isActive={getIsRowSelected(data.id)} key={data.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <CustomCheckbox
                        checked={getIsRowSelected(data.id)}
                        onChange={(e) => toggleSelectedRow(data.id, e)}
                      />
                      <BurgerButton onClick={(e) => handleOpen(e, data.id)} />
                    </div>
                  </TableCell>
                  <TableCell>{data.id}</TableCell>
                  <TableCell
                    sx={{
                      width: '55%',
                    }}
                    className="overflow-clip overflow-ellipsis whitespace-nowrap"
                  >
                    <div
                      className={classNames(
                        'cursor-pointer text-primary-100 hover:text-primary-900 hover:underline decoration-2',
                        filter === ExportData.EXPORT && 'text-primary-100'
                      )}
                      onClick={() => downloadFileOnClick(data.link)}
                    >
                      {shortenName(data.file_name, 15)}
                    </div>
                  </TableCell>

                  {filter === ExportData.IMPORT && (
                    <>
                      <TableCell className="overflow-clip overflow-ellipsis whitespace-nowrap max-w-messengers">
                        {data.category?.name ? shortenName(data.category?.name, 20) : t('deleted')}
                      </TableCell>
                      <TableCell>{data.count_of_rows}</TableCell>
                    </>
                  )}

                  <TableCell
                    sx={{
                      width: filter === ExportData.EXPORT ? '30%' : '20%',
                    }}
                  >
                    <p className={classNames(data.is_successful ? 'text-green-100' : 'text-red-100')}>{data.type}</p>
                  </TableCell>
                  <TableCell>{formatDate(data.created_at as Date)}</TableCell>
                  <TableCell>
                    <span title={t('import_export_table.timeTooltip')}>
                      {new Date(data.created_at).toLocaleTimeString().substring(0, 5)}
                    </span>
                  </TableCell>
                </CustomTableRow>
              ))}
            </TableBody>
          )}
        </>
      </Table>
      <ImportDialog open={isOpenImportDialog} onClose={onCloseHandler} />
      <div className="my-5">
        <Pagination
          size="large"
          showFirstButton
          showLastButton
          color="primary"
          page={page}
          onChange={handleChangePage}
          count={(exportData?.count && Math.ceil(exportData.count / DEFAULT_LIMIT)) || 0}
          variant="outlined"
          shape="rounded"
        />
      </div>
      {popper}
    </div>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  // await syncDb();
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default withRole(withLayout(ImportExportPage), [Roles.ADMIN]);

import { useEffect, useRef, useState } from 'react';
import { Button, Dialog, DialogContent, Table, TableBody, TableCell } from '@mui/material';
import { useTranslation } from 'next-i18next';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { TableLabel } from '@/components/primitives/TableLabel';
import { uniteApiRoutes } from '@/utils/uniteRoute';
import { ApiProfileRoutes, ApiRoutes } from '../../../../common/enums/api-routes';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { useLayout } from '@/contexts/layoutContext';
import { TableHead } from '@/components/primitives/TableHead/TableHead';
import { CustomCheckbox } from '@/components/Checkbox/Checkbox';
import { useS3Upload } from 'next-s3-upload';
import { languagesData } from '../../../../common/constants/languages';
import { IProfileForm } from '../../../../common/types/profile';
import { messengers } from '../../../../common/constants/messengers';
import { MessengerItem } from '../../../../common/types/messenger';
import { IExportData } from '../../../../common/types/exportData';
import { ExportData } from '../../../../common/enums/import-export-routes';
import { CustomTableRow } from '@/components/primitives/TableRow/TableRow';
import Joi from 'joi';
import { UploadedProfilesAndUsersSchema } from '../../../../common/validation/uploaded-profiles-schema';
import { ErrorMessage } from '@/components/primitives/ErrorMessage/ErrorMessage';
import { CustomerTypes } from '../../../../common/enums/customer-type';
import { BaseButton } from '@/components/Buttons/BaseButton';
import { SecondaryBaseButton } from '@/components/Buttons/SecondaryBaseButton';

const FIELDS = [
  'id_executor',
  'type_executor',
  'name_executor',
  'surname_executor',
  'company_name_executor',
  'email_executor',
  'gender_executor',
  'id_form',
  'subcategory',
  'name_agent',
  'surname_agent',
  'type_executor_agent',
  'company_name_agent',
  'email_agent',
  'gender_agent',
  'main_address',
  'employment_agent',
  'description',
  'tags',
  'phone_numbers',
  'languages',
];

interface ImportUsersDialogProps {
  open: boolean;
  data: IProfileForm[];
  onClose: () => void;
  categoryId: number;
  categoryName: string;
  file: File;
  language: string;
  isMain: boolean;
  isTranslations: boolean;
}

export const ImportUsersDialog = ({
  open,
  onClose,
  data,
  categoryId,
  isMain,
  language,
  file,
  categoryName,
  isTranslations,
}: ImportUsersDialogProps) => {
  console.log(categoryName);
  console.log(categoryId);
  const { uploadToS3 } = useS3Upload();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useLayout();
  const [validationError, setValidationError] = useState<string>('');

  const validate = (data: IProfileForm[]) => {
    const result = UploadedProfilesAndUsersSchema.validate(data, {
      abortEarly: true,
    });
    console.log(result.error?.toString(), error);
    return result.error?.toString();
  };

  useEffect(() => {
    const error = validate(data);
    if (error) {
      setValidationError(error);
    }
  }, []);

  const handleConfirm = async () => {
    setError(null);
    setIsLoading(true);
    const filteredData = data.filter((_, index) => selectedRows.includes(index));
    const filledData = fillUsersData(filteredData);

    try {
      const response = await fetch(
        uniteApiRoutes([ApiRoutes.PROFILES, ApiProfileRoutes.MULTIPLE], {
          isTranslations,
        }),
        {
          method: 'POST',
          body: JSON.stringify(filledData),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      const { url } = await uploadToS3(file);

      const exportDataBody: IExportData = {
        link: url,
        file_name: file.name,
        type: ExportData.IMPORT,
        is_successful: true,
        count_of_rows: filteredData.length,
        category_id: categoryId,
      };

      const exportDataResponse = await fetch(uniteApiRoutes([ApiRoutes.EXPORT_DATA]), {
        method: 'POST',
        body: JSON.stringify(exportDataBody),
      });

      if (!exportDataResponse.ok) {
        console.log(exportDataResponse);
        throw new Error(await response.text());
      }

      addNotification({ type: 'success', text: t('import_success') });
      onClose();
    } catch (error) {
      addNotification({ type: 'error', text: t('import_error') });
      setError(getErrorMessage(error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const getProfileLanguage = (profile: IProfileForm) => {
    if (typeof profile?.languages !== 'string') return null;
    const languages = profile?.languages
      .split(',')
      .map((el) => {
        const name = el.trim().toLowerCase();
        return languagesData.find((lang) => lang.name.toLowerCase() === name || lang.code === name);
      })
      .filter(Boolean);

    if (languages.length === 0) {
      return null;
    }

    return languages;
  };

  const getMessengers = (profile: IProfileForm) => {
    const mockedMessengers = messengers.map((messenger) => messenger.name);
    const profileMessengers: MessengerItem[] = [];
    for (const key in profile) {
      if (mockedMessengers.includes(key)) {
        const messenger = messengers.find((messenger) => messenger.name === key);
        if (!messenger) continue;
        const messengerItem: MessengerItem = {
          profileId: profile.id,
          nicknameOrNumber: profile[key as keyof IProfileForm] as string,
          messenger,
        };
        profileMessengers.push(messengerItem);
      }
    }
    if (profileMessengers.length === 0) {
      return null;
    }
    return profileMessengers;
  };

  const getTags = (tags: string) => {
    return tags?.split(',').map((el) => el.trim()) || null;
  };

  const getGender = (gender: string) => {
    return String(gender) === '1' ? 'male' : 'female';
  };

  const getType = (type: string) => {
    return String(type).toLowerCase() === 'компания' ? CustomerTypes.COMPANY : CustomerTypes.INDIVIDUAL;
  };

  const getJobType = (job_type: string) => {
    return String(job_type) === '1' ? 'main' : 'temporary';
  };

  const getPhoneNumbers = (phone_numbers: string) => {
    return String(phone_numbers)
      .split(',')
      .map((el) => el.trim())
      .filter(Boolean);
  };

  const fieldsMap = {
    id_executor: 'table_user_id',
    name_executor: 'user_name',
    surname_executor: 'user_surname',
    gender_executor: 'user_gender',
    email_executor: 'user_email',
    executor_type: 'user_type',
    id_form: 'form_id',
    category_id: 'category_id',
    name_agent: 'name',
    surname_agent: 'surname',
    company_name_agent: 'company_name',
    gender_agent: 'gender',
    main_address: 'address',
    employment_agent: 'job_type',
    type_executor_agent: 'type',
    tags: 'tags',
    description: 'description',
    phone_numbers: 'phone_numbers',
    languages: 'languages',
    messengers: 'messengers',
    profile_language: 'profile_language',
    email_agent: 'email',
  };

  const fieldKeys = Object.keys(fieldsMap);

  const fillUsersData = (data: IProfileForm[]) => {
    const usersData = data.map((profile) => {
      const userData = fieldKeys.reduce((obj, key) => {
        obj[fieldsMap[key]] = profile[key];
        return obj;
      }, {});
      const tags = getTags(userData.tags);
      const languages = getProfileLanguage(userData.languages);
      const messengers = getMessengers(userData.messengers);
      const gender = getGender(userData.gender);
      const user_gender = getGender(userData.user_gender);
      const user_type = getType(userData.user_type);
      const type = getType(userData.type);
      const job_type = getJobType(userData.job_type);
      const phone_numbers = getPhoneNumbers(userData.phone_numbers);

      const result = {
        ...userData,
        type,
        tags,
        job_type,
        languages,
        category_id: categoryId,
        profile_language: language,
        user_password: userData.user_email,
        phone_numbers,
        user_gender,
        user_type,
        messengers,
        gender,
      };

      console.log(result);

      return result;
    });
    return usersData as IProfileForm[];
  };

  const onChangeHandler = ({ target }: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (target.checked) {
      setSelectedRows((prev) => [...prev, index]);
      return;
    }

    setSelectedRows((prev) => prev.filter((i) => i !== index));
  };

  const onHeaderCheckboxChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    if (!target.checked) {
      setSelectedRows([]);
    } else {
      setSelectedRows(Array.from(Array(data.length).keys()));
    }
  };

  const tableHeadCells = [
    <CustomCheckbox checked={selectedRows.length === data.length} onChange={onHeaderCheckboxChange} />,
    ...FIELDS.map((name) => <TableLabel>{t(name)}</TableLabel>),
  ];

  return (
    <>
      <Dialog maxWidth="lg" open={open} onClose={onClose}>
        <div className=" bg-primary-100 flex justify-between px-4 py-2 items-center">
          <h3 className="text-white">{t('import_results')}</h3>
          <IconButton disabled={isLoading} edge="end" onClick={onClose} aria-label="close" color="white">
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent>
          <div className="pt-2 w-import-table">
            <p className="">{t('import_results_headline', { count: data.length })}</p>
            <p className="mb-3">{t('import_results_caption', { count: data.length })}</p>

            {validationError && <ErrorMessage text={validationError} />}
            {error && <p className="text-red-500">{error}</p>}

            <Table size="small" className="w-full">
              <>
                <TableHead cells={tableHeadCells} />
                <TableBody>
                  {data.map((profile, index) => (
                    <CustomTableRow isActive={selectedRows.includes(index)} key={profile.id}>
                      <TableCell>
                        <CustomCheckbox
                          checked={selectedRows.includes(index)}
                          onChange={(event) => onChangeHandler(event, index)}
                        />
                      </TableCell>
                      {FIELDS.map((name) => (
                        <TableCell className="whitespace-nowrap max-w-sm overflow-ellipsis overflow-clip">
                          {name === 'subcategory' ? categoryName : profile[name]}
                        </TableCell>
                      ))}
                    </CustomTableRow>
                  ))}
                </TableBody>
              </>
            </Table>
          </div>
          {isLoading && <p>{t('loading')}</p>}
        </DialogContent>
        <div className="flex gap-2 p-4 w-96">
          <BaseButton
            disabled={isLoading || !selectedRows.length || validationError}
            classes="w-full justify-center"
            type="solid"
            size="large"
            variant=""
            color="success"
            fullWidth
            text={isLoading ? t('loading') : t('save')}
            onClick={handleConfirm}
          ></BaseButton>
          <SecondaryBaseButton
            classes="w-full justify-center"
            size="large"
            fullWidth
            onClick={onClose}
            type="outline"
            color="secondary"
            text={t('cancel')}
          ></SecondaryBaseButton>
        </div>
      </Dialog>
    </>
  );
};

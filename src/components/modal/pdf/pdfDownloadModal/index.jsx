import PopUp from '@components/modules/common/PopUp';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { FormProvider, useForm } from 'react-hook-form';
import 'jspdf-autotable';
import { useSelector } from 'react-redux';
import HsFileHandler from '@modules/common/HsFileHandler';
import HsLib from '@modules/common/HsLib';
import useModal from '@modules/hooks/useModal';
import _ from 'lodash';

const changeCellFormat = ({ value, cellType, valueOptions = [], index }) => {
  switch (cellType) {
    case 'D':
      return HsLib.changeDateFormat(value, '$1-$2-$3 $4:$5');
    case 'B':
      return HsLib.changeDateFormat(value, '$1-$2-$3 $4:$5');
    case 'S':
      return HsLib.changeDateFormat(value, '$4:$5:$6');
    case 'H':
      return HsLib.changeDateFormat(value, '$4:$5');
    case 'O':
      return HsLib.changeDateFormat(value, '$1-$2');
    case 'A':
      return HsLib.changeDateFormat(value, '$1-$2-$3 $4:$5:$6');
    case 'P':
      return `${value}%`;
    case 'I':
      return Number(value).toLocaleString();
    case 'U':
      return HsLib.bytesToSize(value);
    case 'C': {
      const codeLabel = valueOptions.find((code) => code.value === value);
      return codeLabel?.label || value;
    }
    case 'N':
      return index + 1;
    default:
      return value;
  }
};

function PdfDownloadModal({ name, open, setOpen, searchInfo = {}, apiCallback }) {
  const selectedItem = useSelector((state) => state.menu.selectedItem);
  const columns = useSelector((state) => state[`${name}`]?.columns || []);

  const methods = useForm({ defaultValues: { pageDirection: 'vertical', pageCount: 'total' } });

  const openModal = useModal();

  const watchPageCount = methods.watch('pageCount');

  const generatePDF = async ({ pageDirection, selectDataCount }) => {
    let message;

    if (_.isEmpty(columns) || columns.length === 0 || _.isEmpty(searchInfo))
      message = 'PDF 다운로드 실패.';

    if (message) {
      openModal({ message, type: 'warn' });
      return;
    }

    const { content } = await apiCallback({ size: selectDataCount || 10000, page: 0 });

    const columnInfo = columns.map((col) => ({
      header: col.Header,
      dataKey: col.accessor,
      cellType: col.cellType,
      ...(col.cellType === 'C' && { valueOptions: col.valueOptions }),
    }));

    const rows = content.map((row, index) => {
      const rowData = {};
      columnInfo.forEach(({ dataKey, cellType, valueOptions = [] }) => {
        let cellValue = Number.isNaN(row[`${dataKey}`])
          ? row[`${dataKey}`] || ''
          : row[`${dataKey}`];
        rowData[`${dataKey}`] = changeCellFormat({
          value: cellValue,
          cellType,
          valueOptions,
          index,
        });
      });
      return rowData;
    });

    HsFileHandler.saveAsGridPDF({
      name: selectedItem?.label || '',
      searchInfo,
      tableInfo: { columns: columnInfo, rows },
      horizontal: pageDirection === 'horizontal' ? true : false,
    });

    methods.reset();
    setOpen(false);
  };

  const handlePageCountChange = ({ value }) => {
    if (value === 'total') methods.resetField('selectDataCount');
    return value;
  };

  return (
    <PopUp
      maxWidth="xs"
      fullWidth
      callBack={methods.handleSubmit(generatePDF)}
      alertOpen={open}
      closeAlert={setOpen}
      title="PDF 다운로드"
    >
      <FormProvider {...methods}>
        <form id="menuSettingModal">
          <GridItem
            container
            divideColumn={1}
            borderFlag
            sx={{
              '& .text': { maxWidth: '150px', minWidth: '150px' },
            }}
          >
            <LabelInput
              required
              labelBackgroundFlag
              label="용지 방향"
              type="radio"
              name="pageDirection"
              list={[
                { label: '세로', value: 'vertical' },
                { label: '가로', value: 'horizontal' },
              ]}
            />
            <LabelInput
              required
              labelBackgroundFlag
              label="데이터 범위"
              type="radio"
              name="pageCount"
              {...(watchPageCount !== 'custom' && { helperText: '※ 최대 10,000건 데이터 조회' })}
              list={[
                { label: '전체 데이터', value: 'total' },
                { label: '사용자 지정', value: 'custom' },
              ]}
              onHandleChange={handlePageCountChange}
            />
            {watchPageCount === 'custom' && (
              <LabelInput
                required
                sx={{ width: '100%', ml: 1 }}
                onlyNumber
                labelBackgroundFlag
                label="조회 데이터 수"
                name="selectDataCount"
              />
            )}
          </GridItem>
        </form>
      </FormProvider>
    </PopUp>
  );
}

export default PdfDownloadModal;

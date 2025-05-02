import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { setParameters } from '@modules/redux/reducers/hss/sslswg/accessRequestStatus';

function AccessRequestSearchForm(props) {
  const { tableName } = props;
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.accessRequestStatus[tableName]);
  const parameters = parameterData.parameters.current;

  const showStatus = tableName === 'wait';
  const columnCount = showStatus ? 4 : 5;

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(
      setParameters({
        tab: tableName,
        data: {
          [name]: value,
        },
      }),
    );
  };

  return (
    <SearchInput positionUnset>
      <GridItem
        container
        divideColumn={columnCount}
        spacing={2}
        sx={{
          pr: 5,
          '& .text': { maxWidth: '130px', minWidth: '130px' },
          '.inputBox': { maxWidth: '180px', minWidth: '180px' },
        }}
      >
        <LabelInput
          label="요청자"
          name="name"
          value={parameters.name}
          onChange={handleChange}
          maxLength={255}
        />
        <LabelInput
          label="요청자 IP"
          name="ip"
          value={parameters.ip}
          onChange={handleChange}
          maxLength={39}
        />
        <LabelInput
          label="요청 사유"
          name="value"
          value={parameters.value}
          onChange={handleChange}
          maxLength={1024}
        />
        <LabelInput
          label="URL"
          name="url"
          value={parameters.url}
          onChange={handleChange}
          maxLength={4096}
        />
        {!showStatus && (
          <LabelInput
            type="select"
            label="상태"
            name="inUsed"
            value={parameters.inUsed ?? ''}
            onChange={handleChange}
            list={[
              { value: '1', label: '허용' },
              { value: '2', label: '반려' },
            ]}
          />
        )}
      </GridItem>
    </SearchInput>
  );
}

export default AccessRequestSearchForm;

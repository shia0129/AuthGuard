import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { setParameters } from '@modules/redux/reducers/hss/sslva/packetcaptureStatus';

function PacketcaptureForm() {
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.packetcaptureStatus);
  const parameters = parameterData.parameters.current;
  const segmentNameList = parameterData.segmentNameList;
  const LinkedNameList = parameterData.LinkedNameList;
  
  const handleChange = (event, validValue = null) => {
    let value = validValue === null ? event.target.value : validValue;
    if (event instanceof PointerEvent) {
      value = event.target.value;
    }

    dispatch(setParameters({ [event.target.name]: value }));
  };

  return (
    <SearchInput positionUnset>
      <GridItem
        container
        divideColumn={2}
        spacing={2}
        sx={{
          pr: 5,
          '& .text': { maxWidth: '130px', minWidth: '130px' },
          '.inputBox': { maxWidth: '180px', minWidth: '180px' },
        }}
      >
        <LabelInput label="검색어(필터)" name="filter" value={parameters.filter} onChange={handleChange} />
        <LabelInput label="캡쳐수" name="count" value={parameters.count} onChange={handleChange} />
        {/* <LabelInput label="캡쳐시간(초)" name="duration" value={parameters.duration} onChange={handleChange} /> */}
      </GridItem>
      
      <GridItem
        container
        divideColumn={2}
        spacing={2}
        sx={{
          pr: 5,
          '& .text': { maxWidth: '130px', minWidth: '130px' },
          '.inputBox': { maxWidth: '180px', minWidth: '180px' },
        }}
      >
        <LabelInput
          type="select"
          label="Linked Interface"
          name="interface"
          value={parameters.interface}
          list={LinkedNameList || []}
          //list={[]}
          onChange={handleChange}
          labelSx={{ textAlign: 'right' }}
        />
        <LabelInput
          type="select"
          label="세그먼트명"
          name="container"
          value={parameters.container}
          list={segmentNameList || []}
          //list={[]}
          onChange={handleChange}
          labelSx={{ textAlign: 'right' }}
        />
      </GridItem>
    </SearchInput>
  );
}

export default PacketcaptureForm;

import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import { Stack } from '@mui/material';
import { setParameters } from '@modules/redux/reducers/hss/common/log';
import { Typography, Box } from '@mui/material';

function SWGLogSearchActionButton(props) {
    const { onSearchButtonClick } = props;
    
    const dispatch = useDispatch();
    const parameterData = useSelector((state) => state.log);

    const inquiryClickButton = () => {
      if (parameterData.parameters.current.page === 0) {
        onSearchButtonClick(parameterData.parameters.current);
      }
      dispatch(setParameters({ page: 0 }));
    };

    return (
        <>
          <GridItem item directionHorizon="end">
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <ButtonSet
                options={[
                  {
                    label: '조회',
                    callBack: () => inquiryClickButton(),
                    variant: 'outlined',
                  },
                ]}
              />
            </Stack>
          </GridItem>
        </>
      );
}

export default SWGLogSearchActionButton;
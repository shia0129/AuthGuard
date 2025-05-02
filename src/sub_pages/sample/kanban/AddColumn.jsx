// libraries
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Stack, Tooltip, Box } from '@mui/material';
import { CloseOutlined } from '@ant-design/icons';
import { FormProvider, useForm } from 'react-hook-form';

// components
import MainCard from '@components/mantis/MainCard';
import SubCard from '@components/mantis/MainCard';
import IconButton from '@components/@extended/IconButton';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';

// functions
import config from 'src/config';
import { openSnackbar } from '@modules/redux/reducers/snackbar';
import { addColumn } from '@modules/redux/reducers/kanban';

// ==============================|| KANBAN BOARD - ADD COLUMN ||============================== //

function AddColumn() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { columns, columnsOrder } = useSelector((state) => state.kanban);

  const methods = useForm({
    defaultValues: {
      newColumn: '',
    },
  });

  const [isAddColumn, setIsAddColumn] = useState(false);

  const handleAddColumnChange = () => {
    setIsAddColumn((prev) => !prev);
  };

  const addNewColumn = ({ newColumn }) => {
    if (newColumn.length > 0) {
      const id = String(
        (columns.length === 0 ? 0 : Math.max(...columns.map((column) => Number(column.id)))) + 1,
      );

      const column = {
        id,
        title: newColumn,
        itemIds: [],
      };

      dispatch(addColumn({ columns: [...columns, column], columnsOrder: [...columnsOrder, id] }));
      dispatch(
        openSnackbar({
          open: true,
          message: 'Column Added successfully',
          variant: 'alert',
          alert: {
            color: 'success',
          },
          close: false,
        }),
      );
      setIsAddColumn((prev) => !prev);
      methods.setValue('newColumn', '');
    }
  };

  const handleAddColumn = (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      addNewColumn();
    }
  };

  return (
    <MainCard
      sx={{
        minWidth: 250,
        backgroundColor:
          theme.palette.mode === config.mode
            ? theme.palette.background.default
            : theme.palette.secondary.lighter,
        height: '100%',
        borderColor: theme.palette.divider,
      }}
      contentSX={{ p: 1.5, '&:last-of-type': { pb: 1.5 } }}
    >
      <FormProvider {...methods}>
        <form autoComplete="off" onSubmit={methods.handleSubmit(addNewColumn)}>
          <GridItem container directionVertical="center" spacing={1}>
            {isAddColumn && (
              <GridItem item xs={12}>
                <SubCard content={false}>
                  <Box sx={{ p: 2, pb: 1.5, transition: 'background-color 0.25s ease-out' }}>
                    <GridItem container directionVertical="center" spacing={0.5}>
                      <GridItem item xs={12}>
                        <LabelInput
                          sx={{
                            width: '100%',
                            mb: 3,
                            '& input': { bgcolor: 'transparent', p: 0, borderRadius: '0px' },
                            '& fieldset': { display: 'none' },
                            '& .MuiFormHelperText-root': {
                              ml: 0,
                            },
                            '& .MuiOutlinedInput-root': {
                              bgcolor: 'transparent',
                              '&.Mui-focused': {
                                boxShadow: 'none',
                              },
                            },
                          }}
                          required
                          disableLabel
                          label="컬럼명"
                          name="newColumn"
                          placeholder="Add Column"
                          onKeyUp={handleAddColumn}
                        />
                      </GridItem>
                      <GridItem item xs zeroMinWidth />
                      <GridItem item>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Tooltip title="Cancel">
                            <IconButton size="small" color="error" onClick={handleAddColumnChange}>
                              <CloseOutlined />
                            </IconButton>
                          </Tooltip>
                          <Button type="submit" variant="contained" color="primary" size="small">
                            Add
                          </Button>
                        </Stack>
                      </GridItem>
                    </GridItem>
                  </Box>
                </SubCard>
              </GridItem>
            )}
            {!isAddColumn && (
              <GridItem item xs={12}>
                <Button
                  variant="dashed"
                  color="secondary"
                  fullWidth
                  onClick={handleAddColumnChange}
                >
                  Add Column
                </Button>
              </GridItem>
            )}
          </GridItem>
        </form>
      </FormProvider>
    </MainCard>
  );
}

export default AddColumn;

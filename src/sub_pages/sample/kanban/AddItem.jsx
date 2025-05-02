// libraries
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Stack, Tooltip, Box } from '@mui/material';
import { CloseOutlined } from '@ant-design/icons';
import { FormProvider, useForm } from 'react-hook-form';
import { sub } from 'date-fns';

// components
import IconButton from '@components/@extended/IconButton';
import SubCard from '@components/mantis/MainCard';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';

// functions
import { openSnackbar } from '@modules/redux/reducers/snackbar';
import { addItem } from '@modules/redux/reducers/kanban';

// ==============================|| KANBAN BOARD - ADD ITEM ||============================== //

function AddItem({ columnId }) {
  const dispatch = useDispatch();
  const { columns, items, userStory } = useSelector((state) => state.kanban);

  const [addTaskBox, setAddTaskBox] = useState(true);

  const methods = useForm({
    defaultValues: {
      newItem: '',
    },
  });

  const handleAddTaskChange = () => {
    setAddTaskBox((prev) => !prev);
  };

  const handleAddTask = (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      addTask();
    }
  };

  const addTask = ({ newItem }) => {
    if (newItem.length > 0) {
      const parentColumn = columns.find((item) => item.id === columnId);
      const id = String(
        (parentColumn.itemIds.length === 0
          ? 0
          : Math.max(...parentColumn.itemIds.map((item) => Number(item.id)))) + 1,
      );
      const item = {
        id,
        title: newItem,
        dueDate: sub(new Date(), { days: 0, hours: 1, minutes: 45 }).toISOString(),
        image: false,
        assign: '',
        description: '',
        priority: 'low',
        attachments: [],
      };
      const newColumns = columns.map(
        (column) => column.id === columnId && { ...column, itemIds: [...column.itemIds, id] },
      );
      dispatch(
        addItem({
          items: [...items, item],
          columns: newColumns,
          userStory,
        }),
      );
      dispatch(
        openSnackbar({
          open: true,
          message: 'Task Added successfully',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success',
          },
          close: false,
        }),
      );
      handleAddTaskChange();
      methods.setValue('newItem', '');
    }
  };

  return (
    <GridItem container directionVertical="center" sx={{ marginTop: 1 }}>
      {addTaskBox && (
        <GridItem item xs={12}>
          <SubCard content={false}>
            <Box sx={{ p: 2, pb: 1.5, transition: 'background-color 0.25s ease-out' }}>
              <FormProvider {...methods}>
                <form autoComplete="off" onSubmit={methods.handleSubmit(addTask)}>
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
                        label="아이템 명"
                        name="newItem"
                        placeholder="Add Task"
                        onKeyUp={handleAddTask}
                      />
                    </GridItem>
                    <GridItem item xs zeroMinWidth />
                    <GridItem item>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Tooltip title="Cancel">
                          <IconButton size="small" color="error" onClick={handleAddTaskChange}>
                            <CloseOutlined />
                          </IconButton>
                        </Tooltip>
                        <Button type="submit" variant="contained" color="primary" size="small">
                          Add
                        </Button>
                      </Stack>
                    </GridItem>
                  </GridItem>
                </form>
              </FormProvider>
            </Box>
          </SubCard>
        </GridItem>
      )}
      {!addTaskBox && (
        <GridItem item xs={12}>
          <Button variant="dashed" color="secondary" fullWidth onClick={handleAddTaskChange}>
            Add Task
          </Button>
        </GridItem>
      )}
    </GridItem>
  );
}

AddItem.propTypes = {
  columnId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default AddItem;

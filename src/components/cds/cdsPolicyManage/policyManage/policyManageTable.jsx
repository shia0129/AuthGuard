
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import HsReactTable from '@components/modules/table/HsReactTable';
import {
  setParameters,
  setPolicyManageList,
  setAddCheckList,
  setRemoveCheckList,
} from '@modules/redux/reducers/policyManage';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import policyManageApi from '@api/indirectLink/policyManageApi';
import BoundTypeComponent from './makeColumn/boundTypeComponent';
import IpPortInfoComponent from './makeColumn/ipPortInfoComponent';
import EnabledTypeComponent from './makeColumn/enabledTypeComponent';
import PolicyNameComponent from './makeColumn/policyNameComponent';

function PolicyManageTable(props) {
  const { gridInfo, setGridInfo, getPolicyManageList, onNameColumnClick } = props;
  const { instance } = AuthInstance();
  policyManageApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const parameterData = useSelector((state) => state.policyManage);
  const dispatch = useDispatch();

  const onChangeChecked = (selectData) => {
    let id = selectData[0].id;
    let isExist = false;

    isExist = parameterData.addCheckList.includes(id);
    if (!isExist) {
      dispatch(setAddCheckList({ addCheckList: id }));
    } else {
      dispatch(setRemoveCheckList({ addCheckList: id }));
    }
  };

  const makeColumns = () =>
    parameterData.columns?.map((column) => {
      switch (column.accessor) {
        case 'boundType':
          return {
            ...column,
            Cell: (props) => {
              return <BoundTypeComponent boundType={props.row.original.boundType} />;
            },
          };
        case 'destinationIp':
          return {
            ...column,
            Cell: (props) => {
              return (
                <IpPortInfoComponent
                  ipPortData={props.row.original.destinationIp}
                  name="destinationIp"
                />
              );
            },
          };
        case 'destinationPort':
          return {
            ...column,
            Cell: (props) => {
              return (
                <IpPortInfoComponent
                  ipPortData={props.row.original.destinationPort}
                  name="destinationPort"
                />
              );
            },
          };
        case 'sourceIp':
          return {
            ...column,
            Cell: (props) => {
              return (
                <IpPortInfoComponent ipPortData={props.row.original.sourceIp} name="sourceIp" />
              );
            },
          };
        case 'enabledType':
          return {
            ...column,
            Cell: (props) => {
              const original = props.row.original;

              return (
                <EnabledTypeComponent
                  enabledType={original.enabledType}
                  id={original.id}
                  handleClickEnabledType={handleClickEnabledType}
                />
              );
            },
          };
        case 'policyName':
          return {
            ...column,
            Cell: (props) => {
              const original = props.row.original;

              return (
                <PolicyNameComponent
                  value={props.value}
                  id={original.id}
                  onNameColumnClick={onNameColumnClick}
                />
              );
            },
          };
        default:
          break;
      }
      return column;
    });

  const handleClickEnabledType = (value, id) => {
    openModal({
      message:
        value === 'ENABLED'
          ? '해당 정책을 미사용으로 전환하시겠습니까?'
          : '해당 정책을 사용으로 전환하시겠습니까?',
      onConfirm: () => {
        updateEnabledData(id);
      },
    });
  };

  const updateEnabledData = async (id) => {
    const result = await apiCall(policyManageApi.updateEnabledData, id);

    openModal({
      message: result,
      onConfirm: () => {
        getPolicyManageList(parameterData.parameters.current);
      },
    });
  };

  return (
    <GridItem item>
      <HsReactTable
        columns={makeColumns()}
        data={parameterData.policyManageList}
        onChangeChecked={onChangeChecked}
        gridInfo={gridInfo}
        setGridInfo={setGridInfo}
        parameters={parameterData.parameters}
        setParameters={(data) => dispatch(setParameters(data))}
        setData={(data) => dispatch(setPolicyManageList({ policyManageList: data }))}
        id="policyManage"
        sx={{
          '.CMM-rt-tableArea-reactRow': {
            height: 'unset',
          },
          '.CMM-rt-headerArea-tableHead, .CMM-rt-headerArea-tableHead tr th, .CMM-rt-rowArea-tableCell':
            {
              padding: '0',
            },
          '.MuiStack-root': {
            flexWrap: 'wrap',
          },
          '.CMM-rt-rowArea-tableCell div p': {
            fontSize: '13px',
            verticalAlign: 'middle',
          },
          '.CMM-rt-rowArea-tableCell, .CMM-rt-rowArea-tableCell div p': {
            lineHeight: '35px',
          },
        }}
      />
    </GridItem>
  );
}
export default PolicyManageTable;

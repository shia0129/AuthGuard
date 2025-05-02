import { combineReducers } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import common from './common';
import snackbar from './snackbar';
import menu from './menu';
import alert from './alert';
import loader from './loader';
import notification from './notification';
import confirmAlert from './confirmAlert';
import customAlert from './customAlert';
import kanban from './kanban';
import calendar from './calendar';
import notice from './notice';
import transBlock from './transBlock';
import transHistory from './transHistory';
import serviceRefusalHistory from './serviceRefusalHistory';
import malware from './malware';
import policyManage from './policyManage';
//import ipGroupStatus from './hss/sslswg/ipGroupStatus';
//import ipStatus from './hss/sslswg/ipStatus';
import portStatus from './portStatus';
import policyStatus from './policyStatus';
import integrityCheck from './integrityCheck';
import adminAccess from './adminAccess';
import adminManage from './adminManage';
import adminBlock from './adminBlock';
import destinationPolicyHis from './destinationPolicyHis';
import departurePolicyHis from './departurePolicyHis';
import monitoringLog from './monitoringLog';
import bulkRegistHis from './bulkRegistHis';
import code from './code';
import diskHis from './diskHis';
import cpuMemoryHis from './cpuMemoryHis';
import messageFilterHis from './messageFilterHis';
import policyUpload from './policyUpload';
import protocolStatus from './hss/sslva/protocolStatus';
import policyDetailStatus from './hss/sslva/policyDetailStatus';
import vaPolicyGroupStatus from './hss/sslva/policyGroupStatus';
import vaCertStatus from './hss/sslva/certStatus';
import segmentStatus from './hss/sslva/segmentStatus';
import packetcaptureStatus from './hss/sslva/packetcaptureStatus';
import siteStatus from './hss/sslswg/site/siteStatus';
import siteGroupStatus from './hss/sslswg/site/siteGroupStatus';
import siteGroupUpdateStatus from './hss/sslswg/site/siteGroupUpdateStatus';
import patternStatus from './hss/sslswg/pattern/patternStatus';
import patternGroupStatus from './hss/sslswg/pattern/patternGroupStatus';
import patternGroupUpdateStatus from './hss/sslswg/pattern/patternGroupUpdateStatus';
import srcIpStatus from './hss/sslswg/srcIp/srcIpStatus';
import srcIpGroupStatus from './hss/sslswg/srcIp/srcIpGroupStatus';
import srcIpGroupUpdateStatus from './hss/sslswg/srcIp/srcIpGroupUpdateStatus';
import timeStatus from './hss/sslswg/time/timeStatus';
import timeGroupStatus from './hss/sslswg/time/timeGroupStatus';
import timeGroupUpdateStatus from './hss/sslswg/time/timeGroupUpdateStatus';
import blackListStatus from './hss/sslswg/blackListStatus';
import blackListGroupStatus from './hss/sslswg/blackListGroupStatus';
// import dockerStatus from './dockerStatus';
import swgPolicyGroupStatus from './hss/sslswg/policyGroupStatus';
import swgPolicyGroupUpdateStatus from './hss/sslswg/policyGroupUpdateStatus';
import accessRequestStatus from './hss/sslswg/accessRequestStatus';
import zone from './hss/sslvpn/zone';
import user from './hss/sslvpn/user';
import account from './hss/common/account';
import accountGroup from './hss/common/accountGroup';
import interfaceModule from './hss/common/interfaceModule';
import route from './hss/common/route';
import cpuMemory from './hss/common/cpuMemory';
import disk from './hss/common/disk';
import log from './hss/common/log';

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    return { ...state, ...action.payload };
  }
  return combineReducers({
    common,
    code,
    menu,
    snackbar,
    alert,
    loader,
    notification,
    confirmAlert,
    customAlert,
    kanban,
    calendar,
    notice,
    transBlock,
    transHistory,
    serviceRefusalHistory,
    malware,
    cpuMemoryHis,
    policyManage,
    // ipGroupStatus,
    // ipStatus,
    portStatus,
    policyStatus,
    integrityCheck,
    adminAccess,
    adminManage,
    adminBlock,
    destinationPolicyHis,
    departurePolicyHis,
    monitoringLog,
    bulkRegistHis,
    diskHis,
    messageFilterHis,
    policyUpload,
    protocolStatus,
    policyDetailStatus,
    vaPolicyGroupStatus,
    vaCertStatus,
    segmentStatus,
    packetcaptureStatus,
    siteStatus,
    siteGroupStatus,
    siteGroupUpdateStatus,
    patternStatus,
    patternGroupStatus,
    patternGroupUpdateStatus,
    srcIpStatus,
    srcIpGroupStatus,
    srcIpGroupUpdateStatus,
    timeStatus,
    timeGroupStatus,
    timeGroupUpdateStatus,
    blackListStatus,
    blackListGroupStatus,
    // dockerStatus,
    swgPolicyGroupStatus,
    swgPolicyGroupUpdateStatus,
    accessRequestStatus,
    zone,
    user,
    account,
    accountGroup,
    interfaceModule,
    route,
    cpuMemory,
    disk,
    log,
  })(state, action);
};
export default reducer;

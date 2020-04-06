import React, { FC, useState, useEffect } from 'react';
import WarningHeader from '../../components/Warning/header';
import WarningList from '../../components/Warning';
import { Duration } from '@/components/Dashboard/type';
import { WarnInfo } from '@/components/Warning/type';
import { connect } from 'dva';
import { IAPPModel } from '@/models/APPModal';
interface IWarningProps{
  duration: Duration;
  refresh: number;
}
const Warning: FC<IWarningProps> = props => {
  const { refresh, duration } = props;
  const [filter, setFilter] = useState({
    scope: 'All',
    keyword: '',
    pageNum: 1,
  });
  const [warningList, setWarningList] = useState<WarnInfo[]>();
  useEffect(()=> {
    const res = [{"id":"6","message":"Response time of service instance projectA.business-zone-pid:4169@skywalking-server-0001 is more than 1000ms in last 10 minutes.","startTime":1586098582180,"scope":"ServiceInstance"},{"id":"4","message":"Response time of service projectB.business-zone is more than 1000ms in last 10 minutes.","startTime":1586098582180,"scope":"Service"},{"id":"2","message":"Response time of service load balancer2.system is more than 1000ms in last 10 minutes.","startTime":1586098582180,"scope":"Service"},{"id":"3_L3Byb2plY3RBL3Rlc3Q=_0","message":"Response time of endpoint /projectA/test in load balancer1.system is more than 1000ms in last 10 minutes.","startTime":1586098582180,"scope":"Endpoint"},{"id":"4_L3Byb2plY3RCL3t2YWx1ZX0=_0","message":"Response time of endpoint /projectB/{value} in projectB.business-zone is more than 1000ms in last 10 minutes.","startTime":1586098582180,"scope":"Endpoint"}];//获取后端数据并处理数据
    setWarningList(res);
  },[filter, refresh, duration])
  return (
    <div>
      <WarningHeader
        filter={filter}
        onChange={f => setFilter(f)}
      />
      <WarningList
        warningList={warningList}
      />
    </div>
  );
};
export default connect((state: { APP: IAPPModel['state'] }) => {
  return {
    refresh: state.APP.refresh,
  };
})(Warning);
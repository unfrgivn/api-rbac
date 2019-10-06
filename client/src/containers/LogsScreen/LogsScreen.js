import React from 'react';
import { inject, observer } from 'mobx-react';

import RequestLogs from '../../components/RequestLogs/RequestLogs'; 

import classes from './LogsScreen.module.scss';

const logsScreen = inject('stores')(observer((props) => (
    <div>
        <RequestLogs /> 
    </div>
)));

export default logsScreen;

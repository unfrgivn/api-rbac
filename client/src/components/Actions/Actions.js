import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import { inject, observer } from 'mobx-react';

import ActionToggle from './ActionToggle/ActionToggle';
import Spinner from '../UI/Spinner/Spinner';


@inject('stores')
@observer @autobind
class Actions extends Component {

    async componentDidMount() {
        await this.load();
    }

    load = async () => {
        const { Actions } = this.props.stores;
        
        if (!Actions.isLoaded) {
            Actions.load();
        }
    }

    onActionToggleChange = async (event) => {
        const { Groups } = this.props.stores;

        if (event.target.checked) {
            Groups.addAction(event.target.value);
        } else {
            Groups.removeAction(event.target.value);
        }
    }

    render() {
        let content = <Spinner />;
        
        const { Actions, Groups } = this.props.stores;
        
        let listActions = null;
        if (Groups.group._id) {
            // Get array of action Ids in current group
            const groupActionIds = Groups.group.actions.map(item => item.id);

            const actionsArray = [];
            for (let key in Actions.actions) {
                const action = Actions.actions[key];
                actionsArray.push({
                    id: action.id,
                    controller: action.controller,
                    name: action.name,
                    checked: groupActionIds.indexOf(action.id) > -1,
                });
            }

            listActions = actionsArray.map(action => (
                <ActionToggle 
                    key={action.id}
                    id={action.id}
                    controller={action.controller} 
                    name={action.name}
                    checked={action.checked}
                    changed={event => this.onActionToggleChange(event)} />
            ));
        }
        
        if (Actions.isLoaded) {
            if (Actions.actions.length) {
                content = listActions;
            } else {
                content = <div className="alert alert-warning">No actions yet</div>
            }
        }

        return (
            <div>
                {content} 
            </div>            
        );
    }

}

export default Actions;
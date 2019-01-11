import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import { inject, observer } from 'mobx-react';

import Actions from '../Actions/Actions';
import AddGroup from './AddGroup/AddGroup'; 

import Input from '../UI/Input/Input';
import Spinner from '../UI/Spinner/Spinner';


@inject('stores')
@observer @autobind
class Groups extends Component {

    async componentDidMount() {
        await this.load();
    }

    load = async () => {
        const { Groups } = this.props.stores;
        
        if (!Groups.isLoaded) {
            Groups.load();
        }
    }

    inputChangedHandler = async (event) => {
        const { Groups } = this.props.stores;
        Groups.setGroup(event.target.value);
    }

    // setGroup = async groupId => {
    //     // const { Groups } = this.props.stores;
    //     // Groups.groupId = groupId;
    // }

    render() {
        let content = <Spinner />;
        
        const { Groups } = this.props.stores;
        
        const dropdownGroups =
            <Input 
                key="dropdownGroups"
                elementType="select"
                elementConfig={{
                    options: [{value: '', displayValue: '-- Select Group --'}].concat(Groups.groups.map(group => {
                        return {
                            value: group.id,
                            displayValue: group.name
                        }
                    }))
                }}
                value={Groups.groupId || ''}
                changed={(event) => this.inputChangedHandler(event)}
				wrapperClasses="form-group"
				classes="form-control" />
       
        if (Groups.isLoaded) {
            if (Groups.groups.length) {
                content = dropdownGroups;
            } else {
                content = <div className="alert alert-warning">No groups yet</div>
            }
        }

        return (
            <div>
                {content} 
                <Actions />
                <h4>Add New Group</h4>
                <AddGroup />
            </div>            
        );
    }

}

export default Groups;
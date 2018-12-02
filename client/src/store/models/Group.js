import { observable, computed } from 'mobx';
import { persist } from 'mobx-persist';

class Group {
	@persist @observable _id = null;
	@persist @observable name = null;
    @persist('array') @observable users = [];
    @persist('array') @observable actions = [];
}

export default Group;

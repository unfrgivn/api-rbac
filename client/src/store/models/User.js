import { observable, computed } from 'mobx';
import { persist } from 'mobx-persist';

class User {
	@persist @observable _id = null;
	@persist @observable username = null;
	@persist @observable name = null;
	@persist('object') @observable data = {};
}

export default User;

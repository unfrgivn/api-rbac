import { observable, action } from 'mobx';

class Store {
	@observable showSideDrawer = false;
	@observable messages = [];

	/**
	 * Replaces any existing messages
	 */
	@action setMessage = (messageText, messageType) => {
		this.clearMessages();

		this.addMessage(messageText, messageType);
	}

	@action addMessage = (messageText, messageType) => {		
		this.messages.push({
			text: messageText,
			type: messageType,
		});
	}

	@action clearMessages = () => {
		this.messages = [];
	}
}

export default new Store();

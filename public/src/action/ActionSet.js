export default class ActionSet {

	constructor (identifier, dispatcher) {
		this.identifier = identifier;
		this.dispatcher = dispatcher;		
	}


	addAction (actionName, listener) {
		this[actionName] = (...args) => {			
			listener && listener(...args);
			this.dispatcher.dispatch({
				action: `${this.identifier}.${actionName}`,
				params: [...args]
			});
		}
	}


	addAsyncAction (actionName, onStart, onComplete) {
		this.addAction(actionName, onStart);
		this[actionName].completed = (...args) => {			
			this.dispatcher.dispatch({
				action: `${this.identifier}.${actionName}Completed`,
				params: [...args]
			});
		}
	}
	
}
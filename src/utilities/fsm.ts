import { EventManager } from "./event";

export abstract class State<States extends string> {
	readonly name: States;
	readonly transitions: Set<States>;

	constructor(name: States, transitions: States[] = []){
		this.name = name;
		this.transitions = new Set(transitions);
	}

	abstract onEnter(context: unknown): void;
	abstract onExit(context: unknown): void;
	abstract onUpdate(context: unknown): void;
}

type EventCallback = (context: unknown) => void;

type StateEvent<key extends string> = {
	"onEnter": { name: key, context: unknown };
	"onExit": { name: key, context: unknown };
	"onUpdate": { name: key, context: unknown };
	"onTransition": { from: key | null, to: key | null, context: unknown };
};

export class FiniteStateMachine<key extends string> {
	private current: State<key> | null = null;
	private states: Map<key, State<key>> = new Map();
	private events: EventManager<StateEvent<key>> = new EventManager();

	constructor(...states: State<key>[]){
		for(const state of states){
			this.addState(state);
		}
	}

	get currentState(): State<key> | null { return this.current; }

	private enter(state: State<key>, context: unknown): void {
		this.current = state;
		this.current.onEnter(context);
		this.events.emit("onEnter", { name: this.current.name, context });
	}

	private exit(context: unknown): void {
		if(this.current === null){ return; }

		this.current.onExit(context);
		this.events.emit("onExit", { name: this.current.name, context });
		this.current = null;
	}

	update(context: unknown): void {
		if(this.current === null){ return; }

		this.current.onUpdate(context);
		this.events.emit("onUpdate", { name: this.current.name, context });
	}

	private transition(next: State<key> | null, context: unknown): void {
		const from = this.current?.name ?? null;
		const to = next?.name ?? null;

		this.exit(context);

		this.events.emit("onTransition", { from, to, context });

		if(next !== null){
			this.enter(next, context);
		}
	}

	transitionTo(name: key | null, context: unknown): boolean {
		if(name === null){ this.transition(null, context); return true; }

		const nextState = this.states.get(name);
		if(nextState === undefined){ return false; }

		if(this.current !== null && !this.current.transitions.has(nextState.name)){ return false; }

		this.transition(nextState, context);
		return true;
	}

	onEnter(state: key, callback: EventCallback): void {
		this.events.on("onEnter", event => {
			if(event.name === state){
				callback(event.context);
			}
		});
	}

	onExit(state: key, callback: EventCallback): void {
		this.events.on("onExit", event => {
			if(event.name === state){
				callback(event.context);
			}
		});
	}

	onUpdate(state: key, callback: EventCallback): void {
		this.events.on("onUpdate", event => {
			if(event.name === state){
				callback(event.context);
			}
		});
	}

	onTransition(from: key, to: key, callback: EventCallback): void {
		this.events.on("onTransition", event => {
			if(event.from === from && event.to === to){
				callback(event.context);
			}
		});
	}

	addState(state: State<key>): void {
		this.states.set(state.name, state);
	}

	getState(name: key): State<key> | undefined {
		return this.states.get(name);
	}

	hasState(name: key): boolean {
		return this.states.has(name);
	}

	removeState(name: key): boolean {
		return this.states.delete(name);
	}
}
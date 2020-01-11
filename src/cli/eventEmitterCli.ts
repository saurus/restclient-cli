import { MyEventEmitter, MyEvent } from "../utils/myEventEmitter";

export class EventEmitterCli<T> implements MyEventEmitter<T> {
    fire(requestVariableEvent: T): void {
        // dummy
    }
    get event(): MyEvent<T> {
        return this.fDummy;
    }

    private fDummy(listener: (e: T) => any): any {};
}



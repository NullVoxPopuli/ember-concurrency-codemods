import { task } from 'ember-concurrency';

export class A {
    @task
    *foo() {
        yield Promise.resolve();
        let a = this;
    }
}
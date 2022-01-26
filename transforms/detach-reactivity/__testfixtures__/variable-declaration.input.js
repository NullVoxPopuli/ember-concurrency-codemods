import { task } from 'ember-concurrency';

export class A {
    @task
    *foo() {
        let a = this;
    }
}
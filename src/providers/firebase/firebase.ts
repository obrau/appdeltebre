import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';

import { QueryModel } from '../../models/query';

@Injectable()
export class FirebaseProvider {

  constructor(public db: AngularFireDatabase) {}

  list(path: string, query?: QueryModel): Observable<any[]> {
    return this.db.list(path, ref => query ? this.queryFn(ref, query) : ref).snapshotChanges().map(changes => {
      return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
    });
  }

  listOnce(path: string, query?: QueryModel): Observable<any[]> {
    return this.db.list(path, ref => query ? this.queryFn(ref, query) : ref).snapshotChanges().take(1).map(changes => {
      return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
    });
  }

  listValues(path: string, query?: QueryModel): Observable<any[]> {
    return this.db.list(path, ref => query ? this.queryFn(ref, query) : ref).valueChanges();
  }
  
  object(path: string): Observable<any> {
    return this.db.object(path).snapshotChanges().map(change => {
      return ({key: change.payload.key, ...change.payload.val()});
    });
  }

  objectOnce(path: string): Observable<any> {
    return this.db.object(path).snapshotChanges().take(1).map(change => {
      return ({key: change.payload.key, ...change.payload.val()});
    });
  }

  property(path: string): Observable<any> {
    return this.db.object(path).snapshotChanges().map(change => {
      return ({key: change.payload.key, value: change.payload.val()});
    });
  }

  propertyOnce(path: string): Observable<any> {
    return this.db.object(path).snapshotChanges().take(1).map(change => {
      return ({key: change.payload.key, value: change.payload.val()});
    });
  }

  propertyValue(path: string): Observable<any> {
    return this.db.object(path).snapshotChanges().map(change => {
      return (change.payload.val());
    });
  }

  propertyValueOnce(path: string): Observable<any> {
    return this.db.object(path).snapshotChanges().take(1).map(change => {
      return (change.payload.val());
    });
  }

  getPushKey(path: string): string {
    return this.db.database.ref(path).push().key;
  }
  
  push(path: string, data: any): any {
    return this.db.list(path).push(data);
  }

  multiplePush(mainPath: string, paths: string[], data: any): Promise<void> {
    var hash = this.db.database.ref(mainPath).push().key;
    var updates = {};
    paths.map(path => updates[path + '/' + hash] = data);
    console.log(updates);

    return this.db.database.ref().update(updates);
  }

  set(path: string, key: string, data: any): Promise<void> {
    return this.db.list(path).set(key, data);
  }

  update(path: string, key: string, data: any): Promise<void> {
    return this.db.list(path).update(key, data);
  }

  multipleUpdate(paths: string[], key: string, data: any): Promise<any> {
    var updates = {};
    paths.map(path => updates[path + '/' + key] = data);
    return this.directUpdate(updates);
  }

  directUpdate(updates: any): Promise<any> {
    return this.db.database.ref().update(updates);
  }

  remove(path: string, key: string): Promise<void> {
    return this.db.list(path).remove(key);
  }

  removeAll(path: string): Promise<void> {
    return this.db.list(path).remove();
  }

  /**
   * firebase rtdb query, should follow query combinations(https://github.com/angular/angularfire2/blob/master/docs/rtdb/querying-lists.md#creating-a-query-with-primitivescalar-values)
   */
  private queryFn(ref: firebase.database.Reference, query: QueryModel): firebase.database.Query {
    let q: any;
    if (query.orderByChild)
      q = ref.orderByChild(query.orderByChild);
    if (query.orderByKey)
      q = (q || ref).orderByKey();
    if (query.orderByValue)
      q = (q || ref).orderByValue();
    if (query.equalTo)
      q = (q || ref).equalTo(query.equalTo);
    if (query.limitToFirst)
      q = (q || ref).limitToFirst(query.limitToFirst);
    if (query.limitToLast)
//      q = (q || ref).limitToFirst(query.limitToLast);
      q = (q || ref).limitToLast(query.limitToLast);
    if (query.startAt)
      q = (q || ref).startAt(query.startAt);
    if (query.endAt)
//      q = (q || ref).startAt(query.endAt);
      q = (q || ref).endAt(query.endAt);

    return q || ref;
  }
}
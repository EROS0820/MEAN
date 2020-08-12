/**
 * Working with Local Storage API
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  private set(name, data) {
    return window.localStorage.setItem(name, JSON.stringify(data));
  }

  private get(name) {
    const data = window.localStorage.getItem(name);
    if (data) { return JSON.parse(data); } else { return null; }
  }

  saveAgentID(id) {
    return this.set('agent_id', id);
  }

  getAgentID() {
    return this.get('agent_id');
  }

  saveUser(data) {
    return this.set('user', data);
  }

  saveQBonus(qb) {
    return this.set('qbonus', qb);
  }

  saveAdminUser(data) {
    return this.set('admin_user', data);
  }

  getUser() {
    return this.get('user');
  }

  getQBonus() {
    return this.get('qbonus');
  }

  getAdminUser() {
    return this.get('admin_user');
  }

  destroyUser() {
    return window.localStorage.removeItem('user');
  }

  destroyAdminUser() {
    return window.localStorage.removeItem('admin_user');
  }
}

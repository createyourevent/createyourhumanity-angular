import { Injectable } from '@angular/core';
import {  Config } from './config.interface';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: Config = {
    documentUrl: 'http://localhost:9000/api/mindmaps/{id}/false',
    revertUrl: '/c/restful/maps/{id}/history/latest',
    lockUrl: '/c/restful/maps/{id}/lock'
  };

  getConfig(): Config {
    return this.config;
  }
}

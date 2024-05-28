import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service' // Dienst für Konfigurationsdaten
import { CreateYourHumanityPersistenceManager } from '@wisemapping/mindplot';

@Injectable({
  providedIn: 'root'
})
export class PersistenceManagerService {
  private persistenceManager: CreateYourHumanityPersistenceManager;

  constructor(private http: HttpClient, private configService: ConfigService) {
    const config = this.configService.getConfig();
    this.persistenceManager = new CreateYourHumanityPersistenceManager({
      documentUrl: config.documentUrl,
      revertUrl: config.revertUrl,
      lockUrl: config.lockUrl
    });
  }

  saveMapXml(mapId: string, mapXml: Document, pref: string, saveHistory: boolean): Observable<any> {
    return new Observable<any>((observer) => {
      const events = {
        onSuccess: () => observer.next(),
        onError: (error: any) => observer.error(error)
      };

      this.persistenceManager.saveMapXml(mapId, mapXml, pref, saveHistory, events);
    });
  }

  discardChanges(mapId: string): Observable<any> {
    return new Observable<any>((observer) => {
      this.persistenceManager.discardChanges(mapId);
      observer.next();
    });
  }

  unlockMap(mapId: string): Observable<any> {
    return new Observable<any>((observer) => {
      this.persistenceManager.unlockMap(mapId);
      observer.next();
    });
  }

  loadMapDom(mapId: string): Observable<Document> {
    return new Observable<Document>((observer) => {
      try {
        const mapDom = this.persistenceManager.loadMapDom(mapId);
        observer.next(mapDom);
      } catch (error) {
        observer.error(error);
      }
    });
  }
}

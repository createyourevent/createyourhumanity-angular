import { PersistenceManager } from '@wisemapping/mindplot';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ConfigService } from 'app/config.service';
import { MindmapService } from 'app/entities/mindmap/service/mindmap.service';
import { IMindmap, Mindmap } from 'app/entities/mindmap/mindmap.model';
import dayjs from 'dayjs/esm';
import { Document }  from '@wisemapping/mindplot';
import XMLSerializerFactory  from '@wisemapping/mindplot';

export class MongoDBPersistenceManager extends PersistenceManager {

  constructor(private mindmapService: MindmapService) {
    super();
  }


  async load(mapId: string): Promise<IMindmap> {
    mapId = "5f5051702873000001858806";
    const domDocument = await this.loadMapDom(mapId);
    return MongoDBPersistenceManager.loadFromDom(mapId, domDocument);
  }

  static loadFromDom(mapId: string, mapDom: Document): Mindmap {

    const serializer = XMLSerializerFactory.createInstanceFromDocument(mapDom);
    const mindmap: Mindmap = serializer.loadFromDom(mapDom, mapId);
    return mindmap;

  }

  async loadMapDom(mapId: string): Promise<Document> {
    try {
      const xmlDataAsString = await this.getMapXmlAsString(mapId);
      const parser = new DOMParser();
      const xmldoc = parser.parseFromString(xmlDataAsString, 'application/xml');

      // Überprüfen Sie, ob xmldoc.documentElement definiert ist
      if (xmldoc.documentElement) {
        return xmldoc;
      } else {
        throw new Error('Invalid XML document');
      }
    } catch (error) {
      console.error('Error loading map DOM:', error);
      throw new Error('Failed to load map DOM');
    }
  }

  private async getMapXmlAsString(mapId: string): Promise<string> {
    try {
      const observable = this.loadMapXmlFromMongoDB(mapId);
      const xmlData = await observable.toPromise();
      return xmlData;
    } catch (error) {
      console.error('Error loading map XML:', error);
      throw new Error('Failed to load map XML');
    }
  }

  private loadMapXmlFromMongoDB(mapId: string): Observable<string> {
    return this.mindmapService.query().pipe(
      map(mindmap => mindmap.body[0].text)
    );
  }

  saveMapXml(mapId: string, mapXml: Document): Observable<any> {
    const mapXmlString = new XMLSerializer().serializeToString(mapXml);
    const today = dayjs().startOf('day');
    const iMindmap: IMindmap = {
      id: mapId,
      text: mapXmlString,
      modified: today,
    };

    return this.mindmapService.partialUpdate(iMindmap).pipe(
      map(() => {}), // Hier können Sie den Erfolgsfall behandeln
      catchError((error) => {
        // Hier können Sie den Fehlerfall behandeln
        console.error('Error saving map:', error);
        return throwError(error);
      })
    );
  }

}


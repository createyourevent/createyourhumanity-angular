import { Component } from '@angular/core';
import { PersistenceManager} from '@wisemapping/mindplot';
import { Mindmap } from 'app/entities/mindmap/mindmap.model';
import { MindmapService } from 'app/entities/mindmap/service/mindmap.service';
import { MaincontrollerService } from 'app/maincontroller.service';
import  * as dayjs from 'dayjs';
import $ from 'jquery';




class MongoStorageManager extends PersistenceManager {
  private document: string;

  private forceLoad: boolean;

  private readOnly: boolean;

  private xml: Document;

  constructor(documentUrl: string, forceLoad: boolean, readOnly = true, private mindmapService: MindmapService, private maincontrollerService: MaincontrollerService) {
    super();
    this.document = documentUrl;
    this.forceLoad = forceLoad;
    this.readOnly = readOnly;
  }

  saveMapXml(mapId: string, mapDoc: Document, _pref: string, _saveHistory: boolean, events): void {
    const mapXml = new XMLSerializer().serializeToString(mapDoc);
    if (!this.readOnly) {
      this.mindmapService.find(mapId).subscribe(r => {
        const mm: Mindmap = r.body;
        mm.text = mapXml;
        this.mindmapService.update(mm).subscribe();
      });
      events.onSuccess();
    }
    console.log(`Map XML to save => ${mapXml}`);
  }

  discardChanges(mapId: string) {
    if (!this.readOnly) {
      localStorage.removeItem(`${mapId}-xml`);
    }
  }



  loadMapDom(mapId: string) {
      this.xml = $.parseXML(this.document);
      // If I could not load it from a file, hard code one.
      if (this.xml == null) {
        throw new Error(`Map could not be loaded with id:${mapId}`);
      }
      return this.xml;
  }

  unlockMap(): void {
    // Ignore, no implementation required ...
  }
}

export default MongoStorageManager;

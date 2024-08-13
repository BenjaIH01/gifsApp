import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces';
import { tap } from 'rxjs';

const GIPHY_API_KEY: string = 'm5V24qgMuVEO0C4TTehK31jDJNxgxhNS';
const BASE_URL:      string = `https://api.giphy.com/v1/gifs/search`

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _tagHistory: string[] = [];
  public _gifList:    Gif[] = [];

  constructor(private httpClient: HttpClient) {
    this.loadFromLocalStorage();
  }

  get tagsHistory(): string[] {
    return [...this._tagHistory];
  }

  searchTag( tag: string ) {
    if(tag.length === 0) return;
    this.organizeHistory( tag );
    this.getGifs( tag );

    // fetch('https://api.giphy.com/v1/gifs/search?api_key=m5V24qgMuVEO0C4TTehK31jDJNxgxhNS&q=valorant&limit=10')
    //   .then( resp => resp.json() )
    //   .then( data => console.log( data ))
  }

  getGifs( tag: string ): void {
    const params = new HttpParams()
      .set('api_key', GIPHY_API_KEY)
      .set('limit', '10')
      .set('q', tag);

    this.httpClient.get<SearchResponse>(`${BASE_URL}`, { params })
      .subscribe( response =>  {
        this._gifList = response.data;
      })
  }

  private organizeHistory( newTag: string ): void {

    newTag = newTag.toLowerCase();

    if(this._tagHistory.includes(newTag)) {
      this._tagHistory = this._tagHistory.filter(tag => tag !== newTag);
    }

    this._tagHistory.unshift(newTag);
    this._tagHistory = this._tagHistory.splice(0,10);

    this.saveLocalStorage();

  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagHistory));
  }

  private loadFromLocalStorage(): void {

    const temporary = localStorage.getItem('history');

    if(!temporary) return;
    this._tagHistory = JSON.parse(temporary);

    if(this._tagHistory.length === 0) return;
    this.searchTag(this._tagHistory[0]);
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class SampleService {

	constructor(private http: HttpClient) {
	}

	public getBookloads() {
		const url = `/api/v1/aviation/bookloads`;
		return this.http.get(url);
	}

}

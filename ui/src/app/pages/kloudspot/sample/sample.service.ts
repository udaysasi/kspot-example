import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class SampleService {

	constructor(private http: HttpClient) {
	}

	public getSites() {
		const url = `/api/v1/location/sites`;
		return this.http.get(url);
	}

}

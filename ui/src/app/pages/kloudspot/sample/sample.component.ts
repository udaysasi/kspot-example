import { Component, OnInit } from '@angular/core';
import { SampleService } from './sample.service'

@Component({
  selector: 'fury-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements OnInit {
	
	bookloadsData: any = {};
	 constructor(
        private sampleService: SampleService
    ) {}
    
    ngOnInit(): void {
		this.sampleService.getBookloads().subscribe((response) => {
			this.bookloadsData = response;
		});
	}
}

import { Component, OnInit } from '@angular/core';
import { SampleService } from './sample.service'

@Component({
	selector: 'fury-sample',
	templateUrl: './sample.component.html',
	styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements OnInit {

	sitesData: any = {};
	error: boolean = false;
	socket: any;

	constructor(
		private sampleService: SampleService
	) { }

	ngOnInit(): void {
		this.sampleService.getSites().subscribe((response) => {
			this.sitesData = response;

			this.error = response['error'];

			if (!this.error) {
				this.sitesData = response['data'];
			}
		});
		
		this.setupSocket();
	}

	setupSocket() {
		this.socket = new WebSocket('wss://walker.kloudspot.com/advanced/websocket');
		/*
		this.socket.onopen = (event) => {
			console.log(event);
			this.socket.send('Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2MWlodnRsZ2NkaXVsdDExbGhqdGNhX2dod2tjN2I3bGN5dGFzbHJwYmF1IiwiYXV0aCI6IlJPTEVfQURNSU4iLCJpZCI6IjY1MTczMmY0MTE2ZDRlNWYyNWYzYzA4NSIsImV4cCI6MTcxNjQxMjg3MX0.RfHHj5jTTo6Q5d3Ev2wKfxoW6JLa4dWqjQSspPSaltucyliHDZ8BBFzwO4B_2bJiavi_psWyvXw-o7Eogsevwg');
			setTimeout(() => {
				this.socket.send("Here's some text that the server is urgently awaiting!");	
			}, 1000);
		};*/
		//this.socket.send('Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2MWlodnRsZ2NkaXVsdDExbGhqdGNhX2dod2tjN2I3bGN5dGFzbHJwYmF1IiwiYXV0aCI6IlJPTEVfQURNSU4iLCJpZCI6IjY1MTczMmY0MTE2ZDRlNWYyNWYzYzA4NSIsImV4cCI6MTcxNjQxMjg3MX0.RfHHj5jTTo6Q5d3Ev2wKfxoW6JLa4dWqjQSspPSaltucyliHDZ8BBFzwO4B_2bJiavi_psWyvXw-o7Eogsevwg');
		this.socket.addEventListener('open', () => {
			console.log('CONNECTED');
			this.socket.send('Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2MWlodnRsZ2NkaXVsdDExbGhqdGNhX2dod2tjN2I3bGN5dGFzbHJwYmF1IiwiYXV0aCI6IlJPTEVfQURNSU4iLCJpZCI6IjY1MTczMmY0MTE2ZDRlNWYyNWYzYzA4NSIsImV4cCI6MTcxNjQxMjg3MX0.RfHHj5jTTo6Q5d3Ev2wKfxoW6JLa4dWqjQSspPSaltucyliHDZ8BBFzwO4B_2bJiavi_psWyvXw-o7Eogsevwg');
			/*
			setTimeout(() => {
				this.socket.send("Here's some text that the server is urgently awaiting!");	
			}, 1000);
			*/
		});
		this.socket.addEventListener('close', () => {
			console.log('DISCONNECTED');
		});
		this.socket.addEventListener('error', (err) => {
			console.log('SOCKET ERROR OCCURRED', err);
		});
		this.socket.addEventListener('message', (msg) => {
			console.log('RECEIVED:' + msg.data);
		});
	}
}

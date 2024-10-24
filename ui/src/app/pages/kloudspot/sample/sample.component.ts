import { Component, OnDestroy, OnInit } from '@angular/core';
import { SampleService } from './sample.service'
import { SocketService } from 'src/app/services/socket.service';
import { Message } from '@stomp/stompjs';

@Component({
	selector: 'fury-sample',
	templateUrl: './sample.component.html',
	styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements OnInit, OnDestroy {

	sitesData: any = {};
	error: boolean = false;
	socket: any;
	//subscriptionId: string = String(Math.floor(10000*Math.random()));
	topic: string = '/user/queue/ruleNotifications';

	messages: string[] = [];

	constructor(
		private sampleService: SampleService,
		private socketService: SocketService
	) { 
		
	}

	ngOnInit(): void {
		this.sampleService.getSites().subscribe((response) => {
			this.sitesData = response;

			this.error = response['error'];

			if (!this.error) {
				this.sitesData = response['data'];
			}
		});

		this.socketService.connect();

		this.socketService.isConnected().subscribe((connected) => {
			if (connected) {
				this.socketService.subscribe(this.topic, (message: Message) => {
					console.log('Received message:', message.body);
					this.messages.push(message.body);
				});
				
				this.sendMessage();
			}
		});
	}


	sendMessage() {
		const messageBody = { "type": "RuleNotificationsCriteria" };
		this.socketService.publish('/app/ruleNotifications/subscribe', messageBody);
	}

	ngOnDestroy() {
		this.socketService.unsubscribe(this.topic);
		this.socketService.disconnect();
	}
	
}

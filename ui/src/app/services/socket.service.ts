import { Injectable } from '@angular/core';
import { Client, Message, IFrame, StompSubscription } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SocketService {
	private client: Client;
	private isConnected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	private subscriptions = new Map<string, StompSubscription>();

	constructor() {
		this.client = new Client({
			brokerURL: 'ws://localhost:3090/websocket',
			connectHeaders: {
				// Add any required headers here
			},
			reconnectDelay: 5000,
			debug: (str) => {
				console.log('STOMP debug:', str);
			},
			onConnect: (frame: IFrame) => {
				console.log('Connected to WebSocket proxy');
				this.isConnected$.next(true);
			},
			onDisconnect: (frame) => {
				console.log('Disconnected:', frame);
				this.isConnected$.next(false);
			},
			onStompError: (frame) => {
				console.error('Broker error:', frame.headers['message']);
			},
		});
	}

	connect() {
		this.client.activate();
	}

	subscribe(destination: string, callback: (message: Message) => void) {

		if (this.subscriptions.has(destination)) {
			console.log(`Already subscribed to ${destination}`);
			return; // If already subscribed to this destination, do nothing
		}

		this.isConnected$.subscribe((connected) => {
			const subscription = this.client.subscribe(destination, (message) => {
				callback(message);
			});
			// Store the subscription by ID
			this.subscriptions.set(destination, subscription);
		});
	}

	unsubscribe(destination: string) {
		const subscription = this.subscriptions.get(destination);
		if (subscription) {
			subscription.unsubscribe();
			this.subscriptions.delete(destination);
		} else {
			console.warn(`No subscription found for destination: ${destination}`);
		}
	}

	publish(destination: string, body: any) {
		this.isConnected$.subscribe((connected) => {
			if (connected) {
				this.client.publish({
					destination,
					body: JSON.stringify(body),
				});
			}
		});
	}

	disconnect() {
		this.client.deactivate();
		this.subscriptions.clear();
	}

	isConnected(): Observable<boolean> {
		return this.isConnected$.asObservable();
	}
}

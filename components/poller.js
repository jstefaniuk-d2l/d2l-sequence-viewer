import { LitElement, html } from 'lit-element';

// pollInterval is in ms
class Poller extends LitElement {
	static get properties() {
		return {
			poll: { type: Boolean },
			pollInterval: { type: Number },
			intervalID: { type: Number }
		};
	}

	constructor() {
		super();

		this.poll = false;
		this.pollInterval = 10000;
		this.intervalID = 0;
	}

	connectedCallback() {
		super.connectedCallback();
		this.intervalID = setInterval(this.pollEvent.bind(this), this.pollInterval);
	}

	disconnectedCallback() {
		clearInterval(this.intervalID);
		super.disconnectedCallback();
	}

	render() {
		return html``;
	}

	pollEvent() {
		if (this.poll) {
			const event = new CustomEvent('d2l-sequence-viewer-poll', {
				message: 'youve been polled'
			});
			this.dispatchEvent(event);
		}
	}
}

customElements.define('poller', Poller);

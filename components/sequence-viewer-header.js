import '@polymer/polymer/polymer-legacy.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-colors/d2l-colors.js';
import 'd2l-icons/d2l-icons.js';
import 'd2l-icons/tier2-icons.js';
import 'd2l-icons/tier3-icons.js';
import 'd2l-typography/d2l-typography.js';
import 'd2l-sequences/components/d2l-sequences-iterator.js';
import 'd2l-sequences/components/d2l-sequences-topic-name.js';
import { IronA11yAnnouncer } from '@polymer/iron-a11y-announcer/iron-a11y-announcer.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
/**
* @polymer
* @customelement
* @extends Polymer.Element
* @extends Polymer.mixinBehaviors
* @appliesMixin D2L.PolymerBehaviors.Siren.EntityBehavior
*/
class D2LSequenceViewerHeader extends mixinBehaviors([D2L.PolymerBehaviors.Siren.EntityBehavior], PolymerElement) {
	static get template() {
		return html`
		<style>
			:host {
				display: flex;
				flex-flow: row wrap;
				align-items: center;
				width: 100%;
				background-color: white;
			}
			.iterator-icon {
				width: 30px;
				font-size: 0px;
				display: block;
			}
			.flyout-divider {
				color: var(--d2l-color-corundum);
				height: 23px;
				width: 23px;
				min-width: 23px;
				font-size: 0px;
				display: block;
				margin: 0 18px 0 18px;
			}
			.back-to-module {
				@apply --d2l-body-small-text;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				padding-left: 8px;
				margin-left: 18px;
			}
			.topic-name {
				@apply --d2l-body-compact-text;
				text-align: center;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.pad-side {
				flex: 1 1 0px;
			}
			.pad-mid {
				flex: 0 0 1170px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 30px 0 30px;
				margin-left: auto;
				margin-right: var(--d2l-viewframe-margin-right, auto);
			}
			#sidebar, .nav-buttons {
				display: flex;
				align-items: center;
			}
			#sidebar {
				margin-left: 30px;
			}
			:host([is-sidebar-open]) #sidebar {
				width: 310px;
				border-right: 1px solid var(--d2l-color-mica);
			}
			.nav-buttons {
				margin-right: 30px;
			}
			.nav-buttons > * {
				margin: 0 18px 0 18px;
			}
			@media(max-width: 1230px) {
				.pad-side {
					flex: 0 0 0px;
				}
				.pad-mid {
					flex: 1 1 300px;
					display: flex;
					align-items: center;
				}
			}
			@media(max-width: 720px) {
				.hidden-small {
					display: none;
				}
			}
			h1 {
				@apply --d2l-body-compact-text;
			}
		</style>
		<div class="pad-mid">
			<div id="sidebar">
				<div class="back-to-module">
					<slot name="d2l-back-to-module"></slot>
				</div>
				<d2l-icon class="flyout-divider hidden-small" icon="d2l-tier2:divider-big"></d2l-icon>
				<slot name="d2l-flyout-menu" d2l-flyout-menu=""></slot>
			</div>
			<div class="nav-buttons">
				<d2l-sequences-iterator class="iterator-icon prev-button" current-activity="{{href}}" href="[[previousActivityHref]]" token="[[token]]" icon="d2l-tier3:chevron-left-circle" previous=""></d2l-sequences-iterator>
				<d2l-sequences-iterator class="iterator-icon next-button" current-activity="{{href}}" href="[[nextActivityHref]]" token="[[token]]" icon="d2l-tier3:chevron-right-circle" next=""></d2l-sequences-iterator>
			</div>
		</div>
`;
	}

	static get is() {
		return 'd2l-sequence-viewer-header';
	}
	static get properties() {
		return {
			href: {
				type: String,
				reflectToAttribute: true,
				notify: true
			},
			nextActivityHref: {
				type: String,
				computed: '_getNextActivityHref(entity)'
			},
			previousActivityHref: {
				type: String,
				computed: '_getPreviousActivityHref(entity)'
			},
			isSidebarOpen: {
				type: Boolean,
				reflectToAttribute: true
			},
		};
	}
	connectedCallback() {
		super.connectedCallback();
		IronA11yAnnouncer.requestAvailability();
		this.mode = 'polite';
	}

	_getNextActivityHref(entity) {
		const nextActivityHref = entity && entity.getLinkByRel('https://sequences.api.brightspace.com/rels/next-activity') || '';
		return nextActivityHref.href || null;
	}

	_getPreviousActivityHref(entity) {
		const previousActivityHref = entity && entity.getLinkByRel('https://sequences.api.brightspace.com/rels/previous-activity') || '';
		return previousActivityHref.href || null;
	}

}
customElements.define(D2LSequenceViewerHeader.is, D2LSequenceViewerHeader);

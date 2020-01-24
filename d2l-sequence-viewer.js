import 'd2l-typography/d2l-typography.js';
import 'd2l-colors/d2l-colors.js';
import './components/sequence-viewer-header.js';
import './components/d2l-sequence-viewer-new-content-alert.js';
import './localize-behavior.js';
import '@polymer/polymer/polymer-legacy.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-link/d2l-link.js';
import 'd2l-sequences/d2l-sequence-navigator/d2l-sequence-navigator.js';
import 'd2l-sequences/d2l-sequence-navigator/d2l-lesson-header.js';
import 'd2l-sequences/d2l-sequence-navigator/d2l-sequence-end.js';
import 'd2l-sequences/components/d2l-sequences-content-router.js';
import 'd2l-navigation/d2l-navigation-button-notification-icon.js';
import 'd2l-navigation/d2l-navigation-band.js';
import 'd2l-navigation/d2l-navigation-link-back.js';
import 'polymer-frau-jwt/frau-jwt-local.js';
import 'd2l-polymer-siren-behaviors/store/siren-action-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import TelemetryHelper from './helpers/telemetry-helper.js';
import PerformanceHelper from './helpers/performance-helper.js';

/*
* @polymer
* @customElement
* @extends Polymer.Element
* @appliesMixin D2L.PolymerBehaviors.Siren.EntityBehavior
* @appliesMixin D2L.PolymerBehaviors.SequenceViewer.LocalizeBehavior
*/

class D2LSequenceViewer extends mixinBehaviors([
	D2L.PolymerBehaviors.Siren.EntityBehavior,
	D2L.PolymerBehaviors.Siren.SirenActionBehaviorImpl,
	D2L.PolymerBehaviors.SequenceViewer.LocalizeBehavior,
], PolymerElement) {
	static get template() {
		return html`
		<custom-style include="d2l-typography">
			<style is="custom-style" include="d2l-typography">
				:host {
					--viewer-max-width: 1170px;
					--sidebar-position: calc(50% - var(--viewer-max-width) / 2);

					display: block;
					color: var(--d2l-color-ferrite);
					@apply --d2l-body-standard-text;
					position: relative;
					width: 100%;
					display: flex;
					flex-direction: column;
					min-width: 100vw;
					height: 100vh;
					overflow: hidden;
				}
				.back-icon {
					padding-bottom: 0.2rem;
					height: 60px;
					font-size: 0px;
					display: inline-block;
				}
				.topbar {
					position: fixed;
					top: 4px;
					width: 100%;
					height: 30px;
					z-index: 3;
					box-shadow: 2px 0px 3px 2px rgba(214,220,229,0.5); /* 50% D6DCE5 */
					flex-flow: row;
				}
				#sidebar-occlude {
					width: calc(var(--sidebar-position) - 25px);
					height: 100%;
					background: white;
					position: fixed;
					top: 56px;
					left: 0px;
					z-index: 2;
				}
				#sidebar {
					overflow-y: none;
					width: 310px;
					height: calc(100% + 56px - 5px);
					position: fixed;
					z-index: 1;
					top: 56px;
					bottom: 0px;
					padding: 0px;
					background: white;
					left: calc(var(--sidebar-position) - 25px);
					transition: margin-left 0.5s;
				}
				#sidebar.offscreen {
					margin-left: -475px;
				}
				.viewer {
					position: relative;
					display: inline-block;
					width: 100%;
					height: calc(100% - 15px);
					padding-top: 5px;
					top: 56px;
					bottom: 0px;
					overflow-y: auto;
				}
				.viewframe {
					padding: 24px 30px 0 30px;
					max-width: var(--viewer-max-width);
					margin: auto;
					-webkit-transition: all 0.4s ease-in-out;
					-moz-transition: all 0.4s ease-in-out;
					-o-transition: all 0.4s ease-in-out;
					transition: all 0.4s ease-in-out;
					flex: 1 1 0px;
					width: 80%;
				}
				.viewframe:focus {
					outline: none;
				}
				.hide {
					display: none;
				}
				.flyout-icon {
					font-size: 0px;
					display: block;
					height: 50px;
				}
				.d2l-sequence-viewer-navicon-container {
					height: 50px;
				}
				d2l-sequence-navigator {
					flex: 1;
					--d2l-sequence-nav-padding: 30px;
				}
				@media(max-width: 1220px) {
					#sidebar {
						left: 0;
					}
				}
				@media(max-width: 929px) {
					#sidebar {
						width: 310px;
					}
					d2l-sequence-navigator {
						--d2l-sequence-nav-padding: 24px;
					}
					.viewframe {
						padding: 18px 24px 0 24px;
						height: calc(100vh - 40px - 8px - 4px - 18px);
					}
				}
				@media(max-width: 767px) {
					d2l-sequence-navigator {
						--d2l-sequence-nav-padding: 18px;
					}
					.viewframe {
						padding: 18px 18px 0 18px;
					}
				}
				@media(max-width: 405px) {
					#sidebar {
						width: calc(100% - 25px);
					}
				}
			</style>
		</custom-style>
		<frau-jwt-local token="{{token}}" scope="*:*:* content:files:read content:topics:read content:topics:mark-read"></frau-jwt-local>
		<d2l-navigation-band></d2l-navigation-band>
		<d2l-sequence-viewer-header class="topbar" href="{{href}}" token="[[token]]" role="banner" on-iterate="_onIterate" telemetry-client="[[telemetryClient]]" is-single-topic-view="[[_isSingleTopicView]]">
			<template is="dom-if" if="{{!_isSingleTopicView}}">
				<span slot="d2l-flyout-menu">
					<d2l-navigation-button-notification-icon icon="d2l-tier3:menu-hamburger" class="flyout-icon" on-click="_toggleSlideSidebar" aria-label$="[[localize('toggleNavMenu')]]">[[localize('toggleNavMenu')]]
					</d2l-navigation-button-notification-icon>
				</span>
			</template>
			<div slot="d2l-back-to-module" class="d2l-sequence-viewer-navicon-container">
				<d2l-navigation-link-back text="[[localize('backToContent')]]" on-click="_onClickBack" href="[[backToContentLink]]">
				</d2l-navigation-link-back>
			</div>
		</d2l-sequence-viewer-header>
		<div id="sidebar-occlude"></div>
		<div id="sidebar" class="offscreen">
			<d2l-sequence-navigator
				href="{{href}}"
				token="[[token]]"
				role="navigation"
				data-asv-css-vars="[[dataAsvCssVars]]"
				>
				<span slot="lesson-header">
					<d2l-lesson-header id="sidebarHeader"
									   href="[[_rootHref]]"
									   current-activity="{{href}}"
									   module-properties="[[_moduleProperties]]"
									   token="[[token]]">
					</d2l-lesson-header>
				</span>
				<span slot="end-of-lesson" on-click="_onEndOfLessonClick">
					<d2l-sequence-end href="[[_sequenceEndHref]]" token="[[token]]" current-activity="{{href}}" text="[[localize('endOfSequence')]]"></d2l-sequence-end>
				</span>
			</d2l-sequence-navigator>
		</div>
		<div id="viewframe" class="viewframe" on-click="_closeSlidebarOnFocusContent" role="main" tabindex="0">
			<d2l-sequences-content-router
				id="viewer"
				class="viewer"
				on-sequences-return-mixin-click-back="_onClickBack"
				href="{{href}}"
				token="[[token]]"
				redirect-cs=[[redirectCs]]
				cs-redirect-path=[[csRedirectPath]]
				no-redirect-query-param-string=[[noRedirectQueryParamString]]
				>
			</d2l-sequences-content-router>
		</div>
		<d2l-sequence-viewer-new-content-alert
			href-for-observing="[[href]]"
			latest-met-set-endpoint="[[latestMetSetEndpoint]]"
			token="[[token]]">
		</d2l-sequence-viewer-new-content-alert>
`;
	}

	static get is() {
		return 'd2l-sequence-viewer';
	}
	static get properties() {
		return {
			dataAsvCssVars: String,
			href: {
				type: String,
				reflectToAttribute: true,
				observer: '_hrefChanged',
				notify: true
			},
			_rootHref: {
				type: String,
				computed: '_getRootHref(entity)'
			},
			_sequenceEndHref: {
				type: String,
				computed: '_getSequenceEndHref(entity)'
			},
			title: {
				type: Object,
				computed: '_getTitle(entity)',
				observer: '_titleChanged'
			},
			getToken: {
				type: Object,
				computed: '_getToken(token)'
			},
			mEntity: {
				type: Object
			},
			_moduleProperties: {
				type: Object,
				value: function() {
					return {};
				}
			},
			returnUrl: {
				type: String
			},
			_isSingleTopicView: {
				type: Boolean,
				computed: '_getSingleTopicView(entity)'
			},
			/* The "back to content home" and "I'm done" buttons
			 * will take the user to this address.
			 */
			backToContentLink: {
				type: String,
				computed: '_getBackToContentLink(entity)'
			},
			_loaded: Boolean,
			_contentReady: Boolean,
			_blurListener: Function,
			_onPopStateListener: Function,
			_resizeNavListener: Function,
			redirectCs: Boolean,
			csRedirectPath: String,
			noRedirectQueryParamString: String,
			telemetryEndpoint: String,
			latestMetSetEndpoint: String,
			telemetryClient: {
				type: typeof TelemetryHelper,
				computed: '_getTelemetryClient(telemetryEndpoint)',
				value: function() {
					return new TelemetryHelper();
				}
			}
		};
	}
	static get observers() {
		return ['_pushState(href)', '_setLastViewedContentObject(entity)', '_onEntityChanged(entity)', '_onContentReady(entity)'];
	}
	ready() {
		super.ready();
		const styles =
			this.dataAsvCssVars && JSON.parse(this.dataAsvCssVars) ||
			JSON.parse(document.getElementsByTagName('html')[0].getAttribute('data-asv-css-vars'));
		const navBarStyles = JSON.parse(document.getElementsByTagName('html')[0].getAttribute('data-css-vars'));
		this.updateStyles({...styles, ...navBarStyles});
		this._resizeNavListener = this._resizeSideBar.bind(this);
		this._blurListener = this._closeSlidebarOnFocusContent.bind(this);
		this._onPopStateListener = this._onPopState.bind(this);
	}
	connectedCallback() {
		super.connectedCallback();
		// For ASV, the blur event is an indicator than an iframe took focus
		// from our full-screen application.  Currently, the only thing that
		// can do this is a content iframe.
		window.addEventListener('blur', this._blurListener);
		window.addEventListener('popstate', this._onPopStateListener);
		window.addEventListener('resize', this._resizeNavListener);
	}
	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('blur', this._blurListener);
		window.removeEventListener('popstate', this._onPopStateListener);
		window.removeEventListener('resize', this._resizeNavListener);
	}

	async _onEntityChanged(entity) {
		//entity is null or not first time loading the page
		if (!entity || this._loaded) {
			return;
		}

		// topic entity need to fetch module entity
		if (entity.hasClass('sequenced-activity')) {
			const moduleLink = entity.getLinkByRel('up').href;
			const result = await window.D2L.Siren.EntityStore.fetch(moduleLink, this.token);

			if (result && result.entity && result.entity.properties) {
				this.mEntity = result.entity;
				this._loaded = true;
			}
		} else {
			this.mEntity = entity;
			this._loaded = true;
			if (entity.properties.sideNavOpen) {
				this._sideBarOpen();
			}
		}

		if (!this._moduleProperties.title) {
			this._setModuleProperties(entity);
		}
	}

	_onContentReady(entity) {
		if (this._contentReady) {
			return;
		}

		if (!entity) {
			PerformanceHelper.perfMark('mark-api-call-start');
		} else {
			this._contentReady = true;
			PerformanceHelper.perfMark('mark-api-call-end');
			PerformanceHelper.perfMeasure('api-call-finish', 'mark-api-call-start', 'mark-api-call-end');
			this.telemetryClient.logPerformanceEvent('on-content-load', 'api-call-finish');
		}
	}

	_hrefChanged() {
		this.$.viewframe.focus();
	}

	_titleChanged(title) {
		document.title = title;
	}

	_pushState(href) {
		const stateObject = {
			href: href,
			app: D2LSequenceViewer.is
		};
		// check if history.state belongs to the sequence viewer
		if (history.state && history.state.app === D2LSequenceViewer.is) {
			// check if we've already executed pushState for this topic
			if (history.state.href !== href) {
				history.pushState(stateObject, null, '?url=' + encodeURIComponent(href) || '');
			}
		} else {
			// if it's the first state being pushed by sequence viewer, use replaceState.
			history.replaceState(stateObject, null, '?url=' + encodeURIComponent(href) || '');
		}
	}

	_getBackToContentLink(entity) {
		const defaultReturnUrl = entity && entity.getLinkByRel('https://sequences.api.brightspace.com/rels/default-return-url') || '';
		return this.returnUrl || defaultReturnUrl && defaultReturnUrl.href || document.referrer || '';
	}

	_getSingleTopicView(entity) {
		return !(entity) || entity.hasClass('single-topic-sequence') || false;
	}

	_getTelemetryClient(telemetryEndpoint) {
		return new TelemetryHelper(telemetryEndpoint);
	}

	_closeSlidebarOnFocusContent() {
		setTimeout(() => {
			if (document.hasFocus() && window.innerWidth <= 929) {
				this._sideBarClose();
			}
		}, 1);
	}

	_onPopState(event) {
		this.telemetryClient.logTelemetryEvent('browser-back-press');

		if (event.state && event.state.href) {
			this.href = event.state.href;
			event.preventDefault();
		}
	}

	_onClickBack() {
		this.telemetryClient.logTelemetryEvent('back-to-content');

		if (!this.backToContentLink) {
			return;
		}

		if (window.parent === window) {
			window.location.href = this.backToContentLink;
			return;
		}

		// If we're in an iframe we need to post a message to do the navigation for us
		window.parent.postMessage(JSON.stringify({
			eventType: 'd2l-sequence-viewer-return',
			returnUrl: this.backToContentLink
		}), '*');
	}

	_onIterate() {
		this.$.viewframe.focus();
	}

	_getTitle(entity) {
		return entity && entity.properties && entity.properties.title || '';
	}

	//function for refetching the jwt token
	_getToken(token) {
		return () => { return Promise.resolve(token); };
	}

	_toggleSlideSidebar() {
		if (this.$.sidebar.classList.contains('offscreen')) {
			this._sideBarOpen();
		} else {
			this._sideBarClose();
		}
	}

	_getRootHref(entity) {
		const rootLink = entity && entity.getLinkByRel('https://sequences.api.brightspace.com/rels/sequence-root');
		return rootLink && rootLink.href || '';
	}

	_getSequenceEndHref(entity) {
		const endOfSequenceLink = entity && entity.getLinkByRel('https://sequences.api.brightspace.com/rels/end-of-sequence');
		return endOfSequenceLink && endOfSequenceLink.href || '';
	}

	_setLastViewedContentObject(entity) {
		let action;
		const actionSubEntity = entity && entity.getSubEntityByRel('about');

		if (actionSubEntity) {
			action = actionSubEntity && actionSubEntity.getActionByName('set-last-viewed-content-object');
		} else {
			action = entity && entity.getActionByName('set-last-viewed-content-object');
		}

		if (action) {
			this.performSirenAction(action);
		}
	}

	async _setModuleProperties(entity) {
		let currEntity = entity;
		let response;
		let upLink = (currEntity.getLinkByRel('up') || {}).href;
		let currLink = (currEntity.getLinkByRel('self') || {}).href;

		while (upLink && upLink.includes('activity') && currLink !== this._rootHref) {
			response = await window.D2L.Siren.EntityStore.fetch(upLink, this.token);
			currEntity = response.entity;
			currLink = (currEntity.getLinkByRel('self') || {}).href;
			upLink = (currEntity.getLinkByRel('up') || {}).href;
		}
		const properties = {};
		Object.assign(properties, currEntity.properties);
		properties.title = properties.courseName;
		this._moduleProperties = properties;
	}

	_sideBarOpen() {
		const maxWidth = 1170;
		const sidebarWidth = Math.round((this.offsetWidth <= maxWidth ? this.offsetWidth : maxWidth) / 3);
		const offsetWidth = this.$$('#sidebar-occlude').offsetWidth;
		const marginLeft = `${sidebarWidth + offsetWidth}px`;
		if (this.mEntity && this.mEntity.properties
			&& this.mEntity.properties.sideNavOpen !== undefined
			&& window.innerWidth - offsetWidth > 929) {
			this.$$('#sidebar').style.width = sidebarWidth + 'px';
			this.$.viewframe.style.marginLeft = marginLeft;
			this.$.viewframe.style.marginRight = String(offsetWidth) + 'px';
		} else {
			this.$$('#sidebar').style.width = '310px';
			this.$.viewframe.style.marginLeft = 'auto';
			this.$.viewframe.style.marginRight = String(offsetWidth) + 'px';
		}
		this.$.sidebar.classList.remove('offscreen');

		this.telemetryClient.logTelemetryEvent('sidebar-open');
	}

	_sideBarClose() {
		// TODO: This a temp fix because this gets called EVERY click on the document,
		// regardless of state. Find a better solution to handle this.
		if (this.$.sidebar.classList.contains('offscreen')) {
			return;
		}

		const offsetWidth = this.$$('#sidebar-occlude').offsetWidth;
		this.$.sidebar.classList.add('offscreen');
		this.$.viewframe.style.marginLeft = 'auto';
		this.$.viewframe.style.marginRight = String(offsetWidth) + 'px';

		this.telemetryClient.logTelemetryEvent('sidebar-close');
	}

	_resizeSideBar() {
		if (this.$.sidebar.classList.contains('offscreen')) {
			this._sideBarClose();
		} else {
			this._sideBarOpen();
		}
	}

	_onEndOfLessonClick() {
		this.telemetryClient.logTelemetryEvent('end-of-lesson-press');
	}
}
customElements.define(D2LSequenceViewer.is, D2LSequenceViewer);

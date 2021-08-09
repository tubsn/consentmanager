class ConsentManager {

	constructor(settings) {
		this.load_config(settings);
		this.boot_cookie_manager();
	}


	load_config(settings) {

		this.cookieName = settings.cookieName || 'consentCookie';
		this.cookieExpireDays = settings.cookieExpireDays || 365;
		this.closeOnModalClick = settings.closeOnModalClick || false;

		this.consentHeadline = settings.headline || '<h3>Datenschutzeinstellungen</h3>';
		this.consentText = settings.text || '<p>Für Ihren Kompfort und zur Verbesserung unserer Angebote nutzen wir Cookies und andere Technologien. Diese können Sie hier deaktivieren:</p>';
		this.consentDetails = settings.details || '<small>Ihre Zustimmung können Sie jederzeit in den <a href="/datenschutz">Datenschutz</a>-Einstellungen widerrufen.</small>';

		let defaultFields = {
			tracking : 'Nutzerdaten Analyse - <i>Wir möchten lernen, was Sie bei uns interessiert</i>',
			marketing: 'Marketingdaten - <i>Helfen Sie uns relevantere Angebote zu erstellen</i>'
		}

		this.consentFields = settings.fields || defaultFields;

	}

	boot_cookie_manager() {

		this.cookie = new FlundrCookieManager(this.cookieName, this.cookieExpireDays);
		if (this.cookie.exists) {return;} // nothing to do if Consent is already Set

		this.firstLaunch = true;

		let _this = this;
		document.addEventListener("DOMContentLoaded", function(){
			_this.show_consent_layer();
		});

	}

	show() {this.show_consent_layer();}

	show_consent_layer() {
		let container = this.consent_modal_DOM();
		this.body = document.querySelector('body');
		this.body.appendChild(container);
	}

	status(consentType) {
		return this.get_consent(consentType);
	}

	get_consent(consentType) {
		let content = this.cookie.content;
		if (!content) { return false;}
		return content[consentType];
	}

	set_consent(consentType, value) {
		let content = this.cookie.content;

		if (!content) {
			this.cookie.content = {[consentType] : value};
			return;
		}

		content[consentType] = value;
		this.cookie.content = content;

	}

	save_status(elements) {

		let consent = {};
		elements.forEach((element) => {
			let name = element.getAttribute('name');
			let status = element.checked;
			consent[name] = status;
		});
		this.cookie.content = consent;

	}

	reset() {
		this.cookie.delete();
	}



	convert_to_form(fields) {

		let htmlString = '';

		for (const name in fields) {

			let checked = this.status(name);
			if (this.firstLaunch) {checked = true;}

			htmlString += `
			<label>
				<input class="consent-checkbox" name="${name}" type="checkbox" ${checked ? 'checked' : ''}>
				${fields[name]}
			</label>
			`;

		}

		return htmlString;

	}


	styles() {

		return `

			<style>
			.consent-wrapper {position:fixed; top:0; left:0; z-index:99999; display:grid; width:100vw; height:100vh; background-color:rgba(0,0,0,0.5);}
			.consent-modal {align-self: center; justify-self: center; background-color:#f6f6f6;
				border: 0.2em solid white; padding:1.5em 2em; max-width:800px; width:70%; border-radius:0.5em;
				box-shadow: .5em .5em .7em .3em rgba(0,0,0,0.4);
			}

			.consent-modal-body h3 {margin-top:0;}

			.consent-dialog-buttons {text-align:right; margin-top:1em}
			.consent-dialog-buttons button {background:#3867b1; color:white; border:0; display:inline; padding:.4em .6em 0.45em 0.6em; border-radius:0.3em; cursor:pointer; font-size:0.9em}
			.consent-dialog-buttons button:hover {background:#2b4c82}

			.consent-form {margin-bottom:1em; display:flex; flex-direction:column; align-items: start;
			background: #dbdbdb; padding: 0.3em 1em 1em 1em; border-radius: .3em;}
			.consent-form label {cursor:pointer; font-size: 1em;}

			.consent-checkbox {
			appearance: none; position: relative; display: inline-block !important; outline: none;
			top: .55em; height: 1.3em; width: 1.3em !important; margin-right: .5em; font-size:1em;
			border: .14em solid rgba(117, 129, 151, 0.48); border-radius:0.2em; color: #ffffff; cursor: pointer;
			 transition: all 0.15s ease-out 0s;}

			.consent-checkbox:hover {border-color: rgba(117, 129, 151, 0.82);}
			.consent-checkbox:checked {background: #3867b1; border: none;}
			.consent-checkbox:checked:hover {background: #2b4c82;}

			.consent-checkbox:checked::before {
			content: '✔'; display: inline-block; position: absolute;
			left:-.35em; top:-0.2em; height: 1.8em; width: 1.8em;
			font-size: 1.2em;  text-align: center;}

			.consent-checkbox:checked::after {
			display: block; position: relative; content: '';
			animation: consent-checkbox-click 0.15s; background: #3867b1; border-radius: 1em;}

			@keyframes consent-checkbox-click {
			  0% {height: 1em; width: 1em; opacity: 0.35; position: relative;}
			  100% {height: 3em; width: 3em; margin-left: -1.2em; margin-top: -1.2em; opacity: 0;}
			}

			/* animation slide-in-blurred-top by animista */
			.consent-slide-in {animation: slide-in-blurred-top 0.3s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;}
			@keyframes slide-in-blurred-top {
			  0% {transform: translateY(-1000px) scaleY(2.5) scaleX(0.2); transform-origin: 50% 0%; filter: blur(40px); opacity: 0;}
			  100% {transform: translateY(0) scaleY(1) scaleX(1); transform-origin: 50% 50%; filter: blur(0); opacity: 1;}
			}

			@media only screen and (min-height: 900px) {
				@keyframes slide-in-blurred-top {
				  0% {transform: translateY(-1000px) scaleY(2.5) scaleX(0.2); transform-origin: 50% 0%; filter: blur(40px); opacity: 0;}
				  100% {transform: translateY(-30%) scaleY(1) scaleX(1); transform-origin: 50% 50%; filter: blur(0); opacity: 1;}
				}
			}

			</style>`
	}


	consent_modal_DOM() {
		let container = document.createElement('div');
		let fields = this.convert_to_form(this.consentFields)

		container.innerHTML = `
			${this.styles()}
			<div class="consent-wrapper">
				<div class="consent-modal consent-slide-in">

					<div class="consent-modal-body">
						${this.consentHeadline}
						${this.consentText}

						<form class="consent-form">
							${fields}
						</form>
					</div>

					${this.consentDetails}

					<div class="consent-dialog-buttons">
						<button class="consent-dialog-true">Speichern und schließen</button>
					</div>

				</div>
			</div>
		`;

		let checkBoxes = container.querySelectorAll('.consent-checkbox');

		let _this = this;
		checkBoxes.forEach((element) => {
			element.onchange = function(e){
				let name = element.getAttribute('name');
				_this.set_consent(name, element.checked);
			};
		});

		let button = container.querySelector('.consent-dialog-true');
		button.addEventListener('click', (e) => {
			this.save_status(checkBoxes);
			container.remove();
			window.location.reload()
		});

		if (this.closeOnModalClick) {
			let wrapper = container.querySelector('.consent-wrapper');
			wrapper.addEventListener('click', (e) => {
				if (wrapper !== e.target) return;
				this.save_status(checkBoxes);
				container.remove();
				window.location.reload()
			});
		}

		return container;
	}

}



class FlundrCookieManager {

	// Usage: create new Instance e.g. myCookie = new FlundrCookieManager('cookiename', '30');
	// First parameter is the Cookies name, second is the Expiretime in Days
	// get Cookie data with: myCookie.content;
	// set Cookie data with: myCookie.content = 'Value';

	constructor(cookieName = 'fl-default-cookie', expireDays = 365) {
		this.cookieName = cookieName;
		this.expireDays = expireDays;
	}

	get content() {return this.get_content();}
	set content(data) {this.set_content(data);}

	get expire() {return this.expireDays;}
	set expire(days) {this.expireDays = days;}

	get name() {return this.expireDays;}
	set name(cookieName) {this.cookieName = cookieName;}

	get isset() {return this.is_active();}
	get exists() {return this.is_active();}

	get_content() {
		let content = document.cookie.split('; ');

		content = content.find(row => row.startsWith(this.cookieName+'='));

		if (!content) {return;}
		content = content.split('=')[1];

		if (content.startsWith('{')) {content = JSON.parse(content);}
		return content;
	}

	set_content(data) {

		if (typeof(data) === 'object') {
			data = JSON.stringify(data);
		}

		let expire = '';
		if (this.expireDays) {
			expire = this.expire_from_now(this.expireDays)
			expire = ` expires=${expire};`;
		}

		let cookieString = `${this.cookieName}=${data}; SameSite=Lax;	${expire}Secure`;
		document.cookie = cookieString;
	}

	is_active() {
		if (document.cookie.split(';').some((item) => item.trim().startsWith(this.cookieName + '='))) {
			return true;
		}
		return false;
	}

	check_value(cookieName, cookieValue) {
		return document.cookie.split(';').some((item) => item.includes(cookieName+'='+cookieValue));
	}

	min_to_ms(minutes) {return minutes*60*1000;}
	days_to_ms(days) {return days*24*60*60*1000;}

	expire_from_now(amountOfTime, timeFrame = 'days') {
		let date = new Date();
		let expireTime = this.days_to_ms(amountOfTime);

	    date.setTime(date.getTime() + expireTime);
		return date.toLocaleString("en-US", {timeZone: "Europe/Berlin"})
		//return date.toUTCString();
	}

	delete() {
		let cookieString = `${this.cookieName}=''; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure`;
		document.cookie = cookieString;
	}

}
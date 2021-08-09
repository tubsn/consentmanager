# flundr Consentmanager
Small Javascript Library for DSGVO - Consent Management

## Start and Options
```javascript
window.consentManager = new ConsentManager({
	cookieName : 'consentCookie',
	cookieExpireDays : 365,
	closeOnModalClick : true,

	headline : '<h3>New Headline</h3>',
	text : '<p>Here you can Edit the Teasertext</p>',

	fields : {
		tracking : 'Nutzerdaten Analyse - <i>Wir möchten lernen, was Sie bei uns interessiert</i>',
		marketing: 'Marketingdaten - <i>Helfen Sie uns relevantere Angebote zu erstellen</i>',
		externalcontent : 'Externe Inhalte - <i>z.B. Videos von Youtube</i>'
	},

	details: '<small>Read more in our <a target"_blank" href="/datapolicy">Datapolicy</a></small>'
});
```

## Consent Layer Options
```html
<button onclick="consentManager.show()">Show Consent Layer</button>
<button onclick="consentManager.reset()">Delet Consent Cookies</button>
```

## Get Users Consent Status
'marketing' is the Consentfields name
```html
<script>
if (consentManager.status('marketing')) {
  // Your Marketing Code here	
}
</script>
```

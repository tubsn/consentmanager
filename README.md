# flundr Consentmanager
Small Javascript Library for DSGVO - Consent Management

![ConsentManagerPreview](https://raw.githubusercontent.com/tubsn/consentmanager/main/consent-manager-preview.png)

## Start and Options
```javascript
window.consentManager = new ConsentManager({
	cookieName : 'consentCookie',
	cookieExpireDays : 365,
	closeOnModalClick : true,

	headline : '<h3>New Headline</h3>',
	text : '<p>Here you can Edit the Teasertext</p>',
	buttonText : 'Speichern und schließen',

	fields : [

		{
			name: 'marketing',
			label: 'Marketingdaten - <i>Helfen Sie uns relevantere Angebote zu erstellen</i>',
		},

		{
			name: 'tracking',
			label: 'Nutzerdaten Analyse - <i>Wir möchten lernen, was Sie bei uns interessiert</i>',
		},

		{
			name: 'mandatory',
			label: 'Berechtigtes Interesse - <i>z.B. zum speichern des User Logins</i>',
			mandatory : true
		},
	],

	details: '<small>Read more in our <a target"_blank" href="/datapolicy">Datapolicy</a></small>'
});
```

## Consent Layer Options
```html
<button onclick="consentManager.show()">Show Consent Layer</button>
<button onclick="consentManager.activate('marketing')">Activate and Reload Page</button>
<button onclick="consentManager.deactivate('marketing')">Deactivate and Reload Page</button>
<button onclick="consentManager.reset()">Delete Consent Cookies</button>
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

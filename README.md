# Suppose So cookie consent module.

This adds a cookie consent banner\* on every page until the user gives
some sort of consent.

You can configure things you need consent for - 'essential' is required,
but maybe you use 'measurement', 'functional' and 'tracking' and
'fartoointrusive' as well.

Then you can configure buttons which request those permissions, e.g. "All
except the massively intrusive ones" which might grant 'essential' and
'functional', and 'measurement'.

You will need to provide CSS for the banner!

When consent is given:

1. it is stored in a ssCookieConsent cookie for 1 year.

2. users are informed on the console, and they can delete the cookie with
   `supposeSo.deleteCookie();`

3. a `supposeso` event is fired on the `body` tag. So you can listen to
   this to decided to send analytics etc. now consent has been granted.

## Use the permissions

Google Analytics example. (Note that `document.body` requires
`DOMContentLoaded`)

```javascript
var initGoogleAnalytics = function(e) {
  if (e && e.supposeSo) {
    // supposeSo is loaded.
    if (e.supposeSo.permissionGrantedFor('measurement')) {
      // Initialise analytics here.
      // and send page view etc.
    }
    if (e.supposeSo.permissionGrantedFor('fartoointrusive')) {
      // Initialise webcam, location, notifications, adverts etc here.
    }
  }
};


if (window.supposeSo) {
  // supposeSo is already loaded.
  enableAnalyticsIfAllowed({supposeSo: window.supposeSo, supposeSoLoadedFirst: true});
}
// In case it loads after us, wait to hear from it.
document.addEventListener('supposeso', initGoogleAnalytics);
```

Note about the `supposeso` event: It has the following properties set in the
respective situations:

- `userGrantedConsent`: user just clicked one of the consent buttons.
- `userRevokedPermission`: user just deleted the cookie.
- `previouslyGranted`: permissions loaded from cookie (when SupposeSo is loaded)

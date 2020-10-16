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

Google Analytics example. (Note that this requires `DOMContentLoaded`)

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
document.body.addEventListener('supposeso', initGoogleAnalytics);

```

Open Web Analytics example

```javascript
document.addEventListener('DOMContentLoaded', () => {
    var enableAnalyticsIfAllowed = function(e) {
      if (e && e.supposeSo) {
        // supposeSo is loaded.
        if (e.supposeSo.permissionGrantedFor('analytics')) {
          // Initialise analytics here.
          // and send page view etc.
          console.log("initialising OWA as consent given.");

          //<![CDATA[
          window.owa_baseUrl = 'https://stats.artfulrobot.uk/';
          window.owa_cmds = window.owa_cmds || [];
          owa_cmds.push(['setSiteId', '272bbc7892d2194b4cc33d733d8b2c4d']);
          owa_cmds.push(['trackPageView']);
          owa_cmds.push(['trackClicks']);

          (function() {
              var _owa = document.createElement('script'); _owa.type = 'text/javascript'; _owa.async = true;
              owa_baseUrl = ('https:' == document.location.protocol ? window.owa_baseSecUrl || owa_baseUrl.replace(/http:/, 'https:') : owa_baseUrl );
              _owa.src = owa_baseUrl + 'modules/base/js/owa.tracker-combined-min.js';
              var _owa_s = document.getElementsByTagName('script')[0]; _owa_s.parentNode.insertBefore(_owa, _owa_s);
          }());
          //]]>
        }
      }
    };

    if (window.supposeSo) {
      // supposeSo is already loaded.
      enableAnalyticsIfAllowed({supposeSo: window.supposeSo, supposeSoLoadedFirst: true});
    }
    // In case it loads after us, wait to hear from it.
    document.addEventListener('supposeso', enableAnalyticsIfAllowed);
});
```

Note about the `supposeso` event: It has the following properties set in the
respective situations:

- `userGrantedConsent`: user just clicked one of the consent buttons.
- `userRevokedPermission`: user just deleted the cookie.
- `previouslyGranted`: permissions loaded from cookie (when SupposeSo is loaded)

## Styling your banner.

CSS rules are needed for the HTML which looks like this:

```html
<div id="supposeso" class="shown"><!-- class="hidden" also -->
  <div class="supposeso__text"><p>...</p></div>
  <div class="supposeso__buttons">
    <button class="supposeso__button secondary">Essential Only</button>
    <button class="supposeso__button primary">Privacy focussed web stats are fine</button>
  </div>
</div>
```

Example SCSS

```scss
#supposeso {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  color: $colourDarkBlue;
  padding: 2rem;
  transition: all 0.3s;
  transform: translateY(100%);
  opacity: 0;

  &.shown {
    opacity: 1;
    transform: none;
  }

  .supposeso__text {
    p { margin-bottom: 0; }
  }

  .supposeso__buttons {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 0 -1rem;
    button {
      margin: 0.5rem 1rem;
      flex: 1 0 auto;
    }
  }
}
@media screen and (min-width: 768px) {
  #supposeso {
    display: grid;
    grid-template-columns: 1fr minmax(19rem, 1fr);
    grid-gap: 2rem;
    align-items: middle;
  }
}


```



## Revoking permissions

You can include `<a href='#ss-clear-cookies'>Delete cookies</a>`. This
will delete the `ssCookieConsent` cookie and it will fire a `supposeso`
event witih `userRevokedPermission` set. It will then ask the user to
`confirm()` if they want to reload the page. You should use this to delete
cookies that were set with permission.

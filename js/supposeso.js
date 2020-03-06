document.addEventListener('DOMContentLoaded', () => {

  class SupposeSo {
    constructor(config) {
      this.config = config;
      const c = this.getCookie('ssCookieConsent');
      this.acceptedPermissions = c ? c.split(',') : [];
    }
    init() {
      if (this.acceptedPermissions.length === 0) {
        this.show();
      }
      else {
        console.log("You previously accepted the following permissions which are stored in a cookie: " + this.acceptedPermissions.join(',') + ", thank you. You can delete this cookie by typing the following into the console:\nsupposeSo.deleteCookie();\n(then press Enter)");
        const ourEvent = new Event('supposeso');
        ourEvent.previouslyGranted = true;
        ourEvent.supposeSo = this;
        document.dispatchEvent(ourEvent);
      }
    }
    show() {
      this.banner = document.createElement('div');
      this.banner.setAttribute('id', 'supposeso')
      this.banner.classList.add('shown');

      const textWrapper = document.createElement('div');
      textWrapper.classList.add('supposeso__text');
      textWrapper.innerHTML = this.config.text;
      this.banner.appendChild(textWrapper);

      const buttonsWrapper = document.createElement('div');
      buttonsWrapper.classList.add('supposeso__buttons');

      this.config.buttons.forEach(btnConfig => {
        const b = document.createElement('button');
        b.classList.add('supposeso__button');
        if (btnConfig.cssClass) {
          b.classList.add(btnConfig.cssClass.split(/\s+/));
        }
        b.textContent = btnConfig.text;
        b.addEventListener('click', this.recordConsent.bind(this, btnConfig.permissions));
        buttonsWrapper.appendChild(b);
      });

      this.banner.appendChild(buttonsWrapper);

      document.body.appendChild(this.banner);
    }
    permissionGrantedFor(permission) {
      return (this.acceptedPermissions.indexOf(permission) > -1);
    }

    recordConsent(permissions, e) {
      // Lasts 1 year.
      this.acceptedPermissions = permissions;
      this.setCookie('ssCookieConsent', permissions.join(','), 365);
      console.log("You have accepted the following permissions which will be stored in a cookie for 1 year: " + this.acceptedPermissions.join(',') + ", thank you. You can delete this cookie by typing the following into the console:\nsupposeSo.deleteCookie();\n(then press Enter)");

      this.banner.classList.remove('shown');
      this.banner.classList.add('hidden');
      var d = window.getComputedStyle(this.banner).transitionDuration;
      if (d) {
        d = parseFloat(d) * 1000;
      }
      else {
        d = 1;
      }
      // Remove from Dom after any transition animations took place.
      setTimeout(() => { this.banner.parentNode.removeChild(this.banner); },  d);

      const ourEvent = new Event('supposeso');
      ourEvent.userGrantedConsent = true;
      ourEvent.supposeSo = this;
      document.dispatchEvent(ourEvent);
    }
    setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays*24*60*60*1000));
      var expires = "expires="+ d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    tellConsole(type) {
    }

    getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }
    deleteCookie() {
      document.cookie = "ssCookieConsent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      console.log("The ssCookieConsent cookie has been expired and will be deleted by your browser.");

      const ourEvent = new Event('supposeso');
      ourEvent.userRevokedPermission = true;
      ourEvent.supposeSo = this;
      document.dispatchEvent(ourEvent);
    }
  }

  if (Drupal.settings.supposeso) {
    window.supposeSo = new SupposeSo(Drupal.settings.supposeso);
    window.supposeSo.init();
  }

});

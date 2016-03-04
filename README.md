# Proforma

Proforma is a demo app that allows structured form data to be collected on a web browser device even when offline. It uses PouchDB 
to store the data inside the web browser.

## Demo

Visit (http://proforma.mybluemix.net/) to see it in action.

## Instructions

When you first load Proforma, you are asked to define the fields of the form. This is acheived by dragging and dropping
fields from the palette on the right onto a form template on the left:

![settings](https://github.com/glynnbird/proforma/raw/master/public/img/proforma_settings1.png "settings")

Each of the form elements can be clicked on to define the name, placeholder, label etc. Don't forget to configure the form name itself.

Once saved, the configuration page disappears revealing the form you have created:

![form](https://github.com/glynnbird/proforma/raw/master/public/img/proforma_form.png "form")

This field can be completed as many times as is required, the data being stored inside the web browser. 
You can see the list of form submissions by clicking the 'gear' icon on the top bar.

![submissions](https://github.com/glynnbird/proforma/raw/master/public/img/proforma_submissions.png "submissions")

## Exporting the data

The data can be uploaded to Cloudant by completing the form on the settings page and providing a Cloudant URL e.g.

* `https://myaccount.cloudant.com/proforma` - assuming that this database is writable 
* `https://key:password@myaccount.cloudant.com/proforma` - to provide credentials in the URL

N.B. the target database must be writable, or authentication credentials must be supplied in the URL. CORS must be enabled on your Cloudant account
to allow this replication to occur.

## Using on a mobile device

As the form configuration requires drag and drop, it is best to configure the form on a desktop browser, as drag and drop doesn't
work so well on iPads. On the desktop device, sync to a Cloudant Database. Then on the iPad you can also sync to this database
which will take the form configuration automatically. Syncing only happens when you want it to - when you press the sync button.


## Credits

The form builder is taken from https://github.com/minikomi/Bootstrap-Form-Builder


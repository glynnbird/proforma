# Proforma

Proforma is a demo app that allows structured form data to be collected on a web browser device even when offline. It uses PouchDB 
to store the data inside the web browser.

## Demo

Visit (http://glynnbird.github.io/proforma) to see it in action.

## Instructions

When you first load Proforma, you are asked to define the title, subtitle and fields of your form e.g.

* title - WIN A RASPBERRY PI TODAY!!!
* subtitle - Free to enter. No purchase necessary.
* fields - First Name,Last Name,Company Name,Email,Telephone 

![settings](https://github.com/glynnbird/proforma/raw/master/img/proforma_settings1.png "settings")

Once submitted, the configuration page disappears revealing the form you have created:

![form](https://github.com/glynnbird/proforma/raw/master/img/proforma_form.png "form")

This field can be completed as many times as is required, the data being stored inside the web browser. 
You can see the list of form submissions by clicking the 'gear' icon on the top bar.

![submissions](https://github.com/glynnbird/proforma/raw/master/img/proforma_submissions.png "submissions")

## Exporting the data

The data can be uploaded to Cloudant by completing the form on the settings page and providing a Cloudant URL e.g.

* `https://myaccount.cloudant.com/proforma` - assuming that this database is writable 
* `https://key:password@myaccount.cloudant.com/proforma` - to provide credentials in the URL

N.B. the target database must be writable, or authentication credentials must be supplied in the URL. CORS must be enabled on your Cloudant account
to allow this replication to occur.




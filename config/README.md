## `config/*.json` files


### `database`

The file `config/database.json` contains:

* one key for each of the four services
* we assume every service uses only *one* collection in mongodb, which has the same name of the service
* the mongodb address might become remote or in a different port, the services have to access to one collection only (their)
* the indexes are related to the collection


### `ħttp`

* one key for each of the four services
* every service has an HTTP listening port where expose its services. Makhno can mark all of them behind https://makhno.net/api, but they are independent services

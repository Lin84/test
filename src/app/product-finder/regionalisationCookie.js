import axios from 'axios';

export default function regionalisationCookie(container) {
    const innogy = {};
    const config = {
        credentials: 'include',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    };

    innogy.regionalization = {
        regionAutocompleterUrl: `https://${location.host}/${regionalizationEndpoints.regionAutocompleterUrl}`,
        regionSetUrl: `https://${location.host}/${regionalizationEndpoints.regionSetUrl}`,
        regionGetUrl: `https://${location.host}/${regionalizationEndpoints.regionGetUrl}`,
        regionData: {
            zip: '',
            city: '',
            regionalized: false
        },
        set: (zip, city) => {
            return new Promise((resolve, reject) => {
                let regionalized = false;

                axios(innogy.regionalization.regionSetUrl, {
                    method: 'POST',
                    config,
                    data: {
                        zip,
                        city,
                        regionalized: Boolean(zip && city)
                    }
                })
                .then(() => {
                    innogy.regionalization.regionData.zip = zip;
                    innogy.regionalization.regionData.city = city;

                    regionalized = true;
                })
                .catch(() => {
                    regionalized = false;
                });

                if (regionalized) {
                    resolve(innogy.regionalization.regionData);
                } else {
                    reject();
                }
            });
        },
        get: () => {
            return new Promise((resolve, reject) => {
                let regionalized = false;

                axios(innogy.regionalization.regionGetUrl, {
                    method: 'GET',
                    config
                })
                .then((response) => {
                    innogy.regionalization.regionData.zip = response.zip;
                    innogy.regionalization.regionData.city = response.city;

                    regionalized = true;
                })
                .catch(() => {
                    regionalized = false;
                });

                if (regionalized) {
                    resolve(innogy.regionalization.regionData);
                } else {
                    reject();
                }
            });
        }
    };

    function fillObject(zip, city) {
        innogy.regionalization.regionData.zip = zip;
        innogy.regionalization.regionData.city = city;
        innogy.regionalization.regionData.regionalized = Boolean(zip && city);
    }

    function throwError(error) {
        innogy.regionalization.regionData.regionalized = false;

        throw new Error(error);
    }

    window.innogy = innogy;
}

const express = require('express')
const request = require('request')
const csv = require('csvtojson')
const dns = require('dns')

const VPN = 'https://server-9099-default-rtdb.firebaseio.com/public/vpn/'
const OVPN = 'https://server-9099-default-rtdb.firebaseio.com/public/ovpn/'


const app = express()

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Listening on port 3000...")
})

let startTime = new Date().toUTCString()


let now = parseInt(new Date().getTime()/1000)

const country = [
    { code: 'AD', name: 'Andorra' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'AF', name: 'Afghanistan' },
    { code: 'AG', name: 'Antigua and Barbuda' },
    { code: 'AI', name: 'Anguilla' },
    { code: 'AL', name: 'Albania' },
    { code: 'AM', name: 'Armenia' },
    { code: 'AO', name: 'Angola' },
    { code: 'AP', name: 'Asia/Pacific Region' },
    { code: 'AQ', name: 'Antarctica' },
    { code: 'AR', name: 'Argentina' },
    { code: 'AS', name: 'American Samoa' },
    { code: 'AT', name: 'Austria' },
    { code: 'AU', name: 'Australia' },
    { code: 'AW', name: 'Aruba' },
    { code: 'AX', name: 'Aland Islands' },
    { code: 'AZ', name: 'Azerbaijan' },
    { code: 'BA', name: 'Bosnia and Herzegovina' },
    { code: 'BB', name: 'Barbados' },
    { code: 'BD', name: 'Bangladesh' },
    { code: 'BE', name: 'Belgium' },
    { code: 'BF', name: 'Burkina Faso' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'BH', name: 'Bahrain' },
    { code: 'BI', name: 'Burundi' },
    { code: 'BJ', name: 'Benin' },
    { code: 'BL', name: 'Saint Barthelemy' },
    { code: 'BM', name: 'Bermuda' },
    { code: 'BN', name: 'Brunei Darussalam' },
    { code: 'BO', name: 'Bolivia' },
    { code: 'BQ', name: 'Bonaire, Saint Eustatius and Saba' },
    { code: 'BR', name: 'Brazil' },
    { code: 'BS', name: 'Bahamas' },
    { code: 'BT', name: 'Bhutan' },
    { code: 'BV', name: 'Bouvet Island' },
    { code: 'BW', name: 'Botswana' },
    { code: 'BY', name: 'Belarus' },
    { code: 'BZ', name: 'Belize' },
    { code: 'CA', name: 'Canada' },
    { code: 'CC', name: 'Cocos (Keeling) Islands' },
    { code: 'CD', name: 'Congo, The Democratic Republic of the' },
    { code: 'CF', name: 'Central African Republic' },
    { code: 'CG', name: 'Congo' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'CI', name: 'Cote d\'Ivoire' },
    { code: 'CK', name: 'Cook Islands' },
    { code: 'CL', name: 'Chile' },
    { code: 'CM', name: 'Cameroon' },
    { code: 'CN', name: 'China' },
    { code: 'CO', name: 'Colombia' },
    { code: 'CR', name: 'Costa Rica' },
    { code: 'CU', name: 'Cuba' },
    { code: 'CV', name: 'Cape Verde' },
    { code: 'CW', name: 'Curacao' },
    { code: 'CX', name: 'Christmas Island' },
    { code: 'CY', name: 'Cyprus' },
    { code: 'CZ', name: 'Czech Republic' },
    { code: 'DE', name: 'Germany' },
    { code: 'DJ', name: 'Djibouti' },
    { code: 'DK', name: 'Denmark' },
    { code: 'DM', name: 'Dominica' },
    { code: 'DO', name: 'Dominican Republic' },
    { code: 'DZ', name: 'Algeria' },
    { code: 'EC', name: 'Ecuador' },
    { code: 'EE', name: 'Estonia' },
    { code: 'EG', name: 'Egypt' },
    { code: 'EH', name: 'Western Sahara' },
    { code: 'ER', name: 'Eritrea' },
    { code: 'ES', name: 'Spain' },
    { code: 'ET', name: 'Ethiopia' },
    { code: 'EU', name: 'Europe' },
    { code: 'FI', name: 'Finland' },
    { code: 'FJ', name: 'Fiji' },
    { code: 'FK', name: 'Falkland Islands (Malvinas)' },
    { code: 'FM', name: 'Micronesia, Federated States of' },
    { code: 'FO', name: 'Faroe Islands' },
    { code: 'FR', name: 'France' },
    { code: 'GA', name: 'Gabon' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'GD', name: 'Grenada' },
    { code: 'GE', name: 'Georgia' },
    { code: 'GF', name: 'French Guiana' },
    { code: 'GG', name: 'Guernsey' },
    { code: 'GH', name: 'Ghana' },
    { code: 'GI', name: 'Gibraltar' },
    { code: 'GL', name: 'Greenland' },
    { code: 'GM', name: 'Gambia' },
    { code: 'GN', name: 'Guinea' },
    { code: 'GP', name: 'Guadeloupe' },
    { code: 'GQ', name: 'Equatorial Guinea' },
    { code: 'GR', name: 'Greece' },
    { code: 'GS', name: 'South Georgia and the South Sandwich Islands' },
    { code: 'GT', name: 'Guatemala' },
    { code: 'GU', name: 'Guam' },
    { code: 'GW', name: 'Guinea-Bissau' },
    { code: 'GY', name: 'Guyana' },
    { code: 'HK', name: 'Hong Kong' },
    { code: 'HM', name: 'Heard Island and McDonald Islands' },
    { code: 'HN', name: 'Honduras' },
    { code: 'HR', name: 'Croatia' },
    { code: 'HT', name: 'Haiti' },
    { code: 'HU', name: 'Hungary' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'IE', name: 'Ireland' },
    { code: 'IL', name: 'Israel' },
    { code: 'IM', name: 'Isle of Man' },
    { code: 'IN', name: 'India' },
    { code: 'IO', name: 'British Indian Ocean Territory' },
    { code: 'IQ', name: 'Iraq' },
    { code: 'IR', name: 'Iran, Islamic Republic of' },
    { code: 'IS', name: 'Iceland' },
    { code: 'IT', name: 'Italy' },
    { code: 'JE', name: 'Jersey' },
    { code: 'JM', name: 'Jamaica' },
    { code: 'JO', name: 'Jordan' },
    { code: 'JP', name: 'Japan' },
    { code: 'KE', name: 'Kenya' },
    { code: 'KG', name: 'Kyrgyzstan' },
    { code: 'KH', name: 'Cambodia' },
    { code: 'KI', name: 'Kiribati' },
    { code: 'KM', name: 'Comoros' },
    { code: 'KN', name: 'Saint Kitts and Nevis' },
    { code: 'KP', name: 'Korea, Democratic People\'s Republic of' },
    { code: 'KR', name: 'Korea, Republic of' },
    { code: 'KR', name: 'South Korea' },
    { code: 'KR', name: 'Korea' },
    { code: 'KW', name: 'Kuwait' },
    { code: 'KY', name: 'Cayman Islands' },
    { code: 'KZ', name: 'Kazakhstan' },
    { code: 'LA', name: 'Lao People\'s Democratic Republic' },
    { code: 'LB', name: 'Lebanon' },
    { code: 'LC', name: 'Saint Lucia' },
    { code: 'LI', name: 'Liechtenstein' },
    { code: 'LK', name: 'Sri Lanka' },
    { code: 'LR', name: 'Liberia' },
    { code: 'LS', name: 'Lesotho' },
    { code: 'LT', name: 'Lithuania' },
    { code: 'LU', name: 'Luxembourg' },
    { code: 'LV', name: 'Latvia' },
    { code: 'LY', name: 'Libyan Arab Jamahiriya' },
    { code: 'MA', name: 'Morocco' },
    { code: 'MC', name: 'Monaco' },
    { code: 'MD', name: 'Moldova, Republic of' },
    { code: 'ME', name: 'Montenegro' },
    { code: 'MF', name: 'Saint Martin' },
    { code: 'MG', name: 'Madagascar' },
    { code: 'MH', name: 'Marshall Islands' },
    { code: 'MK', name: 'Macedonia' },
    { code: 'ML', name: 'Mali' },
    { code: 'MM', name: 'Myanmar' },
    { code: 'MN', name: 'Mongolia' },
    { code: 'MO', name: 'Macao' },
    { code: 'MP', name: 'Northern Mariana Islands' },
    { code: 'MQ', name: 'Martinique' },
    { code: 'MR', name: 'Mauritania' },
    { code: 'MS', name: 'Montserrat' },
    { code: 'MT', name: 'Malta' },
    { code: 'MU', name: 'Mauritius' },
    { code: 'MV', name: 'Maldives' },
    { code: 'MW', name: 'Malawi' },
    { code: 'MX', name: 'Mexico' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'MZ', name: 'Mozambique' },
    { code: 'NA', name: 'Namibia' },
    { code: 'NC', name: 'New Caledonia' },
    { code: 'NE', name: 'Niger' },
    { code: 'NF', name: 'Norfolk Island' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'NI', name: 'Nicaragua' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'NO', name: 'Norway' },
    { code: 'NP', name: 'Nepal' },
    { code: 'NR', name: 'Nauru' },
    { code: 'NU', name: 'Niue' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'OM', name: 'Oman' },
    { code: 'PA', name: 'Panama' },
    { code: 'PE', name: 'Peru' },
    { code: 'PF', name: 'French Polynesia' },
    { code: 'PG', name: 'Papua New Guinea' },
    { code: 'PH', name: 'Philippines' },
    { code: 'PK', name: 'Pakistan' },
    { code: 'PL', name: 'Poland' },
    { code: 'PM', name: 'Saint Pierre and Miquelon' },
    { code: 'PN', name: 'Pitcairn' },
    { code: 'PR', name: 'Puerto Rico' },
    { code: 'PS', name: 'Palestinian Territory' },
    { code: 'PT', name: 'Portugal' },
    { code: 'PW', name: 'Palau' },
    { code: 'PY', name: 'Paraguay' },
    { code: 'QA', name: 'Qatar' },
    { code: 'RE', name: 'Reunion' },
    { code: 'RO', name: 'Romania' },
    { code: 'RS', name: 'Serbia' },
    { code: 'RU', name: 'Russian Federation' },
    { code: 'RW', name: 'Rwanda' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'SB', name: 'Solomon Islands' },
    { code: 'SC', name: 'Seychelles' },
    { code: 'SD', name: 'Sudan' },
    { code: 'SE', name: 'Sweden' },
    { code: 'SG', name: 'Singapore' },
    { code: 'SH', name: 'Saint Helena' },
    { code: 'SI', name: 'Slovenia' },
    { code: 'SJ', name: 'Svalbard and Jan Mayen' },
    { code: 'SK', name: 'Slovakia' },
    { code: 'SL', name: 'Sierra Leone' },
    { code: 'SM', name: 'San Marino' },
    { code: 'SN', name: 'Senegal' },
    { code: 'SO', name: 'Somalia' },
    { code: 'SR', name: 'Suriname' },
    { code: 'SS', name: 'South Sudan' },
    { code: 'ST', name: 'Sao Tome and Principe' },
    { code: 'SV', name: 'El Salvador' },
    { code: 'SX', name: 'Sint Maarten' },
    { code: 'SY', name: 'Syrian Arab Republic' },
    { code: 'SZ', name: 'Swaziland' },
    { code: 'TC', name: 'Turks and Caicos Islands' },
    { code: 'TD', name: 'Chad' },
    { code: 'TF', name: 'French Southern Territories' },
    { code: 'TG', name: 'Togo' },
    { code: 'TH', name: 'Thailand' },
    { code: 'TJ', name: 'Tajikistan' },
    { code: 'TK', name: 'Tokelau' },
    { code: 'TL', name: 'Timor-Leste' },
    { code: 'TM', name: 'Turkmenistan' },
    { code: 'TN', name: 'Tunisia' },
    { code: 'TO', name: 'Tonga' },
    { code: 'TR', name: 'Turkey' },
    { code: 'TT', name: 'Trinidad and Tobago' },
    { code: 'TV', name: 'Tuvalu' },
    { code: 'TW', name: 'Taiwan' },
    { code: 'TZ', name: 'Tanzania, United Republic of' },
    { code: 'UA', name: 'Ukraine' },
    { code: 'UG', name: 'Uganda' },
    { code: 'UM', name: 'United States Minor Outlying Islands' },
    { code: 'US', name: 'United States' },
    { code: 'UY', name: 'Uruguay' },
    { code: 'UZ', name: 'Uzbekistan' },
    { code: 'VA', name: 'Holy See (Vatican City State)' },
    { code: 'VC', name: 'Saint Vincent and the Grenadines' },
    { code: 'VE', name: 'Venezuela' },
    { code: 'VG', name: 'Virgin Islands, British' },
    { code: 'VI', name: 'Virgin Islands, U.S.' },
    { code: 'VN', name: 'Vietnam' },
    { code: 'VU', name: 'Vanuatu' },
    { code: 'WF', name: 'Wallis and Futuna' },
    { code: 'WS', name: 'Samoa' },
    { code: 'YE', name: 'Yemen' },
    { code: 'YT', name: 'Mayotte' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'ZM', name: 'Zambia' },
    { code: 'ZW', name: 'Zimbabwe' }
]


function getCountryCode(name) {
    for (var i = 0; i < country.length; i++) {
        if(country[i]['name'] == name) {
            return country[i]['code']
        }
    }

    for (var i = 0; i < country.length; i++) {
        if(country[i]['name'].includes(name)) {
            return country[i]['code']
        }
    }

    if (name.includes('US')) {
        return 'US'
    }
    return ''
}

collectVPN()
collectOVPN()


setInterval(() => {
    collectVPN()
    collectOVPN()
}, (6*60*60*1000)+120000)


function collectVPN() {
    request({
        url: VPN+'config/update.json',
        method: 'GET',
        json: true
    }, function (error, response, body) {
        try {
            if(body == null) {
                updateVPN(0)
            } else {
                updateVPN(parseInt(body))
            }
        } catch (e) {
            updateVPN(0)
        }
    })
}

function collectOVPN() {
    request({
        url: OVPN+'config/update.json',
        method: 'GET',
        json: true
    }, function (error, response, body) {
        try {
            if(body == null) {
                updateOVPN(0)
            } else {
                updateOVPN(parseInt(body))
            }
        } catch (e) {
            updateOVPN(0)
        }
    })
}

function updateVPN(time) {
    if(time < new Date().getTime()) {
        request({
            url: 'https://techzensolution.com/singaporevpn/base.json',
            method: 'GET',
            json: true
        }, function (error, response, body) {
            try {
                if(body != null) {
                    let config = body['config']
                    if (config.includes('keysize 256spasse')) {
                        config = config.replace('keysize 256spasse', '')
                    } else if (config.includes('keysize 256')) {
                        config = config.replace('keysize 256', '')
                    }

                    let names = {}
                    let address = []

                    names[body['defaultip']] = getCountryCode(body['defaultCountry'])
                    address.push(body['defaultip'])
                    
                    let send = {
                        update: new Date().getTime()+(12*60*60*1000),
                        user: body['username'],
                        pass: body['password'],
                        config: config
                    }
                    
                    request({
                        url: 'https://techzensolution.com/singaporevpn/server.json',
                        method: 'GET',
                        json: true
                    }, function (error, response, body) {
                        try {
                            if(body != null) {
                                let country = body['other']

                                for (let i = 0; i < country.length; i++) {
                                    const cityList = country[i]['cityList']
                                    let name = getCountryCode(country[i]['region'])

                                    for (let i = 0; i < cityList.length; i++) {
                                        names[cityList[i]['ip']] = name
                                        address.push(cityList[i]['ip'])
                                    }
                                }

                                checkVPNip(address, names, {}, send, 0, address.length)
                            }
                        } catch (e) {}
                    })
                }
            } catch (e) {}
        })
    }
}

function updateOVPN(time) {
    if(time < new Date().getTime()) {
        parseCSV1(function (json) {
            let upload = {}
            if (json) {
                for (let i = 0; i < json.length; i++) {
                    try {
                        let name = json[i]['CountryShort']
                        if(name.length > 2) {
                            name = name.substring(0, 2)
                        }
                        let cmd = Buffer.from(json[i]['OpenVPN_ConfigData_Base64'], 'base64').toString('ascii')
                        cmd += '\ndata-ciphers AES-128-CBC'
                        cmd += '\ncipher AES-128-CBC'
                        let config = cmd.replace(/\n/g, 'spasse')

                        if (!json[i]['IP'].includes('1.1.1')) {
                            upload[Buffer.from(json[i]['IP']).toString('base64')] = name+'@@'+config    
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        
            parseCSV2(function (json) {
                if (json) {
                    for (let i = 0; i < json.length; i++) {
                        try {
                            let name = json[i]['field7']
                            if(name.length > 2) {
                                name = name.substring(0, 2)
                            }
                            let ip = Buffer.from(json[i]['field2']).toString('base64')
                            if (!upload[ip]) {
                                let cmd = ''
        
                                Buffer.from(json[i]['field15'], 'base64').toString('ascii').split(/\r?\n/).forEach(function(line) {
                                    if (line.length > 0) {
                                        if (line.substring(0,1) != '#') {
                                            cmd += line+'\n'
                                        }
                                    }
                                })
                                
                                cmd += 'data-ciphers AES-128-CBC\n'
                                cmd += 'cipher AES-128-CBC'
                                let config = cmd.replace(/\n/g, 'spasse')

                                if (!ip.includes('1.1.1')) {
                                    upload[ip] = name+'@@'+config
                                }
                            }
                        } catch (error) {}
                    }
                }

                setData(OVPN+'config/update', new Date().getTime()+(6*60*60*1000))
                console.log('Upload OVPN data')

                if (Object.keys(upload).length > 10) {
                    updateData(OVPN+'ip', upload)
                }
            })
        })
    }
}

function checkVPNip(address, names, upload, server, size, target) {
    if (size >= target) {
        if (target > 10) {
            console.log('Upload VPN data')
            updateData(VPN+'ip', upload)
            updateData(VPN+'config', server)
        }
    } else {
        let ip = address[size]
        dns.resolve4(ip, (err, addresses) => {
            if (!err) {
                upload[Buffer.from(ip).toString('base64')] = names[ip]+'@'+addresses[0]
            }
            checkVPNip(address, names, upload, server, size+1, target)
        })
    }
}

function parseCSV1(callback) {
    new Promise((resolve, reject) => {
        const rows = []
        csv()
            .fromStream(request.get('https://api.ovpn.pw/csv'))
            .subscribe((json) => {
                try {
                    let time = parseInt(json['Uptime'])
                    if(time > 84400000) rows.push(json)
                } catch (error) {}
            }, () => {
                callback()
            }, () => {
                callback(rows)
            }
        )
    })
}

function parseCSV2(callback) {
    new Promise((resolve, reject) => {
        const rows = []
        csv()
            .fromStream(request.get('https://www.vpngate.net/api/iphone/'))
            .subscribe((json) => {
                try {
                    let time = parseInt(json['field9'])
                    if(time > 84400000) rows.push(json)
                } catch (error) {}
            }, () => {
                callback()
            }, () => {
                callback(rows)
            }
        )
    })
}

function setData(path, data) {
    request({
        url: path+'.json',
        method: 'PUT',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify(data)
    }, function (error, response, body) {})
}

function updateData(path, data) {
    request({
        url: path+'.json',
        method: 'PUT',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify(data)
    }, function (error, response, body) {})
}

app.get('/', async function (req, res) {
    res.end(startTime)
})

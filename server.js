const bodyParser = require('body-parser')
const express = require('express')
const request = require('request')
const http = require('http')
const fs = require('fs')

const SIGNATURE = 'D04C0455223E30A43C3B5CDFC4C0ED14'

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Listening on port 3000...")
})

let mTempAllProxy = {}
let mAllProxy = {}
let mTempProxy = []
let mProxy = []
let mTime = 0
let mCompleted = 0

const URL = 'https://server-9099-default-rtdb.firebaseio.com/public/proxy'

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



collectProxy()

setInterval(() => {
    collectProxy()
}, 20*60*1000)


setInterval(() => {
    checkProxy(0)
}, 5*60*1000)


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
    return ''
}

function collectProxy() {
    request({
        url: URL+'/update.json',
        method: 'GET',
        json: true
    }, function (error, response, body) {
        if(!error) {
            if(body == null) {
                updateProxy(0)
            } else {
                updateProxy(body)
            }
        }
    })
}

function updateProxy(time) {
    mTempAllProxy = {}

    mTime = time

    if(time < new Date().getTime()) {
        request({
            url: 'https://free-proxy-list.net/',
            method: 'GET'
        }, function (error, response, body) {
            try {
                let start = body.indexOf('<tbody>')
                let end = body.indexOf('</tbody>')
                let table = body.substring(start+7, end).split('</tr>')
                for (let i = 0; i<table.length-1; i++) {
                    try {
                        let row = table[i].split('</td>')
                        let ip = row[0].replace('<tr>','').replace('<td>','')
                        let port = row[1].replace('<tr>','').replace('<td>','')
                        let name = row[2].replace('<tr>','').replace('<td>','')
                        mTempAllProxy[ip.replace(/\./g, '_')] = port+'@@'+name+'@1'
                    } catch (e) {}
                }
                
                request({
                    url: 'https://us-proxy.org/',
                    method: 'GET'
                }, function (error, response, body) {
                    try {
                        let start = body.indexOf('<tbody>')
                        let end = body.indexOf('</tbody>')
                        let table = body.substring(start+7, end).split('</tr>')
                        for (let i = 0; i<table.length-1; i++) {
                            try {
                                let row = table[i].split('</td>')
                                let ip = row[0].replace('<tr>','').replace('<td>','')
                                let port = row[1].replace('<tr>','').replace('<td>','')
                                let name = row[2].replace('<tr>','').replace('<td>','')
                                mTempAllProxy[ip.replace(/\./g, '_')] = port+'@@'+name+'@1'
                            } catch (e) {}
                        }
    
                        request({
                            url: 'https://sslproxies.org/',
                            method: 'GET'
                        }, function (error, response, body) {
                            try {
                                let start = body.indexOf('<tbody>')
                                let end = body.indexOf('</tbody>')
                                let table = body.substring(start+7, end).split('</tr>')
                                for (let i = 0; i<table.length-1; i++) {
                                    try {
                                        let row = table[i].split('</td>')
                                        let ip = row[0].replace('<tr>','').replace('<td>','')
                                        let port = row[1].replace('<tr>','').replace('<td>','')
                                        let name = row[2].replace('<tr>','').replace('<td>','')
                                        mTempAllProxy[ip.replace(/\./g, '_')] = port+'@@'+name+'@1'
                                    } catch (e) {}
                                }

                                console.log('2')

                                request({
                                    url: 'https://openproxy.space/list/http',
                                    method: 'GET'
                                }, function (error, response, body) {
                                    try {
                                        let temp = body.substring(body.indexOf('window.__NUXT__='), body.length)
                                        temp = temp.substring(0, temp.indexOf('</script>'))
                                        let split = temp.split('code:')

                                        for (let i=1; i<split.length; i++) {
                                            temp = split[i].substring(split[i].indexOf('"')+1)
                                            let name = temp.substring(0, temp.indexOf('"'))
                                            temp = split[i].substring(split[i].indexOf('[')+1)
                                            temp = temp.substring(0, temp.indexOf(']'))
                                            let ips = temp.split(',')
                                            for (let j=0; j<ips.length; j++) {
                                                let ip = ips[j].substring(ips[j].indexOf('"')+1, ips[j].lastIndexOf('"'))
                                                if(ip.length > 10) {
                                                    let i_p = ip.split(':')
                                                    mTempAllProxy[i_p[0].replace(/\./g, '_')] = i_p[1]+'@@'+name+'@3'
                                                }
                                            }
                                        }

                                        if(Object.keys(mTempAllProxy).length > 0) {
                                            updateData('ip', mTempAllProxy)
                                        }

                                        console.log(Object.keys(mTempAllProxy).length)
        
                                        collectServer2(1)
                                    } catch (error) {
                                        mAllProxy = mTempAllProxy
                                        if(Object.keys(mAllProxy).length > 0) {
                                            setData('update', new Date().getTime()+(60*60*1000))
                                            updateData('ip', mAllProxy)
                                            checkProxy(0)
                                        }
                                    }
                                })
                            } catch (error) {
                                mAllProxy = mTempAllProxy
                                if(Object.keys(mAllProxy).length > 0) {
                                    setData('update', new Date().getTime()+(60*60*1000))
                                    updateData('ip', mAllProxy)
                                    checkProxy(0)
                                }
                            }
                        })
                    } catch (error) {
                        mAllProxy = mTempAllProxy
                        if(Object.keys(mAllProxy).length > 0) {
                            setData('update', new Date().getTime()+(60*60*1000))
                            updateData('ip', mAllProxy)
                            checkProxy(0)
                        }
                    }
                })
            } catch (error) {
                mAllProxy = mTempAllProxy
                if(Object.keys(mAllProxy).length > 0) {
                    setData('update', new Date().getTime()+(60*60*1000))
                    updateData('ip', mAllProxy)
                    checkProxy(0)
                }
            }
        })
    } else {
        request({
            url: URL+'/ip.json',
            method: 'GET',
            json: true
        }, function (error, response, body) {
            if(!error && body) {
                for(let [key, value] of Object.entries(body)) {
                    mAllProxy[key] = value
                }
                checkProxy(0)
            }
        })
    }
}

function collectServer2(page) {
    if(page > 5) {
        mAllProxy = mTempAllProxy
        if(Object.keys(mAllProxy).length > 0) {
            setData('update', new Date().getTime()+(60*60*1000))
            updateData('ip', mAllProxy)
            checkProxy(0)
        }
    } else {
        request({
            url: 'http://free-proxy.cz/en/proxylist/country/all/https/ping/all/'+page,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Accept-Language': 'en-US,en;q=0.9,bn;q=0.8,zh-CN;q=0.7,zh;q=0.6',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Cookie': '__utmz=104525399.1675906414.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); __gads=ID=f6042565e9628965-22d653bf94d900b9:T=1675906415:RT=1675906415:S=ALNI_MaBBpoRWru3egO-Lbx6xNxedU4e-w; fp=6e9a6dd0311936cf37c0444c15d7b8ff; __utmc=104525399; __utma=104525399.1728124974.1675906414.1675906414.1675944308.2; __utmb=104525399.1.10.1675944309; __gpi=UID=00000bbe821d60da:T=1675906415:RT=1675944310:S=ALNI_MZ5EkcLVcO1FppHbpHkh1WuAYMOGw',
                'Pragma': 'no-cache',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
            }
        }, function (error, response, body) {
            try {
                let start = body.indexOf('<tbody>')
                let end = body.indexOf('</tbody>')
                let table = body.substring(start+7, end).split('</tr>')
                for (let i = 0; i<table.length-1; i++) {
                    try {
                        let row = table[i].split('</td>')
                        let temp = row[0].substring(row[0].indexOf('decode("')+8)
                        let ip = Buffer.from(temp.substring(0, temp.indexOf('"')), 'base64').toString('ascii')
                        temp = row[1].substring(row[1].indexOf('span'))
                        let port = temp.substring(temp.indexOf('>')+1, temp.indexOf('</span>'))
                        temp = row[3].substring(row[3].indexOf('<a'), row[3].indexOf('</a>'))
                        let name = temp.substring(temp.indexOf('>')+1)
                 
                        mTempAllProxy[ip.replace(/\./g, '_')] = port+'@@'+getCountryCode(name)+'@2'
                    } catch (e) {}
                }

                
                collectServer2(page+1)
                
            } catch (error) {
                mAllProxy = mTempAllProxy
                if(Object.keys(mAllProxy).length > 0) {
                    setData('update', new Date().getTime()+(60*60*1000))
                    updateData('ip', mAllProxy)
                    checkProxy(0)
                }
            }
        })
    }
}


app.post('/proxy', async function (req, res) {
    if(req.body && req.body.data && req.body.data == SIGNATURE) {
        mProxy.sort(() => (Math.random() > .5) ? 1 : -1)
        res.end(JSON.stringify(mProxy))
    } else {
        res.end('error')
    }
})

app.get('/status', async function (req, res) {
    let status = {
        tempSize: Object.keys(mTempAllProxy).length,
        allSize: Object.keys(mAllProxy).length,
        tempProxy: mTempProxy.length,
        proxy: mProxy.length,
        time: mTime,
        have: mTime - new Date().getTime(),
        success: mCompleted
    }
    res.end(JSON.stringify(status))
})

function checkProxy(loop) {
    
    let list = []
    mTempProxy = []
    
    for(let [key, value] of Object.entries(mAllProxy)) {
        list.push(key+'@'+value)
    }
    
    console.log(list.length)

    if(list.length > 0) {
        checkProxyLoop(loop, list)
    }
}

function checkProxyLoop(loop, list) {
    if(loop < list.length) {
        let length = list.length-loop>300 ? 300:list.length-loop
        let size = 0
        for(let i=loop; i<loop+length; i++) {
            try {
                let proxy = {
                    host: '',
                    port: 0,
                    name: '',
                    type: 0,
                    auth: ''
                }
    
                let split = list[i].split('@')
                proxy.host = split[0].replace(/_/g, '.')
                proxy.port = parseInt(split[1])
                if(split.length > 2 && split[2].length > 0) {
                    proxy.auth = split[2]
                }
    
                if(split.length > 3 && split[3].length > 0) {
                    proxy.name = split[3]
                }

                if(split.length > 4 && split[4].type > 0) {
                    proxy.type = split[4]
                }
            
                proxyCheck(proxy).then(res => {
                    mTempProxy.push(res.host+':'+res.port+'@'+res.auth+'@'+res.name+'@'+res.type)
                    size++
                    if(size == length) {
                        checkProxyLoop(loop+300, list)
                    }
                }).catch(e => {
                    size++
                    if(size == length) {
                        checkProxyLoop(loop+300, list)
                    }
                })
            } catch (error) {} 
        }
    } else {
        mCompleted++
        mProxy = mTempProxy
        console.log('Completed', mProxy.length)
    }
}

function setData(path, data) {
    request({
        url: URL+'/'+path+'.json',
        method: 'PUT',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify(data)
    }, function (error, response, body) {})
}

function updateData(path, data) {
    request({
        url: URL+'/'+path+'.json',
        method: 'PUT',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify(data)
    }, function (error, response, body) {})
}

function proxyCheck(proxy) {
    return new Promise((resolve, reject) => {

        const proxy_options = {
            method: 'CONNECT',
            path: 'www.google.com:443',
            timeout: 1000,
            agent: false
        }

        if (proxy.host) {
            proxy_options.host = proxy.host
        }

        if (proxy.port) {
            proxy_options.port = proxy.port
        }

        if (proxy.auth) {
            proxy_options.headers = {
                'Proxy-Authorization': 'Basic ' + Buffer.from(proxy.auth).toString('base64')
            }
        }

        const req = http.request(proxy_options)
        
        req.on('connect', res => {
            req.destroy()
            if (res.statusCode === 200) {
                return resolve(proxy)
            } else {
                return reject('Proxy offline')
            }
        })

        req.on('timeout', () => {
            req.destroy()
        })

        req.on('error', err => {
            return reject((err && err.code) || 'Proxy offline')
        })

        req.end()

    })
}

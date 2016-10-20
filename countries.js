/*
 Countries array was built from the State Dept list of countries. Countries listed on
 the active Zika countries page that were missing from the State Dept list were added.
 */
var countries = {
    'US': {
        text: "United States (USA)",
        riskCategory: RiskCategory.NONE
    },
    'AF': {
        text: "Afghanistan",
        riskCategory: RiskCategory.NONE
    },
    'AL': {
        text: "Albania",
        riskCategory: RiskCategory.NONE
    },
    'DZ': {
        text: "Algeria",
        riskCategory: RiskCategory.NONE
    },
    'AS': {
        text: "American Samoa",
        riskCategory: RiskCategory.ZIKA
    },
    'AD': {
        text: "Andorra",
        riskCategory: RiskCategory.NONE
    },
    'AO': {
        text: "Angola",
        riskCategory: RiskCategory.NONE
    },
    'AI': {
        text: "Anguilla",
        riskCategory: RiskCategory.ZIKA
    },
    'AG': {
        text: "Antigua and Barbuda",
        riskCategory: RiskCategory.ZIKA
    },
    'AR': {
        text: "Argentina",
        riskCategory: RiskCategory.ZIKA
    },
    'AM': {
        text: "Armenia",
        riskCategory: RiskCategory.NONE
    },
    'AW': {
        text: "Aruba",
        riskCategory: RiskCategory.ZIKA
    },
    'AU': {
        text: "Australia",
        riskCategory: RiskCategory.NONE
    },
    'AT': {
        text: "Austria",
        riskCategory: RiskCategory.NONE
    },
    'AZ': {
        text: "Azerbaijan",
        riskCategory: RiskCategory.NONE
    },
    'BS': {
        text: "Bahamas, The",
        riskCategory: RiskCategory.ZIKA
    },
    'BH': {
        text: "Bahrain",
        riskCategory: RiskCategory.NONE
    },
    'BD': {
        text: "Bangladesh",
        riskCategory: RiskCategory.NONE
    },
    'BB': {
        text: "Barbados",
        riskCategory: RiskCategory.ZIKA
    },
    'BY': {
        text: "Belarus",
        riskCategory: RiskCategory.NONE
    },
    'BE': {
        text: "Belgium",
        riskCategory: RiskCategory.NONE
    },
    'BZ': {
        text: "Belize",
        riskCategory: RiskCategory.ZIKA
    },
    'BJ': {
        text: "Benin",
        riskCategory: RiskCategory.NONE
    },
    'BT': {
        text: "Bhutan",
        riskCategory: RiskCategory.NONE
    },
    'BO': {
        text: "Bolivia",
        riskCategory: RiskCategory.ZIKA
    },
    'BQ': {
        text: "Bonaire",
        riskCategory: RiskCategory.ZIKA
    },
    'BA': {
        text: "Bosnia and Herzegovina",
        riskCategory: RiskCategory.NONE
    },
    'BW': {
        text: "Botswana",
        riskCategory: RiskCategory.NONE
    },
    'BR': {
        text: "Brazil",
        riskCategory: RiskCategory.ZIKA
    },
    'VG' : {
        text: "British Virgin Islands",
        riskCategory: RiskCategory.ZIKA
    },
    'BN': {
        text: "Brunei",
        riskCategory: RiskCategory.NONE
    },
    'BG': {
        text: "Bulgaria",
        riskCategory: RiskCategory.NONE
    },
    'BF': {
        text: "Burkina Faso",
        riskCategory: RiskCategory.NONE
    },
    'MM': {
        text: "Burma",
        riskCategory: RiskCategory.NONE
    },
    'BI': {
        text: "Burundi",
        riskCategory: RiskCategory.NONE
    },
    'KH': {
        text: "Cambodia",
        riskCategory: RiskCategory.NONE
    },
    'CM': {
        text: "Cameroon",
        riskCategory: RiskCategory.NONE
    },
    'CA': {
        text: "Canada",
        riskCategory: RiskCategory.NONE
    },
    'CV': {
        text: "Cape Verde",
        riskCategory: RiskCategory.ZIKA
    },
    'KY' :{
        text: "Cayman Islands",
        riskCategory: RiskCategory.ZIKA
    },
    'CF': {
        text: "Central African Republic",
        riskCategory: RiskCategory.NONE
    },
    'TD': {
        text: "Chad",
        riskCategory: RiskCategory.NONE
    },
    'CL': {
        text: "Chile",
        riskCategory: RiskCategory.NONE
    },
    'CN': {
        text: "China",
        riskCategory: RiskCategory.NONE
    },
    'CO': {
        text: "Colombia",
        riskCategory: RiskCategory.ZIKA
    },
    'PR': {
        text: "Commonwealth of Puerto Rico",
        riskCategory: RiskCategory.ZIKA
    },
    'CD': {
        text: "Congo, Democratic Republic of the",
        riskCategory: RiskCategory.NONE
    },
    'CG': {
        text: "Congo, Republic of the",
        riskCategory: RiskCategory.NONE
    },
    'CR': {
        text: "Costa Rica",
        riskCategory: RiskCategory.ZIKA
    },
    'CI': {
        text: "Cote d'Ivoire",
        riskCategory: RiskCategory.ZIKA
    },
    'HR': {
        text: "Croatia",
        riskCategory: RiskCategory.NONE
    },
    'CU': {
        text: "Cuba",
        riskCategory: RiskCategory.ZIKA
    },
    'CW': {
        text: "Curacao",
        riskCategory: RiskCategory.ZIKA
    },
    'CY': {
        text: "Cyprus",
        riskCategory: RiskCategory.NONE
    },
    'CZ': {
        text: "Czech Republic",
        riskCategory: RiskCategory.NONE
    },
    'DK': {
        text: "Denmark",
        riskCategory: RiskCategory.NONE
    },
    'DJ': {
        text: "Djibouti",
        riskCategory: RiskCategory.NONE
    },
    'DM': {
        text: "Dominica",
        riskCategory: RiskCategory.ZIKA
    },
    'DO': {
        text: "Dominican Republic",
        riskCategory: RiskCategory.ZIKA
    },
    'EC': {
        text: "Ecuador",
        riskCategory: RiskCategory.ZIKA
    },
    'EG': {
        text: "Egypt",
        riskCategory: RiskCategory.NONE
    },
    'SV': {
        text: "El Salvador",
        riskCategory: RiskCategory.ZIKA
    },
    'GQ': {
        text: "Equatorial Guinea",
        riskCategory: RiskCategory.NONE
    },
    'ER': {
        text: "Eritrea",
        riskCategory: RiskCategory.NONE
    },
    'EE': {
        text: "Estonia",
        riskCategory: RiskCategory.NONE
    },
    'ET': {
        text: "Ethiopia",
        riskCategory: RiskCategory.NONE
    },
    'FJ': {
        text: "Fiji",
        riskCategory: RiskCategory.ZIKA
    },
    'FI': {
        text: "Finland",
        riskCategory: RiskCategory.NONE
    },
    'FR': {
        text: "France",
        riskCategory: RiskCategory.NONE
    },
    'GF': {
        text: "French Guiana",
        riskCategory: RiskCategory.ZIKA
    },
    'GA': {
        text: "Gabon",
        riskCategory: RiskCategory.NONE
    },
    'GM': {
        text: "Gambia, The",
        riskCategory: RiskCategory.NONE
    },
    'GE': {
        text: "Georgia",
        riskCategory: RiskCategory.NONE
    },
    'DE': {
        text: "Germany",
        riskCategory: RiskCategory.NONE
    },
    'GH': {
        text: "Ghana",
        riskCategory: RiskCategory.NONE
    },
    'GR': {
        text: "Greece",
        riskCategory: RiskCategory.NONE
    },
    'GD': {
        text: "Grenada",
        riskCategory: RiskCategory.ZIKA
    },
    'GP': {
        text: "Guadeloupe",
        riskCategory: RiskCategory.ZIKA
    },
    'GT': {
        text: "Guatemala",
        riskCategory: RiskCategory.ZIKA
    },
    'GN': {
        text: "Guinea",
        riskCategory: RiskCategory.NONE
    },
    'GW': {
        text: "Guinea-Bissau",
        riskCategory: RiskCategory.NONE
    },
    'GY': {
        text: "Guyana",
        riskCategory: RiskCategory.ZIKA
    },
    'HT': {
        text: "Haiti",
        riskCategory: RiskCategory.ZIKA
    },
    'VA': {
        text: "Holy See",
        riskCategory: RiskCategory.NONE
    },
    'HN': {
        text: "Honduras",
        riskCategory: RiskCategory.ZIKA
    },
    'HK': {
        text: "Hong Kong",
        riskCategory: RiskCategory.NONE
    },
    'HU': {
        text: "Hungary",
        riskCategory: RiskCategory.NONE
    },
    'IS': {
        text: "Iceland",
        riskCategory: RiskCategory.NONE
    },
    'IN': {
        text: "India",
        riskCategory: RiskCategory.NONE
    },
    'ID': {
        text: "Indonesia",
        riskCategory: RiskCategory.NONE
    },
    'IR': {
        text: "Iran",
        riskCategory: RiskCategory.NONE
    },
    'IQ': {
        text: "Iraq",
        riskCategory: RiskCategory.NONE
    },
    'IE': {
        text: "Ireland",
        riskCategory: RiskCategory.NONE
    },
    'IL': {
        text: "Israel",
        riskCategory: RiskCategory.NONE
    },
    'IT': {
        text: "Italy",
        riskCategory: RiskCategory.NONE
    },
    'JM': {
        text: "Jamaica",
        riskCategory: RiskCategory.ZIKA
    },
    'JP': {
        text: "Japan",
        riskCategory: RiskCategory.NONE
    },
    'JO': {
        text: "Jordan",
        riskCategory: RiskCategory.NONE
    },
    'KZ': {
        text: "Kazakhstan",
        riskCategory: RiskCategory.NONE
    },
    'KE': {
        text: "Kenya",
        riskCategory: RiskCategory.NONE
    },
    'KI': {
        text: "Kiribati",
        riskCategory: RiskCategory.NONE
    },
    'FM': {
        text: "Kosrae, Federated States of Micronesia",
        riskCategory: RiskCategory.ZIKA
    },
    'XK': {
        text: "Kosovo",
        riskCategory: RiskCategory.NONE
    },
    'KW': {
        text: "Kuwait",
        riskCategory: RiskCategory.NONE
    },
    'KG': {
        text: "Kyrgyzstan",
        riskCategory: RiskCategory.NONE
    },
    'LA': {
        text: "Laos",
        riskCategory: RiskCategory.NONE
    },
    'LV': {
        text: "Latvia",
        riskCategory: RiskCategory.NONE
    },
    'LB': {
        text: "Lebanon",
        riskCategory: RiskCategory.NONE
    },
    'LS': {
        text: "Lesotho",
        riskCategory: RiskCategory.NONE
    },
    'LR': {
        text: "Liberia",
        riskCategory: RiskCategory.NONE
    },
    'LY': {
        text: "Libya",
        riskCategory: RiskCategory.NONE
    },
    'LI': {
        text: "Liechtenstein",
        riskCategory: RiskCategory.NONE
    },
    'LT': {
        text: "Lithuania",
        riskCategory: RiskCategory.NONE
    },
    'LU': {
        text: "Luxembourg",
        riskCategory: RiskCategory.NONE
    },
    'MO': {
        text: "Macau",
        riskCategory: RiskCategory.NONE
    },
    'MK': {
        text: "Macedonia",
        riskCategory: RiskCategory.NONE
    },
    'MG': {
        text: "Madagascar",
        riskCategory: RiskCategory.NONE
    },
    'MW': {
        text: "Malawi",
        riskCategory: RiskCategory.NONE
    },
    'MY': {
        text: "Malaysia",
        riskCategory: RiskCategory.NONE
    },
    'MV': {
        text: "Maldives",
        riskCategory: RiskCategory.NONE
    },
    'ML': {
        text: "Mali",
        riskCategory: RiskCategory.NONE
    },
    'MT': {
        text: "Malta",
        riskCategory: RiskCategory.NONE
    },
    'MH': {
        text: "Marshall Islands",
        riskCategory: RiskCategory.ZIKA
    },
    'MQ': {
        text: "Martinique",
        riskCategory: RiskCategory.ZIKA
    },
    'MR': {
        text: "Mauritania",
        riskCategory: RiskCategory.NONE
    },
    'MU': {
        text: "Mauritius",
        riskCategory: RiskCategory.NONE
    },
    'MX': {
        text: "Mexico",
        riskCategory: RiskCategory.ZIKA
    },
    'MD': {
        text: "Moldova",
        riskCategory: RiskCategory.NONE
    },
    'MC': {
        text: "Monaco",
        riskCategory: RiskCategory.NONE
    },
    'MN': {
        text: "Mongolia",
        riskCategory: RiskCategory.NONE
    },
    'ME': {
        text: "Montenegro",
        riskCategory: RiskCategory.NONE
    },
    'MA': {
        text: "Morocco",
        riskCategory: RiskCategory.NONE
    },
    'MZ': {
        text: "Mozambique",
        riskCategory: RiskCategory.NONE
    },
    'MA': {
        text: "Namibia",
        riskCategory: RiskCategory.NONE
    },
    'NR': {
        text: "Nauru",
        riskCategory: RiskCategory.NONE
    },
    'NP': {
        text: "Nepal",
        riskCategory: RiskCategory.NONE
    },
    'NL': {
        text: "Netherlands",
        riskCategory: RiskCategory.NONE
    },
    'AN': {
        text: "Netherlands Antilles",
        riskCategory: RiskCategory.NONE
    },
    'NC': {
        text: "New Caledonia",
        riskCategory: RiskCategory.ZIKA
    },
    'NZ': {
        text: "New Zealand",
        riskCategory: RiskCategory.NONE
    },
    'NI': {
        text: "Nicaragua",
        riskCategory: RiskCategory.ZIKA
    },
    'NE': {
        text: "Niger",
        riskCategory: RiskCategory.NONE
    },
    'NG': {
        text: "Nigeria",
        riskCategory: RiskCategory.NONE
    },
    'KP': {
        text: "North Korea",
        riskCategory: RiskCategory.NONE
    },
    'NO': {
        text: "Norway",
        riskCategory: RiskCategory.NONE
    },
    'OM': {
        text: "Oman",
        riskCategory: RiskCategory.NONE
    },
    'PK': {
        text: "Pakistan",
        riskCategory: RiskCategory.NONE
    },
    'PW': {
        text: "Palau",
        riskCategory: RiskCategory.NONE
    },
    'PS': {
        text: "Palestinian Territories",
        riskCategory: RiskCategory.NONE
    },
    'PA': {
        text: "Panama",
        riskCategory: RiskCategory.ZIKA
    },
    'PG': {
        text: "Papua New Guinea",
        riskCategory: RiskCategory.ZIKA
    },
    'PY': {
        text: "Paraguay",
        riskCategory: RiskCategory.ZIKA
    },
    'PE': {
        text: "Peru",
        riskCategory: RiskCategory.ZIKA
    },
    'PH': {
        text: "Philippines",
        riskCategory: RiskCategory.NONE
    },
    'PL': {
        text: "Poland",
        riskCategory: RiskCategory.NONE
    },
    'PT': {
        text: "Portugal",
        riskCategory: RiskCategory.NONE
    },
    'QA': {
        text: "Qatar",
        riskCategory: RiskCategory.NONE
    },
    'RO': {
        text: "Romania",
        riskCategory: RiskCategory.NONE
    },
    'RU': {
        text: "Russia",
        riskCategory: RiskCategory.NONE
    },
    'RW': {
        text: "Rwanda",
        riskCategory: RiskCategory.NONE
    },
    'BQ': {
        text: "Saba",
        riskCategory: RiskCategory.ZIKA
    },
    'BL': {
        text: "Saint Barthelemy",
        riskCategory: RiskCategory.ZIKA
    },
    'KN': {
        text: "Saint Kitts and Nevis",
        riskCategory: RiskCategory.ZIKA
    },
    'LC': {
        text: "Saint Lucia",
        riskCategory: RiskCategory.ZIKA
    },
    'MF': {
        text: "Saint Martin",
        riskCategory: RiskCategory.ZIKA
    },
    'VC': {
        text: "Saint Vincent and the Grenadines",
        riskCategory: RiskCategory.ZIKA
    },
    'WS': {
        text: "Samoa",
        riskCategory: RiskCategory.ZIKA
    },
    'SM': {
        text: "San Marino",
        riskCategory: RiskCategory.NONE
    },
    'ST': {
        text: "Sao Tome and Principe",
        riskCategory: RiskCategory.NONE
    },
    'SA': {
        text: "Saudi Arabia",
        riskCategory: RiskCategory.NONE
    },
    'SN': {
        text: "Senegal",
        riskCategory: RiskCategory.NONE
    },
    'RS': {
        text: "Serbia",
        riskCategory: RiskCategory.NONE
    },
    'SC': {
        text: "Seychelles",
        riskCategory: RiskCategory.NONE
    },
    'SL': {
        text: "Sierra Leone",
        riskCategory: RiskCategory.NONE
    },
    'SG': {
        text: "Singapore",
        riskCategory: RiskCategory.ZIKA
    },
    'BQ': {
        text: "Sint Eustatius",
        riskCategory: RiskCategory.ZIKA
    },
    'SX': {
        text: "Sint Maarten",
        riskCategory: RiskCategory.ZIKA
    },
    'SK': {
        text: "Slovakia",
        riskCategory: RiskCategory.NONE
    },
    'SI': {
        text: "Slovenia",
        riskCategory: RiskCategory.NONE
    },
    'SB': {
        text: "Solomon Islands",
        riskCategory: RiskCategory.NONE
    },
    'SO': {
        text: "Somalia",
        riskCategory: RiskCategory.NONE
    },
    'ZA': {
        text: "South Africa",
        riskCategory: RiskCategory.NONE
    },
    'KR': {
        text: "South Korea",
        riskCategory: RiskCategory.NONE
    },
    'SS': {
        text: "South Sudan",
        riskCategory: RiskCategory.NONE
    },
    'ES': {
        text: "Spain",
        riskCategory: RiskCategory.NONE
    },
    'LK': {
        text: "Sri Lanka",
        riskCategory: RiskCategory.NONE
    },
    'SD': {
        text: "Sudan",
        riskCategory: RiskCategory.NONE
    },
    'SR': {
        text: "Suriname",
        riskCategory: RiskCategory.ZIKA
    },
    'SZ': {
        text: "Swaziland",
        riskCategory: RiskCategory.NONE
    },
    'SE': {
        text: "Sweden",
        riskCategory: RiskCategory.NONE
    },
    'CH': {
        text: "Switzerland",
        riskCategory: RiskCategory.NONE
    },
    'SY': {
        text: "Syria",
        riskCategory: RiskCategory.NONE
    },
    'TW': {
        text: "Taiwan",
        riskCategory: RiskCategory.NONE
    },
    'TJ': {
        text: "Tajikistan",
        riskCategory: RiskCategory.NONE
    },
    'TZ': {
        text: "Tanzania",
        riskCategory: RiskCategory.NONE
    },
    'TH': {
        text: "Thailand",
        riskCategory: RiskCategory.NONE
    },
    'TL': {
        text: "Timor-Leste",
        riskCategory: RiskCategory.NONE
    },
    'TG': {
        text: "Togo",
        riskCategory: RiskCategory.NONE
    },
    'TO': {
        text: "Tonga",
        riskCategory: RiskCategory.ZIKA
    },
    'TT': {
        text: "Trinidad and Tobago",
        riskCategory: RiskCategory.ZIKA
    },
    'TN': {
        text: "Tunisia",
        riskCategory: RiskCategory.NONE
    },
    'TR': {
        text: "Turkey",
        riskCategory: RiskCategory.NONE
    },
    'TM': {
        text: "Turkmenistan",
        riskCategory: RiskCategory.NONE
    },
    'TC' : {
        text: "Turks and Caicos",
        riskCategory: RiskCategory.ZIKA
    },
    'TV': {
        text: "Tuvalu",
        riskCategory: RiskCategory.NONE
    },
    'VI': {
        text: "U.S. Virgin Islands",
        riskCategory: RiskCategory.ZIKA
    },
    'UG': {
        text: "Uganda",
        riskCategory: RiskCategory.NONE
    },
    'UA': {
        text: "Ukraine",
        riskCategory: RiskCategory.NONE
    },
    'AE': {
        text: "United Arab Emirates (UAE)",
        riskCategory: RiskCategory.NONE
    },
    'GB': {
        text: "United Kingdom (UK)",
        riskCategory: RiskCategory.NONE
    },
    'UY': {
        text: "Uruguay",
        riskCategory: RiskCategory.NONE
    },
    'UZ': {
        text: "Uzbekistan",
        riskCategory: RiskCategory.NONE
    },
    'VU': {
        text: "Vanuatu",
        riskCategory: RiskCategory.NONE
    },
    'VE': {
        text: "Venezuela",
        riskCategory: RiskCategory.ZIKA
    },
    'VN': {
        text: "Vietnam",
        riskCategory: RiskCategory.NONE
    },
    'YE': {
        text: "Yemen",
        riskCategory: RiskCategory.NONE
    },
    'ZM': {
        text: "Zambia",
        riskCategory: RiskCategory.NONE
    },
    'ZW': {
        text: "Zimbabwe",
        riskCategory: RiskCategory.NONE
    }
}
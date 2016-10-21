/*
 Countries array was built from the State Dept list of countries. Countries listed on
 the active Zika countries page that were missing from the State Dept list were added.
 */
var countries = {
    UNITED_STATES: {
        text: "United States (USA)",
        riskCategory: RiskCategory.NONE
    },
    'AFGHANISTAN': {
        text: "Afghanistan",
        riskCategory: RiskCategory.NONE
    },
    'ALBANIA': {
        text: "Albania",
        riskCategory: RiskCategory.NONE
    },
    'ALGERIA': {
        text: "Algeria",
        riskCategory: RiskCategory.NONE
    },
    'AMERICAN_SOMOA': {
        text: "American Samoa",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'ANDORRA': {
        text: "Andorra",
        riskCategory: RiskCategory.NONE
    },
    'ANGOLA': {
        text: "Angola",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'ANGUILLA': {
        text: "Anguilla",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'ANTIGUA_AND_BARBUDA': {
        text: "Antigua and Barbuda",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'ARGENTINA': {
        text: "Argentina",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'ARMENIA': {
        text: "Armenia",
        riskCategory: RiskCategory.NONE
    },
    'ARUBA': {
        text: "Aruba",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'AUSTRALIA': {
        text: "Australia",
        riskCategory: RiskCategory.NONE
    },
    'AUSTRIA': {
        text: "Austria",
        riskCategory: RiskCategory.NONE
    },
    'AZERBAIJAN': {
        text: "Azerbaijan",
        riskCategory: RiskCategory.NONE
    },
    'BAHAMAS': {
        text: "Bahamas, The",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'BAHRAIN': {
        text: "Bahrain",
        riskCategory: RiskCategory.NONE
    },
    'BANGLADESH': {
        text: "Bangladesh",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'BARBADOS': {
        text: "Barbados",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'BELARUS': {
        text: "Belarus",
        riskCategory: RiskCategory.NONE
    },
    'BELGIUM': {
        text: "Belgium",
        riskCategory: RiskCategory.NONE
    },
    'BELIZE': {
        text: "Belize",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'BENIN': {
        text: "Benin",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'BHUTAN': {
        text: "Bhutan",
        riskCategory: RiskCategory.NONE
    },
    'BOLIVIA': {
        text: "Bolivia",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'BONAIRE': {
        text: "Bonaire",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'BOSNIA_AND_HERZEGOVINA': {
        text: "Bosnia and Herzegovina",
        riskCategory: RiskCategory.NONE
    },
    'BOTSWANA': {
        text: "Botswana",
        riskCategory: RiskCategory.NONE
    },
    'BRAZIL': {
        text: "Brazil",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'BRITISH_VIRGIN_ISLANDS' : {
        text: "British Virgin Islands",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'BRUNEI': {
        text: "Brunei",
        riskCategory: RiskCategory.NONE
    },
    'BULGARIA': {
        text: "Bulgaria",
        riskCategory: RiskCategory.NONE
    },
    'BURKINA_FASO': {
        text: "Burkina Faso",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'BURMA': {
        text: "Burma",
        riskCategory: RiskCategory.NONE
    },
    'BURUNDI': {
        text: "Burundi",
        riskCategory: RiskCategory.NONE
    },
    'CAMBODIA': {
        text: "Cambodia",
        riskCategory: RiskCategory.NONE
    },
    'CAMEROON': {
        text: "Cameroon",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'CANADA': {
        text: "Canada",
        riskCategory: RiskCategory.NONE
    },
    'CAPE_VERDE': {
        text: "Cape Verde",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'CAYMAN_ISLANDS': {
        text: "Cayman Islands",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'CENTRAL_AFRICAN_REPUBLIC': {
        text: "Central African Republic",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'CHAD': {
        text: "Chad",
        riskCategory: RiskCategory.NONE
    },
    'CHILE': {
        text: "Chile",
        riskCategory: RiskCategory.NONE
    },
    'CHINA': {
        text: "China",
        riskCategory: RiskCategory.NONE
    },
    'COLOMBIA': {
        text: "Colombia",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'COMMONWEALTH_OF_PUERTO_RICO': {
        text: "Commonwealth of Puerto Rico",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'CONGO_DEMOCRATIC_REPUBLIC': {
        text: "Congo, Democratic Republic of the",
        riskCategory: RiskCategory.NONE
    },
    'CONGO_REPUBLIC': {
        text: "Congo, Republic of the",
        riskCategory: RiskCategory.NONE
    },
    'COSTA_RICA': {
        text: "Costa Rica",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'COTE_D_IVOIRE': {
        text: "Cote d'Ivoire",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'CROATIA': {
        text: "Croatia",
        riskCategory: RiskCategory.NONE
    },
    'CUBA': {
        text: "Cuba",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'CURACAO': {
        text: "Curacao",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'CYPRUS': {
        text: "Cyprus",
        riskCategory: RiskCategory.NONE
    },
    'CZECH_REPUBLIC': {
        text: "Czech Republic",
        riskCategory: RiskCategory.NONE
    },
    'DENMARK': {
        text: "Denmark",
        riskCategory: RiskCategory.NONE
    },
    'DJIBOUTI': {
        text: "Djibouti",
        riskCategory: RiskCategory.NONE
    },
    'DOMINICA': {
        text: "Dominica",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'DOMINICAN_REPUBLIC': {
        text: "Dominican Republic",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'EASTER_ISLAND':{
        text: "Easter Island",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'ECUADOR': {
        text: "Ecuador",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'EGYPT': {
        text: "Egypt",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'EL_SALVADOR': {
        text: "El Salvador",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'EQUATORIAL_GUINEA': {
        text: "Equatorial Guinea",
        riskCategory: RiskCategory.NONE
    },
    'ERITREA': {
        text: "Eritrea",
        riskCategory: RiskCategory.NONE
    },
    'ESTONIA': {
        text: "Estonia",
        riskCategory: RiskCategory.NONE
    },
    'ETHIOPIA': {
        text: "Ethiopia",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'FIJI': {
        text: "Fiji",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'FINLAND': {
        text: "Finland",
        riskCategory: RiskCategory.NONE
    },
    'FRANCE': {
        text: "France",
        riskCategory: RiskCategory.NONE
    },
    'FRENCH_GUIANA': {
        text: "French Guiana",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'GABON': {
        text: "Gabon",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'GAMBIA': {
        text: "Gambia, The",
        riskCategory: RiskCategory.NONE
    },
    'GEORGIA': {
        text: "Georgia",
        riskCategory: RiskCategory.NONE
    },
    'GERMANY': {
        text: "Germany",
        riskCategory: RiskCategory.NONE
    },
    'GHANA': {
        text: "Ghana",
        riskCategory: RiskCategory.NONE
    },
    'GREECE': {
        text: "Greece",
        riskCategory: RiskCategory.NONE
    },
    'GRENADA': {
        text: "Grenada",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'GUADELOUPE': {
        text: "Guadeloupe",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'GUATEMALA': {
        text: "Guatemala",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'GUINEA': {
        text: "Guinea",
        riskCategory: RiskCategory.NONE
    },
    'GUINEA-BISSAU': {
        text: "Guinea-Bissau",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'GUYANA': {
        text: "Guyana",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'HAITI': {
        text: "Haiti",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'HOLY_SEE': {
        text: "Holy See",
        riskCategory: RiskCategory.NONE
    },
    'HONDURAS': {
        text: "Honduras",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'HONG_KONG': {
        text: "Hong Kong",
        riskCategory: RiskCategory.NONE
    },
    'HUNGARY': {
        text: "Hungary",
        riskCategory: RiskCategory.NONE
    },
    'ICELAND': {
        text: "Iceland",
        riskCategory: RiskCategory.NONE
    },
    'INDIA': {
        text: "India",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'INDONESIA': {
        text: "Indonesia",
        riskCategory: RiskCategory.NONE
    },
    'IRAN': {
        text: "Iran",
        riskCategory: RiskCategory.NONE
    },
    'IRAQ': {
        text: "Iraq",
        riskCategory: RiskCategory.NONE
    },
    'IRELAND': {
        text: "Ireland",
        riskCategory: RiskCategory.NONE
    },
    'ISRAEL': {
        text: "Israel",
        riskCategory: RiskCategory.NONE
    },
    'ITALY': {
        text: "Italy",
        riskCategory: RiskCategory.NONE
    },
    'JAMAICA': {
        text: "Jamaica",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'JAPAN': {
        text: "Japan",
        riskCategory: RiskCategory.NONE
    },
    'JORDAN': {
        text: "Jordan",
        riskCategory: RiskCategory.NONE
    },
    'KAZAKHSTAN': {
        text: "Kazakhstan",
        riskCategory: RiskCategory.NONE
    },
    'KENYA': {
        text: "Kenya",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'KIRIBATI': {
        text: "Kiribati",
        riskCategory: RiskCategory.NONE
    },
    'KOSRAE_FEDERATED_STATES_OF_MICRONESIA': {
        text: "Kosrae, Federated States of Micronesia",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'KOSOVO': {
        text: "Kosovo",
        riskCategory: RiskCategory.NONE
    },
    'KUWAIT': {
        text: "Kuwait",
        riskCategory: RiskCategory.NONE
    },
    'KYRGYZSTAN': {
        text: "Kyrgyzstan",
        riskCategory: RiskCategory.NONE
    },
    'LAOS': {
        text: "Laos",
        riskCategory: RiskCategory.NONE
    },
    'LATVIA': {
        text: "Latvia",
        riskCategory: RiskCategory.NONE
    },
    'LEBANON': {
        text: "Lebanon",
        riskCategory: RiskCategory.NONE
    },
    'LESOTHO': {
        text: "Lesotho",
        riskCategory: RiskCategory.NONE
    },
    'LIBERIA': {
        text: "Liberia",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'LIBYA': {
        text: "Libya",
        riskCategory: RiskCategory.NONE
    },
    'LIECHTENSTEIN': {
        text: "Liechtenstein",
        riskCategory: RiskCategory.NONE
    },
    'LITHUANIA': {
        text: "Lithuania",
        riskCategory: RiskCategory.NONE
    },
    'LUXEMBOURG': {
        text: "Luxembourg",
        riskCategory: RiskCategory.NONE
    },
    'MACAU': {
        text: "Macau",
        riskCategory: RiskCategory.NONE
    },
    'MACEDONIA': {
        text: "Macedonia",
        riskCategory: RiskCategory.NONE
    },
    'MADAGASCAR': {
        text: "Madagascar",
        riskCategory: RiskCategory.NONE
    },
    'MALAWI': {
        text: "Malawi",
        riskCategory: RiskCategory.NONE
    },
    'MALAYSIA': {
        text: "Malaysia",
        riskCategory: RiskCategory.NONE
    },
    'MALDIVES': {
        text: "Maldives",
        riskCategory: RiskCategory.NONE
    },
    'MALI': {
        text: "Mali",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'MALTA': {
        text: "Malta",
        riskCategory: RiskCategory.NONE
    },
    'MARSHALL_ISLANDS': {
        text: "Marshall Islands",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'MARTINIQUE': {
        text: "Martinique",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'MAURITANIA': {
        text: "Mauritania",
        riskCategory: RiskCategory.NONE
    },
    'MAURITIUS': {
        text: "Mauritius",
        riskCategory: RiskCategory.NONE
    },
    'MEXICO': {
        text: "Mexico",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'MOLDOVA': {
        text: "Moldova",
        riskCategory: RiskCategory.NONE
    },
    'MONACO': {
        text: "Monaco",
        riskCategory: RiskCategory.NONE
    },
    'MONGOLIA': {
        text: "Mongolia",
        riskCategory: RiskCategory.NONE
    },
    'MONTENEGRO': {
        text: "Montenegro",
        riskCategory: RiskCategory.NONE
    },
    'MOROCCO': {
        text: "Morocco",
        riskCategory: RiskCategory.NONE
    },
    'MOZAMBIQUE': {
        text: "Mozambique",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'NAMIBIA': {
        text: "Namibia",
        riskCategory: RiskCategory.NONE
    },
    'NAURU': {
        text: "Nauru",
        riskCategory: RiskCategory.NONE
    },
    'NEPAL': {
        text: "Nepal",
        riskCategory: RiskCategory.NONE
    },
    'NETHERLANDS': {
        text: "Netherlands",
        riskCategory: RiskCategory.NONE
    },
    'NETHERLANDS_ANTILLES': {
        text: "Netherlands Antilles",
        riskCategory: RiskCategory.NONE
    },
    'NEW_CALEDONIA': {
        text: "New Caledonia",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'NEW_ZEALAND': {
        text: "New Zealand",
        riskCategory: RiskCategory.NONE
    },
    'NICARAGUA': {
        text: "Nicaragua",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'NIGER': {
        text: "Niger",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'NIGERIA': {
        text: "Nigeria",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'NORTH_KOREA': {
        text: "North Korea",
        riskCategory: RiskCategory.NONE
    },
    'NORWAY': {
        text: "Norway",
        riskCategory: RiskCategory.NONE
    },
    'OMAN': {
        text: "Oman",
        riskCategory: RiskCategory.NONE
    },
    'PAKISTAN': {
        text: "Pakistan",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'PALAU': {
        text: "Palau",
        riskCategory: RiskCategory.NONE
    },
    'PALESTINIAN_TERRITORIES': {
        text: "Palestinian Territories",
        riskCategory: RiskCategory.NONE
    },
    'PANAMA': {
        text: "Panama",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'PAPUA_NEW_GUINEA': {
        text: "Papua New Guinea",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'PARAGUAY': {
        text: "Paraguay",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'PERU': {
        text: "Peru",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'PHILIPPINES': {
        text: "Philippines",
        riskCategory: RiskCategory.NONE
    },
    'POLAND': {
        text: "Poland",
        riskCategory: RiskCategory.NONE
    },
    'PORTUGAL': {
        text: "Portugal",
        riskCategory: RiskCategory.NONE
    },
    'QATAR': {
        text: "Qatar",
        riskCategory: RiskCategory.NONE
    },
    'RO': {
        text: "Romania",
        riskCategory: RiskCategory.NONE
    },
    'RUSSIA': {
        text: "Russia",
        riskCategory: RiskCategory.NONE
    },
    'RWANDA': {
        text: "Rwanda",
        riskCategory: RiskCategory.NONE
    },
    'SABA': {
        text: "Saba",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'SAINT_BARTHELEMY': {
        text: "Saint Barthelemy",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'SAINT_KITTS_AND_NEVIS': {
        text: "Saint Kitts and Nevis",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'SAINT_LUCIA': {
        text: "Saint Lucia",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'SAINT_MARTIN': {
        text: "Saint Martin",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'SAINT_VINCENT_GRENADINES': {
        text: "Saint Vincent and the Grenadines",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'SAMOA': {
        text: "Samoa",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'SAN_MARINO': {
        text: "San Marino",
        riskCategory: RiskCategory.NONE
    },
    'SAO_TOME_PRINCIPE': {
        text: "Sao Tome and Principe",
        riskCategory: RiskCategory.NONE
    },
    'SAUDI_ARABIA': {
        text: "Saudi Arabia",
        riskCategory: RiskCategory.NONE
    },
    'SENEGAL': {
        text: "Senegal",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'SERBIA': {
        text: "Serbia",
        riskCategory: RiskCategory.NONE
    },
    'SEYCHELLES': {
        text: "Seychelles",
        riskCategory: RiskCategory.NONE
    },
    'SIERRA_LEONE': {
        text: "Sierra Leone",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'SINGAPORE': {
        text: "Singapore",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'SINT_EUSTATIUS': {
        text: "Sint Eustatius",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'SINT_MAARTEN': {
        text: "Sint Maarten",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'SLOVAKIA': {
        text: "Slovakia",
        riskCategory: RiskCategory.NONE
    },
    'SLOVENIA': {
        text: "Slovenia",
        riskCategory: RiskCategory.NONE
    },
    'SOLOMON_ISLANDS': {
        text: "Solomon Islands",
        riskCategory: RiskCategory.NONE
    },
    'SOMALIA': {
        text: "Somalia",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'SOUTH_AFRICA': {
        text: "South Africa",
        riskCategory: RiskCategory.NONE
    },
    'SOUTH_KOREA': {
        text: "South Korea",
        riskCategory: RiskCategory.NONE
    },
    'SOUTH_SUDAN': {
        text: "South Sudan",
        riskCategory: RiskCategory.NONE
    },
    'SPAIN': {
        text: "Spain",
        riskCategory: RiskCategory.NONE
    },
    'SRI_LANKA': {
        text: "Sri Lanka",
        riskCategory: RiskCategory.NONE
    },
    'SUDAN': {
        text: "Sudan",
        riskCategory: RiskCategory.NONE
    },
    'SURINAME': {
        text: "Suriname",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'SWAZILAND': {
        text: "Swaziland",
        riskCategory: RiskCategory.NONE
    },
    'SWEDEN': {
        text: "Sweden",
        riskCategory: RiskCategory.NONE
    },
    'SWITZERLAND': {
        text: "Switzerland",
        riskCategory: RiskCategory.NONE
    },
    'SYRIA': {
        text: "Syria",
        riskCategory: RiskCategory.NONE
    },
    'TAIWAN': {
        text: "Taiwan",
        riskCategory: RiskCategory.NONE
    },
    'TAJIKISTAN': {
        text: "Tajikistan",
        riskCategory: RiskCategory.NONE
    },
    'TANZANIA': {
        text: "Tanzania",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'THAILAND': {
        text: "Thailand",
        riskCategory: RiskCategory.NONE
    },
    'TIMOR_LESTE': {
        text: "Timor-Leste",
        riskCategory: RiskCategory.NONE
    },
    'TOGO': {
        text: "Togo",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'TONGA': {
        text: "Tonga",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'TRINIDAD_TOBAGO': {
        text: "Trinidad and Tobago",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'TUNISIA': {
        text: "Tunisia",
        riskCategory: RiskCategory.NONE
    },
    'TURKEY': {
        text: "Turkey",
        riskCategory: RiskCategory.NONE
    },
    'TURKMENISTAN': {
        text: "Turkmenistan",
        riskCategory: RiskCategory.NONE
    },
    'TURKS_CAICOS' : {
        text: "Turks and Caicos",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'TUVALU': {
        text: "Tuvalu",
        riskCategory: RiskCategory.NONE
    },
    'US_VIRGIN_ISLANDS': {
        text: "U.S. Virgin Islands",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'UGANDA': {
        text: "Uganda",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'UKRAINE': {
        text: "Ukraine",
        riskCategory: RiskCategory.NONE
    },
    'UNITED_ARAB_EMIRATES': {
        text: "United Arab Emirates (UAE)",
        riskCategory: RiskCategory.NONE
    },
    'UNITED_KINGDOM': {
        text: "United Kingdom (UK)",
        riskCategory: RiskCategory.NONE
    },
    'URUGUAY': {
        text: "Uruguay",
        riskCategory: RiskCategory.NONE
    },
    'UZBEKISTAN': {
        text: "Uzbekistan",
        riskCategory: RiskCategory.NONE
    },
    'VANUATU': {
        text: "Vanuatu",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'VENEZUELA': {
        text: "Venezuela",
        riskCategory: RiskCategory.EPIDEMIC_ZIKA
    },
    'VIETNAM': {
        text: "Vietnam",
        riskCategory: RiskCategory.NONE
    },
    'YEMEN': {
        text: "Yemen",
        riskCategory: RiskCategory.NONE
    },
    'ZAMBIA': {
        text: "Zambia",
        riskCategory: RiskCategory.ENDEMIC_ZIKA
    },
    'ZIMBABWE': {
        text: "Zimbabwe",
        riskCategory: RiskCategory.NONE
    }
}
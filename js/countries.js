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
    'AMERICAN_SAMOA': {
        text: "American Samoa",
        riskCategory: RiskCategory.NONE
    },
    'ANDORRA': {
        text: "Andorra",
        riskCategory: RiskCategory.NONE
    },
    'ANGOLA': {
        text: "Angola",
        riskCategory: RiskCategory.ZIKA
    },
    'ANGUILLA': {
        text: "Anguilla",
        riskCategory: RiskCategory.ZIKA
    },
    'ANTIGUA_AND_BARBUDA': {
        text: "Antigua and Barbuda",
        riskCategory: RiskCategory.ZIKA
    },
    'ARGENTINA': {
        text: "Argentina",
        riskCategory: RiskCategory.ZIKA
    },
    'ARMENIA': {
        text: "Armenia",
        riskCategory: RiskCategory.NONE
    },
    'ARUBA': {
        text: "Aruba",
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
    },
    'BAHRAIN': {
        text: "Bahrain",
        riskCategory: RiskCategory.NONE
    },
    'BANGLADESH': {
        text: "Bangladesh",
        riskCategory: RiskCategory.ZIKA
    },
    'BARBADOS': {
        text: "Barbados",
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
    },
    'BENIN': {
        text: "Benin",
        riskCategory: RiskCategory.ZIKA
    },
    'BHUTAN': {
        text: "Bhutan",
        riskCategory: RiskCategory.NONE
    },
    'BOLIVIA': {
        text: "Bolivia",
        riskCategory: RiskCategory.ZIKA
    },
    'BONAIRE': {
        text: "Bonaire",
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
    },
    'BRITISH_VIRGIN_ISLANDS' : {
        text: "British Virgin Islands",
        riskCategory: RiskCategory.ZIKA
    },
    'BRUNEI': {
        text: "Brunei",
        riskCategory: RiskCategory.ZIKA
    },
    'BULGARIA': {
        text: "Bulgaria",
        riskCategory: RiskCategory.NONE
    },
    'BURKINA_FASO': {
        text: "Burkina Faso",
        riskCategory: RiskCategory.ZIKA
    },
    'BURMA': {
        text: "Burma",
        riskCategory: RiskCategory.ZIKA
    },
    'BURUNDI': {
        text: "Burundi",
        riskCategory: RiskCategory.NONE
    },
    'CAMBODIA': {
        text: "Cambodia",
        riskCategory: RiskCategory.ZIKA
    },
    'CAMEROON': {
        text: "Cameroon",
        riskCategory: RiskCategory.ZIKA
    },
    'CANADA': {
        text: "Canada",
        riskCategory: RiskCategory.NONE
    },
    'CAPE_VERDE': {
        text: "Cape Verde",
        riskCategory: RiskCategory.ZIKA
    },
    'CAYMAN_ISLANDS': {
        text: "Cayman Islands",
        riskCategory: RiskCategory.NONE
    },
    'CENTRAL_AFRICAN_REPUBLIC': {
        text: "Central African Republic",
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
    },
    'COTE_D_IVOIRE': {
        text: "Cote d'Ivoire",
        riskCategory: RiskCategory.ZIKA
    },
    'CROATIA': {
        text: "Croatia",
        riskCategory: RiskCategory.NONE
    },
    'CUBA': {
        text: "Cuba",
        riskCategory: RiskCategory.ZIKA
    },
    'CURACAO': {
        text: "Curacao",
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
    },
    'DOMINICAN_REPUBLIC': {
        text: "Dominican Republic",
        riskCategory: RiskCategory.ZIKA
    },
    'EASTER_ISLAND':{
        text: "Easter Island",
        riskCategory: RiskCategory.ZIKA
    },
    'ECUADOR': {
        text: "Ecuador",
        riskCategory: RiskCategory.ZIKA
    },
    'EGYPT': {
        text: "Egypt",
        riskCategory: RiskCategory.ZIKA
    },
    'EL_SALVADOR': {
        text: "El Salvador",
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
    },
    'FIJI': {
        text: "Fiji",
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
    },
    'GABON': {
        text: "Gabon",
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
    },
    'GUADELOUPE': {
        text: "Guadeloupe",
        riskCategory: RiskCategory.NONE
    },
    'GUATEMALA': {
        text: "Guatemala",
        riskCategory: RiskCategory.ZIKA
    },
    'GUINEA': {
        text: "Guinea",
        riskCategory: RiskCategory.NONE
    },
    'GUINEA-BISSAU': {
        text: "Guinea-Bissau",
        riskCategory: RiskCategory.ZIKA
    },
    'GUYANA': {
        text: "Guyana",
        riskCategory: RiskCategory.ZIKA
    },
    'HAITI': {
        text: "Haiti",
        riskCategory: RiskCategory.ZIKA
    },
    'HOLY_SEE': {
        text: "Holy See",
        riskCategory: RiskCategory.NONE
    },
    'HONDURAS': {
        text: "Honduras",
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
    },
    'INDONESIA': {
        text: "Indonesia",
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
    },
    'KIRIBATI': {
        text: "Kiribati",
        riskCategory: RiskCategory.NONE
    },
    'KOSRAE_FEDERATED_STATES_OF_MICRONESIA': {
        text: "Kosrae, Federated States of Micronesia",
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
    },
    'MALDIVES': {
        text: "Maldives",
        riskCategory: RiskCategory.ZIKA
    },
    'MALI': {
        text: "Mali",
        riskCategory: RiskCategory.ZIKA
    },
    'MALTA': {
        text: "Malta",
        riskCategory: RiskCategory.NONE
    },
    'MARSHALL_ISLANDS': {
        text: "Marshall Islands",
        riskCategory: RiskCategory.NONE
    },
    'MARTINIQUE': {
        text: "Martinique",
        riskCategory: RiskCategory.NONE
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
        riskCategory: RiskCategory.ZIKA
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
    'MONTSERRAT':{
        text: "Montserrat",
        riskCategory: RiskCategory.ZIKA
    },
    'MOROCCO': {
        text: "Morocco",
        riskCategory: RiskCategory.NONE
    },
    'MOZAMBIQUE': {
        text: "Mozambique",
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.NONE
    },
    'NEW_ZEALAND': {
        text: "New Zealand",
        riskCategory: RiskCategory.NONE
    },
    'NICARAGUA': {
        text: "Nicaragua",
        riskCategory: RiskCategory.ZIKA
    },
    'NIGER': {
        text: "Niger",
        riskCategory: RiskCategory.ZIKA
    },
    'NIGERIA': {
        text: "Nigeria",
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
    },
    'PALAU': {
        text: "Palau",
        riskCategory: RiskCategory.ZIKA
    },
    'PALESTINIAN_TERRITORIES': {
        text: "Palestinian Territories",
        riskCategory: RiskCategory.NONE
    },
    'PANAMA': {
        text: "Panama",
        riskCategory: RiskCategory.ZIKA
    },
    'PAPUA_NEW_GUINEA': {
        text: "Papua New Guinea",
        riskCategory: RiskCategory.ZIKA
    },
    'PARAGUAY': {
        text: "Paraguay",
        riskCategory: RiskCategory.ZIKA
    },
    'PERU': {
        text: "Peru",
        riskCategory: RiskCategory.ZIKA
    },
    'PHILIPPINES': {
        text: "Philippines",
        riskCategory: RiskCategory.ZIKA
    },
    'POLAND': {
        text: "Poland",
        riskCategory: RiskCategory.NONE
    },
    'PORTUGAL': {
        text: "Portugal",
        riskCategory: RiskCategory.NONE
    },
    'PUERTO_RICO': {
        text: "Puerto Rico",
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
    },
    'SAINT_BARTHELEMY': {
        text: "Saint Barthelemy",
        riskCategory: RiskCategory.NONE
    },
    'SAINT_KITTS_AND_NEVIS': {
        text: "Saint Kitts and Nevis",
        riskCategory: RiskCategory.ZIKA
    },
    'SAINT_LUCIA': {
        text: "Saint Lucia",
        riskCategory: RiskCategory.ZIKA
    },
    'SAINT_MARTIN': {
        text: "Saint Martin",
        riskCategory: RiskCategory.ZIKA
    },
    'SAINT_VINCENT_GRENADINES': {
        text: "Saint Vincent and the Grenadines",
        riskCategory: RiskCategory.ZIKA
    },
    'SAMOA': {
        text: "Samoa",
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
    },
    'SINGAPORE': {
        text: "Singapore",
        riskCategory: RiskCategory.ZIKA
    },
    'SINT_EUSTATIUS': {
        text: "Sint Eustatius",
        riskCategory: RiskCategory.ZIKA
    },
    'SINT_MAARTEN': {
        text: "Sint Maarten",
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
    },
    'SOMALIA': {
        text: "Somalia",
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
    },
    'THAILAND': {
        text: "Thailand",
        riskCategory: RiskCategory.ZIKA
    },
    'TIMOR_LESTE': {
        text: "Timor-Leste",
        riskCategory: RiskCategory.ZIKA
    },
    'TOGO': {
        text: "Togo",
        riskCategory: RiskCategory.ZIKA
    },
    'TONGA': {
        text: "Tonga",
        riskCategory: RiskCategory.ZIKA
    },
    'TRINIDAD_TOBAGO': {
        text: "Trinidad and Tobago",
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
    },
    'TUVALU': {
        text: "Tuvalu",
        riskCategory: RiskCategory.NONE
    },
    'US_VIRGIN_ISLANDS': {
        text: "U.S. Virgin Islands",
        riskCategory: RiskCategory.ZIKA
    },
    'UGANDA': {
        text: "Uganda",
        riskCategory: RiskCategory.ZIKA
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
        riskCategory: RiskCategory.ZIKA
    },
    'VENEZUELA': {
        text: "Venezuela",
        riskCategory: RiskCategory.ZIKA
    },
    'VIETNAM': {
        text: "Vietnam",
        riskCategory: RiskCategory.ZIKA
    },
    'YEMEN': {
        text: "Yemen",
        riskCategory: RiskCategory.NONE
    },
    'ZAMBIA': {
        text: "Zambia",
        riskCategory: RiskCategory.ZIKA
    },
    'ZIMBABWE': {
        text: "Zimbabwe",
        riskCategory: RiskCategory.NONE
    }
}
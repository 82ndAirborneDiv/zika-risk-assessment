/**
 * Created by jason on 6/8/16.
 */
$(document).ready(function(){
    $("#singleCountry").select2({
        placeholder: 'Select a country',
        data: countries,
        multiple: false
    });
    $("#multiCountry").select2({
        placeholder: 'Select a country or countries',
        data: countries,
        multiple: true
    })
    $("#singleSelectCountry").hide();
    $("#multiSelectCountry").hide();
    $("#endpoint-call-to-action").hide();
    $("#endpoint-disclaimer").hide();
    $("#country-answers").hide();

    $("#start").click(function() {
        $("#start").hide();
        $("#intro").hide();
        $("#back").show();
        $("#restart").show();
        loadNextQuestion("" +1);
    });
    $("#back").click(function(){
        var historyLength = navigationHistory.length;
        if (historyLength > 1) {
            loadNextQuestion(navigationHistory[historyLength - 2]);
            navigationHistory.pop();
            navigationHistory.pop();
        }
        $("#endpoint-call-to-action").hide();
        $("#endpoint-disclaimer").hide();
    }).hide();
    $("#restart").click(function(){
        navigationHistory = [];
        $("#start").show();
        $("#intro").show();
        $("#question-text").hide();
        $("#question-answers").hide();
        $("#endpoint").hide();
        $("#endpoint-call-to-action").hide();
        $("#endpoint-disclaimer").hide();
        $("#back").hide();
        $("#restart").hide();
        $("#singleSelectCountry").hide();
        $('html, body').animate({ scrollTop: 0 }, 0);
    }).hide();
    $(".answer").click(function(){
        $("#question-text").html(questions["" +this.name].text);
    });
    $("#singleCountrySelect").click(function(){
        var currentQuestion = navigationHistory[navigationHistory.length - 1];
        var selection = $("#singleCountry").val();
        var next;
        console.log(selection);

        if("" === selection){

        }
        else {
            if (zikaCountries.includes(selection)) {
                next = questions["" + currentQuestion].answers["1"];
            }
            else {
                next = questions["" + currentQuestion].answers["2"];
            }
            if (next.isEndPoint) {
                loadEndPoint(next.nextChoice);
            }
            else {
                loadNextQuestion(next.nextChoice);
            }
            $("#singleSelectCountry").hide();
        }
    });
    $("#multiCountrySelect").click(function(){
        var currentQuestion = navigationHistory[navigationHistory.length - 1];;
        var input = $('#multiCountry option:selected');
        var selection = $.map(input, function(option){
            return option.value;
        });
        var next;
        console.log(selection);

        if(selection.length === 0){

        }
        else{
            console.log("starting check for zika countries");
            var zika = false;
            for(var i = 0; i < selection.length; i++){
                console.log(selection[i]);
                if(zikaCountries.includes(selection[i])){
                    zika = true;
                    break;
                }
            }
            console.log(zika);
            if(zika){
                next = questions["" + currentQuestion].answers["1"];
            }
            else{
                next = questions["" + currentQuestion].answers["2"];
            }
            if (next.isEndPoint) {
                loadEndPoint(next.nextChoice);
            }
            else {
                loadNextQuestion(next.nextChoice);
            }
            $("#multiSelectCountry").hide();
        }
    });
    /*
    $("#singleCountry").change(function(){
        var currentQuestion = navigationHistory[navigationHistory.length - 1];
        var selection = document.getElementById("singleCountry").value;
        var next;
        if(zikaCountries.includes(selection)){
            next = questions["" +currentQuestion].answers["1"];
        }
        else{
            next = questions["" +currentQuestion].answers["2"];
        }
        if(next.isEndPoint){
            loadEndPoint(next.nextChoice);
        }
        else{
            loadNextQuestion(next.nextChoice);
        }
        $("#singleSelectCountry").hide();
    });
    */
});

function Question(text, answers) {
    this.text = text;
    this.answers = answers;
}

function Answer(text, nextChoice) {
    this.text = text;
    this.nextChoice = nextChoice;
}
function loadNextQuestion(number){
    $("#singleSelectCountry").hide();
    $("#multiSelectCountry").hide();
    //$("#singleCountry option[value='default']").prop('selected', true).hide();
    $("#question-text").html(questions["" +number].text).show();
    var answers = Object.keys(questions["" +number].answers);
    var buttons = '<div class="btn-group btn-group-vertical" role="group">';

    for(var i = 1; i <= answers.length; i++) {
        var temp = questions["" + number].answers[i];
        switch (temp.text) {
            case "Non-Zika Country":
                if(temp.hasOwnProperty("multiSelect")){
                    if(temp.multiSelect){
                        $("#multiSelectCountry").show();
                    }
                }
                else{
                    $("#singleSelectCountry").show();
                }
                break;
            case "Zika Country":
                break;
            default:
                if (!temp.isEndPoint) {
                    buttons += '<button class="btn btn-default" style="white-space: normal" onclick=' + 'loadNextQuestion(' + temp.nextChoice + ')>' + temp.text + '</button>';
                }
                else {
                    buttons += '<button class="btn btn-default" style="white-space: normal" onclick=' + 'loadEndPoint(' + temp.nextChoice + ')>' + temp.text + '</button>';
                }
                break;
        }
        $('html, body').animate({ scrollTop: 0 }, 0);
    }

    buttons += "</div>";
    navigationHistory.push(number);
    $("#question-answers").html(buttons).show();
    $("#endpoint").hide();
}

function loadEndPoint(number){
    navigationHistory.push(number);
    $("#question-answers").hide();
    $("#question-text").hide();
    $("#endpoint").load("endpoints.html #endpoint" +number).show();
    $("#endpoint-call-to-action").show();
    $("#endpoint-disclaimer").show();
    $('html, body').animate({ scrollTop: 0 }, 0);
}
var navigationHistory = [];

function Country(name, activeZika){
    this.name = name;
    this.activeZika = activeZika;
}

/*
    The Zika countries object was built from the CDC page and cross comparing the countries listed with a country code
    chart.
    http://www.cdc.gov/zika/geo/active-countries.html
    Country code : Country name
 */

var zikaCountries = [
    "AR", "AW", "BB", "BZ", "BO", "BQ", "BR", "CO", "PR", "CR", "CU", "CW", "DM", "DO", "EC", "SV", "GF", "GD", "GP",
    "GT", "GY", "HT", "HN", "JM", "MQ", "MX", "NI", "PA", "PY", "PE", "BL", "LC", "MF", "VC", "SX", "SR", "TT", "VI",
    "VE", "AS", "FJ", "FM", "MH", "NC", "PG", "WS", "TO", "CV"
]
var countries = [
    {
        id: 'AF',
        text: "Afghanistan"
    },
    {
        id: 'AL',
        text: "Albania"
    },
    {
        id: 'DZ',
        text: "Algeria"
    },
    {
        id: 'AS',
        text: "American Samoa"
    },
    {
        id: 'AD',
        text: "Andorra"
    },
    {
        id: 'AO',
        text: "Angola"
    },
    {
        id: 'AI',
        text: "Anguilla"
    },
    {
        id: 'AQ',
        text: "Antarctica"
    },
    {
        id: 'AG',
        text: "Antigua and Barbuda"
    },
    {
        id: 'AR',
        text: "Argentina"
    },
    {
        id: 'AM',
        text: "Armenia"
    },
    {
        id: 'AW',
        text: "Aruba"
    },
    {
        id: 'AU',
        text: "Australia"
    },
    {
        id: 'AT',
        text: "Austria"
    },
    {
        id: 'AZ',
        text: "Azerbaijan"
    },
    {
        id: 'BS',
        text: "Bahamas"
    },
    {
        id: 'BH',
        text: "Bahrain"
    },
    {
        id: 'BD',
        text: "Bangladesh"
    },
    {
        id: 'BB',
        text: "Barbados"
    },
    {
        id: 'BY',
        text: "Belarus"
    },
    {
        id: 'BE',
        text: "Belgium"
    },
    {
        id: 'BZ',
        text: "Belize"
    },
    {
        id: 'BJ',
        text: "Benin"
    },
    {
        id: 'BM',
        text: "Bermuda"
    },
    {
        id: 'BT',
        text: "Bhutan"
    },
    {
        id: 'BO',
        text: "Bolivia"
    },
    {
        id: 'BA',
        text: "Bosnia and Herzegovina"
    },
    {
        id: 'BW',
        text: "Botswana"
    },
    {
        id: 'BR',
        text: "Brazil"
    },
    {
        id: 'IO',
        text: "British Indian Ocean Territory"
    },
    {
        id: 'VG',
        text: "British Virgin Islands"
    },
    {
        id: 'BN',
        text: "Brunei"
    },
    {
        id: 'BG',
        text: "Bulgaria"
    },
    {
        id: 'BF',
        text: "Burkina Faso"
    },
    {
        id: 'BI',
        text: "Burundi"
    },
    {
        id: 'KH',
        text: "Cambodia"
    },
    {
        id: 'CM',
        text: "Cameroon"
    },
    {
        id: 'CA',
        text: "Canada"
    },
    {
        id: 'CV',
        text: "Cape Verde"
    },
    {
        id: 'KY',
        text: "Cayman Islands"
    },
    {
        id: 'CF',
        text: "Central African Republic"
    },
    {
        id: 'TD',
        text: "Chad"
    },
    {
        id: 'CL',
        text: "Chile"
    },
    {
        id: 'CN',
        text: "China"
    },
    {
        id: 'CX',
        text: "Christmas Island"
    },
    {
        id: 'CC',
        text: "Cocos Islands"
    },
    {
        id: 'CO',
        text: "Colombia"
    },
    {
        id: 'KM',
        text: "Comoros"
    },
    {
        id: 'CK',
        text: "Cook Islands"
    },
    {
        id: 'CR',
        text: "Costa Rica"
    },
    {
        id: 'HR',
        text: "Croatia"
    },
    {
        id: 'CU',
        text: "Cuba"
    },
    {
        id: 'CW',
        text: "Curacao"
    },
    {
        id: 'CY',
        text: "Cyprus"
    },
    {
        id: 'CZ',
        text: "Czech Republic"
    },
    {
        id: 'CD',
        text: "Democratic Republic of the Congo"
    },
    {
        id: 'DK',
        text: "Denmark"
    },
    {
        id: 'DJ',
        text: "Djibouti"
    },
    {
        id: 'DM',
        text: "Dominica"
    },
    {
        id: 'DO',
        text: "Dominican Republic"
    },
    {
        id: 'TL',
        text: "East Timor"
    },
    {
        id: 'EC',
        text: "Ecuador"
    },
    {
        id: 'EG',
        text: "Egypt"
    },
    {
        id: 'SV',
        text: "El Salvador"
    },
    {
        id: 'GQ',
        text: "Equatorial Guinea"
    },
    {
        id: 'ER',
        text: "Eritrea"
    },
    {
        id: 'EE',
        text: "Estonia"
    },
    {
        id: 'ET',
        text: "Ethiopia"
    },
    {
        id: 'FK',
        text: "Falkland Islands"
    },
    {
        id: 'FO',
        text: "Faroe Islands"
    },
    {
        id: 'FJ',
        text: "Fiji"
    },
    {
        id: 'FI',
        text: "Finland"
    },
    {
        id: 'FR',
        text: "France"
    },
    {
        id: 'PF',
        text: "French Polynesia"
    },
    {
        id: 'GA',
        text: "Gabon"
    },
    {
        id: 'GM',
        text: "Gambia"
    },
    {
        id: 'GE',
        text: "Georgia"
    },
    {
        id: 'DE',
        text: "Germany"
    },
    {
        id: 'GH',
        text: "Ghana"
    },
    {
        id: 'GI',
        text: "Gibraltar"
    },
    {
        id: 'GR',
        text: "Greece"
    },
    {
        id: 'GL',
        text: "Greenland"
    },
    {
        id: 'GD',
        text: "Grenada"
    },
    {
        id: 'GU',
        text: "Guam"
    },
    {
        id: 'GT',
        text: "Guatemala"
    },
    {
        id: 'GG',
        text: "Guernsey"
    },
    {
        id: 'GN',
        text: "Guinea"
    },
    {
        id: 'GW',
        text: "Guinea-Bissau"
    },
    {
        id: 'GY',
        text: "Guyana"
    },
    {
        id: 'HT',
        text: "Haiti"
    },
    {
        id: 'HN',
        text: "Honduras"
    },
    {
        id: 'HK',
        text: "Hong Kong"
    },
    {
        id: 'HU',
        text: "Hungary"
    },
    {
        id: 'IS',
        text: "Iceland"
    },
    {
        id: 'IN',
        text: "India"
    },
    {
        id: 'ID',
        text: "Indonesia"
    },
    {
        id: 'IR',
        text: "Iran"
    },
    {
        id: 'IQ',
        text: "Iraq"
    },
    {
        id: 'IE',
        text: "Ireland"
    },
    {
        id: 'IM',
        text: "Isle of Man"
    },
    {
        id: 'IL',
        text: "Israel"
    },
    {
        id: 'IT',
        text: "Italy"
    },
    {
        id: 'CI',
        text: "Ivory Coast"
    },
    {
        id: 'JM',
        text: "Jamaica"
    },
    {
        id: 'JP',
        text: "Japan"
    },
    {
        id: 'JE',
        text: "Jersey"
    },
    {
        id: 'JO',
        text: "Jordan"
    },
    {
        id: 'KZ',
        text: "Kazakhstan"
    },
    {
        id: 'KE',
        text: "Kenya"
    },
    {
        id: 'KI',
        text: "Kiribati"
    },
    {
        id: 'XK',
        text: "Kosovo"
    },
    {
        id: 'KW',
        text: "Kuwait"
    },
    {
        id: 'KG',
        text: "Kyrgyzstan"
    },
    {
        id: 'LA',
        text: "Laos"
    },
    {
        id: 'LV',
        text: "Latvia"
    },
    {
        id: 'LB',
        text: "Lebanon"
    },
    {
        id: 'LS',
        text: "Lesotho"
    },
    {
        id: 'LR',
        text: "Liberia"
    },
    {
        id: 'LY',
        text: "Libya"
    },
    {
        id: 'LI',
        text: "Liechtenstein"
    },
    {
        id: 'LT',
        text: "Lithuania"
    },
    {
        id: 'LU',
        text: "Luxembourg"
    },
    {
        id: 'MO',
        text: "Macao"
    },
    {
        id: 'MK',
        text: "Macedonia"
    },
    {
        id: 'MG',
        text: "Madagascar"
    },
    {
        id: 'MW',
        text: "Malawi"
    },
    {
        id: 'MY',
        text: "Malaysia"
    },
    {
        id: 'MV',
        text: "Maldives"
    },
    {
        id: 'ML',
        text: "Mali"
    },
    {
        id: 'MT',
        text: "Malta"
    },
    {
        id: 'MH',
        text: "Marshall Islands"
    },
    {
        id: 'MR',
        text: "Mauritania"
    },
    {
        id: 'MU',
        text: "Mauritius"
    },
    {
        id: 'YT',
        text: "Mayotte"
    },
    {
        id: 'MX',
        text: "Mexico"
    },
    {
        id: 'FM',
        text: "Micronesia"
    },
    {
        id: 'MD',
        text: "Moldova"
    },
    {
        id: 'MC',
        text: "Monaco"
    },
    {
        id: 'MN',
        text: "Mongolia"
    },
    {
        id: 'ME',
        text: "Montenegro"
    },
    {
        id: 'MS',
        text: "Montserrat"
    },
    {
        id: 'MA',
        text: "Morocco"
    },
    {
        id: 'MZ',
        text: "Mozambique"
    },
    {
        id: 'MM',
        text: "Myanmar"
    },
    {
        id: 'MA',
        text: "Namibia"
    },
    {
        id: 'NR',
        text: "Nauru"
    },
    {
        id: 'NP',
        text: "Nepal"
    },
    {
        id: 'NL',
        text: "Netherlands"
    },
    {
        id: 'AN',
        text: "Netherlands Antilles"
    },
    {
        id: 'NC',
        text: "New Caledonia"
    },
    {
        id: 'NZ',
        text: "New Zealand"
    },
    {
        id: 'NI',
        text: "Nicaragua"
    },
    {
        id: 'NE',
        text: "Niger"
    },
    {
        id: 'NG',
        text: "Nigeria"
    },
    {
        id: 'NU',
        text: "Niue"
    },
    {
        id: 'KP',
        text: "North Korea"
    },
    {
        id: 'MP',
        text: "Northern Mariana Islands"
    },
    {
        id: 'NO',
        text: "Norway"
    },
    {
        id: 'OM',
        text: "Oman"
    },
    {
        id: 'PK',
        text: "Pakistan"
    },
    {
        id: 'PW',
        text: "Palau"
    },
    {
        id: 'PS',
        text: "Palestine"
    },
    {
        id: 'PA',
        text: "Panama"
    },
    {
        id: 'PG',
        text: "Papua New Guinea"
    },
    {
        id: 'PY',
        text: "Paraguay"
    },
    {
        id: 'PE',
        text: "Peru"
    },
    {
        id: 'PH',
        text: "Philippines"
    },
    {
        id: 'PN',
        text: "Pitcairn"
    },
    {
        id: 'PL',
        text: "Poland"
    },
    {
        id: 'PT',
        text: "Portugal"
    },
    {
        id: 'PR',
        text: "Puerto Rico"
    },
    {
        id: 'QA',
        text: "Qatar"
    },
    {
        id: 'CG',
        text: "Republic of the Congo"
    },
    {
        id: 'RE',
        text: "Reunion"
    },
    {
        id: 'RO',
        text: "Romania"
    },
    {
        id: 'RU',
        text: "Russia"
    },
    {
        id: 'RW',
        text: "Rwanda"
    },
    {
        id: 'BL',
        text: "Saint Barthelemy"
    },
    {
        id: 'SH',
        text: "Saint Helena"
    },
    {
        id: 'KN',
        text: "Saint Kitts and Nevis"
    },
    {
        id: 'LC',
        text: "Saint Lucia"
    },
    {
        id: 'MF',
        text: "Saint Martin"
    },
    {
        id: 'PM',
        text: "Saint Pierre and Miquelon"
    },
    {
        id: 'VC',
        text: "Saint Vincent and the Grenadines"
    },
    {
        id: 'WS',
        text: "Samoa"
    },
    {
        id: 'SM',
        text: "San Marino"
    },
    {
        id: 'ST',
        text: "Sao Tome and Principe"
    },
    {
        id: 'SA',
        text: "Saudi Arabia"
    },
    {
        id: 'SN',
        text: "Senegal"
    },
    {
        id: 'RS',
        text: "Serbia"
    },
    {
        id: 'SC',
        text: "Seychelles"
    },
    {
        id: 'SL',
        text: "Sierra Leone"
    },
    {
        id: 'SG',
        text: "Singapore"
    },
    {
        id: 'SX',
        text: "Sint Maarten"
    },
    {
        id: 'SK',
        text: "Slovakia"
    },
    {
        id: 'SI',
        text: "Slovenia"
    },
    {
        id: 'SB',
        text: "Solomon Islands"
    },
    {
        id: 'SO',
        text: "Somalia"
    },
    {
        id: 'ZA',
        text: "South Africa"
    },
    {
        id: 'KR',
        text: "South Korea"
    },
    {
        id: 'SS',
        text: "South Sudan"
    },
    {
        id: 'ES',
        text: "Spain"
    },
    {
        id: 'LK',
        text: "Sri Lanka"
    },
    {
        id: 'SD',
        text: "Sudan"
    },
    {
        id: 'SR',
        text: "Suriname"
    },
    {
        id: 'SJ',
        text: "Svalbard and Jan Mayen"
    },
    {
        id: 'SZ',
        text: "Swaziland"
    },
    {
        id: 'SE',
        text: "Sweden"
    },
    {
        id: 'CH',
        text: "Switzerland"
    },
    {
        id: 'SY',
        text: "Syria"
    },
    {
        id: 'TW',
        text: "Taiwan"
    },
    {
        id: 'TJ',
        text: "Tajikistan"
    },
    {
        id: 'TZ',
        text: "Tanzania"
    },
    {
        id: 'TH',
        text: "Thailand"
    },
    {
        id: 'TG',
        text: "Togo"
    },
    {
        id: 'TK',
        text: "Tokelau"
    },
    {
        id: 'TO',
        text: "Tonga"
    },
    {
        id: 'TT',
        text: "Trinidad and Tobago"
    },
    {
        id: 'TN',
        text: "Tunisia"
    },
    {
        id: 'TR',
        text: "Turkey"
    },
    {
        id: 'TM',
        text: "Turkmenistan"
    },
    {
        id: 'TC',
        text: "Turks and Caicos Islands"
    },
    {
        id: 'TV',
        text: "Tuvalu"
    },
    {
        id: 'VI',
        text: "U.S. Virgin Islands"
    },
    {
        id: 'UG',
        text: "Uganda"
    },
    {
        id: 'UA',
        text: "Ukraine"
    },
    {
        id: 'AE',
        text: "United Arab Emirates"
    },
    {
        id: 'GB',
        text: "United Kingdom"
    },
    {
        id: 'US',
        text: "United States"
    },
    {
        id: 'UY',
        text: "Uruguay"
    },
    {
        id: 'UZ',
        text: "Uzbekistan"
    },
    {
        id: 'VU',
        text: "Vanuatu"
    },
    {
        id: 'VA',
        text: "Vatican"
    },
    {
        id: 'VE',
        text: "Venezuela"
    },
    {
        id: 'VN',
        text: "Vietnam"
    },
    {
        id: 'WF',
        text: "Wallis and Futuna"
    },
    {
        id: 'EH',
        text: "Western Sahara"
    },
    {
        id: 'YE',
        text: "Yemen"
    },
    {
        id: 'ZM',
        text: "Zambia"
    },
    {
        id: 'ZW',
        text: "Zimbabwe"
    }
]

var countrySelectionList = ''
/*
    The questions object was built from the powerpoint flow chart for the Zika Risk Assessment tool.
    Question and answers are displayed via the loadNextQuestion method.
    nextChoice refers to the next question number when "isEndPoint" is false or to the endPoint when true;
 */
var questions = {
    1: {
        text : "Where do you live?",
        answers : {
            1 : {
                text : "Zika Country",
                nextChoice : 25,
                isEndPoint : false
            },
            2 : {
                text : "Non-Zika Country",
                nextChoice : 2,
                isEndPoint : false,
            }
        }
    },
    2 : {
        text: "Have you recently traveled or do you plan to travel internationally?",
        answers : {
            1 : {
                text : "No and neither is my male sex partner(s)",
                nextChoice : 1,
                isEndPoint : true
            },
            2 : {
                text : "No, and my sex partner(s) is female",
                nextChoice : 1,
                isEndPoint : true
            },
            3 : {
                text: "No, and I am not sexually active.",
                nextChoice: 1,
                isEndPoint: true
            },
            4 : {
                text : "I plan to travel.",
                nextChoice : 3,
                isEndPoint : false
            },
            5 : {
                text : "I have traveled in the past 6 months.",
                nextChoice : 7,
                isEndPoint : false
            },
            6 : {
                text : "No, but my male sex partner(s) has traveled, will travel, or lives abroad.",
                nextChoice : 15,
                isEndPoint : false
            }
        }
    },
    3 : {
        text : "Where are you planning to travel?",
        answers : {
            1 : {
                text : "Zika Country",
                nextChoice : 4,
                isEndPoint : false
            },
            2 : {
                text : "Non-Zika Country",
                nextChoice : 1,
                isEndPoint : true,
                multiSelect: true
            }
        }
    },
    4 : {
        text : "Are you a man or a woman?",
        answers : {
            1 : {
                text : "Man",
                nextChoice : 5,
                isEndPoint : false
            },
            2 : {
                text : "Woman",
                nextChoice : 6,
                isEndPoint : false
            }
        }
    },
    5 : {
        text : "Which of these best describes you?",
        answers : {
            1 : {
                text : "I am not sexually active.",
                nextChoice : 34,
                isEndPoint : true
            },
            2 : {
                text : "I have a pregnant sex partner.",
                nextChoice : 33,
                isEndPoint : true
            },
            3 : {
                text : "I am sexually active with a female partner(s) who is not considering pregnancy.",
                nextChoice : 37,
                isEndPoint : true
            },
            4 : {
                text : "I am sexually active and my partner(s) is male.",
                nextChoice : 37,
                isEndPoint : true
            },
            5 : {
                text : "My partner and I are considering pregnancy.",
                nextChoice : 36,
                isEndPoint : true
            }
        }
    },
    6 : {
        text : "Which of these best describes you?",
        answers : {
            1 : {
                text : "My sex partner(s) is female.",
                nextChoice : 43,
                isEndPoint : true
            },
            2 : {
                text : "I am not sexually active",
                nextChoice : 35,
                isEndPoint : true
            },
            3 : {
                text : "I am pregnant.",
                nextChoice : 38,
                isEndPoint : true
            },
            4 : {
                text : "I am considering getting pregnant.",
                nextChoice : 39,
                isEndPoint : true
            },
            5 : {
                text : "I am sexually active with a male partner(s) but not pregnant or trying to become pregnant.",
                nextChoice : 40,
                isEndPoint : true
            }
        }
    },
    7 : {
        text : "Where have you traveled? (Answer for all destinations, including those you passed through.)",
        answers : {
            1 : {
                text : "Zika Country",
                nextChoice : 8,
                isEndPoint : false
            },
            2 : {
                text : "Non-Zika Country",
                nextChoice : 1,
                isEndPoint : true,
                multiSelect: true
            }
        }
    },
    8 : {
        text : "Are you a man or a woman?",
        answers : {
            1 : {
                text : "Man",
                nextChoice : 9,
                isEndPoint : false
            },
            2 : {
                text : "Woman",
                nextChoice : 12,
                isEndPoint : false
            }
        }
    },
    9 : {
        text : "Which of these best describes you?",
        answers : {
            1 : {
                text : "I am not sexually active.",
                nextChoice : 22,
                isEndPoint : true
            },
            2 : {
                text : "I have a pregnant sex partner.",
                nextChoice : 23,
                isEndPoint : true
            },
            3 : {
                text : "I am sexually active with a female partner(s) who is not considering pregnancy.",
                nextChoice : 11,
                isEndPoint : false
            },
            4 : {
                text : "I am sexually active and my partner(s) is male.",
                nextChoice : 11,
                isEndPoint : false
            },
            5 : {
                text : "My partner and I are considering pregnancy.",
                nextChoice : 10,
                isEndPoint : false
            }
        }
    },
    10 : {
        text : "Have you had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers : {
            1 : {
                text : "Yes",
                nextChoice : 25,
                isEndPoint : true
            },
            2 : {
                text : "No",
                nextChoice : 26,
                isEndPoint : true
            }
        }
    },
    11 : {
        text : "Have you had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers : {
            1 : {
                text : "Yes",
                nextChoice : 27,
                isEndPoint : true
            },
            2 : {
                text : "No",
                nextChoice : 28,
                isEndPoint : true
            }
        }
    },
    12 : {
        text : "Which of these best describes you?",
        answers : {
            1 : {
                text : "My sex partner(s) is female.",
                nextChoice : 24,
                isEndPoint : true
            },
            2 : {
                text : "I am not sexually active",
                nextChoice : 24,
                isEndPoint : true
            },
            3 : {
                text : "I am pregnant.",
                nextChoice : 13,
                isEndPoint : false
            },
            4 : {
                text : "I am considering getting pregnant.",
                nextChoice : 14,
                isEndPoint : false
            },
            5 : {
                text : "I am sexually active with a male partner(s) but not pregnant or trying to become pregnant.",
                nextChoice : 24,
                isEndPoint : true
            }
        }
    },
    13 : {
        text : "Have you had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers : {
            1 : {
                text : "Yes",
                nextChoice : 29,
                isEndPoint : true
            },
            2 : {
                text : "No",
                nextChoice : 32,
                isEndPoint : true
            }
        }
    },
    14 : {
        text : "Have you had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers : {
            1 : {
                text : "Yes",
                nextChoice : 30,
                isEndPoint : true
            },
            2 : {
                text : "No",
                nextChoice : 31,
                isEndPoint : true
            }
        }
    },
    15 : {
        text : "Has your partner been in a foreign country (traveled or lived abroad) or is he planning travel?",
        answers : {
            1 : {
                text : "He has been in a foreign country",
                nextChoice : 16,
                isEndPoint : false
            },
            2 : {
                text : "He is planning to travel.",
                nextChoice : 22,
                isEndPoint : false
            }
        }
    },
    16 : {
        text : "Where has your partner traveled or lived?",
        answers : {
            1 : {
                text : "Zika Country",
                nextChoice : 17,
                isEndPoint : false
            },
            2 : {
                text : "Non-Zika Country",
                nextChoice : 1,
                isEndPoint : true,
                multiSelect: true
            }
        }
    },
    17 : {
        text : "Are you a man or a woman?",
        answers : {
            1 : {
                text : "Man",
                nextChoice : 18,
                isEndPoint : false
            },
            2 : {
                text : "Woman",
                nextChoice : 19,
                isEndPoint : false
            }
        }
    },
    18 : {
        text : "Has your partner had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers : {
            1 : {
                text : "Yes",
                nextChoice : 10,
                isEndPoint : true
            },
            2 : {
                text : "No",
                nextChoice : 11,
                isEndPoint : true
            }
        }
    },
    19 : {
        text : "Which of these best describes you?",
        answers : {
            1 : {
                text : "I am pregnant.",
                nextChoice : 12,
                isEndPoint : true
            },
            2 : {
                text : "I am considering getting pregnant.",
                nextChoice : 20,
                isEndPoint : false
            },
            3 : {
                text : "I am not pregnant or trying to become pregnant.",
                nextChoice : 21,
                isEndPoint : false
            }
        }
    },
    20 : {
        text : "Has your partner had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers : {
            1 : {
                text : "Yes",
                nextChoice : 13,
                isEndPoint : true
            },
            2 : {
                text : "No",
                nextChoice : 14,
                isEndPoint : true
            }
        }
    },
    21 : {
        text : "Has your partner had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers : {
            1 : {
                text : "Yes",
                nextChoice : 15,
                isEndPoint : true
            },
            2 : {
                text : "No",
                nextChoice : 16,
                isEndPoint : true
            }
        }
    },
    22 : {
        text : "Where does your partner plan to travel?",
        answers : {
            1 : {
                text : "Zika Country",
                nextChoice : 23,
                isEndPoint : false
            },
            2 : {
                text : "Non-Zika Country",
                nextChoice : 1,
                isEndPoint : true,
                multiSelect: true
            }
        }
    },
    23 : {
        text : "Are you a man or a woman?",
        answers : {
            1 : {
                text : "Man",
                nextChoice : 18,
                isEndPoint : true
            },
            2 : {
                text : "Woman",
                nextChoice : 24,
                isEndPoint : false
            }
        }
    },
    24 : {
        text : "Which of these best describes you?",
        answers : {
            1 : {
                text : "I am pregnant.",
                nextChoice : 19,
                isEndPoint : true
            },
            2 : {
                text : "I am considering getting pregnant.",
                nextChoice : 20,
                isEndPoint : true
            },
            3 : {
                text : "I am not pregnant or trying to become pregnant.",
                nextChoice : 21,
                isEndPoint : true
            }
        }
    },
    25 : {
        text : "Are you a man or a woman?",
        answers : {
            1 : {
                text : "Man",
                nextChoice : 26,
                isEndPoint : false
            },
            2 : {
                text : "Woman",
                nextChoice : 28,
                isEndPoint : false
            }
        }
    },
    26 : {
        text : "Which of these best describes you?",
        answers : {
            1 : {
                text : "I am not sexually active.",
                nextChoice : 2,
                isEndPoint : true
            },
            2 : {
                text : "I have a pregnant sex partner.",
                nextChoice : 4,
                isEndPoint : true
            },
            3 : {
                text : "I am sexually active with a female partner(s) who is not considering pregnancy.",
                nextChoice : 5,
                isEndPoint : true
            },
            4 : {
                text : "I am sexually active and my partner(s) is male.",
                nextChoice : 5,
                isEndPoint : true
            },
            5 : {
                text : "My partner and I are considering pregnancy.",
                nextChoice : 27,
                isEndPoint : false
            }
        }
    },
    27 : {
        text : "Have you had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers : {
            1 : {
                text : "Yes",
                nextChoice : 8,
                isEndPoint : true
            },
            2 : {
                text : "No",
                nextChoice : 9,
                isEndPoint : true
            }
        }
    },
    28 : {
        text : "Which of these best describes you?",
        answers : {
            1 : {
                text : "My sex partner(s) is female.",
                nextChoice : 17,
                isEndPoint : true
            },
            2 : {
                text : "I am not sexually active",
                nextChoice : 3,
                isEndPoint : true
            },
            3 : {
                text : "I am pregnant.",
                nextChoice : 6,
                isEndPoint : true
            },
            4 : {
                text : "I am considering getting pregnant.",
                nextChoice : 29,
                isEndPoint : false
            },
            5 : {
                text : "I am sexually active with a male partner(s) but not pregnant or trying to become pregnant.",
                nextChoice : 7,
                isEndPoint : true
            }
        }
    },
    29 : {
        text : "Have you had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers : {
            1 : {
                text : "Yes",
                nextChoice : 41,
                isEndPoint : true
            },
            2 : {
                text : "No",
                nextChoice : 42,
                isEndPoint : true
            }
        }
    }
}

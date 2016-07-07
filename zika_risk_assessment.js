/**
 * Created by jason on 6/8/16.
 */
//panels
var introPanel = $("#zika-app-intro");
var mainPanel = $("#zika-app-main");

//panel content
var endpointContent = $("#zika-app-endpoint");
var endpointText = $("#zika-app-endpoint-text");
var questionContent = $("#zika-app-question");
var questionText = $("#question-text");
var questionAnswers = $("#question-answers");
var alertArea = $("#alert-area");

//country select dropdown lists
var singleCountryListSurround = $("#singleCountryListDiv");
var singleCountryList = $("#singleCountry");
var multiCountryListSurround = $("#multCountryListDiv");
var multiCountryList = $("#multiCountry");

//Nav buttons
var start = $("#start");
var back = $("#back");
var restart = $("#restart");
var nextButton = $("#next");

//array to store answers
var userAnswers = [];

var currentQuestion;




$(document).ready(function(){
    //populate country lists
    singleCountryList.select2({
        placeholder: 'Select a country',
        data: countries,
        multiple: false
    });
    multiCountryList.select2({
        placeholder: 'Select a country or countries',
        data: countries,
        multiple: true,
    });

    //clear alerts on country selected
    singleCountryList.change(function(){
        alertArea.html("");
    });

    //clear alerts on country selected
    multiCountryList.change(function(){
        alertArea.html("");
    });

    //hide intro panel, show main panel
    start.click(function() {
        introPanel.hide();
        mainPanel.show();
        loadNextQuestion("" +1);
    });


    back.click(function(){
        var size = userAnswers.length;
        if(size > 0){
            loadNextQuestion(userAnswers[size - 1][0]);
        }
        else{
            //back should restart the app when on question 1
            triggerRestart();
        }
    });

    restart.click(function(){
        triggerRestart();
    });
});
function noSelectionAlert(){
    var alert = '<div class="alert alert-warning fade in">';
    alert += '<a href="#" class="close" style="text-decoration: none;"data-dismiss="alert" aria-label="close">&times;</a>';
    alert += '<strong>Please make a selection.</strong>';
    alert += '</div>';
    alertArea.html(alert);
}
function triggerRestart(){
    userAnswers = [];
    introPanel.show();
    mainPanel.hide();
    multiCountryList.val(null).trigger("change");
    singleCountryList.val(null).trigger("change");
    $('html, body').animate({ scrollTop: 0 }, 0);
}
function loadNextQuestion(number){
    nextButton.unbind();
    currentQuestion = number;
    clearMainPanel();
    questionContent.show();
    questionText.html(questions["" +number].text).show();
    var answers = Object.keys(questions["" +number].answers);
    //var buttons = '<div class="btn-group btn-group-vertical" role="group">';
    var radioButtonsTemp = '';
    var answerMode = '';

    var previouslyVisited = false;
    if(userAnswers.length > 0 && userAnswers[userAnswers.length - 1][0] === number){
        previouslyVisited = true;
    }

    if(answers.length === 0){
        nextButton.click(function(){
            answerNextButtonClicked();
        }).show();
        if(previouslyVisited){
            userAnswers.pop();
        }
    }

    for(var i = 1; i <= answers.length; i++) {
        var temp = questions["" + number].answers["" +i];
        switch (temp.text) {
            case "Non-Zika Country":
                if(temp.hasOwnProperty("multiSelect")){
                    if(temp.multiSelect){
                        if(previouslyVisited){
                            multiCountryList.val(userAnswers[userAnswers.length - 1][1]).trigger("change");
                            userAnswers.pop();
                        }
                        multiCountryListSurround.show();
                        answerMode = 'multiCountry';

                        //work around for bug which affects placeholder text when the parent div is
                        //hidden when select2 is initialized.
                        //bug documented https://github.com/select2/select2/issues/3817
                        //solution from https://jsfiddle.net/agq08j5z/1/
                        multiCountryListSurround.find('input')
                            .each(function(){
                                var $this = $(this);
                                $this.width($this.parents('span.select2-container').width() -2);
                            });
                    }
                }
                else{
                    if(previouslyVisited){
                        singleCountryList.val(userAnswers[userAnswers.length - 1][1]).trigger("change");
                        userAnswers.pop();
                    }
                    singleCountryListSurround.show();
                    answerMode = 'singleCountry';

                    //work around for bug which affects placeholder text when the parent div is
                    //hidden when select2 is initialized.
                    //bug documented https://github.com/select2/select2/issues/3817
                    //solution from https://jsfiddle.net/agq08j5z/1/
                    singleCountryListSurround.find('input')
                        .each(function(){
                            var $this = $(this);
                            $this.width($this.parents('span.select2-container').width() -2);
                        });
                }
                break;
            case "Zika Country":

                break;
            case "Non-US":
                break;
            default:
                //buttons solution
               /* if (!temp.isEndPoint) {
                    buttons += '<button class="btn btn-default" style="white-space: normal" onclick=' + 'loadNextQuestion(' + temp.nextChoice + ')>' + temp.text + '</button>';
                }
                else {
                    buttons += '<button class="btn btn-default" style="white-space: normal" onclick=' + 'loadEndPoint(' + temp.nextChoice + ')>' + temp.text + '</button>';
                }*/
                radioButtonsTemp += '<div class="radio z-risk-rad">'
                radioButtonsTemp += '<label>';
                if(previouslyVisited && userAnswers[userAnswers.length - 1][1] === "" +i) {
                    radioButtonsTemp += '<input type="radio" id="radioAnswer" name="optionsRadios" value="' + i + '" checked>';
                    userAnswers.pop();
                    previouslyVisited = false;
                }
                else{
                    radioButtonsTemp += '<input type="radio" id="radioAnswer" name="optionsRadios" value="' + i + '">';
                }
                radioButtonsTemp += temp.text;
                radioButtonsTemp += '</label>';
                radioButtonsTemp += '</div>';
                answerMode = 'standard';
                break;
        }

        $('html, body').animate({ scrollTop: 0 }, 0);
    }

    switch(answerMode) {
        case 'singleCountry':
            nextButton.click(function(){
                singleCountryNextClicked();
            }).show();
            break;
        case 'multiCountry':
            nextButton.click(function(){
                multiCountryNextButtonClicked();
            }).show();
            break;
        case 'standard':
            nextButton.click(function(){
                answerNextButtonClicked();
            }).show();
            break;

    }
    //buttons += "</div>";
    questionAnswers.html(radioButtonsTemp).show();

    //clear alerts on radio selected
    $("input[name=optionsRadios]:radio").change(function(){
        alertArea.html("");
    });
}

function loadEndPoint(number){
    clearMainPanel();
    endpointText.load("endpoints.html #endpoint" +number);

    endpointContent.show();
    $('html, body').animate({ scrollTop: 0 }, 0);
}
function singleCountryNextClicked(){
    var selection = singleCountryList.val();
    var next;

    if("" === selection){
        noSelectionAlert();
    }
    else {
        userAnswers.push([currentQuestion, selection]);

        if(Object.keys(questions[currentQuestion].answers).indexOf("3") >= 0 && selection !== "US"){ //question 1 requires disclaimer for non-US countries
            next = questions["" + currentQuestion].answers["3"];
        }
        else{
            if (zikaCountries.indexOf(selection) >= 0) { //Zika country
                next = questions["" + currentQuestion].answers["1"];
            }
            else { //non-Zika country
                next = questions["" + currentQuestion].answers["2"];
            }
        }
        if (next.isEndPoint) {
            loadEndPoint(next.nextChoice);
        }
        else {
            loadNextQuestion(next.nextChoice);
        }
    }
}

function multiCountryNextButtonClicked(){
    var input = $('#multiCountry option:selected');
    var selection = $.map(input, function(option){
        return option.value;
    });

    var next;

    if(selection.length === 0){
        noSelectionAlert();
    }
    else{
        userAnswers.push([currentQuestion, selection]);
        var zika = false;
        for(var i = 0; i < selection.length; i++){
            if(zikaCountries.indexOf(selection[i]) >= 0){
                zika = true;
                break;
            }
        }
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
    }
}

function answerNextButtonClicked(){
    var answerInput = $("input[name=optionsRadios]:checked").val();
    var selectedAnswerObject = questions["" + currentQuestion].answers["" +answerInput];

    if(answerInput != null) {
        userAnswers.push([currentQuestion, answerInput]);
        if (selectedAnswerObject.isEndPoint) {
            loadEndPoint(selectedAnswerObject.nextChoice);
        }
        else {
            loadNextQuestion(selectedAnswerObject.nextChoice);
        }
    }
    else {
        if(currentQuestion === 30){
            userAnswers.push([currentQuestion, answerInput]);
            var next;
            if (zikaCountries.indexOf(userAnswers[0][1]) >= 0) { //Zika country
                next = questions["" + 1].answers["1"];
            }
            else { //non-Zika country
                next = questions["" + 1].answers["2"];
            }
            loadNextQuestion(next.nextChoice);
        }
        else{
            noSelectionAlert();
        }
    }
}

function clearMainPanel(){
    //endpoint
    endpointText.html("");
    endpointContent.hide();

    //question
    questionText.html("");
    questionContent.hide();
    questionAnswers.html("");
    questionAnswers.hide();
    singleCountryListSurround.hide();
    multiCountryListSurround.hide();
    multiCountryList.val(null).trigger("change");
    singleCountryList.val(null).trigger("change");

    //next button
    nextButton.hide();

    //alert area
    alertArea.html("");
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
        id: 'US',
        text: "United States (USA)"
    },
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
        text: "United Arab Emirates (UAE)"
    },
    {
        id: 'GB',
        text: "United Kingdom (UK)"
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

/*
    The questions object was built from the powerpoint flow chart for the Zika Risk Assessment tool.
    Question and answers are displayed via the loadNextQuestion method.
    nextChoice refers to the next question number when "isEndPoint" is false or to the endPoint when true;
 */
var questions = {
    1: {
        text: "Where do you live?",
        answers: {
            1: {
                text: "Zika Country",
                nextChoice: 25,
                isEndPoint: false
            },
            2: {
                text: "Non-Zika Country",
                nextChoice: 2,
                isEndPoint: false,
            },
            3: {
                text: "Non-US",
                nextChoice: 30,
                isEndPoint: false
            }
        }
    },
    2: {
        text: "Have you recently traveled or do you plan to travel internationally?",
        answers: {
            1: {
                text: "I plan to travel.",
                nextChoice: 3,
                isEndPoint: false
            },
            2: {
                text: "I have traveled in the past 6 months.",
                nextChoice: 7,
                isEndPoint: false
            },
            3:{
                text: "No, I have not traveled recently and am not planning travel.",
                nextChoice: 31,
                isEndPoint: false
            }
        }
    },
    3: {
        text: "Where are you planning to travel?",
        answers: {
            1: {
                text: "Zika Country",
                nextChoice: 4,
                isEndPoint: false
            },
            2: {
                text: "Non-Zika Country",
                nextChoice: 1,
                isEndPoint: true,
                multiSelect: true
            }
        }
    },
    4: {
        text: "Are you a man or a woman?",
        answers: {
            1: {
                text: "Man",
                nextChoice: 5,
                isEndPoint: false
            },
            2: {
                text: "Woman",
                nextChoice: 6,
                isEndPoint: false
            }
        }
    },
    5: {
        text: "Which of these best describes you?",
        answers: {
            1: {
                text: "I am not sexually active (I do not have vaginal, anal, or oral sex).",
                nextChoice: 34,
                isEndPoint: true
            },
            2: {
                text: "I have a pregnant sex partner.",
                nextChoice: 33,
                isEndPoint: true
            },
            3: {
                text: "I am sexually active with a female partner(s) who is not pregnant or considering pregnancy.",
                nextChoice: 37,
                isEndPoint: true
            },
            4: {
                text: "I am sexually active and my partner(s) is male.",
                nextChoice: 37,
                isEndPoint: true
            },
            5: {
                text: "My partner and I are considering pregnancy.",
                nextChoice: 36,
                isEndPoint: true
            }
        }
    },
    6: {
        text: "Which of these best describes you?",
        answers: {
            1: {
                text: "My sex partner(s) is female.",
                nextChoice: 43,
                isEndPoint: true
            },
            2: {
                text: "I am not sexually active (I do not have vaginal, anal, or oral sex).",
                nextChoice: 35,
                isEndPoint: true
            },
            3: {
                text: "I am pregnant.",
                nextChoice: 38,
                isEndPoint: true
            },
            4: {
                text: "I am considering getting pregnant.",
                nextChoice: 39,
                isEndPoint: true
            },
            5: {
                text: "I am sexually active with a male partner(s) but not pregnant or trying to become pregnant.",
                nextChoice: 40,
                isEndPoint: true
            }
        }
    },
    7: {
        text: "Where have you traveled? (Answer for all destinations, including those you passed through.)",
        answers: {
            1: {
                text: "Zika Country",
                nextChoice: 8,
                isEndPoint: false
            },
            2: {
                text: "Non-Zika Country",
                nextChoice: 1,
                isEndPoint: true,
                multiSelect: true
            }
        }
    },
    8: {
        text: "Are you a man or a woman?",
        answers: {
            1: {
                text: "Man",
                nextChoice: 9,
                isEndPoint: false
            },
            2: {
                text: "Woman",
                nextChoice: 12,
                isEndPoint: false
            }
        }
    },
    9: {
        text: "Which of these best describes you?",
        answers: {
            1: {
                text: "I am not sexually active (I do not have vaginal, anal, or oral sex).",
                nextChoice: 22,
                isEndPoint: true
            },
            2: {
                text: "I have a pregnant sex partner.",
                nextChoice: 23,
                isEndPoint: true
            },
            3: {
                text: "I am sexually active with a female partner(s) who is not pregnant or considering pregnancy.",
                nextChoice: 11,
                isEndPoint: false
            },
            4: {
                text: "I am sexually active and my partner(s) is male.",
                nextChoice: 11,
                isEndPoint: false
            },
            5: {
                text: "My partner and I are considering pregnancy.",
                nextChoice: 10,
                isEndPoint: false
            }
        }
    },
    10: {
        text: "Have you had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers: {
            1: {
                text: "Yes",
                nextChoice: 25,
                isEndPoint: true
            },
            2: {
                text: "No",
                nextChoice: 26,
                isEndPoint: true
            }
        }
    },
    11: {
        text: "Have you had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers: {
            1: {
                text: "Yes",
                nextChoice: 27,
                isEndPoint: true
            },
            2: {
                text: "No",
                nextChoice: 28,
                isEndPoint: true
            }
        }
    },
    12: {
        text: "Which of these best describes you?",
        answers: {
            1: {
                text: "My sex partner(s) is female.",
                nextChoice: 24,
                isEndPoint: true
            },
            2: {
                text: "I am not sexually active (I do not have vaginal, anal, or oral sex).",
                nextChoice: 24,
                isEndPoint: true
            },
            3: {
                text: "I am pregnant.",
                nextChoice: 13,
                isEndPoint: false
            },
            4: {
                text: "I am considering getting pregnant.",
                nextChoice: 14,
                isEndPoint: false
            },
            5: {
                text: "I am sexually active with a male partner(s) but not pregnant or trying to become pregnant.",
                nextChoice: 24,
                isEndPoint: true
            }
        }
    },
    13: {
        text: "Have you had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers: {
            1: {
                text: "Yes",
                nextChoice: 29,
                isEndPoint: true
            },
            2: {
                text: "No",
                nextChoice: 32,
                isEndPoint: true
            }
        }
    },
    14: {
        text: "Have you had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers: {
            1: {
                text: "Yes",
                nextChoice: 30,
                isEndPoint: true
            },
            2: {
                text: "No",
                nextChoice: 31,
                isEndPoint: true
            }
        }
    },
    15: {
        text: "Has your partner been in a foreign country (traveled or lived abroad) or is he planning travel?",
        answers: {
            1: {
                text: "He has been in a foreign country.",
                nextChoice: 16,
                isEndPoint: false
            },
            2: {
                text: "He is planning to travel.",
                nextChoice: 22,
                isEndPoint: false
            }
        }
    },
    16: {
        text: "Where has your partner traveled or lived?",
        answers: {
            1: {
                text: "Zika Country",
                nextChoice: 17,
                isEndPoint: false
            },
            2: {
                text: "Non-Zika Country",
                nextChoice: 1,
                isEndPoint: true,
                multiSelect: true
            }
        }
    },
    17: {
        text: "Are you a man or a woman?",
        answers: {
            1: {
                text: "Man",
                nextChoice: 18,
                isEndPoint: false
            },
            2: {
                text: "Woman",
                nextChoice: 19,
                isEndPoint: false
            }
        }
    },
    18: {
        text: "Has your partner had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers: {
            1: {
                text: "Yes",
                nextChoice: 10,
                isEndPoint: true
            },
            2: {
                text: "No",
                nextChoice: 11,
                isEndPoint: true
            }
        }
    },
    19: {
        text: "Which of these best describes you?",
        answers: {
            1: {
                text: "I am pregnant.",
                nextChoice: 12,
                isEndPoint: true
            },
            2: {
                text: "I am considering getting pregnant.",
                nextChoice: 20,
                isEndPoint: false
            },
            3: {
                text: "I am not pregnant or trying to become pregnant.",
                nextChoice: 21,
                isEndPoint: false
            }
        }
    },
    20: {
        text: "Has your partner had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers: {
            1: {
                text: "Yes",
                nextChoice: 13,
                isEndPoint: true
            },
            2: {
                text: "No",
                nextChoice: 14,
                isEndPoint: true
            }
        }
    },
    21: {
        text: "Has your partner had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers: {
            1: {
                text: "Yes",
                nextChoice: 15,
                isEndPoint: true
            },
            2: {
                text: "No",
                nextChoice: 16,
                isEndPoint: true
            }
        }
    },
    22: {
        text: "Where does your partner plan to travel?",
        answers: {
            1: {
                text: "Zika Country",
                nextChoice: 23,
                isEndPoint: false
            },
            2: {
                text: "Non-Zika Country",
                nextChoice: 1,
                isEndPoint: true,
                multiSelect: true
            }
        }
    },
    23: {
        text: "Are you a man or a woman?",
        answers: {
            1: {
                text: "Man",
                nextChoice: 18,
                isEndPoint: true
            },
            2: {
                text: "Woman",
                nextChoice: 24,
                isEndPoint: false
            }
        }
    },
    24: {
        text: "Which of these best describes you?",
        answers: {
            1: {
                text: "I am pregnant.",
                nextChoice: 19,
                isEndPoint: true
            },
            2: {
                text: "I am considering getting pregnant.",
                nextChoice: 20,
                isEndPoint: true
            },
            3: {
                text: "I am not pregnant or trying to become pregnant.",
                nextChoice: 21,
                isEndPoint: true
            }
        }
    },
    25: {
        text: "Are you a man or a woman?",
        answers: {
            1: {
                text: "Man",
                nextChoice: 26,
                isEndPoint: false
            },
            2: {
                text: "Woman",
                nextChoice: 28,
                isEndPoint: false
            }
        }
    },
    26: {
        text: "Which of these best describes you?",
        answers: {
            1: {
                text: "I am not sexually active (I do not have vaginal, anal, or oral sex).",
                nextChoice: 2,
                isEndPoint: true
            },
            2: {
                text: "I have a pregnant sex partner.",
                nextChoice: 4,
                isEndPoint: true
            },
            3: {
                text: "I am sexually active with a female partner(s) who is not pregnant or considering pregnancy.",
                nextChoice: 5,
                isEndPoint: true
            },
            4: {
                text: "I am sexually active and my partner(s) is male.",
                nextChoice: 5,
                isEndPoint: true
            },
            5: {
                text: "My partner and I are considering pregnancy.",
                nextChoice: 27,
                isEndPoint: false
            }
        }
    },
    27: {
        text: "Have you had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers: {
            1: {
                text: "Yes",
                nextChoice: 8,
                isEndPoint: true
            },
            2: {
                text: "No",
                nextChoice: 9,
                isEndPoint: true
            }
        }
    },
    28: {
        text: "Which of these best describes you?",
        answers: {
            1: {
                text: "My sex partner(s) is female.",
                nextChoice: 17,
                isEndPoint: true
            },
            2: {
                text: "I am not sexually active (I do not have vaginal, anal, or oral sex).",
                nextChoice: 3,
                isEndPoint: true
            },
            3: {
                text: "I am pregnant.",
                nextChoice: 6,
                isEndPoint: true
            },
            4: {
                text: "I am considering getting pregnant.",
                nextChoice: 29,
                isEndPoint: false
            },
            5: {
                text: "I am sexually active with a male partner(s) but not pregnant or trying to become pregnant.",
                nextChoice: 7,
                isEndPoint: true
            }
        }
    },
    29: {
        text: "Have you had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers: {
            1: {
                text: "Yes",
                nextChoice: 41,
                isEndPoint: true
            },
            2: {
                text: "No",
                nextChoice: 42,
                isEndPoint: true
            }
        }
    },
    30: {
        text: "The following are US government recommendations for US residents. Some national governments may make " +
        "public health and travel recommendations to their own populations, based on their assessment of the available " +
        "evidence and local risk factors. If you would like to continue and receive CDC recommendations, click the "+
        "next button.",
        answers:{

        }
    },
    31:{
        text: "The travel history of your sex partner(s) can also affect your risk of Zika. Do you have a male partner " +
            "who has traveled, will travel, or lives abroad?",
        answers:{
            1:{
                text: "Yes, my male sex partner(s) has traveled, will travel, or lives abroad.",
                nextChoice: 15,
                isEndPoint: false
            },
            2:{
                text: "No, my partner has not recently traveled and is not planning travel.",
                nextChoice: 1,
                isEndPoint: true
            },
            3:{
                text: "No, my sex partner(s) is female.",
                nextChoice: 1,
                isEndPoint: true
            },
            4:{
                text: "No, I'm not sexually active (I do not have vaginal, anal or oral sex).",
                nextChoice: 1,
                isEndPoint: true
            }
        }
    }
}

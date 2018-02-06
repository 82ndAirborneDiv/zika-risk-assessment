$(document).ready(function(){
    start.click(function() {
        cdcMetrics.trackEvent("ButtonClicked", "Start");
        introPanel.hide();
        mainPanel.show();
        loadNode("89");
    });

    back.click(function(){
        cdcMetrics.trackEvent("ButtonClicked", "Back");

        var size = nodeHistory.length;
        if(size > 0){
            loadNode(getPreviousNode().node);
            if(debug){
                logNodeHistory();
            }
        }
        else{
            //back should restart the app when on question 1
            triggerRestart();
        }
    });
    nextButton.click(function(){
        nextButtonClicked();
    });
    restart.click(function(){
        cdcMetrics.trackEvent("ButtonClicked", "Restart");
        triggerRestart();
    });
});

//panels
var introPanel = $("#zika-app-intro");
var mainPanel = $("#zika-app-main");

//panel content
var endpointContent = $("#zika-app-endpoint");
var endpointText = $("#zika-app-endpoint-text");
var endpointAdditionalNotes = $("#zika-app-endpoint-additional-notes");
var endpointDisclaimer = $("#zika-app-endpoint-disclaimer");
var questionContent = $("#zika-app-question");
var questionText = $("#question-text");
var questionAnswers = $("#question-answers");
var alertArea = $("#alert-area");

//Nav buttons
var start = $("#start");
var back = $("#back");
var restart = $("#restart");
var nextButton = $("#next");

var debug = false;
var currentQuestionNumber;

/**
 * NodeHistory stores the question and answer
 * for each node in the decision tree following a user interaction.
 * @param nodeName The name of the node the user interacted with.
 * @param answer The answer the user selected.
 * Answer will be either a number, string, or array of strings
 * for radio, singleSelect, or multiSelect types, respectively.
 * @constructor
 */
function NodeHistory(nodeName, answer){
    this.node = nodeName;
    this.answer = answer;
}

/**
 * array to store answers
 * Each index of nodeHistory stores a NodeHistory object
 */
var nodeHistory = [];

function logNodeHistory(){
    console.log(nodeHistory);
}

/**
 *
 * @param nodeName the name of the node to be returned
 * @returns node object from nodes object
 */
function getNode(nodeName){
    return nodes["" +nodeName];
}

/**
 * returns the last NodeHistory object in the nodeHistory[], if there is one
 */
function getPreviousNode(){
    var numUserAnswers = nodeHistory.length;
    if(numUserAnswers > 0) {
        return nodeHistory[numUserAnswers - 1];
    }
}

/**
 *  Returns a specific NodeHistory object from nodeHistory[]
 * @param {Number} number The number of the nodeHistory[] index to load
 * @returns {NodeHistory}
 */
function getNodeHistoryByIndex(number){
    var numUserAnswers = nodeHistory.length;
    if(numUserAnswers > 0 && number >= 0 && number < numUserAnswers) {
        return nodeHistory[number];
    }
}
/**
 * Traverses nodeHistory[] and checks for and returns a NodeHistory object
 * where NodeHistory.node = number.
 * @param number
 * @returns {*}
 */
function getNodeHistoryByNodeNumber(number){
    var i;
    for(i=0; i < nodeHistory.length; i++){
        if(nodeHistory[i].node == number){
            return nodeHistory[number];
        }
    }
}
/**
 * Starting point for loading each node.
 * This method will call the loadQuestion or loadEndpoint
 * methods based on nodeType property set for each node object in the nodes object.
 * @param nodeName The name of the node to load
 */
function loadNode(nodeName){
    //set global question number to nodeName
    currentQuestionNumber = "" +nodeName;
    var node = getNode(nodeName);
    switch(node.nodeType){
        case NodeType.QUESTION:
            loadQuestion(nodeName);
            break;
        case NodeType.ENDPOINT:
            loadEndPoint(nodeName);
            break;
        case NodeType.APP_INFO:
            loadAppInfo(nodeName);
            break;
    }
}

function loadQuestion(nextQuestionNumber){
    clearMainPanel();
    nextButton.show();

    var nextQuestionObject = getNode(nextQuestionNumber);
    if(debug){
        var nodeText = "Screen number: " +nextQuestionNumber;
        nodeText += "<br />";
        questionText.html(nodeText);
    }

    var previouslyVisited = false;
    var previousAnswerObject;
    if(nodeHistory.length > 0 && getPreviousNode().node === nextQuestionNumber){
        previouslyVisited = true;
        previousAnswerObject = getPreviousNode();
    }
    if(nextQuestionObject.hasOwnProperty('image')) {
        $('#question-image').html('<img class="img-responsive center-block" src="' +nextQuestionObject.image.url
            +'" alt="' +nextQuestionObject.image.altText +'"/>');
    }
    if(nextQuestionObject.hasOwnProperty('footnotes')){
        $('#question-footnotes').html(nextQuestionObject.footnotes.text);
    }

    //Build question based on next question's answerType
    switch (nextQuestionObject.answerType){
        case AnswerType.NONE:
            if(previouslyVisited){
                nodeHistory.pop();
            }
            questionText.append(nextQuestionObject.text);
            break;
        case AnswerType.SINGLESELECT:
            questionAnswers.html(populateSingleSelectList(nextQuestionObject)).show();
            if(previouslyVisited){
                $("#singleSelectList").val(previousAnswerObject.answer).trigger("change");
                nodeHistory.pop();
            }

            //clear alerts on country selected
            $("#singleSelectList").change(function(){
                alertArea.html("");
            });
            break;
        case AnswerType.MULTISELECT:
            questionAnswers.html(populateMultiSelectList(nextQuestionObject)).show();
            if(previouslyVisited){
                $("#multiSelectList").find("input:checkbox").each(function(){
                    var answerChecked = previousAnswerObject.answer.indexOf($(this).val());
                    $(this).prop('checked', answerChecked >= 0);
                });
                nodeHistory.pop();
            }
            $("#multiSelectList").multiselect();

            $("#multiSelectList").keyup(function (event) {
                if(event.keyCode == 27){
                    $('#back').focus();
                }
            });

            //clear alerts on checkbox checked
            $("input:checkbox").change(function(){
                alertArea.html("");
            });

            break;
        case AnswerType.RADIO:
            questionAnswers.html(populateRadioList(nextQuestionObject)).show();
            if(previouslyVisited) {
                $("input[name=optionsRadios]").each(function () {
                    var answerChecked = previousAnswerObject.answer.indexOf($(this).val());
                    $(this).prop('checked', answerChecked >= 0);
                });
                nodeHistory.pop();
            }

            //clear alerts on radio selected
            $("input[name=optionsRadios]:radio").change(function(){
                alertArea.html("");
            });
            break;
    }

    questionContent.show();

    if(navigator.userAgent.match(/iPhone|iPad|iPod/i)){

    } else {
        $('.scrollable').focus();
    }
}

function loadEndPoint(number){
    clearMainPanel();
    //if previously visited, pop last entry
    if(nodeHistory.length > 0 && getPreviousNode().node === number){
        nodeHistory.pop();
    }
    cdcMetrics.trackEvent("Endpoint Reached", number);
    var nodeObject = getNode(number);

    if(debug){
        var nodeNumText = "Screen number: " +number;
        endpointText.html("<div>" +nodeNumText +"</div>");
    }

    /**
     * Append applicable endpoint div to endpointText div in mainPanel.
     */
    endpointText.append($('<div>').load("html/endpoints.html #" +nodeObject.endpointName, function () {
        //Callback function loads a reusable list of guidance for mosquito avoidance text.
        $('#mosquitoAvoidanceMale').load('html/endpoints.html #mosquitoAvoidanceListMale', function () {
            //Callback function hides permethrin guidance if Puerto Rico was selected because it was
            //decided that permethrin is not effective in Puerto Rico.
            if(checkForAreaInNodeHistory("PUERTO_RICO")){
                $('#permethrin').addClass('hidden');
            }
        });
        //Callback function loads a reusable list of guidance for mosquito avoidance text.
        $('#mosquitoAvoidanceFemale').load('html/endpoints.html #mosquitoAvoidanceListFemale', function () {
            //Callback function hides permethrin guidance if Puerto Rico was selected because it was
            //decided that permethrin is not effective in Puerto Rico.
            if(checkForAreaInNodeHistory("PUERTO_RICO")){
                $('#permethrin').addClass('hidden');
            }
        });
        //Callback function loads a reusable list of guidance for mosquito avoidance text.
        $('#mosquitoAvoidanceMaleResident').load('html/endpoints.html #mosquitoAvoidanceListMaleResident', function () {
            //Callback function hides permethrin guidance if Puerto Rico was selected because it was
            //decided that permethrin is not effective in Puerto Rico.
            if(checkForAreaInNodeHistory("PUERTO_RICO")){
                $('#permethrin').addClass('hidden');
            }
        });
        //Callback function loads a reusable list of guidance for mosquito avoidance text.
        $('#mosquitoAvoidanceFemaleResident').load('html/endpoints.html #mosquitoAvoidanceListFemaleResident', function () {
            //Callback function hides permethrin guidance if Puerto Rico was selected because it was
            //decided that permethrin is not effective in Puerto Rico.
            if(checkForAreaInNodeHistory("PUERTO_RICO")){
                $('#permethrin').addClass('hidden');
            }
        });
    }));

    for(var i = nodeHistory.length - 1; i >= 0; i--){
        var nodeHistoryObject = nodeHistory[i];
        var node = getNode(nodeHistoryObject.node);

        /**
         * Check nodeHistory[] for nodes which contain additional notes.
         */
        if(node.hasOwnProperty("getAdditionalNotes")){
            var additionalNotes = node.getAdditionalNotes(nodeHistoryObject.answer);
            if(additionalNotes != null){
                $.each(additionalNotes, function () {
                    endpointAdditionalNotes.append($('<div>').load("html/additionalNotes.html #" +this));
                });
            }
        }
    }

    endpointDisclaimer.append($('<div>').load("html/disclaimers.html #residenceDisclaimer"));

    endpointContent.show();

    if(navigator.userAgent.match(/iPhone|iPad|iPod/i)){

    } else {
        $('.scrollable').focus();
    }
}

function checkForAreaInNodeHistory(area){
    var areaFound = false;
    $.each(nodeHistory, function () {
        var thisAnswerType = getNode(this.node).answerType;
        if(thisAnswerType === AnswerType.SINGLESELECT) {
            if (this.answer === area) {
                areaFound = true;
            } else {
                areaFound = false;
            }
        } else if(thisAnswerType === AnswerType.MULTISELECT) {
            if (this.answer.indexOf(area) >= 0) {
                areaFound = true;
            } else {
                areaFound = false;
            }
        }
    })
    return areaFound;
}

function loadAppInfo(number) {
    introPanel.hide();
    mainPanel.show();
    clearMainPanel();
    var nodeObject = getNode(number);
    if (number === 88) {
        $("#zika-app-info").load("/TemplatePackage/contrib/ssi/cdc-privacy-policy-eng.html");
    } else if (number === 87){
        $("#zika-app-info").html(
            '<h4>Embed code</h4>'
            +'Copy the code below and paste it into your webpage.<br/><br/>'
            +'<div contenteditable="true">'
            +cdcCommon.runtime.embedCode
            +'</div>'
        );
    } else {
        $("#zika-app-info").append($('<div>').load("html/endpoints.html #" + nodeObject.endpointName));
    }
    $("#zika-app-info").show();

    if(navigator.userAgent.match(/iPhone|iPad|iPod/i)){

    } else {
        $('.scrollable').focus();
    }
}

/**
 * This function is called before any content change happens.
 */
function clearMainPanel(){
    $('.scrollable').animate({ scrollTop: 0 }, 0);
    //endpoint
    endpointText.html("");
    endpointAdditionalNotes.html("");
    endpointDisclaimer.html("");
    endpointContent.hide();

    //reset question area
    questionText.html("");
    questionContent.hide();
    questionAnswers.html("");
    questionAnswers.hide();
    $("#question-footnotes").html("");
    $("#question-image").html("");
    questionContent.hide();

    //reset app info area
    $("#zika-app-info").html("");
    $("#zika-app-info").hide();

    //hide next button
    nextButton.hide();

    //reset alert area
    alertArea.html("");
}

/**
 *
 * @param questionObject
 * @returns {string}
 */
var populateSingleSelectList = function(questionObject) {
    var nextQuestionObject = questionObject;
    var listHTML = '';
    listHTML += '<form id="singleSelectListDiv" role="form" class="form-group">';
    listHTML += '<label id="singleSelectLabel" for="singleSelectList">';
    listHTML += nextQuestionObject.text;
    listHTML += '</label>';
    listHTML += '<select id="singleSelectList" class="form-control"><option></option>';
    $.each(nextQuestionObject.getValuesForAnswers(), function (key, value) {
        listHTML += '<option value=' + key + '>' + value.text + '</option>';
    });
    listHTML += '</select></form>';
    return listHTML;
};
//populate multiSelect list
var populateMultiSelectList = function(questionObject) {
    var nextQuestionObject = questionObject;
    var listHTML = "";
    listHTML += '<div id="multiSelectListDiv">';
    listHTML += '<label id="multiSelectLabel" for="multiSelectList">';
    listHTML += nextQuestionObject.text;
    listHTML += '</label>';
    listHTML += '<div tabindex="0" class="keyboard-only">Press tab to access the answer list for this question. At any time, press escape to exit the list.</div>'
    listHTML +='<div role="group" aria-labelledby="multiSelectLabel" id="multiSelectList" class="multiselect">';
    $.each(nextQuestionObject.getValuesForAnswers(), function (key, value) {
       listHTML += '<label><input class="checkboxListItem" style="margin-left: 10px; margin-right: 10px"' +
            ' type="checkbox" name="option[]" value="' + key + '">' + value.text + '</label>';
    });
    listHTML += '</div></div>';
    return listHTML;
};
var populateRadioList = function(questionObject){
    var nextQuestionObject = questionObject;
    var radioButtonsHTML = '';
    radioButtonsHTML += '<div id="radio_label">' +nextQuestionObject.text +'</div>';
    radioButtonsHTML += '<div role="radiogroup" aria-labelledby="' +"radio_label" +'">';

    $.each(nextQuestionObject.getValuesForAnswers(), function (key, value) {
        radioButtonsHTML += '<div class="radio z-risk-rad">';
        radioButtonsHTML += '<label>';
        radioButtonsHTML += '<input type="radio" class="radioAnswer" name="optionsRadios" value="'
            + key + '">';
        radioButtonsHTML += value.text;
        radioButtonsHTML += '</label>';
        radioButtonsHTML += '</div>';
    });
    radioButtonsHTML += '</div>';
    return radioButtonsHTML;
};
function noSelectionAlert(){
    var alert = '<div id="noSelectionAlert" class="alert alert-warning fade in" role="alert">';
    alert += '<a href="#" class="close" id="close-alert" style="text-decoration: none;"data-dismiss="alert"' +
        ' role="button" aria-label="close">&times;</a>';
    alert += '<strong>Please make a selection.</strong>';
    alert += '</div>';
    alertArea.html(alert);

    //return focus to Next button when close alert button is clicked
    if(navigator.userAgent.match(/iPhone|iPad|iPod/i)){

    } else {
        //focus on close alert button when noSelectionAlert is displayed
        $('#close-alert').focus();
    }
    $('.scrollable').animate({ scrollTop: 0 }, 0);
}
function triggerRestart(){
    nodeHistory = [];
    clearMainPanel();
    introPanel.show();
    mainPanel.hide();
    $('.scrollable').animate({ scrollTop: 0 }, 0);
    if(navigator.userAgent.match(/iPhone|iPad|iPod/i)){

    } else {
        $('.scrollable').focus();
    }
}

function nextButtonClicked(){
    var answerInput;
    var selection;
    var currentQuestionObject = getNode(currentQuestionNumber);
    var selectedAnswerObject;

    switch(currentQuestionObject.answerType) {
        case AnswerType.MULTISELECT:
            answerInput = $('#multiSelectList input:checkbox:checked');
            selection = $.map(answerInput, function (option) {
                return option.value;
            });
            if(selection.length === 0){
                noSelectionAlert();
                return;
            }
            break;
        case AnswerType.SINGLESELECT:
            selection = $("#singleSelectList").val();
            if(selection === ""){
                noSelectionAlert();
                return;
            }
            break;
        case AnswerType.RADIO:
            selection = $("input[name=optionsRadios]:checked").val();
            if(selection == null){
                noSelectionAlert();
                return;
            }
            break;
        case AnswerType.NONE:
            if(currentQuestionNumber === 30) {
                selection = "Accepted Disclaimer";
                trackAnswer(selection);
            }
            break;
    }
    nodeHistory.push(new NodeHistory(currentQuestionNumber, selection));

    if(debug){
        logNodeHistory();
    }

    selectedAnswerObject = currentQuestionObject.decideChoice(nodeHistory[nodeHistory.length - 1]);
    loadNode(selectedAnswerObject.nextNode);
}

//Used to resize widget when content changes.
//Set parentIFrame size to height of widget-wrapper.
function resizeWidget (intMsDelay) {
    intMsDelay = intMsDelay || 250;
    window.setTimeout(function(){
        if (window.hasOwnProperty('parentIFrame') && window.parentIFrame.hasOwnProperty('size')) {
            window.parentIFrame.size($('.widget-wrapper').height());
            console.log('resize triggered');
        } else {
            console.log('warn resize unavailable, Please ensure this widget is being loaded within the widget framework');
        }
    }, intMsDelay, false);

    return true;
}

//Styles checkboxes to appear similar to a multiple select list.
jQuery.fn.multiselect = function() {
    $(this).each(function() {
        var checkboxes = $(this).find("input:checkbox");
        checkboxes.each(function() {
            var checkbox = $(this);
            // Highlight pre-selected checkboxes
            if (checkbox.prop("checked"))
                checkbox.parent().addClass("multiselect-on");

            // Highlight checkboxes that the user selects
            checkbox.change(function() {
                if (checkbox.prop("checked"))
                    checkbox.parent().addClass("multiselect-on");
                else
                    checkbox.parent().removeClass("multiselect-on");
            });
        });
    });
};
/**
 * This function calls the cdcMetrics.trackEvent loaded function which is used for
 * SiteCatalyst user interaction tracking.
 * @param answer The answer to track
 */
function trackAnswer(answer){
    cdcMetrics.trackEvent("Question " +currentQuestionNumber + " answered", answer);
}
/**
 * Defines NodeTypes. These are used in each node object in the nodes object.
 * @type {{QUESTION: string, ENDPOINT: string, APP_INFO: string}}
 */
var NodeType = {
    QUESTION: "question",
    ENDPOINT: "endpoint",
    APP_INFO: "app info"
}
/**
 * Defines AnswerTypes. These are used in each Question type node object in the
 * nodes object to define what type of answers the Question will use.
 * @type {{SINGLESELECT: string, MULTISELECT: string, RADIO: string, NONE: string}}
 */
var AnswerType = {
    SINGLESELECT: "singleSelect",
    MULTISELECT: "multiSelect",
    RADIO: "radio",
    NONE: "none"
}
var Disclaimers = {

}
/**
 * Defines AdditionalNotes types. These are tags which are div ids in the
 * html/additionalNotes.html and are loaded conditionally with Endpoint node types.
 * @type {{RESIDENCE_ENDEMIC: string, RECENT_TRAVEL_ENDEMIC_AND_EPIDEMIC: string, PLANNING_TRAVEL_ENDEMIC_AND_EPIDEMIC: string, RECENT_TRAVEL_ENDEMIC_AND_EPIDEMIC_PARTNER: string, PLANNING_TRAVEL_ENDEMIC_AND_EPIDEMIC_PARTNER: string}}
 */
var AdditionalNotes = {
    /*
    These notes are not being used as of 12/9/16 due to guidance changes
    RESIDENCE_ENDEMIC: "noteForResidentsOfEndemicCountries",
    RECENT_TRAVEL_ENDEMIC_AND_EPIDEMIC: "recentTravelToBothEndemicAndEpidemicCountries",
    PLANNING_TRAVEL_ENDEMIC_AND_EPIDEMIC: "planningTravelToBothEndemicAndEpidemicCountries",
    RECENT_TRAVEL_ENDEMIC_AND_EPIDEMIC_PARTNER: "partnerRecentTravelToBothEndemicAndEpidemicCountries",
    PLANNING_TRAVEL_ENDEMIC_AND_EPIDEMIC_PARTNER: "partnerPlanningTravelToBothEndemicAndEpidemicCountries",
    */
}
/**
 * Defines RiskCategory types. These types are used for logical decisions.
 * Country objects in js/countries.js are tagged with one of these categories
 * as a riskCategory property.
 * @type {{NONE: string, ZIKA: string}}
 */
var RiskCategory = {
    NONE : "none",
    ZIKA: "zika"
}
/**
 * @param {string} name The name of the country object to retrieve
 * @return country object from countries object in js/countries.js
 */
function getCountryById(name){
    return countries[name];
}
/**
 * This method returns the riskCategory property from a country object
 * retrieved from countries object in js/countries.js
 * @param country The name of the country
 * @returns riskCategory
 */
function getRisk(country){
    return getCountryById(country).riskCategory;
}

var nodes = {
    decisionLogic: {
        //Specific logic for multi select nodes regarding potential Zika countries
        multiCountryCheckForZika : function(nodeHistoryObject){
            var answer = nodeHistoryObject.answer;
            var riskCategoriesFound = {
                zika: false,
                unitedStates: false
            }

            for(var i = 0; i < answer.length; i++){
                var currentAnswer = nodeHistoryObject.answer[i];
                if(getRisk(currentAnswer) === RiskCategory.ZIKA){
                    riskCategoriesFound.zika = true;
                } else if(currentAnswer === "UNITED_STATES"){
                    riskCategoriesFound.unitedStates = true;
                }
            }
            return riskCategoriesFound;
        },
        //Generic logic for radio button answerType
        getRadioAnswer: function(questionNumber, selection){
            var questionObject = getNode(questionNumber);
            var answerObject = questionObject.answers["" +selection];
            trackAnswer(answerObject.text);
            return answerObject;
        },
    },
    1: {
        /**
         * Node 30 is dependent on the answer from node 1. If the name of node 1 changes,
         * or if the answer names of node 1 are changed, node 30's decideChoice function
         * must be updated.
         */
        text: "Where do you live?",
        answers: {
            1: {
                text: "Zika Country",
                nextNode: 25
            },
            2: {
                text: "US or Non-Zika Country",
                nextNode: 2
            },
            3: {
                text: "Non-US",
                nextNode: 30
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.SINGLESELECT,
        image: {
            url: 'img/globe.png',
            altText: 'globe'
        },
        decideChoice: function(nodeHistoryObject){
            var questionObject = getNode(nodeHistoryObject.node);
            trackAnswer(nodeHistoryObject.answer);

            if(nodeHistoryObject.answer !== "UNITED_STATES"){
                return questionObject.answers["3"];
            }
            else{
                if (getRisk(nodeHistoryObject.answer) == RiskCategory.ZIKA) { //Zika country
                    return questionObject.answers["1"];
                }
                else { //non-Zika country
                    return questionObject.answers["2"];
                }
            }
        },
        getValuesForAnswers: function(){
            return countries;
        },
        getAdditionalNotes: function(input){
            var additionalNotes = [];

            return additionalNotes;
        }
    },
    2: {
        text: "Have you traveled in the past 6 months, or do you plan to travel in the future, to an international " +
        "destination or US territory?",
        answers: {
            1: {
                text: "I plan to travel.",
                nextNode: 3
            },
            2: {
                text: "I have traveled in the past 6 months.",
                nextNode: 7
            },
            3:{
                text: "No, I have not traveled in the past 6 months and am not planning travel.",
                nextNode: 31
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image: {
            url: 'img/travel_plane-01.png',
            altText: 'plane'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function(){
            return this.answers;
        }
    },
    3: {
        text: "Where are you planning to travel?",
        answers: {
            1: {
                text: "Zika Country",
                nextNode: 4
            },
            /* This node is not being used as of 12/9/16 due to guidance changes
            2: {
                text: "Endemic Zika Country",
                nextNode: 48
            },
            */
            3: {
                text: "Non-Zika Country",
                nextNode: 74
            },
            4: {
                text: "United States",
                nextNode: 75
            }

        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.MULTISELECT,
        decideChoice: function(nodeHistoryObject){
            var riskCategoriesFound = nodes.decisionLogic.multiCountryCheckForZika(nodeHistoryObject);
            if(riskCategoriesFound.zika){
                trackAnswer("Answer set included at least one Zika country");
                return this.answers["1"];
            } else if(riskCategoriesFound.unitedStates){
                trackAnswer("United States");
                return this.answers["4"];
            } else {
                trackAnswer("Answer set did not include a country from any risk category");
                return this.answers["3"];
            }
        },
        getValuesForAnswers: function(){
            return countries;
        },
        getAdditionalNotes: function(input){
            var additionalNotes = [];

            return additionalNotes;
        }
    },
    4: {
        text: "Are you male or female?",
        answers: {
            1: {
                text: "Male",
                nextNode: 5
            },
            2: {
                text: "Female",
                nextNode: 6
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/man_and_woman_symbols.png',
            altText: 'man and woman symbols'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    5: {
        text: "Zika can pass <a target='_blank' href='http://www.cdc.gov/zika/transmission/sexual-transmission.html'>through sex</a>, so your sexual activity can affect your risk of Zika. Whether or not your " +
        "partner is pregnant or considering pregnancy is also important because the risk of Zika is of greatest " +
        "concern for pregnant women.<br/><br/>" +
        "Which of these best describes you?*",
        answers: {
            1: {
                text: "I am not sexually active.",
                nextNode: 65
            },
            2: {
                text: "I have a pregnant sex partner.",
                nextNode: 64
            },
            3: {
                text: "I am sexually active with a male partner(s) or a female partner(s) who is not pregnant or " +
                "trying to get pregnant.",
                nextNode: 68
            },
            4: {
                text: "My partner and I are considering pregnancy.",
                nextNode: 67
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/thinking_male-01.png',
            altText: 'thinking man'
        },
        footnotes:{
            text: '*Choose only one; if your partner is pregnant, please select “I have a pregnant sex partner”'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    6: {
        text: "Zika can pass <a target='_blank' href='http://www.cdc.gov/zika/transmission/sexual-transmission.html'>through sex</a>, so your sexual activity can affect your risk of Zika. Whether or not you " +
        "are pregnant or considering pregnancy is also important because the risk of Zika is of greatest concern " +
        "for pregnant women.<br/><br/>" +
        "Which of these best describes you?*",
        answers: {
            1: {
                text: "I am not sexually active.",
                nextNode: 66
            },
            2: {
                text: "I have a pregnant sex partner.",
                nextNode: 64
            },
            3: {
                text: "I am pregnant.",
                nextNode: 69
            },
            4: {
                text: "I am trying to get pregnant.",
                nextNode: 70
            },
            5: {
                text: "I am sexually active, and I am not pregnant or trying to get pregnant.",
                nextNode: 71
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/thinking_female-01.png',
            altText: 'thinking woman'
        },
        footnotes:{
            text: '*Choose only one; if you are pregnant, please select "I am pregnant."'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    7: {
        text: "Where have you traveled? (Answer for all destinations, including those you passed through.)",
        answers: {
            1: {
                text: "Zika Country",
                nextNode: 8
            },
            /* This node is not being used as of 12/9/16 due to guidance changes
            2: {
                text: "Endemic Zika Country",
                nextNode: 77
            },
            */
            3: {
                text: "Non-Zika Country",
                nextNode: 76
            },
            4: {
                text: "United States",
                nextNode: 75
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.MULTISELECT,
        image: {
            url: 'img/globe.png',
            altText: 'globe'
        },
        decideChoice: function(nodeHistoryObject){
            var riskCategoriesFound = nodes.decisionLogic.multiCountryCheckForZika(nodeHistoryObject);
            if(riskCategoriesFound.zika){
                trackAnswer("Answer set included at least one Zika country");
                return this.answers["1"];
            } else if(riskCategoriesFound.unitedStates){
                trackAnswer("United States");
                return this.answers["4"];
            } else {
                trackAnswer("Answer set did not include a country from any risk category");
                return this.answers["3"];
            }
        },
        getValuesForAnswers: function(){
            return countries;
        },
        getAdditionalNotes: function(input){
            var additionalNotes = [];

            return additionalNotes;
        }
    },
    8: {
        text: "Are you male or female?",
        answers: {
            1: {
                text: "Male",
                nextNode: 9
            },
            2: {
                text: "Female",
                nextNode: 12
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/man_and_woman_symbols.png',
            altText: 'man and woman symbols'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    9: {
        text: "Zika can pass <a target='_blank' href='http://www.cdc.gov/zika/transmission/sexual-transmission.html'>through sex</a>, so your sexual activity can affect your risk of Zika. Whether or not your " +
        "partner is pregnant or considering pregnancy is also important because the risk of Zika is of greatest " +
        "concern for pregnant women.<br/><br/>" +
        "Which of these best describes you?*",
        answers: {
            1: {
                text: "I am not sexually active.",
                nextNode: 53
            },
            2: {
                text: "I have a pregnant sex partner.",
                nextNode: 54
            },
            3: {
                text: "I am sexually active with a male partner(s) or a female partner(s) who is not pregnant or " +
                "trying to get pregnant.",
                nextNode: 11
            },
            4: {
                text: "My partner and I are considering pregnancy.",
                nextNode: 10
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/thinking_male-01.png',
            altText: 'thinking man'
        },
        footnotes:{
            text: '*Choose only one; if your partner is pregnant, please select “I have a pregnant sex partner.”'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    10: {
        text: "Have you had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers: {
            1: {
                text: "Yes",
                nextNode: 56
            },
            2: {
                text: "No",
                nextNode: 57
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/symptoms_diagram.png',
            altText: 'symptoms diagram'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    11: {
        text: "Have you had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers: {
            1: {
                text: "Yes",
                nextNode: 58
            },
            2: {
                text: "No",
                nextNode: 59
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/symptoms_diagram.png',
            altText: 'symptoms diagram'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    12: {
        text: "Zika can pass <a target='_blank' href='http://www.cdc.gov/zika/transmission/sexual-transmission.html'>through sex</a>, so your sexual activity can affect your risk of Zika. Whether or not you " +
        "are pregnant or considering pregnancy is also important because the risk of Zika is of greatest concern " +
        "for pregnant women.<br/><br/>" +
        "Which of these best describes you?*",
        answers: {
            1: {
                text: "I am not sexually active.",
                nextNode: 78
            },
            2: {
                text: "I have a pregnant sex partner.",
                nextNode: 54
            },
            3: {
                text: "I am pregnant.",
                nextNode: 13
            },
            4: {
                text: "I am trying to get pregnant.",
                nextNode: 14
            },
            5: {
                text: "I am sexually active, and I am not pregnant or trying to get pregnant.",
                nextNode: 79
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/thinking_female-01.png',
            altText: 'thinking woman'
        },
        footnotes:{
            text: '*Choose only one; if you are pregnant, please select "I am pregnant."'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    13: {
        text: "Have you had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers: {
            1: {
                text: "Yes",
                nextNode: 60
            },
            2: {
                text: "No",
                nextNode: 63
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/symptoms_diagram.png',
            altText: 'symptoms diagram'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    14: {
        text: "Have you had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers: {
            1: {
                text: "Yes",
                nextNode: 61
            },
            2: {
                text: "No",
                nextNode: 62
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/symptoms_diagram.png',
            altText: 'symptoms diagram'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    15: {
        text: "When did your partner(s) travel or live outside the United States (internationally or in a US " +
        "territory)?",
        answers: {
            1: {
                text: "My partner(s) has been outside the US in the past 6 months*",
                nextNode: 16
            },
            2: {
                text: "My partner(s) is planning to travel outside the US.",
                nextNode: 22
            },
            3: {
                text: "My partner(s) was outside the US more than 6 months* ago",
                nextNode: 32
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image: {
            url: 'img/travel_plane-01.png',
            altText: 'plane'
        },
        footnotes:{
            text: "* If you are pregnant, please consider the travel history of sex partner(s) throughout your " +
            "pregnancy."
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    16: {
        text: "Where has your partner traveled or lived?",
        answers: {
            1: {
                text: "Zika Country",
                nextNode: 17
            },
            /* This node is not being used as of 12/9/16 due to guidance changes
            2: {
                text: "Endemic Zika Country",
                nextNode: 81
            },
            */
            3: {
                text: "Non-Zika Country",
                nextNode: 32
            },
            4: {
                text: "United States",
                nextNode: 75
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.MULTISELECT,
        image: {
            url: 'img/globe.png',
            altText: 'globe'
        },
        decideChoice: function(nodeHistoryObject){
            var riskCategoriesFound = nodes.decisionLogic.multiCountryCheckForZika(nodeHistoryObject);
            if(riskCategoriesFound.zika){
                trackAnswer("Answer set included at least one Zika country");
                return this.answers["1"];
            } else if(riskCategoriesFound.unitedStates){
                trackAnswer("United States");
                return this.answers["4"];
            } else {
                trackAnswer("Answer set did not include a country from any risk category");
                return this.answers["3"];
            }
        },
        getValuesForAnswers: function(){
            return countries;
        },
        getAdditionalNotes: function(input){
            var additionalNotes = [];

            return additionalNotes;
        }
    },
    17: {
        text: "Are you male or female?",
        answers: {
            1: {
                text: "Male",
                nextNode: 18
            },
            2: {
                text: "Female",
                nextNode: 19
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/man_and_woman_symbols.png',
            altText: 'man and woman symbols'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    18: {
        text: "Has your partner had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers: {
            1: {
                text: "Yes",
                nextNode: 41
            },
            2: {
                text: "No",
                nextNode: 42
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/symptoms_diagram.png',
            altText: 'symptoms diagram'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    19: {
        text: "Whether or not you are pregnant or considering pregnancy affects your risk of Zika because the " +
        "risk is of greatest concern for pregnant women. Which of these best describes you?",
        answers: {
            1: {
                text: "I am pregnant.",
                nextNode: 43
            },
            2: {
                text: "I am trying to get pregnant.",
                nextNode: 20
            },
            3: {
                text: "I am not pregnant or trying to get pregnant.",
                nextNode: 21
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/thinking_female-01.png',
            altText: 'thinking woman'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    20: {
        text: "Has your partner had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers: {
            1: {
                text: "Yes",
                nextNode: 44
            },
            2: {
                text: "No",
                nextNode: 45
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/symptoms_diagram.png',
            altText: 'symptoms diagram'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    21: {
        text: "Has your partner had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers: {
            1: {
                text: "Yes",
                nextNode: 46
            },
            2: {
                text: "No",
                nextNode: 47
            }
        },
        image:{
            url: 'img/symptoms_diagram.png',
            altText: 'symptoms diagram'
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    22: {
        text: "Where does your partner plan to travel?",
        answers: {
            1: {
                text: "Zika Country",
                nextNode: 23
            },
            /* This node is not being used as of 12/9/16 due to guidance changes
            2: {
                text: "Endemic Zika Country",
                nextNode: 82
            },
            */
            3: {
                text: "Non-Zika Country",
                nextNode: 32
            },
            4: {
                text: "United States",
                nextNode: 75
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.MULTISELECT,
        image: {
            url: 'img/globe.png',
            altText: 'globe'
        },
        decideChoice: function(nodeHistoryObject){
            var riskCategoriesFound = nodes.decisionLogic.multiCountryCheckForZika(nodeHistoryObject);
            if(riskCategoriesFound.zika){
                trackAnswer("Answer set included at least one Zika country");
                return this.answers["1"];
            } else if(riskCategoriesFound.unitedStates){
                trackAnswer("United States");
                return this.answers["4"];
            } else {
                trackAnswer("Answer set did not include a country from any risk category");
                return this.answers["3"];
            }
        },
        getValuesForAnswers: function(){
            return countries;
        },
        getAdditionalNotes: function(input){
            var additionalNotes = [];

            return additionalNotes;
        }
    },
    23: {
        text: "Are you male or female?",
        answers: {
            1: {
                text: "Male",
                nextNode: 49
            },
            2: {
                text: "Female",
                nextNode: 24
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/man_and_woman_symbols.png',
            altText: 'man and woman symbols'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    nodeType: NodeType.QUESTION,
    24: {
        text: "Whether or not you are pregnant or considering pregnancy affects your risk of Zika because the " +
        "risk is of greatest concern for pregnant women. Which of these best describes you?",
        answers: {
            1: {
                text: "I am pregnant.",
                nextNode: 50
            },
            2: {
                text: "I am trying to get pregnant.",
                nextNode: 51
            },
            3: {
                text: "I am not pregnant or trying to get pregnant.",
                nextNode: 52
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/thinking_female-01.png',
            altText: 'thinking woman'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    25: {
        text: "Are you male or female?",
        answers: {
            1: {
                text: "Male",
                nextNode: 26
            },
            2: {
                text: "Female",
                nextNode: 28
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/man_and_woman_symbols.png',
            altText: 'man and woman symbols'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    26: {
        text: "Zika can pass <a target='_blank' href='http://www.cdc.gov/zika/transmission/sexual-transmission.html'>through sex</a>, so your sexual activity can affect your risk of Zika. Whether or not " +
        "your partner is pregnant or considering pregnancy is also important, because the risk of Zika is of " +
        "greatest concern for pregnant women. Which of these best describes you?*",
        answers: {
            1: {
                text: "I have not been sexually active in the past 6 months.",
                nextNode: 33
            },
            2: {
                text: "I have a pregnant sex partner.",
                nextNode: 35
            },
            3: {
                text: "I am sexually active with a male partner(s) or a female partner(s) who is not pregnant or " +
                "trying to get pregnant. ",
                nextNode: 36
            },
            4: {
                text: "My partner and I are considering pregnancy.",
                nextNode: 27
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/thinking_male-01.png',
            altText: 'thinking man'
        },
        footnotes:{
            text: '*Choose only one; if your partner is pregnant, please select “I have a pregnant sex partner.”'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    27: {
        text: "Have you had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers: {
            1: {
                text: "Yes",
                nextNode: 39
            },
            2: {
                text: "No",
                nextNode: 40
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/symptoms_diagram.png',
            altText: 'symptoms diagram'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function(){
            return this.answers;
        }
    },
    28: {
        text: "Zika can pass <a target='_blank' href='http://www.cdc.gov/zika/transmission/sexual-transmission.html'>through sex</a>, so your sexual activity can affect your risk of Zika. Whether or not " +
        "you are pregnant or considering pregnancy is also important because the risk of Zika is of greatest " +
        "concern for pregnant women. Which of these best describes you?*",
        answers: {
            1: {
                text: "I have not been sexually active in the past 6 months.",
                nextNode: 34
            },
            2: {
                text: "I have a pregnant sex partner.",
                nextNode: 35
            },
            3: {
                text: "I am pregnant.",
                nextNode: 37
            },
            4: {
                text: "I am trying to get pregnant.",
                nextNode: 29
            },
            5: {
                text: "I am sexually active, and I am not pregnant or trying to get pregnant.",
                nextNode: 38
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/thinking_female-01.png',
            altText: 'thinking woman'
        },
        footnotes:{
            text: '*Choose only one; if you are pregnant, please select "I am pregnant."'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    29: {
        text: "Have you had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers: {
            1: {
                text: "Yes",
                nextNode: 72
            },
            2: {
                text: "No",
                nextNode: 73
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/symptoms_diagram.png',
            altText: 'symptoms diagram'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    30: {
        /**
         * Node 30 is dependent on the answer from node 1. If the name of node 1 changes,
         * or if the answer names of node 1 are changed, node 30's decideChoice function
         * must be updated.
         */
        text: "<strong>The following are US government recommendations for US residents. Some national governments may make " +
        "public health and travel recommendations to their own populations, based on their assessment of the available " +
        "evidence and local risk factors. If you would like to continue and receive CDC recommendations, click the "+
        "\"Next\" button.</strong>",
        answers:{
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.NONE,
        getValuesForAnswers: function() {
            return this.answers;
        },
        decideChoice: function(nodeHistoryObject){
            if (getRisk(getNodeHistoryByNodeNumber(1).answer) == RiskCategory.ZIKA) { //Zika country
                return getNode('1').answers["1"];
            }
            else { //non-Zika country
                return getNode('1').answers["2"];
            }
        }
    },
    31:{
        text: "The travel history of your sex partner(s) can also affect your risk of Zika. Do you have a partner who "
        +"has traveled, will travel, or lives outside the United States?",
        answers:{
            1:{
                text: "Yes, my sex partner(s) has traveled in the past 6 months, will travel, or lives outside the United States.",
                nextNode: 15
            },
            2:{
                text: "No, my partner(s) has not traveled in the past 6 months and is not planning travel. ",
                nextNode: 32
            },
            3:{
                text: "No, I have not been sexually active in the past 6 months.",
                nextNode: 32
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/travel_suitcases-01.png',
            altText: 'suitcases'
        },
        footnotes: {
            text: '* If you are pregnant, please consider the travel history of sex partner(s) throughout your pregnancy.'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    32:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "noCurrentRiskNoPersonalOrPartnerResidencyOrTravel"
    },
    33:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "residentMaleNotSexuallyActive"
    },
    34:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "residentFemaleNotSexuallyActive"
    },
    35:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "residentPregnantPartner"
    },
    36:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "residentMaleSexuallyActiveNotConsideringPregnancy"
    },
    37:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "residentFemalePregnant"
    },
    38:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "residentFemaleSexuallyActiveNotConsideringPregnancy"
    },
    39:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "residentMaleConsideringPregnancySymptomatic"
    },
    40:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "residentMaleConsideringPregnancyAsymptomatic"
    },
    41:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "partnerHasTraveledMalePartnerWasSymptomatic"
    },
    42:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "partnerHasTraveledMalePartnerWasAymptomatic"
    },
    43:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "partnerHasTraveledFemalePregnant"
    },
    44:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "partnerHasTraveledFemaleConsideringPregnancyPartnerWasSymptomatic"
    },
    45:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "partnerHasTraveledFemaleConsideringPregnancyPartnerWasAsymptomatic"
    },
    46:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "partnerHasTraveledFemaleNotConsideringPregnancyPartnerWasSymptomatic"
    },
    47:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "partnerHasTraveledFemaleNotConsideringPregnancyPartnerWasAsymptomatic"
    },
    /* This node is not being used as of 12/9/16 due to guidance changes
    48:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "planningTravelToEndemicDestination"
    },
    */
    49:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "partnerWillTravelMale"
    },
    50:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "partnerWillTravelFemalePregnant"
    },
    51:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "partnerWillTravelFemaleConsideringPregnancy"
    },
    52:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "partnerWillTravelFemaleSexuallyActiveNotConsideringPregnancy"
    },
    53:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "recentTravelMaleNotSexuallyActive"
    },
    54:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "recentTravelPregnantPartner"
    },
    55:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "recentTravelFemaleSexuallyActiveNotConsideringPregnancyAsymptomatic"
    },
    56:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "recentTravelMaleConsideringPregnancySymptomatic"
    },
    57:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "recentTravelMaleConsideringPregnancyAsymptomatic"
    },
    58:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "recentTravelMaleSexuallyActiveNotConsideringPregnancySymptomatic"
    },
    59:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "recentTravelMaleSexuallyActiveNotConsideringPregnancyAsymptomatic"
    },
    60:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "recentTravelFemalePregnantSymptomatic"
    },
    61:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "recentTravelFemaleTryingToGetPregnantSymptomatic"
    },
    62:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "recentTravelFemaleTryingToGetPregnantAsymptomatic"
    },
    63:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "recentTravelFemalePregnantAsymptomatic"
    },
    64:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "planningTravelPregnantPartner"
    },
    65:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "planningTravelMaleNotSexuallyActive"
    },
    66:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "planningTravelFemaleNotSexuallyActive"
    },
    67:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "planningTravelMaleConsideringPregnancy"
    },
    68:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "planningTravelMaleSexuallyActiveNotConsideringPregnancy"
    },
    69:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "planningTravelFemalePregnant"
    },
    70:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "planningTravelFemaleTryingToGetPregnant"
    },
    71:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "planningTravelFemaleSexuallyActiveNotConsideringPregnancy"
    },
    72:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "residentFemaleTryingToGetPregnantSymptomatic"
    },
    73:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "residentFemaleTryingToGetPregnantAsymptomatic"
    },
    74:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "noRiskPlanningTravelRedirect"
    },
    75:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "travelToUS"
    },
    76:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "noRiskRecentTravelRedirect"
    },
/* This node is not being used as of 12/9/16 due to guidance changes
    77:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "recentTravelToEndemicDestination"
    },
    */
    78:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "recentTravelFemaleNotSexuallyActive"
    },
    79:{
        text: "Have you had Zika symptoms (fever, rash, joint pain, red eyes) or diagnosis?",
        answers: {
            1: {
                text: "Yes",
                nextNode: 80
            },
            2: {
                text: "No",
                nextNode: 55
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        image:{
            url: 'img/symptoms_diagram.png',
            altText: 'symptoms diagram'
        },
        decideChoice: function(nodeHistoryObject){
            return nodes.decisionLogic.getRadioAnswer(nodeHistoryObject.node, nodeHistoryObject.answer);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    80:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "recentTravelFemaleSexuallyActiveNotConsideringPregnancySymptomatic"
    },
    /* This node is not being used as of 12/9/16 due to guidance changes
    81:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "partnerRecentTravelToEndemicDestination"
    },
    */
    /* This node is not being used as of 12/9/16 due to guidance changes
    82:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "partnerPlanningTravelToEndemicDestination"
    },
    */
    87:{
        nodeType: NodeType.APP_INFO,
        endpointName: "embed"
    },
    88:{
        nodeType: NodeType.APP_INFO,
        endpointName: "privacy"
    },
    89:{
        text:
            '<div>'
                +'<h4>Terms of Use:</h4>'
                +'<ul>'
                    +'<li>The guidance that follows focuses on Zika risks and travel to international destinations and '
                    +'US territories. If you are concerned about travel within the United States, you can visit '
                    +'the CDC website for more information about '
                    +'<a target="_blank" href="http://www.cdc.gov/zika/geo/united-states.html">Zika in the '
                    +'United States</a>.'
                    +'</li>'
                    +'<li>This website may help you to determine the risk of Zika for each person in your '
                    +'household and assist you in making informed decisions about your health.'
                    +'</li>'
                    +'<li>If you traveled recently and also have future travel plans, please use the website for '
                    +'both situations to get complete CDC recommendations.'
                    +'</li>'
                    +'<li>The user acknowledges and agrees that this tool is only intended to be, and will be '
                    +'used only as a reference aid, and that the information contained in the product is not '
                    +'intended to be (nor should it be used as) a substitute for the advice of a medical '
                    +'professional.'
                    +'</li>'
                    +'<li>The website should not be used as a self-diagnosis tool.  Seek the advice of a medical '
                    +'professional if you are concerned that you are ill.'
                    +'</li>'
                    +'<li>This product is provided without warranties or representations of any kind, express or '
                    +'implied, and the user assumes any and all risk of any liability, loss, or damage caused '
                    +'by it or its content.'
                    +'</li>'
                    +'<li>By utilizing the website, you indicate your acceptance of these terms.</li>'
                +'</ul>'
            +'</div>',
        answers: {
            0:{
                nextNode: 1
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.NONE,
        decideChoice: function(nodeHistoryObject){
            return this.answers[0];
        }

    }
}

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
        riskCategory: RiskCategory.NONE
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


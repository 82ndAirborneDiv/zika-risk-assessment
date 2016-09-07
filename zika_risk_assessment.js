/**
 * Created by jason on 6/8/16.
 */
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

//country lists
var singleSelectListSurround = $("#singleSelectListDiv");
var singleSelectList = $("#singleSelectList");
var singleSelectLabel = $('#singleSelectLabel');
var multiSelectListSurround = $("#multiSelectListDiv");
var multiSelectList = $("#multiSelectList");
var multiSelectLabel = $('#multiSelectLabel');

//Nav buttons
var start = $("#start");
var back = $("#back");
var restart = $("#restart");
var nextButton = $("#next");

var debug = true;

/*array to store answers
Each index of nodeHistory stores a NodeHistory object
*/
var nodeHistory = [];

//NodeHistory stores the question and answer
//for each node in the decision tree.
// The question will be a number.
//Answers will be either a number, string, or array of strings
//for radio, singleSelect, or multiSelect types, respectively.
function NodeHistory(nodeName, answer){
    this.node = nodeName;
    this.answer = answer;
}

function logNodeHistory(){
    console.log(nodeHistory);
}

var currentQuestionNumber;

//return Question object from nodes array
function getNode(nodeName){
    return nodes["" +nodeName];
}

//return previous user answer, if there is one
function getPreviousNode(){
    var numUserAnswers = nodeHistory.length;
    if(numUserAnswers > 0) {
        return nodeHistory[numUserAnswers - 1];
    }
}

//return userAnswer by index, if it exists
function getUserAnswerByIndex(number){
    var numUserAnswers = nodeHistory.length;
    if(numUserAnswers > 0 && number >= 0 && number < numUserAnswers) {
        return nodeHistory[number];
    }
}

function loadNode(nodeName){
    //set global question number to nextNode
    currentQuestionNumber = "" +nodeName;
    var node = getNode(nodeName);
    switch(node.nodeType){
        case NodeType.QUESTION:
            loadQuestion(nodeName);
            break;
        case NodeType.ENDPOINT:
            loadEndPoint(nodeName);
            break;
    }
}

$(document).ready(function(){
    start.click(function() {
        cdcMetrics.trackEvent("ButtonClicked", "Start");
        introPanel.hide();
        mainPanel.show();
        loadNode("1");
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
//populate singleSelect list
var populateSingleSelectList = function(list) {
    var listHTML = "";
    listHTML += '<option></option>';
        $.each(list, function (key, value) {
            listHTML += '<option value=' + key + '>' + value.text + '</option>';
        });
    singleSelectList.html(listHTML);
}
//populate multiSelect list
var populateMultiSelectList = function(list) {
    var listHTML = "";
    $.each(list, function (key, value) {
       listHTML += '<label><input class="checkboxListItem" style="margin-left: 10px; margin-right: 10px"' +
            ' type="checkbox" name="option[]" value="' + key + '">' + value.text + '</label>';
    });
    multiSelectList.html(listHTML);
}
var populateRadioList = function(question){

}
function noSelectionAlert(){
    var alert = '<div id="noSelectionAlert" class="alert alert-warning fade in" role="alert">';
    alert += '<a href="#" class="close" id="close-alert" style="text-decoration: none;"data-dismiss="alert"' +
        ' role="button" aria-label="close">&times;</a>';
    alert += '<strong>Please make a selection.</strong>';
    alert += '</div>';
    alertArea.html(alert);

    //return focus to Next button when close alert button is clicked
    $('#noSelectionAlert').on('closed.bs.alert', function(){
        nextButton.focus();
    });

    //focus on close alert button when noSelectionAlert is displayed
    $('#close-alert').focus();
    resizeWidget();
}
function triggerRestart(){
    nodeHistory = [];
    clearMainPanel();
    introPanel.show().focus();
    mainPanel.hide();
    $('.panel-body').focus();

    $('.scrollable').animate({ scrollTop: 0 }, 0);
}
function loadQuestion(nextQuestionNumber){
    clearMainPanel();
    nextButton.show();
    questionContent.show();

    var nextQuestionObject = getNode(nextQuestionNumber);
    var nextQuestionText = nextQuestionObject.text;
    if(debug){
        nextQuestionText = "Node number: " +nextQuestionNumber;
        nextQuestionText += "<br />";
        nextQuestionText += nextQuestionObject.text;
    }
    var nextQuestionAnswers = nextQuestionObject.getValuesForAnswers();

    var previouslyVisited = false;
    var previousAnswerObject;
    if(nodeHistory.length > 0 && getPreviousNode().node === nextQuestionNumber){
        previouslyVisited = true;
        previousAnswerObject = getPreviousNode();
    }

    //Build question based on next question's answerType
    switch (nextQuestionObject.answerType){
        case AnswerType.NONE:
            if(previouslyVisited){
                nodeHistory.pop();
            }
            questionText.html('<strong>' +nextQuestionText +'</strong>');
            break;
        case AnswerType.SINGLESELECT:
            singleSelectListSurround.show();
            populateSingleSelectList(nextQuestionObject.getValuesForAnswers());
            if(previouslyVisited){
                singleSelectList.val(previousAnswerObject.answer).trigger("change");
                nodeHistory.pop();
            }
            singleSelectLabel.html(nextQuestionText);

            //clear alerts on country selected
            singleSelectList.change(function(){
                alertArea.html("");
            });
            break;
        case AnswerType.MULTISELECT:
            populateMultiSelectList(countries);
            if(previouslyVisited){
                multiSelectList.find("input:checkbox").each(function(){
                    var answerChecked = previousAnswerObject.answer.indexOf($(this).val());
                    $(this).prop('checked', answerChecked >= 0);
                });
                nodeHistory.pop();
            }
            multiSelectLabel.html(nextQuestionText);
            multiSelectList.multiselect();
            multiSelectListSurround.show();

            //clear alerts on checkbox checked
            $("input:checkbox").change(function(){
                alertArea.html("");
            });

            break;
        case AnswerType.RADIO:
            var radioButtonsHTML = '';
            radioButtonsHTML += '<div id="radio_label">' +nextQuestionText +'</div>';
            radioButtonsHTML += '<div role="radiogroup" aria-labelledby="' +"radio_label" +'">';

            $.each(nextQuestionAnswers, function (key, value) {
                radioButtonsHTML += '<div class="radio z-risk-rad">';
                radioButtonsHTML += '<label>';
                if (previouslyVisited && previousAnswerObject.answer === key) {
                    radioButtonsHTML += '<input type="radio" class="radioAnswer" name="optionsRadios" value="'
                        + key + '" checked>';
                    nodeHistory.pop();
                    previouslyVisited = false;
                }
                else {
                    radioButtonsHTML += '<input type="radio" class="radioAnswer" name="optionsRadios" value="'
                        + key + '">';
                }
                radioButtonsHTML += value.text;
                radioButtonsHTML += '</label>';
                radioButtonsHTML += '</div>';
            });
            radioButtonsHTML += '</div>';
            questionAnswers.html(radioButtonsHTML).show();

            //clear alerts on radio selected
            $("input[name=optionsRadios]:radio").change(function(){
                alertArea.html("");
            });
            break;
    }

    $('.panel-body').focus();

    resizeWidget();
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
        var nodeNumText = "Node number: " +number;
        endpointText.html("<div>" +nodeNumText +"</div>");
    }

    endpointText.append($('<div>').load("endpoints.html #" +nodeObject.endpointName));
    endpointDisclaimer.load("disclaimers.html #oldDisclaimer")
    /*$.each(nodeHistory, function(){
        var questionObject = getNode(this.question);
        if(questionObject.hasOwnProperty("getDisclaimer")) {
            var disclaimer = questionObject.getDisclaimer(this);
            if (disclaimer != null) {
                endpointDisclaimer.append($('<div>').load("disclaimers.html #" + disclaimer));
            }
        }
        if(questionObject.hasOwnProperty("getAdditionalNotes")){
            var additionalNotes = questionObject.getAdditionalNotes(this);
            if(additionalNotes != null){
                endpointAdditionalNotes.append($('<div>').load("additionalNotes.html #" +additionalNotes));
            }
        }
    });
*/

    endpointContent.show();
    resizeWidget();
    $('.panel-body').focus();
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
            selection = singleSelectList.val();
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

    selectedAnswerObject = currentQuestionObject.decideChoice(currentQuestionNumber, selection);
    loadNode(selectedAnswerObject.nextNode);
}

function clearMainPanel(){
    //endpoint
    endpointText.html("");
    endpointAdditionalNotes.html("");
    endpointDisclaimer.html("");
    endpointContent.hide();

    //reset question area
    multiSelectList.animate({ scrollTop: 0 }, 0);
    questionText.html("");
    questionContent.hide();
    questionAnswers.html("");
    questionAnswers.hide();
    singleSelectList.html("");
    multiSelectList.html("");
    singleSelectListSurround.hide();
    multiSelectListSurround.hide();

    //Remove checked state and css from all checkboxes
    $("input:checkbox").prop("checked", false).parent().removeClass("multiselect-on");
    //Reset selection on single country list to null
    singleSelectList.val(null).trigger("change");

    //hide next button
    nextButton.hide();

    //reset alert area
    alertArea.html("");

    resizeWidget();
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

function trackAnswer(answer){
    cdcMetrics.trackEvent("Question " +currentQuestionNumber + " answered", answer);
}
var NodeType = {
    QUESTION: "question",
    ENDPOINT: "endpoint"
}
var AnswerType = {
    SINGLESELECT: "singleSelect",
    MULTISELECT: "multiSelect",
    RADIO: "radio",
    NONE: "none"
}
var Disclaimers = {
    RESIDENCE_US: "residenceDisclaimerUS",
    RESIDENCE_NON_US: "residenceDisclaimerNonUS"
}
var AdditionalNotes = {
    RESIDENCE_ENDEMIC: "residenceEndemic",
    RECENT_TRAVEL_ENDEMIC_AND_EPIDEMIC_SELF: "recentTravelEndemicAndEpidemicSelf",
    FUTURE_TRAVEL_ENDEMIC_AND_EPIDEMIC_SELF: "futureTravelEndemicAndEpidemicSelf",
    RECENT_TRAVEL_ENDEMIC_AND_EPIDEMIC_PARTNER: "recentTravelEndemicAndEpidemicPartner",
    FUTURE_TRAVEL_ENDEMIC_AND_EPIDEMIC_PARTNER: "futureTravelEndemicAndEpidemicPartner"
}

var nodes = {
    decisionLogic: {
        //Specific logic for multi select nodes regarding potential Zika countries
        multiCountryCheckForZika : function(questionNumber, selections){
            var questionObject = getNode(questionNumber);
            var zika = false;
            for(var i = 0; i < selections.length; i++){
                if(getRisk(selections[i]) == RiskCategory.ZIKA){
                    zika = true;
                    break;
                }
            }
            if(zika){
                trackAnswer("Answer set included Zika country(ies)");
                return questionObject.answers["1"];
            }
            else{
                trackAnswer("Answer set did not include a Zika country");
                return questionObject.answers["2"];
            }
        },
        //Specific logic for single select nodes regarding potential Zika countries
        singleCountryCheckForZika : function(questionNumber, selection){
            var questionObject = getNode(questionNumber);
            trackAnswer(selection);

            //question 1 requires disclaimer for non-US countries
            if(currentQuestionNumber === "1" && selection !== "US"){
                questionObject = getNode(1);
                return questionObject.answers["3"];
            }
            else{
                if (getRisk(selection) == RiskCategory.ZIKA) { //Zika country
                    return questionObject.answers["1"];
                }
                else { //non-Zika country
                    return questionObject.answers["2"];
                }
            }
        },
        //Generic logic for radio button answerType
        getRadioAnswer: function(questionNumber, selection){
            var questionObject = getNode(questionNumber);
            var answerObject = questionObject.answers["" +selection];
            trackAnswer(answerObject.text);
            return answerObject;
        },
        //disclaimer logic for country selections based on Zika risk
        disclaimerBasedOnCountryZikaRisk: function(userAnswer){
            var questionObject = getNode(userAnswer.question);
            var answerObject;
            switch(questionObject.answerType) {
                case AnswerType.MULTISELECT:
                    answerObject = nodes.decisionLogic
                        .multiCountryCheckForZika(userAnswer.question, userAnswer.answer);
                    break;
                case AnswerType.SINGLESELECT:
                    answerObject = nodes.decisionLogic
                        .singleCountryCheckForZika(userAnswer.question, userAnswer.answer);
                    break;
            }
            if (answerObject.hasOwnProperty("disclaimer")) {
                return answerObject.disclaimer;
            } else {
                return null;
            }
        },
        //additionalNotes logic for country selections based on Zika risk
        additionalNotesBasedOnCountryZikaRisk: function(userAnswer){
            var questionObject = getNode(userAnswer.question);
            var answerObject;
            switch(questionObject.answerType) {
                case AnswerType.MULTISELECT:
                    answerObject = nodes.decisionLogic
                        .multiCountryCheckForZika(userAnswer.question, userAnswer.answer);
                    break;
                case AnswerType.SINGLESELECT:
                    answerObject = nodes.decisionLogic
                        .singleCountryCheckForZika(userAnswer.question, userAnswer.answer);
                    break;
            }
            if (answerObject.hasOwnProperty("additionalNotes")) {
                return answerObject.additionalNotes;
            } else {
                return null;
            }
        },
    },
    1: {
        text: "Where do you live?",
        answers: {
            1: {
                text: "Zika Country",
                nextNode: 25
            },
            2: {
                text: "Non-Zika Country",
                nextNode: 2
            },
            3: {
                text: "Non-US",
                nextNode: 30
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.SINGLESELECT,
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.singleCountryCheckForZika(qNum, input);
        },
        getValuesForAnswers: function(){
            return countries;
        },
        getDisclaimer: function(input) {
            //implementing inline as q1 disclaimer is based on residence, US or Non US.
            if (input.answer == "US") {
                return Disclaimers.RESIDENCE_US;
            } else {
                return Disclaimers.RESIDENCE_NON_US;
            }
        }
    },
    2: {
        text: "Have you recently traveled or do you plan to travel internationally?",
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
                text: "No, I have not traveled recently and am not planning travel.",
                nextNode: 31
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
        },
        getValuesForAnswers: function(){
            return this.answers;
        },
        getDisclaimer: function(input){
            return nodes.decisionLogic.disclaimerBasedOnCountryZikaRisk(input);
        }
    },
    3: {
        text: "Where are you planning to travel?",
        answers: {
            1: {
                text: "Zika Country",
                nextNode: 4
            },
            2: {
                text: "Non-Zika Country",
                nextNode: 32
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.MULTISELECT,
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.multiCountryCheckForZika(qNum, input);
        },
        getValuesForAnswers: function(){
            return countries;
        },
        getAdditionalNotes: function(input){
            return nodes.decisionLogic.additionalNotesBasedOnCountryZikaRisk(input);
        }
    },
    4: {
        text: "Are you a man or a woman?",
        answers: {
            1: {
                text: "Man",
                nextNode: 5
            },
            2: {
                text: "Woman",
                nextNode: 6
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    5: {
        text: "Which of these best describes you?",
        answers: {
            1: {
                text: "I am not sexually active (I do not have vaginal, anal, or oral sex).",
                nextNode: 65
            },
            2: {
                text: "I have a pregnant sex partner.",
                nextNode: 64
            },
            3: {
                text: "I am sexually active with a female partner(s) who is not pregnant or considering pregnancy.",
                nextNode: 68
            },
            4: {
                text: "I am sexually active and my partner(s) is male.",
                nextNode: 68
            },
            5: {
                text: "My partner and I are considering pregnancy.",
                nextNode: 67
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    6: {
        text: "Which of these best describes you?",
        answers: {
            1: {
                text: "My sex partner(s) is female.",
                nextNode: 74
            },
            2: {
                text: "I am not sexually active (I do not have vaginal, anal, or oral sex).",
                nextNode: 66
            },
            3: {
                text: "I am pregnant.",
                nextNode: 69
            },
            4: {
                text: "I am considering getting pregnant.",
                nextNode: 70
            },
            5: {
                text: "I am sexually active with a male partner(s) but not pregnant or trying to become pregnant.",
                nextNode: 71
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
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
            2: {
                text: "Non-Zika Country",
                nextNode: 32
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.MULTISELECT,
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.multiCountryCheckForZika(qNum, input);
        },
        getValuesForAnswers: function(){
            return countries;
        }
    },
    8: {
        text: "Are you a man or a woman?",
        answers: {
            1: {
                text: "Man",
                nextNode: 9
            },
            2: {
                text: "Woman",
                nextNode: 12
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    9: {
        text: "Which of these best describes you?",
        answers: {
            1: {
                text: "I am not sexually active (I do not have vaginal, anal, or oral sex).",
                nextNode: 53
            },
            2: {
                text: "I have a pregnant sex partner.",
                nextNode: 54
            },
            3: {
                text: "I am sexually active with a female partner(s) who is not pregnant or considering pregnancy.",
                nextNode: 11
            },
            4: {
                text: "I am sexually active and my partner(s) is male.",
                nextNode: 11
            },
            5: {
                text: "My partner and I are considering pregnancy.",
                nextNode: 10
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
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
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
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
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    12: {
        text: "Which of these best describes you?",
        answers: {
            1: {
                text: "My sex partner(s) is female.",
                nextNode: 55
            },
            2: {
                text: "I am not sexually active (I do not have vaginal, anal, or oral sex).",
                nextNode: 55
            },
            3: {
                text: "I am pregnant.",
                nextNode: 13
            },
            4: {
                text: "I am considering getting pregnant.",
                nextNode: 14
            },
            5: {
                text: "I am sexually active with a male partner(s) but not pregnant or trying to become pregnant.",
                nextNode: 55
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
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
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
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
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    15: {
        text: "Has your partner been in a foreign country (traveled or lived abroad) or is he planning travel?",
        answers: {
            1: {
                text: "He has been in a foreign country.",
                nextNode: 16
            },
            2: {
                text: "He is planning to travel.",
                nextNode: 22
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
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
            2: {
                text: "Non-Zika Country",
                nextNode: 32
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.MULTISELECT,
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.multiCountryCheckForZika(qNum, input);
        },
        getValuesForAnswers: function(){
            return countries;
        }
    },
    17: {
        text: "Are you a man or a woman?",
        answers: {
            1: {
                text: "Man",
                nextNode: 18
            },
            2: {
                text: "Woman",
                nextNode: 19
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
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
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    19: {
        text: "Which of these best describes you?",
        answers: {
            1: {
                text: "I am pregnant.",
                nextNode: 43
            },
            2: {
                text: "I am considering getting pregnant.",
                nextNode: 20
            },
            3: {
                text: "I am not pregnant or trying to become pregnant.",
                nextNode: 21
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
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
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
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
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
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
            2: {
                text: "Non-Zika Country",
                nextNode: 32
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.MULTISELECT,
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.multiCountryCheckForZika(qNum, input);
        },
        getValuesForAnswers: function(){
            return countries;
        }
    },
    23: {
        text: "Are you a man or a woman?",
        answers: {
            1: {
                text: "Man",
                nextNode: 49
            },
            2: {
                text: "Woman",
                nextNode: 24
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    nodeType: NodeType.QUESTION,
    24: {
        text: "Which of these best describes you?",
        answers: {
            1: {
                text: "I am pregnant.",
                nextNode: 50
            },
            2: {
                text: "I am considering getting pregnant.",
                nextNode: 51
            },
            3: {
                text: "I am not pregnant or trying to become pregnant.",
                nextNode: 52
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    25: {
        text: "Are you a man or a woman?",
        answers: {
            1: {
                text: "Man",
                nextNode: 26
            },
            2: {
                text: "Woman",
                nextNode: 28
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    26: {
        text: "Which of these best describes you?",
        answers: {
            1: {
                text: "I am not sexually active (I do not have vaginal, anal, or oral sex).",
                nextNode: 33
            },
            2: {
                text: "I have a pregnant sex partner.",
                nextNode: 35
            },
            3: {
                text: "I am sexually active with a female partner(s) who is not pregnant or considering pregnancy.",
                nextNode: 36
            },
            4: {
                text: "I am sexually active and my partner(s) is male.",
                nextNode: 36
            },
            5: {
                text: "My partner and I are considering pregnancy.",
                nextNode: 27
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
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
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
        },
        getValuesForAnswers: function(){
            return this.answers;
        }
    },
    28: {
        text: "Which of these best describes you?",
        answers: {
            1: {
                text: "My sex partner(s) is female.",
                nextNode: 48
            },
            2: {
                text: "I am not sexually active (I do not have vaginal, anal, or oral sex).",
                nextNode: 34
            },
            3: {
                text: "I am pregnant.",
                nextNode: 37
            },
            4: {
                text: "I am considering getting pregnant.",
                nextNode: 29
            },
            5: {
                text: "I am sexually active with a male partner(s) but not pregnant or trying to become pregnant.",
                nextNode: 38
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
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
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    30: {
        text: "The following are US government recommendations for US residents. Some national governments may make " +
        "public health and travel recommendations to their own populations, based on their assessment of the available " +
        "evidence and local risk factors. If you would like to continue and receive CDC recommendations, click the "+
        "next button.",
        answers:{
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.NONE,
        getValuesForAnswers: function() {
            return this.answers;
        },
        decideChoice: function(qNum, input){
            var answerToQuestionOne = getUserAnswerByIndex(0);
            return nodes["1"].decideChoice(answerToQuestionOne.node, answerToQuestionOne.answer);
        },
    },
    31:{
        text: "The travel history of your sex partner(s) can also affect your risk of Zika. Do you have a male partner " +
            "who has traveled, will travel, or lives abroad?",
        answers:{
            1:{
                text: "Yes, my male sex partner(s) has traveled, will travel, or lives abroad.",
                nextNode: 15
            },
            2:{
                text: "No, my partner has not recently traveled and is not planning travel.",
                nextNode: 32
            },
            3:{
                text: "No, my sex partner(s) is female.",
                nextNode: 32
            },
            4:{
                text: "No, I'm not sexually active (I do not have vaginal, anal or oral sex).",
                nextNode: 32
            }
        },
        nodeType: NodeType.QUESTION,
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return nodes.decisionLogic.getRadioAnswer(qNum, input);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
    },
    32:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide11"
    },
    33:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide12"
    },
    34:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide13"
    },
    35:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide14"
    },
    36:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide15"
    },
    37:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide16"
    },
    38:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide17"
    },
    39:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide18"
    },
    40:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide19"
    },
    41:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide20"
    },
    42:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide21"
    },
    43:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide22"
    },
    44:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide23"
    },
    45:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide24"
    },
    46:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide25"
    },
    47:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide26"
    },
    48:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide27"
    },
    49:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide28"
    },
    50:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide29"
    },
    51:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide30"
    },
    52:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide31"
    },
    53:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide32"
    },
    54:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide33"
    },
    55:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide34"
    },
    56:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide35"
    },
    57:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide36"
    },
    58:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide37"
    },
    59:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide38"
    },
    60:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide39"
    },
    61:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide40"
    },
    62:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide41"
    },
    63:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide42"
    },
    64:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide43"
    },
    65:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide44"
    },
    66:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide45"
    },
    67:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide46"
    },
    68:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide47"
    },
    69:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide48"
    },
    70:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide49"
    },
    71:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide50"
    },
    72:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide52"
    },
    73:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide53"
    },
    74:{
        nodeType: NodeType.ENDPOINT,
        endpointName: "slide54"
    }
}

var RiskCategory = {
    NONE : "none",
    ZIKA: "zika"
}

function getCountryById(name){
    return countries[name];
}


//Returns riskCategory of country
function getRisk(country){
    return getCountryById(country).riskCategory;
}
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


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

/*array to store answers
Each index of userAnswers stores a UserAnswer object
*/
var userAnswers = [];

//UserAnswer stores the question and answer
//for each node in the decision tree.
// The question will be a number.
//Answers will be either a number, string, or array of strings
//for radio, singleSelect, or multiSelect types, respectively.
function UserAnswer(question, answer){
    this.question = question;
    this.answer = answer;
}

var currentQuestionNumber;

//return Question object from questions array
function getQuestion(number){
    return questions["" +number];
}

//return previous user answer, if there is one
function getPreviousUserAnswer(){
    var numUserAnswers = userAnswers.length;
    if(numUserAnswers > 0) {
        return userAnswers[numUserAnswers - 1];
    }
}

//return userAnswer by index, if it exists
function getUserAnswerByIndex(number){
    var numUserAnswers = userAnswers.length;
    if(numUserAnswers > 0 && number >= 0 && number < numUserAnswers) {
        return userAnswers[number];
    }
}

$(document).ready(function(){
    start.click(function() {
        cdcMetrics.trackEvent("ButtonClicked", "Start");
        introPanel.hide();
        mainPanel.show();
        loadNextQuestion("1");
    });

    back.click(function(){
        cdcMetrics.trackEvent("ButtonClicked", "Back");

        var size = userAnswers.length;
        if(size > 0){
            loadNextQuestion(getPreviousUserAnswer().question);
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
    userAnswers = [];
    clearMainPanel();
    introPanel.show().focus();
    mainPanel.hide();
    $('.panel-body').focus();

    $('.scrollable').animate({ scrollTop: 0 }, 0);
}
function loadNextQuestion(nextQuestionNumber){
    //unbind next button behavior. Next button behavior is specified in a switch below based on Question type.
    //nextButton.unbind();

    //set global question number to next question
    currentQuestionNumber = nextQuestionNumber;

    clearMainPanel();
    nextButton.show();
    questionContent.show();

    var nextQuestionObject = getQuestion(nextQuestionNumber);
    var nextQuestionText = nextQuestionObject.text;
    var nextQuestionAnswers = nextQuestionObject.getValuesForAnswers();

    var previouslyVisited = false;
    var previousAnswerObject;
    if(userAnswers.length > 0 && getPreviousUserAnswer().question === nextQuestionNumber){
        previouslyVisited = true;
        previousAnswerObject = getPreviousUserAnswer();
    }

    //Build question based on next question's answerType
    switch (nextQuestionObject.answerType){
        case AnswerType.NONE:
            if(previouslyVisited){
                userAnswers.pop();
            }
            questionText.html('<strong>' +nextQuestionText +'</strong>');
            break;
        case AnswerType.SINGLESELECT:
            singleSelectListSurround.show();
            populateSingleSelectList(nextQuestionObject.getValuesForAnswers());
            if(previouslyVisited){
                singleSelectList.val(previousAnswerObject.answer).trigger("change");
                userAnswers.pop();
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
                userAnswers.pop();
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
                    userAnswers.pop();
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
    cdcMetrics.trackEvent("Endpoint Reached", number);
    endpointText.load("endpoints.html #endpoint" +number);
    $.each(userAnswers, function(){
        var questionObject = getQuestion(this.question);
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


    endpointContent.show();
    resizeWidget();
    $('.panel-body').focus();
}

function nextButtonClicked(){
    var answerInput;
    var selection;
    var currentQuestionObject = getQuestion(currentQuestionNumber);
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
                //The disclaimer question object has no answers, if the user clicks next, they
                //accept the disclaimer.
                //Upon acceptance, they are presented the question based on their answer to
                //question 1.
                var question1 = getQuestion(1);
                if (getRisk(getUserAnswerByIndex(0).answer) == RiskCategory.ZIKA) { //Zika country
                    selectedAnswerObject = question1.answers["1"];
                }
                else { //non-Zika country
                    selectedAnswerObject = question1.answers["2"];
                }
            }
            break;
    }
    userAnswers.push(new UserAnswer(currentQuestionNumber, selection));

    if(currentQuestionObject.answerType !== AnswerType.NONE) {
        selectedAnswerObject = currentQuestionObject.decideChoice(currentQuestionNumber, selection);
    }
    if(selectedAnswerObject.isEndPoint){
        loadEndPoint(selectedAnswerObject.nextChoice);
    }
    else {
        loadNextQuestion(selectedAnswerObject.nextChoice);
    }



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


/*
    The questions object was built from the powerpoint flow chart for the Zika Risk Assessment tool.
    Question and answers are displayed via the loadNextQuestion method.
    nextChoice refers to the next question number when "isEndPoint" is false or to the endPoint when true;

    To add a question, create a new numbered question object below as follows:


   32 : {
        text: "This is a sample question. What is the maximum air speed velocity of an unladen Swallow?",
        answers: {
            //Answers include text to display, nextChoice (the number of the next question or endpoint), and isEndPoint,
            //a boolean which is used to determine the type of the nextChoice, endpoint or question.
            1 : {
                text: "I don't know that",
                nextChoice: 33,
                isEndPoint: true
            },
        }
        //Answer types are defined in AnswerType object. Defining a new AnswerType requires modifying the following:
        //loadNextQuestion(), nextButtonClicked()
        answerType: AnswerType.RADIO,
        //decideChoice returns an answerObject based on question number and user selection.
        //decisionLogic object defines common types of decisionLogic for question types that are repeated.
        //Define a new decisionLogic type or use an existing one.
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
        },
        //getValuesForAnswers specifies the answer choices for building the question. For list type questions(single,
        //or multi select), generate a list object in global scope and return the list object. For radio type questions,
        //return this.answers
        getValuesForAnswers: function(){
            return this.answers;
        }
   }
 */
var questions = {
    decisionLogic: {
        //Specific logic for multi select questions regarding potential Zika countries
        multiCountryCheckForZika : function(questionNumber, selections){
            var questionObject = getQuestion(questionNumber);
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
        //Specific logic for single select questions regarding potential Zika countries
        singleCountryCheckForZika : function(questionNumber, selection){
            var questionObject = getQuestion(questionNumber);
            trackAnswer(selection);

            //question 1 requires disclaimer for non-US countries
            if(currentQuestionNumber === "1" && selection !== "US"){
                questionObject = getQuestion(1);
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
            var questionObject = getQuestion(questionNumber);
            return questionObject.answers["" +selection];
        },
        //disclaimer logic for country selections based on Zika risk
        disclaimerBasedOnCountryZikaRisk: function(userAnswer){
            var questionObject = getQuestion(userAnswer.question);
            var answerObject;
            switch(questionObject.answerType) {
                case AnswerType.MULTISELECT:
                    answerObject = questions.decisionLogic
                        .multiCountryCheckForZika(userAnswer.question, userAnswer.answer);
                    break;
                case AnswerType.SINGLESELECT:
                    answerObject = questions.decisionLogic
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
            var questionObject = getQuestion(userAnswer.question);
            var answerObject;
            switch(questionObject.answerType) {
                case AnswerType.MULTISELECT:
                    answerObject = questions.decisionLogic
                        .multiCountryCheckForZika(userAnswer.question, userAnswer.answer);
                    break;
                case AnswerType.SINGLESELECT:
                    answerObject = questions.decisionLogic
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
                nextChoice: 25,
                isEndPoint: false,
            },
            2: {
                text: "Non-Zika Country",
                nextChoice: 2,
                isEndPoint: false,
            },
            3: {
                text: "Non-US",
                nextChoice: 30,
                isEndPoint: false,
            }
        },
        answerType: AnswerType.SINGLESELECT,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.singleCountryCheckForZika(qNum, input);
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
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
        },
        getValuesForAnswers: function(){
            return this.answers;
        },
        getDisclaimer: function(input){
            return questions.decisionLogic.getDisclaimer(input);
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
            }
        },
        answerType: AnswerType.MULTISELECT,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.multiCountryCheckForZika(qNum, input);
        },
        getValuesForAnswers: function(){
            return countries;
        },
        getAdditionalNotes: function(input){
            return questions.decisionLogic.additionalNotesBasedOnCountryZikaRisk(input);
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
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
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
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
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
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
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
                nextChoice: 8,
                isEndPoint: false
            },
            2: {
                text: "Non-Zika Country",
                nextChoice: 1,
                isEndPoint: true,
            }
        },
        answerType: AnswerType.MULTISELECT,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.multiCountryCheckForZika(qNum, input);
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
                nextChoice: 9,
                isEndPoint: false
            },
            2: {
                text: "Woman",
                nextChoice: 12,
                isEndPoint: false
            }
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
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
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
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
                nextChoice: 25,
                isEndPoint: true
            },
            2: {
                text: "No",
                nextChoice: 26,
                isEndPoint: true
            }
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
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
                nextChoice: 27,
                isEndPoint: true
            },
            2: {
                text: "No",
                nextChoice: 28,
                isEndPoint: true
            }
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
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
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
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
                nextChoice: 29,
                isEndPoint: true
            },
            2: {
                text: "No",
                nextChoice: 32,
                isEndPoint: true
            }
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
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
                nextChoice: 30,
                isEndPoint: true
            },
            2: {
                text: "No",
                nextChoice: 31,
                isEndPoint: true
            }
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
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
                nextChoice: 16,
                isEndPoint: false
            },
            2: {
                text: "He is planning to travel.",
                nextChoice: 22,
                isEndPoint: false
            }
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
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
                nextChoice: 17,
                isEndPoint: false
            },
            2: {
                text: "Non-Zika Country",
                nextChoice: 1,
                isEndPoint: true,
            }
        },
        answerType: AnswerType.MULTISELECT,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.multiCountryCheckForZika(qNum, input);
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
                nextChoice: 18,
                isEndPoint: false
            },
            2: {
                text: "Woman",
                nextChoice: 19,
                isEndPoint: false
            }
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
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
                nextChoice: 10,
                isEndPoint: true
            },
            2: {
                text: "No",
                nextChoice: 11,
                isEndPoint: true
            }
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
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
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
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
                nextChoice: 13,
                isEndPoint: true
            },
            2: {
                text: "No",
                nextChoice: 14,
                isEndPoint: true
            }
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
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
                nextChoice: 15,
                isEndPoint: true
            },
            2: {
                text: "No",
                nextChoice: 16,
                isEndPoint: true
            }
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
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
                nextChoice: 23,
                isEndPoint: false
            },
            2: {
                text: "Non-Zika Country",
                nextChoice: 1,
                isEndPoint: true,
            }
        },
        answerType: AnswerType.MULTISELECT,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.multiCountryCheckForZika(qNum, input);
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
                nextChoice: 18,
                isEndPoint: true
            },
            2: {
                text: "Woman",
                nextChoice: 24,
                isEndPoint: false
            }
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
        },
        getValuesForAnswers: function() {
            return this.answers;
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
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
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
                nextChoice: 26,
                isEndPoint: false
            },
            2: {
                text: "Woman",
                nextChoice: 28,
                isEndPoint: false
            }
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
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
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
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
                nextChoice: 8,
                isEndPoint: true
            },
            2: {
                text: "No",
                nextChoice: 9,
                isEndPoint: true
            }
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
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
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
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
                nextChoice: 41,
                isEndPoint: true
            },
            2: {
                text: "No",
                nextChoice: 42,
                isEndPoint: true
            }
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
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
        answerType: AnswerType.NONE,
        getValuesForAnswers: function() {
            return this.answers;
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
        },
        answerType: AnswerType.RADIO,
        decideChoice: function(qNum, input){
            return questions.decisionLogic.getRadioAnswer(qNum, input);
        },
        getValuesForAnswers: function() {
            return this.answers;
        }
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
        riskCategory: RiskCategory.NONE
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
        riskCategory: RiskCategory.NONE
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
        riskCategory: RiskCategory.NONE
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

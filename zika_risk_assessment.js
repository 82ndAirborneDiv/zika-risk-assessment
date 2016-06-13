/**
 * Created by jason on 6/8/16.
 */
$(document).ready(function(){
    $("#endpoint-call-to-action").hide();
    $("#endpoint-disclaimer").hide();
    $("#start").click(function() {
        $("#start").hide();
        $("#intro").hide();
        $("#back").show();
        $("#restart").show();
        loadNextQuestion("" +1);
    });
    $("#back").click(function(){
        var historyLength = navigationHistory.length;
        console.log(historyLength);
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
    }).hide();
    $(".answer").click(function(){
        $("#question-text").html(questions["" +this.name].text);
        console.log(this.value);
        console.log(this.name);
        console.log("hello .answer class?");
    });
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
    $("#question-text").html(questions["" +number].text).show();
    var answers = Object.keys(questions["" +number].answers);
    console.log(answers);
    var buttons = '';

    for(var i = 1; i <= answers.length; i++){
        var temp = questions["" +number].answers[i];
        console.log(temp);

        if(!temp.isEndPoint) {
            buttons += '<button onclick=' + 'loadNextQuestion(' + temp.nextChoice + ')>' + temp.text + '</button><br/>';
        }
        else{
            buttons += '<button onclick=' + 'loadEndPoint(' + temp.nextChoice + ')>' + temp.text + '</button><br/>';
        }
    }
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
}

var navigationHistory = [];

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
                isEndPoint : false
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
                text: "No, and I’m not sexually active.",
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
                isEndPoint : true
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
                isEndPoint : true
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
                isEndPoint : true
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
                isEndPoint : true
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

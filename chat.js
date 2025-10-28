$(start); // call this function when the document loads

function start() {
    // BEFORE starting - we need to check IF the user IS ALREADY LOGGED IN !!!
    $.post("apiChat.php", { isUserLoggedIn: true }, checkIfUserIsLoggedIn, "json");
}

function checkIfUserIsLoggedIn(data) {
    if (data.UserLoggedIn) {
        loginNow(data.UserName);
    } else {
        $("body").html(""); // MAKE SURE that the body of the page is EMPTY
        let title = $("<h1>").html("XSS Demo Chat");
        $("body").append(title);
        let myUserNameInput = $("<input>"); // create an input
        myUserNameInput.attr("id", "userName"); // give it an id
        myUserNameInput.attr("placeholder", "Enter username"); // add placeholder
        let myLoginButton = $("<button>"); // create a button
        myLoginButton.html("Login"); // set its text
        $("body").append(myUserNameInput); // add the input to the html
        $("body").append(myLoginButton); // add the button to the html
        myLoginButton.on("click", startChat); // when the button is clicked call the startChat function
    }
}

function startChat() {
    let myUserName = $("#userName").val(); // read the user name from the user
    //alert(myUserName + " will try to login");
    // ALTERNATIVE: $.ajax()
    $.post("apiChat.php", { UserName: myUserName }, loginNow); // FIRST POST request -> send it to the server
}

function loginNow(UserName) {
    $("body").html(""); // Clear body
    let title = $("<h1>").html("XSS Demo Chat");
    $("body").append(title);
    
    let userNameDiv = $("<div>");
    userNameDiv.addClass("user-info");
    userNameDiv.html("Logged in as: " + UserName);
    $("body").append(userNameDiv);
    //alert("We are done creating your user in the database");
    let myMessageHistory = $("<div>"); // create a div -> all messages will be stored here
    myMessageHistory.attr("id", "messageHistory");
    $("body").append(myMessageHistory); //add the div to html

    let myMessage = $("<textarea>"); // create a textarea (larger input) to allow the user to type a new message
    myMessage.attr("id", "messageToSend"); // give it an id
    myMessage.attr("placeholder", "Type your message here...");
    $("body").append(myMessage); // add the textarea to the html
    let mySendButton = $("<button>"); // create a new button to SEND messages
    mySendButton.html("Send"); //put its text

    mySendButton.on("click", function () {
        //alert(myMessage.val());
        $.post("apiChat.php", { newMessage: myMessage.val() }, function () {
            myMessage.val(""); // Clear the text box after sending
        });
    });

    $("body").append(mySendButton); // add the button to html

    // create a new button to LOGOUT
    let logoutBtn = $("<button>");
    logoutBtn.html("Logout");

    logoutBtn.on("click", function () {
        $.post("apiChat.php", { logout: true }, start);
    });

    $("body").append(logoutBtn);

    /*
    BCS of the CLIENT/SERVER model - we do not know when we (as a client) RECEIVED a new message.
    For this, we need to run a function in a continuous LOOP that will ASK if there are new messages  
    */
    let lastMsgId = -1;
    setInterval(function () {
        $.post(
            "apiChat.php",
            { getMessagesFrom: lastMsgId },
            function (data) {
                //console.log(data);
                $.each(data, function (key, newMessage) {
                    //console.log(newMessage);
                    if (newMessage.MsgId > lastMsgId) lastMsgId = newMessage.MsgId;
                    let newMsgDiv = $("<div>");
                    newMsgDiv.html("<strong>" + newMessage.UserName + ":</strong> " + newMessage.MsgText);
                    myMessageHistory.append(newMsgDiv);
                });
            },
            "json"
        );
    }, 1000);
}

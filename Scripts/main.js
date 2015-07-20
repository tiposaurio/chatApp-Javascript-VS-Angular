"use strict"
var chatApp = {};
chatApp.messages = [];
chatApp.urlBase = "https://junior-coder-chat.firebaseio.com/"

chatApp.ajaxCall = function (verb, myObj, success, dir) {
    var request = new XMLHttpRequest();
    dir = dir || "";
    request.open(verb, chatApp.urlBase + dir + ".json", true)
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            success(this.response);
        } else {
            alert("Error" + this.response)
        }
    }
    request.onerror = function () {
        alert("Error on communication");
    }
    if (myObj) {
        request.send(JSON.stringify(myObj));
    } else {
        request.send();
    }
}

chatApp.drawChat = function () {
    var holder = "";
    for (var i = 0; i < chatApp.messages.length; i++) {
        holder += "<img width='60' height='40' src='" + chatApp.messages[i].pic + "'/>" +
           chatApp.mySuperDate(chatApp.messages[i].date) + " "
        holder += chatApp.messages[i].user ? chatApp.messages[i].user : " "
        holder += " says..." +
            "<button onclick='chatApp.updateMsg(" + '"' + chatApp.messages[i].key + '"' + ")'>Edit</button> " +
            "<button onclick='chatApp.deleteMsg(" + '"' + chatApp.messages[i].key + '"' + ")'>Delete</button>" +
            "</br>" +
            chatApp.messages[i].message + "</br></br>";
    }
    document.getElementById("mainWindowInner").innerHTML = holder;
    setTimeout(function () {
        $("#mainWindow").mCustomScrollbar("scrollTo", "bottom");
    }, 0)
}


chatApp.sendMsg = function () {
    var message = document.getElementById("message").value;
    var user = document.getElementById("user").value;
    var pic = document.getElementById("img").value;
    var myDate = new Date();
    var myObj = {
        message: message,
        user: user,
        pic: pic,
        date: myDate
    };
    chatApp.ajaxCall("POST", myObj, function (respuesta) {
        chatApp.receiveMsg();
    });
    document.getElementById("message").value = "";
}
chatApp.receiveMsg = function () {
    chatApp.ajaxCall("GET", null, function (respuesta) {
        var data = JSON.parse(respuesta);
        chatApp.messages = [];
        for (var prop in data) {
            data[prop].key = prop
            chatApp.messages.push(data[prop])
        }
        chatApp.drawChat();
    });
}
chatApp.updateMsg = function (key) {
    var message = document.getElementById("message").value;
    var user = document.getElementById("user").value;
    var pic = document.getElementById("img").value;
    var myObj = {
        message: message,
        user: user,
        pic: pic
    };

    chatApp.ajaxCall("PATCH", myObj, function (respuesta) {
        chatApp.receiveMsg();
    }, key)
}
chatApp.deleteMsg = function (key) {
    chatApp.ajaxCall("DELETE", null, function (respuesta) {
        chatApp.receiveMsg();
    }, key)
}

chatApp.convertMonth2 = function (monthNumber) {
    var myMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return myMonths[monthNumber];
}
chatApp.mySuperDate = function (dateFromDB) {
    var currentTime = new Date()
    var dBTime = new Date(dateFromDB)
    var difference = currentTime - dBTime;
    var difference2;
    var minLeft;
    if (difference < 24 * 60 * 60 * 1000) {
        difference2 = difference / (60 * 60 * 1000)
        minLeft = (difference2 - (difference2 | 0)) * 60;
        return (difference2 | 0) + "Hours " + (minLeft | 0) + "minutes ago";
    } else {
        var amVSpm;
        var hours = dBTime.getHours()
        if (hours < 12) {
            amVSpm = "am";
        } else {
            hours = hours - 12;
            amVSpm = "pm";
        }
        var fixDate = chatApp.convertMonth2((dBTime).getMonth()) + " " +
                   dBTime.getDate() + ", " +
                   dBTime.getFullYear() + " " +
                   hours + ":" +
                   dBTime.getMinutes() + amVSpm;
        return fixDate;
    }
}

chatApp.enterPressed = function (e) {
    if (e.charCode === 13 || e.keyCode === 13) {
        chatApp.sendMsg();
    }
}

chatApp.receiveMsg();

setInterval(function () {
    chatApp.receiveMsg();
}, 5000)

setTimeout(function () {
    $("#mainWindow").mCustomScrollbar({ theme: "dark-thick" });
}, 0)
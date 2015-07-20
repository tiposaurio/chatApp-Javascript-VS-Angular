"use strict"
var app = angular.module("chatApp", ["ngRoute"])

app.config(function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "Views/chat.html",
        controller: "chatController"
    })
    .otherwise({
        template: "You've reached a page that doesn't exist!"
    })
})

app.factory("dBFactory", function () {
    return [
        {
            date: new Date(2015, 6, 17),
            message: "Hello coders",
            pic: "https://",
            user: "Wen"
        }, {
            date: new Date(2015, 6, 17),
            message: "Hello you!",
            pic: "https://",
            user: "Ben"
        }, {
            date: new Date(2015, 6, 17),
            message: "Best day to code!",
            pic: "https://",
            user: "Len"
        }
    ]
})

app.filter("myDate", [function () {
    return function (dateFromDB) {
        var currentTime = new Date()
        var dBTime = new Date(dateFromDB)
        var difference = currentTime - dBTime;
        var difference2, minLeft;
        if (difference < 24 * 60 * 60 * 1000) {
            difference2 = difference / (60 * 60 * 1000);
            minLeft = (difference2 - (difference2 | 0)) * 60;
            return (difference2 | 0) + "Hours " + (minLeft | 0) + "minutes ago";
        } else {
            var amVSpm, hours = dBTime.getHours()
            if (hours < 12) {
                amVSpm = "am";
            } else {
                hours = hours - 12;
                amVSpm = "pm";
            }
            var myMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var fixDate = myMonths[(dBTime).getMonth()] + " " +
                       dBTime.getDate() + ", " +
                       dBTime.getFullYear() + " " +
                       hours + ":" +
                       dBTime.getMinutes() + amVSpm;
            return fixDate;
        }
        return "asdfasdf"
    }
}])

app.controller("chatController", ["$scope", "dBFactory", "$http", "$interval", "$timeout", function ($scope, dBFactory, $http, $interval, $timeout) {
    $scope.messages = dBFactory;
    $scope.url = "http://cdn.meme.am/instances/500x/58595388.jpg";
    $scope.sendMsg = function () {
        var obj = JSON.stringify({
            user: $scope.name,
            message: $scope.msg,
            pic: $scope.url,
            date: new Date()
        });
        $http.post("https://junior-coder-chat.firebaseio.com/.json", obj)
        .success(function () {
            $scope.getMsg();
        })
        .error(function () {
            console.log("errorrr")
        })
        $scope.msg = "";
    }

    $scope.getMsg = function () {
        $http.get("https://junior-coder-chat.firebaseio.com/.json")
        .success(function (data) {
            $scope.messages = [];
            for (var prop in data) {
                data[prop].key = prop;
                $scope.messages.push(data[prop])
            }
            $timeout(function () {
                $("#mainWindow2").mCustomScrollbar("scrollTo", "bottom");
            }, 0)
        })
        .error(function () {
            console.log("errorrr")
        })
    }

    $scope.deleteMsg = function (key) {
        $http.delete("https://junior-coder-chat.firebaseio.com/" + key + "/.json")
        .success(function () {
            $scope.getMsg();
        })
        .error(function () {
            console.og("Error");
        })
    }

    $scope.editMsg = function (key) {
        var obj = JSON.stringify({
            user: $scope.name,
            message: $scope.msg,
            pic: $scope.url,
            date: new Date()
        });
        $http.patch("https://junior-coder-chat.firebaseio.com/" + key + "/.json", obj)
        .success(function () {
            $scope.getMsg();
        })
        .error(function () {
            console.log("Error")
        })
    }

    $scope.enterPressed = function (e) {
        if (e.keyCode === 13 || e.charCode === 13) {
            $scope.sendMsg();
        }
    }

    $scope.getMsg();

    $interval(function () {
        $scope.getMsg();
    }, 5000)

    $timeout(function () {
        $("#mainWindow2").mCustomScrollbar({ theme: "dark-thick" });
    }, 0)
}])
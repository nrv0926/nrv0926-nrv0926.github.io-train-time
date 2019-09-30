//connect the app to firebase
const config = {
    apiKey: "AIzaSyCcI0Ipb8uBHKIPiYj5sBoaw3igCQoMKzU",
    authDomain: "my-project-gmn-1562427037399.firebaseapp.com",
    databaseURL: "https://my-project-gmn-1562427037399.firebaseio.com",
    projectId: "my-project-gmn-1562427037399",
    storageBucket: "my-project-gmn-1562427037399.appspot.com",
    messagingSenderId: "1088270564762",
    appId: "1:1088270564762:web:c1e941508db3328b638e23"
};

firebase.initializeApp(config);

// Define variable to reference the d/b.
var database = firebase.database();

// determine the variables
var name = "";
var destination = "";
var startTime = "";
var nextarrival = "";
var frequency = 0;
var minutesAway = 0;

// user clicks the submit button, accept input and add to firebase d/b 

$("#add-user").click(function(event) {

    event.preventDefault();
    console.log("Prevent Default");

    // grab the user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTime = $("#time-input").val().trim();
    var tFrequency = $("#frequency-input").val().trim();

    //Logic to calculate  minutes till next train

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + currentTime.format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;

    // ---------------------------------------------------------------     
    // calculate Next Train Arrival time
    var nextArrival = moment().add(tMinutesTillTrain, "minutes");
    var nextTrainArrival = moment(nextArrival).format("hh:mm");
    console.log(nextTrainArrival);

    // Uploads train data to the database
    database.ref().push({

        name: trainName,
        destination: destination,
        startTime: firstTime,
        frequency: tFrequency,
        nextArrival: nextTrainArrival,
        minutesAway: tMinutesTillTrain,
    });
});

// Firebase event for adding data to the d/b 
//and a row in the html when a user adds an entry
database.ref().on("child_added", function(snapshot) {

    var sv = snapshot.val();
    var newRow = $("<tr>").append(
        $("<td>").text(sv.name),
        $("<td>").text(sv.destination),
        $("<td>").text(sv.frequency),
        $("<td>").text(sv.nextArrival),
        $("<td>").text(sv.minutesAway));

    $("tbody").append(newRow);
});
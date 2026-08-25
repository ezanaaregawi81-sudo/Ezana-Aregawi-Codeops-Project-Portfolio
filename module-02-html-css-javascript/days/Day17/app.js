"use strict";
// ---Part-1 Arrow functions

// This function takes in any number of distances and returns the sum of all the distances.
const sumDistance = (...distances) => distances.reduce((sum, distance)=> sum + distance, 0);

// This function calculates the base fare based on total distance and a rate per kilometer. The default rate is set to 15 ETB per km. 
const calculateBasefare = (totaldistance, rateperkm = 15) => totaldistance * rateperkm;

// This function formats the fare amount to a string with two decimal places and appends the currency "ETB" to it.
const formatCurrency = amount => `${amount.toFixed(2)} ETB`;

// --Adjusting for rush hour

// This function takes a surge rate as an argument and returns another function that calculates the fare based on the base fare and the surge rate. 
// The returned function multiplies the base fare by the surge rate to calculate the final fare.
function makeSurgeMultiplier(surgeRate) {
return function(baseFare) {
  return baseFare * surgeRate;
};
}

// --Secure tracking

// This function creates a driver tracker object that keeps track of the number of trips completed. 
// It returns an object with two methods: recordTrip and getTripsCompleted.
function makeDriverTracker() {
  let tripsCompleted = 0; //private variable
  return {
    recordTrip: () => tripsCompleted ++,
    getTripsCompleted: () => tripsCompleted
  }
}

// callback fn
const printToConsole = message => console.log(message);

// --Receipt Generation--, composing a function
function generateReceipt(distances, surgeFn, tracker, callback){
  
  tracker.recordTrip();
  // --Sum of all the distances travelled--
  const totalDistance = sumDistance(...distances);

  // --Trip number--;
  const trip = tracker.getTripsCompleted();

  // --calculating fare/price--
  const baseFare = calculateBasefare(totalDistance);// 5*15 = 75
  const Fare = surgeFn(baseFare); 

  // --Format to ETB--
  const Price = formatCurrency(Fare);

  // --Message string--
  const message = `Trip ${trip}: Total Fare is ${Price}`;
  callback(message);
}

// set-up, test
const tayesTracker = makeDriverTracker();
const standardFare = makeSurgeMultiplier(1.0);//base fare * surgerate = basefare
const rushHourFare = makeSurgeMultiplier(1.5);//base fare * surgerate = new fare

// --Ride 1--
generateReceipt( [2, 3], standardFare, tayesTracker, printToConsole)
//Expected: Trip 1: Total Fare is 75.00ETB


// Ride 2--
generateReceipt([10], rushHourFare, tayesTracker, printToConsole)
//Expected: Trip 2: Total Fare is 225.00ETB
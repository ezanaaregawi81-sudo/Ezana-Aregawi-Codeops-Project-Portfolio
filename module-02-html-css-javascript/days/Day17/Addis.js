const sumDistance = (...distances) => distances.reduce((total, distance)=> total + distance, 0)
const calculateBasefare = (totaldistance, rateperkm = 15) => totaldistance * rateperkm;
const formatCurrency = amount => console.log(`${amount.toFixed(2)} ETB`);

const totalDistance = sumDistance(15, 20, 30);
console.log(`Total Distance: ${totalDistance}`); // 65
const baseFare = calculateBasefare(totalDistance);
console.log(`Estimated Basefare is ${baseFare}`)
formatCurrency(baseFare); // 975.00 ETB

function makeSurgeMultiplier(surgeRate) {
return surgeFare => baseFare * surgeRate;
}
const surgeMultiplier = makeSurgeMultiplier(1.5);
console.log(surgeMultiplier()); // 1350

function makeDriverTracker() {
  let tripsCompleted = 0;
  return {
    recordTrip: () => tripsCompleted++,
    getTripsCompleted: () => tripsCompleted
  }
}

const driverTracker = makeDriverTracker();
driverTracker.recordTrip();
driverTracker.recordTrip();
driverTracker.recordTrip();
console.log(`Trips Completed: ${driverTracker.getTripsCompleted()}`); // 3
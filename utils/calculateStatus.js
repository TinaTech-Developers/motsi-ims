// // utils/calculateStatus.js
// function calculateStatus(zinaraend) {
//   const currentDate = new Date();
//   const endDate = new Date(zinaraend);

//   // Calculate the difference between the end date and current date in days
//   const timeDifference = endDate - currentDate;
//   const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

//   // Return status based on the remaining days
//   if (daysDifference < 0) {
//     return "Expired"; // Insurance has expired
//   } else if (daysDifference <= 30) {
//     return "About to Expire"; // Less than or equal to 30 days left
//   } else {
//     return "Active"; // Insurance is still active and not expiring soon
//   }
// }

// module.exports = calculateStatus;

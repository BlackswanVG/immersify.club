import { db } from '../server/db.js';
import { availabilitySlots } from '../shared/schema.js';

async function createAvailabilitySlots() {
  const venueId = 4; // Rochester venue ID
  const experienceIds = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; // All experience IDs
  
  // Time slots for each day (10am to 9pm)
  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];
  
  // Generate dates for the next 30 days
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    dates.push(formattedDate);
  }
  
  let insertCount = 0;
  
  // Create slots for each experience, date, and time
  for (const experienceId of experienceIds) {
    for (const date of dates) {
      for (const time of timeSlots) {
        try {
          // Default capacity of 8-15 depending on experience
          const capacity = 8 + (experienceId % 8);
          
          await db.insert(availabilitySlots).values({
            venueId,
            experienceId,
            date,
            time,
            capacity,
            bookedCount: 0
          }).onConflictDoNothing();
          
          insertCount++;
        } catch (error) {
          console.error(`Error creating slot for exp ${experienceId} on ${date} at ${time}:`, error);
        }
      }
    }
  }
  
  console.log(`Created ${insertCount} availability slots`);
}

createAvailabilitySlots()
  .then(() => {
    console.log('Availability slots creation complete');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error creating availability slots:', error);
    process.exit(1);
  });
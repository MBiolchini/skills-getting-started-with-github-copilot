// Fetch and display activities
async function fetchActivities() {
    const response = await fetch('/activities');
    const activities = await response.json();

    const activitiesList = document.getElementById('activities-list');
    activitiesList.innerHTML = ''; // Clear existing content

    for (const [name, details] of Object.entries(activities)) {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';

        // Create participants list
        const participantsList = details.participants.map(participant => `<li>${participant}</li>`).join('');

        activityItem.innerHTML = `
            <h3>${name}</h3>
            <p>${details.description}</p>
            <p><strong>Schedule:</strong> ${details.schedule}</p>
            <p><strong>Participants:</strong> ${details.participants.length}/${details.max_participants}</p>
            <div class="participants-section">
                <strong>Signed-up Participants:</strong>
                <ul class="participants-list">
                    ${participantsList || '<li>No participants yet</li>'}
                </ul>
            </div>
            <button onclick="signup('${name}')">Sign Up</button>
        `;

        activitiesList.appendChild(activityItem);
    }
}

// Sign up for an activity
async function signup(activityName) {
    const email = prompt('Enter your email to sign up:');
    if (!email) return;

    try {
        const response = await fetch(`/activities/${activityName}/signup?email=${encodeURIComponent(email)}`, {
            method: 'POST'
        });

        if (!response.ok) {
            const error = await response.json();
            alert(`Error: ${error.detail}`);
        } else {
            alert(`Successfully signed up for ${activityName}!`);
            fetchActivities(); // Refresh the activities list
        }
    } catch (error) {
        console.error('Error signing up:', error);
        alert('An error occurred. Please try again later.');
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', fetchActivities);

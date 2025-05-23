document.getElementById('mushroomForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
    
        "cap-shape": document.getElementById('cap_shape').value,
        "cap-surface": document.getElementById('cap-surface').value,
        "cap-color": document.getElementById('cap-color').value,
        bruises: document.getElementById('bruises').value,
        odor: document.getElementById('odor').value,
        "gill-attachment": document.getElementById('gill-attachment').value,
        "gill-spacing": document.getElementById('gill-spacing').value,
        "gill-size": document.getElementById('gill-size').value,
        "gill-color": document.getElementById('gill-color').value,
        "stalk-shape": document.getElementById('stalk-shape').value,
        "stalk-root": document.getElementById('stalk-root').value,
        "stalk-surface-above-ring": document.getElementById('stalk-surface-above-ring').value,
        "stalk-surface-below-ring": document.getElementById('stalk-surface-below-ring').value,
        "stalk-color-above-ring": document.getElementById('stalk-color-above-ring').value,
        "stalk-color-below-ring": document.getElementById('stalk-color-below-ring').value,
        "veil-type": document.getElementById('veil-type').value,
        "veil-color": document.getElementById('veil-color').value,
        "ring-number": document.getElementById('ring-number').value,
        "ring-type": document.getElementById('ring-type').value,
        "spore-print-color": document.getElementById('spore-print-color').value,
        population: document.getElementById('population').value,
        habitat: document.getElementById('habitat').value,
    };
    
    
    
    // Prepare data for API
    const requestData = {inputs: [formData]};

    // Make API call
    fetch('https://mushroom-prediction-628r.onrender.com/api/mushroom', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        // Show results container
        const resultContainer = document.getElementById('resultContainer');
        resultContainer.style.display = 'block';
    
        // Defensive check for Prediction structure
        if (!data.Prediction || !Array.isArray(data.Prediction) || data.Prediction.length === 0) {
            console.error('Invalid or empty prediction data:', data);
            alert('Error: No prediction data received from the server.');
            return;
        }
    
        const predictions = data.Prediction[0];
        let edibleProb, poisonousProb;
    
        // Handle array format
        if (Array.isArray(predictions) && predictions.length === 2) {
            edibleProb = Math.round(predictions[0] * 100);
            poisonousProb = Math.round(predictions[1] * 100);
        } else if (typeof predictions === 'object' && predictions.hasOwnProperty('0') && predictions.hasOwnProperty('1')) {
            edibleProb = Math.round(predictions['0'] * 100);
            poisonousProb = Math.round(predictions['1'] * 100);
        } else {
            // console.error('Unexpected prediction format:', predictions);
            // alert('Unexpected prediction data format.');
            return;
        }
    
        // Update result display
        document.getElementById('edibleProb').textContent = edibleProb + '%';
        document.getElementById('poisonousProb').textContent = poisonousProb + '%';
        document.getElementById('edibleBar').style.width = edibleProb + '%';
        document.getElementById('edibleBar').textContent = edibleProb + '%';
        document.getElementById('poisonousBar').style.width = poisonousProb + '%';
        document.getElementById('poisonousBar').textContent = poisonousProb + '%';
    })
    
    .catch((error) => {
        // console.error('Error:', error);
        // alert('Error making prediction: ' + error.message);
    });
});
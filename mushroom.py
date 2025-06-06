import pandas as pd
from joblib import load
from flask import Flask, request, jsonify
from flask_cors import CORS
from category_encoders import BinaryEncoder

model = load('decision_tree_model.joblib')

X = pd.read_csv('mushrooms.csv')

categorical_features = ['cap-shape', 'cap-surface', 'cap-color', 'bruises', 'odor',
                       'gill-attachment', 'gill-spacing', 'gill-size', 'gill-color', 'stalk-shape',
                       'stalk-root', 'stalk-surface-above-ring', 'stalk-surface-below-ring', 'stalk-color-above-ring',
                       'stalk-color-below-ring', 'veil-type', 'veil-color', 'ring-number', 'ring-type',
                       'spore-print-color', 'population', 'habitat']
encoder = BinaryEncoder()
x_encoded = encoder.fit_transform(X[categorical_features])

api = Flask(__name__)
CORS(api)

@api.route('/api/mushroom', methods=['POST'])
def heart_failure_prediction():
    data = request.json['inputs']
    input_df = pd.DataFrame(data)
    input_encoded = encoder.transform(input_df[categorical_features])
    input_df = input_df.drop(categorical_features, axis=1)
    input_encoded = input_encoded.reset_index(drop=True)
    
    final_input = pd.concat([input_df, input_encoded], axis=1)
    
    prediction = model.predict_proba(final_input)
    class_labels = model.classes_
    
    response = []
    for prob in prediction:
        prob_dict = {}
        for k, v in zip(class_labels, prob):
            prob_dict[str(k)] = round(float(v) * 100, 2)
        response.append(prob_dict)
    
    return jsonify({'prediction': response})

if __name__ == '__main__':
    api.run(host='0.0.0.0', port=10000, debug=True)
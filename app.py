from flask import Flask, render_template, request, jsonify
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

with open('faq_data.json', 'r') as f:
    faq_data = json.load(f)

questions = [item['question'] for item in faq_data]

vectorizer = TfidfVectorizer()
question_vectors = vectorizer.fit_transform(questions)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():

    user_question = request.json['message']

    user_vector = vectorizer.transform([user_question])

    similarity = cosine_similarity(
        user_vector,
        question_vectors
    )

    best_match_index = similarity.argmax()

    confidence = similarity[0][best_match_index]

    if confidence < 0.2:
        return jsonify({
            'answer': "Sorry, I couldn't find an answer.",
            'confidence': round(confidence * 100, 2)
        })

    answer = faq_data[best_match_index]['answer']

    return jsonify({
        'answer': answer,
        'confidence': round(confidence * 100, 2)
    })

if __name__ == '__main__':
    app.run(debug=True)
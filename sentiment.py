from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load the sentiment analysis model
sentiment_analyzer = pipeline("sentiment-analysis")

@app.route('/analyze', methods=['POST'])
def analyze_sentiment():
    data = request.get_json()
    comment = data.get('comment', '')

    # Analyze sentiment
    result = sentiment_analyzer(comment)
    
    # Extract sentiment
    sentiment = result[0]['label']
    
    return jsonify({'sentiment': sentiment})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
import re
import torch
import numpy as np
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from setup import get_working_dir


def load_tokenizer():
    return AutoTokenizer.from_pretrained("oliverguhr/german-sentiment-bert",
                                         cache_dir=get_working_dir() + '/courage_algorithms/models/sentiment_BERT_DE')


def load_model():
    return AutoModelForSequenceClassification.from_pretrained("oliverguhr/german-sentiment-bert",
                                                              cache_dir=get_working_dir() + '/courage_algorithms/models/sentiment_BERT_DE')


def replace_numbers(text):
    return text.replace("0", " null").replace("1", " eins").replace("2", " zwei").replace("3", " drei").replace \
        ("4", " vier").replace("5", " fünf").replace("6", " sechs").replace("7", " sieben").replace \
        ("8", " acht").replace("9", " neun")


def clean_text(text):
    clean_chars = re.compile(r'[^A-Za-züöäÖÜÄß ]', re.MULTILINE)
    clean_http_urls = re.compile(r'https*\\S+', re.MULTILINE)
    clean_at_mentions = re.compile(r'@\\S+', re.MULTILINE)
    text = text.replace("\n", " ")
    text = clean_http_urls.sub('', text)
    text = clean_at_mentions.sub('', text)
    text = replace_numbers(text)
    text = clean_chars.sub('', text) # use only text chars
    text = ' '.join(text.split()) # substitute multiple whitespace with single whitespace
    text = text.strip().lower()
    return text


def predict_sentiment_de(sentence):
    sentence = clean_text(sentence)

    tokenizer = load_tokenizer()
    model = load_model()

    inputs = tokenizer(sentence, return_tensors="pt")

    labels = torch.tensor([1]).unsqueeze(0)
    outputs = model(**inputs, labels=labels)
    loss, logits = outputs[:2]
    logits = logits.squeeze(0)
    proba = torch.softmax(logits, dim=0)
    positive, negative, neutral = proba

    return np.round(negative.item(), 4), np.round(neutral.item(), 4), np.round(positive.item(), 4)
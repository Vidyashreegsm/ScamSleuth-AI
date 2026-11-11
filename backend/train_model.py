
import csv
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

# Project paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(
    BASE_DIR,
    "..",
    "datasets",
    "sms-spam-data",
    "SMSSpamCollection"
)

MODEL_DIR = os.path.join(BASE_DIR, "..", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "sms_spam_model.joblib")


def load_dataset():
    messages = []
    labels = []

    with open(DATASET_PATH, "r", encoding="latin-1") as file:
        reader = csv.reader(file, delimiter="\t")

        for row in reader:
            if len(row) < 2:
                continue

            label = row[0].strip().lower()
            message = row[1].strip()

            if label in ["ham", "spam"] and message:
                labels.append(label)
                messages.append(message)

    return messages, labels


def train_model():
    print("\n================================")
    print("       SCAMSLEUTH AI")
    print("       SMS MODEL TRAINING")
    print("================================\n")

    print("Loading dataset...")

    messages, labels = load_dataset()

    print(f"Total messages: {len(messages)}")
    print(f"Legitimate messages: {labels.count('ham')}")
    print(f"Spam messages: {labels.count('spam')}")

    # Split into training and testing datasets
    X_train, X_test, y_train, y_test = train_test_split(
        messages,
        labels,
        test_size=0.20,
        random_state=42,
        stratify=labels
    )

    print("\nTraining messages:", len(X_train))
    print("Testing messages:", len(X_test))

    # Build machine learning pipeline
    model = Pipeline([
        (
            "tfidf",
            TfidfVectorizer(
                lowercase=True,
                stop_words="english",
                ngram_range=(1, 2),
                min_df=2,
                sublinear_tf=True
            )
        ),
        (
            "classifier",
            LogisticRegression(
                max_iter=1000,
                random_state=42
            )
        )
    ])

    print("\nTraining model...")

    model.fit(X_train, y_train)

    # Evaluate model
    predictions = model.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)

    print("\n================================")
    print("       MODEL EVALUATION")
    print("================================")

    print(f"\nAccuracy: {accuracy * 100:.2f}%")

    print("\nClassification Report:")

    print(
        classification_report(
            y_test,
            predictions,
            labels=["ham", "spam"],
            target_names=["Legitimate", "Spam"],
            zero_division=0
        )
    )

    print("Confusion Matrix:")
    print(confusion_matrix(y_test, predictions, labels=["ham", "spam"]))

    # Save trained model
    os.makedirs(MODEL_DIR, exist_ok=True)

    joblib.dump(model, MODEL_PATH)

    print("\nModel saved successfully!")
    print("Location:", MODEL_PATH)

    print("\n================================")
    print("       TRAINING COMPLETE")
    print("================================")


if __name__ == "__main__":
    train_model()

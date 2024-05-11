import { schedule } from 'node-cron';
import User from '../models/User.js';
import Diary from '../models/Diary.js';
import Note from '../models/Note.js';
import NoteEmotion from '../models/NoteEmotion.js';

const availableEmotions = [
  'anger',
  'disgust',
  'fear',
  'joy',
  'neutral',
  'sadness',
  'shame',
  'surprise'
];

const emotionWeight = 0.8;
const keywordWeight = 0.2;

const matchingThreshold = 0.25;

function emotionSimilarity(emotionA, emotionB) {
  const emotionValuesA = [], emotionValuesB = [];
  for (const emotion of availableEmotions) {
    console.log(`Accessing emotion key: ${emotion}`);
    emotionValuesA.push(emotionA[emotion]);
    emotionValuesB.push(emotionB[emotion]);
  }
  console.log({ emotionValuesA, emotionValuesB });
  // const emotionValuesA = [emotionA.anger, emotionA.disgust, emotionA.fear, emotionA.joy, emotionA.neutral, emotionA.sadness, emotionA.shame, emotionA.surprise];
  // const emotionValuesB = [emotionB.anger, emotionB.disgust, emotionB.fear, emotionB.joy, emotionB.neutral, emotionB.sadness, emotionB.shame, emotionB.surprise];

  function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
    return magnitudeA * magnitudeB === 0 ? 0 : dotProduct / (magnitudeA * magnitudeB);
  }
  return cosineSimilarity(emotionValuesA, emotionValuesB);
}

function keywordSimilarity(keywordSetA, keywordSetB) {
  const intersection = new Set([...keywordSetA].filter(x => keywordSetB.has(x)));
  const union = new Set([...keywordSetA, ...keywordSetB]);
  return intersection.size / union.size;
}

function weightedSimilarity(noteA, noteB) {
  if (!noteA || !noteB) return 0;
  const emotionSimilarityScore = emotionSimilarity(noteA.emotion, noteB.emotion);
  const keywordSimilarityScore = keywordSimilarity(new Set(noteA.keywords), new Set(noteB.keywords));
  console.log({ emotionSimilarityScore, keywordSimilarityScore })

  // Combine similarities with weighted sum
  return emotionWeight * emotionSimilarityScore + keywordWeight * keywordSimilarityScore;
}

var dailyStat = schedule('0 * * * * *', async () => {
  const date = new Date().toLocaleDateString();
  console.log("starting cron job for matching", date);
  const notesWithoutMatch = await Note.find({
    $or: [
      { match: null },
      {
        $and: [
          { 'match.state': 'Initiated' },
          { 'match.buddy': null }
        ],
      },
    ],
  });
  const noteEmotionWithoutMatch = await Promise.all(
    notesWithoutMatch.map(async (note) => {
      const emotion = await NoteEmotion.findOne({ noteId: note._id });
      return emotion ? emotion : null;
    })
  );
  // console.log(noteEmotionWithoutMatch)
  const possiblePairs = [];
  for (let i = 0; i < noteEmotionWithoutMatch.length - 1; i++) {
    for (let j = i + 1; j < noteEmotionWithoutMatch.length; j++) {
      possiblePairs.push({
        note1: noteEmotionWithoutMatch[i],
        note2: noteEmotionWithoutMatch[j],
      });
    }
  }
  console.log({ possiblePairs });
  const scoredPairs = possiblePairs.map((pair) => ({
    ...pair,
    score: weightedSimilarity(pair.note1, pair.note2),
  }));

  scoredPairs.sort((a, b) => b.score - a.score);
  for (const pair of scoredPairs) {
    console.log("score of the current pair=", pair.score);
    if (pair.score >= matchingThreshold) {
      console.log(`Suggested Match: ${pair.note1.noteId} - ${pair.note2.noteId}`);
      // Update matched flag in your model for these nodes
      Note.findByIdAndUpdate(pair.note1.noteId, {
        match: {
          state: 'Pending',
          buddy: pair.note2.noteId,
        }
      })
        .then((note1) => {
          if (!note1) {
            console.error('Document 1 not found');
            return;
          }
          Note.findByIdAndUpdate(pair.note2.noteId, {
            match: {
              state: 'Pending',
              buddy: note1._id,
            }
          })
            .then((doc2) => {
              if (!doc2) {
                console.error('Document 2 not found');
                return;
              }
              console.log('Documents 1 and 2 successfully linked');
            })
            .catch((err) => {
              console.error('Error updating document 2:', err);
            });
        })
        .catch((err) => {
          console.error('Error updating document 1:', err);
        });
    }
  }
});

dailyStat.start();

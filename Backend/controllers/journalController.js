import Journal from '../schema/journalSchema.js';
import express from 'express';
import cors from 'cors';
const router = express.Router ();

export const JournalPost = async (req, res) => {
  console.log ('hii');
  console.log (req.body);
  res.send ('Journal route is working');
  let sendtoDB = new Journal ({
    content: req.body.content,
    emotion: req.body.emotion,
    aiReview: req.body.aiReview,
    isAnonymous: req.body.isAnonymous,
    userId: req.body.userId,
  });
  let response = await sendtoDB.save ();
  console.log (response);
};

export const getAllJournals = async (req, res) => {
  try {
    const journals = await Journal.find ();
    res.status (200).json (journals);
  } catch (error) {
    res.status (500).json ({message: 'Server Error', error: error.message});
  }
};

export const getOneUserEntries = async (req, res) => {
  try {
    console.log ('I am here');

    const {id} = req.body;
    console.log ('I am here');
    const userJournals = await Journal.find ({userId: id});
    console.log (userJournals + 'hii');
    res.status (200).json (userJournals);
  } catch (error) {
    res.status (500).json ({message: 'Server Error', error: error.message});
  }
};

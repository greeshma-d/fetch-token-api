const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const statsFilePath = path.join(__dirname, "./stats.json");

// GET method for all Players
const getAllStats = async (req, res, next) => {
    try {
      const data = fs.readFileSync(statsFilePath);
      const stats = JSON.parse(data);
      const playerStats = stats.map((player) => player);
      if (!playerStats) {
        const err = new Error("Players stats not found");
        err.status = 400;
        throw err;
      }
      res.json(playerStats);
    } catch (e) {
      next(e);
    }
  };
  router.route("/api/v1/stats").get(getAllStats);
  
  // GET method for particular ID
  const getStats = async (req, res, next) => {
    try {
      const data = fs.readFileSync(statsFilePath);
      const stats = JSON.parse(data);
      const playerStats = stats.find(
        (player) => player.id === Number(req.params.id)
      );
      if (!playerStats) {
        const err = new Error("Players stats not found");
        err.status = 400;
        throw err;
      }
      res.json(playerStats);
    } catch (e) {
      next(e);
    }
  };
  router.route("/api/v1/stats/:id").get(getStats);
  
  // GET method to sort wins in descending order
  const getStatsInDesc = async (req, res, next) => {
    try {
      const data = fs.readFileSync(statsFilePath);
      const stats = JSON.parse(data);
      const playerStats = stats.sort((a, b) => {
        return Number(b.wins) - Number(a.wins);
      });
      if (!playerStats) {
        const err = new Error("Players stats not found");
        err.status = 400;
        throw err;
      }
      res.json(playerStats);
    } catch (e) {
      next(e);
    }
  };
  router.route("/api/v1/stats?sort_by=wins&order_by=desc").get(getStatsInDesc);
  
  // POST method
  const createStats = async (req, res, next) => {
    try {
      const data = fs.readFileSync(statsFilePath);
      const stats = JSON.parse(data);
      const newStats = {
        id: req.body.id,
        wins: req.body.wins,
        losses: req.body.losses,
        points_scored: req.body.points_scored,
      };
      stats.push(newStats);
      fs.writeFileSync(statsFilePath, JSON.stringify(stats));
      res.status(201).json(newStats);
    } catch (e) {
      next(e);
    }
  };
  router.route("/api/v1/stats").post(createStats);
  
  // PUT method
  const updateStats = async (req, res, next) => {
    try {
      const data = fs.readFileSync(statsFilePath);
      const stats = JSON.parse(data);
      const playerStats = stats.find(
        (player) => player.id === Number(req.params.id)
      );
      if (!playerStats) {
        const err = new Error("Players stats not found");
        err.status = 404;
        throw err;
      }
      const newStatsData = {
        id: req.body.id,
        wins: req.body.wins,
        losses: req.body.losses,
        points_scored: req.body.points_scored,
      };
      const newStats = stats.map((player) => {
        if (player.id === Number(req.params.id)) {
          return newStatsData;
        } else {
          return player;
        }
      });
      fs.writeFileSync(statsFilePath, JSON.stringify(newStats));
      res.status(200).json(newStatsData);
    } catch (e) {
      next(e);
    }
  };
  router.route("/api/v1/stats/:id").put(updateStats);
  
  // DELETE method
  const deleteStats = async (req, res, next) => {
    try {
      const data = fs.readFileSync(statsFilePath);
      const stats = JSON.parse(data);
      const playerStats = stats.find(
        (player) => player.id === Number(req.params.id)
      );
      if (!playerStats) {
        const err = new Error("Players stats not found");
        err.status = 404;
        throw err;
      }
      const newStats = stats.filter((player) => player.id !== Number(req.params.id));
      fs.writeFileSync(statsFilePath, JSON.stringify(newStats));
      res.status(200).end();
    } catch (e) {
      next(e);
    }
  };
  router.route("/api/v1/stats/:id").delete(deleteStats);

  module.exports = router ;
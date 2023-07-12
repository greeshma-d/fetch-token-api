const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const tokensFilePath = path.join(__dirname, "./tokens.json");
const ERROR_STATUS = 404;

// GET method for all datas and filtered data
  const getTokensData = async (req, res, next) => {
    try {
      const data = await fetch("https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/all.json").then((res) => res.json());
      const tokensList = data;

      let fewerTokensData = {};
      for (const key in tokensList) {
        if (tokensList.hasOwnProperty(key)) {
          const arrayOfObjects = tokensList[key];
          fewerTokensData[key] = arrayOfObjects.map(obj => {
            const { coingeckoId, listedIn, ...rest } = obj;
            return rest;
          });
        }
      };

      if (!fewerTokensData) {
        const err = new Error(`Tokens not found`);
        err.status = ERROR_STATUS;
        throw err;
      }

      return res.json(fewerTokensData);
    } catch (e) {
      next(e);
    }
  }
  router.route("/api/v1/tokens").get(getTokensData);

  // GET method for chain id
  const getChainData = async (req, res, next) => {
    try {
      const data = await fetch("https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/all.json").then((res) => res.json());
      const tokensList = data;
      const chainIDNumber = req.params.chainID;

      let tokensData;
      for (const chainIdKey in tokensList) {
        if (tokensList.hasOwnProperty(chainIdKey)) {
          if (chainIdKey == chainIDNumber) {
            tokensData = tokensList[chainIdKey]; 
          }
        }
      }
      let fewerData = tokensData?.map(({listedIn, coingeckoId, ...rest}) => {return rest});

      if (!fewerData) {
        const err = new Error(`Tokens not found for chain ID ${chainIDNumber}`);
        err.status = ERROR_STATUS;
        throw err;
      }

      return res.json(fewerData);
    } catch (e) {
      next(e);
    }
  }
  router.route("/api/v1/tokens/:chainID").get(getChainData);
  
  module.exports = router ;
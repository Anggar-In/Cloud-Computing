const express = require('express');
const tf = require('@tensorflow/tfjs');
const Papa = require('papaparse');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware untuk parsing JSON
app.use(express.json());

// Fungsi untuk memformat angka dengan pemisah ribuan dan menambahkan simbol "Rp"
function formatCurrency(value) {
  if (value == null) return "Rp 0"; // Jika nilai tidak ada, tampilkan Rp 0
  return "Rp " + value.toLocaleString("id-ID");
}

async function loadModel(modelPath) {
  const model = await tf.loadLayersModel(modelPath);
  return model;
}

async function loadCSV(filePath) {
  const response = await axios.get(filePath);
  return new Promise((resolve, reject) => {
    Papa.parse(response.data, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        resolve(result.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

// Fungsi untuk memproses data CSV
function processCSVData(data) {
  const numericalFeatures = [
    "Revenue (IDR)",
    "Gross Profit (IDR)",
    "Net Income (IDR)",
    "Market Cap (IDR)",
    "Annual EPS",
    "Return on Equity (%)",
    "1 Year Price Returns (%)",
    "3 Year Price Returns (%)",
    "5 Year Price Returns (%)",
    "Dividend Yield (%)",
    "Payout Ratio (%)",
  ];

  const sectorFeatures = data[0]
    ? Object.keys(data[0]).filter((col) => col.startsWith("Sector_"))
    : [];

  const allFeatures = [...sectorFeatures, ...numericalFeatures];

  const inputData = data.map((row) => {
    return allFeatures.map((feature) => {
      return row[feature] != null ? row[feature] : 0;
    });
  });

  return tf.tensor2d(inputData);
}

function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, val, idx) => sum + val * b[idx], 0);
  const magnitude = (vec) =>
    Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitude(a) * magnitude(b));
}

app.post('/calculate-target-return', (req, res) => {
  try {
    const { annualExpenditure, initialInvestment, timePeriod } = req.body;

    if (!annualExpenditure || !initialInvestment || !timePeriod) {
      return res.status(400).json({ message: 'All fields are required: annualExpenditure, initialInvestment, timePeriod' });
    }

    const targetPortfolio = annualExpenditure / 0.04;
    const roi = Math.pow(targetPortfolio / initialInvestment, 1 / timePeriod) - 1;

    res.status(200).json({
      targetPortfolio: targetPortfolio.toFixed(2),
      roi: parseFloat((roi * 100).toFixed(2)),
      targetReturn: roi * 100 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Endpoint untuk mendapatkan rekomendasi
app.post('/recommendations', async (req, res) => {
  try {
    const { targetReturn } = req.body; // Ambil targetReturn dari request body
    if (targetReturn == null) {
      return res.status(400).json({ error: "Please provide a target return." });
    }

    const model = await loadModel("https://storage.googleapis.com/anggarin_bucket/stock-recommendations-model/model.json");
    const csvData = await loadCSV("https://storage.googleapis.com/anggarin_bucket/dataset/company_information.csv");
    const inputTensor = processCSVData(csvData);

    const embeddings = model.predict(inputTensor).arraySync();
    const stocks = csvData.map((row) => row["Kode Saham"]);

    const returnDiff = csvData.map((row) =>
      Math.abs(row["1 Year Price Returns (%)"] - targetReturn)
    );

    const avgTargetEmbedding = embeddings[0].map((_, idx) => {
      return (
        embeddings.reduce((sum, embed) => sum + embed[idx], 0) / embeddings.length
      );
    });

    const similarityScores = embeddings.map((embedding, idx) => {
      const similarity = cosineSimilarity(avgTargetEmbedding, embedding);
      return { index: idx, similarity: similarity, returnDiff: returnDiff[idx] };
    });

    const combinedScores = similarityScores.map(
      ({ index, similarity, returnDiff }) => {
        return {
          index,
          score: similarity - 0.1 * returnDiff,
        };
      }
    );

    combinedScores.sort((a, b) => b.score - a.score);
    const topRecommendations = combinedScores.slice(0, 10);

    const results = topRecommendations.map(({ index }) => {
      const stockData = csvData[index];
      return {
        stockCode: stockData["Kode Saham"],
        revenue: formatCurrency(stockData["Revenue (IDR)"]),
        netIncome: formatCurrency(stockData["Net Income (IDR)"]),
        marketCap: formatCurrency(stockData["Market Cap (IDR)"]),
        annualEPS: stockData["Annual EPS"],
        returnOnEquity: stockData["Return on Equity (%)"],
        oneYearPriceReturns: stockData["1 Year Price Returns (%)"],
        threeYearPriceReturns: stockData["3 Year Price Returns (%)"],
        fiveYearPriceReturns: stockData["5 Year Price Returns (%)"],
        dividendYield: stockData["Dividend Yield (%)"],
        payoutRatio: stockData["Payout Ratio (%)"],
      };
    });

    res.json(results);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

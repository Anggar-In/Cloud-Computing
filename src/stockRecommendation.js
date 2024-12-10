const calculatorFreedom = async (req, res) => {
  try {
    const { annualExpenditure, initialInvestment, timePeriod } = req.body;

    if (!annualExpenditure || !initialInvestment || !timePeriod) {
      return res.status(400).json({ message: 'All fields are required: annualExpenditure, initialInvestment, timePeriod' });
    }

    const targetPortfolio = annualExpenditure / 0.04;
    const roi = Math.pow(targetPortfolio / initialInvestment, 1 / timePeriod) - 1;

    res.status(200).json({
      targetPortfolio: targetPortfolio.toFixed(2),
      roi: (roi * 100).toFixed(2) + '%',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { calculatorFreedom };

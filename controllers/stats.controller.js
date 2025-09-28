const statsService = require("../services/stats.services");
const catchAsync = require("../utils/catchAsync");

const statsController = {
  getStats: catchAsync(async (req, res) => {
        const result = await statsService.getStats();

        res.status(200).json({
            success: true,
            message: "Stats fetched successfully",
            data: result,
        });
    }),
};

module.exports = statsController;

const catchAsync = require("../utils/catchAsync");
const contactMessageService = require("../services/contactMessage.service");

const contactMessageController = {
  submit: catchAsync(async (req, res) => {
    const row = await contactMessageService.create(req.body);
    res.status(201).json({
      success: true,
      message: "Your message has been sent. We will get back to you soon.",
      data: { id: row.id },
    });
  }),

  listForAdmin: catchAsync(async (req, res) => {
    const { page, limit, search } = req.query;
    const result = await contactMessageService.getAll({ page, limit, search });
    res.status(200).json({
      success: true,
      message: "Contact messages fetched successfully",
      data: result,
    });
  }),
};

module.exports = contactMessageController;

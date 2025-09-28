const catchAsync = require("../utils/catchAsync");
const faqService = require("../services/faq.services");

const faqController = {
  createFaq: catchAsync(async (req, res) => {
    const faq = await faqService.createFaq(req.body);
    res.status(201).json({ success: true, data: faq, message: "FAQ created successfully" });
  }),


 getAllFaqs: catchAsync(async (req, res) => {
        const { page, limit, search } = req.query;
        const result = await faqService.getAllFaqs({ page, limit, search });

        res.status(200).json({
            success: true,
            message: "Faqs fetched successfully",
            data: result,
        });
    }),
  getFaqByBrand: catchAsync(async (req, res) => {
    const faq = await faqService.getFaqByBrand(req.params.brandId);
    res.status(200).json({ success: true, data: faq, message: "FAQ fetched successfully" });
  }),

  updateFaq: catchAsync(async (req, res) => {
    const updatedFaq = await faqService.updateFaq(req.params.id, req.body.content);
    res.status(200).json({ success: true, data: updatedFaq, message: "FAQ updated successfully" });
  }),

  deleteFaq: catchAsync(async (req, res) => {
    const result = await faqService.deleteFaq(req.params.id);
    res.status(200).json({ success: true, ...result });
  }),
};

module.exports = faqController;

const categoryModel = require('../../category/categoryModel');
exports.getCategory = async (req, res, next) => {
    try {
        const categoryResult = await categoryModel.find({
            isActive: true, published:true
        })
            .sort({
                createdAt: -1
            });
        const finalResult = categoryResult.map((item) => {
            return {
                id: item._id,
                category_name: item.category_name,
                image: `${req.protocol}://${req.get('host')}/uploads/category/${item.file_name}`,
                home_display: item.home_display,
                published: item.published,
                isActive: item.isActive,
                date: new Date(item.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '')
            }
        });
        if (categoryResult.length > 0) {
            res.status(200).json({ success: true, count: categoryResult.length, data: finalResult });
        }
        else {
            res.status(200).json({ success: true, message: "No records not found" })
        }
    }
    catch (err) {
        next(err);
    }
}

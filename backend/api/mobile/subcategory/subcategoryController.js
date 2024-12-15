const subcategoryModel = require('../../subcategory/subcategoryModel');
exports.getsubcategory = async (req, res, next)=>{
    try
    {
        const {id} = req.params;
        const result = await subcategoryModel.find({
            fk_category: id, isActive: true, published : true
        }).populate({
            path: 'fk_category',
            match: { isActive: true, published: true },
            select: 'category_name'
        }).sort({ createdAt: -1 });

        const full = result.map((item) => {
            if (item.fk_category == null) // check parent category isactive true and published true
            {
                return {
                    id: item._id,
                    subcategory_name: item.subcategory_name,
                    parentCategory: null,
                    home_display: item.home_display,
                    published: item.published,
                    isActive: item.isActive,
                    images: `${req.protocol}://${req.get('host')}/uploads/subcategory/${item.file_name}`,
                    date: new Date(item.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '')
                };
            }
            else {
                return {
                    id: item._id,
                    subcategory_name: item.subcategory_name,
                    parentCategory: {
                        id: item.fk_category._id,
                        category_name: item.fk_category.category_name
                    },
                    home_display: item.home_display,
                    published: item.published,
                    isActive: item.isActive,
                    images: `${req.protocol}://${req.get('host')}/uploads/subcategory/${item.file_name}`,
                    date: new Date(item.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '')
                };
            }
        });
        if ((result.length > 0)) {
            res.status(200).json({ success: true, count: result.length, data: full });
        }
        else {
            res.status(200).json({ success: true, count: result.length, data: full, message: "No records not found" })
        }

    }
    catch(err)
    {
        next(err);
    }
}
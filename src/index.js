module.exports = {
    index: (req, res) => {
        res.render('index', {
            page: 'index',
            menuId: 'index'
        })
    }
}
module.exports = (req, res) => {
    res.render('about', {
        page: 'About',
        menuId: 'about'
    })
}
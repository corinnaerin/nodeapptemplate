module.exports = (router) => {
    router.get('/construction', (req, res) => {
        res.json({
            success: true,
            imageURL: 'images/underconstruction.gif'
        });
    })
};
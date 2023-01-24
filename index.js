const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()

app.use('/', express.static('public/'))
app.use(fileUpload())

app.post('/extract-text', (req, res) => {
	if(!req.files) {
		res.status(400)
		res.end()
	}

	const text = req.files.file.data.toString('utf8')
	res.send(text)
})

app.listen(3000)
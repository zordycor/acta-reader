const apiKey = 'zordycorak@gmail.com_058c83c487644a49a3f7fa2ae7a1cebd43f84daa703b968a628d2dd7f1c14bb1e7b99acc'

const getPresignedUrl = async (fileName) => {
	const response = await fetch(`https://api.pdf.co/v1/file/upload/get-presigned-url?name=${fileName}&contentType=application/pdf`, {
		method: 'GET',
		headers: {
			'x-api-key': apiKey
		}
	})

	const fileUploadObject = await response.json()
	return fileUploadObject
}

const uploadFile = async (presignedUrl, file) => {
	await fetch(presignedUrl, {
		method: 'PUT',
		headers: {
			'x-api-key': apiKey
		},
		body: file
	})
}

const convertPdfToTxt = async requestBody => {
	const response = await fetch('https://api.pdf.co/v1/pdf/convert/to/text-simple', {
		method: 'POST',
		body: requestBody,
		headers: {
			'x-api-key': apiKey,
			'Content-Type': 'application/json'
		}
	})

	const responseData = await response.json()
	return responseData
}

const getTxtContent = async fileUrl => {
	const rawFile = await fetch(fileUrl)
	const blobFile = await rawFile.blob()
	const fileContent = await blobFile.text()

	return fileContent
}

export {
	getPresignedUrl,
	uploadFile,
	convertPdfToTxt,
	getTxtContent,
}
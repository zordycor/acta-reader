const apiKey = 'borjarodrigomarti@gmail.com_07b7105544b10a37055eea414b51cee176aba196f759c91b23bb49d6853d8fffd7dffeb5'

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
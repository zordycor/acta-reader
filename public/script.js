import { getPresignedUrl, uploadFile, convertPdfToTxt, getTxtContent } from './services.js'

const inpFile = document.getElementById("inpFile")
const resultText = document.getElementById("resultText")

let equipo1, equipo2, finalText = ''
let lastPointA = 0, lastPointB = 0
let playersA = {}, pointsA = {}, playersB = {}, pointsB = {}

const formatResponse = (text => {
	logTeamNames(text)
	logTanteoFinal(text)
	finalText += '<br>'
	logCategoria(text)
	logFecha(text)
	finalText += '<br>'
	logTanteo(text)
	logJugadoresA(text)
	logJugadoresB(text)
	computePoints(text)

	showPointsByTeam()
	finalText += '</div>'

	return text.trim();
})

inpFile.onchange = async () => {
	finalText = ''
	resultText.innerHTML = ''
	lastPointA = 0, lastPointB = 0
	playersA = {}, pointsA = {}, playersB = {}, pointsB = {}

	showLoading()

	try {
		const fileUploadObject = await getPresignedUrl(inpFile.files[0].name)

		await uploadFile(fileUploadObject.presignedUrl, inpFile.files[0])

		const requestBody = {
			url: fileUploadObject.url,
			name: 'Acta.txt'
		}

		const response = await convertPdfToTxt(JSON.stringify(requestBody))

		const textFile = await getTxtContent(response.url)

		const cleanResponse = await textFile.replaceAll('X','')

		formatResponse(cleanResponse)
		resultText.innerHTML = finalText
	} catch (error) {
		console.error(error.message);
		resultText.innerHTML = `
			<p style="background: indianred;color: darkred;border-radius: 20px;padding: 10px 30px;display: initial;margin-left: 34%;">
				Ha ocurrido un error, inténtalo de nuevo más tarde.
			</p>
		`
	}
	hideLoading()
}

const logTeamNames = text => {
	const indexEquipo1 = text.indexOf("Equipo A ") + 9
	const indexEquipo2 = text.indexOf(" Equipo B ") + 10
	equipo1 = text.substring(indexEquipo1, text.indexOf(" Equipo B "))
	equipo2 = text.substring(indexEquipo2, text.indexOf("Competición"))
}

const logCategoria = text => {
	const indexCategoria = text.indexOf("Competición ") + 12
	const categoria = text.substring(indexCategoria, text.indexOf("Fecha"))
	finalText += `<h5>Categoría: ${categoria}</h5>`
}

const logFecha = text => {
	const indexFecha = text.indexOf("Fecha ") + 6
	const fecha = text.substring(indexFecha, text.indexOf("Hora"))
	finalText += `<h5>Fecha: ${fecha}</h5>`
}

const logTanteo = text => {
	const indexTanteo = text.indexOf("Tanteo Periodo 1") + 16
	const endTanteo = text.indexOf("Periodo 3")
	const splitPeriodo1 = text.substring(indexTanteo, endTanteo).split(' ')
	const periodoPoints1 = splitPeriodo1.filter(element => /^-?\d+\.?\d*$/.test(element))
	let tanteoA1 = periodoPoints1[0]
	let tanteoB1 = periodoPoints1[1]
	finalText += '<h5>Tanteo</h5>'
	if(tanteoA1 > tanteoB1) {
		tanteoA1 = boldString(tanteoA1)
	} else {
		tanteoB1 = boldString(tanteoB1)
	}
	finalText += `<h5 style="font-weight:400">1r cuarto: ${tanteoA1} - ${tanteoB1}</h5>`

	let tanteoA2 = periodoPoints1[3]
	let tanteoB2 = periodoPoints1[4]
	if(tanteoA2 > tanteoB2) {
		tanteoA2 = boldString(tanteoA2)
	} else {
		tanteoB2 = boldString(tanteoB2)
	}
	finalText += `<h5 style="font-weight:400">2º cuarto: ${tanteoA2} - ${tanteoB2}</h5>`

	const indexTanteo2 = text.indexOf("Periodo 3")
	const endTanteo2 = text.indexOf("Periodo E")
	const splitPeriodo2 = text.substring(indexTanteo2, endTanteo2).split(' ')
	const periodoPoints2 = splitPeriodo2.filter(element => /^-?\d+\.?\d*$/.test(element))
	let tanteoA3 = periodoPoints2[1]
	let tanteoB3 = periodoPoints2[2]
	if(tanteoA3 > tanteoB3) {
		tanteoA3 = boldString(tanteoA3)
	} else {
		tanteoB3 = boldString(tanteoB3)
	}
	finalText += `<h5 style="font-weight:400">3r cuarto: ${tanteoA3} - ${tanteoB3}</h5>`

	let tanteoA4 = periodoPoints2[4]
	let tanteoB4 = periodoPoints2[5]
	if(tanteoA4 > tanteoB4) {
		tanteoA4 = boldString(tanteoA4)
	} else {
		tanteoB4 = boldString(tanteoB4)
	}
	finalText += `<h5 style="font-weight:400">4º cuarto: ${tanteoA4} - ${tanteoB4}</h5>`

	const indexTanteoE = text.indexOf("Periodo E") + 10

	const tanteoAE = text.substring(indexTanteoE + 12, indexTanteoE + 14)
	const tanteoBE = text.substring(indexTanteoE + 17, indexTanteoE + 19)
	if(tanteoAE.match(/\d+/g)) {
		if(tanteoAE > tanteoBE) {
			tanteoAE = boldString(tanteoAE)
		} else {
			tanteoBE = boldString(tanteoBE)
		}
		finalText += `<h5 style="font-weight:400">Prórroga: ${tanteoAE} - ${tanteoBE}</h5>`
	}
}

const logTanteoFinal = text => {
	const indexTanteoA = text.indexOf("Tanteo Final Equipo A") + 22
	const indexEndTanteoA = indexTanteoA + 2
	const indexTanteoB = indexEndTanteoA + 10
	const indexEndTanteo = indexTanteoB + 2

	const tanteoA = text.substring(indexTanteoA, indexEndTanteoA)
	const tanteoB = text.substring(indexTanteoB, indexEndTanteo)
	let equipo1Bold = equipo1
	let equipo2Bold = equipo2
	if(tanteoA > tanteoB) {
		equipo1Bold = boldString(equipo1)
	} else {
		equipo2Bold = boldString(equipo2)
	}
	finalText += `<h4>${equipo1Bold} ${tanteoA} - ${tanteoB} ${equipo2Bold}</h4>`
}

const logJugadoresA = text => {
	const indexJugadores = text.indexOf("1 2 3 4 5") + 10
	const listaJugadores = text.substring(indexJugadores, text.indexOf("Entrenador"))
	const arrayJugadores = listaJugadores.split('\n')
	const arrayJugadoresClean = arrayJugadores.filter(jug => jug.length)

	arrayJugadoresClean.forEach(line => {
		const afterComa = line.substring(line.indexOf(','))
		const numero = afterComa.match(/\d+/g)
		const apellidos = line.substring(0, line.indexOf(','))
		const cleanApellidos = apellidos.replace(/[0-9]/g, '')

		pointsA[numero] = 0
		playersA[numero] = cleanApellidos.trim()
	})
}

const logJugadoresB = text => {
	const actaSoloEquipoB = text.substring(text.indexOf("Entrenador") + 10)
	const indexJugadores = actaSoloEquipoB.indexOf("1 2 3 4 5") + 10
	const listaJugadores = actaSoloEquipoB.substring(indexJugadores, actaSoloEquipoB.indexOf("Entrenador"))
	const arrayJugadores = listaJugadores.split('\n')
	const arrayJugadoresClean = arrayJugadores.filter(jug => jug.length)

	arrayJugadoresClean.forEach(line => {
		const afterComa = line.substring(line.indexOf(','))
		const numero = afterComa.match(/\d+/g)
		const apellidos = line.substring(0, line.indexOf(','))
		const cleanApellidos = apellidos.replace(/[0-9]/g, '')

		pointsB[numero] = 0
		playersB[numero] = cleanApellidos.trim()
	})
}

const computePoints = text => {
	const start = text.indexOf('TANTEO ARRASTRADO')
	const end = text.indexOf('Tanteo Final')
	const pointsSection = text.substring(start + 22, end)
	const pointsArray = pointsSection.split('\n')
	const cleanArray = removeABRows(pointsArray)
	cleanArray.forEach((line, index) => {
		const cleanLine = removeBreakLine(line)
		if(index === 160 || !cleanLine.length) {
			return
		}
		const indexFind = cleanLine.split(' ').filter(number => number == (index+1))
		let players = null
		if(indexFind.length > 2) {
			if(!(Object.keys(pointsA).includes(index+1) &&
				cleanLine.length == 3 &&
				cleanLine.filter(el => el == (index+1)).length == 3)
			) {
				players = cleanLine.replace(' ' + (index+1) + ' ' + (index+1), ',').split(',')
				return
			}
			if(!cleanLine.indexOf((index+1))) {
				players = cleanLine.replace(' ' + (index+1) + ' ' + (index+1), ',').split(',')
			}
			if(Object.keys(pointsB).includes(index+1) &&
				cleanLine.length == 3 &&
				cleanLine.filter(el => el == (index+1)).length == 3
			) {
				players = cleanLine.replace((index+1) + ' ' + (index+1) + ' ', ',').split(',')
				return
			}
			if(cleanLine.indexOf((index+1))) {
				players = cleanLine.replace((index+1) + ' ' + (index+1) + ' ', ',').split(',')
			}
		} else {
			players = cleanLine.replace((index+1) + ' ' + (index+1), ',').split(',')
		}
		const playerA = players[0].length ? players[0].trim() : null
		const playerB = players[1].length ? players[1].trim() : null

		if(playerA) {
			if(!pointsA[playerA]) pointsA[playerA] = 0
			pointsA[playerA] += parseInt(index + 1) - lastPointA
			lastPointA = parseInt(index + 1)
		}
		if(playerB) {
			if(!pointsB[playerB]) pointsB[playerB] = 0

			pointsB[playerB] += parseInt(index + 1) - lastPointB
			lastPointB = parseInt(index + 1)
		}
	})
}

const showPointsByTeam = () => {
	finalText += '<br>'
	finalText += '<div class="anotacion">'
	finalText += '<div class="anotacion-equipo1">'
	finalText += `<h5>Anotación ${equipo1}</h5>`
	finalText += '<br>'
	const biggestAnotationA = biggestAnotation(pointsA)
	const biggestAnotationB = biggestAnotation(pointsB)

	Object.keys(pointsA).forEach(number => {
		if(playersA[number] && playersA[number].length) {
			let pointsPlayer = pointsA[number]
			if(pointsA[number] == biggestAnotationA) {
				pointsPlayer = boldString(pointsPlayer.toString())
			}
			finalText += `<h6>${number} <span style="font-weight:400">${playersA[number]}</span>: <span style="font-size:20px">${pointsPlayer}</span></h6>`
		}
	})
	const totalSumA = Object.values(pointsA).reduce((a,b) => a+b, 0)
	finalText += `<h6>Total: ${totalSumA}</h6>`

	finalText += '</div>'
	finalText += '<div class="anotacion-equipo2">'
	finalText += `<h5>Anotación ${equipo2}</h5>`
	finalText += '<br>'

	Object.keys(pointsB).forEach(number => {
		if(playersB[number] && playersB[number].length) {
			let pointsPlayer = pointsB[number]
			if(pointsB[number] == biggestAnotationB) {
				pointsPlayer = boldString(pointsPlayer.toString())
			}
			finalText += `<h6>${number} <span style="font-weight:400">${playersB[number]}</span>: <span style="font-size:20px">${pointsPlayer}</span></h6>`
		}
	})
	const totalSumB = Object.values(pointsB).reduce((a,b) => a+b, 0)
	finalText += `<h6>Total: ${totalSumB}</h6>`
	finalText += '</div>'
}

const removeABRows = array => {
	let i = 0;
	while (i < array.length) {
		if (array[i] === 'A B\r' || array[i] === '\r') {
			array.splice(i, 1);
		} else {
			++i;
		}
	}
	return array;
}

const removeBreakLine = line => line.replace('\r','')

const boldString = str => str.replace(RegExp(str, 'g'), `<b>${str}</b>`);

const biggestAnotation = players => {
	const max = Object.values(players)

	return Math.max(...max)
}

const showLoading = () => {
	const loading = document.querySelector('.loading-background')
	loading.style.display = 'block'
	move()
}

const hideLoading = () => {
	const loading = document.querySelector('.loading-background')
	loading.style.display = 'none'
}


var i = 0;
function move() {
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("myBar");
    var width = 1;
    var id = setInterval(frame, 20);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
  }
}
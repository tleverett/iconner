const MAX_WIDTH = 128
const MAX_HEIGHT = 128

const read = (file) => new Promise((res, rej) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    res(e.target.result)
  }
  reader.onerror = rej
  reader.readAsDataURL(file)
})

const createImage = (url) => new Promise((res, rej) => {
  const image = document.createElement('img')
  image.onload = () => {
    res(image)
  }
  image.onerror = rej
  image.src = url
})

const clear = (node) => {
  for (const child of node.childNodes) {
    node.removeChild(child)
  }
}

const output = async (file) => {
  if (!file) {
    window.console && console.error('no file found')
    return
  }

  clear(result)
  result.appendChild(loader)

  const url = await read(file)

  const image = await createImage(url)

  const {
    naturalWidth,
    naturalHeight
  } = image

  let x
  let y
  let width
  let height

  if (naturalWidth / naturalHeight > MAX_WIDTH / MAX_HEIGHT) {
    width = MAX_WIDTH
    height = (naturalHeight / naturalWidth) * MAX_WIDTH
    x = 0
    y = (MAX_HEIGHT - height) / 2
  } else {
    width = (naturalWidth / naturalHeight) * MAX_WIDTH
    height = MAX_HEIGHT
    x = (MAX_WIDTH - width) / 2
    y = 0
  }

  const canvas = document.createElement('canvas')
  canvas.width = MAX_WIDTH
  canvas.height = MAX_HEIGHT

  const context = canvas.getContext('2d')
  context.fillStyle = colorInput.value
  context.fillRect(0, 0, MAX_WIDTH, MAX_HEIGHT)
  context.drawImage(image, x, y, width, height)

  const resizedUrl = canvas.toDataURL('image/png')
  
  clear(result)

  resultLink.href = resizedUrl

  resultImage.src = resizedUrl

  result.appendChild(resultLink)
}

const resultLink = document.createElement('a')
resultLink.classList.add('Result_link')
resultLink.download = 'icon.png'

const resultImage = document.createElement('img')
resultImage.classList.add('Result_image')
resultImage.alt = 'icon'

resultLink.appendChild(resultImage)

const loader = document.createElement('progress')

const result = document.querySelector('.Result')

const colorInput = document.querySelector('.ColorField_input')

const fileInput = document.querySelector('.FileField_input')

fileInput.addEventListener('change', (e) => {
  output(fileInput.files[0])
})

const dragInput = document.querySelector('.DragField_input')

const dragging = 'DragField_input-dragging'

dragInput.addEventListener('dragenter', () => {
  dragInput.classList.add(dragging)
})

dragInput.addEventListener('dragleave', () => {
  dragInput.classList.remove(dragging)
})

dragInput.addEventListener('dragover', (e) => {
  e.preventDefault()
})

dragInput.addEventListener('drop', (e) => {
  e.preventDefault()
  dragInput.classList.remove(dragging)
  output(e.dataTransfer.files[0])
})

document.addEventListener('paste', (e) => {
  output(e.clipboardData.files[0])
})

const filenameInput = document.querySelector('.FilenameField_input')

filenameInput.addEventListener('input', () => {
  const filename = filenameInput.value || 'icon'
  resultLink.download = `${filename}.png`
})
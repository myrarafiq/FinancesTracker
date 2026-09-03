import { spawn } from 'child_process'
import { writeFileSync } from 'fs'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9223

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function send(ws, id, method, params = {}) {
  return new Promise((resolve, reject) => {
    const onMessage = (event) => {
      const msg = JSON.parse(event.data.toString())
      if (msg.id === id) {
        ws.removeEventListener('message', onMessage)
        if (msg.error) reject(new Error(JSON.stringify(msg.error)))
        else resolve(msg.result)
      }
    }
    ws.addEventListener('message', onMessage)
    ws.send(JSON.stringify({ id, method, params }))
  })
}

async function evaluate(ws, id, expression) {
  const result = await send(ws, id, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  })
  return result?.result?.value
}

const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  `--remote-debugging-port=${PORT}`,
  '--window-size=1280,2200',
  '--user-data-dir=/tmp/wdmmg-chrome',
  'http://127.0.0.1:5173/',
], { stdio: 'ignore' })

try {
  let targets
  for (let i = 0; i < 20; i++) {
    try {
      targets = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json())
      if (targets?.length) break
    } catch {
      await sleep(300)
    }
  }
  const page = targets.find((t) => t.type === 'page') || targets[0]
  const ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true })
    ws.addEventListener('error', reject, { once: true })
  })

  await send(ws, 1, 'Page.enable')
  await send(ws, 2, 'Runtime.enable')
  await sleep(800)

  const title = await evaluate(ws, 3, 'document.querySelector("h1")?.textContent')
  console.log('landing title:', title)

  await evaluate(ws, 4, 'document.querySelector(".btn-primary")?.click()')
  await sleep(1400)

  const heading = await evaluate(ws, 5, 'document.querySelector("h1")?.textContent')
  const stats = await evaluate(ws, 6, 'Array.from(document.querySelectorAll(".stat .value")).map(el => el.textContent)')
  const roast = await evaluate(ws, 7, 'document.querySelector(".roast")?.textContent')
  const personality = await evaluate(ws, 8, 'document.querySelector(".identity h3")?.textContent')
  const save = await evaluate(ws, 9, 'document.querySelector(".save-banner")?.textContent')
  const insights = await evaluate(ws, 10, 'document.querySelectorAll(".insight").length')
  const rows = await evaluate(ws, 11, 'document.querySelectorAll("tbody tr").length')
  const percents = await evaluate(ws, 12, 'Array.from(document.querySelectorAll(".p-row strong")).map(el => el.textContent)')

  console.log({ heading, stats, personality, save, insights, rows, percents, roast })

  const shot = await send(ws, 13, 'Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: true,
  })
  writeFileSync('dashboard.png', Buffer.from(shot.data, 'base64'))

  await evaluate(
    ws,
    16,
    'Array.from(document.querySelectorAll("button")).find(b => b.textContent.trim() === "Reset")?.click()',
  )
  await sleep(400)
  const back = await evaluate(ws, 17, 'document.querySelector(".subtitle")?.textContent')
  console.log('after reset:', back)

  ws.close()
} finally {
  chrome.kill('SIGTERM')
}

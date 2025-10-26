import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

let ffmpegInstance: FFmpeg | null = null
let isLoaded = false

export async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance && isLoaded) {
    return ffmpegInstance
  }

  ffmpegInstance = new FFmpeg()
  
  ffmpegInstance.on('log', ({ message }) => {
    console.log('[FFmpeg]', message)
  })
  
  ffmpegInstance.on('progress', ({ progress, time }) => {
    console.log(`[FFmpeg] Progress: ${(progress * 100).toFixed(2)}% (${time}ms)`)
    // Dispatch custom event for progress tracking
    window.dispatchEvent(new CustomEvent('ffmpeg-progress', { 
      detail: { progress, time } 
    }))
  })

  try {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    await ffmpegInstance.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })
    isLoaded = true
    console.log('[FFmpeg] Loaded successfully')
  } catch (error) {
    console.error('[FFmpeg] Failed to load:', error)
    throw error
  }

  return ffmpegInstance
}

export interface VideoProcessingOptions {
  brightness?: number // 0-200 (100 = normal)
  contrast?: number // 0-200 (100 = normal)
  saturation?: number // 0-200 (100 = normal)
  blur?: number // 0-20
  hue?: number // 0-360
  grayscale?: number // 0-100
  speed?: number // 0.5-4.0
  volume?: number // 0-200
  startTime?: number
  endTime?: number
  width?: number
  height?: number
  fps?: number
}

export async function processVideo(
  inputFile: File,
  options: VideoProcessingOptions = {}
): Promise<Blob> {
  const ffmpeg = await getFFmpeg()
  
  // Write input file
  const inputData = new Uint8Array(await inputFile.arrayBuffer())
  await ffmpeg.writeFile('input.mp4', inputData)
  
  // Build FFmpeg filter command
  const filters: string[] = []
  
  // Color adjustments
  if (options.brightness !== undefined || options.contrast !== undefined || options.saturation !== undefined) {
    const b = ((options.brightness ?? 100) / 100).toFixed(2)
    const c = ((options.contrast ?? 100) / 100).toFixed(2)
    const s = ((options.saturation ?? 100) / 100).toFixed(2)
    filters.push(`eq=brightness=${(parseFloat(b) - 1).toFixed(2)}:contrast=${c}:saturation=${s}`)
  }
  
  // Blur
  if (options.blur && options.blur > 0) {
    filters.push(`boxblur=${options.blur}:${options.blur}`)
  }
  
  // Hue
  if (options.hue && options.hue !== 0) {
    filters.push(`hue=h=${options.hue}`)
  }
  
  // Grayscale
  if (options.grayscale && options.grayscale > 0) {
    const intensity = options.grayscale / 100
    filters.push(`hue=s=${(1 - intensity).toFixed(2)}`)
  }
  
  // Speed
  if (options.speed && options.speed !== 1) {
    const speed = options.speed
    filters.push(`setpts=${(1 / speed).toFixed(3)}*PTS`)
  }
  
  // Scale/Resolution
  if (options.width || options.height) {
    const w = options.width ?? -2
    const h = options.height ?? -2
    filters.push(`scale=${w}:${h}`)
  }
  
  // Build command arguments
  const args: string[] = ['-i', 'input.mp4']
  
  // Trim
  if (options.startTime !== undefined) {
    args.push('-ss', options.startTime.toString())
  }
  if (options.endTime !== undefined && options.startTime !== undefined) {
    args.push('-t', (options.endTime - options.startTime).toString())
  }
  
  // Apply filters
  if (filters.length > 0) {
    args.push('-vf', filters.join(','))
  }
  
  // Volume
  if (options.volume !== undefined && options.volume !== 100) {
    const vol = (options.volume / 100).toFixed(2)
    args.push('-af', `volume=${vol}`)
  }
  
  // FPS
  if (options.fps) {
    args.push('-r', options.fps.toString())
  }
  
  // Output settings
  args.push(
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '23',
    '-c:a', 'aac',
    '-b:a', '192k',
    'output.mp4'
  )
  
  // Execute FFmpeg
  console.log('[FFmpeg] Executing:', args.join(' '))
  await ffmpeg.exec(args)
  
  // Read output
  const data = await ffmpeg.readFile('output.mp4')
  const uint8Array = new Uint8Array(data as Uint8Array)
  const blob = new Blob([uint8Array.buffer], { type: 'video/mp4' })
  
  // Cleanup
  await ffmpeg.deleteFile('input.mp4')
  await ffmpeg.deleteFile('output.mp4')
  
  return blob
}

export async function extractThumbnail(videoFile: File, timeInSeconds: number = 0): Promise<string> {
  const ffmpeg = await getFFmpeg()
  
  const inputData = new Uint8Array(await videoFile.arrayBuffer())
  await ffmpeg.writeFile('input.mp4', inputData)
  
  await ffmpeg.exec([
    '-i', 'input.mp4',
    '-ss', timeInSeconds.toString(),
    '-vframes', '1',
    '-vf', 'scale=320:-1',
    'thumbnail.jpg'
  ])
  
  const data = await ffmpeg.readFile('thumbnail.jpg')
  const uint8Array = new Uint8Array(data as Uint8Array)
  const blob = new Blob([uint8Array.buffer], { type: 'image/jpeg' })
  const url = URL.createObjectURL(blob)
  
  await ffmpeg.deleteFile('input.mp4')
  await ffmpeg.deleteFile('thumbnail.jpg')
  
  return url
}

export async function mergeVideos(videos: { file: File; startTime: number }[]): Promise<Blob> {
  const ffmpeg = await getFFmpeg()
  
  // Write all video files
  const fileList: string[] = []
  for (let i = 0; i < videos.length; i++) {
    const fileName = `input${i}.mp4`
    const data = new Uint8Array(await videos[i].file.arrayBuffer())
    await ffmpeg.writeFile(fileName, data)
    fileList.push(`file '${fileName}'`)
  }
  
  // Create concat file
  const concatContent = fileList.join('\n')
  await ffmpeg.writeFile('concat.txt', new TextEncoder().encode(concatContent))
  
  // Merge videos
  await ffmpeg.exec([
    '-f', 'concat',
    '-safe', '0',
    '-i', 'concat.txt',
    '-c', 'copy',
    'output.mp4'
  ])
  
  const data = await ffmpeg.readFile('output.mp4')
  const uint8Array = new Uint8Array(data as Uint8Array)
  const blob = new Blob([uint8Array.buffer], { type: 'video/mp4' })
  
  // Cleanup
  for (let i = 0; i < videos.length; i++) {
    await ffmpeg.deleteFile(`input${i}.mp4`)
  }
  await ffmpeg.deleteFile('concat.txt')
  await ffmpeg.deleteFile('output.mp4')
  
  return blob
}

export async function exportVideo(
  clips: Array<{ file: File; options: VideoProcessingOptions }>,
  format: 'mp4' | 'webm' | 'gif' = 'mp4',
  quality: '720p' | '1080p' | '4k' = '1080p'
): Promise<Blob> {
  const ffmpeg = await getFFmpeg()
  
  // Process each clip with its options
  const processedClips: string[] = []
  for (let i = 0; i < clips.length; i++) {
    const { file, options } = clips[i]
    const inputData = new Uint8Array(await file.arrayBuffer())
    await ffmpeg.writeFile(`clip${i}.mp4`, inputData)
    processedClips.push(`clip${i}.mp4`)
  }
  
  // Set resolution based on quality
  const resolutions = {
    '720p': { width: 1280, height: 720 },
    '1080p': { width: 1920, height: 1080 },
    '4k': { width: 3840, height: 2160 }
  }
  const res = resolutions[quality]
  
  // If multiple clips, concatenate them first
  let finalInput = processedClips[0]
  if (processedClips.length > 1) {
    const concatList = processedClips.map(f => `file '${f}'`).join('\n')
    await ffmpeg.writeFile('concat.txt', new TextEncoder().encode(concatList))
    
    await ffmpeg.exec([
      '-f', 'concat',
      '-safe', '0',
      '-i', 'concat.txt',
      '-c', 'copy',
      'merged.mp4'
    ])
    finalInput = 'merged.mp4'
  }
  
  // Export with format-specific settings
  const outputFile = `output.${format}`
  if (format === 'gif') {
    await ffmpeg.exec([
      '-i', finalInput,
      '-vf', `fps=15,scale=${res.width}:-1:flags=lanczos`,
      '-c:v', 'gif',
      outputFile
    ])
  } else if (format === 'webm') {
    await ffmpeg.exec([
      '-i', finalInput,
      '-vf', `scale=${res.width}:${res.height}`,
      '-c:v', 'libvpx-vp9',
      '-crf', '30',
      '-b:v', '2M',
      '-c:a', 'libopus',
      outputFile
    ])
  } else {
    await ffmpeg.exec([
      '-i', finalInput,
      '-vf', `scale=${res.width}:${res.height}`,
      '-c:v', 'libx264',
      '-preset', 'slow',
      '-crf', '18',
      '-c:a', 'aac',
      '-b:a', '320k',
      outputFile
    ])
  }
  
  const data = await ffmpeg.readFile(outputFile)
  const mimeTypes = {
    mp4: 'video/mp4',
    webm: 'video/webm',
    gif: 'image/gif'
  }
  const uint8Array = new Uint8Array(data as Uint8Array)
  const blob = new Blob([uint8Array.buffer], { type: mimeTypes[format] })
  
  // Cleanup
  for (const clip of processedClips) {
    await ffmpeg.deleteFile(clip)
  }
  if (processedClips.length > 1) {
    await ffmpeg.deleteFile('concat.txt')
    await ffmpeg.deleteFile('merged.mp4')
  }
  await ffmpeg.deleteFile(outputFile)
  
  return blob
}

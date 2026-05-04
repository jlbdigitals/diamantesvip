#!/usr/bin/env node
/**
 * Media Optimizer Script
 * 
 * Convierte imágenes a WebP y videos a formatos optimizados (WebM VP9 + MP4 H.264)
 * 
 * Uso:
 *   npx tsx scripts/optimize-media.ts [opciones]
 * 
 * Opciones:
 *   --images <dir>     Directorio de imágenes a convertir (default: public/uploads)
 *   --videos <dir>     Directorio de videos a convertir (default: public/videos)
 *   --quality <0-100>  Calidad WebP (default: 85)
 *   --width <px>       Ancho máximo para imágenes (default: 1920)
 *   --output <dir>     Directorio de salida (default: public/optimized)
 *   --skip-existing    Saltar archivos ya convertidos
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

// ─── Configuración ──────────────────────────────────────────────────────────

const args = process.argv.slice(2)

function getArg(flag: string, defaultValue: string): string {
  const idx = args.indexOf(flag)
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultValue
}

function hasFlag(flag: string): boolean {
  return args.includes(flag)
}

const CONFIG = {
  imagesDir: getArg('--images', 'public/uploads'),
  videosDir: getArg('--videos', 'public/videos'),
  outputDir: getArg('--output', 'public/optimized'),
  quality: parseInt(getArg('--quality', '85')),
  maxWidth: parseInt(getArg('--width', '1920')),
  skipExisting: hasFlag('--skip-existing'),
}

// Extensiones soportadas
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp']
const VIDEO_EXTS = ['.mp4', '.mov', '.avi', '.mkv', '.webm']

// ─── Utilidades ─────────────────────────────────────────────────────────────

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function getFileSize(filePath: string): string {
  const bytes = fs.statSync(filePath).size
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

// ─── Conversión de Imágenes ─────────────────────────────────────────────────

async function convertImage(inputPath: string, outputDir: string): Promise<{ success: boolean; savings?: number }> {
  const ext = path.extname(inputPath).toLowerCase()
  const baseName = path.basename(inputPath, ext)
  const outputPath = path.join(outputDir, `${baseName}.webp`)

  if (CONFIG.skipExisting && fs.existsSync(outputPath)) {
    console.log(`  ⏭️  Saltando (ya existe): ${path.basename(outputPath)}`)
    return { success: true }
  }

  try {
    const inputSize = fs.statSync(inputPath).size

    // Usar sharp para conversión
    await sharp(inputPath)
      .resize(CONFIG.maxWidth, null, { withoutEnlargement: true })
      .webp({ 
        quality: CONFIG.quality,
        effort: 6, // 0-6, más alto = mejor compresión pero más lento
      })
      .toFile(outputPath)

    const outputSize = fs.statSync(outputPath).size
    const savings = inputSize - outputSize
    const savingsPercent = ((savings / inputSize) * 100).toFixed(1)

    console.log(`  ✅ ${baseName}.webp`)
    console.log(`     ${formatBytes(inputSize)} → ${formatBytes(outputSize)} (${savingsPercent}% menor)`)

    return { success: true, savings }
  } catch (err) {
    console.error(`  ❌ Error convirtiendo ${path.basename(inputPath)}:`, err instanceof Error ? err.message : err)
    return { success: false }
  }
}

// ─── Conversión de Videos ───────────────────────────────────────────────────

function convertVideo(inputPath: string, outputDir: string): { success: boolean; outputs: string[]; savings?: number } {
  const ext = path.extname(inputPath).toLowerCase()
  const baseName = path.basename(inputPath, ext)
  const webmPath = path.join(outputDir, `${baseName}.webm`)
  const mp4Path = path.join(outputDir, `${baseName}_opt.mp4`)

  const outputs: string[] = []
  let totalInputSize = 0
  let totalOutputSize = 0

  if (!fs.existsSync(inputPath) || fs.statSync(inputPath).size === 0) {
    console.log(`  ⚠️  Archivo vacío o inexistente: ${path.basename(inputPath)}`)
    return { success: false, outputs: [] }
  }

  totalInputSize = fs.statSync(inputPath).size

  try {
    // 1. Convertir a WebM (VP9) - mejor compresión
    if (!CONFIG.skipExisting || !fs.existsSync(webmPath)) {
      console.log(`  🎬 Convirtiendo a WebM (VP9)...`)
      execSync(
        `ffmpeg -y -i "${inputPath}" -c:v libvpx-vp9 -crf 30 -b:v 0 -deadline good -cpu-used 2 ` +
        `-row-mt 1 -c:a libopus -b:a 96k "${webmPath}"`,
        { stdio: 'pipe' }
      )
      outputs.push(webmPath)
      if (fs.existsSync(webmPath)) {
        totalOutputSize += fs.statSync(webmPath).size
        console.log(`     ✅ WebM: ${getFileSize(webmPath)}`)
      }
    } else {
      console.log(`  ⏭️  WebM ya existe: ${baseName}.webm`)
    }

    // 2. Optimizar MP4 (H.264) - máxima compatibilidad
    if (!CONFIG.skipExisting || !fs.existsSync(mp4Path)) {
      console.log(`  🎬 Optimizando MP4 (H.264)...`)
      execSync(
        `ffmpeg -y -i "${inputPath}" -c:v libx264 -crf 23 -preset medium ` +
        `-movflags +faststart -c:a aac -b:a 128k -pix_fmt yuv420p "${mp4Path}"`,
        { stdio: 'pipe' }
      )
      outputs.push(mp4Path)
      if (fs.existsSync(mp4Path)) {
        totalOutputSize += fs.statSync(mp4Path).size
        console.log(`     ✅ MP4: ${getFileSize(mp4Path)}`)
      }
    } else {
      console.log(`  ⏭️  MP4 ya existe: ${baseName}_opt.mp4`)
    }

    const savings = totalInputSize - (totalOutputSize / outputs.length || 0)
    
    return { success: outputs.length > 0, outputs, savings }
  } catch (err) {
    console.error(`  ❌ Error convirtiendo video ${path.basename(inputPath)}:`, err instanceof Error ? err.message : err)
    return { success: false, outputs: [] }
  }
}

// ─── Descargar imágenes remotas ─────────────────────────────────────────────

async function downloadAndConvert(url: string, outputDir: string, index: number): Promise<{ success: boolean }> {
  const fileName = `escort_${String(index).padStart(3, '0')}.webp`
  const outputPath = path.join(outputDir, fileName)

  if (CONFIG.skipExisting && fs.existsSync(outputPath)) {
    console.log(`  ⏭️  Saltando (ya existe): ${fileName}`)
    return { success: true }
  }

  try {
    console.log(`  ⬇️  Descargando imagen ${index + 1}...`)
    
    // Descargar con curl
    const tempPath = path.join(outputDir, `temp_${index}.jpg`)
    execSync(`curl -sL "${url}" -o "${tempPath}"`, { stdio: 'pipe' })

    if (!fs.existsSync(tempPath) || fs.statSync(tempPath).size === 0) {
      console.log(`  ⚠️  No se pudo descargar la imagen`)
      return { success: false }
    }

    const inputSize = fs.statSync(tempPath).size

    // Convertir a WebP
    await sharp(tempPath)
      .resize(CONFIG.maxWidth, null, { withoutEnlargement: true })
      .webp({ 
        quality: CONFIG.quality,
        effort: 6,
      })
      .toFile(outputPath)

    const outputSize = fs.statSync(outputPath).size
    const savingsPercent = (((inputSize - outputSize) / inputSize) * 100).toFixed(1)

    // Limpiar temporal
    fs.unlinkSync(tempPath)

    console.log(`  ✅ ${fileName}`)
    console.log(`     ${formatBytes(inputSize)} → ${formatBytes(outputSize)} (${savingsPercent}% menor)`)

    return { success: true }
  } catch (err) {
    console.error(`  ❌ Error:`, err instanceof Error ? err.message : err)
    return { success: false }
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Media Optimizer')
  console.log('═══════════════════════════════════════════════════════════════\n')

  ensureDir(CONFIG.outputDir)

  // ─── Procesar Imágenes Locales ────────────────────────────────────────────
  const imagesOutputDir = path.join(CONFIG.outputDir, 'images')
  ensureDir(imagesOutputDir)

  if (fs.existsSync(CONFIG.imagesDir)) {
    const imageFiles = fs.readdirSync(CONFIG.imagesDir)
      .filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
      .map(f => path.join(CONFIG.imagesDir, f))

    if (imageFiles.length > 0) {
      console.log(`📸 Procesando ${imageFiles.length} imagen(es) locales...`)
      let totalSavings = 0
      let successCount = 0

      for (const file of imageFiles) {
        const result = await convertImage(file, imagesOutputDir)
        if (result.success) {
          successCount++
          if (result.savings && result.savings > 0) totalSavings += result.savings
        }
      }

      console.log(`\n   📊 Resumen imágenes: ${successCount}/${imageFiles.length} convertidas`)
      if (totalSavings > 0) {
        console.log(`   💾 Ahorro total: ${formatBytes(totalSavings)}\n`)
      }
    } else {
      console.log(`📸 No se encontraron imágenes en ${CONFIG.imagesDir}\n`)
    }
  }

  // ─── Procesar Videos ──────────────────────────────────────────────────────
  const videosOutputDir = path.join(CONFIG.outputDir, 'videos')
  ensureDir(videosOutputDir)

  if (fs.existsSync(CONFIG.videosDir)) {
    const videoFiles = fs.readdirSync(CONFIG.videosDir)
      .filter(f => VIDEO_EXTS.includes(path.extname(f).toLowerCase()))
      .map(f => path.join(CONFIG.videosDir, f))
      .filter(f => fs.statSync(f).size > 0) // Skip empty files

    if (videoFiles.length > 0) {
      console.log(`🎬 Procesando ${videoFiles.length} video(s)...`)
      let successCount = 0

      for (const file of videoFiles) {
        console.log(`\n  📁 ${path.basename(file)} (${getFileSize(file)})`)
        const result = convertVideo(file, videosOutputDir)
        if (result.success) successCount++
      }

      console.log(`\n   📊 Resumen videos: ${successCount}/${videoFiles.length} convertidos\n`)
    } else {
      console.log(`🎬 No se encontraron videos válidos en ${CONFIG.videosDir}\n`)
    }
  }

  // ─── Descargar fotos del seed (URLs externas) ────────────────────────────
  console.log('🌐 ¿Deseas descargar y convertir las fotos del seed?')
  console.log('   Para hacerlo, corre el script con: --seed-photos\n')

  if (hasFlag('--seed-photos')) {
    // Importar las URLs del seed
    const seedPhotosDir = path.join(CONFIG.outputDir, 'seed-photos')
    ensureDir(seedPhotosDir)

    console.log('📥 Descargando fotos del seed...')
    
    // Aquí deberíamos importar las URLs del seed.ts
    // Por ahora, dejamos un placeholder
    console.log('   ℹ️  Las URLs del seed están en scripts/seed.ts')
    console.log('   ℹ️  Copia las URLs y pásalas manualmente o usa --urls\n')
  }

  console.log('✅ Proceso completado')
  console.log(`📁 Archivos guardados en: ${CONFIG.outputDir}`)
  console.log('\n💡 Para usar las imágenes WebP en el sitio:')
  console.log('   <picture>')
  console.log('     <source srcSet="/optimized/images/foto.webp" type="image/webp" />')
  console.log('     <img src="/optimized/images/foto.jpg" alt="..." />')
  console.log('   </picture>')
  console.log('\n💡 Para usar los videos optimizados:')
  console.log('   <video>')
  console.log('     <source src="/optimized/videos/video.webm" type="video/webm" />')
  console.log('     <source src="/optimized/videos/video_opt.mp4" type="video/mp4" />')
  console.log('   </video>')
}

main().catch(console.error)

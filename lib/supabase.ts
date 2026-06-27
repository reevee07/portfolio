import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? ''
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export async function getGalleryImages(): Promise<string[]> {
  if (!url || !key) return []
  try {
    const supabase = createClient(url, key)
    const { data, error } = await supabase.storage.from('gallery').list('', {
      sortBy: { column: 'created_at', order: 'desc' }
    })
    if (error || !data) return []
    return data
      .filter(f => f.name.match(/\.(jpg|jpeg|png|webp|avif)$/i))
      .map(f => supabase.storage.from('gallery').getPublicUrl(f.name).data.publicUrl)
  } catch { return [] }
}

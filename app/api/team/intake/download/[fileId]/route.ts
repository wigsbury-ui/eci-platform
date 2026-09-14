import { NextRequest, NextResponse } from 'next/server'
import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isStaff } from '@/lib/auth/roles'
import { INTAKE_BUCKET } from '@/lib/intake/config'

type RouteContext = { params: Promise<{ fileId: string }> }

async function assertStaff() {
  if (!hasSupabaseEnv()) return null
  const supabase = await createClient()
  if (!supabase) return null
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile?.role || !isStaff(profile.role)) return null
  return { supabase, userId: user.id }
}

export async function GET(request: NextRequest, context: RouteContext) {
  const staff = await assertStaff()
  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { fileId } = await context.params
  const admin = createAdminClient()
  if (!admin) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 503 })
  }

  const { data: file, error } = await admin
    .from('document_intake_files')
    .select('id, storage_path, file_name, mime_type')
    .eq('id', fileId)
    .single()

  if (error || !file) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  const { data: blob, error: downloadError } = await admin.storage
    .from(INTAKE_BUCKET)
    .download(file.storage_path)

  if (downloadError || !blob) {
    console.error('intake download', downloadError)
    return NextResponse.json({ error: 'Could not read file' }, { status: 500 })
  }

  const bytes = await blob.arrayBuffer()
  const contentType = file.mime_type || 'application/octet-stream'

  return new NextResponse(bytes, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(file.file_name)}"`,
      'Cache-Control': 'private, no-store',
    },
  })
}

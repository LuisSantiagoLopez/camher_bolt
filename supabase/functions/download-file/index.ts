import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DownloadRequest {
  key: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false
        }
      }
    )

    // Parse request body
    const { key }: DownloadRequest = await req.json()

    // Validate key
    if (!key) {
      throw new Error('Missing required field: key')
    }

    // Download file
    const { data, error } = await supabaseClient
      .storage
      .from('files')
      .download(key)

    if (error) throw error
    if (!data) throw new Error('No data received from storage')

    // Get file name from key
    const fileName = key.split('/').pop() || 'downloaded-file'

    // Create response with file data
    return new Response(
      data,
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Cache-Control': 'no-cache'
        },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Download error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'File download failed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
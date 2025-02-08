import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PartFilter {
  status?: number | { between?: number[] }
  providerID?: string
  reqDate?: { between?: string[] }
  [key: string]: any
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false
        }
      }
    )

    const { filter }: { filter?: PartFilter } = await req.json()

    // Build query
    const query = supabaseClient
      .from('parts')
      .select(`
        *,
        unit:units(id, name),
        provider:providers(id, name, emails)
      `)

    // Apply filters if provided
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined) {
          if (typeof value === 'object' && value.between) {
            query.gte(`${key}`, value.between[0])
                .lte(`${key}`, value.between[1])
          } else {
            query.eq(key, value)
          }
        }
      })
    }

    const { data, error } = await query

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        data,
        message: 'Parts retrieved successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Query error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to retrieve parts'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})